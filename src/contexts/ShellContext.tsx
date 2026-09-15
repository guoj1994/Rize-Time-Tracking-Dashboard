import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface ShellValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const ShellContext = createContext<ShellValue | null>(null);

export function ShellProvider({
  children,
  initialTheme,
  initialCollapsed




}: {children: React.ReactNode;initialTheme: 'light' | 'dark';initialCollapsed: boolean;}) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialCollapsed);

  const toggleTheme = useCallback(() => setTheme((value) => value === 'light' ? 'dark' : 'light'), []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed((value) => !value), []);

  const value = useMemo<ShellValue>(
    () => ({ theme, toggleTheme, sidebarCollapsed, toggleSidebar }),
    [theme, toggleTheme, sidebarCollapsed, toggleSidebar]
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): ShellValue {
  const context = useContext(ShellContext);
  if (!context) throw new Error('useShell must be used inside a ShellProvider');
  return context;
}