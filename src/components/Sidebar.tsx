'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Bell,
  Settings,
  Activity,
  Zap,
  Plug,
  HelpCircle,
  Radar,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/' },
  { icon: Zap, label: 'Actions', href: '/actions', badge: 4 },
  { icon: Radar, label: 'Risk Radar', href: '/#risk' },
  { icon: Users, label: 'Accounts', href: '/#accounts' },
  { icon: Sparkles, label: 'AI Digests', href: '/#digests' },
  { icon: Bell, label: 'Alerts', href: '/#alerts', badge: 3 },
  { icon: Plug, label: 'Integrations', href: '/settings' },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: HelpCircle, label: 'Help', href: '#' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] flex flex-col border-r z-20"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-0.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pulse-logo.png" alt="P"
            className="w-9 h-9 object-contain shrink-0"
            style={{ mixBlendMode: 'multiply' }} />
          <span className="font-semibold text-base tracking-tight" style={{ color: 'var(--text-primary)', marginLeft: '-10px' }}>ulse</span>
        </div>
      </div>

      {/* Data source badges */}
      <div className="mx-4 mt-4 mb-1 space-y-1.5">
        {[
          { name: 'Grafana', connected: true },
          { name: 'Gong', connected: true },
          { name: 'Pylon', connected: true },
          { name: 'Slack', connected: true },
        ].map((src) => (
          <div key={src.name} className="px-3 py-1.5 rounded-lg flex items-center gap-2"
            style={{ background: 'rgba(0,0,0,0.03)' }}>
            <div className="w-1.5 h-1.5 rounded-full"
              style={{ background: src.connected ? '#10b981' : '#4a4a62' }} />
            <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{src.name}</span>
            <span className="text-[9px] ml-auto" style={{ color: src.connected ? '#10b981' : '#ef4444' }}>
              {src.connected ? 'synced' : 'offline'}
            </span>
          </div>
        ))}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-4 space-y-0.5">
        {navItems.map((item) => {
          // Hash links are anchor scrolls — never "active"
          const isActive = item.href.includes('#')
            ? false
            : item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group"
              style={{
                fontWeight: isActive ? 600 : 450,
                color: isActive ? 'var(--accent-purple)' : 'var(--text-muted)',
                background: isActive ? 'rgba(124, 58, 237, 0.06)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent-purple)' : '2px solid transparent',
              }}
            >
              <item.icon
                size={16}
                strokeWidth={isActive ? 2.2 : 1.7}
                style={{ opacity: isActive ? 1 : 0.7 }}
              />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: '#ef4444',
                  }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-3 space-y-0.5">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
          >
            <item.icon size={18} strokeWidth={1.8} />
            <span>{item.label}</span>
          </button>
        ))}

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-lg" style={{ background: 'var(--bg-card)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: 'white' }}>
            JX
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>Jax</div>
            <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>Technical CSM</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
