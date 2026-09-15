import { ActivityIcon, CalendarCheckIcon, CrosshairIcon, PackageIcon, SettingsIcon, TrendingUpIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: typeof CalendarCheckIcon;
}

export const navItems: NavItem[] = [
{ label: 'Today', to: '/', icon: CalendarCheckIcon },
{ label: 'Focus', to: '/focus', icon: CrosshairIcon },
{ label: 'Activity', to: '/activity', icon: ActivityIcon },
{ label: 'Summary', to: '/summary', icon: TrendingUpIcon },
{ label: 'Projects', to: '/projects', icon: PackageIcon },
{ label: 'Settings', to: '/settings', icon: SettingsIcon }];