import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ThreeFan3DProps {
  speed: number; // 0 to 100
  isRunning: boolean;
  size?: 'sm' | 'md' | 'lg';
  showBase?: boolean;
  showVortex?: boolean;
}

export const ThreeFan3D: React.FC<ThreeFan3DProps> = ({
  speed,
  isRunning,
  size = 'lg',
  showBase = false,
  showVortex = true,
}) => {
  const spinDuration = useMemo(() => {
    if (!isRunning || speed <= 0) return 0;
    const clamped = Math.max(10, Math.min(100, speed));
    return (110 - clamped) * 0.015 + 0.3;
  }, [speed, isRunning]);

  const sizeDimensions = {
    sm: { w: 140, h: 140 },
    md: { w: 220, h: 220 },
    lg: { w: 320, h: 320 },
  }[size];

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* FAN HEAD CONTAINER */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: sizeDimensions.w, height: sizeDimensions.h }}
      >
        {/* Dynamic Air Vortex & Flow Rings */}
        {showVortex && isRunning && (
          <>
            {/* Pulsing Ethereal Radial Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: [0.35, 0.65, 0.35],
                scale: [0.98, 1.14, 0.98],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[138%] h-[138%] rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(66, 165, 255, 0.22) 0%, rgba(183, 164, 255, 0.14) 45%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />

            {/* Sweeping Airflow Curved Vortex Orbit */}
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none opacity-70"
              viewBox="0 0 400 400"
              fill="none"
            >
              <defs>
                <linearGradient id="vortexOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
                  <stop offset="45%" stopColor="#818CF8" stopOpacity="0.5" />
                  <stop offset="85%" stopColor="#C084FC" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
                </linearGradient>
              </defs>
              <ellipse
                cx="200"
                cy="200"
                rx="175"
                ry="175"
                stroke="url(#vortexOrbitGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="650 350"
                className="animate-spin"
                style={{
                  animationDuration: '14s',
                  animationTimingFunction: 'linear',
                  transformOrigin: '200px 200px',
                }}
              />
            </svg>

            {/* Floating Botanical Leaves */}
            <div
              className="absolute top-2 -left-5 pointer-events-none animate-float"
              style={{ animationDelay: '0s' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19.5 4.5C14 4.5 8 9 7.5 15C7.5 15 13 14.5 17 10C17.5 9.5 19.5 4.5 19.5 4.5Z"
                  fill="#4ADE80"
                  fillOpacity="0.9"
                />
                <path
                  d="M7.5 15C9.5 13 13 10.5 16.5 8"
                  stroke="#16A34A"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div
              className="absolute top-10 -right-7 pointer-events-none animate-float"
              style={{ animationDelay: '1.5s' }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="rotate-45">
                <path
                  d="M20 4C14 4 8 9 7.5 15.5C7.5 15.5 13.5 15 17.5 10C18 9.5 20 4 20 4Z"
                  fill="#22C55E"
                  fillOpacity="0.85"
                />
                <path
                  d="M7.5 15.5C9.5 13.5 13.5 10.5 17 8"
                  stroke="#15803D"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div
              className="absolute bottom-4 -left-4 pointer-events-none animate-float"
              style={{ animationDelay: '2.8s' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="-rotate-12">
                <path
                  d="M19 5C14 5 9 9.5 8.5 15C8.5 15 14 14.5 17.5 10.5C18 10 19 5 19 5Z"
                  fill="#86EFAC"
                  fillOpacity="0.9"
                />
              </svg>
            </div>
          </>
        )}

        {/* MAIN CIRCULAR 3D ENCLOSURE / HOUSING */}
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center p-3 select-none transition-all duration-500"
          style={{
            background: 'var(--fan-housing-bg)',
            boxShadow: 'var(--fan-housing-shadow)',
            border: '4px solid var(--fan-housing-border)',
          }}
        >
          {/* Inner Shroud Depth Ring */}
          <div
            className="absolute inset-2 rounded-full pointer-events-none transition-all duration-500"
            style={{
              background: 'var(--fan-shroud-bg)',
              boxShadow:
                'inset 0 6px 14px rgba(0, 0, 0, 0.35), inset 0 -4px 8px rgba(255, 255, 255, 0.15)',
            }}
          />

          {/* Outer Chrome Rim Reflection */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none border border-white/20 dark:border-white/10"
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, transparent 50%, rgba(140, 180, 240, 0.15) 100%)',
            }}
          />

          {/* ROTOR WITH 5 AERODYNAMIC BLADES */}
          <div className="absolute inset-3 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full overflow-visible"
              style={{
                animation:
                  isRunning && spinDuration > 0
                    ? `spin-smooth ${spinDuration}s linear infinite`
                    : 'none',
                transformOrigin: '50% 50%',
              }}
            >
              <defs>
                <linearGradient id="fanBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="35%" stopColor="#60A5FA" />
                  <stop offset="70%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>

                <linearGradient id="fanBladeHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
                  <stop offset="60%" stopColor="#93C5FD" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity="0" />
                </linearGradient>

                <filter id="bladeShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="1" dy="3" stdDeviation="3.5" floodColor="#1E3A8A" floodOpacity="0.35" />
                </filter>
              </defs>

              {[0, 72, 144, 216, 288].map((angle) => (
                <g key={angle} transform={`rotate(${angle} 100 100)`} filter="url(#bladeShadow)">
                  <path
                    d="M 100,100 L 92,76 C 84,54 74,30 92,16 C 112,12 128,24 118,50 C 111,68 107,86 100,100 Z"
                    fill="url(#fanBladeGrad)"
                  />
                  <path
                    d="M 94,72 C 88,52 82,34 94,20 C 104,17 114,24 114,34 C 106,48 100,64 94,72 Z"
                    fill="url(#fanBladeHighlight)"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* CENTER HUB */}
          <div
            className="absolute rounded-full flex items-center justify-center z-10 pointer-events-none transition-all duration-500"
            style={{
              width: sizeDimensions.w * 0.28,
              height: sizeDimensions.h * 0.28,
              background:
                'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(212, 227, 251, 0.8) 60%, rgba(171, 197, 245, 0.8) 100%)',
              boxShadow:
                '0 8px 18px rgba(37, 88, 202, 0.35), inset 0 2px 5px rgba(255, 255, 255, 0.95)',
              border: '2.5px solid rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* Inner Glowing LED Core */}
            <div
              className={`w-[60%] h-[60%] rounded-full flex items-center justify-center transition-all duration-500 ${
                isRunning ? 'shadow-[0_0_16px_#38BDF8]' : 'opacity-60'
              }`}
              style={{
                background: isRunning
                  ? 'radial-gradient(circle at 40% 40%, #BAE6FD 0%, #38BDF8 60%, #0284C7 100%)'
                  : 'radial-gradient(circle at 40% 40%, #E2E8F0 0%, #94A3B8 100%)',
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white/95 shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* PEDESTAL BASE & STAND */}
      {showBase && (
        <div className="flex flex-col items-center -mt-2 z-0 pointer-events-none transition-all duration-500">
          {/* Fan neck connector */}
          <div
            className="w-7 h-8"
            style={{
              background: 'linear-gradient(180deg, #64748B 0%, #475569 100%)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
          {/* Circular stepped pedestal upper tier */}
          <div
            className="w-36 h-5 rounded-full"
            style={{
              background: 'var(--fan-base-tier1)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.25), inset 0 2px 4px rgba(255,255,255,0.2)',
              border: '1.5px solid var(--fan-base-border)',
            }}
          />
          {/* Circular stepped pedestal base tier */}
          <div
            className="w-44 h-4 rounded-full -mt-2"
            style={{
              background: 'var(--fan-base-tier2)',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--fan-base-border)',
            }}
          />
        </div>
      )}
    </div>
  );
};
