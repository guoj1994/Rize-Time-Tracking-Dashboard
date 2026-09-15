import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MicIcon, MusicIcon, PauseIcon, PlayIcon, PowerIcon, SquareIcon, Volume2Icon } from 'lucide-react';
import { SessionMenu } from './SessionMenu';
import { useTracking } from '../../contexts/TrackingContext';
import { sounds } from '../../data/tracking';
import { categoryMeta, classify } from '../../utils/classify';
import { formatClock, formatCompact } from '../../utils/time';
import type { SessionKind } from '../../types';

const statusLabel: Record<string, string> = {
  locked: 'Locked',
  running: 'Tracking',
  paused: 'Paused',
  break: 'On break'
};

const kindLabel: Record<SessionKind, string> = { focus: 'Focus', meeting: 'Meeting', break: 'Break' };

export function TrackingBar() {
  const {
    state,
    sessionKind,
    trackingEnabled,
    sessionSeconds,
    remainingSeconds,
    trackedSeconds,
    currentApp,
    currentWebsite,
    openLauncher,
    pauseSession,
    resumeSession,
    endSession,
    toggleTracking,
    musicPlaying,
    toggleMusic,
    cycleSound,
    soundId
  } = useTracking();
  const [menuOpen, setMenuOpen] = useState(false);

  const running = state === 'running' || state === 'break';
  const idle = state === 'locked';
  const sound = sounds.find((item) => item.id === soundId) ?? sounds[0];
  const verdict = classify(currentApp, currentWebsite);
  const liveCategory = sessionKind === 'meeting' ? 'meeting' : verdict.category;
  const meta = categoryMeta[liveCategory];

  const primaryLabel = idle ?
  'Start Session' :
  state === 'paused' ?
  'Resume' :
  `Pause${sessionKind ? ` ${kindLabel[sessionKind]}` : ''}`;

  const onPrimary = () => {
    if (idle) {
      setMenuOpen((value) => !value);
      return;
    }
    if (state === 'paused') resumeSession();else
    pauseSession();
  };

  return (
    <footer className="flex h-[54px] shrink-0 items-center gap-4 border-t border-line bg-rail px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTracking}
          aria-pressed={trackingEnabled}
          aria-label={trackingEnabled ? 'Turn tracking off' : 'Turn tracking on'}
          className={`rounded-md p-1 transition-colors duration-150 ease-snap ${
          trackingEnabled ? 'text-positive hover:bg-canvas' : 'text-faint hover:bg-canvas hover:text-muted'}`
          }>
          
          <PowerIcon className="h-[17px] w-[17px]" />
        </button>

        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-semibold text-ink">
            {state === 'running' && sessionKind ? kindLabel[sessionKind] : statusLabel[state]}
          </span>
          <span className="w-[52px] text-[8px] font-medium uppercase leading-[1.1] tracking-wide text-faint">
            Tracking status
          </span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={onPrimary}
            aria-haspopup={idle ? 'menu' : undefined}
            aria-expanded={idle ? menuOpen : undefined}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-[6px] text-[13px] font-medium text-ink transition-colors duration-150 ease-snap hover:border-accent/40 hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
            
            {state === 'running' ?
            <PauseIcon className="h-[13px] w-[13px]" /> :

            <PlayIcon className="h-[13px] w-[13px]" />
            }
            {primaryLabel}
            {!idle &&
            <span className="tabular text-muted">
                {remainingSeconds !== null ? formatClock(remainingSeconds) : formatClock(sessionSeconds)}
              </span>
            }
          </button>

          {menuOpen && idle &&
          <SessionMenu
            onClose={() => setMenuOpen(false)}
            onSelect={(kind) => {
              setMenuOpen(false);
              openLauncher(kind);
            }} />

          }
        </div>

        {!idle &&
        <button
          type="button"
          onClick={endSession}
          aria-label="End session"
          className="rounded-md p-1.5 text-faint transition-colors duration-150 ease-snap hover:bg-canvas hover:text-danger">
          
            <SquareIcon className="h-[13px] w-[13px]" />
          </button>
        }

        <button
          type="button"
          aria-label="Voice note"
          className="rounded-md p-1.5 text-faint transition-colors duration-150 ease-snap hover:bg-canvas hover:text-ink">
          
          <MicIcon className="h-[15px] w-[15px]" />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-3 text-[12px]">
        {running ?
        <span className="flex min-w-0 items-center gap-2 text-muted">
            <motion.span
            className={`h-[6px] w-[6px] shrink-0 rounded-full ${meta.dot}`}
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }} />
          
            <span className="truncate text-ink">{currentApp}</span>
            {currentWebsite && <span className="truncate text-faint">{currentWebsite}</span>}
            <span className={`shrink-0 rounded border px-1.5 py-[1px] text-[11px] ${meta.chip}`}>{meta.label}</span>
          </span> :

        <span className="h-[4px] w-[52px] rounded-full bg-line" aria-hidden="true" />
        }
        <span className="tabular shrink-0 text-faint">Today {formatCompact(trackedSeconds)}</span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={cycleSound}
          aria-label="Change focus sound"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-md text-white transition-transform duration-150 ease-snap hover:scale-[1.04]"
          style={{ backgroundColor: sound.tile }}>
          
          <MusicIcon className="h-[15px] w-[15px]" />
        </button>
        <div className="hidden w-[96px] leading-tight sm:block">
          <p className="truncate text-[12px] text-ink">{sound.title}</p>
          <p className="truncate text-[10px] text-faint">{sound.artist}</p>
        </div>
        <button
          type="button"
          onClick={toggleMusic}
          disabled={soundId === 'silence'}
          aria-label={musicPlaying ? 'Pause focus music' : 'Play focus music'}
          className="rounded-md p-1.5 text-muted transition-colors duration-150 ease-snap hover:bg-canvas hover:text-ink disabled:opacity-40">
          
          {musicPlaying ? <PauseIcon className="h-[15px] w-[15px]" /> : <PlayIcon className="h-[15px] w-[15px]" />}
        </button>
        <button
          type="button"
          aria-label="Volume"
          className="rounded-md p-1.5 text-muted transition-colors duration-150 ease-snap hover:bg-canvas hover:text-ink">
          
          <Volume2Icon className="h-[15px] w-[15px]" />
        </button>
        <span
          className={`h-[14px] w-[14px] rounded-full transition-colors duration-150 ease-snap ${
          running ? meta.dot : 'bg-line'}`
          }
          aria-hidden="true" />
        
      </div>
    </footer>);

}