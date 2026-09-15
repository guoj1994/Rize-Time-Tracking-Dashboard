import React from 'react';
import { EuroIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { clients } from '../data/clients';
import { projects } from '../data/projects';
import { formatCurrency, formatMinutes } from '../utils/time';

export function Profitability() {
  const billable = clients.filter((client) => client.name !== 'Internal');
  const totalBilled = billable.reduce((sum, client) => sum + client.billed, 0);
  const totalUnbilled = billable.reduce((sum, client) => sum + client.unbilled, 0);
  const billableMinutes = billable.reduce((sum, client) => sum + client.trackedMinutes, 0);
  const internalMinutes = clients.find((client) => client.name === 'Internal')?.trackedMinutes ?? 0;
  const effectiveRate = (totalBilled + totalUnbilled) / (billableMinutes / 60);
  const billableShare = Math.round(billableMinutes / (billableMinutes + internalMinutes) * 100);

  return (
    <div className="flex h-full flex-col">
      <PageHeader icon={<EuroIcon className="h-4 w-4 text-muted" />} title="Profitability" />

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <section className="rounded-xl border border-line bg-surface p-6 shadow-panel">
          <p className="text-[12px] text-muted">Effective hourly rate · last 30 days</p>
          <div className="mt-1 flex flex-wrap items-end gap-x-8 gap-y-3">
            <p className="tabular text-[44px] font-semibold leading-none tracking-tight text-ink">
              {formatCurrency(effectiveRate)}
              <span className="ml-1 text-[16px] font-normal text-muted">/hr</span>
            </p>
            <dl className="flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
              <div>
                <dt className="text-[12px] text-muted">Billed</dt>
                <dd className="tabular font-semibold text-ink">{formatCurrency(totalBilled)}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-muted">Unbilled</dt>
                <dd className="tabular font-semibold text-warn">{formatCurrency(totalUnbilled)}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-muted">Billable share of tracked time</dt>
                <dd className="tabular font-semibold text-ink">{billableShare}%</dd>
              </div>
            </dl>
          </div>
          <div className="mt-5 flex h-[8px] overflow-hidden rounded-full bg-line">
            {billable.map((client) =>
            <div
              key={client.id}
              style={{
                width: `${Math.round(client.trackedMinutes / (billableMinutes + internalMinutes) * 100)}%`,
                backgroundColor: client.color
              }} />

            )}
            <div
              className="bg-line"
              style={{ width: `${Math.round(internalMinutes / (billableMinutes + internalMinutes) * 100)}%` }} />
            
          </div>
          <p className="mt-2 text-[12px] text-faint">
            {formatMinutes(internalMinutes)} of internal work is unbilled by design — it is excluded from the rate above.
          </p>
        </section>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Panel title="By client">
            <table className="w-full text-[13px]">
              <caption className="sr-only">Profitability by client</caption>
              <thead>
                <tr className="text-left text-muted">
                  <th scope="col" className="pb-2 font-medium">
                    Client
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Tracked
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Billed
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {billable.map((client) => {
                  const rate = (client.billed + client.unbilled) / (client.trackedMinutes / 60);
                  return (
                    <tr key={client.id}>
                      <th scope="row" className="py-2.5 text-left font-normal">
                        <span className="flex items-center gap-2">
                          <span
                            className="h-[9px] w-[9px] shrink-0 rounded-sm"
                            style={{ backgroundColor: client.color }} />
                          
                          <span className="truncate text-ink">{client.name}</span>
                        </span>
                      </th>
                      <td className="tabular py-2.5 text-right text-muted">{formatMinutes(client.trackedMinutes)}</td>
                      <td className="tabular py-2.5 text-right text-ink">{formatCurrency(client.billed)}</td>
                      <td className="tabular py-2.5 text-right font-medium text-ink">{formatCurrency(rate)}/hr</td>
                    </tr>);

                })}
              </tbody>
            </table>
          </Panel>

          <Panel title="Budget health">
            <ul className="space-y-4">
              {projects.
              filter((project) => project.status !== 'archived' && project.rate > 0).
              map((project) => {
                const used = Math.round(project.trackedMinutes / project.budgetMinutes * 100);
                const over = used > 100;
                return (
                  <li key={project.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="truncate text-[13px] text-ink">{project.name}</p>
                        {over ? <Badge tone="danger">Over budget</Badge> : <Badge tone="neutral">{used}% used</Badge>}
                      </div>
                      <div className="mt-1.5 h-[6px] overflow-hidden rounded-full bg-accent-soft">
                        <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, used)}%`,
                          backgroundColor: over ? 'rgb(var(--danger))' : project.color
                        }} />
                      
                      </div>
                      <p className="mt-1 text-[12px] text-faint">
                        {formatMinutes(project.trackedMinutes)} of {formatMinutes(project.budgetMinutes)} ·{' '}
                        {formatCurrency(project.rate)}/hr
                      </p>
                    </li>);

              })}
            </ul>
          </Panel>
        </div>
      </div>
    </div>);

}