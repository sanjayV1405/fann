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
      className="w-64 h-[calc(100vh-2.5rem)] my-5 ml-5 mr-3 flex flex-col p-6 rounded-[32px] select-none shrink-0 z-30 transition-all duration-300"
      style={{
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1.5px solid rgba(255, 255, 255, 0.88)',
        boxShadow: '0 20px 45px -10px rgba(70, 100, 170, 0.08), 0 2px 6px rgba(255, 255, 255, 0.9) inset',
      }}
    >
      {/* Top Logo Section */}
      <div>
        <div
          onClick={() => setActivePage('overview')}
          className="flex flex-col items-center justify-center cursor-pointer mb-8 group"
        >
          {/* Infinity Loop Logo Icon (exact match to reference images) */}
          <div className="relative w-12 h-8 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform duration-300">
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

          <h1 className="text-xl font-extrabold tracking-[0.18em] text-[#172033] mt-0.5">AIRLOOP</h1>
          <p className="text-[11px] font-medium text-slate-400 tracking-wider">Smart Climate Control</p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group text-left cursor-pointer ${
                  isActive
                    ? 'text-blue-600 shadow-sm border border-blue-400/30'
                    : 'text-slate-600 hover:text-[#172033] hover:bg-white/40'
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
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {/* Active right indicator dot */}
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
