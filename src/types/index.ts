export type SessionState = 'idle' | 'running' | 'paused';

export type ActivityCategory = 'focus' | 'meeting' | 'break' | 'other';

export interface SessionConfig {
  taskName: string;
  projectId: string | null;
  plannedSeconds: number;
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

export interface Project {
  id: string;
  name: string;
  color: string;
  status: 'active' | 'archived';
  trackedMinutes: number;
}

export interface Task {
  id: string;
  title: string;
  projectId: string | null;
  status: 'todo' | 'active' | 'done';
  trackedMinutes: number;
}

export interface CategoryRule {
  id: string;
  pattern: string;
  category: ActivityCategory;
}

export interface PrivacyExclusion {
  id: string;
  value: string;
  kind: 'app' | 'domain';
}