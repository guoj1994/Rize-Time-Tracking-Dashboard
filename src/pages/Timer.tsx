import React from 'react';
import { CoffeeIcon, CrosshairIcon, PauseIcon, PlayIcon, SquareIcon, TimerIcon, UsersIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Donut } from '../components/ui/Donut';
import { Badge } from '../components/ui/Badge';
import { useTracking } from '../contexts/TrackingContext';
import { projects } from '../data/projects';
import { tasks } from '../data/tasks';
import { clients } from '../data/clients';
import { formatClock, formatCompact, formatDuration, percent } from '../utils/time';

const pastSessions = [
{ id: 's1', label: '044 Video 4 (Backend)', range: '9:00 – 9:52 AM', minutes: 52, kind: 'Focus' },
{ id: 's2', label: 'Bootcamp standup', range: '10:03 – 10:29 AM', minutes: 26, kind: 'Meeting' },
{ id: 's3', label: '045 Video 5 (Notebook)', range: '10:29 – 11:16 AM', minutes: 47, kind: 'Focus' },
{ id: 's4', label: 'Lunch', range: '11:42 AM – 12:16 PM', minutes: 34, kind: 'Break' },
{ id: 's5', label: 'RAG backend research', range: '12:16 – 12:54 PM', minutes: 38, kind: 'Focus' }];


export function Timer() {
  const {
    state,
    sessionKind,
    config,
    sessionSeconds,
    remainingSeconds,
    trackedSeconds,
    focusSeconds,
    breakSeconds,
    targetSeconds,
    currentApp,
    currentWebsite,
    openLauncher,
    pauseSession,
    resumeSession,
    endSession
  } = useTracking();

  const idle = state === 'locked';
  const running = state === 'running' || state === 'break';
  const task = tasks.find((item) => item.id === config?.taskId);
  const project = projects.find((item) => item.id === config?.projectId);
  const client = clients.find((item) => item.id === config?.clientId);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<TimerIcon className="h-4 w-4 text-muted" />}
        title="Timer"
        actions={
        <Badge tone={state === 'break' ? 'warn' : running ? 'positive' : 'neutral'}>
            {state === 'break' ? 'On break' : running ? 'Session active' : 'Idle'}
          </Badge>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-xl border border-line bg-surface p-8 shadow-panel">
            <p className="text-[12px] uppercase tracking-wide text-faint">
              {state === 'break' ?
              'Break' :
              state === 'paused' ?
              'Paused' :
              sessionKind === 'meeting' ?
              'Meeting' :
              sessionKind === 'focus' ?
              'Focus' :
              'Ready to start'}
            </p>
            <p className="tabular mt-2 text-[62px] font-semibold leading-none tracking-tight text-ink">
              {remainingSeconds !== null ? formatClock(remainingSeconds) : formatClock(sessionSeconds)}
            </p>
            {remainingSeconds !== null && !idle &&
            <p className="tabular mt-1 text-[12px] text-faint">
                {formatClock(sessionSeconds)} elapsed of {formatDuration(config?.plannedSeconds ?? 0)}
              </p>
            }

            {config?.goal && !idle &&
            <p className="mt-4 rounded-lg border border-line bg-canvas px-3 py-2 text-[13px] text-ink">
                {config.goal}
              </p>
            }

            <p className="mt-3 text-[13px] text-muted">
              {state === 'running' ?
              <>
                  Tracking <span className="text-ink">{currentApp}</span>
                  {currentWebsite && <span className="text-faint"> · {currentWebsite}</span>}
                </> :
              state === 'break' ?
              'Step away from the screen — Rize keeps the clock and skips app capture.' :

              'Rize keeps tracking apps and websites automatically. A session adds the goal, task, and category.'
              }
            </p>

            {!idle && (task || project || client) &&
            <div className="mt-4 flex flex-wrap gap-2">
                {task && <Badge tone="accent">{task.title}</Badge>}
                {project && <Badge>{project.name}</Badge>}
                {client && <Badge>{client.name}</Badge>}
              </div>
            }

            <div className="mt-7 flex flex-wrap items-center gap-2">
              {idle ?
              <>
                  <button
                  type="button"
                  onClick={() => openLauncher('focus')}
                  className="flex items-center gap-2 rounded-lg bg-accent-ink px-5 py-2.5 text-[14px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
                  
                    <CrosshairIcon className="h-4 w-4" />
                    Start focus
                    <span className="text-[12px] opacity-70">⌘F</span>
                  </button>
                  <button
                  type="button"
                  onClick={() => openLauncher('meeting')}
                  className="flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[14px] text-ink transition-colors duration-150 ease-snap hover:border-accent/40">
                  
                    <UsersIcon className="h-4 w-4" />
                    Meeting
                    <span className="text-[12px] text-faint">⌘M</span>
                  </button>
                </> :

              <button
                type="button"
                onClick={state === 'paused' ? resumeSession : pauseSession}
                className="flex items-center gap-2 rounded-lg bg-accent-ink px-5 py-2.5 text-[14px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
                
                  {state === 'paused' ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
                  {state === 'paused' ? 'Resume' : 'Pause'}
                </button>
              }

              <button
                type="button"
                onClick={() => openLauncher('break')}
                className="flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[14px] text-ink transition-colors duration-150 ease-snap hover:border-accent/40">
                
                <CoffeeIcon className="h-4 w-4" />
                Take a break
                <span className="text-[12px] text-faint">⌘B</span>
              </button>

              {!idle &&
              <button
                type="button"
                onClick={endSession}
                className="flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[14px] text-muted transition-colors duration-150 ease-snap hover:text-danger">
                
                  <SquareIcon className="h-4 w-4" />
                  End
                </button>
              }
            </div>
          </section>

          <div className="grid gap-4">
            <Panel title="Day target">
              <div className="flex items-center gap-4">
                <Donut
                  size={120}
                  thickness={13}
                  total={formatCompact(trackedSeconds)}
                  segments={[
                  { value: focusSeconds, color: '#5a4ed6' },
                  { value: Math.max(0, trackedSeconds - focusSeconds), color: '#8fbf7a' }]
                  } />
                
                <dl className="space-y-2 text-[13px]">
                  <div>
                    <dt className="text-[12px] text-muted">Percent of target</dt>
                    <dd className="tabular font-semibold text-warn">{percent(trackedSeconds, targetSeconds)}%</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-muted">Focus</dt>
                    <dd className="tabular font-semibold text-ink">{formatDuration(focusSeconds)}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-muted">Breaks</dt>
                    <dd className="tabular font-semibold text-ink">{formatDuration(breakSeconds)}</dd>
                  </div>
                </dl>
              </div>
            </Panel>

            <Panel title="Today's sessions">
              <ul className="divide-y divide-line">
                {!idle &&
                <li className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-accent-ink">
                        {config?.goal || (sessionKind ? `${sessionKind} session` : 'Current session')}
                      </p>
                      <p className="truncate text-[12px] text-faint">{currentApp}</p>
                    </div>
                    <span className="tabular text-[13px] text-accent-ink">{formatClock(sessionSeconds)}</span>
                  </li>
                }
                {pastSessions.map((session) =>
                <li key={session.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] text-ink">{session.label}</p>
                      <p className="truncate text-[12px] text-faint">
                        {session.kind} · {session.range}
                      </p>
                    </div>
                    <span className="tabular text-[13px] text-muted">{session.minutes} min</span>
                  </li>
                )}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </div>);

}