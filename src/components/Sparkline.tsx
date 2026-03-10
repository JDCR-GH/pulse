'use client';

import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { SparklinePoint } from '@/data/mock';

interface SparklineProps {
  data: SparklinePoint[];
  color?: string;
  height?: number;
  showTooltip?: boolean;
}

export default function Sparkline({ data, color = '#10b981', height = 40, showTooltip = true }: SparklineProps) {
  const gradientId = `gradient-${color.replace('#', '')}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showTooltip && (
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-lg px-3 py-1.5 text-xs font-medium"
                  style={{
                    background: 'rgba(17, 17, 25, 0.95)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    backdropFilter: 'blur(8px)',
                  }}>
                  {payload[0].value}
                </div>
              );
            }}
            cursor={false}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
