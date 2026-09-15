import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BriefcaseIcon,
  ChevronDownIcon,
  CircleIcon,
  ListChecksIcon,
  MicIcon,
  PackageIcon,
  SearchIcon,
  XIcon } from
'lucide-react';

export interface PickerOption {
  id: string;
  label: string;
  status?: string;
  project?: string;
  assignedToMe?: boolean;
}

interface EntityPickerProps {
  kind: 'task' | 'project' | 'client';
  value: string | null;
  onChange: (id: string | null) => void;
  options: PickerOption[];
}

const copy = {
  task: { placeholder: 'Task', group: 'Tasks', empty: 'No task', search: 'Search task name...' },
  project: { placeholder: 'Project', group: 'Projects', empty: 'No project', search: 'Search project name...' },
  client: { placeholder: 'Client', group: 'Clients', empty: 'No client', search: 'Search client name...' }
};

function KindIcon({ kind, className }: {kind: EntityPickerProps['kind'];className: string;}) {
  if (kind === 'task') return <ListChecksIcon className={className} />;
  if (kind === 'project') return <PackageIcon className={className} />;
  return <BriefcaseIcon className={className} />;
}

export function EntityPicker({ kind, value, onChange, options }: EntityPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [mineOnly, setMineOnly] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((option) => option.id === value) ?? null;
  const labels = copy[kind];

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const statuses = useMemo(
    () => ['All statuses', ...Array.from(new Set(options.map((option) => option.status).filter(Boolean) as string[]))],
    [options]
  );

  const filtered = options.filter((option) => {
    const matchesQuery = option.label.toLowerCase().includes(query.trim().toLowerCase());
    const matchesStatus = status === 'All statuses' || option.status === status;
    const matchesOwner = kind !== 'task' || !mineOnly || option.assignedToMe !== false;
    return matchesQuery && matchesStatus && matchesOwner;
  });

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-2.5 text-left transition-colors duration-150 ease-snap hover:border-accent/40">
        
        <KindIcon kind={kind} className="h-[14px] w-[14px] shrink-0 text-faint" />
        <span className={`min-w-0 flex-1 truncate text-[13px] ${selected ? 'text-ink' : 'text-muted'}`}>
          {selected ? selected.label : labels.placeholder}
        </span>
        {selected &&
        <span
          role="button"
          tabIndex={0}
          aria-label={`Clear ${labels.placeholder.toLowerCase()}`}
          onClick={(event) => {
            event.stopPropagation();
            onChange(null);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.stopPropagation();
              onChange(null);
            }
          }}
          className="shrink-0 rounded p-[2px] text-faint transition-colors duration-150 ease-snap hover:text-ink">
          
            <XIcon className="h-[13px] w-[13px]" />
          </span>
        }
        <ChevronDownIcon className="h-[14px] w-[14px] shrink-0 text-faint" />
      </button>

      {open &&
      <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-line bg-surface shadow-pop">
          <div className="flex items-center gap-2 px-3 pt-3">
            <span className="flex items-center gap-1.5 rounded-md border border-line bg-canvas px-2 py-1 text-[12px] text-ink">
              <MicIcon className="h-[11px] w-[11px] text-accent" />
              xijie
            </span>
          </div>

          <div className="px-3 pt-2">
            <label className="relative block">
              <span className="sr-only">{labels.search}</span>
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-faint" />
              <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.search}
              className="w-full rounded-lg border border-line bg-canvas py-2 pl-8 pr-3 text-[13px] text-ink placeholder:text-faint focus:border-accent focus:outline-none" />
            
            </label>
          </div>

          {kind === 'task' &&
        <div className="flex flex-wrap items-center gap-2 px-3 pt-2.5">
              <label className="sr-only" htmlFor="picker-status">
                Filter by status
              </label>
              <select
            id="picker-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-md border border-line bg-canvas px-2 py-1 text-[12px] text-muted focus:border-accent focus:outline-none">
            
                {statuses.map((option) =>
            <option key={option}>{option}</option>
            )}
              </select>
              <label className="flex items-center gap-1.5 rounded-md bg-accent-soft px-2 py-1 text-[12px] text-accent-ink">
                <input
              type="checkbox"
              checked={mineOnly}
              onChange={(event) => setMineOnly(event.target.checked)}
              className="h-[13px] w-[13px] rounded border-line accent-[rgb(var(--accent))]" />
            
                Assigned to me
              </label>
              <button
            type="button"
            onClick={() => {
              setQuery('');
              setStatus('All statuses');
              setMineOnly(false);
            }}
            className="flex items-center gap-1 text-[12px] text-muted transition-colors duration-150 ease-snap hover:text-ink">
            
                <XIcon className="h-[12px] w-[12px]" />
                Clear all
              </button>
            </div>
        }

          <div className="rize-scroll mt-2 max-h-[248px] overflow-y-auto border-t border-line pt-1">
            <p className="px-3 py-1.5 text-[12px] text-muted">{labels.group}</p>
            <ul role="listbox">
              <li>
                <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors duration-150 ease-snap hover:bg-canvas ${
                value === null ? 'bg-accent-soft/70 text-accent-ink' : 'text-ink'}`
                }>
                
                  <CircleIcon className="h-[14px] w-[14px] shrink-0 text-faint" />
                  {labels.empty}
                </button>
              </li>
              {filtered.map((option) =>
            <li key={option.id}>
                  <button
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors duration-150 ease-snap hover:bg-canvas ${
                option.id === value ? 'bg-accent-soft/70 text-accent-ink' : 'text-ink'}`
                }>
                
                    <KindIcon kind={kind} className="h-[14px] w-[14px] shrink-0 text-faint" />
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    {option.project && kind === 'task' &&
                <span className="shrink-0 truncate text-[11px] text-faint">{option.project}</span>
                }
                  </button>
                </li>
            )}
              {filtered.length === 0 &&
            <li className="px-3 py-3 text-[13px] text-faint">Nothing matches that search.</li>
            }
            </ul>
          </div>
        </div>
      }
    </div>);

}