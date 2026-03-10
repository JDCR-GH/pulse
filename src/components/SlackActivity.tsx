'use client';

import { SlackMessage } from '@/data/mock';
import { Hash, MessageCircle, AlertTriangle, PartyPopper, HelpCircle, FileText } from 'lucide-react';

interface SlackActivityProps {
  messages: SlackMessage[];
}

const typeConfig = {
  message: { color: 'var(--text-secondary)', icon: MessageCircle },
  escalation: { color: '#ef4444', icon: AlertTriangle },
  update: { color: '#3b82f6', icon: FileText },
  question: { color: '#f59e0b', icon: HelpCircle },
  celebration: { color: '#10b981', icon: PartyPopper },
};

export default function SlackActivity({ messages }: SlackActivityProps) {
  if (messages.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Hash size={24} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No Slack activity for this account</p>
      </div>
    );
  }

  // Group by channel
  const channels = [...new Set(messages.map(m => m.channel))];

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
          <Hash size={13} style={{ color: '#3b82f6' }} />
        </div>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Slack Activity</h2>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full ml-auto"
          style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
          {messages.length} messages
        </span>
      </div>

      {channels.map((channel) => (
        <div key={channel}>
          {/* Channel header */}
          <div className="px-5 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.01)' }}>
            <Hash size={12} style={{ color: 'var(--text-muted)' }} />
            <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{channel}</span>
          </div>

          {/* Messages */}
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {messages.filter(m => m.channel === channel).map((msg, i) => {
              const config = typeConfig[msg.type];
              const Icon = config.icon;

              return (
                <div key={msg.id} className="px-5 py-3.5"
                  style={{
                    borderLeft: msg.type === 'escalation' ? '2px solid #ef4444' : '2px solid transparent',
                    background: msg.type === 'escalation' ? 'rgba(239, 68, 68, 0.03)' : 'transparent',
                    opacity: 0,
                    animation: `fade-in 0.3s ease-out ${i * 60}ms forwards`,
                  }}>
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
                      {msg.authorAvatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Author & timestamp */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{msg.author}</span>
                        <Icon size={11} style={{ color: config.color }} />
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                      </div>

                      {/* Message content */}
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {msg.content}
                      </p>

                      {/* Reactions & Thread */}
                      <div className="flex items-center gap-3 mt-2">
                        {msg.reactions?.map((r, j) => (
                          <span key={j} className="text-[11px] px-1.5 py-0.5 rounded-md flex items-center gap-1"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                            {r.emoji} <span style={{ color: 'var(--text-muted)' }}>{r.count}</span>
                          </span>
                        ))}
                        {msg.thread && (
                          <span className="text-[10px] flex items-center gap-1 ml-auto"
                            style={{ color: 'var(--accent-blue)' }}>
                            <MessageCircle size={10} />
                            {msg.thread.replies} replies · {msg.thread.lastReply}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
