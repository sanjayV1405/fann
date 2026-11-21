import React from 'react';
import { motion } from 'framer-motion';
import {
  Fan,
  Gauge,
  Sparkles,
  Hand,
  Play,
  Thermometer,
  Droplets,
  Wind,
  Leaf,
  Zap,
  Rocket,
} from 'lucide-react';
import { useHardware } from '../context/HardwareContext';
import { ThreeFan3D } from '../components/ui/ThreeFan3D';
import { MetricCard } from '../components/ui/MetricCard';

export const FanControlPage: React.FC = () => {
  const {
    climateData,
    connectionStatus,
    pendingSpeed,
    setPendingSpeed,
    pendingMode,
    setPendingMode,
    isApplyingSpeed,
    applyFanSettings,
  } = useHardware();

  const isConnected = connectionStatus === 'connected';
  const isFanRunning = isConnected && climateData.fanStatus === 'running';

  const presets = [
    { label: 'Low', val: 25, icon: Leaf },
    { label: 'Medium', val: 75, icon: Fan },
    { label: 'High', val: 90, icon: Zap },
    { label: 'Maximum', val: 100, icon: Rocket },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Section: Header & 3D Fan Hero & Right Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Heading & Description */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Badge: Fan Control */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-sm text-xs font-semibold text-blue-600">
            <Fan className="w-3.5 h-3.5 text-blue-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Fan Control</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-[#172033] tracking-tight leading-[1.15]">
            Control Your Fan
            <br />
            <span className="text-gradient-airloop">with Precision</span>
          </h1>

          <p className="text-sm text-slate-500 font-medium max-w-sm">
            Adjust fan speed and mode for optimal comfort.
          </p>
        </div>

        {/* Center Column: The Signature 3D Fan Visual with Pedestal Base & Vortex (Exact match to Reference 2) */}
        <div className="lg:col-span-4 flex items-center justify-center py-4">
          <ThreeFan3D
            size="lg"
            speed={climateData.fanSpeed}
            isRunning={isFanRunning}
            showBase={true}
            showVortex={true}
          />
        </div>

        {/* Right Column: Fan Operation Mode & Speed Control Panel (Exact match to Reference 2) */}
        <div className="lg:col-span-4">
          <div
            className="rounded-[30px] p-6 select-none relative"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 45px -12px rgba(70, 100, 170, 0.12), 0 2px 6px rgba(255, 255, 255, 0.9) inset',
            }}
          >
            {/* Header: Fan icon + "Fan Operation Mode" */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-50/80 border border-blue-200/50 flex items-center justify-center text-blue-600">
                <Fan className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#172033]">Fan Operation Mode</h3>
            </div>

            {/* Segmented Mode Control: Manual vs Automatic */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100/60 border border-white/80 mb-5">
              <button
                onClick={() => setPendingMode('manual')}
                disabled={!isConnected}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  pendingMode === 'manual'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span>Manual</span>
              </button>

              <button
                onClick={() => setPendingMode('automatic')}
                disabled={!isConnected}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  pendingMode === 'automatic'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Automatic</span>
              </button>
            </div>

            {/* Speed Section: "Fan Speed" + "75%" + "● Optimal Range" */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#172033]">
                  <Gauge className="w-4 h-4 text-blue-500" />
                  <span>Fan Speed</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Optimal Range</span>
                </div>
              </div>

              {/* Large Speed Percentage Readout */}
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-4xl font-extrabold text-[#172033] tracking-tight">
                  {isConnected ? `${pendingSpeed}%` : '--%'}
                </span>
              </div>

              {/* Precision Slider Bar */}
              <div className="relative flex items-center py-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  disabled={!isConnected}
                  value={pendingSpeed}
                  onChange={(e) => setPendingSpeed(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200/80 rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #60A5FA ${pendingSpeed}%, #E2E8F0 ${pendingSpeed}%, #E2E8F0 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Speed Presets: Low, Medium, High, Maximum */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {presets.map((preset) => {
                const Icon = preset.icon;
                const isActive = pendingSpeed === preset.val;
                return (
                  <button
                    key={preset.label}
                    onClick={() => setPendingSpeed(preset.val)}
                    disabled={!isConnected}
                    className={`py-2 px-1.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25 border border-blue-400'
                        : 'bg-white/60 text-slate-600 hover:bg-white/95 border border-white/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{preset.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Apply Speed Button */}
            <button
              onClick={applyFanSettings}
              disabled={!isConnected || isApplyingSpeed}
              className="btn-primary-gradient w-full py-3 px-4 rounded-2xl text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>{isApplyingSpeed ? 'Transmitting to ESP32...' : 'Apply Speed'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 4 Metric Cards (Exact match to Reference Image 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
        {/* 1. Current Temperature */}
        <MetricCard
          icon={Thermometer}
          iconBgColor="bg-sky-50 text-sky-500"
          iconColor="text-sky-500"
          label="Current Temperature"
          value={isConnected ? `${climateData.temperature}°C` : '--°C'}
          badge={{ text: '↑ 0.2°', type: 'green' }}
          waveType="blue"
        />

        {/* 2. Humidity */}
        <MetricCard
          icon={Droplets}
          iconBgColor="bg-blue-50 text-blue-500"
          iconColor="text-blue-500"
          label="Humidity"
          value={isConnected ? `${climateData.humidity}%` : '--%'}
          badge={{ text: '↑ 1%', type: 'purple' }}
          waveType="purple"
        />

        {/* 3. Fan Status (with 8-bar equalizer graphic!) */}
        <MetricCard
          icon={Wind}
          iconBgColor="bg-blue-50 text-blue-500"
          iconColor="text-blue-500"
          label="Fan Status"
          value={isConnected ? (climateData.fanStatus === 'running' ? 'Running' : 'Stopped') : 'Offline'}
          statusDot={{
            color: isFanRunning ? '#10B981' : '#94A3B8',
            text: isFanRunning ? 'Running' : 'Stopped',
          }}
          waveType="bars"
          fanSpeed={climateData.fanSpeed}
        />

        {/* 4. Air Quality */}
        <MetricCard
          icon={Leaf}
          iconBgColor="bg-emerald-50 text-emerald-500"
          iconColor="text-emerald-500"
          label="Air Quality"
          value=""
          statusDot={{ color: '#10B981', text: isConnected ? climateData.airQualityStatus : 'Offline' }}
          waveType="green"
        />
      </div>
    </motion.div>
  );
};
