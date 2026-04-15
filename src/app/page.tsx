'use client';

import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import AccountTable from '@/components/AccountTable';
import AlertsFeed from '@/components/AlertsFeed';
import HealthTrendChart from '@/components/HealthTrendChart';
import HealthDistribution from '@/components/HealthDistribution';
import RiskRadar from '@/components/RiskRadar';
import SlackDigestPreview from '@/components/SlackDigestPreview';
import ActionQueue from '@/components/ActionQueue';
import { accounts, actions, overviewStats } from '@/data/mock';
import {
  Heart,
  DollarSign,
  Activity,
  AlertTriangle,
  Clock,
  Search,
  RefreshCw,
} from 'lucide-react';

const sampleDigest = [
  {
    section: 'Health Summary',
    icon: '📊',
    content: 'Overall health score is stable at 72. Uptime dipped to 99.82% over the past 6 hours due to connection pool issues. Error rate trending up slightly — engineering is investigating.',
  },
  {
    section: 'Recent Call (Gong)',
    icon: '📞',
    content: 'Escalation call on Mar 9 — customer expressed frustration with latency spikes affecting production. Mentioned evaluating alternatives if not resolved within 2 weeks. Sentiment: Negative (-0.55).',
  },
  {
    section: 'Support Activity (Pylon)',
    icon: '🎫',
    content: '2 open tickets: "GitHub Enterprise webhook failures" (urgent, 4h old) and "Custom review rules not triggering on monorepo" (high, 2 days). Avg response time: 3h 20m.',
  },
  {
    section: 'Product Usage',
    icon: '🐰',
    content: 'PR reviews down 18% vs last month (1,240 → 1,017). Active users: 45/60 seats (75%). Adoption score: 68 — declining. Top repo activity in "platform-core" and "api-gateway".',
  },
  {
    section: 'Recommended Actions',
    icon: '⚡',
    content: '1. Assign dedicated eng resource for latency investigation\n2. Schedule exec sponsor call within 48h\n3. Proactive outreach on the open urgent ticket\n4. Review custom rules config — may need tuning for monorepo setup',
  },
];

export default function Home() {
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
              icon={<Heart size={20} />}
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
              icon={<DollarSign size={20} />}
              color="#10b981"
              glowClass="glow-green"
              delay={100}
            />
            <StatCard
              label="Avg Uptime"
              value={`${overviewStats.avgUptime}%`}
              trend="neutral"
              trendValue="stable"
              icon={<Activity size={20} />}
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
              icon={<AlertTriangle size={20} />}
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
              icon={<Clock size={20} />}
              color="#06b6d4"
              delay={250}
            />
          </div>

          {/* Action Queue (compact) + Risk Radar */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <ActionQueue actions={actions} compact />
            <RiskRadar accounts={accounts} />
          </div>

          {/* AI Digest Preview */}
          <div className="mb-6">
            <SlackDigestPreview
              accountName="Vercel"
              channelName="#acc-vercel"
              digest={sampleDigest}
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
// security test: eval(user_input)
// commit 2
// commit 3
