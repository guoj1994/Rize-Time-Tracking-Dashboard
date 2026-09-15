import React, { useEffect, useState } from 'react';
import { CheckCircle2Icon, CrosshairIcon, PauseIcon, PlayIcon, SquareIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { useTracking } from '../contexts/TrackingContext';
import { projects } from '../data/projects';
import { focusDurations } from '../data/tracking';
import { formatClock, formatDuration } from '../utils/time';

const recentSessions = [
{ id: 's1', task: '044 Video 4 (Backend)', project: 'EndtoEnd_ai_bottcamp', range: '9:00 – 9:52 AM', minutes: 52 },
{ id: 's2', task: '045 Video 5 (Notebook)', project: 'EndtoEnd_ai_bottcamp', range: '10:29 – 11:16 AM', minutes: 47 },
{ id: 's3', task: 'RAG backend research', project: 'EndtoEnd_ai_bottcamp', range: '12:16 – 12:54 PM', minutes: 38 }];


export function Focus() {
  const {
    state,
    config,
    sessionSeconds,
    remainingSeconds,
    justCompleted,
    currentApp,
    currentWebsite,
    startFocus,
    pauseSession,
    resumeSession,
    endSession,
    dismissCompletion
  } = useTracking();

  const [taskName, setTaskName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [minutes, setMinutes] = useState(45);

  const idle = state === 'idle';
  const activeProjects = projects.filter((project) => project.status === 'active');
  const project = projects.find((item) => item.id === (config?.projectId ?? projectId));
  const canStart = taskName.trim().length > 0;

  useEffect(() => {
    if (justCompleted) {
      const timeout = window.setTimeout(dismissCompletion, 8000);
      return () => window.clearTimeout(timeout);
    }
  }, [justCompleted, dismissCompletion]);

  const submit = () => {
    if (!canStart) return;
    startFocus({ taskName: taskName.trim(), projectId: projectId || null, plannedSeconds: minutes * 60 });
    setTaskName('');
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<CrosshairIcon className="h-4 w-4 text-muted" />}
        title="Focus"
        actions={
        <Badge tone={state === 'running' ? 'positive' : state === 'paused' ? 'warn' : 'neutral'}>
            {state === 'running' ? 'In progress' : state === 'paused' ? 'Paused' : 'Idle'}
          </Badge>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="mx-auto grid max-w-[720px] gap-4">
          <section className="rounded-xl border border-line bg-surface p-8 text-center shadow-panel">
            {justCompleted && idle ?
            <div className="mx-auto max-w-[360px]">
                <span className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                  <CheckCircle2Icon className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-[19px] font-semibold text-ink">Session complete</h2>
                <p className="mt-1 text-[13px] text-muted">
                  {config?.taskName ? `“${config.taskName}” — ` : ''}
                  nice work. Take a short break before the next one.
                </p>
                <button
                type="button"
                onClick={dismissCompletion}
                className="mt-5 rounded-lg border border-line px-4 py-2 text-[13px] text-ink transition-colors duration-150 ease-snap hover:border-accent/40">
                
                  Start another
                </button>
              </div> :
            idle ?
            <div className="mx-auto max-w-[360px] text-left">
                <p className="text-center text-[12px] uppercase tracking-wide text-faint">Ready to start</p>
                <p className="tabular mt-2 text-center text-[52px] font-semibold leading-none tracking-tight text-ink">
                  {formatDuration(minutes * 60)}
                </p>

                <label className="mb-1.5 mt-6 block text-[13px] font-medium text-ink" htmlFor="focus-task">
                  Task <span className="text-danger">*</span>
                </label>
                <input
                id="focus-task"
                value={taskName}
                onChange={(event) => setTaskName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') submit();
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
                onClick={submit}
                disabled={!canStart}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-accent-ink px-5 py-2.5 text-[14px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90 disabled:opacity-40">
                
                  <PlayIcon className="h-4 w-4" />
                  Start focus
                </button>
                {!canStart &&
              <p className="mt-2 text-center text-[12px] text-faint">Add a short task name to begin.</p>
              }
              </div> :

            <div className="mx-auto max-w-[360px]">
                <p className="text-[12px] uppercase tracking-wide text-faint">
                  {state === 'paused' ? 'Paused' : 'Focusing'}
                </p>
                <p className="tabular mt-2 text-[62px] font-semibold leading-none tracking-tight text-ink">
                  {remainingSeconds !== null ? formatClock(remainingSeconds) : formatClock(sessionSeconds)}
                </p>
                {remainingSeconds !== null &&
              <p className="tabular mt-1 text-[12px] text-faint">
                    {formatClock(sessionSeconds)} elapsed of {formatDuration(config?.plannedSeconds ?? 0)}
                  </p>
              }

                <p className="mt-4 rounded-lg border border-line bg-canvas px-3 py-2 text-[14px] font-medium text-ink">
                  {config?.taskName}
                </p>
                {project &&
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-muted">
                    <span className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: project.color }} />
                    {project.name}
                  </p>
              }

                <p className="mt-4 text-[13px] text-muted">
                  Capturing <span className="text-ink">{currentApp}</span>
                  {currentWebsite && <span className="text-faint"> · {currentWebsite}</span>}
                </p>

                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                  type="button"
                  onClick={state === 'paused' ? resumeSession : pauseSession}
                  className="flex items-center gap-2 rounded-lg bg-accent-ink px-5 py-2.5 text-[14px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
                  
                    {state === 'paused' ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
                    {state === 'paused' ? 'Resume' : 'Pause'}
                  </button>
                  <button
                  type="button"
                  onClick={endSession}
                  className="flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[14px] text-muted transition-colors duration-150 ease-snap hover:text-danger">
                  
                    <SquareIcon className="h-4 w-4" />
                    End
                  </button>
                </div>
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