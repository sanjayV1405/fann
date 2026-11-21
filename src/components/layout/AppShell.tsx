import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useHardware } from '../../context/HardwareContext';
import { Check, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, dismissToast } = useHardware();

  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-app)] text-[var(--text-main)] flex overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Upper left radial daylight / cyber blue glow */}
        <div
          className="absolute -top-32 -left-20 w-[650px] h-[650px] rounded-full transition-all duration-700"
          style={{
            background: 'var(--glow-sun)',
            filter: 'blur(45px)',
          }}
        />

        {/* Center Airflow Curve */}
        <div
          className="absolute top-1/3 left-1/4 w-[900px] h-[450px] -rotate-12 rounded-full transition-all duration-700"
          style={{
            background: 'var(--glow-airwave)',
            filter: 'blur(60px)',
          }}
        />

        {/* Ambient bottom corner glow */}
        <div
          className="absolute -bottom-20 right-0 w-[550px] h-[550px] rounded-full transition-all duration-700"
          style={{
            background: 'var(--glow-ambient)',
            filter: 'blur(55px)',
          }}
        />

        {/* Atmospheric Floating Foliage Accent */}
        <div
          className="absolute -bottom-6 -left-6 w-36 h-36 pointer-events-none transition-opacity duration-500"
          style={{ opacity: 'var(--foliage-opacity)' }}
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full rotate-45">
            <path
              d="M10 90 C 20 50 60 20 90 10 C 90 50 60 80 10 90 Z"
              fill="url(#ambientFoliageGrad)"
            />
            <defs>
              <linearGradient id="ambientFoliageGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#86EFAC" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Main Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 overflow-hidden pr-5">
        <Header />

        <main className="flex-1 overflow-y-auto px-6 pb-8 pt-2">
          {children}
        </main>
      </div>

      {/* Floating System Notification Toast */}
      <div className="fixed bottom-6 right-8 z-50 flex flex-col gap-2.5 pointer-events-none select-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border"
              style={{
                background: 'var(--dropdown-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderColor: 'var(--dropdown-border)',
                boxShadow: 'var(--glass-shadow)',
              }}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  toast.type === 'error'
                    ? 'bg-rose-500 text-white shadow-[0_0_10px_#EF4444]'
                    : 'bg-emerald-500 text-white shadow-[0_0_10px_#10B981]'
                }`}
              >
                {toast.type === 'error' ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4 stroke-[3]" />
                )}
              </div>

              <div className="text-left pr-2">
                {toast.title && (
                  <p className="text-xs font-bold text-[var(--text-main)] leading-tight">{toast.title}</p>
                )}
                <p className="text-xs text-[var(--text-muted)] leading-tight">{toast.message}</p>
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className="text-[var(--text-subtle)] hover:text-[var(--text-main)] p-1 -mr-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
