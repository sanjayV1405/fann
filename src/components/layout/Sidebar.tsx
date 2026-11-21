import React from 'react';
import {
  Home,
  Fan,
  Compass,
  Activity,
  Clock,
  Settings,
} from 'lucide-react';
import { useHardware } from '../../context/HardwareContext';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'fan', label: 'Fan Control', icon: Fan },
  { id: 'environment', label: 'Environment', icon: Compass },
  { id: 'sensors', label: 'Sensor Status', icon: Activity },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage } = useHardware();

  return (
    <aside
      className="w-56 h-fit self-center my-auto ml-5 mr-3 flex flex-col items-center p-4 rounded-[28px] select-none shrink-0 z-30 transition-all duration-300 glass-surface"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
      }}
    >
      {/* Top Logo Section */}
      <div className="w-full">
        <div
          onClick={() => setActivePage('overview')}
          className="flex flex-col items-center justify-center cursor-pointer mb-3.5 group"
        >
          {/* Infinity Loop Logo Icon */}
          <div className="relative w-10 h-6 flex items-center justify-center mb-0.5 group-hover:scale-105 transition-transform duration-300">
            <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-sm" fill="none">
              <defs>
                <linearGradient id="sidebarLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <path
                d="M 30,12 C 16,12 8,20 8,30 C 8,40 16,48 30,48 C 45,48 55,12 70,12 C 84,12 92,20 92,30 C 92,40 84,48 70,48 C 55,48 45,12 30,12 Z"
                stroke="url(#sidebarLogoGrad)"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-base font-extrabold tracking-[0.16em] text-[var(--text-main)]">AIRLOOP</h1>
          <p className="text-[10px] font-medium text-[var(--text-subtle)] tracking-wider">Smart Climate Control</p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 w-full" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group text-left cursor-pointer ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 shadow-sm border border-blue-400/30'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={
                  isActive
                    ? {
                        background:
                          'linear-gradient(135deg, rgba(66, 165, 255, 0.16) 0%, rgba(183, 164, 255, 0.18) 100%)',
                      }
                    : {}
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-[var(--text-subtle)] group-hover:text-[var(--text-main)]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {/* Active right indicator dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
