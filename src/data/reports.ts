import type { ReportRun, ReportTemplate } from '../types';

export const reportTemplates: ReportTemplate[] = [
{
  id: 'weekly-review',
  name: 'Weekly review',
  scope: 'Just Me · Weekly',
  cadence: 'Template',
  lastRun: 'Sep 14, 5:00 AM',
  icon: 'calendar'
},
{
  id: 'daily-summary',
  name: 'Daily summary',
  scope: 'Just Me · Daily',
  cadence: 'Template',
  lastRun: 'Sep 15, 8:00 PM',
  icon: 'sunrise'
}];


export const reportRuns: ReportRun[] = [
{ id: 'r1', name: 'Daily summary', range: 'Sep 10', generatedAt: 'Sep 10  8:00 PM', status: 'ready', template: 'daily' },
{ id: 'r2', name: 'Daily summary', range: 'Sep 9', generatedAt: 'Sep 9  8:00 PM', status: 'ready', template: 'daily' },
{ id: 'r3', name: 'Daily summary', range: 'Sep 8', generatedAt: 'Sep 8  8:00 PM', status: 'ready', template: 'daily' },
{ id: 'r4', name: 'Daily summary', range: 'Sep 7', generatedAt: 'Sep 7  8:15 PM', status: 'ready', template: 'daily' },
{ id: 'r5', name: 'Weekly review', range: 'Aug 31 – Sep 7', generatedAt: 'Sep 7  5:07 AM', status: 'ready', template: 'weekly' },
{ id: 'r6', name: 'Daily summary', range: 'Sep 4', generatedAt: 'Sep 4  8:00 PM', status: 'failed', template: 'daily' },
{ id: 'r7', name: 'Daily summary', range: 'Sep 3', generatedAt: 'Sep 3  8:00 PM', status: 'ready', template: 'daily' },
{ id: 'r8', name: 'Daily summary', range: 'Sep 2', generatedAt: 'Sep 2  8:00 PM', status: 'ready', template: 'daily' },
{ id: 'r9', name: 'Daily summary', range: 'Sep 1', generatedAt: 'Sep 1  8:00 PM', status: 'ready', template: 'daily' },
{ id: 'r10', name: 'Weekly review', range: 'Aug 24 – Aug 31', generatedAt: 'Aug 31  5:04 AM', status: 'attention', template: 'weekly' }];


export const reportDetail = {
  period: '2026年9月10日',
  trigger: 'Scheduled',
  workHours: {
    total: '3 hr 5 min',
    percentOfTarget: '39%',
    target: '8 hr 0 min',
    average: '2 hr 25 min',
    difference: '39 min',
    narrative:
    'You worked 3 hr 5 min for the day, 27% above the 4-day average of 2 hr 25 min. That is 61% below your target of 8 hr 0 min.'
  },
  focus: {
    total: '3 hr 5 min',
    percentOfTracked: '116%',
    averageSession: '37 min',
    sessions: 5,
    average: '2 hr 45 min',
    delta: '19 min',
    narrative: 'You logged 3 hr 5 min of focus time for the day, 12% above the 4-day average of 2 hr 45 min.'
  },
  meetings: {
    count: 0,
    averageLength: '0 min',
    busiestDay: '–',
    average: '0 min',
    delta: '0 min'
  },
  projectWork: [{ name: 'EndtoEnd_ai_bottcamp', time: '3 hr 5 min', percent: 100, color: '#8fbf7a' }],
  taskWork: {
    total: '3 hr 5 min',
    average: '2 hr 9 min',
    difference: '55 min',
    rows: [{ name: '044 Video 4 (Backend)', time: '3 hr 5 min', percent: 100, delta: '60%', color: '#e59a9a' }]
  },
  labels: [{ name: 'Uncategorized', time: '3 hr 5 min', percent: 100, color: '#5a4ed6' }],
  topApps: [
  { name: 'Cursor', time: '1 hr 12 min', percent: 53 },
  { name: 'Grok Bot', time: '30 min', percent: 22 },
  { name: 'IINA', time: '26 min', percent: 19 },
  { name: 'Gemini', time: '3 min', percent: 3 },
  { name: 'Rize', time: '2 min', percent: 2 },
  { name: 'Warp', time: '2 min', percent: 2 }],

  topWebsites: [
  { name: 'lennysnewsletter.com', time: '9 min', percent: 28 },
  { name: 'smith.langchain.com', time: '7 min', percent: 22 },
  { name: 'localhost:8501', time: '6 min', percent: 21 },
  { name: 'perplexity.ai', time: '4 min', percent: 13 },
  { name: 'x.com', time: '3 min', percent: 11 },
  { name: 'cursor.com', time: '1 min', percent: 5 }]

};