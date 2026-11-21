import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Wifi,
  Thermometer,
  Sparkles,
  Sliders,
  Cpu,
  Save,
  CheckCircle2,
  RefreshCw,
  Power,
  Volume2,
  Eye,
  Smartphone,
} from 'lucide-react';
import { useHardware } from '../context/HardwareContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, connectionStatus, connectDevice, disconnectDevice, showToast } =
    useHardware();

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-sm text-xs font-semibold text-slate-600">
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          <span>System Configuration</span>
        </div>
        <h1 className="text-3xl xl:text-4xl font-extrabold text-[#172033] tracking-tight">
          Platform & Device <span className="text-gradient-airloop">Settings</span>
        </h1>
        <p className="text-sm text-slate-500">
          Configure ESP32 network endpoints, sensor calibration, temperature units, and UI preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: ESP32 Connection & IP Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* IP Configuration Card */}
          <div
            className="rounded-[32px] p-6 select-none"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 45px -12px rgba(70, 100, 170, 0.12)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200/50">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172033]">ESP32 Network Endpoint</h3>
                <p className="text-xs text-slate-400">Direct HTTP REST and WebSocket configuration</p>
              </div>
            </div>

            <form onSubmit={handleSaveConnection} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                    IP Address or Hostname
                  </label>
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    placeholder="192.168.1.184 or airloop.local"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/80 border border-slate-200/80 text-sm font-mono text-[#172033] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Port</label>
                  <input
                    type="text"
                    value={portInput}
                    onChange={(e) => setPortInput(e.target.value)}
                    placeholder="80"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/80 border border-slate-200/80 text-sm font-mono text-[#172033] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              {/* Simulation Mode Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-[#172033]">Hardware Simulation Mode</p>
                  <p className="text-[11px] text-slate-500">
                    Emulates physical ESP32 responses and live sensor dynamics when running standalone
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.simulationMode}
                  onChange={(e) => updateSettings({ simulationMode: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={isConnected ? disconnectDevice : () => connectDevice(ipInput, parseInt(portInput, 10))}
                  className="px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 text-xs font-bold border border-white shadow-sm flex items-center gap-2 cursor-pointer"
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
            className="rounded-[32px] p-6 select-none"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 45px -12px rgba(70, 100, 170, 0.12)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-200/50">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Automation & Climate Rules</h3>
                <p className="text-xs text-slate-400">Automatic fan speed curves and temperature targets</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#172033] block">Target Comfort Temperature</span>
                  <span className="text-slate-400">Fan auto-regulates to maintain this baseline</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#172033] text-sm">{settings.autoTargetTemp}°C</span>
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

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="font-bold text-[#172033] block">Eco Thermal Mode</span>
                  <span className="text-slate-400">Reduces fan wattage when space reaches target</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoEcoMode}
                  onChange={(e) => updateSettings({ autoEcoMode: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Device Information */}
        <div className="lg:col-span-5 space-y-6">
          {/* Temperature Unit & Interface Preferences */}
          <div
            className="rounded-[32px] p-6 select-none"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 45px -12px rgba(70, 100, 170, 0.12)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-200/50">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Interface Preferences</h3>
                <p className="text-xs text-slate-400">Units, motion and accessibility</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Temperature Unit Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">
                  Temperature Unit Display
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100/70 border border-white/80">
                  <button
                    type="button"
                    onClick={() => updateSettings({ tempUnit: 'C' })}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      settings.tempUnit === 'C'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-600 hover:text-slate-900'
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
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Reduced Motion (Accessibility)</span>
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">High Blur Glass Surfaces</span>
                  <input
                    type="checkbox"
                    checked={settings.highGlassBlur}
                    onChange={(e) => updateSettings({ highGlassBlur: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Audio Feedback on Apply</span>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Physical Hardware Specifications */}
          <div
            className="rounded-[32px] p-6 select-none"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 45px -12px rgba(70, 100, 170, 0.12)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200/50">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Hardware Specifications</h3>
                <p className="text-xs text-slate-400">Microcontroller & firmware registry</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Controller</span>
                <span className="font-mono font-bold text-[#172033]">ESP32-WROOM-32D</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Firmware</span>
                <span className="font-mono font-bold text-blue-600">v2.4.1-airloop-prod</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">MAC Address</span>
                <span className="font-mono font-bold text-[#172033]">24:6F:28:B4:9C:12</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">PWM Output</span>
                <span className="font-mono font-bold text-[#172033]">GPIO 23 (25kHz Silent)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Tachometer Pulse</span>
                <span className="font-mono font-bold text-[#172033]">GPIO 18 (PCNT)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
