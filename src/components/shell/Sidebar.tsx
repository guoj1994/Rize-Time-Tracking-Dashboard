import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import { navItems } from '../../data/navigation';
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
        <div className="flex flex-1 flex-col items-center gap-1">
          {navItems.map((item) =>
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            title={item.label}
            className={({ isActive }) =>
            `rounded-md p-2 transition-colors duration-150 ease-snap ${
            isActive ? 'bg-accent-soft text-accent-ink' : 'text-muted hover:bg-canvas hover:text-ink'}`

            }>
            
              <item.icon className="h-[17px] w-[17px]" />
            </NavLink>
          )}
        </div>
      </nav>);

  }

  return (
    <nav aria-label="Primary" className="flex w-[192px] shrink-0 flex-col border-r border-line bg-rail">
      <div className="flex items-center justify-between px-3 py-3.5">
        <span className="text-[13px] font-semibold tracking-tight text-ink">FocusBoard</span>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
          className="rounded-md p-1 text-faint transition-colors duration-150 ease-snap hover:bg-canvas hover:text-ink">
          
          <ChevronsLeftIcon className="h-4 w-4" />
        </button>
      </div>

      <ul className="flex-1 px-2">
        {navItems.map((item) =>
        <li key={item.to}>
            <NavLink
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-md px-2 py-[8px] text-[13px] transition-colors duration-150 ease-snap ${
            isActive ? 'bg-accent-soft font-medium text-accent-ink' : 'text-muted hover:bg-canvas hover:text-ink'}`

            }>
            
              <item.icon className="h-[15px] w-[15px] shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          </li>
        )}
      </ul>

      <p className="px-3 pb-3 text-[11px] text-faint">Private · local-first</p>
    </nav>);

}