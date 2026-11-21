import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  label: string;
  value: string | number;
  unit?: string;
  badge?: {
    text: string;
    type?: 'positive' | 'neutral' | 'purple' | 'green';
  };
  statusDot?: {
    color: string;
    text: string;
  };
  waveType?: 'blue' | 'purple' | 'green' | 'bars';
  fanSpeed?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  iconBgColor = 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-500',
  iconColor = 'text-blue-500',
  label,
  value,
  unit,
  badge,
  statusDot,
  waveType = 'blue',
  fanSpeed = 75,
}) => {
  return (
    <div
      className="relative overflow-hidden rounded-[26px] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg select-none glass-card"
      style={{
        background: 'var(--glass-card-bg)',
        borderColor: 'var(--glass-card-border)',
        boxShadow: 'var(--glass-card-shadow)',
      }}
    >
      {/* Top row: Icon + Label */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center border border-white/90 dark:border-white/10 shadow-sm ${iconBgColor}`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className="text-xs font-semibold text-[var(--text-muted)] tracking-wide">{label}</span>
      </div>

      {/* Middle row: Large Value & Badges */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-[28px] font-extrabold text-[var(--text-main)] tracking-tight">{value}</span>
          {unit && <span className="text-sm font-semibold text-[var(--text-muted)]">{unit}</span>}
        </div>

        {badge && (
          <div
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
              badge.type === 'purple'
                ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40'
                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
            }`}
          >
            <span>{badge.text}</span>
          </div>
        )}

        {statusDot && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)]">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: statusDot.color,
                boxShadow: `0 0 6px ${statusDot.color}`,
              }}
            />
            <span>{statusDot.text}</span>
          </div>
        )}
      </div>

      {/* Bottom Visualization: Wave or Equalizer Bar Graph */}
      <div className="h-9 w-full flex items-end overflow-hidden pt-1">
        {waveType === 'bars' ? (
          // 8-bar equalizer graphic for Fan Status
          <div className="w-full flex items-end justify-between gap-1.5 h-6 px-1">
            {[15, 25, 38, 50, 62, 75, 88, 100].map((threshold, idx) => {
              const isActive = fanSpeed >= threshold;
              const barHeight = 6 + idx * 2.4;
              return (
                <div
                  key={idx}
                  className="w-full rounded-t-sm transition-all duration-300"
                  style={{
                    height: `${barHeight}px`,
                    background: isActive
                      ? 'linear-gradient(180deg, #60A5FA 0%, #3B82F6 100%)'
                      : 'var(--equalizer-inactive)',
                    boxShadow: isActive ? '0 1px 4px rgba(59, 130, 246, 0.35)' : 'none',
                  }}
                />
              );
            })}
          </div>
        ) : waveType === 'blue' ? (
          // Smooth blue sine wave (Temperature)
          <svg className="w-full h-7 overflow-visible" viewBox="0 0 200 30" fill="none">
            <path
              d="M0,18 C30,8 60,26 100,16 C140,6 170,24 200,15"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        ) : waveType === 'purple' ? (
          // Smooth purple sine wave (Humidity)
          <svg className="w-full h-7 overflow-visible" viewBox="0 0 200 30" fill="none">
            <path
              d="M0,20 C35,26 65,8 100,20 C135,28 165,10 200,18"
              stroke="#C084FC"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // Smooth green hill wave with gentle gradient fill (Air Quality / Health)
          <svg className="w-full h-7 overflow-visible" viewBox="0 0 200 30" fill="none">
            <defs>
              <linearGradient id="greenWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,24 C40,24 70,8 120,8 C160,8 180,22 200,20 L200,30 L0,30 Z"
              fill="url(#greenWaveFill)"
            />
            <path
              d="M0,24 C40,24 70,8 120,8 C160,8 180,22 200,20"
              stroke="#4ADE80"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
};
