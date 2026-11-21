import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Fan,
  Plus,
  Edit2,
  Check,
  Zap,
  Gauge,
  Thermometer,
  Activity,
  Sliders,
  Cpu,
} from 'lucide-react';
import { useHardware } from '../context/HardwareContext';
import { FanDevice } from '../types';
import { FanModal } from '../components/modals/FanModal';

export const FansPage: React.FC = () => {
  const {
    fans,
    activeFanId,
    setActiveFanId,
    updateFan,
    connectionStatus,
    showToast,
  } = useHardware();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFan, setEditingFan] = useState<FanDevice | null>(null);

  const handleOpenAdd = () => {
    setEditingFan(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fan: FanDevice, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFan(fan);
    setIsModalOpen(true);
  };

  const handleSpeedChange = (fan: FanDevice, newSpeed: number) => {
    updateFan(fan.id, {
      speed: newSpeed,
      targetSpeed: newSpeed,
      status: newSpeed > 0 ? 'running' : 'stopped',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-6xl pb-8"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold text-[var(--text-muted)]">
            <Fan className="w-3.5 h-3.5 text-blue-500" />
            <span>Multi-Fan Unit Network</span>
          </div>
          <h1 className="text-3xl xl:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
            Connected Fan <span className="text-gradient-airloop">Units</span>
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Switch between Fan 1, Fan 2, and any custom fan units. View live statistics in dedicated telemetry boxes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary-gradient px-4 py-2.5 rounded-2xl text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shrink-0 hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Fan</span>
        </button>
      </div>

      {/* Fans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fans.map((fan) => {
          const isActive = fan.id === activeFanId;
          const isRunning = fan.status === 'running' && fan.speed > 0;

          return (
            <div
              key={fan.id}
              onClick={() => setActiveFanId(fan.id)}
              className={`rounded-[32px] p-6 select-none glass-card transition-all duration-300 relative overflow-hidden cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'ring-2 ring-blue-500/50 border-blue-500/30 shadow-lg shadow-blue-500/10'
                  : 'hover:border-slate-300/60 dark:hover:border-slate-700/60'
              }`}
              style={{
                background: 'var(--glass-card-bg)',
                borderColor: 'var(--glass-card-border)',
                boxShadow: 'var(--glass-card-shadow)',
              }}
            >
              <div>
                {/* Top Row: Icon + Name + Active Badge + Edit */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                        isActive
                          ? 'bg-blue-500/15 text-blue-500 border-blue-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-muted)] border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Fan
                        className={`w-6 h-6 ${
                          isRunning ? 'animate-spin' : ''
                        }`}
                        style={{
                          animationDuration: isRunning
                            ? `${Math.max(0.4, 2.5 - (fan.speed / 100) * 2)}s`
                            : '0s',
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5">
                        <span>{fan.name}</span>
                        {fan.isDemo && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold uppercase">
                            Demo
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                        {fan.room} • {fan.espPinOrIp || 'PWM Channel'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleOpenEdit(fan, e)}
                      className="w-8 h-8 rounded-xl bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700 text-[var(--text-muted)] hover:text-[var(--text-main)] border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit Fan"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status & Mode Row */}
                <div className="flex items-center justify-between mb-4 text-xs">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-[var(--text-muted)] border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    <span>{isActive ? 'Active Controller' : 'Standby'}</span>
                  </span>

                  <span className="text-[11px] font-semibold text-[var(--text-subtle)] flex items-center gap-1">
                    {fan.mode === 'manual' ? (
                      <>
                        <Sliders className="w-3 h-3" /> Manual
                      </>
                    ) : (
                      <>
                        <Cpu className="w-3 h-3 text-purple-500" /> Auto Eco
                      </>
                    )}
                  </span>
                </div>

                {/* Statistics in Small Boxes */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {/* Speed Box */}
                  <div className="p-2.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 text-left">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                      <Gauge className="w-3 h-3" />
                      <span>Speed</span>
                    </div>
                    <div className="text-base font-extrabold text-[var(--text-main)]">
                      {fan.speed}%
                    </div>
                  </div>

                  {/* RPM Box */}
                  <div className="p-2.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/40 text-left">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                      <Activity className="w-3 h-3" />
                      <span>RPM</span>
                    </div>
                    <div className="text-base font-extrabold text-[var(--text-main)]">
                      {fan.rpm.toLocaleString()}
                    </div>
                  </div>

                  {/* Temp Box */}
                  <div className="p-2.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 text-left">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                      <Thermometer className="w-3 h-3" />
                      <span>Temp</span>
                    </div>
                    <div className="text-base font-extrabold text-[var(--text-main)]">
                      {fan.temperature}°C
                    </div>
                  </div>

                  {/* Power Box */}
                  <div className="p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40 text-left">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                      <Zap className="w-3 h-3" />
                      <span>Power</span>
                    </div>
                    <div className="text-base font-extrabold text-[var(--text-main)]">
                      {fan.powerWatts}W
                    </div>
                  </div>
                </div>

                {/* Quick Slider inside card */}
                <div
                  className="space-y-1.5 pt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between text-xs text-[var(--text-subtle)]">
                    <span className="font-semibold text-[11px]">Adjust PWM Output</span>
                    <span className="font-bold text-[var(--text-main)] text-[11px]">{fan.speed}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={fan.speed}
                    onChange={(e) => handleSpeedChange(fan, parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-4 mt-4 border-t border-[var(--border-divider)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-subtle)]">
                  {isRunning ? 'PWM active' : 'Motor idle'}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFanId(fan.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/80 dark:bg-slate-800 text-[var(--text-main)] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Active Unit</span>
                    </>
                  ) : (
                    <span>Switch to this Fan</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Fan Card placeholder */}
        <div
          onClick={handleOpenAdd}
          className="rounded-[32px] p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500/60 hover:bg-blue-50/10 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center min-h-[340px] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-main)] mb-1">Add Another Fan Unit</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-xs">
            Connect Fan 3, Fan 4, or nth fan to control independently with live simulated or physical ESP32 PWM pins.
          </p>
        </div>
      </div>

      {/* Fan Edit/Add Modal */}
      <FanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fanToEdit={editingFan}
      />
    </motion.div>
  );
};
