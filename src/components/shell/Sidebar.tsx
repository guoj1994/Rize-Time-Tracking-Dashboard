import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  HelpCircleIcon,
  MicIcon,
  SlidersHorizontalIcon } from
'lucide-react';
import { navGroups } from '../../data/navigation';
import { useShell } from '../../contexts/ShellContext';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useShell();

  if (sidebarCollapsed) {
    return (
      <nav
        aria-label="Primary"
        className="flex w-[52px] shrink-0 flex-col items-center border-r border-line bg-rail py-3">
        
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Expand sidebar"
          className="mb-3 rounded-md p-1.5 text-faint transition-colors duration-150 ease-snap hover:bg-canvas hover:text-ink">
          
          <ChevronsRightIcon className="h-4 w-4" />
        </button>
        <div className="flex flex-1 flex-col items-center gap-1 overflow-y-auto rize-scroll">
          {navGroups.flatMap((group) => group.items).map((item) =>
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            title={item.label}
            className={({ isActive }) =>
            `rounded-md p-2 transition-colors duration-150 ease-snap ${
            isActive ? 'bg-accent-soft text-accent-ink' : 'text-muted hover:bg-canvas hover:text-ink'}`

            }>
            
              <item.icon className={`h-[17px] w-[17px] ${item.accent ? 'fill-accent text-accent' : ''}`} />
            </NavLink>
          )}
        </div>
      </nav>);

  }

  return (
    <nav aria-label="Primary" className="flex w-[200px] shrink-0 flex-col border-r border-line bg-rail">
      <div className="flex items-center gap-2 px-3 py-3">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-surface px-2 py-[7px] text-left transition-colors duration-150 ease-snap hover:border-accent/30">
          
          <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded bg-accent-soft text-accent-ink">
            <MicIcon className="h-[11px] w-[11px]" />
          </span>
          <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">xijie</span>
          <ChevronsUpDownIcon className="h-[13px] w-[13px] shrink-0 text-faint" />
        </button>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
          className="rounded-md p-1 text-faint transition-colors duration-150 ease-snap hover:bg-canvas hover:text-ink">
          
          <ChevronsLeftIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="rize-scroll flex-1 overflow-y-auto px-2 pb-2">
        {navGroups.map((group) =>
        <div key={group.title} className="mb-1">
            <p className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-faint">
              {group.title}
            </p>
            <ul>
              {group.items.map((item) =>
            <li key={item.to}>
                  <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-2 py-[7px] text-[13px] transition-colors duration-150 ease-snap ${
                isActive ?
                'bg-accent-soft font-medium text-accent-ink' :
                'text-muted hover:bg-canvas hover:text-ink'}`

                }>
                
                    <item.icon
                  className={`h-[15px] w-[15px] shrink-0 ${item.accent ? 'fill-accent text-accent' : ''}`} />
                
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                </li>
            )}
            </ul>
          </div>
        )}

        <p className="px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-faint">Your Teams</p>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-[7px] text-[13px] text-muted transition-colors duration-150 ease-snap hover:bg-canvas hover:text-ink">
          
          <MicIcon className="h-[15px] w-[15px] shrink-0 text-accent" />
          <span className="flex-1 truncate text-left">xijie</span>
          <ChevronRightIcon className="h-[13px] w-[13px] text-faint" />
        </button>
      </div>

      <div className="flex items-center gap-1 border-t border-line px-3 py-2">
        <button
          type="button"
          aria-label="Help"
          className="rounded-md p-1.5 text-faint transition-colors duration-150 ease-snap hover:bg-canvas hover:text-ink">
          
          <HelpCircleIcon className="h-4 w-4" />
        </button>
        <NavLink
          to="/settings"
          aria-label="Preferences"
          className="rounded-md p-1.5 text-faint transition-colors duration-150 ease-snap hover:bg-canvas hover:text-ink">
          
          <SlidersHorizontalIcon className="h-4 w-4" />
        </NavLink>
      </div>
    </nav>);

}