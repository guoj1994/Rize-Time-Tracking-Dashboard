import type { TimeEntry } from '../types';

export const timeEntries: TimeEntry[] = [
{
  id: 'e1',
  title: '044 Video 4 (Backend)',
  project: 'EndtoEnd_ai_bottcamp',
  client: 'Internal',
  label: 'Uncategorized',
  day: 'Today',
  start: '9:00 AM',
  minutes: 52,
  billable: false,
  source: 'auto'
},
{
  id: 'e2',
  title: 'Bootcamp standup',
  project: 'EndtoEnd_ai_bottcamp',
  client: 'Internal',
  label: 'Meeting',
  day: 'Today',
  start: '10:03 AM',
  minutes: 26,
  billable: false,
  source: 'auto'
},
{
  id: 'e3',
  title: 'Retrieval eval harness',
  project: 'EndtoEnd_ai_bottcamp',
  client: 'Internal',
  label: 'Deep Work',
  day: 'Today',
  start: '10:29 AM',
  minutes: 47,
  billable: false,
  source: 'timer'
},
{
  id: 'e4',
  title: 'Onboarding flow review',
  project: 'Northwind Onboarding Revamp',
  client: 'Northwind Labs',
  label: 'Design',
  day: 'Today',
  start: '12:16 PM',
  minutes: 38,
  billable: true,
  source: 'auto'
},
{
  id: 'e5',
  title: 'Token collision audit',
  project: 'Kestrel Design System',
  client: 'Kestrel Studio',
  label: 'Design',
  day: 'Yesterday',
  start: '2:05 PM',
  minutes: 74,
  billable: true,
  source: 'auto'
},
{
  id: 'e6',
  title: 'Legacy dashboards query',
  project: 'Atlas Analytics Migration',
  client: 'Atlas Freight',
  label: 'Engineering',
  day: 'Yesterday',
  start: '9:40 AM',
  minutes: 142,
  billable: true,
  source: 'auto'
},
{
  id: 'e7',
  title: 'Weekly review + planning',
  project: 'Internal',
  client: 'Internal',
  label: 'Admin',
  day: 'Yesterday',
  start: '8:15 AM',
  minutes: 31,
  billable: false,
  source: 'manual'
},
{
  id: 'e8',
  title: 'Client report template v2',
  project: 'Northwind Onboarding Revamp',
  client: 'Northwind Labs',
  label: 'Admin',
  day: 'Sep 13',
  start: '11:20 AM',
  minutes: 128,
  billable: true,
  source: 'timer'
},
{
  id: 'e9',
  title: 'Loom recap for 043',
  project: 'EndtoEnd_ai_bottcamp',
  client: 'Internal',
  label: 'Uncategorized',
  day: 'Sep 12',
  start: '4:02 PM',
  minutes: 64,
  billable: false,
  source: 'auto'
},
{
  id: 'e10',
  title: 'Halcyon accessibility pass',
  project: 'Halcyon Mobile Audit',
  client: 'Halcyon Health',
  label: 'Engineering',
  day: 'Sep 12',
  start: '9:05 AM',
  minutes: 96,
  billable: true,
  source: 'auto'
}];


export const entryLabels = ['Uncategorized', 'Deep Work', 'Design', 'Engineering', 'Meeting', 'Admin'];