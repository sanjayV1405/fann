import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  RefreshCw,
  Cpu,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { useHardware } from '../context/HardwareContext';
import { SensorHealthStatus } from '../types';

export const SensorStatusPage: React.FC = () => {
  const { sensors, refreshSensors, connectionStatus, climateData } = useHardware();
  const [filter, setFilter] = useState<'All' | SensorHealthStatus>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSensors, setExpandedSensors] = useState<Record<string, boolean>>({});

  const toggleSensor = (id: string) => {
    setExpandedSensors((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isConnected = connectionStatus === 'connected';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshSensors();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredSensors = sensors.filter((s) => {
    if (filter === 'All') return true;
    return s.status === filter;
  });

  const getStatusBadge = (status: SensorHealthStatus) => {
    switch (status) {
      case 'Healthy':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Healthy
          </span>
        );
      case 'Warning':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 text-[11px] font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Warning
          </span>
        );
      case 'Disconnected':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40 text-[11px] font-bold">
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Disconnected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            Unavailable
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span>Hardware Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
            Sensor Health & <span className="text-gradient-airloop">Telemetry</span>
          </h1>
          <p className="hidden sm:block text-xs sm:text-sm text-[var(--text-muted)]">
            Real-time status of all digital environmental transducers and bus controllers.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleRefresh}
          disabled={!isConnected || isRefreshing}
          className="btn-primary-gradient px-4 py-2 min-h-[42px] sm:min-h-[44px] rounded-2xl text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Polling Bus...' : 'Refresh Sensors'}</span>
        </button>
      </div>

      {/* System Health Summary Bar */}
      <div
        className="rounded-[28px] p-4 sm:p-5 select-none glass-card"
        style={{
          background: 'var(--glass-card-bg)',
          borderColor: 'var(--glass-card-border)',
          boxShadow: 'var(--glass-shadow-sm)',
        }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--text-subtle)]">MCU Core</p>
              <p className="text-sm font-extrabold text-[var(--text-main)]">Dual-Core 240MHz</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Load: 12%</p>
            </div>
          </div>

          <div className="p-2 sm:pl-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--text-subtle)]">Wi-Fi RSSI</p>
              <p className="text-sm font-extrabold text-[var(--text-main)]">
                {isConnected ? `${climateData.wifiRssi} dBm` : 'Offline'}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] font-semibold">AirLoop_Mesh_5G</p>
            </div>
          </div>

          <div className="p-2 sm:pl-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--text-subtle)]">System Uptime</p>
              <p className="text-sm font-extrabold text-[var(--text-main)]">
                {isConnected ? '3h 58m' : '0m'}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">0 watchdog resets</p>
            </div>
          </div>

          <div className="p-2 sm:pl-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--text-subtle)]">Bus Health</p>
              <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">100% Operational</p>
              <p className="text-[10px] text-[var(--text-muted)] font-semibold">6/6 Nodes Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {(['All', 'Healthy', 'Warning', 'Disconnected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-2 min-h-[36px] rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              filter === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-black/5 dark:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] border border-black/5 dark:border-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
        {filteredSensors.map((sensor) => {
          const isExpanded = Boolean(expandedSensors[sensor.id]);

          return (
            <div
              key={sensor.id}
              className="rounded-2xl sm:rounded-[28px] p-4 sm:p-5 select-none relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex flex-col justify-between glass-card"
              style={{
                background: 'var(--glass-card-bg)',
                borderColor: 'var(--glass-card-border)',
                boxShadow: 'var(--glass-card-shadow)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-[10.5px] sm:text-[11px] font-mono text-[var(--text-subtle)] font-semibold">
                    {sensor.model}
                  </span>
                  {getStatusBadge(isConnected ? sensor.status : 'Disconnected')}
                </div>

                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">{sensor.name}</h3>

                  {/* Current Reading on Header for compact mobile scanning */}
                  <div className="flex items-baseline gap-1 lg:hidden">
                    <span className="text-lg font-extrabold text-[var(--text-main)]">
                      {isConnected ? sensor.value : '--'}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-muted)]">{sensor.unit}</span>
                  </div>
                </div>

                {/* Description (Always visible on desktop; collapsible on mobile) */}
                <p className={`text-xs text-[var(--text-muted)] mb-2.5 sm:mb-4 line-clamp-2 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
                  {sensor.description}
                </p>
              </div>

              {/* Reading & Technical Details (Desktop: Full; Mobile: Collapsible Details) */}
              <div className="pt-2 sm:pt-3 border-t border-[var(--border-divider)] space-y-2">
                <div className="hidden lg:flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-[var(--text-subtle)]">Current Reading</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-[var(--text-main)]">
                      {isConnected ? sensor.value : '--'}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-muted)]">{sensor.unit}</span>
                  </div>
                </div>

                <div className={`items-center justify-between text-[11px] text-[var(--text-subtle)] font-medium ${isExpanded ? 'flex' : 'hidden lg:flex'}`}>
                  <span>Interface: {sensor.busInterface}</span>
                  <span>Accuracy: {sensor.accuracy}</span>
                </div>

                {/* Mobile Expand / Collapse Button */}
                <button
                  type="button"
                  onClick={() => toggleSensor(sensor.id)}
                  className="lg:hidden w-full pt-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide Specs' : 'View Specs & Pin Details'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
