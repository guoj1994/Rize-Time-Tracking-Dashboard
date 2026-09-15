import React, { useState } from 'react';
import { ListChecksIcon, PlayIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { tasks as seedTasks } from '../data/tasks';
import { useTracking } from '../contexts/TrackingContext';
import { formatMinutes, percent } from '../utils/time';
import type { Task } from '../types';

const groups: {status: Task['status'];label: string;}[] = [
{ status: 'active', label: 'In progress' },
{ status: 'todo', label: 'Up next' },
{ status: 'done', label: 'Done' }];


export function Tasks() {
  const [tasks, setTasks] = useState(seedTasks);
  const { openLauncher } = useTracking();

  const toggle = (id: string) =>
  setTasks((current) =>
  current.map((task) =>
  task.id === id ? { ...task, status: task.status === 'done' ? 'active' : 'done' } : task
  )
  );

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<ListChecksIcon className="h-4 w-4 text-muted" />}
        title="Tasks"
        actions={
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-accent-ink px-3 py-[7px] text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
          
            <PlusIcon className="h-[14px] w-[14px]" />
            New task
          </button>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="mx-auto max-w-[860px] space-y-6">
          {groups.map((group) => {
            const groupTasks = tasks.filter((task) => task.status === group.status);
            if (groupTasks.length === 0) return null;
            return (
              <section key={group.status}>
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="text-[13px] font-semibold text-ink">{group.label}</h2>
                  <span className="text-[12px] text-muted">{groupTasks.length}</span>
                </div>
                <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
                  {groupTasks.map((task) =>
                  <li
                    key={task.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors duration-150 ease-snap hover:bg-canvas">
                    
                      <label className="flex min-w-[240px] flex-1 items-center gap-3">
                        <input
                        type="checkbox"
                        checked={task.status === 'done'}
                        onChange={() => toggle(task.id)}
                        className="h-[15px] w-[15px] shrink-0 rounded border-line accent-[rgb(var(--accent))]" />
                      
                        <span className="min-w-0">
                          <span
                          className={`block truncate text-[13px] ${
                          task.status === 'done' ? 'text-faint line-through' : 'font-medium text-ink'}`
                          }>
                          
                            {task.title}
                          </span>
                          <span className="block truncate text-[12px] text-faint">{task.project}</span>
                        </span>
                      </label>

                      <div className="w-[150px]">
                        <div className="h-[5px] overflow-hidden rounded-full bg-accent-soft">
                          <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${Math.min(100, percent(task.minutes, task.estimateMinutes))}%` }} />
                        
                        </div>
                        <p className="tabular mt-1 text-[11px] text-faint">
                          {formatMinutes(task.minutes)} / {formatMinutes(task.estimateMinutes)}
                        </p>
                      </div>

                      <Badge tone={task.due === 'Today' ? 'warn' : 'neutral'}>{task.due}</Badge>

                      {task.status !== 'done' &&
                    <button
                      type="button"
                      onClick={() => openLauncher('focus')}
                      className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[12px] text-muted transition-colors duration-150 ease-snap hover:border-accent/40 hover:text-accent-ink">
                      
                          <PlayIcon className="h-[12px] w-[12px]" />
                          Track
                        </button>
                    }
                    </li>
                  )}
                </ul>
              </section>);

          })}
        </div>
      </div>
    </div>);

}