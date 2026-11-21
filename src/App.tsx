import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { HardwareProvider, useHardware } from './context/HardwareContext';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { FanControlPage } from './pages/FanControlPage';
import { EnvironmentPage } from './pages/EnvironmentPage';
import { SensorStatusPage } from './pages/SensorStatusPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

const PageContent: React.FC = () => {
  const { activePage } = useHardware();

  return (
    <AnimatePresence mode="wait">
      {activePage === 'overview' && <OverviewPage key="overview" />}
      {activePage === 'fan' && <FanControlPage key="fan" />}
      {activePage === 'environment' && <EnvironmentPage key="environment" />}
      {activePage === 'sensors' && <SensorStatusPage key="sensors" />}
      {activePage === 'history' && <HistoryPage key="history" />}
      {activePage === 'settings' && <SettingsPage key="settings" />}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <HardwareProvider>
      <AppShell>
        <PageContent />
      </AppShell>
    </HardwareProvider>
  );
}
