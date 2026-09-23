// ============================================================
// useTheme Hook — Access the active enterprise theme
// ============================================================

import { useThemeContext } from '../theme/theme.provider';
import { EnterpriseTheme } from '../theme/theme.types';

export interface UseThemeReturn {
  theme: EnterpriseTheme;
  isDark: boolean;
  toggleMode: () => void;
}

export function useTheme(): UseThemeReturn {
  const { theme, mode, toggleMode } = useThemeContext();
  return {
    theme,
    isDark: mode === 'dark',
    toggleMode,
  };
}

