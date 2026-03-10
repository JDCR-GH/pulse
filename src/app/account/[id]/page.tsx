'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import HealthScoreRing from '@/components/HealthScoreRing';
import Sparkline from '@/components/Sparkline';
import GongActivity from '@/components/GongActivity';
import SlackActivity from '@/components/SlackActivity';
import PylonTickets from '@/components/PylonTickets';
import ProductUsageCard from '@/components/ProductUsageCard';
import AccountTimeline from '@/components/AccountTimeline';
import SlackDigestPreview from '@/components/SlackDigestPreview';
import { accounts, gongCalls, slackMessages, pylonTickets, productUsage, getAccountTimeline, alerts } from '@/data/mock';
import {
  ArrowLeft,
  Activity,
  Zap,
  Clock,
  AlertTriangle,
  DollarSign,
  Phone,
  Hash,
  RefreshCw,
  ExternalLink,
  Ticket,
  Code,
} from 'lucide-react';

function getScoreColor(score: number): string {
  if (score >= 85) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

function generateDigest(accountName: string, account: typeof accounts[0], calls: typeof gongCalls[string], tickets: typeof pylonTickets[string], usage: typeof productUsage[string]): { section: string; icon: string; content: string }[] {
  const digest = [];

  // Health summary
  digest.push({
    section: 'Health Summary',
    icon: '📊',
    content: `Health score: ${account.healthScore} (${account.status}). Uptime: ${account.uptime}%. Error rate: ${account.errorRate}%. P99 latency: ${account.p99Latency}ms. ${account.lastIncident ? `Last incident: ${account.lastIncident}.` : 'No recent incidents.'}`,
  });

  // Gong
  if (calls?.length > 0) {
    const lastCall = calls[0];
    digest.push({
      section: 'Latest Call (Gong)',
      icon: '📞',
      content: `"${lastCall.title}" on ${lastCall.date} (${lastCall.duration}). Sentiment: ${lastCall.sentiment} (${lastCall.sentimentScore > 0 ? '+' : ''}${lastCall.sentimentScore.toFixed(2)}). ${lastCall.summary.slice(0, 150)}...`,
    });
  }

  // Pylon
  const openTickets = (tickets || []).filter(t => t.status === 'open' || t.status === 'in_progress');
  if (openTickets.length > 0) {
    digest.push({
      section: 'Support (Pylon)',
      icon: '🎫',
      content: `${openTickets.length} open ticket${openTickets.length > 1 ? 's' : ''}: ${openTickets.map(t => `"${t.title}" (${t.priority})`).join(', ')}`,
    });
  }

  // Product usage
  if (usage) {
    const prChange = ((usage.prsReviewedLast30d - usage.prsReviewedPrev30d) / usage.prsReviewedPrev30d * 100);
    digest.push({
      section: 'Product Usage',
      icon: '🐰',
      content: `${usage.prsReviewedLast30d.toLocaleString()} PRs reviewed (${prChange >= 0 ? '+' : ''}${prChange.toFixed(0)}% vs prev month). ${usage.activeUsers}/${usage.totalSeats} active seats. Adoption score: ${usage.adoptionScore}. Avg review: ${usage.avgReviewTime}.`,
    });
  }

  return digest;
}

export default function AccountDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const account = accounts.find(a => a.id === id);

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-muted)' }}>Account not found</p>
      </div>
    );
  }

  const calls = gongCalls[id] || [];
  const messages = slackMessages[id] || [];
  const tickets = pylonTickets[id] || [];
  const usage = productUsage[id];
  const timeline = getAccountTimeline(id);
  const accountAlerts = alerts.filter(a => a.accountId === id);
  const scoreColor = getScoreColor(account.healthScore);
  const digest = generateDigest(account.name, account, calls, tickets, usage);

  const tierColors: Record<string, { bg: string; color: string }> = {
    Enterprise: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
    Business: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
    Starter: { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' },
  };
  const tier = tierColors[account.tier];

  return (
    <div className="min-h-screen">
      <div className="mesh-bg" />
      <Sidebar />

      <main className="ml-[240px] relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 px-8 h-16 flex items-center justify-between border-b"
          style={{
            background: 'rgba(7, 7, 13, 0.8)',
            backdropFilter: 'blur(16px)',
            borderColor: 'var(--border)',
          }}>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')}
              className="p-2 rounded-xl transition-colors hover:bg-white/[0.03]"
              style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  background: `linear-gradient(135deg, ${scoreColor}20, ${scoreColor}08)`,
                  color: scoreColor,
                  border: `1px solid ${scoreColor}25`,
                }}>
                {account.logo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{account.name}</h1>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ background: tier.bg, color: tier.color }}>
                    {account.tier}
                  </span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Managed by {account.owner} · {account.requestsPerMin.toLocaleString()} req/min
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <ExternalLink size={12} /> View in Grafana
            </button>
            <button className="p-2 rounded-xl transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Top: Health + Metrics + Data Sources */}
          <div className="grid grid-cols-12 gap-4 mb-6">
            {/* Health Score */}
            <div className="col-span-3 glass-card p-6 flex flex-col items-center justify-center opacity-0 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <HealthScoreRing score={account.healthScore} status={account.status} size={140} strokeWidth={10} />
              <div className="mt-3 text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
                  style={{ background: `${scoreColor}12`, color: scoreColor }}>
                  {account.status}
                </span>
              </div>
              <div className="w-full mt-4">
                <div className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>24h Health Trend</div>
                <Sparkline data={account.sparkline} color={scoreColor} height={48} />
              </div>
            </div>

            {/* Metrics */}
            <div className="col-span-5 grid grid-cols-2 gap-3">
              <div className="glass-card p-4 opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={14} style={{ color: '#10b981' }} />
                  <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>MRR</span>
                </div>
                <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>${(account.mrr / 1000).toFixed(1)}k</div>
              </div>
              <div className="glass-card p-4 opacity-0 animate-slide-up" style={{ animationDelay: '150ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={14} style={{ color: account.uptime >= 99.9 ? '#10b981' : '#f59e0b' }} />
                  <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Uptime</span>
                </div>
                <div className="text-xl font-bold tabular-nums" style={{ color: account.uptime >= 99.9 ? '#10b981' : '#f59e0b' }}>{account.uptime}%</div>
                <Sparkline data={account.uptimeHistory} color={account.uptime >= 99.9 ? '#10b981' : '#f59e0b'} height={28} />
              </div>
              <div className="glass-card p-4 opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} style={{ color: account.errorRate <= 0.1 ? '#10b981' : account.errorRate <= 0.5 ? '#f59e0b' : '#ef4444' }} />
                  <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Error Rate</span>
                </div>
                <div className="text-xl font-bold tabular-nums" style={{ color: account.errorRate <= 0.1 ? '#10b981' : account.errorRate <= 0.5 ? '#f59e0b' : '#ef4444' }}>{account.errorRate}%</div>
                <Sparkline data={account.errorHistory} color={account.errorRate <= 0.1 ? '#10b981' : '#f59e0b'} height={28} />
              </div>
              <div className="glass-card p-4 opacity-0 animate-slide-up" style={{ animationDelay: '250ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} style={{ color: account.p99Latency <= 100 ? '#10b981' : account.p99Latency <= 200 ? '#f59e0b' : '#ef4444' }} />
                  <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>P99 Latency</span>
                </div>
                <div className="text-xl font-bold tabular-nums" style={{ color: account.p99Latency <= 100 ? '#10b981' : account.p99Latency <= 200 ? '#f59e0b' : '#ef4444' }}>{account.p99Latency}ms</div>
                <Sparkline data={account.latencyHistory} color={account.p99Latency <= 100 ? '#10b981' : '#f59e0b'} height={28} />
              </div>
            </div>

            {/* Data Sources */}
            <div className="col-span-4 glass-card p-5 opacity-0 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Data Sources</h3>
              <div className="space-y-2">
                {[
                  { icon: Activity, name: 'Grafana', color: '#06b6d4', detail: `${accountAlerts.length} alerts · ${account.requestsPerMin.toLocaleString()} req/min`, active: true },
                  { icon: Phone, name: 'Gong', color: '#8b5cf6', detail: `${calls.length} calls${calls.length > 0 ? ` · Latest: ${calls[0].date}` : ''}`, active: calls.length > 0 },
                  { icon: Ticket, name: 'Pylon', color: '#f59e0b', detail: `${tickets.length} tickets · ${tickets.filter(t => t.status === 'open').length} open`, active: tickets.length > 0 },
                  { icon: Hash, name: 'Slack', color: '#3b82f6', detail: `${messages.length} messages · ${[...new Set(messages.map(m => m.channel))].length} channels`, active: messages.length > 0 },
                  { icon: Code, name: 'Product', color: '#10b981', detail: usage ? `${usage.prsReviewedLast30d.toLocaleString()} PRs · ${usage.activeUsers} active` : 'No data', active: !!usage },
                ].map(src => (
                  <div key={src.name} className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{ background: `${src.color}06`, border: `1px solid ${src.color}12` }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${src.color}12` }}>
                      <src.icon size={13} style={{ color: src.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>{src.name}</div>
                      <div className="text-[9px] truncate" style={{ color: 'var(--text-muted)' }}>{src.detail}</div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: src.active ? '#10b981' : '#4a4a62' }} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="text-center">
                  <div className="text-base font-bold tabular-nums" style={{ color: '#06b6d4' }}>{accountAlerts.filter(a => !a.acknowledged).length}</div>
                  <div className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Alerts</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold tabular-nums" style={{ color: '#8b5cf6' }}>
                    {calls.length > 0 ? (calls[0].sentimentScore > 0 ? '+' : '') + calls[0].sentimentScore.toFixed(1) : '—'}
                  </div>
                  <div className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Sentiment</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold tabular-nums" style={{ color: usage ? getScoreColor(usage.adoptionScore) : 'var(--text-muted)' }}>
                    {usage?.adoptionScore ?? '—'}
                  </div>
                  <div className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Adoption</div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Banner */}
          {accountAlerts.filter(a => !a.acknowledged).length > 0 && (
            <div className="mb-6 rounded-2xl p-4 opacity-0 animate-slide-up"
              style={{
                animationDelay: '200ms',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.06), rgba(239, 68, 68, 0.02))',
                border: '1px solid rgba(239, 68, 68, 0.15)',
              }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} style={{ color: '#ef4444' }} />
                <span className="text-xs font-semibold" style={{ color: '#ef4444' }}>
                  {accountAlerts.filter(a => !a.acknowledged).length} Unacknowledged Alerts
                </span>
              </div>
              <div className="space-y-2">
                {accountAlerts.filter(a => !a.acknowledged).map(alert => (
                  <div key={alert.id} className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: alert.severity === 'critical' ? '#ef4444' : '#f59e0b' }} />
                    <span className="flex-1">{alert.message}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{alert.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Digest Preview */}
          <div className="mb-6">
            <SlackDigestPreview
              accountName={account.name}
              channelName={`#acc-${account.name.toLowerCase().replace(/\s+/g, '-')}`}
              digest={digest}
              generatedAt="Just now"
            />
          </div>

          {/* Product Usage */}
          {usage && (
            <div className="mb-6">
              <ProductUsageCard usage={usage} />
            </div>
          )}

          {/* Main Content: Gong + Pylon + Slack */}
          <div className="grid grid-cols-12 gap-4 mb-6">
            <div className="col-span-5">
              <GongActivity calls={calls} />
            </div>
            <div className="col-span-4">
              <PylonTickets tickets={tickets} />
            </div>
            <div className="col-span-3">
              <AccountTimeline events={timeline} />
            </div>
          </div>

          {/* Slack */}
          <SlackActivity messages={messages} />
        </div>
      </main>
    </div>
  );
}

function getScoreColorLocal(score: number): string {
  if (score >= 70) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}
