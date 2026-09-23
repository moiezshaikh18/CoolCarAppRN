// ============================================================
// Theme Utilities
// ============================================================

import { EnterpriseTheme } from './theme.types';

/**
 * Returns an alpha-modified hex or rgba color
 */
export function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('rgba')) return color;
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
  }
  // hex
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Merges enterprise branding partial theme with a base theme
 */
export function mergeTheme(
  base: EnterpriseTheme,
  override: Partial<EnterpriseTheme>
): EnterpriseTheme {
  return { ...base, ...override };
}

/**
 * Creates a glass style object for use with StyleSheet
 */
export function createGlassStyle(theme: EnterpriseTheme) {
  return {
    backgroundColor: theme.glassSurface,
    borderColor: theme.glassBorder,
    borderWidth: 1,
    borderRadius: theme.cardRadius,
  };
}

/**
 * Builds gradient colors array from theme
 */
export function getGradientColors(theme: EnterpriseTheme): string[] {
  return [theme.gradientStart, theme.gradientEnd];
}

/**
 * Determines if a color is dark (for text contrast)
 */
export function isDarkColor(hex: string): boolean {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

/**
 * Get contrasting text color for a background
 */
export function getContrastText(bgColor: string, theme: EnterpriseTheme): string {
  return isDarkColor(bgColor) ? theme.text : theme.textInverse;
}

