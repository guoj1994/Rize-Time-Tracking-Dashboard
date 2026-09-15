import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CoffeeIcon, CrosshairIcon, UsersIcon } from 'lucide-react';

interface QuickStartMenuProps {
  onFocus: () => void;
  onMeeting: () => void;
  onBreak: () => void;
  onClose: () => void;
}

const items = [
{ key: 'focus', label: 'Focus', icon: CrosshairIcon, dot: 'bg-accent' },
{ key: 'meeting', label: 'Meeting', icon: UsersIcon, dot: 'bg-meeting' },
{ key: 'break', label: 'Break', icon: CoffeeIcon, dot: 'bg-break' }] as
const;

export function QuickStartMenu({ onFocus, onMeeting, onBreak, onClose }: QuickStartMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const handlers = { focus: onFocus, meeting: onMeeting, break: onBreak } as const;

  return (
    <motion.div
      ref={ref}
      role="menu"
      aria-label="Quick start"
      initial={{ opacity: 0, scale: 0.97, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
      className="absolute bottom-full left-0 z-40 mb-2 w-[168px] origin-bottom rounded-xl border border-line bg-surface p-1.5 shadow-pop">
      
      {items.map((item) =>
      <button
        key={item.key}
        type="button"
        role="menuitem"
        onClick={handlers[item.key]}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 ease-snap hover:bg-canvas">
        
          <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${item.dot}`} />
          <item.icon className="h-[14px] w-[14px] shrink-0 text-muted" />
          <span className="flex-1 text-[13px] text-ink">{item.label}</span>
        </button>
      )}
    </motion.div>);

}