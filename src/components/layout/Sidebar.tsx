import React from 'react';
import {
  Home,
  Fan,
  Compass,
  Activity,
  Clock,
  Settings,
  Cpu,
  WifiOff,
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
  const { activePage, setActivePage, connectionStatus, toggleConnection } = useHardware();

  const isConnected = connectionStatus === 'connected';

  return (
    <aside
      className="w-64 h-[calc(100vh-2.5rem)] my-5 ml-5 mr-3 flex flex-col justify-between p-6 rounded-[32px] select-none shrink-0 z-30 transition-all duration-300"
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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group text-left ${
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

                {/* Active right indicator dot (seen in Reference Image 1 & 2) */}
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom ESP32 Hardware Status Panel (matches exact miniature in Reference Images) */}
      <div
        onClick={toggleConnection}
        title="Click to connect / disconnect physical ESP32"
        className="group relative cursor-pointer p-4 rounded-2xl transition-all duration-200 hover:bg-white/80 border border-white/80"
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          boxShadow: '0 8px 20px -6px rgba(70, 100, 170, 0.06)',
        }}
      >
        {/* Miniature 3D ESP32 Microcontroller Illustration */}
        <div className="w-full flex items-center justify-center mb-2.5">
          <div
            className="w-16 h-12 rounded-md relative flex items-center justify-center p-1 transition-transform group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
              border: '1px solid #334155',
            }}
          >
            {/* Wi-Fi PCB Antenna Trace (Gold/Copper) */}
            <div className="absolute top-1 left-2 right-2 h-1.5 border-t border-b border-amber-400/80 opacity-70" />

            {/* ESP32 IC Core with silver label */}
            <div className="w-7 h-7 rounded-sm bg-slate-800 border border-slate-600 flex flex-col items-center justify-center text-[5px] text-slate-300 font-mono shadow-inner">
              <span className="text-amber-400 font-bold leading-none">ESP32</span>
              <span className="text-[4px] text-slate-400 scale-90">WROOM</span>
            </div>

            {/* Left and Right Header Pins */}
            <div className="absolute -left-1 top-2 bottom-2 flex flex-col justify-between">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-1.5 h-1 bg-amber-400 rounded-sm shadow-sm" />
              ))}
            </div>
            <div className="absolute -right-1 top-2 bottom-2 flex flex-col justify-between">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-1.5 h-1 bg-amber-400 rounded-sm shadow-sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Status text */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isConnected
                ? 'bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse'
                : 'bg-rose-500 shadow-[0_0_8px_#EF4444]'
            }`}
          />
          <span className="text-xs font-bold text-[#172033]">
            {isConnected ? 'ESP32 Online' : 'ESP32 Offline'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5 ml-4.5">
          {isConnected ? 'All systems ready' : 'Device not connected'}
        </p>
      </div>
    </aside>
  );
};
