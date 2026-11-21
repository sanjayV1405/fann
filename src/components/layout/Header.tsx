import React, { useState } from 'react';
import { Wifi, WifiOff, Bell, Check } from 'lucide-react';
import { useHardware } from '../../context/HardwareContext';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Header: React.FC = () => {
  const {
    connectionStatus,
    toggleConnection,
    events,
  } = useHardware();

  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const isConnected = connectionStatus === 'connected';

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasUnread(false);
    setShowNotifications(false);
  };

  return (
    <header className="relative flex items-center justify-end h-16 px-6 z-20 select-none">
      {/* Right Controls: Status Pill + Theme Toggle + Notification Bell */}
      <div className="flex items-center gap-3">
        {/* Connected Status Pill */}
        <button
          onClick={toggleConnection}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow-sm)',
            color: 'var(--text-main)',
          }}
          title={
            connectionStatus === 'connecting'
              ? 'Checking ESP32 endpoint...'
              : isConnected
              ? 'ESP32 Connected. Click to disconnect'
              : 'ESP32 Offline. Click to reconnect'
          }
        >
          <span
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connecting'
                ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B] animate-pulse'
                : isConnected
                ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]'
                : 'bg-rose-500 shadow-[0_0_8px_#EF4444]'
            }`}
          />
          <span>
            {connectionStatus === 'connecting'
              ? 'Connecting...'
              : isConnected
              ? 'Connected'
              : 'Offline'}
          </span>
          {isConnected ? (
            <Wifi className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-rose-500 ml-0.5" />
          )}
        </button>

        {/* Theme Switcher Toggle */}
        <ThemeToggle />

        {/* Notification Bell Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-[1.04]"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow-sm)',
            }}
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 text-[var(--text-muted)]" />
            {hasUnread && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                1
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div
              className="absolute right-0 mt-3 w-80 rounded-2xl p-4 shadow-xl border z-50 animate-in fade-in zoom-in-95 duration-200"
              style={{
                background: 'var(--dropdown-bg)',
                backdropFilter: 'blur(28px)',
                borderColor: 'var(--dropdown-border)',
                boxShadow: 'var(--glass-shadow)',
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-divider)] mb-2">
                <span className="text-xs font-bold text-[var(--text-main)]">Notifications & Alerts</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[10px] text-blue-500 font-semibold cursor-pointer hover:underline"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {events.slice(0, 4).map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5 text-left transition-colors"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        ev.severity === 'success'
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                          : ev.severity === 'warning'
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400'
                          : 'bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-main)]">{ev.title}</p>
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{ev.description}</p>
                      <span className="text-[9px] text-[var(--text-subtle)]">{ev.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
