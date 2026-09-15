import React from 'react';

interface PageHeaderProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ icon, title, breadcrumb, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-[52px] shrink-0 items-center justify-between gap-4 border-b border-line bg-canvas/85 px-5 backdrop-blur">
      <div className="flex min-w-0 items-center gap-2 text-[14px] font-medium text-ink">
        {icon}
        {breadcrumb ?
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2">
            {breadcrumb}
          </nav> :

        <h1 className="truncate">{title}</h1>
        }
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>);

}