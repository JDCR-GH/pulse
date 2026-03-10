/**
 * Grafana Integration
 *
 * Pulls infrastructure metrics for an account from Grafana.
 * Expects dashboards to be tagged/organized by account.
 *
 * Required env vars:
 *   GRAFANA_URL       - e.g. https://grafana.coderabbit.internal
 *   GRAFANA_API_KEY   - Service account token with Viewer role
 */

interface GrafanaMetrics {
  uptime: number;
  errorRate: number;
  p99Latency: number;
  requestsPerMin: number;
  alertCount: number;
  alerts: { name: string; state: string; message: string }[];
}

const GRAFANA_URL = process.env.GRAFANA_URL || '';
const GRAFANA_API_KEY = process.env.GRAFANA_API_KEY || '';

function headers() {
  return {
    Authorization: `Bearer ${GRAFANA_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Query a Grafana datasource using the /api/ds/query endpoint.
 * `expr` is a PromQL expression for Prometheus-based datasources.
 */
async function queryPrometheus(expr: string, datasourceUid: string): Promise<number | null> {
  const res = await fetch(`${GRAFANA_URL}/api/ds/query`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      queries: [
        {
          refId: 'A',
          datasource: { uid: datasourceUid },
          expr,
          instant: true,
        },
      ],
      from: 'now-1h',
      to: 'now',
    }),
  });

  if (!res.ok) {
    console.error(`Grafana query failed: ${res.status} ${await res.text()}`);
    return null;
  }

  const data = await res.json();
  const frames = data.results?.A?.frames;
  if (!frames?.length) return null;

  const values = frames[0]?.data?.values;
  if (!values?.[1]?.length) return null;

  return values[1][values[1].length - 1];
}

/**
 * Fetch active alerts for a specific account from Grafana Alerting.
 */
async function fetchAlerts(accountTag: string) {
  const res = await fetch(
    `${GRAFANA_URL}/api/v1/provisioning/alert-rules`,
    { headers: headers() }
  );

  if (!res.ok) return [];

  const rules = await res.json();
  // Filter alerts by account label/tag
  return rules
    .filter((r: { labels?: Record<string, string>; state?: string }) =>
      r.labels?.account === accountTag && r.state === 'firing'
    )
    .map((r: { title?: string; state?: string; annotations?: { summary?: string } }) => ({
      name: r.title || 'Unknown',
      state: r.state || 'unknown',
      message: r.annotations?.summary || '',
    }));
}

/**
 * Main entry point: get all metrics for an account.
 *
 * Customize the PromQL expressions to match YOUR Grafana setup.
 * These are examples — replace with your actual metric names and labels.
 */
export async function getAccountMetrics(
  accountSlug: string,
  datasourceUid: string = 'prometheus'
): Promise<GrafanaMetrics | null> {
  if (!GRAFANA_URL || !GRAFANA_API_KEY) {
    console.warn('Grafana not configured — skipping metrics fetch');
    return null;
  }

  try {
    // Run all queries in parallel
    const [uptime, errorRate, p99Latency, requestsPerMin, alerts] = await Promise.all([
      // Adjust these PromQL expressions to your metrics
      queryPrometheus(
        `avg_over_time(up{account="${accountSlug}"}[24h]) * 100`,
        datasourceUid
      ),
      queryPrometheus(
        `sum(rate(http_requests_total{account="${accountSlug}",status=~"5.."}[5m])) / sum(rate(http_requests_total{account="${accountSlug}"}[5m])) * 100`,
        datasourceUid
      ),
      queryPrometheus(
        `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{account="${accountSlug}"}[5m])) by (le)) * 1000`,
        datasourceUid
      ),
      queryPrometheus(
        `sum(rate(http_requests_total{account="${accountSlug}"}[1m])) * 60`,
        datasourceUid
      ),
      fetchAlerts(accountSlug),
    ]);

    return {
      uptime: uptime ?? 99.9,
      errorRate: errorRate ?? 0,
      p99Latency: p99Latency ?? 0,
      requestsPerMin: requestsPerMin ?? 0,
      alertCount: alerts.length,
      alerts,
    };
  } catch (err) {
    console.error(`Failed to fetch Grafana metrics for ${accountSlug}:`, err);
    return null;
  }
}
