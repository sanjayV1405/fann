import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2,
  Thermometer,
  Droplets,
  Wind,
  Leaf,
  Lightbulb,
  Check,
  Sprout,
  Sparkles,
  ChevronDown,
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

export const EnvironmentPage: React.FC = () => {
  const {
    climateData,
    connectionStatus,
    historyData,
    historyRange,
    setHistoryRange,
  } = useHardware();

  const [showMobileInsights, setShowMobileInsights] = useState(false);
  const isConnected = connectionStatus === 'connected';

  // Custom Glass Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
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
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-main)]">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{payload[0]?.value}°C</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>{payload[1]?.value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Top Row: Heading on Left, 3 Mini Environmental Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-center">
        {/* Left Column: Heading */}
        <div className="lg:col-span-6 space-y-1.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Leaf className="w-3.5 h-3.5 text-emerald-500" />
            <span>Environment Monitor</span>
          </div>

          <h1 className="text-2xl sm:text-4xl xl:text-5xl font-extrabold text-[var(--text-main)] tracking-tight leading-[1.15]">
            Know Your
            <br />
            <span className="text-gradient-airloop">Environment</span>
          </h1>

          <p className="hidden sm:block text-xs sm:text-sm text-[var(--text-muted)] font-medium max-w-md">
            Real-time insights for a healthier and more comfortable space.
          </p>
        </div>

        {/* Right Column: 3 Top Mini Cards */}
        <div className="lg:col-span-6 grid grid-cols-3 gap-2 sm:gap-4">
          {/* Card 1: Temperature */}
          <div
            className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl relative select-none glass-card"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-shadow-sm)',
            }}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-500 mb-1.5 sm:mb-2 border border-white/80 dark:border-white/10 shadow-sm">
              <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-base sm:text-xl font-extrabold text-[var(--text-main)]">
                {isConnected ? `${climateData.temperature}°C` : '--'}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full">
                ↑ 0.2°
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--text-subtle)] mt-0.5 sm:mt-1 block truncate">Temperature</span>
          </div>

          {/* Card 2: Humidity */}
          <div
            className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl relative select-none glass-card"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-shadow-sm)',
            }}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-500 mb-1.5 sm:mb-2 border border-white/80 dark:border-white/10 shadow-sm">
              <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-base sm:text-xl font-extrabold text-[var(--text-main)]">
                {isConnected ? `${climateData.humidity}%` : '--'}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded-full">
                ↑ 1%
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--text-subtle)] mt-0.5 sm:mt-1 block truncate">Humidity</span>
          </div>

          {/* Card 3: Air Quality */}
          <div
            className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl relative select-none glass-card"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-shadow-sm)',
            }}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500 mb-1.5 sm:mb-2 border border-white/80 dark:border-white/10 shadow-sm">
              <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-base sm:text-xl font-extrabold text-[var(--text-main)] truncate">
                {isConnected ? climateData.airQualityStatus : '--'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981] shrink-0" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--text-subtle)] mt-0.5 sm:mt-1 block truncate">Air Quality</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Climate Trends Chart & Air Quality Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Climate Trends Recharts Panel */}
        <div className="lg:col-span-8">
          <div
            className="rounded-[32px] p-6 select-none relative glass-card"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-card-shadow)',
            }}
          >
            {/* Chart Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50/80 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 shrink-0">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">Climate Trends</h3>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 sm:ml-3 text-xs font-semibold text-[var(--text-muted)]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>Temp (°C)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Humidity (%)</span>
                  </div>
                </div>
              </div>

              {/* Time Filters */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 shrink-0">
                {(['1h', '24h', '7d'] as const).map((range) => {
                  const isActive = historyRange === range;
                  return (
                    <button
                      key={range}
                      onClick={() => setHistoryRange(range)}
                      className={`px-3 py-1.5 min-h-[36px] min-w-[36px] rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {range}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-[220px] sm:h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="humAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C084FC" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#C084FC" stopOpacity={0.0} />
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
                    domain={[10, 45]}
                    ticks={[10, 20, 30, 40]}
                    tickLine={false}
                    axisLine={false}
                    unit="°C"
                    tick={{ fill: 'var(--chart-axis)', fontSize: 11, fontWeight: 600 }}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  {/* Temperature Curve */}
                  <Area
                    type="natural"
                    dataKey="temperature"
                    stroke="#38BDF8"
                    strokeWidth={2.8}
                    fillOpacity={1}
                    fill="url(#tempAreaGrad)"
                  />

                  {/* Humidity Curve */}
                  <Area
                    type="natural"
                    dataKey="humidity"
                    stroke="#C084FC"
                    strokeWidth={2.8}
                    fillOpacity={1}
                    fill="url(#humAreaGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Air Quality Gauge Card */}
        <div className="lg:col-span-4">
          <div
            className="h-full rounded-[32px] p-6 select-none flex flex-col justify-between glass-card"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-card-shadow)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
                <Leaf className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">Air Quality</h3>
            </div>

            {/* Circular Gauge Arc */}
            <div className="relative flex flex-col items-center justify-center my-3">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="62"
                    fill="none"
                    stroke="var(--dial-track)"
                    strokeWidth="11"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="62"
                    fill="none"
                    stroke="url(#aqiGaugeGrad)"
                    strokeWidth="11"
                    strokeDasharray="390"
                    strokeDashoffset="110"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="aqiGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#86EFAC" />
                      <stop offset="100%" stopColor="#22C55E" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner Disc */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Leaf className="w-6 h-6 text-emerald-500 mb-0.5" />
                  <span className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">Good</span>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    AQI: {isConnected ? climateData.aqi : '--'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pill */}
            <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Air quality is excellent!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Progressive Disclosure Toggle for Insights */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileInsights(!showMobileInsights)}
          className="w-full py-2.5 px-4 rounded-2xl glass-card flex items-center justify-between text-xs font-bold text-[var(--text-main)] cursor-pointer"
          style={{
            background: 'var(--glass-card-bg)',
            borderColor: 'var(--glass-card-border)',
          }}
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Environmental Insights & Atmosphere</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${
              showMobileInsights ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Bottom Section (Desktop: Always Visible; Mobile: Collapsible) */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 ${showMobileInsights ? 'block' : 'hidden lg:grid'}`}>
        {/* Left Column: Insights Card */}
        <div>
          <div
            className="rounded-[30px] p-5 select-none flex items-center justify-between gap-4 glass-card h-full"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-shadow-sm)',
            }}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/80 dark:border-white/10"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.2) 100%)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
                }}
              >
                <Lightbulb className="w-6 h-6 text-blue-500 fill-blue-400/40" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-main)] mb-0.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400/40" />
                  <span>Climate Insights</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                  The temperature is 0.5°C higher than yesterday. Humidity remains in a healthy range.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Decorative Living Atmosphere Card */}
        <div>
          <div
            className="rounded-[30px] p-5 select-none flex items-center justify-between gap-4 relative overflow-hidden glass-card h-full"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-shadow-sm)',
            }}
          >
            {/* Plant Atmosphere Visual & Content */}
            <div className="flex items-center gap-4 z-10 min-w-0">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/80 dark:border-white/10"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(20, 184, 166, 0.22) 100%)',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.18)',
                }}
              >
                <Sprout className="w-6 h-6 text-emerald-500" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-main)] mb-0.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-500 fill-emerald-400/40" />
                  <span>Living Atmosphere</span>
                </div>
                <p className="text-xs font-bold text-[var(--text-main)] leading-snug">
                  A healthier space, a happier you.
                </p>
                <p className="text-[11px] text-[var(--text-muted)] font-medium leading-relaxed">
                  Active botanical air purification maintains natural humidity and balance.
                </p>
              </div>
            </div>

            {/* Right side status badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Eco Mode</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
