import React from 'react';

type Tone = 'neutral' | 'accent' | 'break' | 'meeting' | 'positive' | 'warn' | 'danger' | 'info';

const toneClass: Record<Tone, string> = {
  neutral: 'bg-canvas text-muted border-line',
  accent: 'bg-accent-soft text-accent-ink border-accent/20',
  break: 'bg-break-soft text-break-ink border-break/25',
  meeting: 'bg-meeting-soft text-meeting-ink border-meeting/25',
  positive: 'bg-[#e9f5ee] text-[#1f7a4d] border-[#bfe0cd] dark:bg-[#17301f] dark:text-[#5fc78c] dark:border-[#265a3a]',
  warn: 'bg-[#fdf4e3] text-[#8a5a17] border-[#eddcb4] dark:bg-[#332a14] dark:text-[#e0b562] dark:border-[#5a4720]',
  danger: 'bg-[#fdecec] text-[#a52b2b] border-[#f0c6c6] dark:bg-[#3a1d1d] dark:text-[#f08c8c] dark:border-[#5f2c2c]',
  info: 'bg-[#edf1fd] text-[#38499e] border-[#c8d2f2] dark:bg-[#1d233d] dark:text-[#93a6ea] dark:border-[#33406b]'
};

export function Badge({
  children,
  tone = 'neutral',
  className = ''




}: {children: React.ReactNode;tone?: Tone;className?: string;}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-[2px] text-[11px] font-medium ${toneClass[tone]} ${className}`}>
      
      {children}
    </span>);

}