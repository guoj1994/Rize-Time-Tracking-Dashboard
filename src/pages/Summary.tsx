import React, { useState } from 'react';
import { LightbulbIcon, TrendingUpIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { MetricRow } from '../components/ui/Metric';
import { BarRow } from '../components/ui/BarRow';
import { Segmented } from '../components/ui/Segmented';
import { dailySummary, weeklySummary } from '../data/summary';
import { formatMinutes, percent } from '../utils/time';

type Range = 'daily' | 'weekly';

export function Summary() {
  const [range, setRange] = useState<Range>('daily');
  const data = range === 'daily' ? dailySummary : weeklySummary;
  const projectTotal = data.byProject.reduce((sum, item) => sum + item.minutes, 0);
  const taskTotal = data.byTask.reduce((sum, item) => sum + item.minutes, 0);
  const appTotal = data.topApps.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<TrendingUpIcon className="h-4 w-4 text-muted" />}
        title="Summary"
        actions={
        <Segmented
          ariaLabel="Summary range"
          size="sm"
          value={range}
          onChange={setRange}
          options={[
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' }]
          } />

        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto p-5">
        <div className="mx-auto max-w-[880px] space-y-4">
          <Panel title={range === 'daily' ? 'Today' : 'This week'}>
            <MetricRow
              items={[
              { label: 'Tracked', value: formatMinutes(data.totals.trackedMinutes) },
              { label: 'Focus', value: formatMinutes(data.totals.focusMinutes), tone: 'accent' },
              { label: 'Meetings', value: formatMinutes(data.totals.meetingMinutes) },
              { label: 'Breaks', value: formatMinutes(data.totals.breakMinutes) }]
              } />
            
          </Panel>

          <Panel
            title="Insights"
            icon={<LightbulbIcon className="h-[13px] w-[13px] text-warn" />}>
            
            <ul className="space-y-2.5">
              {data.insights.map((insight, index) =>
              <li key={index} className="flex gap-2.5 text-[13px] leading-relaxed text-ink">
                  <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-accent" />
                  {insight}
                </li>
              )}
            </ul>
          </Panel>

          <div className="grid gap-4 md:grid-cols-2">
            <Panel title="Time by project">
              {data.byProject.map((item) =>
              <BarRow
                key={item.id}
                name={item.label}
                time={formatMinutes(item.minutes)}
                percent={percent(item.minutes, projectTotal)}
                color={item.color}
                nameWidth="w-[140px]" />

              )}
            </Panel>

            <Panel title="Time by task">
              {data.byTask.map((item) =>
              <BarRow
                key={item.id}
                name={item.label}
                time={formatMinutes(item.minutes)}
                percent={percent(item.minutes, taskTotal)}
                color={item.color}
                nameWidth="w-[140px]" />

              )}
            </Panel>
          </div>

          <Panel title="Top apps">
            {data.topApps.map((item) =>
            <BarRow
              key={item.id}
              name={item.label}
              time={formatMinutes(item.minutes)}
              percent={percent(item.minutes, appTotal)}
              color={item.color}
              nameWidth="w-[140px]" />

            )}
          </Panel>
        </div>
      </div>
    </div>);

}