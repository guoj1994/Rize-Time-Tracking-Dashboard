import type { Client } from '../types';

export const clients: Client[] = [
{
  id: 'c1',
  name: 'Northwind Labs',
  contact: 'dana@northwindlabs.com',
  projects: 2,
  trackedMinutes: 2_640,
  billed: 3_040,
  unbilled: 1_140,
  color: '#5a4ed6'
},
{
  id: 'c2',
  name: 'Kestrel Studio',
  contact: 'sam@kestrel.studio',
  projects: 1,
  trackedMinutes: 1_905,
  billed: 2_475,
  unbilled: 1_017,
  color: '#e59a9a'
},
{
  id: 'c3',
  name: 'Atlas Freight',
  contact: 'ops@atlasfreight.io',
  projects: 1,
  trackedMinutes: 1_140,
  billed: 1_080,
  unbilled: 1_200,
  color: '#6ec1c8'
},
{
  id: 'c4',
  name: 'Halcyon Health',
  contact: 'priya@halcyon.health',
  projects: 1,
  trackedMinutes: 2_070,
  billed: 4_485,
  unbilled: 0,
  color: '#a58ce0'
},
{
  id: 'c5',
  name: 'Internal',
  contact: 'xijie',
  projects: 6,
  trackedMinutes: 5_277,
  billed: 0,
  unbilled: 0,
  color: '#8fbf7a'
}];