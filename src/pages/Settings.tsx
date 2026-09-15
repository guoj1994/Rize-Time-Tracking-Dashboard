import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SettingsIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { Segmented } from '../components/ui/Segmented';
import { useShell } from '../contexts/ShellContext';
import { planOptions } from '../data/plans';

interface ToggleSetting {
  id: string;
  name: string;
  detail: string;
}

const trackingToggles: ToggleSetting[] = [
{ id: 'auto', name: 'Start tracking on login', detail: 'Rize begins capturing activity as soon as the Mac wakes' },
{ id: 'idle', name: 'Detect idle after 3 minutes', detail: 'Idle time is held back until you confirm what it was' },
{ id: 'private', name: 'Hide window titles', detail: 'Only app and domain names are stored, never document titles' },
{ id: 'meetings', name: 'Auto-detect meetings', detail: 'Calls in Meet, Zoom, and Teams are labeled as meetings' }];


const notificationToggles: ToggleSetting[] = [
{ id: 'break', name: 'Smart break reminders', detail: 'Nudge after long uninterrupted focus blocks' },
{ id: 'target', name: 'Daily target recap', detail: 'A summary notification when the day ends' },
{ id: 'weekly', name: 'Weekly review email', detail: 'Sent Sunday at 5:00 AM' }];


function ToggleList({ items, initial }: {items: ToggleSetting[];initial: string[];}) {
  const [enabled, setEnabled] = useState(initial);
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => {
        const on = enabled.includes(item.id);
        return (
          <li key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="truncate text-[13px] text-ink">{item.name}</p>
              <p className="truncate text-[12px] text-faint">{item.detail}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label={item.name}
              onClick={() =>
              setEnabled((current) =>
              current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id]
              )
              }
              className={`relative h-[20px] w-[34px] shrink-0 rounded-full transition-colors duration-150 ease-snap ${
              on ? 'bg-accent' : 'bg-line'}`
              }>
              
              <span
                className={`absolute top-[2px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-150 ease-snap ${
                on ? 'translate-x-[16px]' : 'translate-x-[2px]'}`
                } />
              
            </button>
          </li>);

      })}
    </ul>);

}

export function Settings() {
  const { theme, toggleTheme, plan } = useShell();
  const current = planOptions.find((option) => option.id === plan) ?? planOptions[0];

  return (
    <div className="flex h-full flex-col">
      <PageHeader icon={<SettingsIcon className="h-4 w-4 text-muted" />} title="Settings" />

      <div className="rize-scroll flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[720px] px-5 py-5">
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/30 bg-accent-soft/60 px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-ink">{current.name} plan</h2>
                <Badge tone="accent">{current.credits}</Badge>
              </div>
              <p className="mt-1 text-[13px] text-muted">
                {current.tagline} · US${current.priceAnnual.toFixed(2)}/mo billed annually
              </p>
            </div>
            <Link
              to="/plans"
              className="rounded-lg bg-accent-ink px-4 py-2 text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
              
              Manage plan
            </Link>
          </section>

          <div className="mt-4 space-y-4">
            <Panel title="Appearance">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[13px] text-ink">Theme</p>
                  <p className="text-[12px] text-faint">Also switchable from the sun icon in the title bar</p>
                </div>
                <Segmented
                  ariaLabel="Theme"
                  size="sm"
                  value={theme}
                  onChange={(next) => {
                    if (next !== theme) toggleTheme();
                  }}
                  options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' }]
                  } />
                
              </div>
            </Panel>

            <Panel title="Tracking & privacy">
              <ToggleList items={trackingToggles} initial={['auto', 'idle', 'meetings']} />
            </Panel>

            <Panel title="Notifications">
              <ToggleList items={notificationToggles} initial={['break', 'target']} />
            </Panel>

            <Panel title="Data">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-muted">
                  Tracked activity stays on this Mac until you export or sync it.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-line px-3 py-1.5 text-[12px] text-ink transition-colors duration-150 ease-snap hover:border-accent/40">
                    
                    Export CSV
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-line px-3 py-1.5 text-[12px] text-danger transition-colors duration-150 ease-snap hover:border-danger/40">
                    
                    Delete local history
                  </button>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>);

}