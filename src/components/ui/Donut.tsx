import React from 'react';

interface DonutSegment {
  value: number;
  color: string;
}

interface DonutProps {
  segments: DonutSegment[];
  total: string;
  caption?: string;
  size?: number;
  thickness?: number;
}

export function Donut({ segments, total, caption = 'Total', size = 148, thickness = 16 }: DonutProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const sum = segments.reduce((acc, segment) => acc + segment.value, 0) || 1;
  let offset = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="presentation" className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          style={{ stroke: 'rgb(var(--line))' }} />
        
        {segments.map((segment, index) => {
          const length = segment.value / sum * circumference;
          const dash = `${length} ${circumference - length}`;
          const element =
          <circle
            key={index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={thickness}
            strokeDasharray={dash}
            strokeDashoffset={-offset} />;


          offset += length;
          return element;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular text-[17px] font-semibold text-ink">{total}</span>
        <span className="text-[10px] uppercase tracking-wider text-faint">{caption}</span>
      </div>
    </div>);

}