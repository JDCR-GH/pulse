'use client';

import { GongCall } from '@/data/mock';
import { Phone, TrendingUp, TrendingDown, Minus, Clock, Users, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface GongActivityProps {
  calls: GongCall[];
}

const sentimentConfig = {
  positive: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', label: 'Positive', icon: TrendingUp },
  neutral: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', label: 'Neutral', icon: Minus },
  negative: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', label: 'Negative', icon: TrendingDown },
};

function SentimentBar({ score }: { score: number }) {
  const normalized = ((score + 1) / 2) * 100; // -1..1 → 0..100
  const color = score > 0.3 ? '#10b981' : score > -0.3 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${normalized}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold tabular-nums" style={{ color }}>{score > 0 ? '+' : ''}{score.toFixed(2)}</span>
    </div>
  );
}

function TalkRatioBar({ us, them }: { us: number; them: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px]" style={{ color: 'var(--accent-blue)' }}>Us {us}%</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden flex">
        <div className="h-full" style={{ width: `${us}%`, background: 'var(--accent-blue)', opacity: 0.6 }} />
        <div className="h-full" style={{ width: `${them}%`, background: 'var(--accent-purple)', opacity: 0.6 }} />
      </div>
      <span className="text-[10px]" style={{ color: 'var(--accent-purple)' }}>{them}% Them</span>
    </div>
  );
}

export default function GongActivity({ calls }: GongActivityProps) {
  const [expandedCall, setExpandedCall] = useState<string | null>(calls[0]?.id || null);

  if (calls.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Phone size={24} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No Gong calls recorded for this account</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
          <Phone size={13} style={{ color: '#8b5cf6' }} />
        </div>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Gong Calls</h2>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full ml-auto"
          style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
          {calls.length} calls
        </span>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {calls.map((call, i) => {
          const sentiment = sentimentConfig[call.sentiment];
          const SentimentIcon = sentiment.icon;
          const isExpanded = expandedCall === call.id;

          return (
            <div key={call.id}
              style={{ opacity: 0, animation: `fade-in 0.3s ease-out ${i * 80}ms forwards` }}>
              {/* Call Header */}
              <button
                onClick={() => setExpandedCall(isExpanded ? null : call.id)}
                className="w-full px-5 py-4 flex items-start gap-3 text-left transition-colors duration-200 hover:bg-white/[0.01]"
              >
                {/* Sentiment dot */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: sentiment.bg }}>
                  <SentimentIcon size={14} style={{ color: sentiment.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{call.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                      style={{ background: sentiment.bg, color: sentiment.color }}>
                      {sentiment.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1"><Clock size={10} />{call.date}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{call.duration}</span>
                    <span className="flex items-center gap-1"><Users size={10} />{call.participants.length} people</span>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} className="mt-1" />
                ) : (
                  <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} className="mt-1" />
                )}
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-4"
                  style={{ animation: 'fade-in 0.2s ease-out' }}>
                  {/* AI Summary */}
                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <MessageSquare size={12} style={{ color: 'var(--accent-purple)' }} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-purple)' }}>AI Summary</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{call.summary}</p>
                  </div>

                  {/* Metrics row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                      <span className="text-[10px] font-medium uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Sentiment Score</span>
                      <SentimentBar score={call.sentimentScore} />
                    </div>
                    <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                      <span className="text-[10px] font-medium uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Talk Ratio</span>
                      <TalkRatioBar us={call.talkRatio.us} them={call.talkRatio.them} />
                    </div>
                  </div>

                  {/* Key Moments */}
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Key Moments</span>
                    <div className="space-y-1.5">
                      {call.keyMoments.map((moment, j) => (
                        <div key={j} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <div className="w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--accent-purple)' }} />
                          {moment}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Next Steps</span>
                    <div className="space-y-1.5">
                      {call.nextSteps.map((step, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <div className="w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 mt-0.5"
                            style={{ borderColor: 'var(--border-light)' }}>
                            <div className="w-1.5 h-1.5 rounded-sm" style={{ background: 'var(--border-light)' }} />
                          </div>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5">
                    {call.topics.map((topic) => (
                      <span key={topic} className="text-[10px] font-medium px-2 py-1 rounded-lg"
                        style={{ background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6' }}>
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Participants */}
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Participants</span>
                    <div className="flex flex-wrap gap-2">
                      {call.participants.map((p) => (
                        <span key={p} className="text-[11px] px-2 py-1 rounded-lg flex items-center gap-1.5"
                          style={{ background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                            style={{ background: 'var(--border-light)', color: 'var(--text-muted)' }}>
                            {p.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          {p}
                        </span>
                      ))}
                    </div>
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
