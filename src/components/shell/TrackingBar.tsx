import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, PauseIcon, PlayIcon, PowerIcon, SquareIcon } from 'lucide-react';
import { QuickStartMenu } from './QuickStartMenu';
import { useTracking } from '../../contexts/TrackingContext';
import { categoryMeta } from '../../utils/classify';
import { DEFAULT_BREAK_MINUTES } from '../../data/tracking';
import { formatClock, formatCompact } from '../../utils/time';

const runningLabel: Record<string, string> = { focus: 'Focusing', meeting: 'In a meeting', break: 'On break' };

export function TrackingBar() {
  const navigate = useNavigate();
  const {
    phase,
    kind,
    trackingEnabled,
    elapsedSeconds,
    remainingSeconds,
    trackedSeconds,
    currentApp,
    currentWebsite,
    pauseSession,
    resumeSession,
    endSession,
    endBreak,
    toggleTracking,
    startMeeting,
    startBreak
  } = useTracking();
  const [menuOpen, setMenuOpen] = useState(false);

  const active = phase === 'running' || phase === 'paused';
  const meta = kind ? categoryMeta[kind] : null;

  const statusText =
  phase === 'idle' ?
  'Idle' :
  phase === 'breakOffer' ?
  'Break time?' :
  phase === 'breakDone' ?
  'Break done' :
  phase === 'paused' ?
  'Paused' :
  runningLabel[kind ?? 'focus'];

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
          <span className="text-[14px] font-semibold text-ink">{statusText}</span>
          <span className="w-[52px] text-[8px] font-medium uppercase leading-[1.1] tracking-wide text-faint">
            Capture status
          </span>
        </div>

        {phase === 'idle' &&
        <div className="relative flex items-center">
            <button
            type="button"
            onClick={() => navigate('/focus')}
            className="flex items-center gap-2 rounded-l-lg border border-line bg-surface px-3 py-[6px] text-[13px] font-medium text-ink transition-colors duration-150 ease-snap hover:border-accent/40 hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
            
              <PlayIcon className="h-[13px] w-[13px]" />
              Start Focus
            </button>
            <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Quick start options"
            className="rounded-r-lg border border-l-0 border-line bg-surface px-1.5 py-[6px] text-muted transition-colors duration-150 ease-snap hover:border-accent/40 hover:text-accent-ink">
            
              <ChevronDownIcon className="h-[13px] w-[13px]" />
            </button>
            {menuOpen &&
          <QuickStartMenu
            onClose={() => setMenuOpen(false)}
            onFocus={() => {
              setMenuOpen(false);
              navigate('/focus');
            }}
            onMeeting={() => {
              setMenuOpen(false);
              startMeeting();
            }}
            onBreak={() => {
              setMenuOpen(false);
              startBreak(DEFAULT_BREAK_MINUTES * 60);
              navigate('/focus');
            }} />

          }
          </div>
        }

        {(phase === 'breakOffer' || phase === 'breakDone') &&
        <button
          type="button"
          onClick={() => navigate('/focus')}
          className="flex items-center gap-2 rounded-lg border border-break/30 bg-break-soft px-3 py-[6px] text-[13px] font-medium text-break-ink transition-colors duration-150 ease-snap hover:border-break/50">
          
            {phase === 'breakOffer' ? 'Take a break?' : 'Start next focus'}
          </button>
        }

        {active &&
        <>
            {kind !== 'break' &&
          <button
            type="button"
            onClick={phase === 'running' ? pauseSession : resumeSession}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-[6px] text-[13px] font-medium text-ink transition-colors duration-150 ease-snap hover:border-accent/40 hover:text-accent-ink">
            
                {phase === 'running' ? <PauseIcon className="h-[13px] w-[13px]" /> : <PlayIcon className="h-[13px] w-[13px]" />}
                {phase === 'running' ? 'Pause' : 'Resume'}
                <span className="tabular text-muted">
                  {remainingSeconds !== null ? formatClock(remainingSeconds) : formatClock(elapsedSeconds)}
                </span>
              </button>
          }
            {kind === 'break' &&
          <span className="flex items-center gap-2 rounded-lg border border-break/30 bg-break-soft px-3 py-[6px] text-[13px] font-medium text-break-ink">
                <span className="tabular">
                  {remainingSeconds !== null ? formatClock(remainingSeconds) : formatClock(elapsedSeconds)}
                </span>
              </span>
          }
            <button
            type="button"
            onClick={kind === 'break' ? endBreak : endSession}
            aria-label={kind === 'break' ? 'End break' : 'End session'}
            className="rounded-md p-1.5 text-faint transition-colors duration-150 ease-snap hover:bg-canvas hover:text-danger">
            
              <SquareIcon className="h-[13px] w-[13px]" />
            </button>
          </>
        }
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-3 text-[12px]">
        {phase === 'running' && meta ?
        <span className="flex min-w-0 items-center gap-2 text-muted">
            <motion.span
            className={`h-[6px] w-[6px] shrink-0 rounded-full ${meta.dot}`}
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }} />
          
            <span className="truncate text-ink">{currentApp}</span>
            {currentWebsite && <span className="truncate text-faint">{currentWebsite}</span>}
          </span> :

        <span className="h-[4px] w-[52px] rounded-full bg-line" aria-hidden="true" />
        }
      </div>

      <span className="tabular shrink-0 text-[12px] text-faint">Today {formatCompact(trackedSeconds)}</span>
    </footer>);

}