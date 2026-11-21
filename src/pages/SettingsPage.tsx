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
  Sparkles,
} from 'lucide-react';
import { useHardware } from '../context/HardwareContext';

const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (val: boolean) => void;
  title?: string;
  size?: 'md' | 'lg';
  color?: string;
}> = ({ checked, onChange, title, size = 'md', color = 'bg-emerald-500' }) => {
  const isLg = size === 'lg';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-300 ease-in-out focus:outline-none ${
        isLg ? 'h-7 w-12' : 'h-6 w-11'
      } ${checked ? color : 'bg-slate-300 dark:bg-slate-700'}`}
      title={title}
    >
      <span
        className={`pointer-events-none inline-block transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
          isLg ? 'h-6 w-6' : 'h-5 w-5'
        } ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
};

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    demoMode,
    setDemoMode,
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
          {/* Hardware Demo Mode Card */}
          <div
            className={`rounded-[32px] p-6 select-none glass-card transition-all duration-300 relative overflow-hidden ${
              demoMode
                ? 'ring-2 ring-emerald-500/40 border-emerald-500/30'
                : ''
            }`}
            style={{
              background: 'var(--glass-card-bg)',
              borderColor: 'var(--glass-card-border)',
              boxShadow: 'var(--glass-card-shadow)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                    demoMode
                      ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 shadow-sm shadow-emerald-500/20'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/40'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[var(--text-main)]">Hardware Demo Mode</h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider transition-colors ${
                        demoMode
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-200/70 dark:bg-slate-800 text-[var(--text-muted)] border border-slate-300/40 dark:border-slate-700'
                      }`}
                    >
                      {demoMode ? 'Simulated Connected' : 'Physical Hardware Only'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-subtle)] mt-1 max-w-md leading-relaxed">
                    {demoMode
                      ? 'Simulating an active ESP32 connection with real-time sensor telemetry, speed controls, and 3D fan dynamics.'
                      : 'Real hardware mode: strictly verifies physical ESP32. Shows Offline if unreachable on local network.'}
                  </p>
                </div>
              </div>

              {/* Smooth Pill Switch Button */}
              <ToggleSwitch
                checked={demoMode}
                onChange={setDemoMode}
                size="lg"
                title={demoMode ? 'Disable Demo Mode' : 'Enable Demo Mode'}
              />
            </div>

            {/* Quick status bar */}
            <div
              className={`mt-4 p-3.5 rounded-2xl flex items-center justify-between text-xs transition-colors duration-300 ${
                demoMode
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 text-[var(--text-muted)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    demoMode ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span className="font-medium text-[11px]">
                  {demoMode
                    ? 'ESP32 simulated connection active. All pages and widgets respond in real-time.'
                    : 'Demo mode is off. Switch on to test without physical ESP32 hardware.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDemoMode(!demoMode)}
                className="text-[11px] font-bold underline cursor-pointer hover:opacity-80 transition-opacity ml-2 shrink-0"
              >
                {demoMode ? 'Turn Off' : 'Turn On Demo'}
              </button>
            </div>
          </div>

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
                  <p className="text-xs font-bold text-[var(--text-main)]">Hardware Demo Mode</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Simulates ESP32 connection & live sensor dynamics when running without hardware
                  </p>
                </div>
                <ToggleSwitch
                  checked={demoMode}
                  onChange={setDemoMode}
                  title="Toggle Hardware Demo Mode"
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
                <ToggleSwitch
                  checked={settings.autoEcoMode}
                  onChange={(val) => updateSettings({ autoEcoMode: val })}
                  title="Toggle Eco Thermal Mode"
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
                  <ToggleSwitch
                    checked={settings.reducedMotion}
                    onChange={(val) => updateSettings({ reducedMotion: val })}
                    title="Toggle Reduced Motion"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-main)]">High Blur Glass Surfaces</span>
                  <ToggleSwitch
                    checked={settings.highGlassBlur}
                    onChange={(val) => updateSettings({ highGlassBlur: val })}
                    title="Toggle High Blur"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-main)]">Audio Feedback on Toggle</span>
                  <ToggleSwitch
                    checked={settings.soundEnabled}
                    onChange={(val) => updateSettings({ soundEnabled: val })}
                    title="Toggle Audio Feedback"
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
