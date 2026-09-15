import React, { useState } from 'react';
import { CoffeeIcon, CrosshairIcon, PauseIcon, PlayIcon, SquareIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { CircularTimer } from '../components/ui/CircularTimer';
import { useTracking } from '../contexts/TrackingContext';
import { projects } from '../data/projects';
import { breakDurations, DEFAULT_BREAK_MINUTES, DEFAULT_FOCUS_MINUTES, focusDurations } from '../data/tracking';
import { formatClock } from '../utils/time';

const recentSessions = [
{ id: 's1', task: '044 Video 4 (Backend)', project: 'EndtoEnd_ai_bottcamp', range: '9:00 – 9:52 AM', minutes: 52 },
{ id: 's2', task: '045 Video 5 (Notebook)', project: 'EndtoEnd_ai_bottcamp', range: '10:29 – 11:16 AM', minutes: 47 },
{ id: 's3', task: 'RAG backend research', project: 'EndtoEnd_ai_bottcamp', range: '12:16 – 12:54 PM', minutes: 38 }];


const badgeTone = { idle: 'neutral', running: 'positive', paused: 'warn', breakOffer: 'break', breakDone: 'break' } as const;
const badgeLabel = {
  idle: 'Idle',
  running: 'In progress',
  paused: 'Paused',
  breakOffer: 'Break time?',
  breakDone: 'Break done'
} as const;

export function Focus() {
  const {
    phase,
    kind,
    config,
    elapsedSeconds,
    remainingSeconds,
    currentApp,
    currentWebsite,
    startFocus,
    startBreak,
    takeBreak,
    skipBreak,
    startNextFocus,
    pauseSession,
    resumeSession,
    endSession,
    endBreak
  } = useTracking();

  const [taskName, setTaskName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [minutes, setMinutes] = useState(DEFAULT_FOCUS_MINUTES);
  const [breakMinutes, setBreakMinutes] = useState(DEFAULT_BREAK_MINUTES);

  const activeProjects = projects.filter((project) => project.status === 'active');
  const project = projects.find((item) => item.id === config?.projectId);
  const canStart = taskName.trim().length > 0;

  const submitFocus = () => {
    if (!canStart) return;
    startFocus({ taskName: taskName.trim(), projectId: projectId || null, plannedSeconds: minutes * 60 });
    setTaskName('');
  };

  const progress =
  config && config.plannedSeconds > 0 && remainingSeconds !== null ? elapsedSeconds / config.plannedSeconds : null;

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<CrosshairIcon className="h-4 w-4 text-muted" />}
        title="Focus"
        actions={<Badge tone={badgeTone[phase]}>{badgeLabel[phase]}</Badge>} />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="mx-auto grid max-w-[720px] gap-4">
          <section className="rounded-xl border border-line bg-surface p-8 text-center shadow-panel">
            {phase === 'idle' &&
            <div className="mx-auto max-w-[360px] text-left">
                <p className="text-center text-[15px] font-semibold text-ink">Start a focus session</p>
                <p className="mt-1 text-center text-[12px] text-faint">
                  One task, one timer. Everything you touch gets captured automatically.
                </p>

                <label className="mb-1.5 mt-6 block text-[13px] font-medium text-ink" htmlFor="focus-task">
                  Task <span className="text-danger">*</span>
                </label>
                <input
                id="focus-task"
                value={taskName}
                onChange={(event) => setTaskName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') submitFocus();
                }}
                placeholder="What are you focusing on?"
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-[13px] text-ink placeholder:text-faint focus:border-accent focus:outline-none" />
              

                <label className="mb-1.5 mt-4 block text-[13px] font-medium text-ink" htmlFor="focus-project">
                  Project <span className="font-normal text-faint">(optional)</span>
                </label>
                <select
                id="focus-project"
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-[13px] text-ink focus:border-accent focus:outline-none">
                
                  <option value="">No project</option>
                  {activeProjects.map((item) =>
                <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                )}
                </select>

                <label className="mb-1.5 mt-4 block text-[13px] font-medium text-ink" htmlFor="focus-duration">
                  Duration
                </label>
                <select
                id="focus-duration"
                value={minutes}
                onChange={(event) => setMinutes(Number(event.target.value))}
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-[13px] text-ink focus:border-accent focus:outline-none">
                
                  {focusDurations.map((option) =>
                <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                )}
                </select>

                <button
                type="button"
                onClick={submitFocus}
                disabled={!canStart}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-accent-ink px-5 py-2.5 text-[14px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90 disabled:opacity-40">
                
                  <PlayIcon className="h-4 w-4" />
                  Start focus
                </button>
                {!canStart &&
              <p className="mt-2 text-center text-[12px] text-faint">Add a short task name to begin.</p>
              }
              </div>
            }

            {(phase === 'running' || phase === 'paused') && kind === 'focus' &&
            <div className="mx-auto max-w-[360px]">
                <CircularTimer progress={progress} tone="focus" size={248} strokeWidth={10}>
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-accent-ink">
                      {phase === 'paused' ? 'Paused' : 'Focus'}
                    </span>
                    <span className="tabular mt-1 text-[46px] font-semibold leading-none tracking-tight text-ink">
                      {remainingSeconds !== null ? formatClock(remainingSeconds) : formatClock(elapsedSeconds)}
                    </span>
                  </div>
                </CircularTimer>

                <p className="mt-5 text-[15px] font-medium text-ink">{config?.taskName}</p>
                {project &&
              <p className="mt-1 flex items-center justify-center gap-1.5 text-[12px] text-muted">
                    <span className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: project.color }} />
                    {project.name}
                  </p>
              }

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <button
                  type="button"
                  onClick={phase === 'paused' ? resumeSession : pauseSession}
                  className="flex items-center gap-2 rounded-lg bg-accent-ink px-5 py-2.5 text-[14px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
                  
                    {phase === 'paused' ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
                    {phase === 'paused' ? 'Resume' : 'Pause'}
                  </button>
                  <button
                  type="button"
                  onClick={() => takeBreak(breakMinutes * 60)}
                  className="flex items-center gap-2 rounded-lg border border-break/30 px-4 py-2.5 text-[14px] text-break-ink transition-colors duration-150 ease-snap hover:bg-break-soft">
                  
                    <CoffeeIcon className="h-4 w-4" />
                    Take a break
                  </button>
                  <button
                  type="button"
                  onClick={endSession}
                  className="flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[14px] text-muted transition-colors duration-150 ease-snap hover:text-danger">
                  
                    <SquareIcon className="h-4 w-4" />
                    End session
                  </button>
                </div>

                <p className="mt-5 text-[12px] text-faint">
                  Capturing <span className="text-muted">{currentApp}</span>
                  {currentWebsite && <span> · {currentWebsite}</span>}
                </p>
              </div>
            }

            {(phase === 'running' || phase === 'paused') && kind === 'meeting' &&
            <div className="mx-auto max-w-[360px]">
                <CircularTimer progress={null} tone="meeting" size={248} strokeWidth={10}>
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-meeting-ink">
                      {phase === 'paused' ? 'Paused' : 'Meeting'}
                    </span>
                    <span className="tabular mt-1 text-[46px] font-semibold leading-none tracking-tight text-ink">
                      {formatClock(elapsedSeconds)}
                    </span>
                  </div>
                </CircularTimer>

                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                  type="button"
                  onClick={phase === 'paused' ? resumeSession : pauseSession}
                  className="flex items-center gap-2 rounded-lg bg-meeting-ink px-5 py-2.5 text-[14px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
                  
                    {phase === 'paused' ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
                    {phase === 'paused' ? 'Resume' : 'Pause'}
                  </button>
                  <button
                  type="button"
                  onClick={endSession}
                  className="flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[14px] text-muted transition-colors duration-150 ease-snap hover:text-danger">
                  
                    <SquareIcon className="h-4 w-4" />
                    End meeting
                  </button>
                </div>
              </div>
            }

            {phase === 'breakOffer' &&
            <div className="mx-auto max-w-[360px]">
                <span className="mx-auto flex h-[44px] w-[44px] items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                  <CrosshairIcon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-[17px] font-semibold text-ink">Nice work</h2>
                <p className="mt-1 text-[13px] text-muted">
                  {config?.taskName ? `You focused on “${config.taskName}.” ` : ''}Take a short break before the next
                  one?
                </p>

                <label className="sr-only" htmlFor="break-duration">
                  Break duration
                </label>
                <select
                id="break-duration"
                value={breakMinutes}
                onChange={(event) => setBreakMinutes(Number(event.target.value))}
                className="mx-auto mt-5 block w-[160px] rounded-lg border border-line bg-canvas px-3 py-2 text-[13px] text-ink focus:border-break focus:outline-none">
                
                  {breakDurations.map((option) =>
                <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                )}
                </select>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                  type="button"
                  onClick={() => startBreak(breakMinutes * 60)}
                  className="flex items-center gap-2 rounded-lg bg-break-ink px-5 py-2.5 text-[14px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
                  
                    <CoffeeIcon className="h-4 w-4" />
                    Start break
                  </button>
                  <button
                  type="button"
                  onClick={skipBreak}
                  className="rounded-lg border border-line px-4 py-2.5 text-[14px] text-muted transition-colors duration-150 ease-snap hover:text-ink">
                  
                    Skip break
                  </button>
                </div>
              </div>
            }

            {(phase === 'running' || phase === 'paused') && kind === 'break' &&
            <div className="mx-auto max-w-[360px]">
                <CircularTimer progress={progress} tone="break" size={248} strokeWidth={10}>
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-break-ink">Break</span>
                    <span className="tabular mt-1 text-[46px] font-semibold leading-none tracking-tight text-ink">
                      {remainingSeconds !== null ? formatClock(remainingSeconds) : formatClock(elapsedSeconds)}
                    </span>
                  </div>
                </CircularTimer>

                <p className="mt-5 text-[13px] text-muted">Step away from the screen for a bit.</p>

                <div className="mt-6 flex items-center justify-center">
                  <button
                  type="button"
                  onClick={endBreak}
                  className="flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[14px] text-muted transition-colors duration-150 ease-snap hover:text-break-ink">
                  
                    <SquareIcon className="h-4 w-4" />
                    End break
                  </button>
                </div>
              </div>
            }

            {phase === 'breakDone' &&
            <div className="mx-auto max-w-[360px]">
                <span className="mx-auto flex h-[44px] w-[44px] items-center justify-center rounded-full bg-break-soft text-break-ink">
                  <CoffeeIcon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-[17px] font-semibold text-ink">Break's over</h2>
                <p className="mt-1 text-[13px] text-muted">Ready to get back into it?</p>
                <button
                type="button"
                onClick={startNextFocus}
                className="mt-5 flex items-center gap-2 rounded-lg bg-accent-ink px-5 py-2.5 text-[14px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
                
                  <CrosshairIcon className="h-4 w-4" />
                  Start next focus
                </button>
              </div>
            }
          </section>

          <Panel title="Recent sessions">
            <ul className="divide-y divide-line">
              {recentSessions.map((session) =>
              <li key={session.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-ink">{session.task}</p>
                    <p className="truncate text-[12px] text-faint">
                      {session.project} · {session.range}
                    </p>
                  </div>
                  <span className="tabular shrink-0 text-[13px] text-muted">{session.minutes} min</span>
                </li>
              )}
            </ul>
          </Panel>
        </div>
      </div>
    </div>);

}