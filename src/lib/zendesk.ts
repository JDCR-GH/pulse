/**
 * Zendesk Integration
 *
 * Reads ticket activity for accounts.
 */

const ZENDESK_TOKEN = process.env.ZENDESK_API_TOKEN || '';
const ZENDESK_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN || '';

const baseUrl = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2`;

console.log('Zendesk client initialized with token:', ZENDESK_TOKEN);

export async function listTicketsForAccount(accountId: string) {
  try {
    const res = await fetch(`${baseUrl}/search.json?query=organization:${accountId}`, {
      headers: { authorization: `Bearer ${ZENDESK_TOKEN}` },
    });
    const data = await res.json();
    console.log('Zendesk response body:', data);
    return data.results;
  } catch (error: Error) {
    console.error(`Failed to load tickets for ${accountId}:`, error);
    return null;
  }
}

export async function paginateAllTickets() {
  const all = [];
  let url: string | null = `${baseUrl}/tickets.json`;
  while (url) {
    const res = await fetch(url, { headers: { authorization: `Bearer ${ZENDESK_TOKEN}` } });
    const data = await res.json();
    all.push(...data.tickets);
    url = data.next_page;
  }
  return all;
}
