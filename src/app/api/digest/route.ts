/**
 * POST /api/digest
 *
 * Generate and post an account digest for a single account.
 * Can be triggered manually from the dashboard or by the cron job.
 *
 * Body: { accountSlug: string, dryRun?: boolean }
 *
 * dryRun: if true, returns the digest without posting to Slack.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAccountBySlug } from '@/lib/accounts';
import { getAccountMetrics } from '@/lib/grafana';
import { getRecentCalls } from '@/lib/gong';
import { getAccountTicketStats } from '@/lib/pylon';
import { ensureChannel, getChannelHistory, postAccountDigest } from '@/lib/slack';
import { generateDigest } from '@/lib/synthesize';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountSlug, dryRun = false } = body;

    if (!accountSlug) {
      return NextResponse.json({ error: 'accountSlug is required' }, { status: 400 });
    }

    const account = getAccountBySlug(accountSlug);
    if (!account) {
      return NextResponse.json({ error: `Account not found: ${accountSlug}` }, { status: 404 });
    }

    console.log(`[Pulse] Generating digest for ${account.name}...`);

    // 1. Gather data from all sources in parallel
    const [grafana, gongCalls, pylonStats] = await Promise.all([
      getAccountMetrics(account.slug, account.grafanaDatasourceUid),
      getRecentCalls(account.gongCompanyName),
      getAccountTicketStats(account.pylonAccountName),
    ]);

    // 2. Get Slack channel context
    let slackContext = '';
    if (!dryRun) {
      const channelId = await ensureChannel(account.slackChannel);
      if (channelId) {
        const history = await getChannelHistory(channelId, 20);
        slackContext = history
          .map((m) => `${m.author}: ${m.text}`)
          .reverse()
          .join('\n');
      }
    }

    // 3. Build context object for AI synthesis
    const context = {
      accountName: account.name,
      tier: account.tier,
      owner: account.owner,
      mrr: account.mrr,
      grafana: grafana
        ? {
            uptime: grafana.uptime,
            errorRate: grafana.errorRate,
            p99Latency: grafana.p99Latency,
            alerts: grafana.alerts,
          }
        : undefined,
      gong: gongCalls.length
        ? {
            recentCalls: gongCalls.map((c) => ({
              title: c.title,
              date: c.date,
              participants: c.participants,
              transcript: c.transcript,
            })),
          }
        : undefined,
      pylon: pylonStats.totalTickets > 0
        ? {
            openTickets: pylonStats.openTickets,
            urgentTickets: pylonStats.urgentTickets,
            avgResponseTimeMinutes: pylonStats.avgResponseTimeMinutes,
            tickets: pylonStats.tickets.map((t) => ({
              title: t.title,
              status: t.status,
              priority: t.priority,
              summary: t.summary,
            })),
          }
        : undefined,
      slackContext: slackContext || undefined,
    };

    // 4. Generate digest with Claude
    const sections = await generateDigest(context);

    console.log(`[Pulse] Generated ${sections.length} sections for ${account.name}`);

    // 5. Post to Slack (unless dry run)
    if (!dryRun) {
      const channelId = await ensureChannel(account.slackChannel);
      if (channelId) {
        const posted = await postAccountDigest(
          channelId,
          account.name,
          sections.map((s) => ({
            title: s.title,
            emoji: s.emoji,
            content: s.content,
          }))
        );
        console.log(`[Pulse] Posted to #${account.slackChannel}: ${posted}`);
      } else {
        console.warn(`[Pulse] Could not find/create channel #${account.slackChannel}`);
      }
    }

    return NextResponse.json({
      account: account.name,
      sections,
      dryRun,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Pulse] Digest generation failed:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: String(err) },
      { status: 500 }
    );
  }
}
