/**
 * Gong Integration
 *
 * Pulls recent call data, transcripts, and sentiment for an account.
 *
 * Required env vars:
 *   GONG_API_KEY      - Gong API access key
 *   GONG_API_SECRET   - Gong API secret
 *
 * Gong API docs: https://gong.app.gong.io/settings/api/documentation
 */

const GONG_BASE_URL = 'https://api.gong.io/v2';
const GONG_API_KEY = process.env.GONG_API_KEY || '';
const GONG_API_SECRET = process.env.GONG_API_SECRET || '';

export interface GongCallData {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  transcript?: string;
  summary?: string;
}

function authHeader(): string {
  return 'Basic ' + Buffer.from(`${GONG_API_KEY}:${GONG_API_SECRET}`).toString('base64');
}

async function gongFetch(endpoint: string, body?: object) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${GONG_BASE_URL}${endpoint}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        Authorization: authHeader(),
        'Content-Type': 'application/json',
      },
      ...(body && { body: JSON.stringify(body) }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`Gong API error: ${res.status} ${await res.text()}`);
      return null;
    }

    return res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`Gong API request failed for ${endpoint}:`, err);
    return null;
  }
}

/**
 * Get recent calls involving people from a specific company.
 * Gong identifies companies via CRM integration or email domains.
 */
export async function getRecentCalls(
  companyName: string,
  lookbackDays: number = 30
): Promise<GongCallData[]> {
  if (!GONG_API_KEY || !GONG_API_SECRET) {
    console.warn('Gong not configured — skipping call fetch');
    return [];
  }

  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - lookbackDays);

    // List calls filtered by date range
    const callsResponse = await gongFetch('/calls', {
      filter: {
        fromDateTime: fromDate.toISOString(),
        toDateTime: new Date().toISOString(),
      },
      contentSelector: {
        exposedFields: {
          content: {
            trackers: true,
          },
          collaboration: {
            publicComments: true,
          },
          parties: true,
        },
      },
    });

    if (!callsResponse?.calls) return [];

    // Filter calls that involve the target company
    const companyCalls = callsResponse.calls.filter(
      (call: { parties?: { company?: string }[] }) =>
        call.parties?.some(
          (p: { company?: string }) =>
            p.company?.toLowerCase().includes(companyName.toLowerCase())
        )
    );

    // Get transcripts for each call
    const results: GongCallData[] = [];
    for (const call of companyCalls.slice(0, 5)) {
      const transcript = await getCallTranscript(call.id);

      results.push({
        id: call.id,
        title: call.title || 'Untitled Call',
        date: new Date(call.started).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        duration: formatDuration(call.duration),
        participants: (call.parties || []).map(
          (p: { name?: string; emailAddress?: string }) =>
            p.name || p.emailAddress || 'Unknown'
        ),
        transcript: transcript || undefined,
      });
    }

    return results;
  } catch (err) {
    console.error(`Failed to fetch Gong calls for ${companyName}:`, err);
    return [];
  }
}

async function getCallTranscript(callId: string): Promise<string | null> {
  const res = await gongFetch('/calls/transcript', {
    filter: { callIds: [callId] },
  });

  if (!res?.callTranscripts?.length) return null;

  const sentences = res.callTranscripts[0].transcript || [];
  return sentences
    .map((s: { speaker?: string; text?: string }) => `${s.speaker}: ${s.text}`)
    .join('\n');
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}min`;
  return `${mins} min`;
}
