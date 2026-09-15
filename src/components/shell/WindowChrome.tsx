import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, GiftIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useShell } from '../../contexts/ShellContext';

export function WindowChrome() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useShell();

  return (
    <div className="flex h-[30px] shrink-0 select-none items-center gap-3 border-b border-line bg-rail px-3">
      <div className="flex items-center gap-[7px]" aria-hidden="true">
        <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="rounded p-[3px] text-faint transition-colors duration-150 ease-snap hover:text-ink">
          
          <ChevronLeftIcon className="h-[15px] w-[15px]" />
        </button>
        <button
          type="button"
          onClick={() => navigate(1)}
          aria-label="Forward"
          className="rounded p-[3px] text-faint transition-colors duration-150 ease-snap hover:text-ink">
          
          <ChevronRightIcon className="h-[15px] w-[15px]" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <span className="text-[12px] font-medium tracking-[0.42em] text-ink">RIZE</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark appearance' : 'Switch to light appearance'}
          className="rounded p-[3px] text-muted transition-colors duration-150 ease-snap hover:text-ink">
          
          {theme === 'light' ? <SunIcon className="h-[15px] w-[15px]" /> : <MoonIcon className="h-[15px] w-[15px]" />}
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded text-[12px] text-muted transition-colors duration-150 ease-snap hover:text-ink">
          
          <GiftIcon className="h-[15px] w-[15px]" />
          Refer Friends
        </button>
        <span
          role="img"
          aria-label="Signed in as xijie"
          title="xijie"
          className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-white ring-1 ring-line">
          
          XJ
        </span>
      </div>
    </div>);

}