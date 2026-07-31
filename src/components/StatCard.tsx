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

export default function StatCard({
  label, value, subValue, trend, trendValue,
  icon, color, glowClass = '', delay = 0,
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#9490B0';

  return (
    <div
      className={`glass-card relative overflow-hidden opacity-0 animate-slide-up ${glowClass}`}
      style={{
        animationDelay: `${delay}ms`,
        borderLeft: `3px solid ${color}`,
        padding: '16px 18px 14px',
      }}
    >
      {/* Label + trend — top row */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="text-[9.5px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}
        >
          {label}
        </span>
        {trend && trendValue && (
          <span
            className="flex items-center gap-0.5 text-[10px] font-semibold"
            style={{ color: trendColor }}
          >
            <TrendIcon size={10} strokeWidth={2.5} />
            {trendValue}
          </span>
        )}
      </div>

      {/* Value — the star */}
      <div
        className="text-[28px] font-bold tabular-nums leading-none"
        style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
      >
        {value}
      </div>

      {/* Sub value */}
      {subValue && (
        <div className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
          {subValue}
        </div>
      )}
    </div>
  );
}
