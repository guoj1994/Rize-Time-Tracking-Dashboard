import type { AppUsage } from '../types';

/** Time already tracked today before the simulated session starts. */
export const seedTrackedSeconds = 9_660;
export const seedFocusSeconds = 8_100;
export const seedMeetingSeconds = 1_560;
export const seedBreakSeconds = 1_020;
export const seedSessions = 5;
export const dailyTargetSeconds = 28_800;

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


/** Apps the simulated tracker cycles through while a focus session is running. */
export const focusRotation: {app: string;website?: string;category: AppUsage['category'];}[] = [
{ app: 'Cursor', website: 'localhost:8501', category: 'work' },
{ app: 'Warp', category: 'work' },
{ app: 'Cursor', website: 'cursor.com', category: 'work' },
{ app: 'Grok Bot', category: 'work' },
{ app: 'Figma', category: 'work' },
{ app: 'Cursor', website: 'smith.langchain.com', category: 'work' },
{ app: 'Slack', category: 'communication' },
{ app: 'Gemini', website: 'perplexity.ai', category: 'work' }];


export const sounds = [
{ id: 'silence', title: 'Silence', artist: 'No audio', tile: '#9b9bad' },
{ id: 'lofi', title: 'Lo-Fi Beats', artist: 'Rize Focus', tile: '#4a3eb0' },
{ id: 'deep', title: 'Deep Work', artist: 'Rize Focus', tile: '#2c6b47' },
{ id: 'rain', title: 'Rain & Thunder', artist: 'Rize Ambient', tile: '#3a5d8f' },
{ id: 'cafe', title: 'Café Ambience', artist: 'Rize Ambient', tile: '#8a5a17' }];


export const focusDurations = [
{ value: 0, label: 'No limit' },
{ value: 25, label: '25 min' },
{ value: 30, label: '30 min' },
{ value: 45, label: '45 min' },
{ value: 60, label: '60 min' },
{ value: 90, label: '90 min' }];


export const meetingDurations = [
{ value: 15, label: '15 min' },
{ value: 30, label: '30 min' },
{ value: 45, label: '45 min' },
{ value: 60, label: '60 min' },
{ value: 90, label: '90 min' }];


export const breakDurations = [
{ value: 5, label: '5 min' },
{ value: 10, label: '10 min' },
{ value: 15, label: '15 min' },
{ value: 20, label: '20 min' },
{ value: 30, label: '30 min' }];