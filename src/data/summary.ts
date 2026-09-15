export interface SummaryTotals {
  trackedMinutes: number;
  focusMinutes: number;
  meetingMinutes: number;
  breakMinutes: number;
}

export interface SummarySlice {
  id: string;
  label: string;
  color: string;
  minutes: number;
}

export interface SummaryPeriod {
  totals: SummaryTotals;
  byProject: SummarySlice[];
  byTask: SummarySlice[];
  topApps: SummarySlice[];
  insights: string[];
}

export const dailySummary: SummaryPeriod = {
  totals: { trackedMinutes: 161, focusMinutes: 135, meetingMinutes: 26, breakMinutes: 71 },
  byProject: [
  { id: 'p1', label: 'EndtoEnd_ai_bottcamp', color: '#8fbf7a', minutes: 137 },
  { id: 'p4', label: '开发人脸隐私保护App', color: '#e59a9a', minutes: 17 },
  { id: 'p2', label: '拍照学生助手', color: '#5a4ed6', minutes: 7 }],

  byTask: [
  { id: 't044', label: '044 Video 4 (Backend)', color: '#8fbf7a', minutes: 52 },
  { id: 't045', label: '045 Video 5 (Notebook)', color: '#8fbf7a', minutes: 47 },
  { id: 'other', label: 'RAG backend research', color: '#6ec1c8', minutes: 38 },
  { id: 'slack', label: 'Slack catch-up', color: '#c9c2f2', minutes: 17 },
  { id: 'figma', label: '拍照学生助手 prototype', color: '#5a4ed6', minutes: 25 }],

  topApps: [
  { id: 'cursor', label: 'Cursor', color: '#5a4ed6', minutes: 72 },
  { id: 'meet', label: 'Google Meet', color: '#4f9d74', minutes: 26 },
  { id: 'iina', label: 'IINA', color: '#dfa74f', minutes: 26 },
  { id: 'figma', label: 'Figma', color: '#e59a9a', minutes: 15 },
  { id: 'slack', label: 'Slack', color: '#9b9bad', minutes: 17 }],

  insights: [
  'Your longest uninterrupted focus block was 52 minutes on 044 Video 4 — right after your first coffee.',
  'Meetings only took 16% of tracked time today, well below your 4-day average of 24%.',
  'IINA played for 26 minutes overlapping with note-taking — reclassify it if that was actually research.']

};

export const weeklySummary: SummaryPeriod = {
  totals: { trackedMinutes: 1_930, focusMinutes: 1_390, meetingMinutes: 260, breakMinutes: 280 },
  byProject: [
  { id: 'p1', label: 'EndtoEnd_ai_bottcamp', color: '#8fbf7a', minutes: 1_120 },
  { id: 'p4', label: '开发人脸隐私保护App', color: '#e59a9a', minutes: 260 },
  { id: 'p2', label: '拍照学生助手', color: '#5a4ed6', minutes: 210 },
  { id: 'p3', label: 'AI 精读器', color: '#6ec1c8', minutes: 180 },
  { id: 'p6', label: 'create workflow for weixin page', color: '#a58ce0', minutes: 160 }],

  byTask: [
  { id: 't043', label: '043 Video 3 (Backend)', color: '#8fbf7a', minutes: 212 },
  { id: 't042', label: '042 Video 2 (Notebook)', color: '#8fbf7a', minutes: 188 },
  { id: 't044', label: '044 Video 4 (Backend)', color: '#8fbf7a', minutes: 185 },
  { id: 'tph', label: '相机权限与马赛克预览', color: '#e59a9a', minutes: 96 },
  { id: 'tai', label: '划词翻译弹层交互', color: '#6ec1c8', minutes: 74 }],

  topApps: [
  { id: 'cursor', label: 'Cursor', color: '#5a4ed6', minutes: 720 },
  { id: 'figma', label: 'Figma', color: '#e59a9a', minutes: 150 },
  { id: 'meet', label: 'Google Meet', color: '#4f9d74', minutes: 260 },
  { id: 'iina', label: 'IINA', color: '#dfa74f', minutes: 130 },
  { id: 'slack', label: 'Slack', color: '#9b9bad', minutes: 90 }],

  insights: [
  'Tuesday and Wednesday mornings are consistently your deepest focus windows — protect 9–11 AM there.',
  'Meetings grew to 13% of tracked time this week, up from 8% last week.',
  'You completed three tasks on EndtoEnd_ai_bottcamp back-to-back — momentum is building on that project.']

};