import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

interface ClimateRing3DProps {
  temperature: number;
  tempDisplay: string;
  unit: string;
  statusText?: string;
  isConnected?: boolean;
}

export const ClimateRing3D: React.FC<ClimateRing3DProps> = ({
  temperature,
  tempDisplay,
  unit,
  statusText = 'Comfortable',
  isConnected = true,
}) => {
  // Normalize temperature for arc (e.g. 15°C -> 0%, 30°C -> 100%)
  const percentage = Math.min(100, Math.max(0, ((temperature - 15) / 15) * 100));
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.72;
  const strokeDashoffset = arcLength - (arcLength * percentage) / 100;

  // Exact coordinates of the tip point in SVG space
  const sweptRadians = (percentage / 100) * (0.72 * 2 * Math.PI);
  const tipX = 155 + radius * Math.cos(sweptRadians);
  const tipY = 155 + radius * Math.sin(sweptRadians);

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Outer Glow Halo with Living Breathing Animation */}
      <div
        className="absolute w-[360px] h-[360px] rounded-full pointer-events-none transition-all duration-700 animate-dial-halo"
        style={{
          background: 'var(--dial-glow)',
          filter: 'blur(28px)',
        }}
      />

      {/* Atmospheric Orbiting Micro Particles */}
      <div className="absolute w-[320px] h-[320px] rounded-full pointer-events-none animate-spin-slow">
        <div className="absolute top-2 left-1/4 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#38BDF8] blur-[0.5px]" />
        <div className="absolute bottom-5 right-1/4 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#C084FC] blur-[0.5px]" />
      </div>
      <div className="absolute w-[320px] h-[320px] rounded-full pointer-events-none animate-spin-reverse-slow">
        <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] blur-[0.5px]" />
      </div>

      {/* Outer 3D Glass Layer Ring */}
      <div
        className="relative w-[310px] h-[310px] rounded-full flex items-center justify-center p-3 transition-all duration-500"
        style={{
          background: 'var(--dial-outer-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '2px solid var(--dial-border)',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        {/* SVG Dial Arc */}
        <svg className="absolute inset-0 w-full h-full -rotate-120" viewBox="0 0 310 310">
          <defs>
            <linearGradient id="climateArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="85%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
            <filter id="arcGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#3B82F6" floodOpacity="0.55" />
            </filter>
            <filter id="pearlGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx="155"
            cy="155"
            r={radius}
            fill="none"
            stroke="var(--dial-track)"
            strokeWidth="11"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            className="transition-colors duration-500"
          />

          {/* Active Gradient Arc */}
          {isConnected && (
            <>
              <circle
                cx="155"
                cy="155"
                r={radius}
                fill="none"
                stroke="url(#climateArcGrad)"
                strokeWidth="11"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                filter="url(#arcGlow)"
                className="transition-all duration-700 ease-out"
              />

              {/* Glowing Luminous Indicator Pearl at Current Temperature Arc Tip */}
              {percentage > 2 && (
                <g className="transition-all duration-700 ease-out">
                  <circle
                    cx={tipX}
                    cy={tipY}
                    r="10"
                    fill="#38BDF8"
                    opacity="0.5"
                    filter="url(#arcGlow)"
                    className="animate-pulse"
                  />
                  <circle
                    cx={tipX}
                    cy={tipY}
                    r="5.5"
                    fill="#FFFFFF"
                    filter="url(#pearlGlow)"
                  />
                  <circle
                    cx={tipX}
                    cy={tipY}
                    r="3"
                    fill="#0284C7"
                  />
                </g>
              )}
            </>
          )}
        </svg>

        {/* Inner Glass Sphere Content Disc */}
        <div
          className="relative w-[215px] h-[215px] rounded-full flex flex-col items-center justify-center p-4 transition-all duration-500 overflow-hidden"
          style={{
            background: 'var(--dial-inner-bg)',
            border: '1.5px solid var(--dial-border)',
            boxShadow: 'var(--glass-card-shadow)',
          }}
        >
          {/* Diagonal Glass Specular Highlight Reflection */}
          <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-gradient-to-br from-white/15 to-transparent blur-sm pointer-events-none -rotate-45" />

          {/* Large Hero Temperature Value (24°C) */}
          <div className="flex items-baseline font-bold tracking-tight text-[var(--text-main)] leading-none my-1 relative z-10">
            <span className="text-[58px] font-extrabold tracking-tight transition-transform duration-300">
              {isConnected ? Math.round(temperature) : '--'}
            </span>
            <span className="text-2xl font-bold ml-0.5 text-[var(--text-muted)]">{unit}</span>
          </div>

          {/* Comfortable Status Pill with Living Breathing Pulse */}
          <motion.div
            animate={{
              boxShadow: [
                '0 2px 8px rgba(34, 197, 94, 0.15)',
                '0 2px 18px rgba(34, 197, 94, 0.4)',
                '0 2px 8px rgba(34, 197, 94, 0.15)',
              ],
              scale: [1, 1.025, 1],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-2 relative z-10 backdrop-blur-md cursor-default"
            style={{
              background: 'rgba(34, 197, 94, 0.16)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#10B981',
            }}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/30 animate-pulse" />
            <span>{isConnected ? statusText : 'Offline'}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
