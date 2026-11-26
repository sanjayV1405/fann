import { ClimateData, ClimateTrendPoint, FanMode, SensorDetail, SystemEvent, calculateAutoSpeed } from '../types';

export interface IHardwareAdapter {
  connect(ip: string, port: number): Promise<boolean>;
  disconnect(): Promise<void>;
  getStatus(): Promise<ClimateData>;
  setFan(speed: number, mode: FanMode): Promise<boolean>;
  getSensors(): Promise<SensorDetail[]>;
  getHistory(range: '1h' | '24h' | '7d'): Promise<ClimateTrendPoint[]>;
}

// Initial offline/baseline state
export const initialClimateData: ClimateData = {
  temperature: 0,
  humidity: 0,
  aqi: 0,
  airQualityStatus: 'Moderate',
  tempDelta: 0,
  humidityDelta: 0,
  fanSpeed: 0,
  fanTargetSpeed: 0,
  fanMode: 'manual',
  fanStatus: 'stopped',
  sensorHealth: 'Disconnected',
  lastUpdated: 'Offline',
  uptimeSeconds: 0,
  wifiRssi: 0,
  deviceIp: '192.168.1.184',
  port: 80,
};

// Historical default trends
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
  { time: '8PM', temperature: 24.5, humidity: 62, aqi: 32 },
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
    value: '--',
    unit: '°C',
    status: 'Disconnected',
    accuracy: '±0.1°C',
    busInterface: 'I2C 0x76 (Fast 400kHz)',
    lastPing: 'Never',
    description: 'Factory-calibrated digital environmental transducer with active offset compensation.',
  },
  {
    id: 'bme280-hum',
    name: 'Relative Humidity',
    model: 'Bosch BME280',
    type: 'Hygrometer',
    value: '--',
    unit: '%',
    status: 'Disconnected',
    accuracy: '±2% RH',
    busInterface: 'I2C 0x76',
    lastPing: 'Never',
    description: 'Capacitive polymer hygrometer sensor calibrated against dew point reference.',
  },
  {
    id: 'sgp30-aqi',
    name: 'Indoor Air Quality (AQI)',
    model: 'Sensirion SGP30',
    type: 'Multi-pixel Gas',
    value: '--',
    unit: 'AQI',
    status: 'Disconnected',
    accuracy: '±15% eCO2/TVOC',
    busInterface: 'I2C 0x58',
    lastPing: 'Never',
    description: 'Metal-oxide indoor air sensor calculating AQI from TVOC and equivalent CO2.',
  },
  {
    id: 'fan-tachometer',
    name: 'Fan Optical Tachometer',
    model: 'Hall/Pulse Counter',
    type: 'Frequency',
    value: '--',
    unit: 'RPM',
    status: 'Disconnected',
    accuracy: '±10 RPM',
    busInterface: 'GPIO 18 (PCNT)',
    lastPing: 'Never',
    description: 'High-speed hardware pulse counter measuring true blade aerodynamic angular velocity.',
  },
  {
    id: 'fan-pwm-driver',
    name: 'Brushless Motor Driver',
    model: 'MOSFET PWM Stage',
    type: 'Actuator',
    value: '--',
    unit: '% PWM',
    status: 'Disconnected',
    accuracy: '12-bit LEDC (25 kHz)',
    busInterface: 'GPIO 23',
    lastPing: 'Never',
    description: 'Ultrasonic 25kHz silent frequency PWM drive stage with overload flyback protection.',
  },
  {
    id: 'mcu-core',
    name: 'MCU Core & Wi-Fi',
    model: 'Dual-Core MCU-32',
    type: 'Microcontroller',
    value: '--',
    unit: 'RSSI',
    status: 'Disconnected',
    accuracy: 'Tensilica Xtensa LX6 Dual-Core',
    busInterface: '802.11 b/g/n Station',
    lastPing: 'Offline',
    description: 'IoT controller orchestrating sensor polling, WebSocket telemetry, and hardware PWM.',
  },
];

export const initialEvents: SystemEvent[] = [];

/**
 * Real Device HTTP/REST Adapter
 * Sends commands and polls physical hardware endpoints with strict timeouts:
 * - GET /api/status (or /status)
 * - POST /api/fan  { speed: number, mode: 'manual'|'automatic' }
 * - GET /api/sensors
 */
export class RealDeviceAdapter implements IHardwareAdapter {
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
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const url = `http://${this.ip}:${this.port}/api/status`;
      
      const res = await fetch(url, {
        signal: controller.signal,
      }).catch(async () => {
        // Fallback endpoint probe
        return await fetch(`http://${this.ip}:${this.port}/status`, {
          signal: controller.signal,
        });
      });

      clearTimeout(timeoutId);
      return res ? res.ok : false;
    } catch {
      return false;
    }
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async getStatus(): Promise<ClimateData> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    try {
      const res = await fetch(`http://${this.ip}:${this.port}/api/status`, {
        signal: controller.signal,
      }).catch(async () => {
        return await fetch(`http://${this.ip}:${this.port}/status`, {
          signal: controller.signal,
        });
      });
      clearTimeout(timeoutId);
      if (!res || !res.ok) throw new Error('Device unreachable');
      return await res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  async setFan(speed: number, mode: FanMode): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    try {
      const res = await fetch(`http://${this.ip}:${this.port}/api/fan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed, mode }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      clearTimeout(timeoutId);
      return false;
    }
  }

  async getSensors(): Promise<SensorDetail[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    try {
      const res = await fetch(`http://${this.ip}:${this.port}/api/sensors`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res || !res.ok) return initialSensors;
      return await res.json();
    } catch {
      clearTimeout(timeoutId);
      return initialSensors;
    }
  }

  async getHistory(range: '1h' | '24h' | '7d'): Promise<ClimateTrendPoint[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    try {
      const res = await fetch(`http://${this.ip}:${this.port}/api/history?range=${range}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res && res.ok) return await res.json();
    } catch {
      clearTimeout(timeoutId);
    }
    if (range === '1h') return initial1hTrends;
    if (range === '7d') return initial7dTrends;
    return initial24hTrends;
  }
}

/**
 * Hardware Simulator Adapter
 * Used only when simulation mode is explicitly enabled by the user in Settings.
 */
export class SimulatedDeviceAdapter implements IHardwareAdapter {
  private state: ClimateData = { ...initialClimateData };
  private connected: boolean = false;

  async connect(ip: string, port: number): Promise<boolean> {
    this.connected = true;
    this.state = {
      ...this.state,
      temperature: 24.5,
      humidity: 62,
      aqi: 32,
      airQualityStatus: 'Good',
      fanSpeed: 75,
      fanTargetSpeed: 75,
      fanStatus: 'running',
      sensorHealth: 'Healthy',
      deviceIp: ip,
      port: port,
      lastUpdated: 'Just now',
    };
    return true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.state = { ...initialClimateData, fanStatus: 'stopped', fanSpeed: 0, sensorHealth: 'Disconnected' };
  }

  async getStatus(): Promise<ClimateData> {
    if (!this.connected) {
      throw new Error('Device offline');
    }
    const jitter = (Math.random() - 0.5) * 0.08;
    this.state.temperature = +(24.5 + jitter).toFixed(1);
    this.state.humidity = Math.round(62 + (Math.random() - 0.5) * 1.5);
    this.state.aqi = Math.round(32 + (Math.random() - 0.5) * 2);
    this.state.lastUpdated = 'Just now';

    // In automatic mode, speed is dynamically governed by temperature sensor
    if (this.state.fanMode === 'automatic') {
      const autoSpd = calculateAutoSpeed(this.state.temperature);
      this.state.fanSpeed = autoSpd;
      this.state.fanTargetSpeed = autoSpd;
      this.state.fanStatus = 'running';
    }

    return { ...this.state };
  }

  async setFan(speed: number, mode: FanMode): Promise<boolean> {
    if (!this.connected) return false;
    const targetSpeed = mode === 'automatic' ? calculateAutoSpeed(this.state.temperature) : speed;
    this.state.fanSpeed = targetSpeed;
    this.state.fanTargetSpeed = targetSpeed;
    this.state.fanMode = mode;
    this.state.fanStatus = targetSpeed > 0 ? 'running' : 'stopped';
    return true;
  }

  async getSensors(): Promise<SensorDetail[]> {
    if (!this.connected) {
      return initialSensors;
    }
    return [
      {
        id: 'bme280-temp',
        name: 'Precision Temperature',
        model: 'Bosch BME280',
        type: 'Thermal',
        value: this.state.temperature,
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
        value: this.state.humidity,
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
        value: this.state.aqi,
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
        value: this.state.fanStatus === 'running' ? Math.round((this.state.fanSpeed / 100) * 1950) : 0,
        unit: 'RPM',
        status: 'Healthy',
        accuracy: '±10 RPM',
        busInterface: 'GPIO 18 (PCNT)',
        lastPing: '1s ago',
        description: 'High-speed hardware pulse counter measuring true blade aerodynamic angular velocity.',
      },
      {
        id: 'fan-pwm-driver',
        name: 'Brushless Motor Driver',
        model: 'MOSFET PWM Stage',
        type: 'Actuator',
        value: this.state.fanSpeed,
        unit: '% PWM',
        status: 'Healthy',
        accuracy: '12-bit LEDC (25 kHz)',
        busInterface: 'GPIO 23',
        lastPing: '1s ago',
        description: 'Ultrasonic 25kHz silent frequency PWM drive stage with overload flyback protection.',
      },
      {
        id: 'mcu-core',
        name: 'MCU Core & Wi-Fi',
        model: 'Dual-Core MCU-32',
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
  }

  async getHistory(range: '1h' | '24h' | '7d'): Promise<ClimateTrendPoint[]> {
    if (range === '1h') return initial1hTrends;
    if (range === '7d') return initial7dTrends;
    return initial24hTrends;
  }
}
