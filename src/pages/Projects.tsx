import React, { useState } from 'react';
import { PackageIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Segmented } from '../components/ui/Segmented';
import { projects } from '../data/projects';
import { formatCurrency, formatMinutes, percent } from '../utils/time';

type Filter = 'active' | 'archived';

const statusTone = { active: 'positive', 'at-risk': 'warn', archived: 'neutral' } as const;

export function Projects() {
  const [filter, setFilter] = useState<Filter>('active');
  const visible = projects.filter((project) =>
  filter === 'active' ? project.status !== 'archived' : project.status === 'archived'
  );

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<PackageIcon className="h-4 w-4 text-muted" />}
        title="Projects"
        actions={
        <>
            <Segmented
            ariaLabel="Project filter"
            size="sm"
            value={filter}
            onChange={setFilter}
            options={[
            { value: 'active', label: 'Active' },
            { value: 'archived', label: 'Archived' }]
            } />
          
            <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-accent-ink px-3 py-[7px] text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
            
              <PlusIcon className="h-[14px] w-[14px]" />
              New project
            </button>
          </>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
          <table className="w-full text-[13px]">
            <caption className="sr-only">Projects</caption>
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Project
                </th>
                <th scope="col" className="hidden px-2 py-2.5 font-medium md:table-cell">
                  Client
                </th>
                <th scope="col" className="w-[220px] px-2 py-2.5 font-medium">
                  Budget
                </th>
                <th scope="col" className="px-2 py-2.5 text-right font-medium">
                  Rate
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((project) => {
                const used = percent(project.trackedMinutes, project.budgetMinutes);
                return (
                  <tr key={project.id} className="transition-colors duration-150 ease-snap hover:bg-canvas">
                    <th scope="row" className="px-4 py-3 text-left font-normal">
                      <span className="flex items-center gap-2.5">
                        <span
                          className="h-[10px] w-[10px] shrink-0 rounded-sm"
                          style={{ backgroundColor: project.color }} />
                        
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-ink">{project.name}</span>
                          <span className="block truncate text-[12px] text-faint">
                            {formatMinutes(project.trackedMinutes)} tracked
                          </span>
                        </span>
                      </span>
                    </th>
                    <td className="hidden px-2 py-3 text-muted md:table-cell">{project.client}</td>
                    <td className="px-2 py-3">
                      <div className="h-[6px] overflow-hidden rounded-full bg-accent-soft">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, used)}%`,
                            backgroundColor: used > 100 ? 'rgb(var(--danger))' : project.color
                          }} />
                        
                      </div>
                      <p className="tabular mt-1 text-[11px] text-faint">
                        {used}% of {formatMinutes(project.budgetMinutes)}
                      </p>
                    </td>
                    <td className="tabular px-2 py-3 text-right text-ink">
                      {project.rate > 0 ? `${formatCurrency(project.rate)}/hr` : '–'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge tone={statusTone[project.status]}>{project.status}</Badge>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}