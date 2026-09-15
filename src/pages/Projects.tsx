import React, { useState } from 'react';
import { PackageIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Segmented } from '../components/ui/Segmented';
import { projects } from '../data/projects';
import { formatMinutes } from '../utils/time';

type Filter = 'active' | 'archived';

export function Projects() {
  const [filter, setFilter] = useState<Filter>('active');
  const visible = projects.filter((project) => project.status === filter);
  const totalMinutes = visible.reduce((sum, project) => sum + project.trackedMinutes, 0);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<PackageIcon className="h-4 w-4 text-muted" />}
        title="Projects"
        actions={
        <Segmented
          ariaLabel="Project filter"
          size="sm"
          value={filter}
          onChange={setFilter}
          options={[
          { value: 'active', label: 'Active' },
          { value: 'archived', label: 'Archived' }]
          } />

        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        {visible.length === 0 ?
        <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-[14px] font-medium text-ink">No {filter} projects</p>
            <p className="mt-1 text-[13px] text-muted">Projects are just labels — create one from the Focus page.</p>
          </div> :

        <>
            <p className="mb-3 text-[13px] text-muted">
              {visible.length} {filter} · {formatMinutes(totalMinutes)} tracked
            </p>
            <ul className="space-y-2">
              {visible.map((project) =>
            <li
              key={project.id}
              className="flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3.5 shadow-panel transition-colors duration-150 ease-snap hover:border-accent/30">
              
                  <span className="h-[14px] w-[14px] shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
                  <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink">{project.name}</span>
                  <span className="tabular shrink-0 text-[13px] text-muted">{formatMinutes(project.trackedMinutes)}</span>
                  <Badge tone={project.status === 'active' ? 'positive' : 'neutral'}>{project.status}</Badge>
                </li>
            )}
            </ul>
          </>
        }
      </div>
    </div>);

}