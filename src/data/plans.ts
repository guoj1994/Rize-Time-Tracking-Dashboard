import type { PlanOption } from '../types';

export const planOptions: PlanOption[] = [
{
  id: 'basic',
  name: 'Basic',
  tagline: 'AI time tracking',
  priceAnnual: 9.99,
  priceQuarterly: 11.99,
  priceMonthly: 12.99,
  saveAnnual: 'Save 23%',
  saveQuarterly: 'Save 8%',
  credits: '500 AI credits/mo',
  features: [
  'Automatic app & website tracking',
  'AI auto-categorization & tagging',
  'AI chat',
  'AI productivity & focus insights',
  'Focus music & smart breaks',
  'Personal reports',
  'Data exports']

},
{
  id: 'professional',
  name: 'Professional',
  tagline: 'For freelancers and consultants',
  priceAnnual: 23.99,
  priceQuarterly: 26.99,
  priceMonthly: 28.99,
  saveAnnual: 'Save 17%',
  saveQuarterly: 'Save 7%',
  credits: '1,000 AI credits/mo',
  badge: 'Most Popular',
  badgeTone: 'accent',
  inherits: 'Everything in Basic, plus:',
  features: [
  'Client & scheduled reports (PDF, CSV)',
  'AI efficiency dashboard',
  'AI automations & agents',
  'MCP server access',
  'API, Webhooks & Zapier']

},
{
  id: 'max',
  name: 'Max',
  tagline: 'For power users and solo agencies',
  priceAnnual: 39.99,
  priceQuarterly: 44.99,
  priceMonthly: 49.99,
  saveAnnual: 'Save 20%',
  saveQuarterly: 'Save 10%',
  credits: '3,000 AI credits/mo',
  badge: 'Best Value',
  badgeTone: 'positive',
  inherits: 'Everything in Professional, plus:',
  features: ['Highest AI credit allotment', 'Priority email & feature request support']
}];