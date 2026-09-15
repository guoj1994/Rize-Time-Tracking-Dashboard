import {
  BriefcaseIcon,
  CalendarIcon,
  CircleIcon,
  ClipboardIcon,
  ClockIcon,
  EuroIcon,
  FileTextIcon,
  GlobeIcon,
  LayersIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  PackageIcon,
  SettingsIcon,
  TableIcon,
  TimerIcon,
  TrendingUpIcon,
  UsersIcon } from
'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: typeof CalendarIcon;
  accent?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
{
  title: 'Home',
  items: [{ label: 'Agent', to: '/', icon: CircleIcon, accent: true }]
},
{
  title: 'Track',
  items: [
  { label: 'Calendar', to: '/calendar', icon: CalendarIcon },
  { label: 'My Timesheet', to: '/my-timesheet', icon: TableIcon },
  { label: 'Timer', to: '/timer', icon: TimerIcon },
  { label: 'Activity', to: '/activity', icon: GlobeIcon }]

},
{
  title: 'Analyze',
  items: [
  { label: 'Time Entries', to: '/time-entries', icon: ClockIcon },
  { label: 'Reports', to: '/reports', icon: TrendingUpIcon },
  { label: 'Profitability', to: '/profitability', icon: EuroIcon },
  { label: 'Dashboards', to: '/dashboards', icon: LayoutDashboardIcon },
  { label: 'Timesheets', to: '/timesheets', icon: ClipboardIcon }]

},
{
  title: 'Work',
  items: [
  { label: 'Tasks', to: '/tasks', icon: ListChecksIcon },
  { label: 'Projects', to: '/projects', icon: PackageIcon },
  { label: 'Clients', to: '/clients', icon: BriefcaseIcon }]

},
{
  title: 'Admin',
  items: [
  { label: 'Teams', to: '/teams', icon: LayersIcon },
  { label: 'Members', to: '/members', icon: UsersIcon },
  { label: 'Invoices', to: '/invoices', icon: FileTextIcon },
  { label: 'Settings', to: '/settings', icon: SettingsIcon }]

}];