export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export type FanMode = 'manual' | 'automatic';

/**
 * Calculates fan speed based on room temperature in automatic mode:
 * < 22°C  -> Low (25%)
 * 22-26°C -> Medium (50%)
 * 26-30°C -> High (80%)
 * >= 30°C -> Max (100%)
 */
export const calculateAutoSpeed = (temp: number): number => {
  if (temp < 22) return 25;
  if (temp < 26) return 50;
  if (temp < 30) return 80;
  return 100;
};

/**
 * Formats fan active runtime:
 * - Under 1 hour: shows seconds, e.g. "45sec" or "59m 59sec" (increments each second)
 * - 1 hour or more: shows hours and minutes, e.g. "1hr 15m"
 */
export const formatFanRuntime = (totalSec: number): string => {
  const safeSec = Math.max(0, Math.floor(totalSec));
  if (safeSec >= 3600) {
    const hours = Math.floor(safeSec / 3600);
    const mins = Math.floor((safeSec % 3600) / 60);
    return `${hours}hr ${mins}m`;
  }
  const mins = Math.floor(safeSec / 60);
  const secs = safeSec % 60;
  if (mins > 0) {
    return `${mins}m ${secs}sec`;
  }
  return `${secs}sec`;
};

export type FanStatus = 'running' | 'idle' | 'stopped';

export type AirQualityLevel = 'Good' | 'Moderate' | 'Poor';

export type SensorHealthStatus = 'Healthy' | 'Warning' | 'Disconnected' | 'Unavailable';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ClimateData {
  temperature: number; // in Celsius
  humidity: number; // in percentage (0 - 100)
  aqi: number; // e.g. 32
  airQualityStatus: AirQualityLevel;
  tempDelta: number; // e.g. +0.2
  humidityDelta: number; // e.g. +1
  fanSpeed: number; // 0 to 100
  fanTargetSpeed: number;
  fanMode: FanMode;
  fanStatus: FanStatus;
  sensorHealth: SensorHealthStatus;
  lastUpdated: string;
  uptimeSeconds: number;
  wifiRssi: number; // e.g. -58 dBm
  deviceIp: string;
  port: number;
}

export interface FanDevice {
  id: string;
  name: string;
  room: string;
  speed: number;
  targetSpeed: number;
  mode: FanMode;
  status: FanStatus;
  rpm: number;
  powerWatts: number;
  temperature: number;
  pinOrIp?: string;
  isDemo?: boolean;
}

export interface ClimateTrendPoint {
  time: string;
  temperature: number;
  humidity: number;
  aqi: number;
}

export interface SensorDetail {
  id: string;
  name: string;
  model: string;
  type: string;
  value: number | string;
  unit: string;
  status: SensorHealthStatus;
  accuracy: string;
  busInterface: string;
  lastPing: string;
  description: string;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  type: 'fan' | 'climate' | 'sensor' | 'hardware' | 'user';
  severity: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  tempUnit: 'C' | 'F';
  deviceIp: string;
  port: number;
  pollingIntervalMs: number;
  autoTargetTemp: number;
  autoEcoMode: boolean;
  reducedMotion: boolean;
  soundEnabled: boolean;
  highGlassBlur: boolean;
  simulationMode: boolean;
  demoMode: boolean;
}
