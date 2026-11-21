export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export type FanMode = 'manual' | 'automatic';

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
  esp32Ip: string;
  port: number;
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
  esp32Ip: string;
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
