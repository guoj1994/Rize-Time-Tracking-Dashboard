import React from 'react';
import { ActivityIcon, ChevronLeftIcon, ChevronRightIcon, MonitorIcon, SparklesIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { BarRow } from '../components/ui/BarRow';
import { Badge } from '../components/ui/Badge';
import { dayBlocks, today } from '../data/calendar';
import { useTracking } from '../contexts/TrackingContext';
import { categoryMeta, categoryOrder } from '../utils/classify';
import { formatClock, formatDuration, formatMinuteOfDay, percent } from '../utils/time';
import type { ActivityCategory } from '../types';

export function Activity() {
  const { apps, websites, liveLog, phase, kind, elapsedSeconds, currentApp, categoryFor, isOverridden, setCategory } =
  useTracking();
  const isFocusLive = phase === 'running' && kind === 'focus';

  const appTotal = apps.reduce((sum, item) => sum + item.seconds, 0);
  const siteTotal = websites.reduce((sum, item) => sum + item.seconds, 0);
  const sortedApps = [...apps].sort((a, b) => b.seconds - a.seconds);
  const sortedSites = [...websites].sort((a, b) => b.seconds - a.seconds);

  const CategorySelect = ({ id, value }: {id: string;value: ActivityCategory;}) =>
  <label className="shrink-0">
      <span className="sr-only">Category</span>
      <select
      value={value}
      onChange={(event) => setCategory(id, event.target.value as ActivityCategory)}
      className={`rounded-md border px-1.5 py-[2px] text-[11px] focus:outline-none ${categoryMeta[value].chip}`}>
      
        {categoryOrder.map((category) =>
      <option key={category} value={category}>
            {categoryMeta[category].label}
          </option>
      )}
      </select>
    </label>;


  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<ActivityIcon className="h-4 w-4 text-muted" />}
        title="Activity"
        actions={
        <>
            <div className="flex items-center gap-1">
              <button
              type="button"
              aria-label="Previous day"
              className="rounded-md border border-line bg-surface p-1.5 text-muted transition-colors duration-150 ease-snap hover:text-ink">
              
                <ChevronLeftIcon className="h-[14px] w-[14px]" />
              </button>
              <span className="px-1 text-[13px] text-muted">{today.short}</span>
              <button
              type="button"
              aria-label="Next day"
              className="rounded-md border border-line bg-surface p-1.5 text-muted transition-colors duration-150 ease-snap hover:text-ink">
              
                <ChevronRightIcon className="h-[14px] w-[14px]" />
              </button>
            </div>
            <Badge tone={isFocusLive ? 'positive' : 'neutral'}>{isFocusLive ? 'Live' : 'Paused'}</Badge>
          </>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <Panel
            title="Timeline"
            action={
            <span className="flex items-center gap-1.5 text-[12px] text-muted">
                <SparklesIcon className="h-[12px] w-[12px] text-accent" />
                Classified locally, editable
              </span>
            }>
            
            <ol className="relative border-l border-line pl-4">
              {isFocusLive &&
              <li className="relative pb-5">
                  <span className="absolute -left-[22px] top-[5px] h-[9px] w-[9px] rounded-full bg-accent ring-4 ring-accent-soft" />
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13px] font-medium text-accent-ink">In progress</p>
                    <span className="tabular text-[12px] text-accent-ink">{formatClock(elapsedSeconds)}</span>
                  </div>
                  <p className="text-[12px] text-faint">{currentApp}</p>
                </li>
              }
              {[...dayBlocks].reverse().map((block) => {
                const category = categoryFor(block.id, block.aiCategory);
                const meta = categoryMeta[category];
                return (
                  <li key={block.id} className="relative pb-5 last:pb-0">
                    <span className={`absolute -left-[20px] top-[6px] h-[7px] w-[7px] rounded-full ${meta.dot}`} />
                    <div className="flex items-center justify-between gap-3">
                      <p className={`min-w-0 flex-1 truncate text-[13px] font-medium ${meta.text}`}>{block.title}</p>
                      <CategorySelect id={block.id} value={category} />
                      <span className="tabular shrink-0 text-[12px] text-muted">{block.minutes} min</span>
                    </div>
                    <p className="truncate text-[12px] text-faint">
                      {formatMinuteOfDay(block.startMinute)} · {block.detail}
                    </p>
                    <p className="mt-0.5 text-[11px] text-faint">
                      {isOverridden(block.id) ?
                      'You set this category' :
                      `${Math.round(block.confidence * 100)}% · ${block.reason}`}
                    </p>
                  </li>);

              })}
            </ol>
          </Panel>

          <div className="grid content-start gap-4">
            <Panel title="Live capture">
              {liveLog.length === 0 ?
              <p className="py-2 text-[13px] text-faint">
                  Nothing captured yet — start a focus session and every app and site switch shows up here, already
                  classified.
                </p> :

              <ul className="divide-y divide-line">
                  {liveLog.slice(0, 6).map((entry) => {
                  const category = categoryFor(entry.id, entry.aiCategory);
                  return (
                    <li key={entry.id} className="flex items-center gap-2 py-2 first:pt-0 last:pb-0">
                        <MonitorIcon className="h-[13px] w-[13px] shrink-0 text-faint" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] text-ink">{entry.app}</span>
                          {entry.website &&
                        <span className="block truncate text-[11px] text-faint">{entry.website}</span>
                        }
                        </span>
                        <CategorySelect id={entry.id} value={category} />
                        <span className="tabular shrink-0 text-[12px] text-muted">{formatClock(entry.seconds)}</span>
                      </li>);

                })}
                </ul>
              }
            </Panel>

            <Panel title="Top apps">
              {sortedApps.map((app) =>
              <BarRow
                key={app.name}
                name={app.name}
                time={formatDuration(app.seconds)}
                percent={percent(app.seconds, appTotal)}
                nameWidth="w-[120px]" />

              )}
            </Panel>

            <Panel title="Top websites">
              {sortedSites.map((site) =>
              <BarRow
                key={site.name}
                name={site.name}
                time={formatDuration(site.seconds)}
                percent={percent(site.seconds, siteTotal)}
                nameWidth="w-[150px]" />

              )}
            </Panel>
          </div>
        </div>
      </div>
    </div>);

}