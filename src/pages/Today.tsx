import React, { useEffect, useMemo, useState } from 'react';
import { CalendarCheckIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { dayBlocks, today } from '../data/calendar';
import { useTracking } from '../contexts/TrackingContext';
import { categoryMeta, categoryOrder } from '../utils/classify';
import { formatClock, formatMinuteOfDay, formatMinutes } from '../utils/time';
import type { ActivityCategory } from '../types';

const START_HOUR = 6;
const END_HOUR = 22;
const HOUR_HEIGHT = 52;
const LOW_CONFIDENCE = 0.7;

function offsetFor(minute: number) {
  return (minute - START_HOUR * 60) / 60 * HOUR_HEIGHT;
}

export function Today() {
  const { state, sessionSeconds, categoryFor, isOverridden, setCategory } = useTracking();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nowMinute, setNowMinute] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = new Date();
      setNowMinute(now.getHours() * 60 + now.getMinutes());
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, index) => START_HOUR + index);
  const clampedNow = Math.min(Math.max(nowMinute, START_HOUR * 60), END_HOUR * 60);
  const liveMinutes = Math.max(1, Math.round(sessionSeconds / 60));
  const isLive = state === 'running';

  const resolved = useMemo(
    () => dayBlocks.map((block) => ({ ...block, category: categoryFor(block.id, block.aiCategory) })),
    [categoryFor]
  );

  const totals = useMemo(() => {
    const map: Record<ActivityCategory, number> = { focus: 0, meeting: 0, break: 0, other: 0 };
    resolved.forEach((block) => {
      map[block.category] += block.minutes;
    });
    if (isLive) map.focus += liveMinutes;
    return map;
  }, [resolved, isLive, liveMinutes]);

  const totalMinutes = categoryOrder.reduce((sum, key) => sum + totals[key], 0) || 1;
  const needsReview = resolved.filter((block) => block.confidence < LOW_CONFIDENCE && !isOverridden(block.id));
  const selected = resolved.find((block) => block.id === selectedId) ?? null;

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<CalendarCheckIcon className="h-4 w-4 text-muted" />}
        title="Today"
        actions={
        <>
            <div className="flex items-center gap-1">
              <button
              type="button"
              aria-label="Previous day"
              className="rounded-md border border-line bg-surface p-1.5 text-muted transition-colors duration-150 ease-snap hover:text-ink">
              
                <ChevronLeftIcon className="h-[14px] w-[14px]" />
              </button>
              <span className="px-1 text-[13px] text-ink">{today.short}</span>
              <button
              type="button"
              aria-label="Next day"
              className="rounded-md border border-line bg-surface p-1.5 text-muted transition-colors duration-150 ease-snap hover:text-ink">
              
                <ChevronRightIcon className="h-[14px] w-[14px]" />
              </button>
            </div>
            <Badge tone="accent">Today</Badge>
          </>
        } />
      

      <div className="flex min-h-0 flex-1">
        <div className="rize-scroll min-w-0 flex-1 overflow-y-auto">
          <div className="flex" style={{ height: (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT }}>
            <div className="w-[58px] shrink-0">
              {hours.map((hour) =>
              <div key={hour} className="relative" style={{ height: HOUR_HEIGHT }}>
                  <span className="absolute -top-[6px] right-2 text-[11px] text-faint">
                    {hour % 12 === 0 ? 12 : hour % 12}
                    {hour >= 12 ? ' PM' : ' AM'}
                  </span>
                </div>
              )}
            </div>

            <div className="relative flex-1 border-l border-line">
              <div className="pointer-events-none absolute inset-0">
                {hours.map((hour) =>
                <div key={hour} className="border-t border-line" style={{ height: HOUR_HEIGHT }} />
                )}
              </div>

              {resolved.map((block) => {
                const meta = categoryMeta[block.category];
                const uncertain = block.confidence < LOW_CONFIDENCE && !isOverridden(block.id);
                const active = block.id === selectedId;
                return (
                  <button
                    key={block.id}
                    type="button"
                    onClick={() => setSelectedId(block.id)}
                    className={`absolute left-2 right-4 overflow-hidden rounded-md border px-2.5 py-1 text-left transition-transform duration-150 ease-snap hover:-translate-y-[1px] ${meta.block} ${
                    uncertain ? 'border-dashed' : ''} ${
                    active ? 'ring-2 ring-accent/50' : ''}`}
                    style={{ top: offsetFor(block.startMinute), height: block.minutes / 60 * HOUR_HEIGHT - 3 }}>
                    
                    <span className={`flex items-center gap-2 text-[12px] font-medium ${meta.text}`}>
                      <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${meta.dot}`} />
                      <span className="truncate">{block.title}</span>
                      <span className="tabular shrink-0 text-[11px] opacity-70">{block.minutes}m</span>
                      {uncertain && <span className="shrink-0 text-[11px] text-warn">needs review</span>}
                    </span>
                    <span className="block truncate text-[11px] text-muted">{block.detail}</span>
                  </button>);

              })}

              {isLive &&
              <div
                className={`absolute left-2 right-4 overflow-hidden rounded-md border-2 px-2.5 py-1 ${categoryMeta.focus.block}`}
                style={{
                  top: offsetFor(clampedNow - liveMinutes),
                  height: Math.max(20, liveMinutes / 60 * HOUR_HEIGHT)
                }}>
                
                  <span className={`flex items-center gap-2 text-[12px] font-medium ${categoryMeta.focus.text}`}>
                    <span className={`h-[7px] w-[7px] rounded-full ${categoryMeta.focus.dot}`} />
                    Focus · in progress
                    <span className="tabular opacity-70">{formatClock(sessionSeconds)}</span>
                  </span>
                </div>
              }

              <div
                className="pointer-events-none absolute left-0 right-0 flex items-center"
                style={{ top: offsetFor(clampedNow) }}>
                
                <span className="h-[7px] w-[7px] -translate-x-[3px] rounded-full bg-danger" />
                <span className="h-[1px] flex-1 bg-danger" />
                <span className="tabular rounded bg-danger px-1 text-[10px] font-medium text-white">
                  {formatMinuteOfDay(clampedNow)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <aside className="rize-scroll w-[320px] shrink-0 overflow-y-auto border-l border-line bg-surface">
          {selected ?
          <div className="p-4">
              <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="mb-3 text-[12px] text-muted transition-colors duration-150 ease-snap hover:text-ink">
              
                ← Day summary
              </button>
              <h2 className="text-[15px] font-semibold text-ink">{selected.title}</h2>
              <p className="mt-1 text-[12px] text-muted">
                {formatMinuteOfDay(selected.startMinute)} – {formatMinuteOfDay(selected.startMinute + selected.minutes)}{' '}
                · {selected.minutes} min
              </p>
              <p className="mt-0.5 text-[12px] text-faint">{selected.detail}</p>

              <div className="mt-4 rounded-lg border border-line bg-canvas p-3">
                <p className="flex items-center gap-1.5 text-[12px] font-medium text-accent-ink">
                  <SparklesIcon className="h-[13px] w-[13px]" />
                  AI classification
                </p>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="text-[15px] font-semibold text-ink">
                    {categoryMeta[selected.aiCategory].label}
                  </span>
                  <span className="tabular text-[12px] text-muted">
                    {Math.round(selected.confidence * 100)}% confident
                  </span>
                </p>
                <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-line">
                  <div
                  className={`h-full rounded-full ${selected.confidence < LOW_CONFIDENCE ? 'bg-warn' : 'bg-accent'}`}
                  style={{ width: `${Math.round(selected.confidence * 100)}%` }} />
                
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.reason}</p>
              </div>

              <p className="mt-4 text-[12px] font-medium text-ink">Category</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {categoryOrder.map((category) => {
                const meta = categoryMeta[category];
                const active = selected.category === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setCategory(selected.id, category)}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[13px] transition-colors duration-150 ease-snap ${
                    active ? `${meta.chip} font-medium` : 'border-line text-muted hover:text-ink'}`
                    }>
                    
                      <span className={`h-[8px] w-[8px] rounded-full ${meta.dot}`} />
                      {meta.label}
                    </button>);

              })}
              </div>
              {isOverridden(selected.id) &&
            <p className="mt-3 text-[12px] text-faint">
                  You corrected this one — it stays this way and won't be re-guessed.
                </p>
            }
            </div> :

          <div className="p-4">
              <h2 className="text-[15px] font-semibold text-ink">{today.weekday}</h2>
              <p className="text-[12px] text-muted">{today.label}</p>

              <div className="mt-4 flex h-[8px] overflow-hidden rounded-full bg-line">
                {categoryOrder.map((category) =>
              <div
                key={category}
                className={categoryMeta[category].dot}
                style={{ width: `${totals[category] / totalMinutes * 100}%` }} />

              )}
              </div>
              <ul className="mt-3 space-y-2">
                {categoryOrder.map((category) =>
              <li key={category} className="flex items-center gap-2 text-[13px]">
                    <span className={`h-[8px] w-[8px] shrink-0 rounded-full ${categoryMeta[category].dot}`} />
                    <span className="flex-1 text-ink">{categoryMeta[category].label}</span>
                    <span className="tabular text-muted">{formatMinutes(totals[category])}</span>
                  </li>
              )}
              </ul>

              <div className="mt-6">
                <p className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
                  <SparklesIcon className="h-[13px] w-[13px] text-accent" />
                  Needs review
                  <span className="text-faint">({needsReview.length})</span>
                </p>
                {needsReview.length === 0 ?
              <p className="mt-2 text-[12px] text-faint">
                    Every block today was classified with high confidence.
                  </p> :

              <ul className="mt-2 space-y-2">
                    {needsReview.map((block) =>
                <li key={block.id} className="rounded-lg border border-line p-2.5">
                        <p className="truncate text-[13px] text-ink">{block.title}</p>
                        <p className="mt-0.5 text-[12px] text-faint">
                          Guessed {categoryMeta[block.aiCategory].label} · {Math.round(block.confidence * 100)}%
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {categoryOrder.map((category) =>
                    <button
                      key={category}
                      type="button"
                      onClick={() => setCategory(block.id, category)}
                      className={`rounded-md border px-2 py-1 text-[11px] transition-colors duration-150 ease-snap ${
                      block.aiCategory === category ?
                      categoryMeta[category].chip :
                      'border-line text-muted hover:text-ink'}`
                      }>
                      
                              {categoryMeta[category].label}
                            </button>
                    )}
                        </div>
                      </li>
                )}
                  </ul>
              }
              </div>
            </div>
          }
        </aside>
      </div>
    </div>);

}