import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  label: string;
  value?: string | number;
  unit?: string;
  badge?: {
    text: string;
    type?: 'positive' | 'neutral' | 'purple' | 'green';
  };
  statusText?: string;
  statusDotColor?: string;
  waveType?: 'blue' | 'purple' | 'green' | 'bars';
  fanSpeed?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  iconBgColor = 'bg-sky-50 dark:bg-sky-950/40 text-sky-500',
  iconColor = 'text-sky-500',
  label,
  value,
  unit,
  badge,
  statusText,
  statusDotColor = '#10B981',
  waveType = 'blue',
  fanSpeed = 75,
}) => {
  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg select-none glass-card flex flex-col justify-between"
      style={{
        background: 'var(--glass-card-bg, rgba(255, 255, 255, 0.72))',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1.5px solid var(--glass-card-border, rgba(255, 255, 255, 0.9))',
        boxShadow:
          '0 16px 36px -10px rgba(70, 100, 170, 0.08), 0 2px 6px rgba(255, 255, 255, 0.8) inset',
      }}
    >
      <div>
        {/* Top row: Circular Icon Container + Label */}
        <div className="flex items-center gap-3 mb-2.5">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/90 dark:border-white/10 shadow-sm ${iconBgColor}`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <span className="text-xs font-semibold text-[var(--text-muted,text-slate-500)] tracking-wide">
            {label}
          </span>
        </div>

        {/* Middle row: Large Value & Badges OR Status Text with Glowing Dot */}
        <div className="flex items-baseline justify-between mb-2">
          {statusText ? (
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: statusDotColor,
                  boxShadow: `0 0 8px ${statusDotColor}`,
                }}
              />
              <span className="text-[24px] font-extrabold text-[var(--text-main,#172033)] tracking-tight">
                {statusText}
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-[28px] font-extrabold text-[var(--text-main,#172033)] tracking-tight">
                {value}
              </span>
              {unit && (
                <span className="text-sm font-semibold text-[var(--text-muted,text-slate-500)]">
                  {unit}
                </span>
              )}
            </div>
          )}

          {badge && (
            <div
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                badge.type === 'purple'
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/50'
                  : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/50'
              }`}
            >
              <span>{badge.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Visualization: Exact Waves & Ascending Bars matching the design */}
      <div className="h-10 w-full flex items-end overflow-hidden pt-1">
        {waveType === 'bars' ? (
          // 10 Ascending Equalizer Bars for Fan Status
          <div className="w-full flex items-end justify-end gap-1.5 h-9 px-1">
            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((threshold, idx) => {
              const isActive = fanSpeed >= threshold;
              const barHeights = [4, 7, 10, 13, 16, 20, 24, 28, 32, 36];
              const barHeight = barHeights[idx];
              return (
                <div
                  key={idx}
                  className="w-2 rounded-t-sm transition-all duration-300"
                  style={{
                    height: `${barHeight}px`,
                    background: isActive
                      ? 'linear-gradient(180deg, #60A5FA 0%, #3B82F6 100%)'
                      : 'rgba(219, 234, 254, 0.45)',
                    boxShadow: isActive ? '0 2px 6px rgba(59, 130, 246, 0.35)' : 'none',
                  }}
                />
              );
            })}
          </div>
        ) : waveType === 'blue' ? (
          // Smooth Blue Sine Wave with Translucent Cyan-Blue Gradient Fill
          <svg className="w-full h-8 overflow-visible" viewBox="0 0 200 32" preserveAspectRatio="none">
            <defs>
              <linearGradient id="blueWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0,22 C 20,28 35,10 65,12 C 95,14 110,26 135,14 C 160,2 180,24 200,12 L 200,32 L 0,32 Z"
              fill="url(#blueWaveFill)"
            />
            <path
              d="M 0,22 C 20,28 35,10 65,12 C 95,14 110,26 135,14 C 160,2 180,24 200,12"
              stroke="#0EA5E9"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        ) : waveType === 'purple' ? (
          // Smooth Purple Sine Wave with Translucent Lavender Gradient Fill
          <svg className="w-full h-8 overflow-visible" viewBox="0 0 200 32" preserveAspectRatio="none">
            <defs>
              <linearGradient id="purpleWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0,20 C 25,12 45,26 75,16 C 105,6 125,24 155,14 C 175,6 185,22 200,12 L 200,32 L 0,32 Z"
              fill="url(#purpleWaveFill)"
            />
            <path
              d="M 0,20 C 25,12 45,26 75,16 C 105,6 125,24 155,14 C 175,6 185,22 200,12"
              stroke="#A855F7"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        ) : (
          // Smooth Green Hill Wave with Translucent Emerald Gradient Fill
          <svg className="w-full h-8 overflow-visible" viewBox="0 0 200 32" preserveAspectRatio="none">
            <defs>
              <linearGradient id="greenWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#4ADE80" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0,26 C 30,26 50,22 80,24 C 110,26 130,6 160,6 C 180,6 190,16 200,18 L 200,32 L 0,32 Z"
              fill="url(#greenWaveFill)"
            />
            <path
              d="M 0,26 C 30,26 50,22 80,24 C 110,26 130,6 160,6 C 180,6 190,16 200,18"
              stroke="#22C55E"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}
      </div>
    </div>
  );
};
