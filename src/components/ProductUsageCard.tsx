'use client';

import Sparkline from './Sparkline';
import { GitPullRequest, Users, Gauge, Clock, Code, FolderGit2 } from 'lucide-react';
import { SparklinePoint } from '@/data/mock';

interface ProductUsage {
  accountId: string;
  prsReviewedLast30d: number;
  prsReviewedPrev30d: number;
  activeUsers: number;
  totalSeats: number;
  configuredRules: number;
  avgReviewTime: string;
  adoptionScore: number;
  topRepos: string[];
  lastActiveAt: string;
  weeklyPrTrend: SparklinePoint[];
}

interface ProductUsageCardProps {
  usage: ProductUsage;
}

function getAdoptionColor(score: number): string {
  if (score >= 70) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

export default function ProductUsageCard({ usage }: ProductUsageCardProps) {
  const prChange = usage.prsReviewedPrev30d > 0
    ? ((usage.prsReviewedLast30d - usage.prsReviewedPrev30d) / usage.prsReviewedPrev30d) * 100
    : 0;
  const seatUtil = (usage.activeUsers / usage.totalSeats) * 100;
  const adoptionColor = getAdoptionColor(usage.adoptionScore);
  const seatColor = seatUtil >= 70 ? '#10b981' : seatUtil >= 40 ? '#f59e0b' : '#ef4444';

  const ringSize = 64;
  const strokeWidth = 5;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (usage.adoptionScore / 100) * circumference;

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
          <Code size={13} style={{ color: '#06b6d4' }} />
        </div>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Product Usage</h2>
        <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>Last active: {usage.lastActiveAt}</span>
      </div>

      <div className="p-5">
        {/* Top row: Adoption ring + key stats */}
        <div className="flex items-center gap-6 mb-5">
          {/* Adoption Score Ring */}
          <div className="relative shrink-0" style={{ width: ringSize, height: ringSize }}>
            <svg width={ringSize} height={ringSize} className="-rotate-90">
              <circle cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none"
                stroke={`${adoptionColor}15`} strokeWidth={strokeWidth} />
              <circle cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none"
                stroke={adoptionColor} strokeWidth={strokeWidth}
                strokeDasharray={circumference} strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 4px ${adoptionColor}60)`, transition: 'stroke-dashoffset 1s ease-out' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold tabular-nums" style={{ color: adoptionColor }}>{usage.adoptionScore}</span>
              <span className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>adoption</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-3">
            {/* PRs Reviewed */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <GitPullRequest size={11} style={{ color: '#8b5cf6' }} />
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>PRs Reviewed</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {usage.prsReviewedLast30d.toLocaleString()}
                </span>
                <span className="text-[10px] font-medium" style={{ color: prChange >= 0 ? '#10b981' : '#ef4444' }}>
                  {prChange >= 0 ? '+' : ''}{prChange.toFixed(0)}%
                </span>
              </div>
              <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>vs prev 30d</span>
            </div>

            {/* Active Users */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Users size={11} style={{ color: '#3b82f6' }} />
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Seat Usage</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {usage.activeUsers}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ {usage.totalSeats}</span>
              </div>
              <div className="w-full h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${seatUtil}%`, background: seatColor }} />
              </div>
            </div>

            {/* Avg Review Time */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Clock size={11} style={{ color: '#06b6d4' }} />
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Avg Review</span>
              </div>
              <span className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {usage.avgReviewTime}
              </span>
            </div>

            {/* Configured Rules */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Gauge size={11} style={{ color: '#f59e0b' }} />
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Rules</span>
              </div>
              <span className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {usage.configuredRules}
              </span>
            </div>
          </div>
        </div>

        {/* PR Trend Sparkline */}
        <div className="mb-4">
          <span className="text-[10px] font-medium uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
            Weekly PR Reviews (12 weeks)
          </span>
          <Sparkline data={usage.weeklyPrTrend} color="#8b5cf6" height={48} />
        </div>

        {/* Top Repos */}
        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
            Top Repositories
          </span>
          <div className="flex flex-wrap gap-1.5">
            {usage.topRepos.map((repo) => (
              <span key={repo} className="text-[11px] font-mono px-2 py-1 rounded-lg flex items-center gap-1.5"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <FolderGit2 size={10} style={{ color: 'var(--text-muted)' }} />
                {repo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
