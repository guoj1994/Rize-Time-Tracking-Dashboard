import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TrackingBar } from './TrackingBar';
import { WindowChrome } from './WindowChrome';
import { StartSessionModal } from '../session/StartSessionModal';
import { useShell } from '../../contexts/ShellContext';
import { useTracking } from '../../contexts/TrackingContext';
import type { SessionKind } from '../../types';

const shortcuts: Record<string, SessionKind> = { f: 'focus', m: 'meeting', b: 'break' };

export function AppShell() {
  const { theme } = useShell();
  const { openLauncher } = useTracking();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) return;
      const kind = shortcuts[event.key.toLowerCase()];
      if (!kind) return;
      const target = event.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      event.preventDefault();
      openLauncher(kind);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openLauncher]);

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
        <StartSessionModal />
      </div>
    </div>);

}