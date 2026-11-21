import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useHardware } from '../../context/HardwareContext';
import { Check, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, dismissToast } = useHardware();

  return (
    <div className="relative min-h-screen w-full bg-[#F5F8FC] text-[#172033] flex overflow-hidden">
      {/* Dynamic Background Atmosphere (Soft Blue-Lavender Gradients, Airwave Swoosh & Daylight) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft daylight radial glow from upper left */}
        <div
          className="absolute -top-32 -left-20 w-[650px] h-[650px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(220, 235, 255, 0.45) 50%, transparent 75%)',
            filter: 'blur(45px)',
          }}
        />

        {/* Soft Lavender / Blue Airflow Curve across center (as seen in all 3 reference images) */}
        <div
          className="absolute top-1/3 left-1/4 w-[900px] h-[450px] -rotate-12 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(165, 180, 252, 0.22) 0%, rgba(192, 132, 252, 0.12) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Ambient Warm Pearl / Daylight corner glow */}
        <div
          className="absolute -bottom-20 right-0 w-[550px] h-[550px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(224, 242, 254, 0.4) 0%, rgba(243, 232, 255, 0.3) 50%, transparent 75%)',
            filter: 'blur(55px)',
          }}
        />

        {/* Atmospheric Floating Foliage Accent (bottom-left green leaf motif matching reference images) */}
        <div className="absolute -bottom-6 -left-6 w-36 h-36 opacity-35 pointer-events-none">
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

      {/* Floating System Notification Toast (Bottom Right as seen in Reference Image 1) */}
      <div className="fixed bottom-6 right-8 z-50 flex flex-col gap-2.5 pointer-events-none select-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border border-white/95"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 16px 36px -8px rgba(70, 100, 170, 0.16)',
              }}
            >
              {/* Green checkmark circle (exact match to Image 1) */}
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
                  <p className="text-xs font-bold text-[#172033] leading-tight">{toast.title}</p>
                )}
                <p className="text-xs text-slate-500 leading-tight">{toast.message}</p>
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-1 -mr-1 rounded-lg transition-colors cursor-pointer"
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
