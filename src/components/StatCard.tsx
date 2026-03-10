'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: ReactNode;
  color: string;
  glowClass?: string;
  delay?: number;
}

export default function StatCard({ label, value, subValue, trend, trendValue, icon, color, glowClass = '', delay = 0 }: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : 'var(--text-muted)';

  return (
    <div
      className={`glass-card p-5 opacity-0 animate-slide-up ${glowClass}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}12`, color }}>
          {icon}
        </div>
        {trend && trendValue && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium"
            style={{ background: `${trendColor}12`, color: trendColor }}>
            <TrendIcon size={12} />
            {trendValue}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</div>
      {subValue && (
        <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{subValue}</div>
      )}
    </div>
  );
}
