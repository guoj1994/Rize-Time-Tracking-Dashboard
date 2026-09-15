import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PauseIcon, PlayIcon, PowerIcon, SquareIcon } from 'lucide-react';
import { useTracking } from '../../contexts/TrackingContext';
import { categoryMeta, classify } from '../../utils/classify';
import { formatClock, formatCompact } from '../../utils/time';

const statusLabel: Record<string, string> = { idle: 'Idle', running: 'Focusing', paused: 'Paused' };

export function TrackingBar() {
  const navigate = useNavigate();
  const {
    state,
    config,
    trackingEnabled,
    sessionSeconds,
    remainingSeconds,
    trackedSeconds,
    currentApp,
    currentWebsite,
    pauseSession,
    resumeSession,
    endSession,
    toggleTracking
  } = useTracking();

  const idle = state === 'idle';
  const verdict = classify(currentApp, currentWebsite);
  const meta = categoryMeta[verdict.category];

  return (
    <footer className="flex h-[54px] shrink-0 items-center gap-4 border-t border-line bg-rail px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTracking}
          aria-pressed={trackingEnabled}
          aria-label={trackingEnabled ? 'Turn local capture off' : 'Turn local capture on'}
          className={`rounded-md p-1 transition-colors duration-150 ease-snap ${
          trackingEnabled ? 'text-positive hover:bg-canvas' : 'text-faint hover:bg-canvas hover:text-muted'}`
          }>
          
          <PowerIcon className="h-[17px] w-[17px]" />
        </button>

        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-semibold text-ink">{statusLabel[state]}</span>
          <span className="w-[52px] text-[8px] font-medium uppercase leading-[1.1] tracking-wide text-faint">
            Capture status
          </span>
        </div>

        {idle ?
        <button
          type="button"
          onClick={() => navigate('/focus')}
          className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-[6px] text-[13px] font-medium text-ink transition-colors duration-150 ease-snap hover:border-accent/40 hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
          
            <PlayIcon className="h-[13px] w-[13px]" />
            Start Focus
          </button> :

        <>
            <button
            type="button"
            onClick={state === 'running' ? pauseSession : resumeSession}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-[6px] text-[13px] font-medium text-ink transition-colors duration-150 ease-snap hover:border-accent/40 hover:text-accent-ink">
            
              {state === 'running' ? <PauseIcon className="h-[13px] w-[13px]" /> : <PlayIcon className="h-[13px] w-[13px]" />}
              {state === 'running' ? 'Pause' : 'Resume'}
              <span className="tabular text-muted">
                {remainingSeconds !== null ? formatClock(remainingSeconds) : formatClock(sessionSeconds)}
              </span>
            </button>
            <button
            type="button"
            onClick={endSession}
            aria-label="End session"
            className="rounded-md p-1.5 text-faint transition-colors duration-150 ease-snap hover:bg-canvas hover:text-danger">
            
              <SquareIcon className="h-[13px] w-[13px]" />
            </button>
          </>
        }
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-3 text-[12px]">
        {state === 'running' ?
        <span className="flex min-w-0 items-center gap-2 text-muted">
            <motion.span
            className={`h-[6px] w-[6px] shrink-0 rounded-full ${meta.dot}`}
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }} />
          
            <span className="truncate text-ink">{currentApp}</span>
            {currentWebsite && <span className="truncate text-faint">{currentWebsite}</span>}
            {config?.taskName && <span className="shrink-0 truncate text-faint">· {config.taskName}</span>}
          </span> :

        <span className="h-[4px] w-[52px] rounded-full bg-line" aria-hidden="true" />
        }
      </div>

      <span className="tabular shrink-0 text-[12px] text-faint">Today {formatCompact(trackedSeconds)}</span>
    </footer>);

}