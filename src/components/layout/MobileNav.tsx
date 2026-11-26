import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Fan,
  Compass,
  Activity,
  MoreHorizontal,
  Layers,
  Clock,
  Settings,
  X,
  Wifi,
  WifiOff,
  ChevronRight,
} from 'lucide-react';
import { useHardware } from '../../context/HardwareContext';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage, connectionStatus, toggleConnection } = useHardware();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isConnected = connectionStatus === 'connected';

  const PRIMARY_NAV = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'fan', label: 'Fan', icon: Fan },
    { id: 'environment', label: 'Climate', icon: Compass },
    { id: 'sensors', label: 'Sensors', icon: Activity },
  ];

  const MORE_ITEMS = [
    { id: 'fans', label: 'Fan Units', icon: Layers, desc: 'Manage multi-fan mesh' },
    { id: 'history', label: 'History', icon: Clock, desc: 'Telemetry archive & logs' },
    { id: 'settings', label: 'Settings', icon: Settings, desc: 'Endpoints & preferences' },
  ];

  const isMoreActive = MORE_ITEMS.some((item) => item.id === activePage);

  const handleSelectPage = (id: string) => {
    setActivePage(id);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Floating Bottom Navigation Bar (Mobile & Tablet only: lg:hidden) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-3 left-3 right-3 z-40 select-none pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div
          className="mx-auto max-w-sm sm:max-w-md w-full px-1.5 py-1 rounded-full flex items-center justify-between shadow-2xl border"
          style={{
            background: 'var(--dropdown-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderColor: 'var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
          }}
        >
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSelectPage(item.id)}
                className={`relative flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] font-medium'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileNavActivePill"
                    className="absolute inset-0 rounded-2xl border border-blue-400/30"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(66, 165, 255, 0.18) 0%, rgba(183, 164, 255, 0.2) 100%)',
                    }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                <span className="text-[10px] sm:text-[10.5px] leading-tight mt-0.5 relative z-10">{item.label}</span>
              </motion.button>
            );
          })}

          {/* More Button */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsMoreOpen(true)}
            className={`relative flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
              isMoreActive || isMoreOpen
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] font-medium'
            }`}
          >
            {isMoreActive && !isMoreOpen && (
              <motion.div
                layoutId="mobileNavActivePill"
                className="absolute inset-0 rounded-2xl border border-blue-400/30"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(66, 165, 255, 0.18) 0%, rgba(183, 164, 255, 0.2) 100%)',
                }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
            <span className="text-[10px] sm:text-[10.5px] leading-tight mt-0.5 relative z-10">More</span>
          </motion.button>
        </div>
      </nav>

      {/* "More" Bottom Sheet Drawer */}
      <AnimatePresence>
        {isMoreOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMoreOpen(false)}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative rounded-t-[32px] p-5 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] border-t border-x z-10 shadow-2xl overflow-hidden"
              style={{
                background: 'var(--dropdown-bg)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderColor: 'var(--dropdown-border)',
              }}
            >
              {/* Drag Handle Bar */}
              <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-4" />

              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-divider)] mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-[var(--text-main)]">More Navigation</span>
                </div>
                <button
                  onClick={() => setIsMoreOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Items in Drawer */}
              <div className="space-y-2 mb-4">
                {MORE_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectPage(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 text-left cursor-pointer ${
                        isActive
                          ? 'bg-blue-500/15 border border-blue-400/40 text-blue-600 dark:text-blue-400 font-bold'
                          : 'bg-black/5 dark:bg-white/5 border border-transparent text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${
                            isActive
                              ? 'bg-blue-500 text-white border-blue-400'
                              : 'bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="text-xs text-[var(--text-muted)] font-normal">{item.desc}</p>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-[var(--text-subtle)]" />
                    </button>
                  );
                })}
              </div>

              {/* Quick Connection Bar in Sheet */}
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-divider)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isConnected
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/20 text-rose-500'
                    }`}
                  >
                    {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-main)]">
                      {isConnected ? 'Device Connected' : 'Device Offline'}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {isConnected ? 'Live telemetry synchronized' : 'Tap to reconnect'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleConnection}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold btn-primary-gradient text-white cursor-pointer"
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
