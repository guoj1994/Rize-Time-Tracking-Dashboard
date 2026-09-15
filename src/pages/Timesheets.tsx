import React, { useState } from 'react';
import { CheckIcon, ClipboardIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Segmented } from '../components/ui/Segmented';

type Filter = 'pending' | 'approved' | 'all';

interface Sheet {
  id: string;
  member: string;
  week: string;
  hours: number;
  billableHours: number;
  status: 'pending' | 'approved' | 'rejected';
}

const initialSheets: Sheet[] = [
{ id: 'ts1', member: 'xijie', week: 'Sep 7 – Sep 13', hours: 34.6, billableHours: 21.2, status: 'pending' },
{ id: 'ts2', member: 'Dana Whitfield', week: 'Sep 7 – Sep 13', hours: 38.0, billableHours: 32.5, status: 'pending' },
{ id: 'ts3', member: 'Sam Ortiz', week: 'Sep 7 – Sep 13', hours: 27.4, billableHours: 24.0, status: 'pending' },
{ id: 'ts4', member: 'xijie', week: 'Aug 31 – Sep 6', hours: 31.8, billableHours: 18.6, status: 'approved' },
{ id: 'ts5', member: 'Dana Whitfield', week: 'Aug 31 – Sep 6', hours: 40.2, billableHours: 35.1, status: 'approved' },
{ id: 'ts6', member: 'Sam Ortiz', week: 'Aug 31 – Sep 6', hours: 12.0, billableHours: 9.4, status: 'rejected' }];


const statusTone = { pending: 'warn', approved: 'positive', rejected: 'danger' } as const;

export function Timesheets() {
  const [sheets, setSheets] = useState(initialSheets);
  const [filter, setFilter] = useState<Filter>('pending');

  const visible = sheets.filter((sheet) => filter === 'all' ? true : sheet.status === filter);
  const pendingCount = sheets.filter((sheet) => sheet.status === 'pending').length;

  const setStatus = (id: string, status: Sheet['status']) =>
  setSheets((current) => current.map((sheet) => sheet.id === id ? { ...sheet, status } : sheet));

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<ClipboardIcon className="h-4 w-4 text-muted" />}
        title="Timesheets"
        actions={
        <Segmented
          ariaLabel="Timesheet filter"
          size="sm"
          value={filter}
          onChange={setFilter}
          options={[
          { value: 'pending', label: `Pending (${pendingCount})` },
          { value: 'approved', label: 'Approved' },
          { value: 'all', label: 'All' }]
          } />

        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        {visible.length === 0 ?
        <div className="rounded-xl border border-dashed border-line bg-surface p-12 text-center">
            <p className="text-[14px] font-medium text-ink">Nothing to review</p>
            <p className="mt-1 text-[13px] text-muted">Every timesheet in this view has been handled.</p>
          </div> :

        <ul className="space-y-2">
            {visible.map((sheet) =>
          <li
            key={sheet.id}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-panel">
            
                <div className="min-w-[180px] flex-1">
                  <p className="text-[14px] font-medium text-ink">{sheet.member}</p>
                  <p className="text-[12px] text-faint">{sheet.week}</p>
                </div>
                <div className="min-w-[90px]">
                  <p className="text-[12px] text-muted">Total</p>
                  <p className="tabular text-[14px] font-semibold text-ink">{sheet.hours.toFixed(1)} h</p>
                </div>
                <div className="min-w-[90px]">
                  <p className="text-[12px] text-muted">Billable</p>
                  <p className="tabular text-[14px] font-semibold text-ink">{sheet.billableHours.toFixed(1)} h</p>
                </div>
                <div className="w-[200px]">
                  <div className="h-[6px] overflow-hidden rounded-full bg-accent-soft">
                    <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.round(sheet.billableHours / sheet.hours * 100)}%` }} />
                
                  </div>
                  <p className="mt-1 text-[11px] text-faint">
                    {Math.round(sheet.billableHours / sheet.hours * 100)}% billable
                  </p>
                </div>
                <Badge tone={statusTone[sheet.status]}>{sheet.status}</Badge>
                {sheet.status === 'pending' ?
            <div className="flex items-center gap-2">
                    <button
                type="button"
                onClick={() => setStatus(sheet.id, 'approved')}
                className="flex items-center gap-1.5 rounded-lg bg-accent-ink px-3 py-1.5 text-[12px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
                
                      <CheckIcon className="h-[13px] w-[13px]" />
                      Approve
                    </button>
                    <button
                type="button"
                onClick={() => setStatus(sheet.id, 'rejected')}
                aria-label={`Reject ${sheet.member} ${sheet.week}`}
                className="rounded-lg border border-line p-1.5 text-muted transition-colors duration-150 ease-snap hover:text-danger">
                
                      <XIcon className="h-[13px] w-[13px]" />
                    </button>
                  </div> :

            <button
              type="button"
              onClick={() => setStatus(sheet.id, 'pending')}
              className="rounded-lg border border-line px-3 py-1.5 text-[12px] text-muted transition-colors duration-150 ease-snap hover:text-ink">
              
                    Reopen
                  </button>
            }
              </li>
          )}
          </ul>
        }
      </div>
    </div>);

}