import React from 'react';

interface BarRowProps {
  name: React.ReactNode;
  time: string;
  percent: number;
  color?: string;
  delta?: React.ReactNode;
  nameWidth?: string;
}

export function BarRow({ name, time, percent, color, delta, nameWidth = 'w-[180px]' }: BarRowProps) {
  return (
    <div className="flex items-center gap-4 py-[7px] text-[13px]">
      <span className={`${nameWidth} shrink-0 truncate text-ink`}>{name}</span>
      <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-accent-soft">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, Math.max(2, percent))}%`, backgroundColor: color ?? 'rgb(var(--accent))' }} />
        
      </div>
      <span className="tabular w-[76px] shrink-0 text-right text-ink">{time}</span>
      <span className="tabular w-[44px] shrink-0 text-right text-muted">{percent}%</span>
      {delta && <span className="tabular w-[54px] shrink-0 text-right text-[12px]">{delta}</span>}
    </div>);

}