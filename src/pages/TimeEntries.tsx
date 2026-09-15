import React, { useMemo, useState } from 'react';
import { ClockIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { entryLabels, timeEntries } from '../data/timeEntries';
import { formatMinutes } from '../utils/time';

const sourceTone: Record<string, 'neutral' | 'accent' | 'info'> = {
  auto: 'accent',
  timer: 'info',
  manual: 'neutral'
};

export function TimeEntries() {
  const [query, setQuery] = useState('');
  const [label, setLabel] = useState('All labels');

  const filtered = useMemo(
    () =>
    timeEntries.filter((entry) => {
      const matchesQuery =
      query.trim().length === 0 ||
      `${entry.title} ${entry.project} ${entry.client}`.toLowerCase().includes(query.toLowerCase());
      const matchesLabel = label === 'All labels' || entry.label === label;
      return matchesQuery && matchesLabel;
    }),
    [query, label]
  );

  const days = useMemo(() => {
    const map = new Map<string, typeof timeEntries>();
    filtered.forEach((entry) => {
      map.set(entry.day, [...(map.get(entry.day) ?? []), entry]);
    });
    return [...map.entries()];
  }, [filtered]);

  const total = filtered.reduce((sum, entry) => sum + entry.minutes, 0);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<ClockIcon className="h-4 w-4 text-muted" />}
        title="Time Entries"
        actions={
        <>
            <label className="relative">
              <span className="sr-only">Search time entries</span>
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-faint" />
              <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="w-[180px] rounded-lg border border-line bg-surface py-[7px] pl-8 pr-3 text-[13px] text-ink placeholder:text-faint focus:border-accent focus:outline-none" />
            
            </label>
            <label className="sr-only" htmlFor="entry-label">
              Filter by label
            </label>
            <select
            id="entry-label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="rounded-lg border border-line bg-surface px-2.5 py-[7px] text-[13px] text-muted focus:border-accent focus:outline-none">
            
              {['All labels', ...entryLabels].map((option) =>
            <option key={option}>{option}</option>
            )}
            </select>
            <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-accent-ink px-3 py-[7px] text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
            
              <PlusIcon className="h-[14px] w-[14px]" />
              New entry
            </button>
          </>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="mb-4 flex items-baseline gap-3">
          <p className="text-[19px] font-semibold text-ink">{formatMinutes(total)}</p>
          <p className="text-[13px] text-muted">
            {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>

        {days.length === 0 ?
        <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-[14px] font-medium text-ink">No entries match that filter</p>
            <p className="mt-1 text-[13px] text-muted">Try clearing the search or picking a different label.</p>
          </div> :

        <div className="space-y-5">
            {days.map(([day, entries]) =>
          <section key={day}>
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="text-[13px] font-semibold text-ink">{day}</h2>
                  <span className="tabular text-[12px] text-muted">
                    {formatMinutes(entries.reduce((sum, entry) => sum + entry.minutes, 0))}
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
                  <table className="w-full text-[13px]">
                    <caption className="sr-only">Time entries for {day}</caption>
                    <tbody className="divide-y divide-line">
                      {entries.map((entry) =>
                  <tr key={entry.id} className="transition-colors duration-150 ease-snap hover:bg-canvas">
                          <td className="w-[72px] py-2.5 pl-4 pr-2 text-muted">{entry.start}</td>
                          <td className="py-2.5 pr-2">
                            <p className="truncate font-medium text-ink">{entry.title}</p>
                            <p className="truncate text-[12px] text-faint">
                              {entry.project} · {entry.client}
                            </p>
                          </td>
                          <td className="hidden py-2.5 pr-2 md:table-cell">
                            <Badge>{entry.label}</Badge>
                          </td>
                          <td className="hidden py-2.5 pr-2 lg:table-cell">
                            <Badge tone={sourceTone[entry.source]}>{entry.source}</Badge>
                          </td>
                          <td className="py-2.5 pr-2 text-right">
                            {entry.billable ?
                      <Badge tone="positive">Billable</Badge> :

                      <span className="text-[12px] text-faint">Non-billable</span>
                      }
                          </td>
                          <td className="tabular w-[84px] py-2.5 pr-4 text-right font-medium text-ink">
                            {formatMinutes(entry.minutes)}
                          </td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>
              </section>
          )}
          </div>
        }
      </div>
    </div>);

}