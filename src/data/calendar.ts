import type { DayBlock } from '../types';

export const today = { weekday: 'Tuesday', label: 'Sep 15, 2026', short: 'Tue, Sep 15' };

/** Everything captured locally today, already labeled by the on-device classifier. */
export const dayBlocks: DayBlock[] = [
{
  id: 'b1',
  title: '044 Video 4 (Backend)',
  detail: 'Cursor · EndtoEnd_ai_bottcamp',
  app: 'Cursor',
  startMinute: 540,
  minutes: 52,
  aiCategory: 'focus',
  confidence: 0.96,
  reason: 'Editor and terminal activity with steady keystrokes'
},
{
  id: 'b2',
  title: 'Away from keyboard',
  detail: 'No input for 11 min',
  app: 'Idle',
  startMinute: 592,
  minutes: 11,
  aiCategory: 'break',
  confidence: 0.88,
  reason: 'No keyboard or mouse input and the screen stayed idle'
},
{
  id: 'b3',
  title: 'Bootcamp standup',
  detail: 'Google Meet · 4 participants',
  app: 'Google Meet',
  startMinute: 603,
  minutes: 26,
  aiCategory: 'meeting',
  confidence: 0.97,
  reason: 'Video call window stayed in the foreground'
},
{
  id: 'b4',
  title: '045 Video 5 (Notebook)',
  detail: 'Cursor · Warp · Grok Bot',
  app: 'Cursor',
  startMinute: 629,
  minutes: 47,
  aiCategory: 'focus',
  confidence: 0.94,
  reason: 'Editor plus terminal with a research assistant alongside'
},
{
  id: 'b5',
  title: 'IINA playback',
  detail: 'IINA · lennysnewsletter.com',
  app: 'IINA',
  startMinute: 676,
  minutes: 26,
  aiCategory: 'break',
  confidence: 0.52,
  reason: 'Media playback, but you were typing notes at the same time'
},
{
  id: 'b6',
  title: 'Lunch',
  detail: 'Mac asleep',
  app: 'Idle',
  startMinute: 702,
  minutes: 34,
  aiCategory: 'break',
  confidence: 0.95,
  reason: 'Machine was asleep for the whole block'
},
{
  id: 'b7',
  title: 'RAG backend research',
  detail: 'smith.langchain.com · perplexity.ai',
  app: 'Cursor',
  startMinute: 736,
  minutes: 38,
  aiCategory: 'focus',
  confidence: 0.87,
  reason: 'Research assistant used alongside the active task'
},
{
  id: 'b8',
  title: 'Slack catch-up',
  detail: 'Slack · 3 channels',
  app: 'Slack',
  startMinute: 774,
  minutes: 17,
  aiCategory: 'other',
  confidence: 0.81,
  reason: 'Communication and coordination, not deep work'
},
{
  id: 'b9',
  title: '拍照学生助手 prototype',
  detail: 'Figma · Cursor',
  app: 'Figma',
  startMinute: 791,
  minutes: 25,
  aiCategory: 'focus',
  confidence: 0.61,
  reason: 'Short bursts across two tools — could be focus or review'
}];