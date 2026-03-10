'use client';

import { useState } from 'react';
import { Hash, Bot, Clock, ChevronDown, ChevronUp, Sparkles, Send } from 'lucide-react';

interface DigestEntry {
  section: string;
  icon: string;
  content: string;
}

interface SlackDigestPreviewProps {
  accountName: string;
  channelName: string;
  digest: DigestEntry[];
  generatedAt: string;
}

export default function SlackDigestPreview({ accountName, channelName, digest, generatedAt }: SlackDigestPreviewProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
            <Sparkles size={13} style={{ color: '#a855f7' }} />
          </div>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Account Digest</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <Clock size={10} /> {generatedAt}
          </span>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
            style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
            <Send size={10} /> Post to Slack
          </button>
        </div>
      </div>

      {/* Slack Message Preview */}
      <div className="p-5">
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)' }}>
          {/* Slack-style header */}
          <div className="px-4 py-3 flex items-center gap-2 border-b" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.01)' }}>
            <Hash size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{channelName}</span>
          </div>

          {/* Message */}
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Bot avatar */}
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}>
                <Bot size={16} style={{ color: 'white' }} />
              </div>

              <div className="flex-1 min-w-0">
                {/* Bot name + timestamp */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Pulse Bot</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>APP</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Today at 9:00 AM</span>
                </div>

                {/* Digest title */}
                <div className="mb-3">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    📊 Daily Account Digest — {accountName}
                  </span>
                </div>

                {/* Collapsible content */}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1 mb-3 text-[11px] font-medium"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {expanded ? 'Collapse' : 'Expand'} digest
                </button>

                {expanded && (
                  <div className="space-y-3"
                    style={{ animation: 'fade-in 0.2s ease-out' }}>
                    {digest.map((entry, i) => (
                      <div key={i} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--border-light)' }}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-xs">{entry.icon}</span>
                          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                            {entry.section}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                          {entry.content}
                        </p>
                      </div>
                    ))}

                    {/* Footer */}
                    <div className="pt-2 flex items-center gap-3 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      <span>Generated by Pulse AI</span>
                      <span>·</span>
                      <span>Sources: Grafana, Gong, Pylon, Product Data</span>
                    </div>
                  </div>
                )}

                {/* Reactions */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[11px] px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                    👀 3
                  </span>
                  <span className="text-[11px] px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                    ✅ 1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
