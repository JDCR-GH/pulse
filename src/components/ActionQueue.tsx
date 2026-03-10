'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Action, ActionUrgency, ActionSource } from '@/data/mock';
import {
  Zap,
  CalendarClock,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Phone,
  Ticket,
  Activity,
  Code,
  Calendar,
  DollarSign,
  CircleCheck,
} from 'lucide-react';

interface ActionQueueProps {
  actions: Action[];
  compact?: boolean; // for dashboard widget mode
}

const urgencyConfig: Record<ActionUrgency, { label: string; color: string; bg: string; icon: typeof Zap }> = {
  now: { label: 'Now', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', icon: Zap },
  this_week: { label: 'This Week', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', icon: CalendarClock },
  monitor: { label: 'Monitor', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', icon: Eye },
};

const sourceConfig: Record<ActionSource, { color: string; icon: typeof Phone }> = {
  gong: { color: '#8b5cf6', icon: Phone },
  pylon: { color: '#f59e0b', icon: Ticket },
  grafana: { color: '#06b6d4', icon: Activity },
  product: { color: '#10b981', icon: Code },
  renewal: { color: '#ef4444', icon: Calendar },
};

function ActionCard({ action, compact }: { action: Action; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState(action.completed);
  const router = useRouter();
  const urgency = urgencyConfig[action.urgency];
  const UrgencyIcon = urgency.icon;

  return (
    <div
      className="group transition-all duration-300"
      style={{
        opacity: completed ? 0.5 : 1,
      }}
    >
      <div className="flex items-start gap-3 px-5 py-4">
        {/* Complete button */}
        <button
          onClick={() => setCompleted(!completed)}
          className="mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200"
          style={{
            border: completed ? 'none' : `1.5px solid ${urgency.color}40`,
            background: completed ? urgency.color : 'transparent',
          }}
        >
          {completed && <Check size={12} style={{ color: 'white' }} />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {/* Account badge */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                  <div className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold"
                    style={{ background: `${urgency.color}15`, color: urgency.color }}>
                    {action.accountLogo}
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {action.accountName}
                  </span>
                </div>

                {/* Source badge */}
                <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{ background: `${sourceConfig[action.source].color}12`, color: sourceConfig[action.source].color }}>
                  {action.source}
                </span>

                {/* MRR */}
                <span className="text-[10px] flex items-center gap-0.5" style={{ color: 'var(--text-muted)' }}>
                  <DollarSign size={9} />{(action.mrr / 1000).toFixed(0)}k
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-medium mb-1" style={{
                color: completed ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: completed ? 'line-through' : 'none',
              }}>
                {action.title}
              </h3>

              {/* Reason */}
              {!compact && (
                <p className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {action.description}
                </p>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-3">
                {action.dueDate && (
                  <span className="text-[10px] font-medium flex items-center gap-1"
                    style={{ color: action.urgency === 'now' ? '#ef4444' : 'var(--text-muted)' }}>
                    <CalendarClock size={10} /> {action.dueDate}
                  </span>
                )}
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{action.createdAt}</span>

                {!compact && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-[10px] font-medium flex items-center gap-1 ml-auto transition-colors"
                    style={{ color: 'var(--accent-blue)' }}
                  >
                    {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    {expanded ? 'Hide' : 'Show'} signals
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Expanded: Signals */}
          {expanded && !compact && (
            <div className="mt-3 rounded-xl p-3 space-y-2"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', animation: 'fade-in 0.2s ease-out' }}>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                Why this action?
              </div>
              <p className="text-[11px] mb-3 italic" style={{ color: 'var(--text-secondary)' }}>
                {action.reason}
              </p>
              <div className="space-y-1.5">
                {action.signals.map((signal, i) => {
                  const src = sourceConfig[signal.source];
                  const SrcIcon = src.icon;
                  return (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <SrcIcon size={11} className="mt-0.5 shrink-0" style={{ color: src.color }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{signal.detail}</span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => router.push(`/account/${action.accountId}`)}
                className="flex items-center gap-1 text-[11px] font-medium mt-2 transition-colors"
                style={{ color: 'var(--accent-blue)' }}
              >
                View {action.accountName} <ArrowRight size={11} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ActionQueue({ actions, compact = false }: ActionQueueProps) {
  const groups: { urgency: ActionUrgency; items: Action[] }[] = [
    { urgency: 'now', items: actions.filter((a) => a.urgency === 'now') },
    { urgency: 'this_week', items: actions.filter((a) => a.urgency === 'this_week') },
    { urgency: 'monitor', items: actions.filter((a) => a.urgency === 'monitor') },
  ];

  const totalActive = actions.filter((a) => !a.completed).length;
  const nowCount = groups[0].items.filter((a) => !a.completed).length;

  return (
    <div className="glass-card overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: '150ms' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.15))' }}>
            <Zap size={13} style={{ color: '#ef4444' }} />
          </div>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Action Queue</h2>
        </div>
        <div className="flex items-center gap-2">
          {nowCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse"
              style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
              {nowCount} urgent
            </span>
          )}
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>
            {totalActive} actions
          </span>
        </div>
      </div>

      {/* Groups */}
      {groups.map(({ urgency, items }) => {
        if (compact && urgency === 'monitor') return null; // Hide monitor in compact mode
        if (items.length === 0) return null;

        const config = urgencyConfig[urgency];
        const Icon = config.icon;

        return (
          <div key={urgency}>
            {/* Group header */}
            <div className="px-5 py-2.5 flex items-center gap-2 border-b"
              style={{ background: config.bg, borderColor: 'var(--border)' }}>
              <Icon size={12} style={{ color: config.color }} />
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: config.color }}>
                {config.label}
              </span>
              <span className="text-[10px] ml-auto" style={{ color: `${config.color}90` }}>
                {items.filter(i => !i.completed).length} pending
              </span>
            </div>

            {/* Items */}
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {(compact ? items.slice(0, 3) : items).map((action, i) => (
                <div key={action.id}
                  style={{ opacity: 0, animation: `fade-in 0.3s ease-out ${i * 50}ms forwards` }}>
                  <ActionCard action={action} compact={compact} />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Footer */}
      {compact && (
        <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><CircleCheck size={10} style={{ color: '#10b981' }} /> AI-prioritized</span>
            <span>Updated 2 min ago</span>
          </div>
          <a href="/actions" className="text-[11px] font-medium flex items-center gap-1" style={{ color: 'var(--accent-blue)' }}>
            View all <ArrowRight size={11} />
          </a>
        </div>
      )}
    </div>
  );
}
