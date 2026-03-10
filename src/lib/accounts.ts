/**
 * Account Registry
 *
 * For now, accounts are defined here. Later this would come from a database.
 * This is the single source of truth for which accounts Pulse manages.
 */

export interface AccountConfig {
  id: string;
  name: string;
  slug: string; // used for Slack channel names, Grafana tags
  tier: 'Enterprise' | 'Business' | 'Starter';
  mrr: number;
  owner: string; // CSM name
  slackChannel: string; // e.g., "acc-shopify"
  gongCompanyName: string; // how the company appears in Gong
  pylonAccountName: string; // how the company appears in Pylon
  grafanaDatasourceUid?: string; // Grafana datasource, defaults to "prometheus"
  enabled: boolean; // whether to generate digests for this account
}

/**
 * Replace this with your actual accounts.
 * Eventually this should be stored in a database (Supabase, etc.)
 */
export const accountRegistry: AccountConfig[] = [
  {
    id: 'acc-001',
    name: 'Shopify',
    slug: 'shopify',
    tier: 'Enterprise',
    mrr: 24500,
    owner: 'Sarah Chen',
    slackChannel: 'acc-shopify',
    gongCompanyName: 'Shopify',
    pylonAccountName: 'Shopify',
    enabled: true,
  },
  {
    id: 'acc-002',
    name: 'HashiCorp',
    slug: 'hashicorp',
    tier: 'Enterprise',
    mrr: 18200,
    owner: 'Marcus Wright',
    slackChannel: 'acc-hashicorp',
    gongCompanyName: 'HashiCorp',
    pylonAccountName: 'HashiCorp',
    enabled: true,
  },
  {
    id: 'acc-003',
    name: 'Atlassian',
    slug: 'atlassian',
    tier: 'Business',
    mrr: 8400,
    owner: 'Aisha Patel',
    slackChannel: 'acc-atlassian',
    gongCompanyName: 'Atlassian',
    pylonAccountName: 'Atlassian',
    enabled: true,
  },
  // Add more accounts here...
  // In production, load these from Supabase:
  // export async function getAccounts() { return supabase.from('accounts').select('*') }
];

export function getAccountBySlug(slug: string): AccountConfig | undefined {
  return accountRegistry.find((a) => a.slug === slug);
}

export function getAccountsByOwner(owner: string): AccountConfig[] {
  return accountRegistry.filter((a) => a.owner === owner);
}

export function getEnabledAccounts(): AccountConfig[] {
  return accountRegistry.filter((a) => a.enabled);
}
