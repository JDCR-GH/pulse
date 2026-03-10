'use client';

import { useState } from 'react';
import { Ticket, ChevronDown, ChevronUp, Clock, User, Star } from 'lucide-react';

// Inline type to avoid dependency on mock data being rewritten
interface PylonTicket {
  id: string;
  accountId: string;
  title: string;
  status: 'open' | 'in_progress' | 'waiting' | 'resolved';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignee: string;
  requester: string;
  summary: string;
  responseTime?: string;
  csat?: number;
}

interface PylonTicketsProps {
  tickets: PylonTicket[];
}

const statusConfig = {
  open: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'Open' },
  in_progress: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', label: 'In Progress' },
  waiting: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', label: 'Waiting' },
  resolved: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', label: 'Resolved' },
};

const priorityConfig = {
  urgent: { color: '#ef4444', pulse: true },
  high: { color: '#f97316', pulse: false },
  medium: { color: '#f59e0b', pulse: false },
  low: { color: '#6b7280', pulse: false },
};

const statusOrder = { open: 0, in_progress: 1, waiting: 2, resolved: 3 };
const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

export default function PylonTickets({ tickets }: PylonTicketsProps) {
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const sorted = [...tickets].sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    return statusOrder[a.status] - statusOrder[b.status];
  });

  if (tickets.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Ticket size={24} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No support tickets for this account</p>
      </div>
    );
  }

  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
          <Ticket size={13} style={{ color: '#f59e0b' }} />
        </div>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Pylon Tickets</h2>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full ml-auto"
          style={{ background: openCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: openCount > 0 ? '#ef4444' : '#10b981' }}>
          {openCount} open
        </span>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {sorted.map((ticket, i) => {
          const status = statusConfig[ticket.status];
          const priority = priorityConfig[ticket.priority];
          const isExpanded = expandedTicket === ticket.id;

          return (
            <div key={ticket.id}
              style={{ opacity: 0, animation: `fade-in 0.3s ease-out ${i * 60}ms forwards` }}>
              <button
                onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                className="w-full px-5 py-3.5 flex items-start gap-3 text-left transition-colors duration-200 hover:bg-white/[0.01]"
              >
                {/* Priority dot */}
                <div className="mt-1.5 shrink-0 relative">
                  <div className="w-2 h-2 rounded-full" style={{ background: priority.color }} />
                  {priority.pulse && (
                    <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping" style={{ background: priority.color, opacity: 0.4 }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{ticket.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                      style={{ background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded uppercase"
                      style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                      {ticket.priority}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(139, 92, 246, 0.06)', color: '#8b5cf6' }}>
                      {ticket.category}
                    </span>
                    {ticket.responseTime && (
                      <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={9} /> {ticket.responseTime}
                      </span>
                    )}
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} className="mt-1" />
                ) : (
                  <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} className="mt-1" />
                )}
              </button>

              {isExpanded && (
                <div className="px-5 pb-4 ml-5 space-y-3" style={{ animation: 'fade-in 0.2s ease-out' }}>
                  <p className="text-xs leading-relaxed rounded-lg p-3"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    {ticket.summary}
                  </p>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <User size={10} /> Assignee: <span style={{ color: 'var(--text-secondary)' }}>{ticket.assignee}</span>
                    </span>
                    <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <User size={10} /> Requester: <span style={{ color: 'var(--text-secondary)' }}>{ticket.requester}</span>
                    </span>
                    {ticket.csat && (
                      <span className="flex items-center gap-1" style={{ color: '#f59e0b' }}>
                        <Star size={10} fill="#f59e0b" /> {ticket.csat}/5
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    <span>Created: {ticket.createdAt}</span>
                    <span>Updated: {ticket.updatedAt}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
