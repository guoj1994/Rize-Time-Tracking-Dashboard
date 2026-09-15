import React from 'react';
import { FileTextIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { invoices } from '../data/admin';
import { formatCurrency } from '../utils/time';

const statusTone = { paid: 'positive', sent: 'info', draft: 'neutral', overdue: 'danger' } as const;

export function Invoices() {
  const outstanding = invoices.
  filter((invoice) => invoice.status === 'sent' || invoice.status === 'overdue').
  reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdue = invoices.
  filter((invoice) => invoice.status === 'overdue').
  reduce((sum, invoice) => sum + invoice.amount, 0);
  const paid = invoices.filter((invoice) => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<FileTextIcon className="h-4 w-4 text-muted" />}
        title="Invoices"
        actions={
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-accent-ink px-3 py-[7px] text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
          
            <PlusIcon className="h-[14px] w-[14px]" />
            New invoice
          </button>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="mb-4 flex flex-wrap items-end gap-x-10 gap-y-3 rounded-xl border border-line bg-surface px-5 py-4 shadow-panel">
          <div>
            <p className="text-[12px] text-muted">Outstanding</p>
            <p className="tabular text-[30px] font-semibold leading-tight text-ink">{formatCurrency(outstanding)}</p>
          </div>
          <div>
            <p className="text-[12px] text-muted">Overdue</p>
            <p className="tabular text-[19px] font-semibold text-danger">{formatCurrency(overdue)}</p>
          </div>
          <div>
            <p className="text-[12px] text-muted">Paid this quarter</p>
            <p className="tabular text-[19px] font-semibold text-ink">{formatCurrency(paid)}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
          <table className="w-full text-[13px]">
            <caption className="sr-only">Invoices</caption>
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Number
                </th>
                <th scope="col" className="px-2 py-2.5 font-medium">
                  Client
                </th>
                <th scope="col" className="hidden px-2 py-2.5 font-medium md:table-cell">
                  Issued
                </th>
                <th scope="col" className="hidden px-2 py-2.5 font-medium md:table-cell">
                  Due
                </th>
                <th scope="col" className="px-2 py-2.5 text-right font-medium">
                  Amount
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {invoices.map((invoice) =>
              <tr key={invoice.id} className="transition-colors duration-150 ease-snap hover:bg-canvas">
                  <th scope="row" className="px-4 py-3 text-left font-medium text-ink">
                    {invoice.number}
                  </th>
                  <td className="px-2 py-3 text-ink">{invoice.client}</td>
                  <td className="hidden px-2 py-3 text-muted md:table-cell">{invoice.issued}</td>
                  <td className="hidden px-2 py-3 text-muted md:table-cell">{invoice.due}</td>
                  <td className="tabular px-2 py-3 text-right font-medium text-ink">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Badge tone={statusTone[invoice.status]}>{invoice.status}</Badge>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}