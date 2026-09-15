import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PlanTier } from '../types';

interface ShellValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  plan: PlanTier;
  setPlan: (plan: PlanTier) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const ShellContext = createContext<ShellValue | null>(null);

export function ShellProvider({
  children,
  initialTheme,
  initialPlan,
  initialCollapsed





}: {children: React.ReactNode;initialTheme: 'light' | 'dark';initialPlan: PlanTier;initialCollapsed: boolean;}) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  const [plan, setPlan] = useState<PlanTier>(initialPlan);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialCollapsed);

  const toggleTheme = useCallback(() => setTheme((value) => value === 'light' ? 'dark' : 'light'), []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed((value) => !value), []);

  const value = useMemo<ShellValue>(
    () => ({ theme, toggleTheme, plan, setPlan, sidebarCollapsed, toggleSidebar }),
    [theme, toggleTheme, plan, sidebarCollapsed, toggleSidebar]
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): ShellValue {
  const context = useContext(ShellContext);
  if (!context) throw new Error('useShell must be used inside a ShellProvider');
  return context;
}