import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CoffeeIcon, CrosshairIcon, UsersIcon } from 'lucide-react';
import type { SessionKind } from '../../types';

const items: {kind: SessionKind;label: string;shortcut: string;icon: typeof CrosshairIcon;}[] = [
{ kind: 'focus', label: 'Focus', shortcut: '⌘ F', icon: CrosshairIcon },
{ kind: 'meeting', label: 'Meeting', shortcut: '⌘ M', icon: UsersIcon },
{ kind: 'break', label: 'Break', shortcut: '⌘ B', icon: CoffeeIcon }];


interface SessionMenuProps {
  onSelect: (kind: SessionKind) => void;
  onClose: () => void;
}

export function SessionMenu({ onSelect, onClose }: SessionMenuProps) {
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

  return (
    <motion.div
      ref={ref}
      role="menu"
      aria-label="Start a session"
      initial={{ opacity: 0, scale: 0.97, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
      className="absolute bottom-full left-0 z-40 mb-2 w-[188px] origin-bottom rounded-xl border border-line bg-surface p-1.5 shadow-pop">
      
      {items.map((item) =>
      <button
        key={item.kind}
        type="button"
        role="menuitem"
        onClick={() => onSelect(item.kind)}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 ease-snap hover:bg-canvas">
        
          <item.icon className="h-[15px] w-[15px] shrink-0 text-muted" />
          <span className="flex-1 text-[13px] text-ink">{item.label}</span>
          <span className="shrink-0 text-[12px] text-accent">{item.shortcut}</span>
        </button>
      )}
    </motion.div>);

}