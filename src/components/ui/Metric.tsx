import React from 'react';

export interface MetricItem {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: 'default' | 'positive' | 'warn' | 'danger' | 'accent' | 'break' | 'meeting';
}

const toneClass: Record<NonNullable<MetricItem['tone']>, string> = {
  default: 'text-ink',
  positive: 'text-positive',
  warn: 'text-warn',
  danger: 'text-danger',
  accent: 'text-accent-ink',
  break: 'text-break-ink',
  meeting: 'text-meeting-ink'
};

export function MetricRow({ items, className = '' }: {items: MetricItem[];className?: string;}) {
  return (
    <dl className={`grid grid-cols-2 gap-y-5 sm:grid-cols-4 ${className}`}>
      {items.map((item, index) =>
      <div
        key={item.label}
        className={index > 0 ? 'sm:border-l sm:border-line sm:pl-5' : ''}>
        
          <dt className="text-[12px] text-muted">{item.label}</dt>
          <dd className="mt-1 flex items-baseline gap-2">
            <span className={`tabular text-[19px] font-semibold leading-tight ${toneClass[item.tone ?? 'default']}`}>
              {item.value}
            </span>
            {item.hint && <span className="text-[12px] text-faint">{item.hint}</span>}
          </dd>
        </div>
      )}
    </dl>);

}