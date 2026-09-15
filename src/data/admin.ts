import type { Invoice, Member } from '../types';

export const teams = [
{ id: 'tm1', name: 'xijie', members: 4, projects: 5, trackedMinutes: 12_468, owner: 'You' },
{ id: 'tm2', name: 'Bootcamp Cohort 044', members: 12, projects: 1, trackedMinutes: 38_940, owner: 'You' }];


export const members: Member[] = [
{ id: 'm1', name: 'xijie', email: 'xijie@studio.dev', role: 'Owner', team: 'xijie', trackedMinutes: 9_660, status: 'active' },
{ id: 'm2', name: 'Dana Whitfield', email: 'dana@northwindlabs.com', role: 'Admin', team: 'xijie', trackedMinutes: 6_120, status: 'active' },
{ id: 'm3', name: 'Sam Ortiz', email: 'sam@kestrel.studio', role: 'Member', team: 'xijie', trackedMinutes: 4_380, status: 'active' },
{ id: 'm4', name: 'Priya Raman', email: 'priya@halcyon.health', role: 'Member', team: 'Bootcamp Cohort 044', trackedMinutes: 0, status: 'invited' }];


export const invoices: Invoice[] = [
{ id: 'i1', number: 'RZ-0148', client: 'Northwind Labs', issued: 'Sep 12', due: 'Sep 26', amount: 3_040, status: 'sent' },
{ id: 'i2', number: 'RZ-0147', client: 'Kestrel Studio', issued: 'Sep 5', due: 'Sep 19', amount: 2_475, status: 'overdue' },
{ id: 'i3', number: 'RZ-0146', client: 'Atlas Freight', issued: 'Aug 30', due: 'Sep 13', amount: 1_080, status: 'paid' },
{ id: 'i4', number: 'RZ-0145', client: 'Halcyon Health', issued: 'Aug 22', due: 'Sep 5', amount: 4_485, status: 'paid' },
{ id: 'i5', number: 'Draft', client: 'Northwind Labs', issued: '–', due: '–', amount: 1_140, status: 'draft' }];