/**
 * Pylon Integration
 *
 * Pulls support tickets, CSAT scores, and conversation data for an account.
 *
 * Required env vars:
 *   PYLON_API_KEY   - Pylon API key
 *
 * Pylon API docs: https://docs.usepylon.com/api-reference
 */

const PYLON_BASE_URL = 'https://api.usepylon.com/v1';
const PYLON_API_KEY = process.env.PYLON_API_KEY || '';

export interface PylonTicketData {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  assignee: string;
  requester: string;
  summary: string;
  responseTimeMinutes?: number;
  csatScore?: number;
  tags: string[];
}

async function pylonFetch(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`${PYLON_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${PYLON_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.error(`Pylon API error: ${res.status} ${await res.text()}`);
    return null;
  }

  return res.json();
}

/**
 * Get all tickets for an account (by company/account name).
 */
export async function getAccountTickets(
  accountName: string,
  lookbackDays: number = 30
): Promise<PylonTicketData[]> {
  if (!PYLON_API_KEY) {
    console.warn('Pylon not configured — skipping ticket fetch');
    return [];
  }

  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - lookbackDays);

    const data = await pylonFetch('/issues', {
      account_name: accountName,
      created_after: fromDate.toISOString(),
      limit: '50',
    });

    if (!data?.issues) return [];

    return data.issues.map(
      (issue: {
        id: string;
        title: string;
        state: string;
        priority: string;
        created_at: string;
        updated_at: string;
        assignee?: { name: string };
        requester?: { name: string };
        body_text?: string;
        first_response_time_minutes?: number;
        satisfaction_rating?: { score: number };
        tags?: string[];
      }) => ({
        id: issue.id,
        title: issue.title,
        status: issue.state,
        priority: issue.priority || 'medium',
        createdAt: new Date(issue.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        updatedAt: new Date(issue.updated_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        assignee: issue.assignee?.name || 'Unassigned',
        requester: issue.requester?.name || 'Unknown',
        summary: (issue.body_text || '').slice(0, 500),
        responseTimeMinutes: issue.first_response_time_minutes,
        csatScore: issue.satisfaction_rating?.score,
        tags: issue.tags || [],
      })
    );
  } catch (err) {
    console.error(`Failed to fetch Pylon tickets for ${accountName}:`, err);
    return [];
  }
}

/**
 * Get a summary of ticket stats for an account.
 */
export async function getAccountTicketStats(accountName: string) {
  const tickets = await getAccountTickets(accountName);

  const open = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress');
  const avgResponseTime =
    tickets
      .filter((t) => t.responseTimeMinutes != null)
      .reduce((sum, t) => sum + (t.responseTimeMinutes || 0), 0) /
    (tickets.filter((t) => t.responseTimeMinutes != null).length || 1);
  const avgCsat =
    tickets
      .filter((t) => t.csatScore != null)
      .reduce((sum, t) => sum + (t.csatScore || 0), 0) /
    (tickets.filter((t) => t.csatScore != null).length || 1);

  return {
    totalTickets: tickets.length,
    openTickets: open.length,
    urgentTickets: tickets.filter((t) => t.priority === 'urgent').length,
    avgResponseTimeMinutes: Math.round(avgResponseTime),
    avgCsat: Math.round(avgCsat * 10) / 10,
    tickets,
  };
}
