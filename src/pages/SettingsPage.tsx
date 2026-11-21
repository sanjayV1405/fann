import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Wifi,
  Thermometer,
  Sliders,
  Cpu,
  Save,
  Power,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { useHardware } from '../context/HardwareContext';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    connectionStatus,
    connectDevice,
    disconnectDevice,
    showToast,
    theme,
    themeMode,
    setThemeMode,
  } = useHardware();

  const [ipInput, setIpInput] = useState(settings.esp32Ip);
  const [portInput, setPortInput] = useState(settings.port.toString());
  const [isSaving, setIsSaving] = useState(false);

  const isConnected = connectionStatus === 'connected';

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const portNum = parseInt(portInput, 10) || 80;
    updateSettings({ esp32Ip: ipInput, port: portNum });

    const ok = await connectDevice(ipInput, portNum);
    setIsSaving(false);
    if (ok) {
      showToast('Settings saved & ESP32 connected.', 'success', 'Saved');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-5xl"
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold text-[var(--text-muted)]">
          <Settings className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
          <span>System Configuration</span>
        </div>
        <h1 className="text-3xl xl:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
          Platform & Device <span className="text-gradient-airloop">Settings</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Configure ESP32 network endpoints, theme appearance, temperature units, and UI preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: ESP32 Connection & IP Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* IP Configuration Card */}
          <div
            className="rounded-[32px] p-6 select-none glass-card"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-card-shadow)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">ESP32 Network Endpoint</h3>
                <p className="text-xs text-[var(--text-subtle)]">Direct HTTP REST and WebSocket configuration</p>
              </div>
            </div>

            <form onSubmit={handleSaveConnection} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-[var(--text-subtle)] block mb-1.5">
                    IP Address or Hostname
                  </label>
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    placeholder="192.168.1.184 or airloop.local"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-sm font-mono text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-subtle)] block mb-1.5">Port</label>
                  <input
                    type="text"
                    value={portInput}
                    onChange={(e) => setPortInput(e.target.value)}
                    placeholder="80"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-sm font-mono text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              {/* Simulation Mode Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div>
                  <p className="text-xs font-bold text-[var(--text-main)]">Hardware Simulation Mode</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Emulates physical ESP32 responses and live sensor dynamics when running standalone
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.simulationMode}
                  onChange={(e) => updateSettings({ simulationMode: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={isConnected ? disconnectDevice : () => connectDevice(ipInput, parseInt(portInput, 10))}
                  className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-[var(--text-main)] text-xs font-bold border border-white/80 dark:border-white/10 shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Power className={`w-3.5 h-3.5 ${isConnected ? 'text-rose-500' : 'text-emerald-500'}`} />
                  <span>{isConnected ? 'Disconnect Device' : 'Connect Device'}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary-gradient px-5 py-2.5 rounded-2xl text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Connecting...' : 'Save & Connect'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Climate & Automation Rules */}
          <div
            className="rounded-[32px] p-6 select-none glass-card"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-card-shadow)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">Automation & Climate Rules</h3>
                <p className="text-xs text-[var(--text-subtle)]">Automatic fan speed curves and temperature targets</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--text-main)] block">Target Comfort Temperature</span>
                  <span className="text-[var(--text-subtle)]">Fan auto-regulates to maintain this baseline</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-main)] text-sm">{settings.autoTargetTemp}°C</span>
                  <input
                    type="range"
                    min="18"
                    max="28"
                    step="0.5"
                    value={settings.autoTargetTemp}
                    onChange={(e) => updateSettings({ autoTargetTemp: parseFloat(e.target.value) })}
                    className="w-24 accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-divider)]">
                <div>
                  <span className="font-bold text-[var(--text-main)] block">Eco Thermal Mode</span>
                  <span className="text-[var(--text-subtle)]">Reduces fan wattage when space reaches target</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoEcoMode}
                  onChange={(e) => updateSettings({ autoEcoMode: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Device Information */}
        <div className="lg:col-span-5 space-y-6">
          {/* Appearance & Interface Preferences */}
          <div
            className="rounded-[32px] p-6 select-none glass-card"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-card-shadow)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/40">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">Interface Preferences</h3>
                <p className="text-xs text-[var(--text-subtle)]">Theme, units, motion and accessibility</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Color Theme Selector */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-subtle)] block mb-2">
                  Theme Appearance
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setThemeMode('light')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      themeMode === 'light'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setThemeMode('dark')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      themeMode === 'dark'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-sky-400" />
                    <span>Dark</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setThemeMode('system')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      themeMode === 'system'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Temperature Unit Selector */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-subtle)] block mb-2">
                  Temperature Unit Display
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => updateSettings({ tempUnit: 'C' })}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      settings.tempUnit === 'C'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Celsius (°C)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSettings({ tempUnit: 'F' })}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      settings.tempUnit === 'F'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-main)]">Reduced Motion (Accessibility)</span>
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-main)]">High Blur Glass Surfaces</span>
                  <input
                    type="checkbox"
                    checked={settings.highGlassBlur}
                    onChange={(e) => updateSettings({ highGlassBlur: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-main)]">Audio Feedback on Toggle</span>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Physical Hardware Specifications */}
          <div
            className="rounded-[32px] p-6 select-none glass-card"
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-card-shadow)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">Hardware Specifications</h3>
                <p className="text-xs text-[var(--text-subtle)]">Microcontroller & firmware registry</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--border-divider)]">
                <span className="text-[var(--text-subtle)]">Controller</span>
                <span className="font-mono font-bold text-[var(--text-main)]">ESP32-WROOM-32D</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-divider)]">
                <span className="text-[var(--text-subtle)]">Firmware</span>
                <span className="font-mono font-bold text-blue-500">v2.4.1-airloop-prod</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-divider)]">
                <span className="text-[var(--text-subtle)]">MAC Address</span>
                <span className="font-mono font-bold text-[var(--text-main)]">24:6F:28:B4:9C:12</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-divider)]">
                <span className="text-[var(--text-subtle)]">PWM Output</span>
                <span className="font-mono font-bold text-[var(--text-main)]">GPIO 23 (25kHz Silent)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-subtle)]">Tachometer Pulse</span>
                <span className="font-mono font-bold text-[var(--text-main)]">GPIO 18 (PCNT)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
