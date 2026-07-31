'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Account } from '@/data/mock';

interface Props { accounts: Account[] }

// ── Projection params ──────────────────────────────────────────────────────
const CX    = 450;
const CY    = 148;
const RO    = 150;
const RI    = 92;
const SY    = 0.42;
const DEPTH = 32;
const GAP   = 0.022;

// ── Colors ─────────────────────────────────────────────────────────────────
const COLOR: Record<string, { top: string; side: string; rim: string }> = {
  healthy:  { top: '#4ade80', side: '#22c55e', rim: '#16a34a' },
  warning:  { top: '#fcd34d', side: '#f59e0b', rim: '#d97706' },
  critical: { top: '#fca5a5', side: '#f87171', rim: '#dc2626' },
};

const COLOR_HOVER: Record<string, { top: string; side: string; rim: string }> = {
  healthy:  { top: '#86efac', side: '#4ade80', rim: '#22c55e' },
  warning:  { top: '#fde68a', side: '#fcd34d', rim: '#f59e0b' },
  critical: { top: '#fecaca', side: '#fca5a5', rim: '#f87171' },
};

const STATUS_LABEL: Record<string, string> = {
  healthy: 'Healthy', warning: 'Warning', critical: 'Critical',
};

const STATUS_COLOR: Record<string, string> = {
  healthy: '#22c55e', warning: '#f59e0b', critical: '#ef4444',
};

// ── Geometry helpers ────────────────────────────────────────────────────────
function px(theta: number, r: number, dy = 0) {
  return `${(CX + r * Math.cos(theta)).toFixed(2)},${(CY + r * Math.sin(theta) * SY + dy).toFixed(2)}`;
}

function sector(a1: number, a2: number, ro: number, ri: number, dy = 0) {
  const large = (a2 - a1) > Math.PI ? 1 : 0;
  return [
    `M ${px(a1, ro, dy)}`,
    `A ${ro} ${(ro * SY).toFixed(2)} 0 ${large} 1 ${px(a2, ro, dy)}`,
    `L ${px(a2, ri, dy)}`,
    `A ${ri} ${(ri * SY).toFixed(2)} 0 ${large} 0 ${px(a1, ri, dy)}`,
    'Z',
  ].join(' ');
}

function extrude(a1: number, a2: number) {
  const fa1 = Math.max(a1, 0);
  const fa2 = Math.min(a2, Math.PI);
  if (fa2 - fa1 < 0.001) return null;
  const large = (fa2 - fa1) > Math.PI ? 1 : 0;
  const sro = (RO * SY).toFixed(2);
  return [
    `M ${px(fa1, RO, 0)}`,
    `A ${RO} ${sro} 0 ${large} 1 ${px(fa2, RO, 0)}`,
    `L ${px(fa2, RO, DEPTH)}`,
    `A ${RO} ${sro} 0 ${large} 0 ${px(fa1, RO, DEPTH)}`,
    'Z',
  ].join(' ');
}

function rimLine(a1: number, a2: number) {
  const fa1 = Math.max(a1, 0);
  const fa2 = Math.min(a2, Math.PI);
  if (fa2 - fa1 < 0.001) return null;
  const large = (fa2 - fa1) > Math.PI ? 1 : 0;
  const sro = (RO * SY).toFixed(2);
  return `M ${px(fa1, RO, DEPTH)} A ${RO} ${sro} 0 ${large} 1 ${px(fa2, RO, DEPTH)}`;
}

// Truncate long account names for the center label
function truncate(name: string, max = 14) {
  return name.length > max ? name.slice(0, max - 1) + '…' : name;
}

export default function PortfolioDonut3D({ accounts }: Props) {
  const [hoveredId, setHoveredId]     = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const router = useRouter();

  const { segments, totalMrr, criticalCount, warningCount, healthyCount } = useMemo(() => {
    const sorted = [...accounts].sort((a, b) => {
      const o = { critical: 0, warning: 1, healthy: 2 } as Record<string, number>;
      return (o[a.status] ?? 2) - (o[b.status] ?? 2);
    });
    const totalMrr = sorted.reduce((s, a) => s + a.mrr, 0);
    let angle = -Math.PI / 2;

    const segs = sorted.map((acc) => {
      const fullSpan = (acc.mrr / totalMrr) * 2 * Math.PI;
      const a1 = angle + GAP / 2;
      const a2 = angle + fullSpan - GAP / 2;
      angle += fullSpan;
      const mid = (a1 + a2) / 2;
      return { acc, a1, a2, mid, isFront: Math.sin(mid) >= 0 };
    });

    return {
      segments: segs,
      totalMrr,
      criticalCount: accounts.filter(a => a.status === 'critical').length,
      warningCount:  accounts.filter(a => a.status === 'warning').length,
      healthyCount:  accounts.filter(a => a.status === 'healthy').length,
    };
  }, [accounts]);

  const back  = segments.filter(s => !s.isFront);
  const front = segments.filter(s =>  s.isFront);

  const hoveredAccount = hoveredId ? accounts.find(a => a.id === hoveredId) : null;

  const segmentOpacity = (acc: Account) => {
    if (!filterStatus) return 1;
    return acc.status === filterStatus ? 1 : 0.15;
  };

  const getColors = (acc: Account) => {
    const isActive = hoveredId === acc.id;
    return isActive
      ? (COLOR_HOVER[acc.status] ?? COLOR_HOVER.healthy)
      : (COLOR[acc.status] ?? COLOR.healthy);
  };

  const handleClick = (accId: string) => {
    router.push(`/account/${accId}`);
  };

  const toggleFilter = (status: string) => {
    setFilterStatus(prev => prev === status ? null : status);
  };

  return (
    <div className="w-full relative" style={{ height: 300 }}>
      <svg
        viewBox="0 0 900 300"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="rgba(0,0,0,0.10)" />
          </filter>
          <filter id="sliceHover" x="-10%" y="-20%" width="120%" height="140%">
            <feDropShadow dx="0" dy="-4" stdDeviation="6" floodColor="rgba(0,0,0,0.18)" />
          </filter>
        </defs>

        <g filter="url(#donutGlow)">
          {/* Pass 1: back top faces */}
          {back.map(({ acc, a1, a2 }, i) => {
            const c = getColors(acc);
            const isHovered = hoveredId === acc.id;
            return (
              <motion.path
                key={`b-${acc.id}`}
                d={sector(a1, a2, RO, RI)}
                fill={c.top}
                stroke="white" strokeWidth="1.5"
                opacity={segmentOpacity(acc)}
                style={{
                  cursor: 'pointer',
                  filter: isHovered ? 'brightness(1.08)' : 'none',
                  transformOrigin: `${CX}px ${CY}px`,
                }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: segmentOpacity(acc), scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.45, ease: 'easeOut' }}
                onMouseEnter={() => setHoveredId(acc.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleClick(acc.id)}
              />
            );
          })}

          {/* Pass 2: extrusion side faces */}
          {segments.map(({ acc, a1, a2 }, i) => {
            const c = getColors(acc);
            const extPath = extrude(a1, a2);
            const rimPath = rimLine(a1, a2);
            if (!extPath) return null;
            return (
              <motion.g
                key={`e-${acc.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: segmentOpacity(acc) }}
                transition={{ delay: 0.15 + i * 0.03, duration: 0.4 }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredId(acc.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleClick(acc.id)}
              >
                <path d={extPath} fill={c.side} stroke="white" strokeWidth="0.5" />
                {rimPath && (
                  <path d={rimPath} fill="none" stroke={c.rim} strokeWidth="1" opacity="0.6" />
                )}
              </motion.g>
            );
          })}

          {/* Pass 3: front top faces */}
          {front.map(({ acc, a1, a2 }, i) => {
            const c = getColors(acc);
            const isHovered = hoveredId === acc.id;
            return (
              <motion.path
                key={`f-${acc.id}`}
                d={sector(a1, a2, RO, RI)}
                fill={c.top}
                stroke="white" strokeWidth="1.5"
                opacity={segmentOpacity(acc)}
                style={{
                  cursor: 'pointer',
                  filter: isHovered ? 'brightness(1.08)' : 'none',
                  transformOrigin: `${CX}px ${CY}px`,
                }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: segmentOpacity(acc), scale: 1 }}
                transition={{ delay: 0.08 + i * 0.04, duration: 0.45, ease: 'easeOut' }}
                onMouseEnter={() => setHoveredId(acc.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleClick(acc.id)}
              />
            );
          })}
        </g>

        {/* Center label — swaps to account preview on hover */}
        {hoveredAccount ? (
          <g style={{ pointerEvents: 'none' }}>
            <text x={CX} y={CY - 14} textAnchor="middle"
              fontSize="13" fontWeight="700" fill="#0C0B14"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {truncate(hoveredAccount.name)}
            </text>
            <circle cx={CX - 28} cy={CY + 2} r="4"
              fill={STATUS_COLOR[hoveredAccount.status]} />
            <text x={CX - 20} y={CY + 6} textAnchor="start"
              fontSize="9" fontWeight="600" fill={STATUS_COLOR[hoveredAccount.status]}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {hoveredAccount.status.toUpperCase()}
            </text>
            <text x={CX} y={CY + 22} textAnchor="middle"
              fontSize="11" fontWeight="500" fill="#9490B0"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              ${(hoveredAccount.mrr / 1000).toFixed(0)}k MRR · click to open
            </text>
          </g>
        ) : (
          <g style={{ pointerEvents: 'none' }}>
            <text x={CX} y={CY - 6} textAnchor="middle"
              fontSize="22" fontWeight="800" fill="#0C0B14"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {accounts.length}
            </text>
            <text x={CX} y={CY + 11} textAnchor="middle"
              fontSize="8.5" fontWeight="600" fill="#9490B0"
              letterSpacing="0.1em"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ACCOUNTS
            </text>
          </g>
        )}

        {/* Right-side summary — clickable status filters */}
        <g transform="translate(660, 110)">
          {[
            { label: 'HEALTHY',  count: healthyCount,  color: '#22c55e', status: 'healthy'  },
            { label: 'WARNING',  count: warningCount,  color: '#f59e0b', status: 'warning'  },
            { label: 'CRITICAL', count: criticalCount, color: '#ef4444', status: 'critical' },
          ].map(({ label, count, color, status }, i) => {
            const isFiltered = filterStatus === status;
            return (
              <g
                key={label}
                transform={`translate(0, ${i * 38})`}
                onClick={() => toggleFilter(status)}
                style={{ cursor: 'pointer', opacity: filterStatus && !isFiltered ? 0.35 : 1 }}
              >
                <rect x="-4" y="-4" width="100" height="34" rx="6"
                  fill={isFiltered ? `${color}12` : 'transparent'} />
                <rect x="0" y="0" width="4" height="28" rx="2"
                  fill={color} opacity={isFiltered ? 1 : 0.7} />
                <text x="14" y="11" fontSize="18" fontWeight="800" fill="#0C0B14"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {count}
                </text>
                <text x="14" y="24" fontSize="8" fontWeight="600" fill="#9490B0"
                  letterSpacing="0.08em"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {label}
                </text>
              </g>
            );
          })}

          <g transform="translate(0, 128)">
            <text fontSize="8" fill="#9490B0" letterSpacing="0.06em"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              PORTFOLIO MRR
            </text>
            <text y="18" fontSize="16" fontWeight="700" fill="#0C0B14"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              ${(accounts.reduce((s, a) => s + a.mrr, 0) / 1000).toFixed(0)}k
            </text>
          </g>
        </g>

        {/* Caption */}
        <text x={CX} y={280} textAnchor="middle"
          fontSize="8" fill="#C0BCDC" letterSpacing="0.08em"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          SLICE SIZE = MRR · COLOR = HEALTH STATUS · CLICK TO OPEN ACCOUNT
        </text>
      </svg>
    </div>
  );
}
