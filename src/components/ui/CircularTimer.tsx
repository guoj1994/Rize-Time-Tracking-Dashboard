import React from 'react';
import { motion } from 'framer-motion';

interface CircularTimerProps {
  /** 0 to 1, or null for an indeterminate / no-limit session. */
  progress: number | null;
  tone: 'focus' | 'break' | 'meeting';
  size?: number;
  strokeWidth?: number;
  children: React.ReactNode;
}

const toneVar: Record<CircularTimerProps['tone'], {ring: string;track: string;}> = {
  focus: { ring: 'rgb(var(--accent))', track: 'rgb(var(--accent-soft))' },
  break: { ring: 'rgb(var(--break))', track: 'rgb(var(--break-soft))' },
  meeting: { ring: 'rgb(var(--meeting))', track: 'rgb(var(--meeting-soft))' }
};

export function CircularTimer({ progress, tone, size = 260, strokeWidth = 10, children }: CircularTimerProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const colors = toneVar[tone];
  const clamped = progress === null ? 0 : Math.min(1, Math.max(0, progress));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="presentation" className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={colors.track} strokeWidth={strokeWidth} />
        {progress === null ?
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.ring}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.22} ${circumference}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }} /> :


        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.ring}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          style={{ transition: 'stroke-dashoffset 0.4s cubic-bezier(0.23, 1, 0.32, 1)' }} />

        }
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>);

}