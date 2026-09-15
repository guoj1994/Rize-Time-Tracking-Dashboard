import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/shell/AppShell';
import { ShellProvider } from './contexts/ShellContext';
import { TrackingProvider } from './contexts/TrackingContext';
import { Activity } from './pages/Activity';
import { Agent } from './pages/Agent';
import { Calendar } from './pages/Calendar';
import { Clients } from './pages/Clients';
import { Dashboards } from './pages/Dashboards';
import { Invoices } from './pages/Invoices';
import { Members } from './pages/Members';
import { MyTimesheet } from './pages/MyTimesheet';
import { Plans } from './pages/Plans';
import { Profitability } from './pages/Profitability';
import { Projects } from './pages/Projects';
import { ReportDetail } from './pages/ReportDetail';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Tasks } from './pages/Tasks';
import { TimeEntries } from './pages/TimeEntries';
import { Timer } from './pages/Timer';
import { Timesheets } from './pages/Timesheets';
import { Teams } from './pages/Teams';

interface AppProps {
  /** Appearance of the desktop app. */
  theme?: 'light' | 'dark';
  /** Subscription tier — Basic gates the AI sections of reports. */
  plan?: 'basic' | 'professional' | 'max';
  /** Start with the navigation rail collapsed to icons. */
  sidebarCollapsed?: boolean;
}

export function App({ theme = 'light', plan = 'basic', sidebarCollapsed = false }: AppProps) {
  return (
    <BrowserRouter>
      <ShellProvider initialTheme={theme} initialPlan={plan} initialCollapsed={sidebarCollapsed}>
        <TrackingProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Agent />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/my-timesheet" element={<MyTimesheet />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/time-entries" element={<TimeEntries />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/:runId" element={<ReportDetail />} />
              <Route path="/profitability" element={<Profitability />} />
              <Route path="/dashboards" element={<Dashboards />} />
              <Route path="/timesheets" element={<Timesheets />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/members" element={<Members />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="*" element={<Agent />} />
            </Route>
          </Routes>
        </TrackingProvider>
      </ShellProvider>
    </BrowserRouter>);

}