import React, { useState } from 'react';
import { LayoutDashboardIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Segmented } from '../components/ui/Segmented';
import { Donut } from '../components/ui/Donut';
import { MetricRow } from '../components/ui/Metric';
import { useTracking } from '../contexts/TrackingContext';
import { projects } from '../data/projects';
import { formatCompact, formatDuration, percent } from '../utils/time';

type Range = 'week' | 'month' | 'quarter';

const weekBars = [
{ label: 'Mon', focus: 5.2, other: 1.4 },
{ label: 'Tue', focus: 3.1, other: 0.6 },
{ label: 'Wed', focus: 6.4, other: 1.1 },
{ label: 'Thu', focus: 4.8, other: 2.2 },
{ label: 'Fri', focus: 5.9, other: 0.9 },
{ label: 'Sat', focus: 1.5, other: 0.3 },
{ label: 'Sun', focus: 0.6, other: 0.2 }];


const focusTrend = [2.4, 3.1, 4.6, 3.9, 5.2, 4.4, 6.1, 5.4, 6.8, 5.9, 7.2, 6.4];

export function Dashboards() {
  const [range, setRange] = useState<Range>('week');
  const { trackedSeconds, focusSeconds, meetingSeconds, breakSeconds } = useTracking();

  const maxBar = Math.max(...weekBars.map((bar) => bar.focus + bar.other));
  const maxTrend = Math.max(...focusTrend);
  const trendPoints = focusTrend.
  map((value, index) => `${index / (focusTrend.length - 1) * 100},${40 - value / maxTrend * 36}`).
  join(' ');

  const activeProjects = projects.filter((project) => project.status !== 'archived');
  const projectTotal = activeProjects.reduce((sum, project) => sum + project.trackedMinutes, 0);
  const ranked = [...activeProjects].sort((a, b) => b.trackedMinutes - a.trackedMinutes);
  const topProjects = ranked.slice(0, 5);
  const otherMinutes = ranked.slice(5).reduce((sum, project) => sum + project.trackedMinutes, 0);
  const mix = [
  ...topProjects.map((project) => ({
    id: project.id,
    name: project.name,
    color: project.color,
    minutes: project.trackedMinutes
  })),
  ...(otherMinutes > 0 ?
  [{ id: 'other', name: `Other projects (${ranked.length - 5})`, color: '#c9c2f2', minutes: otherMinutes }] :
  [])];


  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<LayoutDashboardIcon className="h-4 w-4 text-muted" />}
        title="Dashboards"
        actions={
        <Segmented
          ariaLabel="Dashboard range"
          size="sm"
          value={range}
          onChange={setRange}
          options={[
          { value: 'week', label: 'This week' },
          { value: 'month', label: 'Month' },
          { value: 'quarter', label: 'Quarter' }]
          } />

        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <section className="rounded-xl border border-line bg-surface p-6 shadow-panel">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[12px] text-muted">Tracked today · live</p>
              <p className="tabular mt-1 text-[40px] font-semibold leading-none tracking-tight text-ink">
                {formatCompact(trackedSeconds)}
              </p>
            </div>
            <MetricRow
              className="sm:grid-cols-3"
              items={[
              { label: 'Focus', value: formatDuration(focusSeconds), tone: 'accent' },
              { label: 'Meetings', value: formatDuration(meetingSeconds) },
              { label: 'Breaks', value: formatDuration(breakSeconds) }]
              } />
            
          </div>

          <div className="mt-7 flex h-[180px] items-end gap-3">
            {weekBars.map((bar, index) => {
              const total = bar.focus + bar.other;
              return (
                <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                  <span className="tabular text-[11px] text-faint">{total.toFixed(1)}</span>
                  <div className="flex w-full flex-col justify-end" style={{ height: 130 }}>
                    <div
                      className="w-full rounded-t-[3px] bg-[#c9c2f2]"
                      style={{ height: `${bar.other / maxBar * 130}px` }} />
                    
                    <div
                      className={`w-full ${index === 1 ? 'bg-accent' : 'bg-accent/70'}`}
                      style={{ height: `${bar.focus / maxBar * 130}px` }} />
                    
                  </div>
                  <span className={`text-[11px] ${index === 1 ? 'font-semibold text-accent-ink' : 'text-muted'}`}>
                    {bar.label}
                  </span>
                </div>);

            })}
          </div>
          <div className="mt-3 flex gap-4 border-t border-line pt-3 text-[12px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-[8px] w-[8px] rounded-sm bg-accent" /> Focus
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-[8px] w-[8px] rounded-sm bg-[#c9c2f2]" /> Other tracked
            </span>
          </div>
        </section>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <Panel title="Focus trend · 12 weeks" className="xl:col-span-2">
            <svg viewBox="0 0 100 44" preserveAspectRatio="none" className="h-[150px] w-full" role="img" aria-label="Focus hours over the last 12 weeks">
              <polyline
                points={`0,44 ${trendPoints} 100,44`}
                style={{ fill: 'rgb(var(--accent) / 0.12)', stroke: 'none' }} />
              
              <polyline
                points={trendPoints}
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                style={{ fill: 'none', stroke: 'rgb(var(--accent))' }} />
              
            </svg>
            <div className="mt-2 flex justify-between border-t border-line pt-2 text-[11px] text-faint">
              <span>Jun 23</span>
              <span>Aug 4</span>
              <span>Sep 15</span>
            </div>
          </Panel>

          <Panel title="Project mix">
            <div className="flex flex-col items-center gap-4">
              <Donut
                size={132}
                thickness={15}
                total={formatCompact(projectTotal * 60)}
                segments={mix.map((item) => ({ value: item.minutes, color: item.color }))} />
              
              <ul className="w-full space-y-1.5">
                {mix.map((item) =>
                <li key={item.id} className="flex items-center gap-2 text-[12px]">
                    <span className="h-[8px] w-[8px] shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="min-w-0 flex-1 truncate text-ink">{item.name}</span>
                    <span className="tabular text-muted">{percent(item.minutes, projectTotal)}%</span>
                  </li>
                )}
              </ul>
            </div>
          </Panel>
        </div>
      </div>
    </div>);

}