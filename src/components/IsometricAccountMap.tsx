'use client';

import { motion } from 'framer-motion';
import { Account } from '@/data/mock';

interface Props { accounts: Account[] }

const TW = 76;   // tile width
const TH = 38;   // tile height (TW/2)

const TIER_BH: Record<string, number> = {
  Enterprise: 62,
  Business:   40,
  Starter:    22,
};

const HEALTH_FILL: Record<string, { top: string; left: string; right: string; stroke: string; badge: string }> = {
  healthy:  { top: '#dcfce7', left: '#86efac', right: '#22c55e', stroke: '#16a34a', badge: '#15803d' },
  warning:  { top: '#fef9c3', left: '#fde68a', right: '#f59e0b', stroke: '#b45309', badge: '#92400e' },
  critical: { top: '#fee2e2', left: '#fca5a5', right: '#ef4444', stroke: '#b91c1c', badge: '#991b1b' },
};

// Badge offsets per grid slot [dx, dy from topApex]
const BADGE_OFFSETS: [number, number][] = [
  [-68, -28],
  [ 58, -28],
  [ 62, -24],
  [ 66, -18],
  [-72, -22],
  [-62, -30],
  [ 60, -30],
  [ 64, -20],
];

const GRID: [number, number][] = [
  [0,0],[1,0],[2,0],[3,0],
  [0,1],[1,1],[2,1],[3,1],
];

const ORIGIN = { x: 438, y: 215 };

function isoCenter(col: number, row: number) {
  return {
    cx: ORIGIN.x + (col - row) * (TW / 2),
    cy: ORIGIN.y + (col + row) * (TH / 2),
  };
}

function boxGeometry(cx: number, cy: number, bh: number) {
  const hw = TW / 2;
  const hh = TH / 2;
  return {
    topFace:   [[cx, cy - hh - bh], [cx + hw, cy - bh], [cx, cy + hh - bh], [cx - hw, cy - bh]],
    rightFace: [[cx + hw, cy - bh], [cx, cy + hh - bh], [cx, cy + hh],      [cx + hw, cy]],
    leftFace:  [[cx - hw, cy - bh], [cx, cy + hh - bh], [cx, cy + hh],      [cx - hw, cy]],
    topApex:   [cx, cy - hh - bh] as [number, number],
    gndFront:  [cx, cy + hh]      as [number, number],
  };
}

function toPoints(pts: number[][]): string {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

export default function IsometricAccountMap({ accounts }: Props) {
  const items = [...accounts]
    .sort((a, b) => {
      const order = { critical: 0, warning: 1, healthy: 2 };
      return order[a.status] - order[b.status];
    })
    .slice(0, 8);

  // Sort for painter's algorithm (back to front = ascending col+row)
  const renderOrder = items
    .map((acc, i) => ({ acc, i, pos: GRID[i] ?? [0, 0] }))
    .sort((a, b) => (a.pos[0] + a.pos[1]) - (b.pos[0] + b.pos[1]));

  return (
    <div className="w-full relative select-none" style={{ height: 320 }}>
      <svg viewBox="0 0 900 320" className="w-full h-full">
        {/* Dashed iso grid lines */}
        <defs>
          <pattern id="isogrid" x="0" y="0" width="38" height="19" patternUnits="userSpaceOnUse">
            <path d="M 0 9.5 L 19 0 L 38 9.5" fill="none" stroke="rgba(100,90,160,0.07)" strokeWidth="0.6" strokeDasharray="2,5" />
          </pattern>
        </defs>
        <rect width="900" height="320" fill="url(#isogrid)" />

        {renderOrder.map(({ acc, i, pos }) => {
          const [col, row] = pos;
          const { cx, cy } = isoCenter(col, row);
          const bh = TIER_BH[acc.tier] ?? 38;
          const geo = boxGeometry(cx, cy, bh);
          const fill = HEALTH_FILL[acc.status] ?? HEALTH_FILL.healthy;
          const [bdx, bdy] = BADGE_OFFSETS[i] ?? [50, -30];

          const bx = geo.topApex[0] + bdx;
          const by = geo.topApex[1] + bdy;
          const label = acc.name.length > 9 ? acc.name.slice(0, 9).toUpperCase() : acc.name.toUpperCase();

          return (
            <motion.g
              key={acc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06, ease: 'easeOut', duration: 0.45 }}
            >
              {/* Dashed connector */}
              <line
                x1={bx} y1={by + 10}
                x2={geo.topApex[0]} y2={geo.topApex[1]}
                stroke={fill.stroke}
                strokeWidth="0.8"
                strokeDasharray="3,3"
                opacity="0.55"
              />

              {/* Box — left face */}
              <polygon points={toPoints(geo.leftFace)}  fill={fill.left}  stroke={fill.stroke} strokeWidth="0.4" opacity="0.85" />
              {/* Box — right face */}
              <polygon points={toPoints(geo.rightFace)} fill={fill.right} stroke={fill.stroke} strokeWidth="0.4" />
              {/* Box — top face */}
              <polygon points={toPoints(geo.topFace)}   fill={fill.top}   stroke={fill.stroke} strokeWidth="0.4" />

              {/* Health score badge */}
              <rect
                x={bx - 24} y={by - 11}
                width={48}  height={22}
                rx={3}
                fill="white"
                stroke={fill.stroke}
                strokeWidth="1"
                style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.08))' }}
              />
              <text
                x={bx} y={by + 4}
                textAnchor="middle"
                fontSize="9.5"
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="700"
                fill={fill.badge}
                letterSpacing="0.04em"
              >
                {acc.healthScore}
              </text>

              {/* Account name */}
              <text
                x={cx} y={geo.gndFront[1] + 16}
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="600"
                fill="#9490B0"
                letterSpacing="0.08em"
              >
                {label}
              </text>

              {/* MRR tier dot on box top face */}
              <circle
                cx={geo.topApex[0]}
                cy={geo.topApex[1] + TH / 2}
                r="2.5"
                fill={fill.stroke}
                opacity="0.6"
              />
            </motion.g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 right-4 flex items-center gap-4">
        {[
          { label: 'HEALTHY',  color: '#22c55e' },
          { label: 'WARNING',  color: '#f59e0b' },
          { label: 'CRITICAL', color: '#ef4444' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color, opacity: 0.8 }} />
            <span style={{
              fontSize: 8,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              color: '#9490B0',
              letterSpacing: '0.06em',
            }}>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-2 pl-2" style={{ borderLeft: '1px solid #E0DDD6' }}>
          <div className="w-2.5 h-5 rounded-sm" style={{ background: '#7C3AED', opacity: 0.3 }} />
          <div className="w-2.5 h-3.5 rounded-sm" style={{ background: '#7C3AED', opacity: 0.3 }} />
          <div className="w-2.5 h-2 rounded-sm" style={{ background: '#7C3AED', opacity: 0.3 }} />
          <span style={{
            fontSize: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            color: '#9490B0',
            letterSpacing: '0.06em',
          }}>HEIGHT = TIER</span>
        </div>
      </div>
    </div>
  );
}
