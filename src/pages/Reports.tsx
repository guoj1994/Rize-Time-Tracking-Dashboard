import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MoreHorizontalIcon, PlayIcon, PlusIcon, SunriseIcon, TrendingUpIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { reportRuns, reportTemplates } from '../data/reports';

const statusDot: Record<string, string> = {
  ready: 'bg-accent',
  attention: 'bg-warn',
  failed: 'bg-danger'
};

export function Reports() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<TrendingUpIcon className="h-4 w-4 text-muted" />}
        title="Reports"
        actions={
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-accent-ink px-3 py-[7px] text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
          
            <PlusIcon className="h-[14px] w-[14px]" />
            New Report
          </button>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="flex flex-wrap gap-4">
          {reportTemplates.map((template) =>
          <article
            key={template.id}
            className="flex w-[248px] flex-col rounded-xl border border-line bg-surface p-4 shadow-panel transition-colors duration-150 ease-snap hover:border-accent/40">
            
              <div className="flex items-start justify-between">
                {template.icon === 'calendar' ?
              <CalendarIcon className="h-[18px] w-[18px] text-accent" /> :

              <SunriseIcon className="h-[18px] w-[18px] text-warn" />
              }
                <div className="flex items-center gap-1 text-faint">
                  <button
                  type="button"
                  aria-label={`Run ${template.name}`}
                  className="rounded p-1 transition-colors duration-150 ease-snap hover:bg-canvas hover:text-ink">
                  
                    <PlayIcon className="h-[14px] w-[14px]" />
                  </button>
                  <button
                  type="button"
                  aria-label={`${template.name} options`}
                  className="rounded p-1 transition-colors duration-150 ease-snap hover:bg-canvas hover:text-ink">
                  
                    <MoreHorizontalIcon className="h-[14px] w-[14px]" />
                  </button>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <h2 className="text-[14px] font-medium text-ink">{template.name}</h2>
                <Badge tone="info">New</Badge>
              </div>
              <p className="mt-2 text-[12px] text-muted">
                {template.scope} · {template.cadence}
              </p>
              <p className="mt-auto pt-2 text-[12px] text-faint">Last run {template.lastRun}</p>
            </article>
          )}
        </div>

        <h2 className="mb-2 mt-7 text-[14px] font-semibold text-ink">Recent Runs</h2>
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
          <table className="w-full text-[13px]">
            <caption className="sr-only">Recent report runs</caption>
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th scope="col" className="w-[44px] px-4 py-2.5" />
                <th scope="col" className="w-[150px] px-2 py-2.5 font-medium">
                  Range
                </th>
                <th scope="col" className="px-2 py-2.5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-2 py-2.5 font-medium">
                  Generated At
                </th>
                <th scope="col" className="w-[52px] px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {reportRuns.map((run) =>
              <tr key={run.id} className="group transition-colors duration-150 ease-snap hover:bg-canvas">
                  <td className="px-4 py-2.5">
                    <span
                    className={`block h-[9px] w-[9px] rounded-full ${statusDot[run.status]}`}
                    title={run.status} />
                  
                  </td>
                  <td className="px-2 py-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-canvas px-2 py-1 text-[12px] text-muted">
                      <CalendarIcon className="h-[12px] w-[12px]" />
                      {run.range}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <Link
                    to={`/reports/${run.id}`}
                    className="inline-flex items-center gap-2 font-medium text-ink transition-colors duration-150 ease-snap hover:text-accent-ink">
                    
                      {run.template === 'weekly' ?
                    <CalendarIcon className="h-[14px] w-[14px] text-accent" /> :

                    <SunriseIcon className="h-[14px] w-[14px] text-warn" />
                    }
                      {run.name}
                    </Link>
                  </td>
                  <td className="px-2 py-2.5 text-muted">{run.generatedAt}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                    type="button"
                    aria-label={`${run.name} ${run.range} options`}
                    className="rounded p-1 text-faint opacity-0 transition-opacity duration-150 ease-snap hover:bg-canvas hover:text-ink group-hover:opacity-100">
                    
                      <MoreHorizontalIcon className="h-[14px] w-[14px]" />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}