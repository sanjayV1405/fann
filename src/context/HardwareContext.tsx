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

const HardwareContext = createContext<HardwareContextType | null>(null);

export const HardwareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<string>('overview');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isApplyingSpeed, setIsApplyingSpeed] = useState<boolean>(false);

  // Settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('airloop_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

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
