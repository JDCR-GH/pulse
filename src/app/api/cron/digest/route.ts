/**
 * GET /api/cron/digest
 *
 * Cron endpoint — generates and posts digests for ALL enabled accounts.
 *
 * Set up a cron job (Railway cron, Vercel cron, or external like cron-job.org)
 * to hit this endpoint on your desired schedule.
 *
 * Recommended: Daily at 9:00 AM your team's timezone.
 *
 * Security: Protected by CRON_SECRET env var.
 * Set a random string and pass it as ?secret=xxx or Authorization header.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEnabledAccounts } from '@/lib/accounts';
import { getAccountMetrics } from '@/lib/grafana';
import { getRecentCalls } from '@/lib/gong';
import { getAccountTicketStats } from '@/lib/pylon';
import { ensureChannel, getChannelHistory, postAccountDigest } from '@/lib/slack';
import { generateDigest } from '@/lib/synthesize';

const CRON_SECRET = process.env.CRON_SECRET || '';

export async function GET(req: NextRequest) {
  // Verify cron secret
  const secret =
    req.nextUrl.searchParams.get('secret') ||
    req.headers.get('authorization')?.replace('Bearer ', '');

  if (CRON_SECRET && secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accounts = getEnabledAccounts();
  console.log(`[Pulse Cron] Running digest for ${accounts.length} accounts`);

  const results: { account: string; status: string; sections?: number; error?: string }[] = [];

  // Process accounts sequentially to avoid rate limits
  for (const account of accounts) {
    try {
      console.log(`[Pulse Cron] Processing ${account.name}...`);

      // Gather data
      const [grafana, gongCalls, pylonStats] = await Promise.all([
        getAccountMetrics(account.slug, account.grafanaDatasourceUid),
        getRecentCalls(account.gongCompanyName),
        getAccountTicketStats(account.pylonAccountName),
      ]);

      // Slack context
      let slackContext = '';
      const channelId = await ensureChannel(account.slackChannel);
      if (channelId) {
        const history = await getChannelHistory(channelId, 20);
        slackContext = history.map((m) => `${m.author}: ${m.text}`).reverse().join('\n');
      }

      // Synthesize
      const sections = await generateDigest({
        accountName: account.name,
        tier: account.tier,
        owner: account.owner,
        mrr: account.mrr,
        grafana: grafana ? {
          uptime: grafana.uptime,
          errorRate: grafana.errorRate,
          p99Latency: grafana.p99Latency,
          alerts: grafana.alerts,
        } : undefined,
        gong: gongCalls.length ? {
          recentCalls: gongCalls.map((c) => ({
            title: c.title,
            date: c.date,
            participants: c.participants,
            transcript: c.transcript,
          })),
        } : undefined,
        pylon: pylonStats.totalTickets > 0 ? {
          openTickets: pylonStats.openTickets,
          urgentTickets: pylonStats.urgentTickets,
          avgResponseTimeMinutes: pylonStats.avgResponseTimeMinutes,
          tickets: pylonStats.tickets.map((t) => ({
            title: t.title,
            status: t.status,
            priority: t.priority,
            summary: t.summary,
          })),
        } : undefined,
        slackContext: slackContext || undefined,
      });

      // Post to Slack
      if (channelId) {
        await postAccountDigest(
          channelId,
          account.name,
          sections.map((s) => ({ title: s.title, emoji: s.emoji, content: s.content }))
        );
      }

      results.push({
        account: account.name,
        status: 'success',
        sections: sections.length,
      });

      // Small delay between accounts to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`[Pulse Cron] Failed for ${account.name}:`, err);
      results.push({
        account: account.name,
        status: 'error',
        error: String(err),
      });
    }
  }

  const successCount = results.filter((r) => r.status === 'success').length;
  console.log(
    `[Pulse Cron] Complete: ${successCount}/${accounts.length} accounts processed`
  );

  return NextResponse.json({
    processed: accounts.length,
    successful: successCount,
    results,
    timestamp: new Date().toISOString(),
  });
}
