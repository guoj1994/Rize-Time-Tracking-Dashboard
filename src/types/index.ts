export type SessionState = 'locked' | 'running' | 'paused' | 'break';

export type SessionKind = 'focus' | 'meeting' | 'break';

export type ActivityCategory = 'focus' | 'meeting' | 'break' | 'other';

export type PlanTier = 'basic' | 'professional' | 'max';

export interface SessionConfig {
  kind: SessionKind;
  plannedSeconds: number;
  goal: string;
  taskId: string | null;
  projectId: string | null;
  clientId: string | null;
  sound: string;
  autoBreak: boolean;
  blockDistractions: boolean;
  muteNotifications: boolean;
}

export interface AppUsage {
  name: string;
  kind: 'app' | 'website';
  category: 'work' | 'communication' | 'meeting' | 'other';
  seconds: number;
}

export interface DayBlock {
  id: string;
  title: string;
  detail: string;
  app: string;
  startMinute: number;
  minutes: number;
  aiCategory: ActivityCategory;
  confidence: number;
  reason: string;
}

export interface LiveEntry {
  id: string;
  app: string;
  website: string | null;
  seconds: number;
  aiCategory: ActivityCategory;
  confidence: number;
  reason: string;
}

export interface TimeEntry {
  id: string;
  title: string;
  project: string;
  client: string;
  label: string;
  day: string;
  start: string;
  minutes: number;
  billable: boolean;
  source: 'auto' | 'manual' | 'timer';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  color: string;
  trackedMinutes: number;
  budgetMinutes: number;
  rate: number;
  status: 'active' | 'archived' | 'at-risk';
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  projects: number;
  trackedMinutes: number;
  billed: number;
  unbilled: number;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  status: 'todo' | 'active' | 'done';
  minutes: number;
  estimateMinutes: number;
  due: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  scope: string;
  cadence: string;
  lastRun: string;
  icon: 'calendar' | 'sunrise';
}

export interface ReportRun {
  id: string;
  name: string;
  range: string;
  generatedAt: string;
  status: 'ready' | 'attention' | 'failed';
  template: 'daily' | 'weekly';
}

export interface PlanOption {
  id: PlanTier;
  name: string;
  tagline: string;
  priceAnnual: number;
  priceQuarterly: number;
  priceMonthly: number;
  saveAnnual: string;
  saveQuarterly: string;
  credits: string;
  badge?: string;
  badgeTone?: 'accent' | 'positive';
  inherits?: string;
  features: string[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  team: string;
  trackedMinutes: number;
  status: 'active' | 'invited';
}

export interface Invoice {
  id: string;
  number: string;
  client: string;
  issued: string;
  due: string;
  amount: number;
  status: 'paid' | 'sent' | 'draft' | 'overdue';
}