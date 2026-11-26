import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Fan,
  Thermometer,
  Droplets,
  Wind,
  ShieldCheck,
  Zap,
  Leaf,
} from 'lucide-react';
import { useHardware } from '../context/HardwareContext';
import { ClimateRing3D } from '../components/ui/ClimateRing3D';
import { ThreeFan3D } from '../components/ui/ThreeFan3D';
import { MetricCard } from '../components/ui/MetricCard';

export const OverviewPage: React.FC = () => {
  const {
    climateData,
    connectionStatus,
    pendingSpeed,
    setPendingSpeed,
    isApplyingSpeed,
    applyFanSettings,
    setActivePage,
    formatTemp,
  } = useHardware();

  const isConnected = connectionStatus === 'connected';
  const isFanRunning = isConnected && climateData.fanStatus === 'running';

  const tempObj = formatTemp(climateData.temperature);

  const presets = [
    { label: 'Low', val: 25 },
    { label: 'Medium', val: 50 },
    { label: 'High', val: 80 },
    { label: 'Max', val: 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-full flex flex-col gap-4 sm:gap-7 py-1 sm:py-3 max-w-[1440px] mx-auto w-full"
    >
      {/* Top Main Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-center">
        {/* Left Column: Greeting & CTA */}
        <div className="lg:col-span-4 space-y-2 sm:space-y-4">
          {/* Live Climate Control Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Live Climate Control</span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-xl sm:text-2xl xl:text-4xl font-extrabold text-[var(--text-main)] tracking-tight leading-[1.2]">
              Your smart environment,
              <br />
              <span className="text-gradient-airloop">
                always in your control.
              </span>
            </h1>
          </div>

          {/* Explore Features Button (Desktop Only) */}
          <div className="hidden lg:flex pt-2">
            <button
              onClick={() => setActivePage('fan')}
              className="btn-primary-gradient px-6 py-3 rounded-full text-white text-sm font-semibold flex items-center gap-2 cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                <span className="w-0 h-0 border-t-3 border-t-transparent border-b-3 border-b-transparent border-l-4 border-l-white ml-0.5" />
              </div>
              <span>Explore Features</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Center Column: Signature 3D Glass Climate Dial */}
        <div className="lg:col-span-4 flex items-center justify-center py-1 sm:py-2">
          <ClimateRing3D
            temperature={tempObj.num}
            tempDisplay={tempObj.display}
            unit={tempObj.unit}
            statusText={climateData.airQualityStatus === 'Good' ? 'Comfortable' : 'Adjusting'}
            isConnected={isConnected}
          />
        </div>

        {/* Right Column: Fan Control Glass Widget (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-4">
          <div
            className="rounded-[30px] p-6 transition-all duration-300 relative select-none glass-card"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-card-shadow)',
            }}
          >
            {/* Widget Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Fan className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">Fan Control</h3>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isFanRunning ? 'Running' : 'Stopped'}</span>
              </div>
            </div>

            {/* Fan Preview & Speed readout */}
            <div className="flex items-center justify-between px-2 py-1 mb-4">
              <div className="flex items-center justify-center shrink-0">
                <ThreeFan3D
                  size="sm"
                  speed={pendingSpeed}
                  isRunning={isFanRunning}
                  showVortex={false}
                />
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-[var(--text-subtle)] block mb-0.5">Speed</span>
                <span className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                  {isConnected ? `${pendingSpeed}%` : '--%'}
                </span>
              </div>
            </div>

            {/* Speed Slider Bar */}
            <div className="space-y-3 mb-4">
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  disabled={!isConnected}
                  value={pendingSpeed}
                  onChange={(e) => setPendingSpeed(Number(e.target.value))}
                  className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #60A5FA ${pendingSpeed}%, var(--slider-bg) ${pendingSpeed}%, var(--slider-bg) 100%)`,
                  }}
                />
              </div>

              {/* Presets: Low, Medium, High, Max */}
              <div className="grid grid-cols-4 gap-2">
                {presets.map((preset) => {
                  const isActive = pendingSpeed === preset.val;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => setPendingSpeed(preset.val)}
                      disabled={!isConnected}
                      className={`py-2 sm:py-1.5 min-h-[38px] rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${isActive
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25 border border-blue-400'
                        : 'bg-black/5 dark:bg-white/10 text-[var(--text-muted)] hover:bg-black/10 dark:hover:bg-white/20 border border-black/5 dark:border-white/10'
                        }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Apply Speed Button */}
            <button
              onClick={applyFanSettings}
              disabled={!isConnected || isApplyingSpeed}
              className="w-full py-3 sm:py-2.5 min-h-[44px] px-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-[var(--text-main)] text-xs font-bold border border-white/90 dark:border-white/10 shadow-sm flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-blue-500" />
              <span>{isApplyingSpeed ? 'Transmitting...' : 'Apply Speed'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Metric Cards (Mobile: Compact 2x2 grid; Desktop: 4-col) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 pt-1">
        {/* 1. Current Temperature (Desktop Only) */}
        <div className="hidden lg:block">
          <MetricCard
            icon={Thermometer}
            iconBgColor="bg-sky-50 dark:bg-sky-950/40 text-sky-500"
            iconColor="text-sky-500"
            label="Current Temperature"
            value={isConnected ? `${climateData.temperature}°C` : '--°C'}
            badge={{ text: '↑ 0.2°', type: 'green' }}
            waveType="blue"
          />
        </div>

        {/* 2. Humidity */}
        <MetricCard
          icon={Droplets}
          iconBgColor="bg-blue-50 dark:bg-blue-950/40 text-blue-500"
          iconColor="text-blue-500"
          label="Humidity"
          value={isConnected ? `${climateData.humidity}%` : '--%'}
          badge={{ text: '↑ 1%', type: 'purple' }}
          waveType="purple"
        />

        {/* 3. Fan Status */}
        <MetricCard
          icon={Wind}
          iconBgColor="bg-sky-50 dark:bg-sky-950/40 text-sky-500"
          iconColor="text-sky-500"
          label="Fan Status"
          statusText={isConnected ? (climateData.fanStatus === 'running' ? 'Running' : 'Stopped') : 'Offline'}
          statusDotColor={isFanRunning ? '#10B981' : '#94A3B8'}
          badge={{ text: isConnected && isFanRunning ? `${climateData.fanSpeed}% Speed` : 'Off', type: 'green' }}
          waveType="bars"
          fanSpeed={climateData.fanSpeed}
        />

        {/* 4. Air Quality */}
        <MetricCard
          icon={Leaf}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500"
          iconColor="text-emerald-500"
          label="Air Quality"
          statusText={isConnected ? climateData.airQualityStatus : 'Offline'}
          statusDotColor="#10B981"
          badge={{ text: 'Optimal', type: 'green' }}
          waveType="green"
        />

        {/* 5. Power Draw (Mobile 4th card in 2x2 grid) */}
        <div className="block lg:hidden">
          <MetricCard
            icon={Zap}
            iconBgColor="bg-amber-50 dark:bg-amber-950/40 text-amber-500"
            iconColor="text-amber-500"
            label="Power Draw"
            value={isConnected && isFanRunning ? `${(12 + (climateData.fanSpeed / 100) * 28).toFixed(1)}W` : '0W'}
            badge={{ text: 'Eco', type: 'green' }}
            waveType="green"
          />
        </div>
      </div>
    </motion.div>
  );
};
