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
  Cpu,
} from 'lucide-react';
import { useHardware } from '../context/HardwareContext';
import { ThreeFan3D } from '../components/ui/ThreeFan3D';
import { MetricCard } from '../components/ui/MetricCard';
import { calculateAutoSpeed } from '../types';

export const FanControlPage: React.FC = () => {
  const {
    climateData,
    connectionStatus,
    pendingSpeed,
    setPendingSpeed,
    pendingMode,
    setFanMode,
    isApplyingSpeed,
    applyFanSettings,
  } = useHardware();

  const isConnected = connectionStatus === 'connected';
  const isFanRunning = isConnected && climateData.fanStatus === 'running';
  const currentMode = climateData.fanMode || pendingMode;
  const autoSpeed = calculateAutoSpeed(climateData.temperature);

  const presets = [
    { label: 'Low', val: 25, icon: Leaf },
    { label: 'Medium', val: 50, icon: Fan },
    { label: 'High', val: 80, icon: Zap },
    { label: 'Max', val: 100, icon: Rocket },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Fan className="w-3.5 h-3.5 text-blue-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Fan Control</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-[var(--text-main)] tracking-tight leading-[1.18]">
            Control Your Fan
            <br />
            <span className="text-gradient-airloop">with Precision</span>
          </h1>

          <p className="text-sm text-[var(--text-muted)] font-medium max-w-sm">
            Adjust fan speed and mode for optimal comfort.
          </p>
        </div>

        {/* Center Column: 3D Fan Visual with Pedestal Base */}
        <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-center py-4 px-2 overflow-visible">
          <ThreeFan3D
            size="lg"
            speed={climateData.fanSpeed}
            isRunning={isFanRunning}
            showBase={true}
            showVortex={true}
          />
        </div>

        {/* Right Column: Fan Operation Mode & Speed Control Panel */}
        <div className="lg:col-span-4 xl:col-span-4">
          <div
            className="rounded-[30px] p-6 select-none relative glass-card"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-card-shadow)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Fan className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">Fan Operation Mode</h3>
            </div>

            {/* Segmented Mode Control */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 mb-5">
              <button
                onClick={() => setFanMode('manual')}
                disabled={!isConnected || isApplyingSpeed}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  currentMode === 'manual'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span>Manual</span>
              </button>

              <button
                onClick={() => setFanMode('automatic')}
                disabled={!isConnected || isApplyingSpeed}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  currentMode === 'automatic'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Automatic</span>
              </button>
            </div>

            {currentMode === 'automatic' ? (
              /* Automatic Mode: No manual speed controls; shows live room temp and auto-regulated speed based on sensors */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <Thermometer className="w-4 h-4 text-amber-500" />
                      Room Temperature
                    </span>
                    <span className="text-2xl font-black text-amber-500">
                      {isConnected ? `${climateData.temperature}°C` : '--°C'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/10">
                    <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-blue-500" />
                      Auto Fan Speed
                    </span>
                    <span className="text-3xl font-extrabold text-[var(--text-main)]">
                      {isConnected ? `${autoSpeed}%` : '--%'}
                    </span>
                  </div>
                </div>

                {/* Sensor Regulation Info Box */}
                <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" />
                      Sensor Auto-Regulation Active
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Regulating
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    In automatic mode, manual level setting is disabled. The onboard ESP32 sensor reads room temperature and automatically switches fan speed to keep the environment optimal.
                  </p>

                  <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-black/5 dark:border-white/10 text-center">
                    <div
                      className={`p-2 rounded-xl transition-all ${
                        autoSpeed === 25
                          ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/25'
                          : 'bg-black/5 dark:bg-white/5 text-[var(--text-subtle)]'
                      }`}
                    >
                      <div className="text-[10px] opacity-80">&lt;22°C</div>
                      <div className="text-xs font-bold">25%</div>
                    </div>
                    <div
                      className={`p-2 rounded-xl transition-all ${
                        autoSpeed === 50
                          ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/25'
                          : 'bg-black/5 dark:bg-white/5 text-[var(--text-subtle)]'
                      }`}
                    >
                      <div className="text-[10px] opacity-80">22-26°C</div>
                      <div className="text-xs font-bold">50%</div>
                    </div>
                    <div
                      className={`p-2 rounded-xl transition-all ${
                        autoSpeed === 80
                          ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/25'
                          : 'bg-black/5 dark:bg-white/5 text-[var(--text-subtle)]'
                      }`}
                    >
                      <div className="text-[10px] opacity-80">26-30°C</div>
                      <div className="text-xs font-bold">80%</div>
                    </div>
                    <div
                      className={`p-2 rounded-xl transition-all ${
                        autoSpeed === 100
                          ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/25'
                          : 'bg-black/5 dark:bg-white/5 text-[var(--text-subtle)]'
                      }`}
                    >
                      <div className="text-[10px] opacity-80">&gt;30°C</div>
                      <div className="text-xs font-bold">100%</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Manual Mode: Precision slider, presets, Apply Speed button */
              <div>
                {/* Speed Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                      <Gauge className="w-4 h-4 text-blue-500" />
                      <span>Fan Speed</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Optimal Range</span>
                    </div>
                  </div>

                  {/* Large Speed Percentage Readout */}
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
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
                      className="w-full h-3 rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                      style={{
                        background: `linear-gradient(to right, #3B82F6 0%, #60A5FA ${pendingSpeed}%, var(--slider-bg) ${pendingSpeed}%, var(--slider-bg) 100%)`,
                      }}
                    />
                  </div>
                </div>

                {/* Speed Presets */}
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
                            : 'bg-black/5 dark:bg-white/10 text-[var(--text-muted)] hover:bg-black/10 dark:hover:bg-white/20 border border-black/5 dark:border-white/10'
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
            )}
          </div>
        </div>
      </div>

      {/* Bottom 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
        {/* 1. Current Temperature */}
        <MetricCard
          icon={Thermometer}
          iconBgColor="bg-sky-50 dark:bg-sky-950/40 text-sky-500"
          iconColor="text-sky-500"
          label="Current Temperature"
          value={isConnected ? `${climateData.temperature}°C` : '--°C'}
          badge={{ text: '↑ 0.2°', type: 'green' }}
          waveType="blue"
        />

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
          waveType="green"
        />
      </div>
    </motion.div>
  );
};
