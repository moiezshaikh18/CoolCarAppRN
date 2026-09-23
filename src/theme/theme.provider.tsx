// ============================================================
// Theme Provider — React Context for theme engine
// ============================================================

import React, { createContext, useCallback, useContext, useState } from 'react';
import { EnterpriseTheme, ThemeContextValue, ThemeMode } from './theme.types';
import { defaultTheme, defaultLightTheme } from './themes/defaultTheme';
import { mergeTheme } from './theme.utils';

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Partial<EnterpriseTheme>;
  initialMode?: ThemeMode;
}

export function ThemeProvider({
  children,
  initialTheme,
  initialMode = 'light',
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [themeOverride, setThemeOverride] = useState<Partial<EnterpriseTheme>>(
    initialTheme ?? {}
  );

  const baseTheme = mode === 'dark' ? defaultTheme : defaultLightTheme;
  const theme: EnterpriseTheme = mergeTheme(baseTheme, themeOverride);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const applyEnterpriseTheme = useCallback(
    (enterpriseTheme: Partial<EnterpriseTheme>) => {
      setThemeOverride(enterpriseTheme);
    },
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleMode, applyEnterpriseTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeContext };

