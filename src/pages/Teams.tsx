import React from 'react';
import { LayersIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { members, teams } from '../data/admin';
import { formatMinutes } from '../utils/time';

export function Teams() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<LayersIcon className="h-4 w-4 text-muted" />}
        title="Teams"
        actions={
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-accent-ink px-3 py-[7px] text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
          
            <PlusIcon className="h-[14px] w-[14px]" />
            New team
          </button>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="grid gap-4 lg:grid-cols-2">
          {teams.map((team) => {
            const teamMembers = members.filter((member) => member.team === team.name);
            return (
              <Panel key={team.id} title={team.name}>
                <dl className="grid grid-cols-3 gap-4 border-b border-line pb-4">
                  <div>
                    <dt className="text-[12px] text-muted">Members</dt>
                    <dd className="tabular text-[19px] font-semibold text-ink">{team.members}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-muted">Projects</dt>
                    <dd className="tabular text-[19px] font-semibold text-ink">{team.projects}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-muted">Tracked</dt>
                    <dd className="tabular text-[19px] font-semibold text-ink">{formatMinutes(team.trackedMinutes)}</dd>
                  </div>
                </dl>

                <ul className="mt-3 space-y-2">
                  {teamMembers.length === 0 &&
                  <li className="text-[13px] text-faint">No members have joined this team yet.</li>
                  }
                  {teamMembers.map((member) =>
                  <li key={member.id} className="flex items-center gap-3">
                      <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent-ink">
                        {member.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] text-ink">{member.name}</span>
                      <Badge tone={member.role === 'Owner' ? 'accent' : 'neutral'}>{member.role}</Badge>
                    </li>
                  )}
                </ul>
              </Panel>);

          })}
        </div>
      </div>
    </div>);

}