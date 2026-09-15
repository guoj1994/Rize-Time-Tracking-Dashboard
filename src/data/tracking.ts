import type { AppUsage } from '../types';

/** Time already captured today before the simulated session starts. */
export const seedTrackedSeconds = 9_660;
export const seedFocusSeconds = 8_100;
export const seedMeetingSeconds = 1_560;
export const seedBreakSeconds = 1_020;
export const seedSessions = 5;

export const seedAppUsage: AppUsage[] = [
{ name: 'Cursor', kind: 'app', category: 'work', seconds: 4_320 },
{ name: 'Grok Bot', kind: 'app', category: 'work', seconds: 1_800 },
{ name: 'IINA', kind: 'app', category: 'other', seconds: 1_560 },
{ name: 'Figma', kind: 'app', category: 'work', seconds: 900 },
{ name: 'Google Meet', kind: 'app', category: 'meeting', seconds: 1_560 },
{ name: 'Slack', kind: 'app', category: 'communication', seconds: 540 },
{ name: 'Gemini', kind: 'app', category: 'work', seconds: 180 },
{ name: 'Warp', kind: 'app', category: 'work', seconds: 120 }];


export const seedWebsiteUsage: AppUsage[] = [
{ name: 'lennysnewsletter.com', kind: 'website', category: 'other', seconds: 540 },
{ name: 'smith.langchain.com', kind: 'website', category: 'work', seconds: 420 },
{ name: 'localhost:8501', kind: 'website', category: 'work', seconds: 360 },
{ name: 'perplexity.ai', kind: 'website', category: 'work', seconds: 240 },
{ name: 'x.com', kind: 'website', category: 'other', seconds: 180 },
{ name: 'cursor.com', kind: 'website', category: 'work', seconds: 60 }];


/** Apps the local capture cycles through while a focus session is running. */
export const focusRotation: {app: string;website?: string;category: AppUsage['category'];}[] = [
{ app: 'Cursor', website: 'localhost:8501', category: 'work' },
{ app: 'Warp', category: 'work' },
{ app: 'Cursor', website: 'cursor.com', category: 'work' },
{ app: 'Grok Bot', category: 'work' },
{ app: 'Figma', category: 'work' },
{ app: 'Cursor', website: 'smith.langchain.com', category: 'work' },
{ app: 'Gemini', website: 'perplexity.ai', category: 'work' }];


export const focusDurations = [
{ value: 25, label: '25 min' },
{ value: 45, label: '45 min' },
{ value: 60, label: '60 min' },
{ value: 90, label: '90 min' },
{ value: 0, label: 'No limit' }];