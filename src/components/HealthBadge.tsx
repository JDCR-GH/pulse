import { useState } from 'react';
import { Bell } from 'lucide-react';

export function HealthBadge({ score, label, onClick, compact }: { score: number; label: string; onClick: () => void; compact?: boolean }) {
  const [hovered, setHovered] = useState(false);

  const tone = score > 80 ? { fg: '#10b981', bg: '#064e3b' } : score > 50 ? { fg: '#f59e0b', bg: '#78350f' } : { fg: '#ef4444', bg: '#7f1d1d' };

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: compact ? 4 : 8, background: hovered ? tone.bg : '#111827', color: tone.fg, borderRadius: 6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span>{label}: {score}</span>
      <button onClick={onClick} style={{ background: 'transparent', border: 'none', color: tone.fg }}>
        <Bell size={16} />
      </button>
    </div>
  );
}
