'use client';

import { useRouter } from 'next/navigation';
import { Account } from '@/data/mock';
import Sparkline from './Sparkline';
import { ArrowUpRight, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

interface AccountTableProps {
  accounts: Account[];
}

const statusConfig = {
  healthy: { icon: CheckCircle2, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', label: 'Healthy' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', label: 'Warning' },
  critical: { icon: XCircle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'Critical' },
};

const tierColors = {
  Enterprise: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
  Business: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  Starter: { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' },
};

function formatMRR(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value}`;
}

function getScoreColor(score: number): string {
  if (score >= 85) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

export default function AccountTable({ accounts }: AccountTableProps) {
  const router = useRouter();
  const sorted = [...accounts].sort((a, b) => {
    const statusOrder = { critical: 0, warning: 1, healthy: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="glass-card overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: '250ms' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Account Health Overview</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: '#10b981' }} />
              Healthy ({accounts.filter(a => a.status === 'healthy').length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
              Warning ({accounts.filter(a => a.status === 'warning').length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
              Critical ({accounts.filter(a => a.status === 'critical').length})
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              <th className="px-5 py-3 font-medium">Account</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-center">Health</th>
              <th className="px-4 py-3 font-medium text-right">MRR</th>
              <th className="px-4 py-3 font-medium text-right">Uptime</th>
              <th className="px-4 py-3 font-medium text-right">Error Rate</th>
              <th className="px-4 py-3 font-medium text-right">P99 Latency</th>
              <th className="px-4 py-3 font-medium w-[140px]">Trend (24h)</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium w-8"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((account, i) => {
              const status = statusConfig[account.status];
              const StatusIcon = status.icon;
              const tier = tierColors[account.tier];
              const scoreColor = getScoreColor(account.healthScore);

              const rowAccent = account.status === 'critical'
                ? { borderLeft: '2px solid rgba(239,68,68,0.4)', boxShadow: '-3px 0 16px rgba(239,68,68,0.06)', background: 'rgba(239,68,68,0.015)' }
                : account.status === 'warning'
                ? { borderLeft: '2px solid rgba(245,158,11,0.3)', boxShadow: '-3px 0 12px rgba(245,158,11,0.04)', background: 'transparent' }
                : { borderLeft: '2px solid transparent', boxShadow: 'none', background: 'transparent' };

              return (
                <tr
                  key={account.id}
                  onClick={() => router.push(`/account/${account.id}`)}
                  className="table-row-hover border-t cursor-pointer group"
                  style={{
                    borderColor: 'var(--border)',
                    opacity: 0,
                    animation: `fade-in 0.4s ease-out ${300 + i * 50}ms forwards`,
                    ...rowAccent,
                  }}
                >
                  {/* Account */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${scoreColor}18, ${scoreColor}08)`,
                          color: scoreColor,
                          border: `1px solid ${scoreColor}20`,
                        }}>
                        {account.logo}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{account.name}</div>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{ background: tier.bg, color: tier.color }}>
                          {account.tier}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <StatusIcon size={14} style={{ color: status.color }} />
                      <span className="text-xs font-medium" style={{ color: status.color }}>{status.label}</span>
                    </div>
                  </td>

                  {/* Health Score */}
                  <td className="px-4 py-3.5 text-center">
                    <div className="inline-flex items-center justify-center">
                      <div className="relative w-10 h-10">
                        <svg width="40" height="40" className="-rotate-90">
                          <circle cx="20" cy="20" r="16" fill="none" stroke={`${scoreColor}18`} strokeWidth="3" />
                          <circle cx="20" cy="20" r="16" fill="none" stroke={scoreColor} strokeWidth="3"
                            strokeDasharray={`${2 * Math.PI * 16}`}
                            strokeDashoffset={`${2 * Math.PI * 16 * (1 - account.healthScore / 100)}`}
                            strokeLinecap="round"
                            style={{ filter: `drop-shadow(0 0 3px ${scoreColor}60)` }}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums"
                          style={{ color: scoreColor }}>
                          {account.healthScore}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* MRR */}
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
                      {formatMRR(account.mrr)}
                    </span>
                  </td>

                  {/* Uptime */}
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm tabular-nums" style={{
                      color: account.uptime >= 99.9 ? '#10b981' : account.uptime >= 99.5 ? '#f59e0b' : '#ef4444'
                    }}>
                      {account.uptime}%
                    </span>
                  </td>

                  {/* Error Rate */}
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm tabular-nums" style={{
                      color: account.errorRate <= 0.1 ? '#10b981' : account.errorRate <= 0.5 ? '#f59e0b' : '#ef4444'
                    }}>
                      {account.errorRate}%
                    </span>
                  </td>

                  {/* Latency */}
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm tabular-nums" style={{
                      color: account.p99Latency <= 100 ? '#10b981' : account.p99Latency <= 200 ? '#f59e0b' : '#ef4444'
                    }}>
                      {account.p99Latency}ms
                    </span>
                  </td>

                  {/* Sparkline */}
                  <td className="px-4 py-3.5">
                    <div className="w-[120px] h-[32px]">
                      <Sparkline data={account.sparkline} color={scoreColor} height={32} showTooltip={false} />
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{ background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
                        {account.ownerAvatar}
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{account.owner.split(' ')[0]}</span>
                    </div>
                  </td>

                  {/* Arrow */}
                  <td className="px-4 py-3.5">
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
