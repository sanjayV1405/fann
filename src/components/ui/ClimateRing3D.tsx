import React from 'react';
import { motion } from 'framer-motion';
import { Home, Leaf } from 'lucide-react';

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
  // Circle geometry for SVG arc:
  // Radius = 120, circumference = 2 * PI * 120 ~= 753.98
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  // Sweep ~260 degrees arc
  const arcLength = circumference * 0.72;
  const strokeDashoffset = arcLength - (arcLength * percentage) / 100;

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Outer Glow Halo & Ambient Reflection */}
      <div
        className="absolute w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.28) 0%, rgba(196, 181, 253, 0.18) 45%, transparent 70%)',
          filter: 'blur(28px)',
        }}
      />

      {/* Outer 3D Glass Layer Ring (translucent refractive border with depth) */}
      <div
        className="relative w-[310px] h-[310px] rounded-full flex items-center justify-center p-3"
        style={{
          background: 'radial-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(240, 246, 255, 0.45) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '2px solid rgba(255, 255, 255, 0.95)',
          boxShadow: `
            0 20px 50px -10px rgba(70, 100, 170, 0.15),
            0 0 0 10px rgba(255, 255, 255, 0.35),
            0 2px 10px rgba(255, 255, 255, 0.9) inset
          `,
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
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#3B82F6" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx="155"
            cy="155"
            r={radius}
            fill="none"
            stroke="rgba(224, 235, 250, 0.55)"
            strokeWidth="11"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
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

        {/* Glossy White Handle Pill on Dial Arc */}
        {isConnected && (
          <div
            className="absolute w-5 h-5 rounded-full z-10 transition-all duration-700 pointer-events-none"
            style={{
              // Position calculated near top right / ~75% angle as shown in Reference 1
              top: '42px',
              right: '98px',
              background: '#FFFFFF',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.45), 0 0 0 3px rgba(255, 255, 255, 0.95)',
            }}
          />
        )}

        {/* Inner Glass Sphere Content Disc */}
        <div
          className="relative w-[215px] h-[215px] rounded-full flex flex-col items-center justify-center p-4"
          style={{
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.88) 0%, rgba(245, 250, 255, 0.7) 100%)',
            boxShadow: `
              0 12px 30px rgba(70, 100, 170, 0.10),
              0 2px 6px rgba(255, 255, 255, 0.95) inset,
              0 -4px 10px rgba(180, 205, 245, 0.2) inset
            `,
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
          }}
        >
          {/* Top Home Icon inside soft circle */}
          <div className="w-8 h-8 rounded-full bg-slate-100/70 border border-white/80 flex items-center justify-center mb-1 text-slate-600 shadow-sm">
            <Home className="w-4 h-4 text-slate-600" />
          </div>

          {/* Large Hero Temperature Value (24°C) */}
          <div className="flex items-baseline font-bold tracking-tight text-[#172033] leading-none my-1">
            <span className="text-[54px] font-extrabold tracking-tight">
              {isConnected ? Math.round(temperature) : '--'}
            </span>
            <span className="text-2xl font-bold ml-0.5 text-slate-800">{unit}</span>
          </div>

          {/* Comfortable Status Pill with Leaf */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-1"
            style={{
              background: 'rgba(220, 252, 231, 0.8)',
              border: '1px solid rgba(187, 247, 208, 0.9)',
              color: '#15803D',
              boxShadow: '0 2px 6px rgba(34, 197, 94, 0.1)',
            }}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500/30" />
            <span>{isConnected ? statusText : 'Offline'}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
