import React, { useState } from 'react';
import { CheckCircle2Icon, PlusIcon, SettingsIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { Segmented } from '../components/ui/Segmented';
import { useShell } from '../contexts/ShellContext';
import { categoryRules as seedRules, privacyExclusions as seedExclusions } from '../data/settings';
import { categoryMeta, categoryOrder } from '../utils/classify';
import type { ActivityCategory, PrivacyExclusion } from '../types';

export function Settings() {
  const { theme, toggleTheme } = useShell();
  const [connected, setConnected] = useState(true);
  const [rules, setRules] = useState(seedRules);
  const [newPattern, setNewPattern] = useState('');
  const [newCategory, setNewCategory] = useState<ActivityCategory>('focus');
  const [exclusions, setExclusions] = useState<PrivacyExclusion[]>(seedExclusions);
  const [newExclusion, setNewExclusion] = useState('');
  const [newExclusionKind, setNewExclusionKind] = useState<PrivacyExclusion['kind']>('app');

  const addRule = () => {
    if (!newPattern.trim()) return;
    setRules((current) => [...current, { id: `r${Date.now()}`, pattern: newPattern.trim(), category: newCategory }]);
    setNewPattern('');
  };

  const addExclusion = () => {
    if (!newExclusion.trim()) return;
    setExclusions((current) => [
    ...current,
    { id: `e${Date.now()}`, value: newExclusion.trim(), kind: newExclusionKind }]
    );
    setNewExclusion('');
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader icon={<SettingsIcon className="h-4 w-4 text-muted" />} title="Settings" />

      <div className="rize-scroll flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[720px] px-5 py-5">
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-4 shadow-panel">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-[34px] w-[34px] items-center justify-center rounded-full ${
                connected ? 'bg-[#e9f5ee] text-positive' : 'bg-canvas text-faint'}`
                }>
                
                <CheckCircle2Icon className="h-[18px] w-[18px]" />
              </span>
              <div>
                <p className="text-[14px] font-medium text-ink">ActivityWatch — local capture</p>
                <p className="text-[12px] text-muted">
                  {connected ? 'Connected at localhost:5600 · everything stays on this Mac' : 'Not connected'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConnected((value) => !value)}
              className={`rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ease-snap ${
              connected ?
              'border-line text-muted hover:text-danger' :
              'border-accent/40 bg-accent-soft text-accent-ink'}`
              }>
              
              {connected ? 'Disconnect' : 'Connect'}
            </button>
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

            <Panel title="Category rules">
              <p className="mb-3 text-[12px] text-muted">
                Rize checks these in order to label captured apps and sites before confidence scoring.
              </p>
              <ul className="divide-y divide-line">
                {rules.map((rule) =>
                <li key={rule.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                    <span className="min-w-0 flex-1 truncate text-[13px] text-ink">{rule.pattern}</span>
                    <span
                    className={`shrink-0 rounded-md border px-2 py-[2px] text-[11px] font-medium ${categoryMeta[rule.category].chip}`}>
                    
                      {categoryMeta[rule.category].label}
                    </span>
                    <button
                    type="button"
                    onClick={() => setRules((current) => current.filter((item) => item.id !== rule.id))}
                    aria-label={`Remove rule ${rule.pattern}`}
                    className="shrink-0 rounded p-1 text-faint transition-colors duration-150 ease-snap hover:text-danger">
                    
                      <XIcon className="h-[13px] w-[13px]" />
                    </button>
                  </li>
                )}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                <input
                  value={newPattern}
                  onChange={(event) => setNewPattern(event.target.value)}
                  placeholder="App or domain name…"
                  className="min-w-[180px] flex-1 rounded-lg border border-line bg-canvas px-3 py-2 text-[13px] text-ink placeholder:text-faint focus:border-accent focus:outline-none" />
                
                <select
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value as ActivityCategory)}
                  className="rounded-lg border border-line bg-canvas px-2.5 py-2 text-[13px] text-ink focus:border-accent focus:outline-none">
                  
                  {categoryOrder.map((category) =>
                  <option key={category} value={category}>
                      {categoryMeta[category].label}
                    </option>
                  )}
                </select>
                <button
                  type="button"
                  onClick={addRule}
                  className="flex items-center gap-1.5 rounded-lg bg-accent-ink px-3 py-2 text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
                  
                  <PlusIcon className="h-[14px] w-[14px]" />
                  Add rule
                </button>
              </div>
            </Panel>

            <Panel title="Privacy exclusions">
              <p className="mb-3 text-[12px] text-muted">
                Apps and domains listed here are never captured, even while a focus session is running.
              </p>
              <ul className="flex flex-wrap gap-2">
                {exclusions.map((item) =>
                <li
                  key={item.id}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-[12px] text-ink">
                  
                    {item.value}
                    <button
                    type="button"
                    onClick={() => setExclusions((current) => current.filter((entry) => entry.id !== item.id))}
                    aria-label={`Remove ${item.value}`}
                    className="text-faint transition-colors duration-150 ease-snap hover:text-danger">
                    
                      <XIcon className="h-[12px] w-[12px]" />
                    </button>
                  </li>
                )}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                <input
                  value={newExclusion}
                  onChange={(event) => setNewExclusion(event.target.value)}
                  placeholder="App name or domain…"
                  className="min-w-[180px] flex-1 rounded-lg border border-line bg-canvas px-3 py-2 text-[13px] text-ink placeholder:text-faint focus:border-accent focus:outline-none" />
                
                <Segmented
                  ariaLabel="Exclusion type"
                  size="sm"
                  value={newExclusionKind}
                  onChange={setNewExclusionKind}
                  options={[
                  { value: 'app', label: 'App' },
                  { value: 'domain', label: 'Domain' }]
                  } />
                
                <button
                  type="button"
                  onClick={addExclusion}
                  className="flex items-center gap-1.5 rounded-lg bg-accent-ink px-3 py-2 text-[13px] font-medium text-white transition-opacity duration-150 ease-snap hover:opacity-90">
                  
                  <PlusIcon className="h-[14px] w-[14px]" />
                  Exclude
                </button>
              </div>
            </Panel>

            <Panel title="Local data">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-muted">
                  Everything captured lives in a local database on this Mac — nothing syncs anywhere by default.
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