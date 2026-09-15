import React, { useState } from 'react';
import { ArrowUpIcon, CircleIcon, SparklesIcon, ZapIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { MetricRow } from '../components/ui/Metric';
import { BarRow } from '../components/ui/BarRow';
import { Badge } from '../components/ui/Badge';
import { useTracking } from '../contexts/TrackingContext';
import { formatDuration, percent } from '../utils/time';

const suggestions = [
'Where did my focus time go today?',
'Which client work is unbilled?',
'Summarize my week vs last week',
'Draft a status update for Northwind'];


const automations = [
{ id: 'au1', name: 'Daily summary at 8:00 PM', detail: 'Generates a report and emails it to you', on: true },
{ id: 'au2', name: 'Auto-tag Cursor as Deep Work', detail: 'Applies the Deep Work label on every session', on: true },
{ id: 'au3', name: 'Nudge after 90 min without a break', detail: 'Sends a desktop notification', on: false }];


export function Agent() {
  const { trackedSeconds, focusSeconds, sessions, targetSeconds, apps, state } = useTracking();
  const [draft, setDraft] = useState('');
  const [enabled, setEnabled] = useState(() => automations.filter((item) => item.on).map((item) => item.id));

  const topApps = [...apps].sort((a, b) => b.seconds - a.seconds).slice(0, 4);
  const appTotal = apps.reduce((sum, app) => sum + app.seconds, 0);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<CircleIcon className="h-4 w-4 fill-accent text-accent" />}
        title="Agent"
        actions={<Badge tone="accent">500 AI credits left</Badge>} />
      

      <div className="rize-scroll flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[780px] px-6 py-10">
          <h1 className="text-[26px] font-semibold tracking-tight text-ink">Good evening, xijie</h1>
          <p className="mt-1.5 text-[14px] text-muted">
            {state === 'running' ?
            `You're ${formatDuration(trackedSeconds)} into the day and tracking right now.` :
            `You've tracked ${formatDuration(trackedSeconds)} today across ${sessions} sessions.`}
          </p>

          <form
            className="mt-6 rounded-xl border border-line bg-surface shadow-panel transition-colors duration-150 ease-snap focus-within:border-accent/50"
            onSubmit={(event) => {
              event.preventDefault();
              setDraft('');
            }}>
            
            <label htmlFor="agent-prompt" className="sr-only">
              Ask the Rize agent about your time
            </label>
            <textarea
              id="agent-prompt"
              rows={3}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about your time, or tell the agent what to do…"
              className="w-full resize-none bg-transparent px-4 pt-3.5 text-[14px] text-ink placeholder:text-faint focus:outline-none" />
            
            <div className="flex items-center justify-between px-3 pb-3">
              <span className="flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-[11px] text-muted">
                <SparklesIcon className="h-3 w-3" />
                Rize Agent
              </span>
              <button
                type="submit"
                disabled={draft.trim().length === 0}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-ink text-white transition-opacity duration-150 ease-snap hover:opacity-90 disabled:opacity-30"
                aria-label="Send to agent">
                
                <ArrowUpIcon className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((item) =>
            <button
              key={item}
              type="button"
              onClick={() => setDraft(item)}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-muted transition-colors duration-150 ease-snap hover:border-accent/40 hover:text-ink">
              
                {item}
              </button>
            )}
          </div>

          <div className="mt-8 grid gap-4">
            <Panel title="Today so far">
              <MetricRow
                items={[
                { label: 'Tracked', value: formatDuration(trackedSeconds) },
                {
                  label: 'Percent of target',
                  value: `${percent(trackedSeconds, targetSeconds)}%`,
                  hint: formatDuration(targetSeconds),
                  tone: 'warn'
                },
                { label: 'Focus', value: formatDuration(focusSeconds) },
                { label: 'Sessions', value: sessions }]
                } />
              
              <div className="mt-5 border-t border-line pt-3">
                {topApps.map((app) =>
                <BarRow
                  key={app.name}
                  name={app.name}
                  time={formatDuration(app.seconds)}
                  percent={percent(app.seconds, appTotal)} />

                )}
              </div>
            </Panel>

            <Panel title="Automations" icon={<ZapIcon className="h-[13px] w-[13px] text-faint" />}>
              <ul className="divide-y divide-line">
                {automations.map((item) => {
                  const on = enabled.includes(item.id);
                  return (
                    <li key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] text-ink">{item.name}</p>
                        <p className="truncate text-[12px] text-faint">{item.detail}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        aria-label={item.name}
                        onClick={() =>
                        setEnabled((current) =>
                        current.includes(item.id) ?
                        current.filter((id) => id !== item.id) :
                        [...current, item.id]
                        )
                        }
                        className={`relative h-[20px] w-[34px] shrink-0 rounded-full transition-colors duration-150 ease-snap ${
                        on ? 'bg-accent' : 'bg-line'}`
                        }>
                        
                        <span
                          className={`absolute top-[2px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-150 ease-snap ${
                          on ? 'translate-x-[16px]' : 'translate-x-[2px]'}`
                          } />
                        
                      </button>
                    </li>);

                })}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </div>);

}