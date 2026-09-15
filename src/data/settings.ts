import type { CategoryRule, PrivacyExclusion } from '../types';

export const categoryRules: CategoryRule[] = [
{ id: 'r1', pattern: 'Cursor, Warp, VS Code, Terminal', category: 'focus' },
{ id: 'r2', pattern: 'Figma, Sketch, Framer', category: 'focus' },
{ id: 'r3', pattern: 'Google Meet, Zoom, Teams', category: 'meeting' },
{ id: 'r4', pattern: 'IINA, YouTube, Spotify', category: 'break' },
{ id: 'r5', pattern: 'x.com, Reddit, Instagram', category: 'break' },
{ id: 'r6', pattern: 'Slack, Mail, Notion', category: 'other' }];


export const privacyExclusions: PrivacyExclusion[] = [
{ id: 'e1', value: '1Password', kind: 'app' },
{ id: 'e2', value: 'Messages', kind: 'app' },
{ id: 'e3', value: 'banking.com', kind: 'domain' },
{ id: 'e4', value: 'health.gov', kind: 'domain' }];