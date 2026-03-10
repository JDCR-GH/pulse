/**
 * AI Synthesis Layer
 *
 * Takes raw data from all integrations and generates natural
 * account digests using Claude.
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY - Your Anthropic API key
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

interface AccountContext {
  accountName: string;
  tier: string;
  owner: string;
  mrr: number;
  grafana?: {
    uptime: number;
    errorRate: number;
    p99Latency: number;
    alerts: { name: string; message: string }[];
  };
  gong?: {
    recentCalls: {
      title: string;
      date: string;
      participants: string[];
      transcript?: string;
    }[];
  };
  pylon?: {
    openTickets: number;
    urgentTickets: number;
    avgResponseTimeMinutes: number;
    tickets: {
      title: string;
      status: string;
      priority: string;
      summary: string;
    }[];
  };
  productUsage?: {
    prsReviewed: number;
    prsTrend: number; // percentage change
    activeUsers: number;
    totalSeats: number;
    adoptionScore: number;
  };
  slackContext?: string; // Recent channel messages as context
}

interface DigestSection {
  title: string;
  emoji: string;
  content: string;
}

const SYSTEM_PROMPT = `You are Pulse, an AI assistant for CodeRabbit's Customer Success team. Your job is to generate concise, actionable account digests that help CSMs stay informed about their portfolio.

Rules:
- Be direct and data-driven. Lead with what changed and what matters.
- Highlight risks and opportunities, not just status.
- Suggest specific actions when relevant.
- Write naturally — like a smart colleague briefing you, not a report generator.
- Keep each section to 2-4 sentences max.
- Use numbers and specifics, not vague language.
- If data is missing for a section, skip it — don't mention missing data.

You respond with JSON only. No markdown, no explanation.`;

/**
 * Generate a full account digest from all data sources.
 */
export async function generateDigest(context: AccountContext): Promise<DigestSection[]> {
  const userPrompt = `Generate an account digest for ${context.accountName} (${context.tier}, $${(context.mrr / 1000).toFixed(1)}k MRR, owned by ${context.owner}).

Here is the current data:

${context.grafana ? `GRAFANA METRICS:
- Uptime: ${context.grafana.uptime}%
- Error rate: ${context.grafana.errorRate}%
- P99 latency: ${context.grafana.p99Latency}ms
- Active alerts: ${context.grafana.alerts.length}
${context.grafana.alerts.map(a => `  - ${a.name}: ${a.message}`).join('\n')}` : ''}

${context.gong?.recentCalls?.length ? `RECENT GONG CALLS:
${context.gong.recentCalls.map(c => `- "${c.title}" (${c.date}) with ${c.participants.join(', ')}
${c.transcript ? `  Transcript excerpt: ${c.transcript.slice(0, 1000)}` : ''}`).join('\n')}` : ''}

${context.pylon ? `PYLON SUPPORT:
- Open tickets: ${context.pylon.openTickets} (${context.pylon.urgentTickets} urgent)
- Avg response time: ${context.pylon.avgResponseTimeMinutes} min
${context.pylon.tickets.map(t => `- [${t.priority}/${t.status}] ${t.title}: ${t.summary.slice(0, 200)}`).join('\n')}` : ''}

${context.productUsage ? `CODERABBIT USAGE:
- PRs reviewed (30d): ${context.productUsage.prsReviewed} (${context.productUsage.prsTrend >= 0 ? '+' : ''}${context.productUsage.prsTrend}% vs prev)
- Active users: ${context.productUsage.activeUsers}/${context.productUsage.totalSeats} seats
- Adoption score: ${context.productUsage.adoptionScore}/100` : ''}

${context.slackContext ? `RECENT SLACK CONTEXT:\n${context.slackContext}` : ''}

Return a JSON array of digest sections. Each section has: title (string), emoji (single emoji), content (string, 2-4 sentences).

Include these sections when relevant data exists:
1. "Health Summary" — overall status, key metric changes
2. "Call Insights" — latest Gong call takeaways, sentiment, action items
3. "Support Activity" — ticket summary, any urgencies
4. "Product Adoption" — usage trends, adoption changes
5. "Recommended Actions" — specific next steps for the CSM

JSON only:`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const sections: DigestSection[] = JSON.parse(text);
    return sections;
  } catch (err) {
    console.error('Failed to generate digest:', err);
    // Return a basic fallback
    return [
      {
        title: 'Health Summary',
        emoji: '📊',
        content: `${context.accountName}: ${context.grafana ? `Uptime ${context.grafana.uptime}%, Error rate ${context.grafana.errorRate}%` : 'Metrics unavailable'}. ${context.pylon ? `${context.pylon.openTickets} open support tickets.` : ''} ${context.productUsage ? `Adoption score: ${context.productUsage.adoptionScore}.` : ''}`,
      },
    ];
  }
}

/**
 * Generate a pre-call brief from account context.
 */
export async function generatePreCallBrief(
  context: AccountContext,
  meetingTitle: string
): Promise<string> {
  const userPrompt = `Generate a pre-call brief for a meeting titled "${meetingTitle}" with ${context.accountName}.

Account: ${context.accountName} (${context.tier}, $${(context.mrr / 1000).toFixed(1)}k MRR)
Owner: ${context.owner}

${context.grafana ? `Current metrics: Uptime ${context.grafana.uptime}%, Error rate ${context.grafana.errorRate}%, P99 ${context.grafana.p99Latency}ms. ${context.grafana.alerts.length} active alerts.` : ''}

${context.pylon ? `Support: ${context.pylon.openTickets} open tickets (${context.pylon.urgentTickets} urgent). ${context.pylon.tickets.slice(0, 3).map(t => `"${t.title}" (${t.priority})`).join(', ')}.` : ''}

${context.productUsage ? `Usage: ${context.productUsage.prsReviewed} PRs reviewed (${context.productUsage.prsTrend >= 0 ? '+' : ''}${context.productUsage.prsTrend}%), ${context.productUsage.activeUsers}/${context.productUsage.totalSeats} seats active, adoption ${context.productUsage.adoptionScore}/100.` : ''}

${context.gong?.recentCalls?.length ? `Last call: "${context.gong.recentCalls[0].title}" on ${context.gong.recentCalls[0].date}.` : ''}

${context.slackContext ? `Recent internal notes:\n${context.slackContext}` : ''}

Write a brief (Slack-formatted with *bold* and bullet points) covering:
- Key context to remember going in
- Open issues to address
- Talking points / questions to ask
- Any risks to be aware of

Keep it under 300 words. Practical and direct.`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: 'You are Pulse, an AI assistant for CodeRabbit CSMs. Generate concise, actionable pre-call briefs. Use Slack formatting (*bold*, bullet points). Be direct.',
      messages: [{ role: 'user', content: userPrompt }],
    });

    return response.content[0].type === 'text' ? response.content[0].text : 'Brief generation failed.';
  } catch (err) {
    console.error('Failed to generate pre-call brief:', err);
    return `Pre-call brief for ${context.accountName} — ${meetingTitle}\n\n_Brief generation failed. Check account data manually._`;
  }
}
