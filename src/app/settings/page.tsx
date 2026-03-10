'use client';

import Sidebar from '@/components/Sidebar';
import {
  Activity, Phone, Ticket, Hash, Bot, Sparkles, Users,
  Check, X, Clock, ToggleLeft, ToggleRight,
  ChevronDown, Settings,
} from 'lucide-react';
import { useState } from 'react';

interface Integration {
  name: string;
  description: string;
  icon: typeof Activity;
  color: string;
  connected: boolean;
  lastSync?: string;
  details?: string;
}

const integrations: Integration[] = [
  { name: 'Grafana', description: 'Pull infrastructure metrics, uptime, error rates, and latency data', icon: Activity, color: '#06b6d4', connected: true, lastSync: '2 min ago', details: 'grafana.coderabbit.internal' },
  { name: 'Gong', description: 'Import call recordings, transcripts, sentiment analysis, and action items', icon: Phone, color: '#8b5cf6', connected: true, lastSync: '15 min ago', details: 'OAuth connected' },
  { name: 'Pylon', description: 'Sync support tickets, CSAT scores, and response time metrics', icon: Ticket, color: '#f59e0b', connected: true, lastSync: '5 min ago', details: 'API key configured' },
  { name: 'Slack', description: 'Post account digests, alerts, and pre-call briefs to channels', icon: Hash, color: '#3b82f6', connected: true, lastSync: '1 min ago', details: 'CodeRabbit Workspace' },
];

const team = [
  { name: 'Jax', role: 'Technical CSM', avatar: 'JX', accounts: 32, color: '#06b6d4' },
  { name: 'Sarah Chen', role: 'Senior CSM', avatar: 'SC', accounts: 28, color: '#8b5cf6' },
  { name: 'Marcus Wright', role: 'CSM', avatar: 'MW', accounts: 31, color: '#3b82f6' },
  { name: 'Aisha Patel', role: 'CSM', avatar: 'AP', accounts: 29, color: '#10b981' },
  { name: 'James Liu', role: 'CSM', avatar: 'JL', accounts: 27, color: '#f59e0b' },
];

function Toggle({ enabled, label }: { enabled: boolean; label: string }) {
  const [on, setOn] = useState(enabled);
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <button onClick={() => setOn(!on)}>
        {on ? (
          <ToggleRight size={28} style={{ color: '#10b981' }} />
        ) : (
          <ToggleLeft size={28} style={{ color: 'var(--text-muted)' }} />
        )}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <div className="mesh-bg" />
      <Sidebar />

      <main className="ml-[240px] relative z-10">
        <header className="sticky top-0 z-30 px-8 h-16 flex items-center border-b"
          style={{ background: 'rgba(7, 7, 13, 0.8)', backdropFilter: 'blur(16px)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Settings size={18} style={{ color: 'var(--text-secondary)' }} />
            <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
          </div>
        </header>

        <div className="p-8 max-w-5xl">
          {/* Integrations */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <div className="w-1 h-4 rounded-full" style={{ background: 'var(--accent-blue)' }} />
              Integrations
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {integrations.map((int) => (
                <div key={int.name} className="glass-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${int.color}12` }}>
                        <int.icon size={20} style={{ color: int.color }} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{int.name}</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{int.details}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {int.connected ? (
                        <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg"
                          style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                          <Check size={10} /> Connected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg"
                          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                          <X size={10} /> Disconnected
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{int.description}</p>
                  <div className="flex items-center justify-between">
                    {int.lastSync && (
                      <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={9} /> Last sync: {int.lastSync}
                      </span>
                    )}
                    <button className="text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors"
                      style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Slack Bot Settings */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <div className="w-1 h-4 rounded-full" style={{ background: '#8b5cf6' }} />
              Slack Bot Automation
            </h2>
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}>
                  <Bot size={20} style={{ color: 'white' }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Pulse Bot</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Automated account intelligence for your Slack workspace</div>
                </div>
              </div>

              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                <Toggle enabled={true} label="Daily account digests" />
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Digest time</span>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    9:00 AM <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
                <Toggle enabled={true} label="Pre-call briefs (30 min before Gong meetings)" />
                <Toggle enabled={true} label="Post-call summaries with action items" />
                <Toggle enabled={true} label="Risk alerts (converging negative signals)" />
                <Toggle enabled={false} label="Weekly portfolio digest" />
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Weekly digest day</span>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    Monday <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Channel naming</span>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    #acc-{'{'}<span style={{ color: '#8b5cf6' }}>account-name</span>{'}'}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Settings */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <div className="w-1 h-4 rounded-full" style={{ background: '#a855f7' }} />
              AI Configuration
            </h2>
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                  <Sparkles size={20} style={{ color: '#a855f7' }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Claude AI</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Powers digest generation, risk analysis, and summarization</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Model</label>
                  <div className="flex gap-2">
                    {['Claude Sonnet 4.6', 'Claude Opus 4.6'].map((model, i) => (
                      <button key={model} className="px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                        style={{
                          background: i === 0 ? 'rgba(168, 85, 247, 0.1)' : 'var(--bg-card)',
                          border: `1px solid ${i === 0 ? 'rgba(168, 85, 247, 0.3)' : 'var(--border)'}`,
                          color: i === 0 ? '#a855f7' : 'var(--text-secondary)',
                        }}>
                        {model}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Tone</label>
                  <div className="flex gap-2">
                    {['Professional', 'Casual', 'Concise'].map((tone, i) => (
                      <button key={tone} className="px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                        style={{
                          background: i === 2 ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
                          border: `1px solid ${i === 2 ? 'rgba(59, 130, 246, 0.3)' : 'var(--border)'}`,
                          color: i === 2 ? '#3b82f6' : 'var(--text-secondary)',
                        }}>
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Custom Prompt Template</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl p-3 text-xs resize-none focus:outline-none"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    defaultValue={`You are Pulse, an AI assistant for CodeRabbit's Customer Success team. Generate concise, actionable account digests that help CSMs stay informed about their portfolio. Focus on changes, risks, and recommended actions. Be direct and data-driven.`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <div className="w-1 h-4 rounded-full" style={{ background: '#10b981' }} />
              Team
            </h2>
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <Users size={14} style={{ color: 'var(--text-secondary)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{team.length} members</span>
                </div>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {team.reduce((sum, m) => sum + m.accounts, 0)} total accounts
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {team.map((member) => (
                  <div key={member.name} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}80)`, color: 'white' }}>
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{member.name}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{member.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{member.accounts}</div>
                      <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>accounts</div>
                    </div>
                    {/* Mini load bar */}
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full"
                        style={{
                          width: `${(member.accounts / 35) * 100}%`,
                          background: member.accounts > 30 ? '#f59e0b' : '#10b981',
                        }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
