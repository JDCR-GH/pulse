'use client';

import { alerts } from '@/data/mock';
import { AlertTriangle, XCircle, Info, Bell } from 'lucide-react';

const severityConfig = {
  critical: { icon: XCircle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.15)' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.15)' },
  info: { icon: Info, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', borderColor: 'rgba(59, 130, 246, 0.15)' },
};

export default function AlertsFeed() {
  return (
    <div className="glass-card opacity-0 animate-slide-up" style={{ animationDelay: '350ms' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <Bell size={16} style={{ color: 'var(--text-secondary)' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Active Alerts</h2>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
          {alerts.filter(a => !a.acknowledged).length} unread
        </span>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {alerts.map((alert, i) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className="px-5 py-3.5 flex items-start gap-3 transition-colors duration-200"
              style={{
                background: !alert.acknowledged ? config.bg : 'transparent',
                borderLeft: !alert.acknowledged ? `2px solid ${config.color}` : '2px solid transparent',
                opacity: 0,
                animation: `fade-in 0.3s ease-out ${400 + i * 60}ms forwards`,
              }}
            >
              <Icon size={15} className="mt-0.5 shrink-0" style={{ color: config.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{alert.accountName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide"
                    style={{ background: `${config.color}15`, color: config.color }}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {alert.message}
                </p>
                <span className="text-[10px] mt-1 block" style={{ color: 'var(--text-muted)' }}>
                  {alert.timestamp}
                </span>
              </div>
              {!alert.acknowledged && (
                <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: config.color }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
