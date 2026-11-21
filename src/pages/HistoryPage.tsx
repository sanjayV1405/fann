import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Download,
  Calendar,
  Thermometer,
  Droplets,
  Wind,
  Shield,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useHardware } from '../context/HardwareContext';

export const HistoryPage: React.FC = () => {
  const { historyData, historyRange, setHistoryRange, events, exportData, connectionStatus } =
    useHardware();

  const [activeMetric, setActiveMetric] = useState<'all' | 'temperature' | 'humidity' | 'aqi'>('all');

  const isConnected = connectionStatus === 'connected';

  // Stats calculation
  const temps = historyData.map((d) => d.temperature);
  const hums = historyData.map((d) => d.humidity);
  const avgTemp = (temps.reduce((a, b) => a + b, 0) / (temps.length || 1)).toFixed(1);
  const maxTemp = Math.max(...temps, 0).toFixed(1);
  const minTemp = Math.min(...temps, 100).toFixed(1);
  const avgHum = Math.round(hums.reduce((a, b) => a + b, 0) / (hums.length || 1));

  // Custom Chart Tooltip
  const CustomHistoryTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-2xl p-2.5 shadow-xl border select-none glass-card"
          style={{
            background: 'var(--dropdown-bg)',
            backdropFilter: 'blur(20px)',
            borderColor: 'var(--dropdown-border)',
            boxShadow: 'var(--glass-shadow)',
          }}
        >
          <p className="text-[10px] font-bold text-[var(--text-subtle)] mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-main)]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="capitalize">{entry.name}:</span>
              <span>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header and Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Telemetry Archive</span>
          </div>
          <h1 className="text-3xl xl:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
            Climate & Event <span className="text-gradient-airloop">History</span>
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Audit logs, micro-climate curves, and real IoT historical telemetry.
          </p>
        </div>

        {/* Data Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportData('csv')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-[var(--text-main)] text-xs font-bold border border-white/90 dark:border-white/10 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => exportData('json')}
            className="btn-primary-gradient px-4 py-2.5 rounded-2xl text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
          >
            <FileCode className="w-4 h-4 text-white" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Quick Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-3xl glass-card"
          style={{
            background: 'var(--glass-card-bg)',
            borderColor: 'var(--glass-card-border)',
            boxShadow: 'var(--glass-shadow-sm)',
          }}
        >
          <span className="text-[11px] font-semibold text-[var(--text-subtle)]">Average Temp</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-[var(--text-main)]">{avgTemp}°C</span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-medium">Over selected range</span>
        </div>

        <div
          className="p-4 rounded-3xl glass-card"
          style={{
            background: 'var(--glass-card-bg)',
            borderColor: 'var(--glass-card-border)',
            boxShadow: 'var(--glass-shadow-sm)',
          }}
        >
          <span className="text-[11px] font-semibold text-[var(--text-subtle)]">Peak / Low Temp</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-sky-500">{maxTemp}°</span>
            <span className="text-[var(--text-subtle)] text-sm">/</span>
            <span className="text-2xl font-extrabold text-indigo-500">{minTemp}°</span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-medium">Thermal variance: ±1.8°</span>
        </div>

        <div
          className="p-4 rounded-3xl glass-card"
          style={{
            background: 'var(--glass-card-bg)',
            borderColor: 'var(--glass-card-border)',
            boxShadow: 'var(--glass-shadow-sm)',
          }}
        >
          <span className="text-[11px] font-semibold text-[var(--text-subtle)]">Mean Relative Humidity</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-purple-500">{avgHum}%</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-medium">Ideal comfort zone</span>
        </div>

        <div
          className="p-4 rounded-3xl glass-card"
          style={{
            background: 'var(--glass-card-bg)',
            borderColor: 'var(--glass-card-border)',
            boxShadow: 'var(--glass-shadow-sm)',
          }}
        >
          <span className="text-[11px] font-semibold text-[var(--text-subtle)]">Logged Events</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-[var(--text-main)]">{events.length}</span>
            <span className="text-xs font-semibold text-[var(--text-muted)]">records</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-medium">100% telemetry synced</span>
        </div>
      </div>

      {/* Main Glass History Chart Panel */}
      <div
        className="rounded-[32px] p-6 select-none glass-card"
        style={{
          background: 'var(--glass-card-bg)',
          borderColor: 'var(--glass-card-border)',
          boxShadow: 'var(--glass-card-shadow)',
        }}
      >
        {/* Controls: Metric filter + Time ranges */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {(['all', 'temperature', 'humidity', 'aqi'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeMetric === m
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-black/5 dark:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] border border-black/5 dark:border-white/10'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10">
            {(['1h', '24h', '7d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setHistoryRange(range)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  historyRange === range
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* History Chart */}
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="histTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="histHumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C084FC" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#C084FC" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="histAqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />

              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--chart-axis)', fontSize: 11, fontWeight: 600 }}
              />

              <YAxis
                domain={[0, 'auto']}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--chart-axis)', fontSize: 11, fontWeight: 600 }}
              />

              <Tooltip content={<CustomHistoryTooltip />} />

              {(activeMetric === 'all' || activeMetric === 'temperature') && (
                <Area
                  type="monotone"
                  name="Temperature (°C)"
                  dataKey="temperature"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#histTempGrad)"
                />
              )}

              {(activeMetric === 'all' || activeMetric === 'humidity') && (
                <Area
                  type="monotone"
                  name="Humidity (%)"
                  dataKey="humidity"
                  stroke="#C084FC"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#histHumGrad)"
                />
              )}

              {(activeMetric === 'all' || activeMetric === 'aqi') && (
                <Area
                  type="monotone"
                  name="AQI"
                  dataKey="aqi"
                  stroke="#4ADE80"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#histAqiGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
