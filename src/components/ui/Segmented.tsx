import React from 'react';

interface SegmentedProps<T extends string> {
  options: {value: T;label: string;}[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  ariaLabel: string;
}

export function Segmented<T extends string>({ options, value, onChange, size = 'md', ariaLabel }: SegmentedProps<T>) {
  const pad = size === 'sm' ? 'px-3 py-1 text-[12px]' : 'px-5 py-[7px] text-[13px]';
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface p-1">
      
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={`${pad} rounded-md font-medium transition-colors duration-150 ease-snap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
            selected ? 'bg-accent-soft text-accent-ink' : 'text-muted hover:text-ink'}`
            }>
            
            {option.label}
          </button>);

      })}
    </div>);

}