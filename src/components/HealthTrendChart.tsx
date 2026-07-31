'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { healthTrend } from '@/data/mock';

export default function HealthTrendChart() {
  return (
    <div className="glass-card opacity-0 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Health Distribution (9 days)</h2>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Account count by status over time</p>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={healthTrend} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#4a4a62', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#4a4a62', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={20}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-xl px-4 py-3 text-xs"
                    style={{
                      background: 'rgba(13, 13, 22, 0.95)',
                      border: '1px solid var(--border-light)',
                      backdropFilter: 'blur(12px)',
                    }}>
                    <div className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{label}</div>
                    {payload.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2 py-0.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{String(p.dataKey)}: </span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            <Bar dataKey="healthy" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} opacity={0.85} />
            <Bar dataKey="warning" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} opacity={0.85} />
            <Bar dataKey="critical" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
