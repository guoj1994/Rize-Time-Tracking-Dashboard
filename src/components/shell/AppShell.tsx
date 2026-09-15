import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TrackingBar } from './TrackingBar';
import { WindowChrome } from './WindowChrome';
import { useShell } from '../../contexts/ShellContext';

export function AppShell() {
  const { theme } = useShell();

  return (
    <div className={theme === 'dark' ? 'dark h-full w-full' : 'h-full w-full'}>
      <div className="flex h-full w-full flex-col bg-canvas font-sans text-ink">
        <WindowChrome />
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <Outlet />
          </main>
        </div>
        <TrackingBar />
      </div>
    </div>);

}