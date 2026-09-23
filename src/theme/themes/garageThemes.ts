// ============================================================
// Garage Preset Themes — One per enterprise style
// ============================================================

import { EnterpriseTheme } from '../theme.types';
import { defaultTheme } from './defaultTheme';

/**
 * Super Auto Garage — Purple/Blue (default)
 */
export const superAutoTheme: EnterpriseTheme = {
  ...defaultTheme,
};

/**
 * ABC Motors — Red/Orange energy theme
 */
export const abcMotorsTheme: EnterpriseTheme = {
  ...defaultTheme,
  primary: '#E63946',
  secondary: '#F4A261',
  accent: '#2A9D8F',
  background: '#1A0A0A',
  gradientStart: '#E63946',
  gradientEnd: '#F4A261',
  glassSurface: 'rgba(230, 57, 70, 0.12)',
  glassBorder: 'rgba(244, 162, 97, 0.25)',
};

/**
 * Green Auto Care — Green/Teal eco theme
 */
export const greenAutoTheme: EnterpriseTheme = {
  ...defaultTheme,
  primary: '#2D6A4F',
  secondary: '#52B788',
  accent: '#95D5B2',
  background: '#071B0F',
  gradientStart: '#2D6A4F',
  gradientEnd: '#52B788',
  glassSurface: 'rgba(45, 106, 79, 0.12)',
  glassBorder: 'rgba(82, 183, 136, 0.25)',
};

/**
 * Premium Gold Garage — Gold/Black luxury theme
 */
export const premiumGoldTheme: EnterpriseTheme = {
  ...defaultTheme,
  primary: '#C9A96E',
  secondary: '#E8D5A3',
  accent: '#8B6914',
  background: '#0A0800',
  gradientStart: '#C9A96E',
  gradientEnd: '#E8D5A3',
  glassSurface: 'rgba(201, 169, 110, 0.12)',
  glassBorder: 'rgba(232, 213, 163, 0.25)',
};

/**
 * Blue Ocean Auto — Deep blue theme
 */
export const blueOceanTheme: EnterpriseTheme = {
  ...defaultTheme,
  primary: '#023E8A',
  secondary: '#0096C7',
  accent: '#00B4D8',
  background: '#020A18',
  gradientStart: '#023E8A',
  gradientEnd: '#0096C7',
  glassSurface: 'rgba(2, 62, 138, 0.15)',
  glassBorder: 'rgba(0, 180, 216, 0.25)',
};

export const PRESET_THEMES: Record<string, EnterpriseTheme> = {
  default: superAutoTheme,
  'abc-motors': abcMotorsTheme,
  'green-auto': greenAutoTheme,
  'premium-gold': premiumGoldTheme,
  'blue-ocean': blueOceanTheme,
};

export type ThemePresetKey = keyof typeof PRESET_THEMES;

