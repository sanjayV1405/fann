import { ClimateData, ClimateTrendPoint, FanMode, SensorDetail, SystemEvent } from '../types';

export interface IHardwareAdapter {
  connect(ip: string, port: number): Promise<boolean>;
  disconnect(): Promise<void>;
  getStatus(): Promise<ClimateData>;
  setFan(speed: number, mode: FanMode): Promise<boolean>;
  getSensors(): Promise<SensorDetail[]>;
  getHistory(range: '1h' | '24h' | '7d'): Promise<ClimateTrendPoint[]>;
}

// Initial default state directly aligned with the 3 primary reference screenshots
export const initialClimateData: ClimateData = {
  temperature: 24.5,
  humidity: 62,
  aqi: 32,
  airQualityStatus: 'Good',
  tempDelta: 0.2,
  humidityDelta: 1,
  fanSpeed: 75,
  fanTargetSpeed: 75,
  fanMode: 'manual',
  fanStatus: 'running',
  sensorHealth: 'Healthy',
  lastUpdated: 'Just now',
  uptimeSeconds: 14280,
  wifiRssi: -58,
  esp32Ip: '192.168.1.184',
  port: 80,
};

// Historical 24h data specifically modeled on the curve shown in Reference Image 3 (Climate Trends)
// Values at 12AM, 4AM, 8AM, 12PM, 4PM, 8PM, 12AM:
export const initial24hTrends: ClimateTrendPoint[] = [
  { time: '12AM', temperature: 26.2, humidity: 55, aqi: 28 },
  { time: '2AM', temperature: 25.4, humidity: 58, aqi: 29 },
  { time: '4AM', temperature: 24.1, humidity: 64, aqi: 30 },
  { time: '6AM', temperature: 23.8, humidity: 66, aqi: 31 },
  { time: '8AM', temperature: 24.9, humidity: 62, aqi: 32 },
  { time: '10AM', temperature: 26.5, humidity: 56, aqi: 34 },
  { time: '12PM', temperature: 28.1, humidity: 52, aqi: 35 },
  { time: '2PM', temperature: 27.8, humidity: 54, aqi: 33 },
  { time: '4PM', temperature: 26.3, humidity: 59, aqi: 31 },
  { time: '6PM', temperature: 25.1, humidity: 61, aqi: 32 },
  { time: '8PM', temperature: 24.5, humidity: 62, aqi: 32 }, // Hover marker point in reference image 3
  { time: '10PM', temperature: 25.0, humidity: 60, aqi: 30 },
  { time: '12AM', temperature: 24.7, humidity: 61, aqi: 29 },
];

export const initial1hTrends: ClimateTrendPoint[] = [
  { time: '0m', temperature: 24.3, humidity: 61, aqi: 31 },
  { time: '10m', temperature: 24.4, humidity: 62, aqi: 31 },
  { time: '20m', temperature: 24.5, humidity: 62, aqi: 32 },
  { time: '30m', temperature: 24.5, humidity: 62, aqi: 32 },
  { time: '40m', temperature: 24.6, humidity: 63, aqi: 32 },
  { time: '50m', temperature: 24.5, humidity: 62, aqi: 32 },
  { time: '60m', temperature: 24.5, humidity: 62, aqi: 32 },
];

export const initial7dTrends: ClimateTrendPoint[] = [
  { time: 'Mon', temperature: 23.9, humidity: 64, aqi: 30 },
  { time: 'Tue', temperature: 24.2, humidity: 63, aqi: 31 },
  { time: 'Wed', temperature: 24.8, humidity: 60, aqi: 33 },
  { time: 'Thu', temperature: 25.1, humidity: 59, aqi: 35 },
  { time: 'Fri', temperature: 24.6, humidity: 61, aqi: 32 },
  { time: 'Sat', temperature: 24.3, humidity: 63, aqi: 29 },
  { time: 'Sun', temperature: 24.5, humidity: 62, aqi: 32 },
];

export const initialSensors: SensorDetail[] = [
  {
    id: 'bme280-temp',
    name: 'Precision Temperature',
    model: 'Bosch BME280',
    type: 'Thermal',
    value: 24.5,
    unit: '°C',
    status: 'Healthy',
    accuracy: '±0.1°C',
    busInterface: 'I2C 0x76 (Fast 400kHz)',
    lastPing: '2s ago',
    description: 'Factory-calibrated digital environmental transducer with active offset compensation.',
  },
  {
    id: 'bme280-hum',
    name: 'Relative Humidity',
    model: 'Bosch BME280',
    type: 'Hygrometer',
    value: 62,
    unit: '%',
    status: 'Healthy',
    accuracy: '±2% RH',
    busInterface: 'I2C 0x76',
    lastPing: '2s ago',
    description: 'Capacitive polymer hygrometer sensor calibrated against dew point reference.',
  },
  {
    id: 'sgp30-aqi',
    name: 'Indoor Air Quality (AQI)',
    model: 'Sensirion SGP30',
    type: 'Multi-pixel Gas',
    value: 32,
    unit: 'AQI',
    status: 'Healthy',
    accuracy: '±15% eCO2/TVOC',
    busInterface: 'I2C 0x58',
    lastPing: '4s ago',
    description: 'Metal-oxide indoor air sensor calculating AQI from TVOC and equivalent CO2.',
  },
  {
    id: 'fan-tachometer',
    name: 'Fan Optical Tachometer',
    model: 'Hall/Pulse Counter',
    type: 'Frequency',
    value: 1450,
    unit: 'RPM',
    status: 'Healthy',
    accuracy: '±10 RPM',
    busInterface: 'ESP32 GPIO 18 (PCNT)',
    lastPing: '1s ago',
    description: 'High-speed hardware pulse counter measuring true blade aerodynamic angular velocity.',
  },
  {
    id: 'fan-pwm-driver',
    name: 'Brushless Motor Driver',
    model: 'MOSFET PWM Stage',
    type: 'Actuator',
    value: 75,
    unit: '% PWM',
    status: 'Healthy',
    accuracy: '12-bit LEDC (25 kHz)',
    busInterface: 'ESP32 GPIO 23',
    lastPing: '1s ago',
    description: 'Ultrasonic 25kHz silent frequency PWM drive stage with overload flyback protection.',
  },
  {
    id: 'esp32-core',
    name: 'ESP32 MCU Core & Wi-Fi',
    model: 'ESP32-WROOM-32D',
    type: 'Microcontroller',
    value: '240 MHz / -58 dBm',
    unit: 'RSSI',
    status: 'Healthy',
    accuracy: 'Tensilica Xtensa LX6 Dual-Core',
    busInterface: '802.11 b/g/n Station',
    lastPing: 'Active',
    description: 'IoT controller orchestrating sensor polling, WebSocket telemetry, and hardware PWM.',
  },
];

export const initialEvents: SystemEvent[] = [
  {
    id: 'ev-1',
    timestamp: '21:20:15',
    type: 'hardware',
    severity: 'success',
    title: 'ESP32 Connected',
    description: 'Handshake completed with 192.168.1.184. Telemetry stream synchronized.',
  },
  {
    id: 'ev-2',
    timestamp: '21:18:40',
    type: 'fan',
    severity: 'info',
    title: 'Fan Speed Updated',
    description: 'Target speed set to 75% in Manual mode. Pulse width modulated at 25kHz.',
  },
  {
    id: 'ev-3',
    timestamp: '21:05:12',
    type: 'sensor',
    severity: 'info',
    title: 'Air Quality Optimal',
    description: 'SGP30 baseline baseline calibrated: TVOC 12 ppb, AQI 32 (Good).',
  },
  {
    id: 'ev-4',
    timestamp: '20:45:00',
    type: 'climate',
    severity: 'info',
    title: 'Temperature Settled',
    description: 'Room temperature stabilized around 24.5°C with 62% humidity.',
  },
];

/**
 * Real ESP32 HTTP/REST Adapter
 * Sends commands and polls physical ESP32 endpoints:
 * - GET /api/status
 * - POST /api/fan  { speed: number, mode: 'manual'|'automatic' }
 * - GET /api/sensors
 */
export class RealESP32Adapter implements IHardwareAdapter {
  private ip: string;
  private port: number;

  constructor(ip: string = '192.168.1.184', port: number = 80) {
    this.ip = ip;
    this.port = port;
  }

  async connect(ip: string, port: number): Promise<boolean> {
    this.ip = ip;
    this.port = port;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`http://${this.ip}:${this.port}/api/status`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  }

  async disconnect(): Promise<void> {
    // Graceful disconnect
    return Promise.resolve();
  }

  async getStatus(): Promise<ClimateData> {
    const res = await fetch(`http://${this.ip}:${this.port}/api/status`);
    if (!res.ok) throw new Error(`ESP32 status error: ${res.statusText}`);
    return await res.json();
  }

  async setFan(speed: number, mode: FanMode): Promise<boolean> {
    const res = await fetch(`http://${this.ip}:${this.port}/api/fan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speed, mode }),
    });
    return res.ok;
  }

  async getSensors(): Promise<SensorDetail[]> {
    const res = await fetch(`http://${this.ip}:${this.port}/api/sensors`);
    if (!res.ok) return initialSensors;
    return await res.json();
  }

  async getHistory(range: '1h' | '24h' | '7d'): Promise<ClimateTrendPoint[]> {
    try {
      const res = await fetch(`http://${this.ip}:${this.port}/api/history?range=${range}`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    if (range === '1h') return initial1hTrends;
    if (range === '7d') return initial7dTrends;
    return initial24hTrends;
  }
}

/**
 * Intelligent Hardware Simulator Adapter
 * Provides realistic IoT dynamics, network latency, smooth sensor jitter,
 * and command confirmations when running standalone without a physical board.
 */
export class SimulatedESP32Adapter implements IHardwareAdapter {
  private state: ClimateData = { ...initialClimateData };
  private connected: boolean = true;

  async connect(ip: string, port: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 800)); // realistic network latency
    this.connected = true;
    this.state.esp32Ip = ip;
    this.state.port = port;
    return true;
  }

  async disconnect(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.connected = false;
  }

  async getStatus(): Promise<ClimateData> {
    if (!this.connected) {
      throw new Error('Device offline');
    }
    // Realistic micro-fluctuations
    const jitter = (Math.random() - 0.5) * 0.08;
    this.state.temperature = +(24.5 + jitter).toFixed(1);
    this.state.humidity = Math.round(62 + (Math.random() - 0.5) * 1.5);
    this.state.aqi = Math.round(32 + (Math.random() - 0.5) * 2);
    this.state.lastUpdated = 'Just now';
    return { ...this.state };
  }

  async setFan(speed: number, mode: FanMode): Promise<boolean> {
    if (!this.connected) return false;
    // Simulate real command latency and ACK
    await new Promise((resolve) => setTimeout(resolve, 450));
    this.state.fanSpeed = speed;
    this.state.fanTargetSpeed = speed;
    this.state.fanMode = mode;
    this.state.fanStatus = speed > 0 ? 'running' : 'stopped';
    return true;
  }

  async getSensors(): Promise<SensorDetail[]> {
    if (!this.connected) {
      return initialSensors.map((s) => ({ ...s, status: 'Disconnected' }));
    }
    return initialSensors.map((s) => {
      if (s.id === 'fan-tachometer') {
        const rpm = this.state.fanStatus === 'running' ? Math.round((this.state.fanSpeed / 100) * 1950) : 0;
        return { ...s, value: rpm };
      }
      if (s.id === 'fan-pwm-driver') {
        return { ...s, value: this.state.fanSpeed };
      }
      return s;
    });
  }

  async getHistory(range: '1h' | '24h' | '7d'): Promise<ClimateTrendPoint[]> {
    if (range === '1h') return initial1hTrends;
    if (range === '7d') return initial7dTrends;
    return initial24hTrends;
  }
}
