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
  BarChart,
  Bar,
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-sm text-xs font-semibold text-indigo-600">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Telemetry Archive</span>
          </div>
          <h1 className="text-3xl xl:text-4xl font-extrabold text-[#172033] tracking-tight">
            Climate & Event <span className="text-gradient-airloop">History</span>
          </h1>
          <p className="text-sm text-slate-500">
            Audit logs, micro-climate curves, and real IoT historical telemetry.
          </p>
        </div>

        {/* Data Export Buttons (CSV & JSON) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportData('csv')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-slate-800 text-xs font-bold border border-white/90 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
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
          className="p-4 rounded-3xl"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 24px -6px rgba(70, 100, 170, 0.06)',
          }}
        >
          <span className="text-[11px] font-semibold text-slate-400">Average Temp</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-[#172033]">{avgTemp}°C</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Over selected range</span>
        </div>

        <div
          className="p-4 rounded-3xl"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 24px -6px rgba(70, 100, 170, 0.06)',
          }}
        >
          <span className="text-[11px] font-semibold text-slate-400">Peak / Low Temp</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-sky-600">{maxTemp}°</span>
            <span className="text-slate-400 text-sm">/</span>
            <span className="text-2xl font-extrabold text-indigo-600">{minTemp}°</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Thermal variance: ±1.8°</span>
        </div>

        <div
          className="p-4 rounded-3xl"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 24px -6px rgba(70, 100, 170, 0.06)',
          }}
        >
          <span className="text-[11px] font-semibold text-slate-400">Mean Relative Humidity</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-purple-600">{avgHum}%</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Ideal comfort zone</span>
        </div>

        <div
          className="p-4 rounded-3xl"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 24px -6px rgba(70, 100, 170, 0.06)',
          }}
        >
          <span className="text-[11px] font-semibold text-slate-400">Logged Events</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-[#172033]">{events.length}</span>
            <span className="text-xs font-semibold text-slate-500">records</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">100% telemetry synced</span>
        </div>
      </div>

      {/* Main Glass History Chart Panel */}
      <div
        className="rounded-[32px] p-6 select-none"
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(24px)',
          border: '1.5px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 20px 45px -12px rgba(70, 100, 170, 0.12)',
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
                    : 'bg-white/60 text-slate-600 hover:bg-white border border-white/80'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/70 border border-white/80">
            {(['1h', '24h', '7d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setHistoryRange(range)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  historyRange === range
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="histTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="histHumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C084FC" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C084FC" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.6)" />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis domain={[10, 45]} tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip />

              {(activeMetric === 'all' || activeMetric === 'temperature') && (
                <Area
                  type="natural"
                  dataKey="temperature"
                  stroke="#38BDF8"
                  strokeWidth={2.8}
                  fillOpacity={1}
                  fill="url(#histTempGrad)"
                  name="Temperature (°C)"
                />
              )}

              {(activeMetric === 'all' || activeMetric === 'humidity') && (
                <Area
                  type="natural"
                  dataKey="humidity"
                  stroke="#C084FC"
                  strokeWidth={2.8}
                  fillOpacity={1}
                  fill="url(#histHumGrad)"
                  name="Humidity (%)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Event Logs Table */}
      <div
        className="rounded-[32px] p-6 select-none"
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(24px)',
          border: '1.5px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 20px 45px -12px rgba(70, 100, 170, 0.12)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#172033]">Hardware & System Event Log</h3>
          <span className="text-xs text-slate-400 font-medium">Real-time chronologic audit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold">
                <th className="pb-3 px-3">Time</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Severity</th>
                <th className="pb-3 px-3">Event</th>
                <th className="pb-3 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-white/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-slate-500">{ev.timestamp}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700 capitalize">{ev.type}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ev.severity === 'success'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ev.severity === 'warning'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {ev.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#172033]">{ev.title}</td>
                  <td className="py-3 px-3 text-slate-500">{ev.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
