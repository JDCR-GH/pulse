'use client';

import { ActivityEvent } from '@/data/mock';
import { Activity, Phone, Hash } from 'lucide-react';

interface AccountTimelineProps {
  events: ActivityEvent[];
}

const sourceConfig = {
  grafana: { icon: Activity, color: '#06b6d4', label: 'Grafana' },
  gong: { icon: Phone, color: '#8b5cf6', label: 'Gong' },
  slack: { icon: Hash, color: '#3b82f6', label: 'Slack' },
};

const severityColors = {
  critical: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  positive: '#10b981',
};

export default function AccountTimeline({ events }: AccountTimelineProps) {
  if (events.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Activity Timeline</h2>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Unified view across all data sources</p>
      </div>

      <div className="relative px-5 py-4">
        {/* Vertical line */}
        <div className="absolute left-[34px] top-4 bottom-4 w-px" style={{ background: 'var(--border)' }} />

        <div className="space-y-4">
          {events.map((event, i) => {
            const source = sourceConfig[event.source];
            const SourceIcon = source.icon;
            const severityColor = event.severity ? severityColors[event.severity] : 'var(--text-muted)';

            return (
              <div key={event.id} className="flex items-start gap-3 relative"
                style={{ opacity: 0, animation: `fade-in 0.3s ease-out ${i * 60}ms forwards` }}>
                {/* Source icon on timeline */}
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 z-10"
                  style={{ background: `${source.color}15`, border: `1px solid ${source.color}25` }}>
                  <SourceIcon size={12} style={{ color: source.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 rounded-xl p-3"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: `${source.color}12`, color: source.color }}>
                      {source.label}
                    </span>
                    <span className="text-xs font-medium" style={{ color: severityColor }}>
                      {event.title}
                    </span>
                    <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>{event.timestamp}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {event.description.length > 200 ? event.description.slice(0, 200) + '...' : event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
