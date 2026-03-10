'use client';

import { Account } from '@/data/mock';
import { AlertTriangle, TrendingDown, DollarSign, Calendar, Shield, ArrowRight } from 'lucide-react';

interface RiskSignal {
  source: string;
  signal: string;
  severity: 'high' | 'medium' | 'low';
}

interface AtRiskAccount {
  account: Account;
  riskScore: number;
  signals: RiskSignal[];
  daysToRenewal?: number;
}

interface RiskRadarProps {
  accounts: Account[];
}

function computeRisk(account: Account): AtRiskAccount | null {
  const signals: RiskSignal[] = [];
  let riskScore = 0;

  if (account.healthScore < 60) {
    signals.push({ source: 'Grafana', signal: `Health score critically low at ${account.healthScore}`, severity: 'high' });
    riskScore += 30;
  } else if (account.healthScore < 80) {
    signals.push({ source: 'Grafana', signal: `Health score declining: ${account.healthScore}`, severity: 'medium' });
    riskScore += 15;
  }

  if (account.errorRate > 1) {
    signals.push({ source: 'Grafana', signal: `Error rate elevated at ${account.errorRate}%`, severity: 'high' });
    riskScore += 25;
  } else if (account.errorRate > 0.3) {
    signals.push({ source: 'Grafana', signal: `Error rate above baseline: ${account.errorRate}%`, severity: 'medium' });
    riskScore += 10;
  }

  if (account.p99Latency > 300) {
    signals.push({ source: 'Grafana', signal: `P99 latency critical: ${account.p99Latency}ms`, severity: 'high' });
    riskScore += 20;
  }

  if (account.status === 'critical') {
    signals.push({ source: 'System', signal: 'Account in critical status', severity: 'high' });
    riskScore += 20;
  }

  if (account.lastIncident && (account.lastIncident.includes('min') || account.lastIncident.includes('hour'))) {
    signals.push({ source: 'Grafana', signal: `Recent incident: ${account.lastIncident}`, severity: 'medium' });
    riskScore += 10;
  }

  if (signals.length === 0) return null;

  // Fake renewal dates for demo
  const renewalDays: Record<string, number> = {
    'acc-004': 42,
    'acc-006': 18,
    'acc-008': 67,
    'acc-010': 31,
  };

  return {
    account,
    riskScore: Math.min(riskScore, 100),
    signals,
    daysToRenewal: renewalDays[account.id],
  };
}

export default function RiskRadar({ accounts }: RiskRadarProps) {
  const riskyAccounts = accounts
    .map(computeRisk)
    .filter((r): r is AtRiskAccount => r !== null)
    .sort((a, b) => b.riskScore - a.riskScore);

  const totalAtRiskMRR = riskyAccounts.reduce((sum, r) => sum + r.account.mrr, 0);

  if (riskyAccounts.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <Shield size={24} className="mx-auto mb-2" style={{ color: '#10b981' }} />
        <p className="text-sm" style={{ color: '#10b981' }}>All accounts healthy — no risks detected</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <AlertTriangle size={13} style={{ color: '#ef4444' }} />
            </div>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Risk Radar</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              {riskyAccounts.length} at risk
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              ${(totalAtRiskMRR / 1000).toFixed(0)}k MRR exposed
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {riskyAccounts.map((risk, i) => {
          const riskColor = risk.riskScore >= 60 ? '#ef4444' : risk.riskScore >= 30 ? '#f59e0b' : '#3b82f6';

          return (
            <div key={risk.account.id} className="px-5 py-4"
              style={{ opacity: 0, animation: `fade-in 0.3s ease-out ${300 + i * 80}ms forwards` }}>
              {/* Account header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `${riskColor}12`, color: riskColor, border: `1px solid ${riskColor}20` }}>
                  {risk.account.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{risk.account.name}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                      style={{ background: `${riskColor}12`, color: riskColor }}>
                      Risk: {risk.riskScore}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1"><DollarSign size={9} />${(risk.account.mrr / 1000).toFixed(1)}k/mo</span>
                    {risk.daysToRenewal && (
                      <span className="flex items-center gap-1" style={{ color: risk.daysToRenewal <= 30 ? '#ef4444' : '#f59e0b' }}>
                        <Calendar size={9} />Renewal in {risk.daysToRenewal}d
                      </span>
                    )}
                  </div>
                </div>
                {/* Risk bar */}
                <div className="w-20">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${risk.riskScore}%`, background: `linear-gradient(90deg, ${riskColor}80, ${riskColor})` }} />
                  </div>
                </div>
              </div>

              {/* Risk signals */}
              <div className="space-y-1.5 ml-12">
                {risk.signals.map((signal, j) => (
                  <div key={j} className="flex items-center gap-2 text-[11px]">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: signal.severity === 'high' ? '#ef4444' : signal.severity === 'medium' ? '#f59e0b' : '#3b82f6' }} />
                    <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                      {signal.source}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{signal.signal}</span>
                  </div>
                ))}
              </div>

              {/* Action link */}
              <div className="ml-12 mt-2">
                <button className="flex items-center gap-1 text-[11px] font-medium transition-colors"
                  style={{ color: 'var(--accent-blue)' }}>
                  View account <ArrowRight size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
