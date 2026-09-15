import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpIcon,
  ExternalLinkIcon,
  MessageSquareIcon,
  SparklesIcon,
  SunriseIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TrendingUpIcon } from
'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { MetricRow } from '../components/ui/Metric';
import { BarRow } from '../components/ui/BarRow';
import { Donut } from '../components/ui/Donut';
import { Badge } from '../components/ui/Badge';
import { reportDetail } from '../data/reports';
import { useShell } from '../contexts/ShellContext';

function AiPanel({ title, locked, body }: {title: string;locked: boolean;body: string;}) {
  return (
    <Panel
      title={title}
      icon={<SparklesIcon className="h-[13px] w-[13px] text-accent" />}
      className={locked ? 'bg-accent-soft/40' : ''}>
      
      {locked ?
      <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-muted">This section requires a paid subscription.</p>
          <Link
          to="/plans"
          className="rounded-lg border border-accent/40 bg-surface px-3 py-1.5 text-[12px] font-medium text-accent-ink transition-colors duration-150 ease-snap hover:bg-accent-soft">
          
            Upgrade plan
          </Link>
        </div> :

      <p className="text-[13px] leading-relaxed text-ink">{body}</p>
      }
    </Panel>);

}

export function ReportDetail() {
  const { plan } = useShell();
  const locked = plan === 'basic';
  const detail = reportDetail;

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={<TrendingUpIcon className="h-4 w-4 text-muted" />}
        title="Daily summary"
        breadcrumb={
        <>
            <Link to="/reports" className="text-muted transition-colors duration-150 ease-snap hover:text-ink">
              Reports
            </Link>
            <span className="text-faint">/</span>
            <span className="flex items-center gap-1.5 truncate">
              <SunriseIcon className="h-[14px] w-[14px] text-warn" />
              Daily summary
            </span>
          </>
        }
        actions={
        <>
            <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-[7px] text-[13px] text-ink transition-colors duration-150 ease-snap hover:border-accent/40">
            
              <MessageSquareIcon className="h-[14px] w-[14px]" />
              Chat With Report
            </button>
            <button
            type="button"
            aria-label="Helpful"
            className="rounded-lg border border-line bg-surface p-[7px] text-muted transition-colors duration-150 ease-snap hover:text-positive">
            
              <ThumbsUpIcon className="h-[14px] w-[14px]" />
            </button>
            <button
            type="button"
            aria-label="Not helpful"
            className="rounded-lg border border-line bg-surface p-[7px] text-muted transition-colors duration-150 ease-snap hover:text-danger">
            
              <ThumbsDownIcon className="h-[14px] w-[14px]" />
            </button>
          </>
        } />
      

      <div className="rize-scroll flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[880px] px-5 py-5">
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
            <span className="flex items-center gap-2 text-muted">
              Status <Badge tone="positive">Ready</Badge>
            </span>
            <span className="text-muted">
              Period <span className="text-ink">{detail.period}</span>
            </span>
            <span className="text-muted">
              Trigger <span className="text-ink">{detail.trigger}</span>
            </span>
          </div>

          <div className="space-y-4">
            <AiPanel
              title="AI Summary"
              locked={locked}
              body="A strong build day: 3 hr 5 min tracked with every minute landing in focus time and no meetings to break it up. The work stayed on one task — 044 Video 4 (Backend) — which is why context switching was low." />
            
            <AiPanel
              title="AI Analysis"
              locked={locked}
              body="Focus quality was above your 4-day average, but total tracked time sits 61% below your 8 hr target. The most common interruption pattern was IINA playback between Cursor sessions. Consider blocking a second afternoon session to close the target gap." />
            

            <Panel title="Work Hours">
              <MetricRow
                items={[
                { label: 'Total', value: detail.workHours.total },
                {
                  label: 'Percent of Target',
                  value: detail.workHours.percentOfTarget,
                  hint: detail.workHours.target,
                  tone: 'warn'
                },
                { label: '4-day average', value: detail.workHours.average },
                {
                  label: 'Difference',
                  value:
                  <span className="flex items-center gap-1">
                        {detail.workHours.difference}
                        <ArrowUpIcon className="h-[13px] w-[13px]" />
                      </span>

                }]
                } />
              
              <p className="mt-4 border-t border-line pt-3 text-[13px] text-muted">{detail.workHours.narrative}</p>
            </Panel>

            <Panel title="Focus">
              <MetricRow
                items={[
                { label: 'Focus Time', value: detail.focus.total },
                { label: 'Percent of Tracked', value: detail.focus.percentOfTracked },
                { label: 'Average Session', value: detail.focus.averageSession, hint: `${detail.focus.sessions} sessions` },
                { label: '4-day average', value: detail.focus.average, hint: `${detail.focus.delta} ↑` }]
                } />
              
              <p className="mt-4 border-t border-line pt-3 text-[13px] text-muted">{detail.focus.narrative}</p>
            </Panel>

            <Panel title="Meetings">
              <MetricRow
                items={[
                { label: 'Meetings', value: detail.meetings.count },
                { label: 'Average Length', value: detail.meetings.averageLength },
                { label: 'Busiest Day', value: detail.meetings.busiestDay },
                {
                  label: '4-day average',
                  value: detail.meetings.average,
                  hint: <span className="text-danger">↑ {detail.meetings.delta}</span>
                }]
                } />
              
            </Panel>

            <Panel title="Client Work">
              <p className="text-[13px] text-muted">No tracked time in this period.</p>
            </Panel>

            <Panel title="Project Work">
              <div className="flex flex-wrap items-center gap-6">
                <Donut
                  total="3h 5m"
                  segments={detail.projectWork.map((item) => ({ value: item.percent, color: item.color }))} />
                
                <div className="min-w-[260px] flex-1">
                  {detail.projectWork.map((item) =>
                  <BarRow key={item.name} name={item.name} time={item.time} percent={item.percent} color={item.color} />
                  )}
                </div>
              </div>
            </Panel>

            <Panel title="Tasks">
              <MetricRow
                className="sm:grid-cols-3"
                items={[
                { label: 'Total', value: detail.taskWork.total },
                { label: '4-day average', value: detail.taskWork.average },
                {
                  label: 'Difference',
                  value:
                  <span className="flex items-center gap-1">
                        <ArrowUpIcon className="h-[13px] w-[13px]" />
                        {detail.taskWork.difference}
                      </span>,

                  tone: 'positive'
                }]
                } />
              
              <div className="mt-4 border-t border-line pt-2">
                {detail.taskWork.rows.map((row) =>
                <BarRow
                  key={row.name}
                  name={row.name}
                  time={row.time}
                  percent={row.percent}
                  color={row.color}
                  delta={<span className="text-positive">{row.delta} ↑</span>} />

                )}
              </div>
            </Panel>

            <Panel title="Labels">
              <div className="flex flex-wrap items-center gap-6">
                <Donut
                  total="3h 5m"
                  segments={detail.labels.map((item) => ({ value: item.percent, color: item.color }))} />
                
                <div className="min-w-[260px] flex-1">
                  {detail.labels.map((item) =>
                  <BarRow key={item.name} name={item.name} time={item.time} percent={item.percent} color={item.color} />
                  )}
                </div>
              </div>
            </Panel>

            <Panel
              title="Apps & Websites"
              action={
              <button
                type="button"
                className="text-[12px] text-muted transition-colors duration-150 ease-snap hover:text-ink">
                
                  Copy Markdown
                </button>
              }>
              
              <p className="mb-1 text-[12px] text-muted">Top Apps</p>
              {detail.topApps.map((app) =>
              <BarRow key={app.name} name={app.name} time={app.time} percent={app.percent} nameWidth="w-[160px]" />
              )}
              <p className="mb-1 mt-5 text-[12px] text-muted">Top Websites</p>
              {detail.topWebsites.map((site) =>
              <BarRow key={site.name} name={site.name} time={site.time} percent={site.percent} nameWidth="w-[160px]" />
              )}
            </Panel>

            <div className="flex justify-end pb-2">
              <button
                type="button"
                className="flex items-center gap-1.5 text-[12px] text-muted transition-colors duration-150 ease-snap hover:text-ink">
                
                View underlying data
                <ExternalLinkIcon className="h-[12px] w-[12px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}