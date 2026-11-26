import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import {
  ClimateData,
  ClimateTrendPoint,
  ConnectionStatus,
  FanDevice,
  FanMode,
  FanStatus,
  SensorDetail,
  SystemEvent,
  UserSettings,
  calculateAutoSpeed,
} from '../types';
import {
  IHardwareAdapter,
  RealDeviceAdapter,
  SimulatedDeviceAdapter,
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

  // Demo Mode
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => Promise<void>;
  toggleDemoMode: () => Promise<void>;

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
  setFanMode: (mode: FanMode) => Promise<boolean>;
  isApplyingSpeed: boolean;
  applyFanSettings: () => Promise<boolean>;
  fanRuntimeSeconds: number;

  // Multi-Fan Management
  fans: FanDevice[];
  activeFanId: string;
  activeFan: FanDevice;
  setActiveFanId: (id: string) => void;
  addFan: (fan: Omit<FanDevice, 'id'>) => FanDevice;
  updateFan: (id: string, partial: Partial<FanDevice>) => void;
  deleteFan: (id: string) => void;

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
  clearEvents: () => void;
  clearToasts: () => void;

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
  exportData: (format: 'csv' | 'pdf' | 'json') => void;
}

const defaultSettings: UserSettings = {
  theme: 'light',
  themeMode: 'light',
  tempUnit: 'C',
  deviceIp: '192.168.1.184',
  port: 80,
  pollingIntervalMs: 3000,
  autoTargetTemp: 24.0,
  autoEcoMode: true,
  reducedMotion: false,
  soundEnabled: true,
  highGlassBlur: true,
  simulationMode: false,
  demoMode: false,
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

const defaultFans: FanDevice[] = [
  {
    id: 'fan-1',
    name: 'Fan 1 (Master Loop)',
    room: 'Living Room',
    speed: 75,
    targetSpeed: 75,
    mode: 'manual',
    status: 'running',
    rpm: 1420,
    powerWatts: 24.5,
    temperature: 24.2,
    pinOrIp: 'GPIO 18',
    isDemo: true,
  },
  {
    id: 'fan-2',
    name: 'Fan 2 (Aero Pro)',
    room: 'Master Bedroom',
    speed: 45,
    targetSpeed: 45,
    mode: 'automatic',
    status: 'running',
    rpm: 890,
    powerWatts: 14.8,
    temperature: 23.5,
    pinOrIp: 'GPIO 19',
    isDemo: true,
  },
];

const HardwareContext = createContext<HardwareContextType | null>(null);

export const HardwareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<string>(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'fan', 'fans', 'environment', 'sensors', 'history', 'settings'].includes(hash)) {
        return hash;
      }
    } catch {}
    return 'overview';
  });

  const setActivePage = (page: string) => {
    setActivePageState(page);
    try {
      window.location.hash = page;
    } catch {}
  };
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
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

  // Demo Mode state
  const [demoMode, setDemoModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('airloop_demo_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('airloop_settings');
      const isDemo = localStorage.getItem('airloop_demo_mode') === 'true';
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed, simulationMode: isDemo, demoMode: isDemo };
      }
      return { ...defaultSettings, simulationMode: isDemo, demoMode: isDemo };
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

  // Fan Active Runtime (in seconds, tracks live run time)
  const [fanRuntimeSeconds, setFanRuntimeSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('airloop_fan_runtime');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) return val;
      }
    } catch {}
    return 185; // Initial demo runtime ~3m 05sec
  });

  // Increment fan runtime every second while fan is actively running
  useEffect(() => {
    const isRunning = connectionStatus === 'connected' && climateData.fanStatus === 'running';
    if (!isRunning) return;

    const timer = setInterval(() => {
      setFanRuntimeSeconds((prev) => {
        const next = prev + 1;
        if (next % 15 === 0) {
          try {
            localStorage.setItem('airloop_fan_runtime', String(next));
          } catch {}
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [connectionStatus, climateData.fanStatus]);

  // Multi-Fan State (Fan 1, Fan 2, ... Fan N)
  const [fans, setFans] = useState<FanDevice[]>(() => {
    try {
      const saved = localStorage.getItem('airloop_fans');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultFans;
  });

  const [activeFanId, setActiveFanIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('airloop_active_fan_id');
      if (saved) return saved;
    } catch {}
    return defaultFans[0].id;
  });

  const activeFan = useMemo<FanDevice>(() => {
    return fans.find((f) => f.id === activeFanId) || fans[0] || defaultFans[0];
  }, [fans, activeFanId]);

  const setActiveFanId = useCallback(
    (id: string) => {
      setActiveFanIdState(id);
      try {
        localStorage.setItem('airloop_active_fan_id', id);
      } catch {}
      const target = fans.find((f) => f.id === id);
      if (target) {
        setPendingSpeed(target.speed);
        setPendingMode(target.mode);
        setClimateData((prev) => ({
          ...prev,
          fanSpeed: target.speed,
          fanTargetSpeed: target.targetSpeed,
          fanMode: target.mode,
          fanStatus: target.status,
        }));
      }
    },
    [fans]
  );

  const addFan = useCallback(
    (fanData: Omit<FanDevice, 'id'>): FanDevice => {
      const nextNum = fans.length + 1;
      const newFan: FanDevice = {
        ...fanData,
        id: `fan-${Date.now()}-${nextNum}`,
        rpm: fanData.rpm || Math.round((fanData.speed / 100) * 1800),
        powerWatts: fanData.powerWatts || +(10 + (fanData.speed / 100) * 25).toFixed(1),
        temperature: fanData.temperature || 24.0,
        status: fanData.speed > 0 ? 'running' : 'stopped',
      };
      setFans((prev) => {
        const next = [...prev, newFan];
        try {
          localStorage.setItem('airloop_fans', JSON.stringify(next));
        } catch {}
        return next;
      });
      return newFan;
    },
    [fans]
  );

  const updateFan = useCallback((id: string, partial: Partial<FanDevice>) => {
    setFans((prev) => {
      const next = prev.map((f) => {
        if (f.id === id) {
          const updated = { ...f, ...partial };
          if (partial.speed !== undefined) {
            updated.rpm = Math.round((partial.speed / 100) * 1800);
            updated.powerWatts = +(10 + (partial.speed / 100) * 25).toFixed(1);
            updated.status = partial.speed > 0 ? 'running' : 'stopped';
          }
          return updated;
        }
        return f;
      });
      try {
        localStorage.setItem('airloop_fans', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const deleteFan = useCallback(
    (id: string) => {
      setFans((prev) => {
        if (prev.length <= 1) {
          return prev;
        }
        const next = prev.filter((f) => f.id !== id);
        try {
          localStorage.setItem('airloop_fans', JSON.stringify(next));
        } catch {}
        if (activeFanId === id) {
          setActiveFanIdState(next[0].id);
          try {
            localStorage.setItem('airloop_active_fan_id', next[0].id);
          } catch {}
        }
        return next;
      });
    },
    [activeFanId]
  );

  // History & Trends
  const [historyRange, setHistoryRange] = useState<'1h' | '24h' | '7d'>('24h');
  const [historyData, setHistoryData] = useState<ClimateTrendPoint[]>(initial24hTrends);

  // Sensors & Events
  const [sensors, setSensors] = useState<SensorDetail[]>(initialSensors);
  const [events, setEvents] = useState<SystemEvent[]>(initialEvents);

  // Search & Toasts
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Hardware Adapter instance
  const adapter = useMemo<IHardwareAdapter>(() => {
    if (demoMode || settings.simulationMode) {
      return new SimulatedDeviceAdapter();
    }
    return new RealDeviceAdapter(settings.deviceIp, settings.port);
  }, [demoMode, settings.simulationMode, settings.deviceIp, settings.port]);

  const showToast = useCallback((message: string, type: ToastState['type'] = 'info', title?: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
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

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
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

  // Set Demo Mode (simulates device connection & telemetry)
  const setDemoMode = useCallback(
    async (enabled: boolean) => {
      setDemoModeState(enabled);
      updateSettings({ demoMode: enabled, simulationMode: enabled });
      try {
        localStorage.setItem('airloop_demo_mode', enabled ? 'true' : 'false');
      } catch {}

      if (enabled) {
        const sim = new SimulatedDeviceAdapter();
        await sim.connect(settings.deviceIp, settings.port);
        setConnectionStatus('connected');
        const data = await sim.getStatus();
        setClimateData(data);
        setPendingSpeed(data.fanSpeed);
        setPendingMode(data.fanMode);
        const simSensors = await sim.getSensors();
        setSensors(simSensors);
        showToast(
          'Demo Mode Enabled: Simulating active device connection & live telemetry.',
          'success',
          'Demo Connected'
        );
        addEvent({
          type: 'hardware',
          severity: 'success',
          title: 'Demo Mode Enabled',
          description: 'Simulating connected device with active sensors.',
        });
      } else {
        const real = new RealDeviceAdapter(settings.deviceIp, settings.port);
        const isRealConnected = await real.connect(settings.deviceIp, settings.port);
        if (isRealConnected) {
          setConnectionStatus('connected');
          const data = await real.getStatus();
          setClimateData(data);
          setPendingSpeed(data.fanSpeed);
          setPendingMode(data.fanMode);
          showToast('Real device connected.', 'success', 'Device Online');
        } else {
          setConnectionStatus('disconnected');
          setClimateData(initialClimateData);
          setSensors(initialSensors);
          showToast(
            'Demo Mode Disabled: Device is offline (no physical device detected).',
            'info',
            'Real Hardware Mode'
          );
        }
        addEvent({
          type: 'hardware',
          severity: 'info',
          title: 'Demo Mode Disabled',
          description: 'Reverted to physical hardware connection check.',
        });
      }
    },
    [settings.deviceIp, settings.port, updateSettings, showToast, addEvent]
  );

  const toggleDemoMode = useCallback(async () => {
    await setDemoMode(!demoMode);
  }, [demoMode, setDemoMode]);

  // Update history data when range changes
  useEffect(() => {
    if (historyRange === '1h') setHistoryData(initial1hTrends);
    else if (historyRange === '7d') setHistoryData(initial7dTrends);
    else setHistoryData(initial24hTrends);
  }, [historyRange]);

  // Real connection probe on startup (or simulated if demoMode)
  useEffect(() => {
    let isMounted = true;
    const probe = async () => {
      try {
        if (demoMode || settings.simulationMode) {
          const ok = await adapter.connect(settings.deviceIp, settings.port);
          if (isMounted && ok) {
            setConnectionStatus('connected');
            const data = await adapter.getStatus();
            setClimateData(data);
            setPendingSpeed(data.fanSpeed);
            setPendingMode(data.fanMode);
            const simSensors = await adapter.getSensors();
            setSensors(simSensors);
          }
          return;
        }

        const ok = await adapter.connect(settings.deviceIp, settings.port);
        if (isMounted) {
          if (ok) {
            setConnectionStatus('connected');
            const data = await adapter.getStatus();
            setClimateData(data);
            setPendingSpeed(data.fanSpeed);
            setPendingMode(data.fanMode);
            showToast(`Connected to physical device at ${settings.deviceIp}:${settings.port}`, 'success', 'Device Online');
          } else {
            setConnectionStatus('disconnected');
            setClimateData(initialClimateData);
          }
        }
      } catch {
        if (isMounted) {
          setConnectionStatus('disconnected');
          setClimateData(initialClimateData);
        }
      }
    };
    probe();
    return () => {
      isMounted = false;
    };
  }, [adapter, demoMode, settings.simulationMode, settings.deviceIp, settings.port, showToast]);

  // Polling loop - strictly enforces real connectivity unless demoMode
  useEffect(() => {
    if (connectionStatus !== 'connected') return;

    const interval = setInterval(async () => {
      try {
        const nextData = await adapter.getStatus();
        if (nextData.fanMode === 'automatic') {
          setPendingSpeed(nextData.fanSpeed);
          setFans((prev) =>
            prev.map((f) =>
              f.id === activeFanId && f.mode === 'automatic'
                ? {
                    ...f,
                    speed: nextData.fanSpeed,
                    targetSpeed: nextData.fanSpeed,
                    rpm: Math.round((nextData.fanSpeed / 100) * 1800),
                    powerWatts: +(10 + (nextData.fanSpeed / 100) * 25).toFixed(1),
                  }
                : f
            )
          );
        }
        setClimateData((prev) => ({
          ...nextData,
          fanTargetSpeed: prev.fanTargetSpeed,
        }));
      } catch {
        if (!demoMode && !settings.simulationMode) {
          setConnectionStatus('disconnected');
          setClimateData(initialClimateData);
          showToast('Lost connection to device. Status is offline.', 'warning', 'Device Offline');
        }
      }
    }, settings.pollingIntervalMs);

    return () => clearInterval(interval);
  }, [connectionStatus, adapter, demoMode, settings.simulationMode, settings.pollingIntervalMs, showToast]);

  // Connect
  const connectDevice = useCallback(
    async (ip?: string, port?: number): Promise<boolean> => {
      setIsConnecting(true);
      setConnectionStatus('connecting');
      const targetIp = ip || settings.deviceIp;
      const targetPort = port || settings.port;

      try {
        const success = await adapter.connect(targetIp, targetPort);
        if (success) {
          setConnectionStatus('connected');
          const data = await adapter.getStatus();
          setClimateData(data);
          setPendingSpeed(data.fanSpeed);
          setPendingMode(data.fanMode);
          showToast(`Connected to device at ${targetIp}:${targetPort}`, 'success', 'Device Online');
          addEvent({
            type: 'hardware',
            severity: 'success',
            title: 'Device Connected',
            description: `Established communication channel with ${targetIp}:${targetPort}.`,
          });
          return true;
        } else {
          setConnectionStatus('disconnected');
          setClimateData(initialClimateData);
          showToast(`Device unreachable at ${targetIp}:${targetPort}`, 'error', 'Device Offline');
          addEvent({
            type: 'hardware',
            severity: 'error',
            title: 'Connection Failed',
            description: `Host ${targetIp}:${targetPort} unreachable. Device is offline.`,
          });
          return false;
        }
      } catch (err: unknown) {
        setConnectionStatus('disconnected');
        setClimateData(initialClimateData);
        const msg = err instanceof Error ? err.message : 'Connection failed';
        showToast(msg, 'error', 'Device Offline');
        return false;
      } finally {
        setIsConnecting(false);
      }
    },
    [adapter, settings.deviceIp, settings.port, showToast, addEvent]
  );

  // Disconnect
  const disconnectDevice = useCallback(async () => {
    await adapter.disconnect();
    setConnectionStatus('disconnected');
    setClimateData(initialClimateData);
    showToast('Device disconnected.', 'info', 'Offline Mode');
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
      showToast('Cannot send command while device is offline.', 'error', 'Device Offline');
      return false;
    }

    setIsApplyingSpeed(true);
    try {
      const targetSpeed =
        pendingMode === 'automatic' ? calculateAutoSpeed(climateData.temperature) : pendingSpeed;
      if (pendingMode === 'automatic') {
        setPendingSpeed(targetSpeed);
      }
      const ok = await adapter.setFan(targetSpeed, pendingMode);
      if (ok) {
        setClimateData((prev) => ({
          ...prev,
          fanSpeed: targetSpeed,
          fanTargetSpeed: targetSpeed,
          fanMode: pendingMode,
          fanStatus: targetSpeed > 0 ? 'running' : 'stopped',
        }));
        setFans((prev) => {
          const next = prev.map((f) =>
            f.id === activeFanId
              ? {
                  ...f,
                  speed: targetSpeed,
                  targetSpeed: targetSpeed,
                  mode: pendingMode,
                  status: targetSpeed > 0 ? ('running' as FanStatus) : ('stopped' as FanStatus),
                  rpm: Math.round((targetSpeed / 100) * 1800),
                  powerWatts: +(10 + (targetSpeed / 100) * 25).toFixed(1),
                }
              : f
          );
          try {
            localStorage.setItem('airloop_fans', JSON.stringify(next));
          } catch {}
          return next;
        });
        showToast(
          pendingMode === 'automatic'
            ? `Automatic mode enabled. Regulated to ${targetSpeed}% based on room temp (${climateData.temperature}°C).`
            : `Fan speed set to ${targetSpeed}% (Manual).`,
          'success',
          pendingMode === 'automatic' ? 'Auto Mode Active' : 'Speed Applied'
        );
        addEvent({
          type: 'fan',
          severity: 'info',
          title: pendingMode === 'automatic' ? 'Automatic Mode Active' : 'Speed Confirmed',
          description:
            pendingMode === 'automatic'
              ? `Sensors regulating fan speed: PWM ${targetSpeed}% at ${climateData.temperature}°C.`
              : `PWM set to ${targetSpeed}%, Mode: MANUAL.`,
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
  }, [connectionStatus, adapter, pendingSpeed, pendingMode, climateData.temperature, activeFanId, showToast, addEvent]);

  // Direct Fan Mode Switcher
  const setFanMode = useCallback(
    async (mode: FanMode): Promise<boolean> => {
      setPendingMode(mode);
      if (connectionStatus !== 'connected') {
        showToast(
          `Switched to ${mode === 'automatic' ? 'Automatic' : 'Manual'} mode (Offline).`,
          'info'
        );
        return true;
      }

      setIsApplyingSpeed(true);
      try {
        const targetSpeed =
          mode === 'automatic' ? calculateAutoSpeed(climateData.temperature) : pendingSpeed;
        if (mode === 'automatic') {
          setPendingSpeed(targetSpeed);
        }
        const ok = await adapter.setFan(targetSpeed, mode);
        if (ok) {
          setClimateData((prev) => ({
            ...prev,
            fanSpeed: targetSpeed,
            fanTargetSpeed: targetSpeed,
            fanMode: mode,
            fanStatus: targetSpeed > 0 ? 'running' : 'stopped',
          }));
          setFans((prev) => {
            const next = prev.map((f) =>
              f.id === activeFanId
                ? {
                    ...f,
                    speed: targetSpeed,
                    targetSpeed: targetSpeed,
                    mode: mode,
                    status: targetSpeed > 0 ? ('running' as FanStatus) : ('stopped' as FanStatus),
                    rpm: Math.round((targetSpeed / 100) * 1800),
                    powerWatts: +(10 + (targetSpeed / 100) * 25).toFixed(1),
                  }
                : f
            );
            try {
              localStorage.setItem('airloop_fans', JSON.stringify(next));
            } catch {}
            return next;
          });
          showToast(
            mode === 'automatic'
              ? `Automatic mode enabled. Regulated to ${targetSpeed}% based on room temp (${climateData.temperature}°C).`
              : `Switched to Manual mode. Manual slider and presets active.`,
            'success',
            mode === 'automatic' ? 'Automatic Mode Active' : 'Manual Mode Active'
          );
          addEvent({
            type: 'fan',
            severity: 'info',
            title: mode === 'automatic' ? 'Automatic Mode Activated' : 'Manual Mode Activated',
            description:
              mode === 'automatic'
                ? `Sensors regulating fan speed: PWM ${targetSpeed}% at ${climateData.temperature}°C.`
                : `User switched to manual fan speed control.`,
          });
          return true;
        } else {
          showToast('Failed to switch fan mode.', 'error', 'Command Failed');
          return false;
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Mode switch failed';
        showToast(msg, 'error', 'Mode Error');
        return false;
      } finally {
        setIsApplyingSpeed(false);
      }
    },
    [connectionStatus, adapter, pendingSpeed, climateData.temperature, activeFanId, showToast, addEvent]
  );

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

  // Data Export (CSV, PDF, JSON)
  const exportData = useCallback(
    (format: 'csv' | 'pdf' | 'json') => {
      if (format === 'pdf') {
        try {
          const doc = new jsPDF();
          const pageW = doc.internal.pageSize.getWidth();

          // Header Brand Banner
          doc.setFillColor(59, 130, 246);
          doc.rect(0, 0, pageW, 18, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.setTextColor(255, 255, 255);
          doc.text('AIRLOOP', 14, 12);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(224, 242, 254);
          doc.text('Smart Climate Control • Official IoT Telemetry Report', 55, 12);

          // Meta Info Bar
          doc.setTextColor(71, 85, 105);
          doc.setFontSize(9);
          doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);
          doc.text(`Device Endpoint: ${climateData.deviceIp}:${climateData.port}`, 14, 32);
          doc.text(
            `Connection Status: ${connectionStatus === 'connected' ? 'ONLINE (Synchronized)' : 'OFFLINE'}`,
            14,
            38
          );

          // Section 1: Real-time Telemetry Card
          doc.setFillColor(248, 250, 252);
          doc.roundedRect(14, 44, pageW - 28, 48, 3, 3, 'F');
          doc.setDrawColor(226, 232, 240);
          doc.roundedRect(14, 44, pageW - 28, 48, 3, 3, 'S');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(15, 23, 42);
          doc.text('1. Real-Time Micro-Climate Telemetry', 18, 52);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);

          const fahrenheit = ((climateData.temperature * 9) / 5 + 32).toFixed(1);
          doc.text(
            `• Ambient Temperature:  ${climateData.temperature}°C  /  ${fahrenheit}°F`,
            20,
            60
          );
          doc.text(`• Relative Humidity:    ${climateData.humidity}% RH`, 20, 67);
          doc.text(
            `• Indoor Air Quality:   ${climateData.airQualityStatus} (Index: ${climateData.aqi} AQI)`,
            20,
            74
          );
          doc.text(
            `• Fan Actuator:         ${climateData.fanStatus.toUpperCase()} at ${climateData.fanSpeed}% (${climateData.fanMode.toUpperCase()} mode)`,
            20,
            81
          );
          doc.text(
            `• System Uptime:        ${Math.floor(climateData.uptimeSeconds / 3600)}h ${Math.floor((climateData.uptimeSeconds % 3600) / 60)}m`,
            20,
            88
          );

          // Section 2: Historical Telemetry Table
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(15, 23, 42);
          doc.text('2. Historical Trend Log', 14, 102);

          // Table Header
          doc.setFillColor(241, 245, 249);
          doc.rect(14, 106, pageW - 28, 7.5, 'F');
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(71, 85, 105);
          doc.text('Time Slot', 18, 111.5);
          doc.text('Temperature (°C)', 65, 111.5);
          doc.text('Humidity (%)', 115, 111.5);
          doc.text('Air Quality (AQI)', 155, 111.5);

          // Table Rows
          doc.setFont('helvetica', 'normal');
          let y = 119;
          historyData.slice(0, 12).forEach((pt, idx) => {
            if (idx % 2 === 1) {
              doc.setFillColor(248, 250, 252);
              doc.rect(14, y - 4.5, pageW - 28, 6.5, 'F');
            }
            doc.setTextColor(51, 65, 85);
            doc.text(pt.time, 18, y);
            doc.text(`${pt.temperature.toFixed(1)}°C`, 65, y);
            doc.text(`${pt.humidity}%`, 115, y);
            doc.text(`${pt.aqi}`, 155, y);
            y += 6.5;
          });

          // Section 3: Hardware Sensor Registry
          y += 5;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(15, 23, 42);
          doc.text('3. Sensor Transducer Registry', 14, y);

          y += 6;
          sensors.slice(0, 5).forEach((s) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(30, 41, 59);
            doc.text(`[${s.status.toUpperCase()}] ${s.name} (${s.model})`, 18, y);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(
              `Reading: ${s.value} ${s.unit}  |  Interface: ${s.busInterface}  |  Accuracy: ${s.accuracy}`,
              18,
              y + 4.2
            );
            y += 9.5;
          });

          // Section 4: System Audit Events
          y += 4;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(15, 23, 42);
          doc.text('4. Recent System Events', 14, y);

          y += 6;
          events.slice(0, 4).forEach((ev) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(51, 65, 85);
            doc.text(`${ev.timestamp} [${ev.severity.toUpperCase()}] ${ev.title}: `, 18, y);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 116, 139);
            const titleWidth = doc.getTextWidth(`${ev.timestamp} [${ev.severity.toUpperCase()}] ${ev.title}: `);
            doc.text(ev.description.substring(0, 60), 18 + titleWidth, y);
            y += 5.5;
          });

          // Footer
          doc.setDrawColor(226, 232, 240);
          doc.line(14, 282, pageW - 14, 282);
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184);
          doc.text(
            'AIRLOOP IoT Telemetry Engine • Generated automatically from live hardware telemetry',
            14,
            287
          );
          doc.text('Confidential', pageW - 32, 287);

          doc.save(`airloop-climate-report-${Date.now()}.pdf`);
          showToast('Generated and downloaded PDF report.', 'success', 'PDF Export');
          return;
        } catch (err) {
          console.error('PDF generation error:', err);
          showToast('Failed to generate PDF document.', 'error', 'Export Error');
          return;
        }
      }

      // JSON or CSV fallback
      const payload = {
        exportedAt: new Date().toISOString(),
        system: {
          ip: climateData.deviceIp,
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
        demoMode,
        setDemoMode,
        toggleDemoMode,
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
        setFanMode,
        isApplyingSpeed,
        applyFanSettings,
        fanRuntimeSeconds,
        fans,
        activeFanId,
        activeFan,
        setActiveFanId,
        addFan,
        updateFan,
        deleteFan,
        historyRange,
        setHistoryRange,
        historyData,
        sensors,
        refreshSensors,
        events,
        addEvent,
        clearEvents,
        clearToasts,
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
