import React from 'react';

interface PanelProps {
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({ title, icon, action, children, className = '', bodyClassName = '' }: PanelProps) {
  return (
    <section className={`rounded-xl border border-line bg-surface shadow-panel ${className}`}>
      {(title || action) &&
      <header className="flex items-center justify-between gap-3 px-5 pt-4">
          <div className="flex items-center gap-2">
            {icon}
            {title && <h2 className="text-[13px] font-medium text-muted">{title}</h2>}
          </div>
          {action}
        </header>
      }
      <div className={`px-5 pb-5 ${title || action ? 'pt-4' : 'pt-5'} ${bodyClassName}`}>{children}</div>
    </section>);

}