import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useHardware } from '../../context/HardwareContext';

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false, className = '' }) => {
  const { theme, toggleTheme, setThemeMode } = useHardware();
  const isDark = theme === 'dark';

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Interactive Toggle Capsule */}
      <button
        onClick={toggleTheme}
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        title={`Switch to ${isDark ? 'light' : 'dark'} theme (or press Alt+T)`}
        className="relative flex items-center p-1 rounded-full cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 select-none group"
        style={{
          background: isDark
            ? 'rgba(18, 25, 41, 0.85)'
            : 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isDark
            ? '1.5px solid rgba(255, 255, 255, 0.14)'
            : '1.5px solid rgba(255, 255, 255, 0.9)',
          boxShadow: isDark
            ? '0 4px 14px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
            : '0 4px 14px rgba(70, 100, 170, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* Animated Sliding Pill Thumb */}
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 480,
            damping: 32,
          }}
          className="absolute top-1 bottom-1 rounded-full"
          style={{
            width: '28px',
            left: isDark ? 'calc(100% - 32px)' : '4px',
            background: isDark
              ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
              : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            boxShadow: isDark
              ? '0 2px 10px rgba(56, 189, 248, 0.35), 0 0 0 1px rgba(56, 189, 248, 0.25)'
              : '0 2px 8px rgba(245, 158, 11, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.2)',
          }}
        />

        {/* Left Option: Light / Sun */}
        <div
          className={`relative z-10 w-7 h-7 flex items-center justify-center transition-colors duration-250 ${
            !isDark ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-300'
          }`}
        >
          <motion.div
            animate={{
              rotate: !isDark ? 0 : -35,
              scale: !isDark ? 1.05 : 0.85,
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Sun className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Right Option: Dark / Moon */}
        <div
          className={`relative z-10 w-7 h-7 flex items-center justify-center transition-colors duration-250 ${
            isDark ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-500'
          }`}
        >
          <motion.div
            animate={{
              rotate: isDark ? 0 : 35,
              scale: isDark ? 1.05 : 0.85,
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Moon className="w-3.5 h-3.5" />
          </motion.div>
        </div>
      </button>
    </div>
  );
};
