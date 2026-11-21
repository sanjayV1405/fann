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

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Outer Glow Halo & Ambient Reflection */}
      <div
        className="absolute w-[360px] h-[360px] rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: 'var(--dial-glow)',
          filter: 'blur(28px)',
        }}
      />

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
            <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#3B82F6" floodOpacity="0.45" />
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
          )}
        </svg>

        {/* Inner Glass Sphere Content Disc */}
        <div
          className="relative w-[215px] h-[215px] rounded-full flex flex-col items-center justify-center p-4 transition-all duration-500"
          style={{
            background: 'var(--dial-inner-bg)',
            border: '1.5px solid var(--dial-border)',
            boxShadow: 'var(--glass-card-shadow)',
          }}
        >
          {/* Large Hero Temperature Value (24°C) */}
          <div className="flex items-baseline font-bold tracking-tight text-[var(--text-main)] leading-none my-1">
            <span className="text-[58px] font-extrabold tracking-tight">
              {isConnected ? Math.round(temperature) : '--'}
            </span>
            <span className="text-2xl font-bold ml-0.5 text-[var(--text-muted)]">{unit}</span>
          </div>

          {/* Comfortable Status Pill with Leaf */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-2"
            style={{
              background: 'rgba(34, 197, 94, 0.16)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#10B981',
              boxShadow: '0 2px 6px rgba(34, 197, 94, 0.12)',
            }}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/30" />
            <span>{isConnected ? statusText : 'Offline'}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
