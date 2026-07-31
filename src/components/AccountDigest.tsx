'use client';

import { Sparkles, Send, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export interface DigestEntry {
  section: string;
  source: 'health' | 'gong' | 'pylon' | 'product';
  severity: 'critical' | 'warning' | 'info' | 'positive';
  content: string;
}

interface AccountDigestProps {
  accountName: string;
  channelName: string;
  healthScore: number;
  digest: DigestEntry[];
  actions: string[];
  generatedAt: string;
}

const SOURCE_META: Record<DigestEntry['source'], { label: string; color: string; bg: string }> = {
  health:  { label: 'HEALTH',  color: '#06b6d4', bg: 'rgba(6,182,212,0.08)'   },
  gong:    { label: 'GONG',    color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)'  },
  pylon:   { label: 'PYLON',   color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
  product: { label: 'PRODUCT', color: '#10b981', bg: 'rgba(16,185,129,0.08)'  },
};

const SEVERITY_ORDER: Record<DigestEntry['severity'], number> = {
  critical: 0, warning: 1, info: 2, positive: 3,
};

const SEVERITY_STYLE: Record<DigestEntry['severity'], { dot: string; border: string; bg: string }> = {
  critical: { dot: '#ef4444', border: 'rgba(239,68,68,0.5)',  bg: 'rgba(239,68,68,0.04)'  },
  warning:  { dot: '#f59e0b', border: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.03)' },
  info:     { dot: '#3b82f6', border: 'rgba(59,130,246,0.2)', bg: 'transparent'            },
  positive: { dot: '#10b981', border: 'rgba(16,185,129,0.2)', bg: 'transparent'            },
};

function getHealthColor(score: number) {
  if (score >= 85) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -6 },
  show:   { opacity: 1, x: 0, transition: { ease: 'easeOut' as const, duration: 0.28 } },
};

const actionVariants = {
  hidden: { opacity: 0, y: 4 },
  show:   { opacity: 1, y: 0, transition: { ease: 'easeOut' as const, duration: 0.24 } },
};

export default function AccountDigest({
  accountName,
  channelName,
  healthScore,
  digest,
  actions,
  generatedAt,
}: AccountDigestProps) {
  const hColor = getHealthColor(healthScore);
  const sorted = [...digest].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  const sourceLabels = [...new Set(sorted.map((d) => SOURCE_META[d.source].label))];

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: 'easeOut', duration: 0.4 }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(168,85,247,0.12)', boxShadow: '0 0 12px rgba(168,85,247,0.15)' }}
          >
            <Sparkles size={14} style={{ color: '#a855f7' }} />
          </div>
          <div>
            <h2 className="text-sm font-semibold leading-none mb-0.5" style={{ color: 'var(--text-primary)' }}>
              AI Intelligence Brief
            </h2>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {accountName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{
              background: `${hColor}10`,
              border: `1px solid ${hColor}25`,
              boxShadow: `0 0 12px ${hColor}15`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full status-dot"
              style={{ background: hColor, color: hColor }}
            />
            <span className="text-sm font-bold tabular-nums" style={{ color: hColor }}>
              {healthScore}
            </span>
          </div>

          <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <Clock size={10} /> {generatedAt}
          </span>

          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-opacity hover:opacity-80"
            style={{
              background: 'rgba(16,185,129,0.08)',
              color: '#10b981',
              border: '1px solid rgba(16,185,129,0.18)',
            }}
          >
            <Send size={10} /> Post to {channelName}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* ── Signals ── */}
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            Signals
          </div>

          <motion.div
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {sorted.map((entry, i) => {
              const src = SOURCE_META[entry.source];
              const sev = SEVERITY_STYLE[entry.severity];
              return (
                <motion.div
                  key={i}
                  variants={rowVariants}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
                  style={{
                    background: sev.bg || 'rgba(0,0,0,0.025)',
                    border: '1px solid var(--border)',
                    boxShadow: entry.severity === 'critical' || entry.severity === 'warning'
                      ? `inset 3px 0 0 ${sev.border}`
                      : 'inset 3px 0 0 transparent',
                  }}
                >
                  <div
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: sev.dot, boxShadow: `0 0 6px ${sev.dot}` }}
                  />
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 tracking-wide"
                    style={{ background: src.bg, color: src.color }}
                  >
                    {src.label}
                  </span>
                  <p
                    className="text-[11px] leading-relaxed flex-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {entry.content}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Recommended Actions ── */}
        {actions.length > 0 && (
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div
              className="text-[10px] font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Recommended Actions
            </div>
            <motion.div
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {actions.map((action, i) => (
                <motion.div key={i} variants={actionVariants} className="flex items-start gap-3">
                  <span
                    className="text-[10px] font-bold tabular-nums shrink-0 mt-0.5 w-4 text-right"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {i + 1}.
                  </span>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {action}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* ── Footer ── */}
        <div
          className="pt-3 border-t flex items-center gap-2 text-[10px]"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <span>Generated by Pulse AI</span>
          <span>·</span>
          <span>Sources: {sourceLabels.join(', ')}, Grafana</span>
        </div>
      </div>
    </motion.div>
  );
}
