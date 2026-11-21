import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  BarChart2,
  Thermometer,
  Droplets,
  Wind,
  Leaf,
  Lightbulb,
  ChevronRight,
  Check,
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

  const isConnected = connectionStatus === 'connected';

  // Custom Glass Tooltip matching Reference Image 3
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-2xl p-2.5 shadow-xl border border-white/95 select-none"
          style={{
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 12px 28px -6px rgba(70, 100, 170, 0.16)',
          }}
        >
          <p className="text-[10px] font-bold text-slate-400 mb-1">{label}</p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#172033]">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{payload[0]?.value}°C</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 mt-0.5">
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Row: Heading on Left, 3 Mini Environmental Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Heading */}
        <div className="lg:col-span-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-sm text-xs font-semibold text-emerald-600">
            <Leaf className="w-3.5 h-3.5 text-emerald-500" />
            <span>Environment Monitor</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-[#172033] tracking-tight leading-[1.15]">
            Know Your
            <br />
            <span className="text-gradient-airloop">Environment</span>
          </h1>

          <p className="text-sm text-slate-500 font-medium max-w-md">
            Real-time insights for a healthier and more comfortable space.
          </p>
        </div>

        {/* Right Column: 3 Top Mini Cards (Exact match to Reference 3) */}
        <div className="lg:col-span-6 grid grid-cols-3 gap-4">
          {/* Card 1: Temperature */}
          <div
            className="p-4 rounded-3xl relative select-none"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 12px 30px -8px rgba(70, 100, 170, 0.08)',
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 mb-2 border border-white shadow-sm">
              <Thermometer className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-[#172033]">
                {isConnected ? `${climateData.temperature}°C` : '--'}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                ↑ 0.2°
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">Temperature</span>
          </div>

          {/* Card 2: Humidity */}
          <div
            className="p-4 rounded-3xl relative select-none"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 12px 30px -8px rgba(70, 100, 170, 0.08)',
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mb-2 border border-white shadow-sm">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-[#172033]">
                {isConnected ? `${climateData.humidity}%` : '--'}
              </span>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                ↑ 1%
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">Humidity</span>
          </div>

          {/* Card 3: Air Quality */}
          <div
            className="p-4 rounded-3xl relative select-none"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 12px 30px -8px rgba(70, 100, 170, 0.08)',
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-2 border border-white shadow-sm">
              <Wind className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-[#172033]">
                {isConnected ? climateData.airQualityStatus : '--'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">Air Quality</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Climate Trends Chart (Left) & Dedicated Air Quality Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Climate Trends Recharts Panel (Exact match to Reference 3) */}
        <div className="lg:col-span-8">
          <div
            className="rounded-[32px] p-6 select-none relative"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 45px -12px rgba(70, 100, 170, 0.12), 0 2px 6px rgba(255, 255, 255, 0.9) inset',
            }}
          >
            {/* Chart Header: Title, Legend, Time Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200/50">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#172033]">Climate Trends</h3>

                {/* Legend */}
                <div className="flex items-center gap-4 ml-3 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>Temperature (°C)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Humidity (%)</span>
                  </div>
                </div>
              </div>

              {/* Time Filters: 1h, 24h, 7d */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/70 border border-white/80">
                {(['1h', '24h', '7d'] as const).map((range) => {
                  const isActive = historyRange === range;
                  return (
                    <button
                      key={range}
                      onClick={() => setHistoryRange(range)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {range}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-[260px] w-full">
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

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.6)" />

                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                  />

                  <YAxis
                    domain={[10, 45]}
                    ticks={[10, 20, 30, 40]}
                    tickLine={false}
                    axisLine={false}
                    unit="°C"
                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
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

        {/* Right Column: Air Quality Gauge Card (Exact match to Reference 3) */}
        <div className="lg:col-span-4">
          <div
            className="h-full rounded-[32px] p-6 select-none flex flex-col justify-between"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 45px -12px rgba(70, 100, 170, 0.12), 0 2px 6px rgba(255, 255, 255, 0.9) inset',
            }}
          >
            {/* Header: Leaf + Air Quality */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200/50">
                <Leaf className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">Air Quality</h3>
            </div>

            {/* Circular Gauge Arc */}
            <div className="relative flex flex-col items-center justify-center my-3">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Circular Track & Emerald Arc */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="62"
                    fill="none"
                    stroke="rgba(220, 252, 231, 0.7)"
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

                {/* Inner Disc with Leaf, "Good", and "AQI: 32" */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Leaf className="w-6 h-6 text-emerald-600 mb-0.5" />
                  <span className="text-2xl font-extrabold text-[#172033] tracking-tight">Good</span>
                  <span className="text-xs font-semibold text-slate-500">
                    AQI: {isConnected ? climateData.aqi : '--'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pill: Air quality is excellent! */}
            <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-emerald-700 text-xs font-semibold">
              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Air quality is excellent!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Left Insights Card & Right Decorative Living Card (Exact match to Reference 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Insights Card */}
        <div className="lg:col-span-7">
          <div
            className="rounded-[30px] p-5 select-none flex items-center justify-between gap-4"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 12px 30px -8px rgba(70, 100, 170, 0.08)',
            }}
          >
            <div className="flex items-center gap-4">
              {/* Glowing Lightbulb in glass circle */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white"
                style={{
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
                }}
              >
                <Lightbulb className="w-6 h-6 text-blue-500 fill-blue-400/40" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#172033] mb-0.5">
                  <span>💡 Insights</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  The temperature is 0.5°C higher than yesterday. Humidity remains in a healthy range.
                </p>
              </div>
            </div>

            {/* Right arrow button */}
            <button
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-white shadow-sm flex items-center justify-center text-slate-600 transition-all cursor-pointer shrink-0"
              aria-label="View more insights"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Decorative Living Atmosphere Card ("A healthier space, a happier you.") */}
        <div className="lg:col-span-5">
          <div
            className="rounded-[30px] p-4 select-none flex items-center justify-between relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(238, 246, 255, 0.8) 0%, rgba(224, 242, 254, 0.6) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 12px 30px -8px rgba(70, 100, 170, 0.08)',
            }}
          >
            {/* Potted Plant Visual */}
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 flex items-center justify-center text-2xl filter drop-shadow">
                🪴
              </div>

              <div>
                <p className="text-xs font-bold text-[#172033]">A healthier space,</p>
                <p className="text-xs text-slate-600">a happier you.</p>
              </div>
            </div>

            {/* Translucent Glass Bubbles / Spheres (as seen in Image 3) */}
            <div className="relative w-24 h-12 flex items-center justify-end z-0">
              <div
                className="w-10 h-10 rounded-full absolute right-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(147, 197, 253, 0.7) 0%, rgba(99, 102, 241, 0.6) 100%)',
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.3), inset 0 2px 4px rgba(255,255,255,0.7)',
                }}
              />
              <div
                className="w-14 h-14 rounded-full absolute -right-2 -top-2 opacity-80"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8) 0%, rgba(191, 219, 254, 0.4) 60%, rgba(165, 180, 252, 0.6) 100%)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.8)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
