import React, { useState } from 'react';
import { Search, Wifi, WifiOff, Bell, ChevronDown, Check, X, ShieldAlert, Cpu } from 'lucide-react';
import { useHardware } from '../../context/HardwareContext';

export const Header: React.FC = () => {
  const {
    connectionStatus,
    toggleConnection,
    searchQuery,
    setSearchQuery,
    setActivePage,
    events,
    climateData,
  } = useHardware();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isConnected = connectionStatus === 'connected';

  return (
    <header className="relative flex items-center justify-between h-16 px-6 z-20 select-none">
      {/* Search Input Bar (Matches exact frosted pill in Reference Images) */}
      <div className="relative w-80 max-w-full">
        <div
          className="flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-400/40"
          style={{
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 4px 14px rgba(70, 100, 170, 0.05)',
          }}
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything..."
            className="w-full bg-transparent text-sm text-[#172033] placeholder-slate-400 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Status Pill + Notification Bell + Profile Avatar */}
      <div className="flex items-center gap-3.5">
        {/* Connected Status Pill */}
        <button
          onClick={toggleConnection}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 14px rgba(70, 100, 170, 0.06)',
            color: '#172033',
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
            <Wifi className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-rose-500 ml-0.5" />
          )}
        </button>

        {/* Notification Bell Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/80"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 12px rgba(70, 100, 170, 0.05)',
            }}
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {/* Red Badge Counter "1" as seen in all 3 reference images */}
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
              1
            </span>
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div
              className="absolute right-0 mt-3 w-80 rounded-2xl p-4 shadow-xl border border-white/90 z-50 animate-in fade-in zoom-in-95 duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 20px 45px -10px rgba(70, 100, 170, 0.18)',
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-800">Notifications & Alerts</span>
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">
                  Clear all
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {events.slice(0, 4).map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5 text-left"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        ev.severity === 'success'
                          ? 'bg-emerald-100 text-emerald-600'
                          : ev.severity === 'warning'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{ev.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{ev.description}</p>
                      <span className="text-[9px] text-slate-400">{ev.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Sanjay (matches avatar & chevron in Reference Images) */}
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1.5 p-1 pr-2 rounded-full cursor-pointer hover:bg-white/60 transition-colors"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gradient-to-tr from-blue-400 to-indigo-500">
              {/* Photo matching handsome Sanjay from reference images */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Sanjay"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback avatar
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80';
                }}
              />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
          </div>

          {/* User Menu Popover */}
          {showProfileMenu && (
            <div
              className="absolute right-0 mt-3 w-64 rounded-2xl p-4 shadow-xl border border-white/90 z-50 animate-in fade-in zoom-in-95 duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 20px 45px -10px rgba(70, 100, 170, 0.18)',
              }}
            >
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="Sanjay"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Sanjay</h4>
                  <p className="text-xs text-slate-500">Living Room Hub</p>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-xs">
                <button
                  onClick={() => {
                    setActivePage('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 font-medium text-slate-700"
                >
                  Device Settings ({climateData.esp32Ip})
                </button>
                <button
                  onClick={() => {
                    toggleConnection();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 font-medium text-slate-700"
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
