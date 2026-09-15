import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SendIcon, TableIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { useTracking } from '../contexts/TrackingContext';
import { formatCompact } from '../utils/time';

const dayLabels = ['Mon 14', 'Tue 15', 'Wed 16', 'Thu 17', 'Fri 18', 'Sat 19', 'Sun 20'];

const rows = [
{ id: 'r1', task: '044 Video 4 (Backend)', project: 'EndtoEnd_ai_bottcamp', color: '#8fbf7a', hours: [1.6, 3.1, 0, 0, 0, 0, 0] },
{ id: 'r2', task: '045 Video 5 (Notebook)', project: 'EndtoEnd_ai_bottcamp', color: '#8fbf7a', hours: [0.8, 0.8, 0, 0, 0, 0, 0] },
{ id: 'r3', task: 'Onboarding flow review', project: 'Northwind Onboarding Revamp', color: '#5a4ed6', hours: [2.4, 0.6, 0, 0, 0, 0, 0] },
{ id: 'r4', task: 'Token collision audit', project: 'Kestrel Design System', color: '#e59a9a', hours: [1.2, 0, 0, 0, 0, 0, 0] },
{ id: 'r5', task: 'Legacy dashboards query', project: 'Atlas Analytics Migration', color: '#6ec1c8', hours: [2.4, 0, 0, 0, 0, 0, 0] }];


function hoursLabel(value: number) {
  if (value === 0) return '–';
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  return minutes === 0 ? `${hours}:00` : `${hours}:${String(minutes).padStart(2, '0')}`;
}

export function MyTimesheet() {
  const { trackedSeconds } = useTracking();
  const [submitted, setSubmitted] = useState(false);

  const columnTotals = dayLabels.map((_, index) => rows.reduce((sum, row) => sum + row.hours[index], 0));
  const weekTotal = columnTotals.reduce((sum, value) => sum + value, 0);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<TableIcon className="h-4 w-4 text-muted" />}
        title="My Timesheet"
        actions={
        <>
            <div className="flex items-center gap-1">
              <button
              type="button"
              aria-label="Previous week"
              className="rounded-md border border-line bg-surface p-1.5 text-muted transition-colors duration-150 ease-snap hover:text-ink">
              
                <ChevronLeftIcon className="h-[14px] w-[14px]" />
              </button>
              <span className="px-1 text-[13px] text-muted">Week of Sep 14</span>
              <button
              type="button"
              aria-label="Next week"
              className="rounded-md border border-line bg-surface p-1.5 text-muted transition-colors duration-150 ease-snap hover:text-ink">
              
                <ChevronRightIcon className="h-[14px] w-[14px]" />
              </button>
            </div>
            {submitted ?
          <Badge tone="positive">Submitted for approval</Badge> :

          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="flex items-center gap-1.5 rounded-lg bg-accent-ink px-3 py-[7px] text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
            
                <SendIcon className="h-[14px] w-[14px]" />
                Submit week
              </button>
          }
          </>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="mb-4 flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <div>
            <p className="text-[12px] text-muted">Week total</p>
            <p className="tabular text-[22px] font-semibold text-ink">{weekTotal.toFixed(1)} h</p>
          </div>
          <div>
            <p className="text-[12px] text-muted">Tracked today (live)</p>
            <p className="tabular text-[22px] font-semibold text-accent-ink">{formatCompact(trackedSeconds)}</p>
          </div>
          <p className="text-[13px] text-muted">
            Auto-filled from tracked activity. Cells stay editable until the week is submitted.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-panel">
          <table className="w-full min-w-[820px] text-[13px]">
            <caption className="sr-only">Weekly timesheet by task</caption>
            <thead>
              <tr className="border-b border-line text-left">
                <th scope="col" className="w-[280px] px-4 py-2.5 font-medium text-muted">
                  Task
                </th>
                {dayLabels.map((day, index) =>
                <th
                  key={day}
                  scope="col"
                  className={`px-2 py-2.5 text-center font-medium ${index === 1 ? 'text-accent-ink' : 'text-muted'}`}>
                  
                    {day}
                  </th>
                )}
                <th scope="col" className="px-4 py-2.5 text-right font-medium text-muted">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => {
                const rowTotal = row.hours.reduce((sum, value) => sum + value, 0);
                return (
                  <tr key={row.id} className="transition-colors duration-150 ease-snap hover:bg-canvas">
                    <th scope="row" className="px-4 py-2.5 text-left font-normal">
                      <span className="flex items-center gap-2">
                        <span className="h-[9px] w-[9px] shrink-0 rounded-sm" style={{ backgroundColor: row.color }} />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-ink">{row.task}</span>
                          <span className="block truncate text-[12px] text-faint">{row.project}</span>
                        </span>
                      </span>
                    </th>
                    {row.hours.map((value, index) =>
                    <td key={index} className="px-2 py-2.5 text-center">
                        <span
                        className={`tabular inline-block min-w-[46px] rounded-md border px-2 py-1 ${
                        value === 0 ?
                        'border-transparent text-faint' :
                        index === 1 ?
                        'border-accent/30 bg-accent-soft text-accent-ink' :
                        'border-line text-ink'}`
                        }>
                        
                          {hoursLabel(value)}
                        </span>
                      </td>
                    )}
                    <td className="tabular px-4 py-2.5 text-right font-semibold text-ink">{rowTotal.toFixed(1)}</td>
                  </tr>);

              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-line bg-canvas">
                <th scope="row" className="px-4 py-2.5 text-left font-medium text-muted">
                  Daily total
                </th>
                {columnTotals.map((value, index) =>
                <td key={index} className="tabular px-2 py-2.5 text-center font-medium text-ink">
                    {value === 0 ? '–' : value.toFixed(1)}
                  </td>
                )}
                <td className="tabular px-4 py-2.5 text-right font-semibold text-ink">{weekTotal.toFixed(1)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>);

}