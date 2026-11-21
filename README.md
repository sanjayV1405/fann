# AIRLOOP — Smart Climate Control

> **Premium 3D Glassmorphism Smart Climate Control Platform**  
> Built from scratch to replicate the primary visual specifications with absolute precision, pure light glassmorphism, 3D climate objects, editorial typography, and full IoT ESP32 hardware telemetry.

---

## 🌟 Visual Specifications & Key Pages

The platform accurately reproduces the composition, typography, gradients, glass surfaces, and responsive controls of the design specifications across all 6 pages:

1. **Overview Dashboard** (`OverviewPage.tsx`)
   - Ethereal atmosphere with natural daylight, subtle floating leaves, and blue-lavender airwaves.
   - Editorial headline: **Welcome Back, Sanjay!** with custom vibrant blue-to-violet gradient and underline swoop.
   - **Central 3D Glass Climate Dial**: Multi-layered concentric refractive ring, dynamic SVG progress arc with glowing white indicator handle, home icon, large numerical temperature reading (`24°C`), and green **Comfortable** badge.
   - **Fan Control Widget**: 3D spinning desk fan, speed percentage readout (`75%`), precision slider, preset buttons (`Low`, `Medium`, `High`, `Max`), and `Apply Speed` action.
   - **Four Metric Cards**: Temperature (`24.5°C ↑0.2°` with blue sine wave), Humidity (`62% ↑1%` with purple sine wave), Air Quality (`Good ●` with green hill wave), and Sensor Health (`● Healthy`).
   - Persistent bottom-right floating toast: `✓ System Connected! AIRLOOP is now ready to use.`

2. **Fan Control** (`FanControlPage.tsx`)
   - Headline: **Control Your Fan with Precision**.
   - **Signature 3D Fan Visual**: Realistic aerodynamic 5-blade rotor, concentric cylindrical housing, central motor hub with glowing cyan/blue LED core, sleek white pedestal base, airflow vortex rings, and floating leaves swirling in the vortex.
   - **Operation Mode**: Segmented switch between `Manual` and `Automatic` mode.
   - **Fan Speed Control**: `75%` with `● Optimal Range` badge, gradient slider, preset modes (`Low`, `Medium`, `High`, `Maximum`), and `Apply Speed` button.
   - **Bottom Metrics**: Temperature, Humidity, Fan Status with 8-bar equalizer graphic, and Air Quality.

3. **Environment Monitor** (`EnvironmentPage.tsx`)
   - Headline: **Know Your Environment** with subtitle and top 3 mini-metrics cards.
   - **Climate Trends Glass Chart Panel**: Recharts area chart with dual natural spline curves (Sky Blue temperature, Lavender humidity), time filter selectors (`1h`, `24h`, `7d`), and custom glass tooltip.
   - **Air Quality Gauge**: Circular green gradient arc gauge, leaf icon, `Good` status, and `AQI: 32` reading with `Air quality is excellent!` badge.
   - **Insights Card**: Lightbulb icon with smart environmental commentary.
   - **Living Atmosphere Card**: Ceramic potted plant visual, translucent refractive glass spheres, and *"A healthier space, a happier you."* motif.

4. **Sensor Status** (`SensorStatusPage.tsx`)
   - Real-time diagnostics for 6 sensors: BME280 Temperature, BME280 Humidity, Sensirion SGP30 Air Quality, Fan Optical Tachometer (1450 RPM), Brushless PWM Motor Driver (25kHz), and ESP32 Microcontroller Core.
   - System health summary: CPU load, Free Heap, Wi-Fi RSSI, Uptime, and Bus health.
   - Filterable by status (`All`, `Healthy`, `Warning`, `Disconnected`).

5. **History & Analytics** (`HistoryPage.tsx`)
   - Comprehensive telemetry archive with metric selectors (`Temperature`, `Humidity`, `AQI`).
   - Real Data Export to **CSV** and **PDF** formats with single-click download.
   - Chronological hardware and system event audit log table.

6. **Settings & Hardware Configuration** (`SettingsPage.tsx`)
   - ESP32 Network Endpoint configuration: IP address and port input with live connection test.
   - Hardware Simulation Mode toggle (switch between live realistic simulation and physical ESP32 HTTP requests).
   - Temperature Unit toggle: **Celsius (°C)** vs **Fahrenheit (°F)** with instant live conversion across the entire platform.
   - Climate automation thresholds and interface preferences (High blur glass, Reduced motion, Audio feedback).
   - Complete hardware and firmware registry details.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4 + Custom Glassmorphism Token Architecture
- **Motion & Transitions**: Framer Motion
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **PWA**: Web App Manifest (`manifest.json`), custom SVG icons, mobile-responsive layouts.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### 1. Install Dependencies
```bash
cd AIRLOOP-NEW
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
The compiled, minified output will be in the `dist/` directory ready for any static web host.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🔌 ESP32 Hardware Integration

AIRLOOP includes an IoT hardware communication layer (`src/adapters/hardwareAdapter.ts` and `src/context/HardwareContext.tsx`).

### REST API Endpoints on ESP32

When connected to physical hardware:

1. **`GET /api/status`**
   Returns current telemetry snapshot:
   ```json
   {
     "temperature": 24.5,
     "humidity": 62,
     "aqi": 32,
     "airQualityStatus": "Good",
     "tempDelta": 0.2,
     "humidityDelta": 1,
     "fanSpeed": 75,
     "fanMode": "manual",
     "fanStatus": "running",
     "sensorHealth": "Healthy",
     "uptimeSeconds": 14280,
     "wifiRssi": -58,
     "esp32Ip": "192.168.1.184"
   }
   ```

2. **`POST /api/fan`**
   Payload:
   ```json
   {
     "speed": 75,
     "mode": "manual"
   }
   ```

3. **`GET /api/sensors`**
   Returns array of individual sensor transducer readings, accuracy specs, and bus status.

4. **`GET /api/history?range=24h`**
   Returns telemetry array for time-series charts.

---

## ☁️ Deployment

- **Vercel**: Pre-configured with `vercel.json` rewrite rules. Deploy with `vercel --prod`.
- **Netlify**: Pre-configured with `netlify.toml` build commands and single-page app redirects.
- **Firebase / GitHub Pages**: Deploy the `dist/` folder directly.

---

## 📱 Progressive Web App (PWA)
AIRLOOP is configured as an installable standalone web application. On supported browsers, click **Install AIRLOOP** in the browser URL bar for a native windowed experience.
