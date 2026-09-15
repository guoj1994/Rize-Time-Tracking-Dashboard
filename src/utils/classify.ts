import type { ActivityCategory } from '../types';

export interface Classification {
  category: ActivityCategory;
  confidence: number;
  reason: string;
}

interface Rule {
  match: RegExp;
  category: ActivityCategory;
  confidence: number;
  reason: string;
}

/**
 * Stand-in for the model that labels every captured app/site. Rules are ordered —
 * the first match wins — and each returns the confidence the UI shows next to the label.
 */
const rules: Rule[] = [
{
  match: /meet|zoom|teams|webex|huddle/i,
  category: 'meeting',
  confidence: 0.97,
  reason: 'Video call window stayed in the foreground'
},
{
  match: /cursor|warp|xcode|vs ?code|terminal|iterm|localhost/i,
  category: 'focus',
  confidence: 0.96,
  reason: 'Editor and terminal activity with steady keystrokes'
},
{
  match: /figma|sketch|framer/i,
  category: 'focus',
  confidence: 0.92,
  reason: 'Design tool with continuous canvas edits'
},
{
  match: /langchain|perplexity|chatgpt|gemini|grok|claude|notebook/i,
  category: 'focus',
  confidence: 0.87,
  reason: 'Research assistant used alongside the active task'
},
{
  match: /iina|youtube|netflix|spotify|bilibili/i,
  category: 'break',
  confidence: 0.74,
  reason: 'Media playback with no input for minutes at a time'
},
{
  match: /x\.com|twitter|reddit|instagram/i,
  category: 'break',
  confidence: 0.69,
  reason: 'Social feed browsing in short bursts'
},
{
  match: /slack|mail|gmail|outlook|linear|notion/i,
  category: 'other',
  confidence: 0.81,
  reason: 'Communication and coordination, not deep work'
},
{
  match: /lennysnewsletter|substack|medium|docs\./i,
  category: 'other',
  confidence: 0.63,
  reason: 'Reading — could be research or downtime'
}];


export function classify(app: string, website?: string | null): Classification {
  const haystack = `${app} ${website ?? ''}`;
  const hit = rules.find((rule) => rule.match.test(haystack));
  if (hit) return { category: hit.category, confidence: hit.confidence, reason: hit.reason };
  return { category: 'other', confidence: 0.48, reason: 'No strong signal yet — confirm the category' };
}

export const categoryMeta: Record<
  ActivityCategory,
  {label: string;dot: string;chip: string;block: string;text: string;}> =
{
  focus: {
    label: 'Focus',
    dot: 'bg-accent',
    chip: 'bg-accent-soft text-accent-ink border-accent/25',
    block: 'bg-accent-soft border-accent/35',
    text: 'text-accent-ink'
  },
  meeting: {
    label: 'Meeting',
    dot: 'bg-[#4f9d74]',
    chip: 'bg-[#e9f5ee] text-[#1f7a4d] border-[#bfe0cd]',
    block: 'bg-[#eaf5ef] border-[#b7d9c6]',
    text: 'text-[#1f7a4d]'
  },
  break: {
    label: 'Break',
    dot: 'bg-[#dfa74f]',
    chip: 'bg-[#fdf4e3] text-[#8a5a17] border-[#eddcb4]',
    block: 'bg-[#fdf3e7] border-[#ebd2ac]',
    text: 'text-[#8a5a17]'
  },
  other: {
    label: 'Other',
    dot: 'bg-faint',
    chip: 'bg-canvas text-muted border-line',
    block: 'bg-canvas border-line',
    text: 'text-muted'
  }
};

export const categoryOrder: ActivityCategory[] = ['focus', 'meeting', 'break', 'other'];