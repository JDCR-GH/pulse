'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ActionQueue from '@/components/ActionQueue';
import { actions } from '@/data/mock';
import { Zap, Filter, RefreshCw, DollarSign, CircleCheck } from 'lucide-react';

type FilterSource = 'all' | 'gong' | 'pylon' | 'grafana' | 'product' | 'renewal';

export default function ActionsPage() {
  const [sourceFilter, setSourceFilter] = useState<FilterSource>('all');

  const filtered = sourceFilter === 'all'
    ? actions
    : actions.filter((a) => a.source === sourceFilter);

  const totalMrrAtRisk = filtered
    .filter((a) => a.urgency === 'now' && !a.completed)
    .reduce((sum, a) => sum + a.mrr, 0);

  const uniqueAccountsMrr = new Map<string, number>();
  filtered.filter(a => a.urgency === 'now' && !a.completed).forEach(a => {
    uniqueAccountsMrr.set(a.accountId, a.mrr);
  });
  const dedupedMrr = Array.from(uniqueAccountsMrr.values()).reduce((s, v) => s + v, 0);

  const sources: { key: FilterSource; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: actions.length },
    { key: 'gong', label: 'Gong', count: actions.filter((a) => a.source === 'gong').length },
    { key: 'pylon', label: 'Pylon', count: actions.filter((a) => a.source === 'pylon').length },
    { key: 'grafana', label: 'Grafana', count: actions.filter((a) => a.source === 'grafana').length },
    { key: 'product', label: 'Product', count: actions.filter((a) => a.source === 'product').length },
  ];

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
          <div className="flex items-center gap-3">
            <Zap size={18} style={{ color: '#ef4444' }} />
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Action Queue</h1>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                AI-prioritized actions across your portfolio
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="glass-card p-4 opacity-0 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <div className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Urgent Actions
              </div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: '#ef4444' }}>
                {filtered.filter((a) => a.urgency === 'now' && !a.completed).length}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>need attention today</div>
            </div>
            <div className="glass-card p-4 opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                MRR at Risk
              </div>
              <div className="text-2xl font-bold tabular-nums flex items-center gap-1" style={{ color: '#f59e0b' }}>
                <DollarSign size={18} />{(dedupedMrr / 1000).toFixed(0)}k
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>from urgent actions</div>
            </div>
            <div className="glass-card p-4 opacity-0 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <div className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                This Week
              </div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: '#f59e0b' }}>
                {filtered.filter((a) => a.urgency === 'this_week' && !a.completed).length}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>actions pending</div>
            </div>
            <div className="glass-card p-4 opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Monitoring
              </div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: '#3b82f6' }}>
                {filtered.filter((a) => a.urgency === 'monitor').length}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>accounts being watched</div>
            </div>
          </div>

          {/* Source filters */}
          <div className="flex items-center gap-2 mb-4 opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Source:</span>
            {sources.map((s) => (
              <button
                key={s.key}
                onClick={() => setSourceFilter(s.key)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                style={{
                  background: sourceFilter === s.key ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${sourceFilter === s.key ? 'rgba(59, 130, 246, 0.3)' : 'var(--border)'}`,
                  color: sourceFilter === s.key ? '#3b82f6' : 'var(--text-secondary)',
                }}
              >
                {s.label} ({s.count})
              </button>
            ))}
          </div>

          {/* Action Queue */}
          <ActionQueue actions={filtered} />

          {/* How it works */}
          <div className="mt-6 glass-card p-5 opacity-0 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-3">
              <CircleCheck size={14} style={{ color: '#8b5cf6' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>How actions are generated</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { step: '1', title: 'Data Collection', desc: 'Pulse continuously monitors Grafana metrics, Gong calls, Pylon tickets, and product usage for all your accounts.' },
                { step: '2', title: 'Signal Detection', desc: 'AI identifies risk signals: negative sentiment, open tickets, declining adoption, approaching renewals, broken promises.' },
                { step: '3', title: 'Prioritization', desc: 'Actions are ranked by urgency and MRR impact. Converging signals from multiple sources push actions higher.' },
                { step: '4', title: 'Action Generation', desc: 'Claude generates specific, actionable recommendations with the exact context you need to act.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-2"
                    style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                    {item.step}
                  </div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</div>
                  <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
