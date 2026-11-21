import React, { useState } from 'react';
import {
  Home,
  Fan,
  Layers,
  Compass,
  Activity,
  Clock,
  Settings,
  Plus,
  Edit2,
  Gauge,
  Zap,
  Thermometer,
} from 'lucide-react';
import { useHardware } from '../../context/HardwareContext';
import { FanModal } from '../modals/FanModal';
import { FanDevice } from '../../types';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'fan', label: 'Fan Control', icon: Fan },
  { id: 'fans', label: 'Fan Units', icon: Layers },
  { id: 'environment', label: 'Environment', icon: Compass },
  { id: 'sensors', label: 'Sensor Status', icon: Activity },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    fans,
    activeFanId,
    activeFan,
    setActiveFanId,
  } = useHardware();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFan, setEditingFan] = useState<FanDevice | null>(null);

  const handleOpenAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFan(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFan(activeFan);
    setIsModalOpen(true);
  };

  const isRunning = activeFan.status === 'running' && activeFan.speed > 0;

  return (
    <>
      <aside
        className="w-64 h-[calc(100vh-2.5rem)] my-5 ml-5 mr-3 flex flex-col justify-between p-4.5 rounded-[32px] select-none shrink-0 z-30 transition-all duration-300 glass-surface overflow-hidden"
        style={{
          background: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        {/* Top Logo & Navigation Section */}
        <div className="w-full flex-1 overflow-y-auto pr-0.5 custom-scrollbar">
          {/* Logo Section */}
          <div
            onClick={() => setActivePage('overview')}
            className="flex flex-col items-center justify-center cursor-pointer mb-5 group pt-1"
          >
            {/* Infinity Loop Logo Icon */}
            <div className="relative w-12 h-7 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform duration-300">
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

            <h1 className="text-lg font-extrabold tracking-[0.18em] text-[var(--text-main)]">AIRLOOP</h1>
            <p className="text-[11px] font-medium text-[var(--text-subtle)] tracking-wider">Smart Climate Control</p>
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group text-left cursor-pointer ${
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
                      className={`w-4 h-4 transition-colors ${
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

        {/* Dedicated Multi-Fan Switcher & Statistics Module */}
        <div
          className="w-full mt-3 p-3 rounded-2xl border transition-all duration-300"
          style={{
            background: 'var(--glass-card-bg)',
            borderColor: 'var(--glass-card-border)',
            boxShadow: 'var(--glass-shadow-sm)',
          }}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Fan
                className={`w-3.5 h-3.5 text-blue-500 shrink-0 ${isRunning ? 'animate-spin' : ''}`}
                style={{
                  animationDuration: isRunning
                    ? `${Math.max(0.4, 2.5 - (activeFan.speed / 100) * 2)}s`
                    : '0s',
                }}
              />
              <span className="text-[11px] font-bold text-[var(--text-main)] truncate">
                {activeFan.name}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleOpenEdit}
                className="w-6 h-6 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center transition-colors cursor-pointer"
                title="Edit Current Fan"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="w-6 h-6 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors cursor-pointer"
                title="Add New Fan Unit"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Fan Switcher Buttons (Fan 1, Fan 2, ... Fan N) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
            {fans.map((f, idx) => {
              const isSelected = f.id === activeFanId;
              const shortLabel = `Fan ${idx + 1}`;

              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFanId(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                  title={`${f.name} (${f.room})`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : f.speed > 0 ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  <span>{shortLabel}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-2 py-1 rounded-lg text-[10px] font-bold text-blue-500 hover:bg-blue-500/10 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-0.5 border border-dashed border-blue-400/40"
              title="Add New Fan"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Statistics in Small Boxes */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {/* Box 1: Speed */}
            <div className="p-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-left">
              <div className="text-[8px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Gauge className="w-2.5 h-2.5" />
                <span>Speed</span>
              </div>
              <div className="text-xs font-extrabold text-[var(--text-main)] leading-tight mt-0.5">
                {activeFan.speed}%
              </div>
            </div>

            {/* Box 2: RPM */}
            <div className="p-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-left">
              <div className="text-[8px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-2.5 h-2.5" />
                <span>RPM</span>
              </div>
              <div className="text-xs font-extrabold text-[var(--text-main)] leading-tight mt-0.5">
                {activeFan.rpm.toLocaleString()}
              </div>
            </div>

            {/* Box 3: Temperature */}
            <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left">
              <div className="text-[8px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Thermometer className="w-2.5 h-2.5" />
                <span>Temp</span>
              </div>
              <div className="text-xs font-extrabold text-[var(--text-main)] leading-tight mt-0.5">
                {activeFan.temperature}°C
              </div>
            </div>

            {/* Box 4: Power */}
            <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-left">
              <div className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                <span>Power</span>
              </div>
              <div className="text-xs font-extrabold text-[var(--text-main)] leading-tight mt-0.5">
                {activeFan.powerWatts}W
              </div>
            </div>
          </div>

          {/* Subtitle / Room indicator */}
          <div className="flex items-center justify-between text-[9px] text-[var(--text-subtle)] pt-2 mt-1.5 border-t border-[var(--border-divider)]">
            <span className="truncate">{activeFan.room}</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {isRunning ? 'Running' : 'Stopped'}
            </span>
          </div>
        </div>
      </aside>

      {/* Fan Edit/Add Modal */}
      <FanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fanToEdit={editingFan}
      />
    </>
  );
};
