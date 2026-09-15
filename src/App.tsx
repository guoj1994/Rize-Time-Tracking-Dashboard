import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/shell/AppShell';
import { ShellProvider } from './contexts/ShellContext';
import { TrackingProvider } from './contexts/TrackingContext';
import { Activity } from './pages/Activity';
import { Focus } from './pages/Focus';
import { Projects } from './pages/Projects';
import { Settings } from './pages/Settings';
import { Summary } from './pages/Summary';
import { Today } from './pages/Today';

interface AppProps {
  /** Appearance of the desktop app. */
  theme?: 'light' | 'dark';
  /** Start with the navigation rail collapsed to icons. */
  sidebarCollapsed?: boolean;
}

export function App({ theme = 'light', sidebarCollapsed = false }: AppProps) {
  return (
    <BrowserRouter>
      <ShellProvider initialTheme={theme} initialCollapsed={sidebarCollapsed}>
        <TrackingProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Today />} />
              <Route path="/focus" element={<Focus />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Today />} />
            </Route>
          </Routes>
        </TrackingProvider>
      </ShellProvider>
    </BrowserRouter>);

}