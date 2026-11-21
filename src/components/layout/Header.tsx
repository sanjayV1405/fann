import React, { useState } from 'react';
import { Search, Wifi, WifiOff, Bell, ChevronDown, Check, X, Moon, Sun } from 'lucide-react';
import { useHardware } from '../../context/HardwareContext';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Header: React.FC = () => {
  const {
    connectionStatus,
    toggleConnection,
    searchQuery,
    setSearchQuery,
    setActivePage,
    events,
    climateData,
    theme,
    toggleTheme,
  } = useHardware();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isConnected = connectionStatus === 'connected';

  return (
    <header className="relative flex items-center justify-between h-16 px-6 z-20 select-none">
      {/* Search Input Bar */}
      <div className="relative w-80 max-w-full">
        <div
          className="flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-400/40 glass-inset"
          style={{
            background: 'var(--input-bg)',
            border: '1.5px solid var(--input-border)',
            boxShadow: 'var(--glass-shadow-sm)',
          }}
        >
          <Search className="w-4 h-4 text-[var(--text-subtle)] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything..."
            className="w-full bg-transparent text-sm text-[var(--text-main)] placeholder-[var(--text-subtle)] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[var(--text-subtle)] hover:text-[var(--text-main)] p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Status Pill + Theme Toggle + Notification Bell + Profile Avatar */}
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
          title={isConnected ? 'Click to disconnect ESP32' : 'Click to connect ESP32'}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected
                ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]'
                : 'bg-rose-500 shadow-[0_0_8px_#EF4444]'
            }`}
          />
          <span>{isConnected ? 'Connected' : 'Offline'}</span>
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
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
              1
            </span>
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
                <span className="text-[10px] text-blue-500 font-semibold cursor-pointer hover:underline">
                  Clear all
                </span>
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

        {/* User Profile Sanjay */}
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1.5 p-1 pr-2 rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/80 dark:border-white/20 shadow-sm bg-gradient-to-tr from-blue-400 to-indigo-500">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Sanjay"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80';
                }}
              />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </div>

          {/* User Menu Popover */}
          {showProfileMenu && (
            <div
              className="absolute right-0 mt-3 w-64 rounded-2xl p-4 shadow-xl border z-50 animate-in fade-in zoom-in-95 duration-200"
              style={{
                background: 'var(--dropdown-bg)',
                backdropFilter: 'blur(28px)',
                borderColor: 'var(--dropdown-border)',
                boxShadow: 'var(--glass-shadow)',
              }}
            >
              <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-divider)]">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/80 dark:border-white/20 shadow">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="Sanjay"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-main)]">Sanjay</h4>
                  <p className="text-xs text-[var(--text-muted)]">Living Room Hub</p>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-xs">
                <button
                  onClick={() => {
                    toggleTheme();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 font-medium text-[var(--text-main)] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-sky-500" />}
                    <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
                  </span>
                  <span className="text-[10px] text-[var(--text-subtle)] font-mono">Alt+T</span>
                </button>
                <button
                  onClick={() => {
                    setActivePage('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 font-medium text-[var(--text-main)]"
                >
                  Device Settings ({climateData.esp32Ip})
                </button>
                <button
                  onClick={() => {
                    toggleConnection();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 font-medium text-[var(--text-main)]"
                >
                  {isConnected ? 'Disconnect Hardware' : 'Connect Hardware'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
