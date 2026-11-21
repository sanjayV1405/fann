import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  ClimateData,
  ClimateTrendPoint,
  ConnectionStatus,
  FanMode,
  SensorDetail,
  SystemEvent,
  UserSettings,
} from '../types';
import {
  IHardwareAdapter,
  RealESP32Adapter,
  SimulatedESP32Adapter,
  initialClimateData,
  initialSensors,
  initialEvents,
  initial24hTrends,
  initial1hTrends,
  initial7dTrends,
} from '../adapters/hardwareAdapter';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
}

interface HardwareContextType {
  // Navigation & Page State
  activePage: string;
  setActivePage: (page: string) => void;

  // Theme
  theme: 'light' | 'dark';
  themeMode: import('../types').ThemeMode;
  setThemeMode: (mode: import('../types').ThemeMode) => void;
  toggleTheme: () => void;

  // Connection
  connectionStatus: ConnectionStatus;
  isConnecting: boolean;
  connectDevice: (ip?: string, port?: number) => Promise<boolean>;
  disconnectDevice: () => Promise<void>;
  toggleConnection: () => Promise<void>;

  // Climate & Fan State
  climateData: ClimateData;
  pendingSpeed: number;
  setPendingSpeed: (speed: number) => void;
  pendingMode: FanMode;
  setPendingMode: (mode: FanMode) => void;
  isApplyingSpeed: boolean;
  applyFanSettings: () => Promise<boolean>;

  // Trends & History
  historyRange: '1h' | '24h' | '7d';
  setHistoryRange: (range: '1h' | '24h' | '7d') => void;
  historyData: ClimateTrendPoint[];

  // Sensors & Diagnostics
  sensors: SensorDetail[];
  refreshSensors: () => Promise<void>;

  // System Events
  events: SystemEvent[];
  addEvent: (event: Omit<SystemEvent, 'id' | 'timestamp'>) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;

  // UI Utilities
  formatTemp: (celsius: number) => { display: string; num: number; unit: string };
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toasts: ToastState[];
  dismissToast: (id: string) => void;
  showToast: (message: string, type?: ToastState['type'], title?: string) => void;
  exportData: (format: 'csv' | 'json') => void;
}

const defaultSettings: UserSettings = {
  theme: 'light',
  themeMode: 'light',
  tempUnit: 'C',
  esp32Ip: '192.168.1.184',
  port: 80,
  pollingIntervalMs: 3000,
  autoTargetTemp: 24.0,
  autoEcoMode: true,
  reducedMotion: false,
  soundEnabled: true,
  highGlassBlur: true,
  simulationMode: true,
};

const playSwitchSound = (isDark: boolean) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = 'sine';
    if (isDark) {
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
    } else {
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.08);
    }
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // audio context may require prior user interaction
  }
};

const HardwareContext = createContext<HardwareContextType | null>(null);

export const HardwareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<string>('overview');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isApplyingSpeed, setIsApplyingSpeed] = useState<boolean>(false);

  // Theme Mode ('light' | 'dark' | 'system')
  const [themeMode, setThemeModeState] = useState<import('../types').ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('airloop_theme_mode');
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
      return 'light';
    } catch {
      return 'light';
    }
  });

  // Effective Theme ('light' | 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('airloop_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Apply and resolve theme
  useEffect(() => {
    const resolve = (): 'light' | 'dark' => {
      if (themeMode === 'system') {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      return themeMode;
    };

    const active = resolve();
    setTheme(active);

    // Apply smooth transition class
    document.documentElement.classList.add('theme-transition');
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 450);

    // Apply class and data-theme
    if (active === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', active === 'dark' ? '#0A0E1A' : '#F5F8FC');
    }

    return () => clearTimeout(timer);
  }, [themeMode]);

  // Listen for system theme changes if themeMode is 'system'
  useEffect(() => {
    if (themeMode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const active = e.matches ? 'dark' : 'light';
      setTheme(active);
      document.documentElement.classList.toggle('dark', active === 'dark');
      document.documentElement.setAttribute('data-theme', active);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themeMode]);

  const setThemeMode = useCallback(
    (mode: import('../types').ThemeMode) => {
      setThemeModeState(mode);
      try {
        localStorage.setItem('airloop_theme_mode', mode);
      } catch {}
      if (settings.soundEnabled) {
        const nextIsDark =
          mode === 'dark' ||
          (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        playSwitchSound(nextIsDark);
      }
    },
    [settings.soundEnabled]
  );

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
  }, [theme, setThemeMode]);

  // Global keyboard shortcut Alt+T or Ctrl+Shift+T
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        (e.altKey && (e.key === 't' || e.key === 'T')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 't' || e.key === 'T'))
      ) {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleTheme]);

  // Sensor & Fan States
  const [climateData, setClimateData] = useState<ClimateData>(initialClimateData);
  const [pendingSpeed, setPendingSpeed] = useState<number>(initialClimateData.fanSpeed);
  const [pendingMode, setPendingMode] = useState<FanMode>(initialClimateData.fanMode);

  // History & Trends
  const [historyRange, setHistoryRange] = useState<'1h' | '24h' | '7d'>('24h');
  const [historyData, setHistoryData] = useState<ClimateTrendPoint[]>(initial24hTrends);

  // Sensors & Events
  const [sensors, setSensors] = useState<SensorDetail[]>(initialSensors);
  const [events, setEvents] = useState<SystemEvent[]>(initialEvents);

  // Search & Toasts
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastState[]>([
    {
      id: 'welcome-toast',
      title: 'System Connected!',
      message: 'AIRLOOP is now ready to use.',
      type: 'success',
    },
  ]);

  // Hardware Adapter instance
  const adapter = useMemo<IHardwareAdapter>(() => {
    if (settings.simulationMode) {
      return new SimulatedESP32Adapter();
    }
    return new RealESP32Adapter(settings.esp32Ip, settings.port);
  }, [settings.simulationMode, settings.esp32Ip, settings.port]);

  const showToast = useCallback((message: string, type: ToastState['type'] = 'info', title?: string) => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addEvent = useCallback((event: Omit<SystemEvent, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEv: SystemEvent = {
      ...event,
      id: 'ev-' + Date.now(),
      timestamp: timeStr,
    };
    setEvents((prev) => [newEv, ...prev]);
  }, []);

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem('airloop_settings', JSON.stringify(next));
      } catch {
        // no-op
      }
      return next;
    });
  }, []);

  // Update history data when range changes
  useEffect(() => {
    if (historyRange === '1h') setHistoryData(initial1hTrends);
    else if (historyRange === '7d') setHistoryData(initial7dTrends);
    else setHistoryData(initial24hTrends);
  }, [historyRange]);

  // Polling loop
  useEffect(() => {
    if (connectionStatus !== 'connected') return;

    const interval = setInterval(async () => {
      try {
        const nextData = await adapter.getStatus();
        setClimateData((prev) => ({
          ...nextData,
          // keep target pending if user hasn't applied
          fanTargetSpeed: prev.fanTargetSpeed,
        }));
      } catch {
        // if adapter fails repeatedly
      }
    }, settings.pollingIntervalMs);

    return () => clearInterval(interval);
  }, [connectionStatus, adapter, settings.pollingIntervalMs]);

  // Connect
  const connectDevice = useCallback(
    async (ip?: string, port?: number): Promise<boolean> => {
      setIsConnecting(true);
      setConnectionStatus('connecting');
      const targetIp = ip || settings.esp32Ip;
      const targetPort = port || settings.port;

      try {
        const success = await adapter.connect(targetIp, targetPort);
        if (success) {
          setConnectionStatus('connected');
          const data = await adapter.getStatus();
          setClimateData(data);
          setPendingSpeed(data.fanSpeed);
          setPendingMode(data.fanMode);
          showToast('AIRLOOP is now ready to use.', 'success', 'System Connected!');
          addEvent({
            type: 'hardware',
            severity: 'success',
            title: 'ESP32 Connected',
            description: `Established communication channel with ${targetIp}:${targetPort}.`,
          });
          return true;
        } else {
          setConnectionStatus('error');
          showToast('Unable to connect to ESP32 at ' + targetIp, 'error', 'Connection Failed');
          addEvent({
            type: 'hardware',
            severity: 'error',
            title: 'Connection Failed',
            description: `Host ${targetIp}:${targetPort} unreachable. Check network or IP.`,
          });
          return false;
        }
      } catch (err: unknown) {
        setConnectionStatus('error');
        const msg = err instanceof Error ? err.message : 'Connection failed';
        showToast(msg, 'error', 'ESP32 Error');
        return false;
      } finally {
        setIsConnecting(false);
      }
    },
    [adapter, settings.esp32Ip, settings.port, showToast, addEvent]
  );

  // Disconnect
  const disconnectDevice = useCallback(async () => {
    await adapter.disconnect();
    setConnectionStatus('disconnected');
    setClimateData((prev) => ({
      ...prev,
      fanStatus: 'stopped',
      fanSpeed: 0,
      sensorHealth: 'Disconnected',
    }));
    showToast('ESP32 device disconnected.', 'info', 'Offline Mode');
    addEvent({
      type: 'hardware',
      severity: 'warning',
      title: 'Device Disconnected',
      description: 'Physical telemetry channel closed by user.',
    });
  }, [adapter, showToast, addEvent]);

  const toggleConnection = useCallback(async () => {
    if (connectionStatus === 'connected') {
      await disconnectDevice();
    } else {
      await connectDevice();
    }
  }, [connectionStatus, disconnectDevice, connectDevice]);

  // Apply Fan Settings
  const applyFanSettings = useCallback(async (): Promise<boolean> => {
    if (connectionStatus !== 'connected') {
      showToast('Cannot send command while ESP32 is offline.', 'error', 'Device Offline');
      return false;
    }

    setIsApplyingSpeed(true);
    try {
      const ok = await adapter.setFan(pendingSpeed, pendingMode);
      if (ok) {
        setClimateData((prev) => ({
          ...prev,
          fanSpeed: pendingSpeed,
          fanTargetSpeed: pendingSpeed,
          fanMode: pendingMode,
          fanStatus: pendingSpeed > 0 ? 'running' : 'stopped',
        }));
        showToast(
          `Fan speed set to ${pendingSpeed}% (${pendingMode === 'manual' ? 'Manual' : 'Automatic'}).`,
          'success',
          'Speed Applied'
        );
        addEvent({
          type: 'fan',
          severity: 'info',
          title: 'Speed Confirmed',
          description: `PWM set to ${pendingSpeed}%, Mode: ${pendingMode.toUpperCase()}.`,
        });
        return true;
      } else {
        showToast('Fan command rejected by hardware.', 'error', 'Command Failed');
        return false;
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Fan command failed';
      showToast(msg, 'error', 'Execution Error');
      return false;
    } finally {
      setIsApplyingSpeed(false);
    }
  }, [connectionStatus, adapter, pendingSpeed, pendingMode, showToast, addEvent]);

  // Refresh Sensors
  const refreshSensors = useCallback(async () => {
    try {
      const list = await adapter.getSensors();
      setSensors(list);
      showToast('Sensor diagnostics refreshed.', 'info');
    } catch {
      showToast('Failed to poll sensor bus.', 'error');
    }
  }, [adapter, showToast]);

  // Format Temperature helper
  const formatTemp = useCallback(
    (celsius: number) => {
      if (connectionStatus === 'disconnected') {
        return { display: '--', num: 0, unit: settings.tempUnit === 'C' ? '°C' : '°F' };
      }
      if (settings.tempUnit === 'F') {
        const f = (celsius * 9) / 5 + 32;
        return { display: `${f.toFixed(1)}°F`, num: +f.toFixed(1), unit: '°F' };
      }
      return { display: `${celsius.toFixed(1)}°C`, num: celsius, unit: '°C' };
    },
    [connectionStatus, settings.tempUnit]
  );

  // Data Export (CSV and JSON)
  const exportData = useCallback(
    (format: 'csv' | 'json') => {
      const payload = {
        exportedAt: new Date().toISOString(),
        system: {
          ip: climateData.esp32Ip,
          status: connectionStatus,
          uptime: climateData.uptimeSeconds,
        },
        currentReadings: climateData,
        trendHistory: historyData,
        sensors: sensors,
        systemEvents: events,
      };

      let mime = 'application/json';
      let content = '';
      let filename = `airloop-climate-data-${Date.now()}.json`;

      if (format === 'json') {
        content = JSON.stringify(payload, null, 2);
      } else {
        mime = 'text/csv;charset=utf-8;';
        filename = `airloop-climate-data-${Date.now()}.csv`;
        const headers = ['Timestamp', 'TimeSlot', 'Temperature_C', 'Humidity_pct', 'AQI'];
        const rows = historyData.map((pt, idx) => [
          new Date(Date.now() - (historyData.length - idx) * 3600000).toISOString(),
          pt.time,
          pt.temperature,
          pt.humidity,
          pt.aqi,
        ]);
        content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      }

      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Exported ${format.toUpperCase()} dataset successfully.`, 'success', 'Data Export');
    },
    [climateData, connectionStatus, historyData, sensors, events, showToast]
  );

  return (
    <HardwareContext.Provider
      value={{
        activePage,
        setActivePage,
        theme,
        themeMode,
        setThemeMode,
        toggleTheme,
        connectionStatus,
        isConnecting,
        connectDevice,
        disconnectDevice,
        toggleConnection,
        climateData,
        pendingSpeed,
        setPendingSpeed,
        pendingMode,
        setPendingMode,
        isApplyingSpeed,
        applyFanSettings,
        historyRange,
        setHistoryRange,
        historyData,
        sensors,
        refreshSensors,
        events,
        addEvent,
        settings,
        updateSettings,
        formatTemp,
        searchQuery,
        setSearchQuery,
        toasts,
        dismissToast,
        showToast,
        exportData,
      }}
    >
      {children}
    </HardwareContext.Provider>
  );
};

export const useHardware = (): HardwareContextType => {
  const context = useContext(HardwareContext);
  if (!context) {
    throw new Error('useHardware must be used within a HardwareProvider');
  }
  return context;
};
