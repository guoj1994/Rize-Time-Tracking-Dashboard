import React from 'react';
import { BriefcaseIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { clients } from '../data/clients';
import { formatCurrency, formatMinutes } from '../utils/time';

export function Clients() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<BriefcaseIcon className="h-4 w-4 text-muted" />}
        title="Clients"
        actions={
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-accent-ink px-3 py-[7px] text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
          
            <PlusIcon className="h-[14px] w-[14px]" />
            New client
          </button>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <ul className="space-y-2">
          {clients.map((client) =>
          <li
            key={client.id}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl border border-line bg-surface px-4 py-3.5 shadow-panel transition-colors duration-150 ease-snap hover:border-accent/30">
            
              <span className="flex min-w-[220px] flex-1 items-center gap-3">
                <span
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold text-white"
                style={{ backgroundColor: client.color }}>
                
                  {client.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-medium text-ink">{client.name}</span>
                  <span className="block truncate text-[12px] text-faint">{client.contact}</span>
                </span>
              </span>

              <div className="min-w-[80px]">
                <p className="text-[12px] text-muted">Projects</p>
                <p className="tabular text-[14px] font-semibold text-ink">{client.projects}</p>
              </div>
              <div className="min-w-[110px]">
                <p className="text-[12px] text-muted">Tracked</p>
                <p className="tabular text-[14px] font-semibold text-ink">{formatMinutes(client.trackedMinutes)}</p>
              </div>
              <div className="min-w-[110px]">
                <p className="text-[12px] text-muted">Billed</p>
                <p className="tabular text-[14px] font-semibold text-ink">{formatCurrency(client.billed)}</p>
              </div>
              <div className="min-w-[110px]">
                <p className="text-[12px] text-muted">Unbilled</p>
                <p className="tabular text-[14px] font-semibold text-warn">{formatCurrency(client.unbilled)}</p>
              </div>

              {client.unbilled > 0 ?
            <button
              type="button"
              className="rounded-lg border border-line px-3 py-1.5 text-[12px] text-ink transition-colors duration-150 ease-snap hover:border-accent/40 hover:text-accent-ink">
              
                  Create invoice
                </button> :

            <Badge>Nothing to bill</Badge>
            }
            </li>
          )}
        </ul>
      </div>
    </div>);

}