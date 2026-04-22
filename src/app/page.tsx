'use client';

import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import AccountTable from '@/components/AccountTable';
import AlertsFeed from '@/components/AlertsFeed';
import HealthTrendChart from '@/components/HealthTrendChart';
import HealthDistribution from '@/components/HealthDistribution';
import RiskRadar from '@/components/RiskRadar';
import AccountDigest from '@/components/AccountDigest';
import ActionQueue from '@/components/ActionQueue';
import PortfolioDonut3D from '@/components/PortfolioDonut3D';
import { accounts, actions, overviewStats } from '@/data/mock';
import { Search, RefreshCw } from 'lucide-react';

const sampleDigest = [
  {
    section: 'Health Summary',
    source: 'health' as const,
    severity: 'warning' as const,
    content: 'Score 72 (warning) · Uptime 99.82% · Error rate trending up — engineering investigating · P99 latency elevated at 320ms',
  },
  {
    section: 'Latest Call',
    source: 'gong' as const,
    severity: 'critical' as const,
    content: 'Escalation call Mar 9 — customer expressed frustration with latency spikes affecting production. Mentioned evaluating alternatives if not resolved within 2 weeks · Sentiment: negative (-0.55)',
  },
  {
    section: 'Support',
    source: 'pylon' as const,
    severity: 'critical' as const,
    content: '2 open tickets: "GitHub Enterprise webhook failures" (urgent, 4h old) · "Custom review rules not triggering on monorepo" (high, 2 days)',
  },
  {
    section: 'Product Usage',
    source: 'product' as const,
    severity: 'warning' as const,
    content: 'PR reviews down 18% vs last month (1,240 → 1,017) · 45/60 active seats (75%) · Adoption score 68 — declining · Top repos: platform-core, api-gateway',
  },
];

const sampleActions = [
  'Assign dedicated eng resource for latency investigation',
  'Schedule exec sponsor call within 48h',
  'Proactive outreach on the open urgent ticket',
  'Review custom rules config — may need tuning for monorepo setup',
];

export default function Home() {
  // ── Custom stat card icons ────────────────────────────────────────────────
  const gaugeC   = 2 * Math.PI * 7;
  const gaugeFull = gaugeC * 0.75;
  const gaugeFill = gaugeFull * (overviewStats.avgHealthScore / 100);

  const miniDonutC  = 2 * Math.PI * 6;
  const healthFrac  = overviewStats.healthyCount / overviewStats.totalAccounts;

  const HealthGaugeIcon = (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
      {/* Track — 3/4 arc, gap at bottom */}
      <circle cx="10" cy="10" r="7"
        stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray={`${gaugeFull.toFixed(2)} ${(gaugeC - gaugeFull).toFixed(2)}`}
        transform="rotate(120 10 10)" />
      {/* Fill arc */}
      <circle cx="10" cy="10" r="7"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray={`${gaugeFill.toFixed(2)} ${(gaugeC - gaugeFill).toFixed(2)}`}
        transform="rotate(120 10 10)" />
      {/* Pivot dot */}
      <circle cx="10" cy="10" r="1.2" fill="currentColor" opacity="0.45" />
    </svg>
  );

  const MrrBarIcon = (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
      <rect x="1"  y="13" width="4" height="6"  rx="1" fill="currentColor" opacity="0.28" />
      <rect x="7"  y="8"  width="4" height="11" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="13" y="3"  width="4" height="16" rx="1" fill="currentColor" />
      {/* Trend line overlay */}
      <polyline points="3,13 9,8 15,3"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
      <circle cx="15" cy="3" r="1.5" fill="currentColor" />
    </svg>
  );

  const EkgIcon = (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
      <path
        d="M0,10 L4,10 L5.5,7.5 L7,12.5 L9,2 L11,15.5 L12.5,10 L20,10"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const RadarIcon = (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
      <circle cx="10" cy="10" r="9"   stroke="currentColor" strokeWidth="0.75" opacity="0.14" />
      <circle cx="10" cy="10" r="5.5" stroke="currentColor" strokeWidth="0.75" opacity="0.3"  />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="0.75" opacity="0.55" />
      <circle cx="10" cy="10" r="1.4" fill="currentColor" />
      {/* Sweep arm */}
      <line x1="10" y1="10" x2="17" y2="4"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" />
    </svg>
  );

  const MiniDonutIcon = (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
      {/* Background ring */}
      <circle cx="10" cy="10" r="6"
        stroke="currentColor" strokeWidth="3" strokeOpacity="0.18" />
      {/* Healthy arc */}
      <circle cx="10" cy="10" r="6"
        stroke="currentColor" strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${(miniDonutC * healthFrac).toFixed(2)} ${miniDonutC.toFixed(2)}`}
        transform="rotate(-90 10 10)" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      <div className="mesh-bg" />
      <Sidebar />

      <main className="ml-[240px] relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 px-8 h-16 flex items-center justify-between border-b"
          style={{
            background: 'rgba(244, 243, 239, 0.92)',
            backdropFilter: 'blur(16px)',
            borderColor: 'var(--border)',
          }}>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Last synced: 2 min ago · Grafana · Gong · Pylon · Slack
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}>
              <Search size={14} />
              <span className="text-xs">Search accounts...</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded ml-4"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                ⌘K
              </kbd>
            </div>
            <button className="p-2 rounded-xl transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <StatCard
              label="Avg Health Score"
              value={overviewStats.avgHealthScore.toFixed(1)}
              trend="down"
              trendValue="2.1%"
              icon={HealthGaugeIcon}
              color="#8b5cf6"
              glowClass="glow-purple"
              delay={50}
            />
            <StatCard
              label="Total MRR at Risk"
              value={`$${(overviewStats.totalMRR / 1000).toFixed(1)}k`}
              subValue={`${overviewStats.totalAccounts} accounts`}
              trend="up"
              trendValue="4.3%"
              icon={MrrBarIcon}
              color="#10b981"
              glowClass="glow-green"
              delay={100}
            />
            <StatCard
              label="Avg Uptime"
              value={`${overviewStats.avgUptime}%`}
              trend="neutral"
              trendValue="stable"
              icon={EkgIcon}
              color="#3b82f6"
              glowClass="glow-blue"
              delay={150}
            />
            <StatCard
              label="Active Alerts"
              value={overviewStats.activeAlerts}
              subValue="2 critical, 1 warning"
              trend="up"
              trendValue="+1"
              icon={RadarIcon}
              color="#ef4444"
              glowClass="glow-red"
              delay={200}
            />
            <StatCard
              label="Healthy Accounts"
              value={`${overviewStats.healthyCount}/${overviewStats.totalAccounts}`}
              subValue={`${((overviewStats.healthyCount / overviewStats.totalAccounts) * 100).toFixed(0)}% of portfolio`}
              trend="down"
              trendValue="-1"
              icon={MiniDonutIcon}
              color="#06b6d4"
              delay={250}
            />
          </div>

          {/* Isometric Account Map */}
          <div className="glass-card mb-6 overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Portfolio Health Map</h2>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {accounts.filter(a => a.status === 'critical').length} CRITICAL · {accounts.filter(a => a.status === 'warning').length} WARNING · {accounts.filter(a => a.status === 'healthy').length} HEALTHY
                </p>
              </div>
            </div>
            <PortfolioDonut3D accounts={accounts} />
          </div>

          {/* Action Queue (compact) + Risk Radar */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <ActionQueue actions={actions} compact />
            <RiskRadar accounts={accounts} />
          </div>

          {/* AI Digest Preview */}
          <div className="mb-6">
            <AccountDigest
              accountName="Vercel"
              channelName="#acc-vercel"
              healthScore={72}
              digest={sampleDigest}
              actions={sampleActions}
              generatedAt="Today, 9:00 AM"
            />
          </div>

          {/* Account Table */}
          <AccountTable accounts={accounts} />

          {/* Bottom Grid */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="col-span-1">
              <HealthDistribution />
            </div>
            <div className="col-span-1">
              <HealthTrendChart />
            </div>
            <div className="col-span-1">
              <AlertsFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
