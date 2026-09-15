import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MusicIcon, XIcon } from 'lucide-react';
import { Segmented } from '../ui/Segmented';
import { EntityPicker } from './EntityPicker';
import { defaultConfig, useTracking } from '../../contexts/TrackingContext';
import { breakDurations, focusDurations, meetingDurations, sounds } from '../../data/tracking';
import { tasks } from '../../data/tasks';
import { projects } from '../../data/projects';
import { clients } from '../../data/clients';
import type { SessionKind } from '../../types';

const titles: Record<SessionKind, string> = {
  focus: 'Start Focus',
  meeting: 'Start Meeting',
  break: 'Start Break'
};

const statusLabels: Record<string, string> = {
  active: 'In Progress',
  todo: 'Not started',
  done: 'Done'
};

function FieldLabel({ children, hint }: {children: React.ReactNode;hint: string;}) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <span className="text-[15px] font-semibold text-ink">{children}</span>
      <span
        title={hint}
        aria-label={hint}
        className="flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent-ink">
        
        ?
      </span>
    </div>);

}

export function StartSessionModal() {
  const { launcherKind, closeLauncher, beginSession, lastCompleted } = useTracking();
  const [tab, setTab] = useState<'session' | 'advanced'>('session');
  const [minutes, setMinutes] = useState(45);
  const [goal, setGoal] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [sound, setSound] = useState('silence');
  const [autoBreak, setAutoBreak] = useState(true);
  const [blockDistractions, setBlockDistractions] = useState(false);
  const [muteNotifications, setMuteNotifications] = useState(true);

  const kind = launcherKind;

  useEffect(() => {
    if (!kind) return;
    setTab('session');
    setMinutes(kind === 'break' ? 5 : kind === 'meeting' ? 30 : 45);
    setGoal('');
    setTaskId(null);
    setProjectId(null);
    setClientId(null);
    setSound('silence');
    setAutoBreak(true);
    setBlockDistractions(false);
    setMuteNotifications(true);
  }, [kind]);

  useEffect(() => {
    if (!kind) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLauncher();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [kind, closeLauncher]);

  const taskOptions = useMemo(
    () =>
    tasks.map((task) => ({
      id: task.id,
      label: task.title,
      status: statusLabels[task.status],
      project: task.project,
      assignedToMe: true
    })),
    []
  );
  const projectOptions = useMemo(() => projects.map((p) => ({ id: p.id, label: p.name })), []);
  const clientOptions = useMemo(() => clients.map((c) => ({ id: c.id, label: c.name })), []);

  const durations = kind === 'break' ? breakDurations : kind === 'meeting' ? meetingDurations : focusDurations;
  const activeSound = sounds.find((item) => item.id === sound) ?? sounds[0];

  const submit = () => {
    if (!kind) return;
    beginSession({
      ...defaultConfig,
      kind,
      plannedSeconds: minutes * 60,
      goal,
      taskId,
      projectId,
      clientId,
      sound,
      autoBreak,
      blockDistractions,
      muteNotifications
    });
  };

  return (
    <AnimatePresence>
      {kind &&
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}>
        
          <button
          type="button"
          aria-label="Close"
          onClick={closeLauncher}
          className="absolute inset-0 cursor-default bg-[#0b0b14]/45" />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={titles[kind]}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 4 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="relative flex max-h-full w-[460px] flex-col overflow-hidden rounded-xl bg-surface shadow-pop">
          
            <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
              <h2 className="text-[17px] font-semibold text-ink">{titles[kind]}</h2>
              <button
              type="button"
              onClick={closeLauncher}
              aria-label="Close"
              className="rounded p-1 text-faint transition-colors duration-150 ease-snap hover:text-ink">
              
                <XIcon className="h-[16px] w-[16px]" />
              </button>
            </header>

            <div className="rize-scroll flex-1 overflow-y-auto px-5 py-4">
              {kind === 'break' && lastCompleted &&
            <p className="mb-4 rounded-lg border border-accent/25 bg-accent-soft/60 px-3 py-2 text-[12px] text-accent-ink">
                  {lastCompleted === 'meeting' ? 'Meeting' : 'Focus'} session finished — time to step away.
                </p>
            }

              {kind === 'focus' &&
            <div className="mb-4">
                  <Segmented
                ariaLabel="Session settings"
                size="sm"
                value={tab}
                onChange={setTab}
                options={[
                { value: 'session', label: 'Session' },
                { value: 'advanced', label: 'Advanced' }]
                } />
              
                </div>
            }

              {tab === 'advanced' && kind === 'focus' ?
            <div className="space-y-1">
                  {[
              {
                id: 'auto',
                label: 'Suggest a break when the session ends',
                detail: 'Opens the break dialog automatically',
                value: autoBreak,
                set: setAutoBreak
              },
              {
                id: 'block',
                label: 'Block distracting sites',
                detail: 'x.com, reddit.com, youtube.com',
                value: blockDistractions,
                set: setBlockDistractions
              },
              {
                id: 'mute',
                label: 'Mute notifications',
                detail: 'Turns on macOS Do Not Disturb',
                value: muteNotifications,
                set: setMuteNotifications
              }].
              map((item) =>
              <div key={item.id} className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-0">
                      <div className="min-w-0">
                        <p className="text-[13px] text-ink">{item.label}</p>
                        <p className="text-[12px] text-faint">{item.detail}</p>
                      </div>
                      <button
                  type="button"
                  role="switch"
                  aria-checked={item.value}
                  aria-label={item.label}
                  onClick={() => item.set(!item.value)}
                  className={`relative h-[20px] w-[34px] shrink-0 rounded-full transition-colors duration-150 ease-snap ${
                  item.value ? 'bg-accent' : 'bg-line'}`
                  }>
                  
                        <span
                    className={`absolute top-[2px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-150 ease-snap ${
                    item.value ? 'translate-x-[16px]' : 'translate-x-[2px]'}`
                    } />
                  
                      </button>
                    </div>
              )}
                </div> :

            <>
                  <FieldLabel hint="How long Rize runs this block before prompting you">Duration</FieldLabel>
                  {kind === 'break' &&
              <p className="mb-3 text-[13px] leading-relaxed text-muted">
                      Breaks should be free of obligations like checking email or social media. Engage in mentally
                      restful activities like walking or stretching.
                    </p>
              }
                  <label className="sr-only" htmlFor="session-duration">
                    Duration
                  </label>
                  <select
                id="session-duration"
                value={minutes}
                onChange={(event) => setMinutes(Number(event.target.value))}
                className="mb-5 w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-[13px] text-ink focus:border-accent focus:outline-none">
                
                    {durations.map((option) =>
                <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                )}
                  </select>

                  {kind !== 'break' &&
              <>
                      <FieldLabel hint="What you want to have done when this block ends">
                        {kind === 'meeting' ? 'Agenda' : 'Goal'}
                      </FieldLabel>
                      <textarea
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  rows={3}
                  placeholder={kind === 'meeting' ? 'Enter an agenda for this meeting…' : 'Enter a goal for this session…'}
                  className="mb-5 w-full resize-none rounded-lg border border-line bg-canvas px-3 py-2.5 text-[13px] text-ink placeholder:text-faint focus:border-accent focus:outline-none" />
                

                      <div className="mb-3 space-y-3">
                        {kind === 'focus' &&
                  <EntityPicker kind="task" value={taskId} onChange={setTaskId} options={taskOptions} />
                  }
                        <EntityPicker kind="project" value={projectId} onChange={setProjectId} options={projectOptions} />
                        <EntityPicker kind="client" value={clientId} onChange={setClientId} options={clientOptions} />
                      </div>
                    </>
              }

                  <FieldLabel hint="Audio that plays for the length of this block">Music</FieldLabel>
                  <div className="flex items-center gap-3 rounded-lg border border-line bg-canvas p-2">
                    <span
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md text-white"
                  style={{ backgroundColor: activeSound.tile }}>
                  
                      <MusicIcon className="h-[15px] w-[15px]" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] text-ink">{activeSound.title}</span>
                    <label className="sr-only" htmlFor="session-sound">
                      Change music
                    </label>
                    <select
                  id="session-sound"
                  value={sound}
                  onChange={(event) => setSound(event.target.value)}
                  className="shrink-0 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12px] font-medium text-ink focus:border-accent focus:outline-none">
                  
                      {sounds.map((option) =>
                  <option key={option.id} value={option.id}>
                          {option.title}
                        </option>
                  )}
                    </select>
                  </div>
                </>
            }
            </div>

            <footer className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
              <button
              type="button"
              onClick={closeLauncher}
              className="rounded-lg border border-line px-4 py-2 text-[13px] font-medium text-ink transition-colors duration-150 ease-snap hover:bg-canvas">
              
                Cancel
              </button>
              <button
              type="button"
              onClick={submit}
              className="rounded-lg bg-accent-ink px-4 py-2 text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
              
                {titles[kind]}
              </button>
            </footer>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}