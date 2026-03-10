'use client';

import { accounts } from '@/data/mock';

export default function HealthDistribution() {
  const ranges = [
    { label: '90-100', min: 90, max: 100, color: '#10b981' },
    { label: '75-89', min: 75, max: 89, color: '#22d3ee' },
    { label: '60-74', min: 60, max: 74, color: '#f59e0b' },
    { label: '40-59', min: 40, max: 59, color: '#f97316' },
    { label: '0-39', min: 0, max: 39, color: '#ef4444' },
  ];

  const distribution = ranges.map(r => ({
    ...r,
    count: accounts.filter(a => a.healthScore >= r.min && a.healthScore <= r.max).length,
  }));

  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  return (
    <div className="glass-card opacity-0 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Score Distribution</h2>
      </div>
      <div className="p-5 space-y-3">
        {distribution.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="text-[11px] font-medium w-12 text-right tabular-nums" style={{ color: 'var(--text-muted)' }}>
              {d.label}
            </span>
            <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div
                className="h-full rounded-lg progress-shimmer flex items-center px-2.5 transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.max((d.count / maxCount) * 100, d.count > 0 ? 15 : 0)}%`,
                  background: `linear-gradient(90deg, ${d.color}30, ${d.color}50)`,
                  borderRight: d.count > 0 ? `2px solid ${d.color}` : 'none',
                }}
              >
                {d.count > 0 && (
                  <span className="text-[10px] font-bold" style={{ color: d.color }}>{d.count}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
