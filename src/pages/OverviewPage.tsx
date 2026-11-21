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
    { label: 'Medium', val: 75 },
    { label: 'High', val: 90 },
    { label: 'Max', val: 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Main Hero Section: Left Greetings & Hero Text, Center 3D Climate Dial, Right Fan Control Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Greeting & CTA */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Climate Control Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-sm text-xs font-semibold text-emerald-600">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Live Climate Control</span>
          </div>

          {/* Heading: "Welcome Back, Sanjay!" */}
          <div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-[#172033] tracking-tight leading-[1.15]">
              Welcome Back,
              <br />
              <span className="relative inline-block text-gradient-airloop">
                Sanjay!
                {/* Stylized blue-to-lavender underline wave swoop from Reference Image 1 */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 overflow-visible"
                  viewBox="0 0 160 12"
                  fill="none"
                >
                  <path
                    d="M 2,8 C 45,2 105,12 158,4"
                    stroke="url(#heroSwoopGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="heroSwoopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="60%" stopColor="#818CF8" />
                      <stop offset="100%" stopColor="#C084FC" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
          </div>

          <p className="text-sm text-slate-500 font-medium max-w-sm pt-1">
            Your smart environment, always in your control.
          </p>

          {/* Explore Features Button */}
          <div className="pt-2">
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
        <div className="lg:col-span-4 flex items-center justify-center py-2">
          <ClimateRing3D
            temperature={tempObj.num}
            tempDisplay={tempObj.display}
            unit={tempObj.unit}
            statusText={climateData.airQualityStatus === 'Good' ? 'Comfortable' : 'Adjusting'}
            isConnected={isConnected}
          />
        </div>

        {/* Right Column: Fan Control Glass Widget (matches Reference Image 1) */}
        <div className="lg:col-span-4">
          <div
            className="rounded-[30px] p-6 transition-all duration-300 relative select-none"
            style={{
              background: 'rgba(255, 255, 255, 0.70)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 45px -12px rgba(70, 100, 170, 0.12), 0 2px 6px rgba(255, 255, 255, 0.9) inset',
            }}
          >
            {/* Widget Header: Fan Icon + "Fan Control" + "● Running" */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50/80 border border-blue-200/50 flex items-center justify-center text-blue-600">
                  <Fan className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#172033]">Fan Control</h3>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-200/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isFanRunning ? 'Running' : 'Stopped'}</span>
              </div>
            </div>

            {/* Fan Preview & Speed readout */}
            <div className="flex items-center justify-between px-2 py-1 mb-4">
              {/* Miniature 3D Fan */}
              <div className="flex items-center justify-center shrink-0">
                <ThreeFan3D
                  size="sm"
                  speed={pendingSpeed}
                  isRunning={isFanRunning}
                  showVortex={false}
                />
              </div>

              {/* Speed readout */}
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-400 block mb-0.5">Speed</span>
                <span className="text-3xl font-extrabold text-[#172033] tracking-tight">
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
                  className="w-full h-2.5 bg-slate-200/70 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #60A5FA ${pendingSpeed}%, #E2E8F0 ${pendingSpeed}%, #E2E8F0 100%)`,
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
                      className={`py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25 border border-blue-400'
                          : 'bg-white/60 text-slate-600 hover:bg-white/90 border border-white/80'
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
              className="w-full py-2.5 px-4 rounded-2xl bg-white/80 hover:bg-white text-slate-800 text-xs font-bold border border-white/90 shadow-sm flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-500" />
              <span>{isApplyingSpeed ? 'Transmitting...' : 'Apply Speed'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 4 Metric Cards (Exact match to Reference Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
        {/* 1. Temperature */}
        <MetricCard
          icon={Thermometer}
          iconBgColor="bg-sky-50 text-sky-500"
          iconColor="text-sky-500"
          label="Temperature"
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

        {/* 3. Air Quality */}
        <MetricCard
          icon={Wind}
          iconBgColor="bg-emerald-50 text-emerald-500"
          iconColor="text-emerald-500"
          label="Air Quality"
          value={isConnected ? climateData.airQualityStatus : '--'}
          statusDot={{ color: '#10B981', text: '' }}
          waveType="green"
        />

        {/* 4. Sensor Health */}
        <MetricCard
          icon={ShieldCheck}
          iconBgColor="bg-emerald-50 text-emerald-500"
          iconColor="text-emerald-500"
          label="Sensor Health"
          value=""
          statusDot={{ color: '#10B981', text: 'Healthy' }}
          waveType="green"
        />
      </div>
    </motion.div>
  );
};
