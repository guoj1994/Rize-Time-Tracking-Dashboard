import React, { useState } from 'react';
import { UserPlusIcon, UsersIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { members as seedMembers } from '../data/admin';
import { formatMinutes } from '../utils/time';
import type { Member } from '../types';

const roles: Member['role'][] = ['Owner', 'Admin', 'Member'];

export function Members() {
  const [members, setMembers] = useState(seedMembers);

  const setRole = (id: string, role: Member['role']) =>
  setMembers((current) => current.map((member) => member.id === id ? { ...member, role } : member));

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<UsersIcon className="h-4 w-4 text-muted" />}
        title="Members"
        actions={
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-accent-ink px-3 py-[7px] text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
          
            <UserPlusIcon className="h-[14px] w-[14px]" />
            Invite member
          </button>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
          <table className="w-full text-[13px]">
            <caption className="sr-only">Workspace members</caption>
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Member
                </th>
                <th scope="col" className="hidden px-2 py-2.5 font-medium md:table-cell">
                  Team
                </th>
                <th scope="col" className="px-2 py-2.5 text-right font-medium">
                  Tracked this month
                </th>
                <th scope="col" className="px-2 py-2.5 font-medium">
                  Role
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {members.map((member) =>
              <tr key={member.id} className="transition-colors duration-150 ease-snap hover:bg-canvas">
                  <th scope="row" className="px-4 py-3 text-left font-normal">
                    <span className="flex items-center gap-3">
                      <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent-ink">
                        {member.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-ink">{member.name}</span>
                        <span className="block truncate text-[12px] text-faint">{member.email}</span>
                      </span>
                    </span>
                  </th>
                  <td className="hidden px-2 py-3 text-muted md:table-cell">{member.team}</td>
                  <td className="tabular px-2 py-3 text-right text-ink">
                    {member.trackedMinutes === 0 ? '–' : formatMinutes(member.trackedMinutes)}
                  </td>
                  <td className="px-2 py-3">
                    <label className="sr-only" htmlFor={`role-${member.id}`}>
                      Role for {member.name}
                    </label>
                    <select
                    id={`role-${member.id}`}
                    value={member.role}
                    onChange={(event) => setRole(member.id, event.target.value as Member['role'])}
                    className="rounded-lg border border-line bg-canvas px-2 py-1 text-[12px] text-ink focus:border-accent focus:outline-none">
                    
                      {roles.map((role) =>
                    <option key={role}>{role}</option>
                    )}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Badge tone={member.status === 'active' ? 'positive' : 'warn'}>{member.status}</Badge>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}