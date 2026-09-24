// ============================================================
// Default Theme — Sky Blue & Midnight Navy Luxury Aesthetic
// Directly matching media_1790189780212.png & media_1790189816628.png
// True dark black background with high-contrast white text for dark mode
// ============================================================

import { EnterpriseTheme } from '../theme.types';

// Dark Mode: Pure deep dark black background with high-contrast white text
export const defaultTheme: EnterpriseTheme = {
  // Brand
  primary: '#FFFFFF',
  secondary: '#153580',
  accent: '#00C896',

  // Backgrounds — True dark black with deep navy surfaces
  background: '#070A0F',
  surface: '#111622',
  surfaceAlt: '#182030',

  // Text — Crisp white contrast
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#070A0F',

  // Semantic
  error: '#EF4444',
  success: '#00C896',
  warning: '#F59E0B',
  info: '#60A5FA',

  // Borders
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.05)',

  // Glass
  glassOpacity: 0.15,
  glassBlur: 20,
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassSurface: 'rgba(255, 255, 255, 0.06)',

  // Gradients
  gradientStart: '#111622',
  gradientEnd: '#070A0F',
  gradientAngle: 135,

  // Shape — Mega-curved luxury radius
  cardRadius: 28,
  buttonRadius: 30,
  inputRadius: 22,
  chipRadius: 24,

  // Spacing
  cardPadding: 20,
  sectionPadding: 16,
};

// Light Mode: Signature vibrant Sky Blue backdrop, Crisp White sheets, Midnight Navy hero & dock
export const defaultLightTheme: EnterpriseTheme = {
  ...defaultTheme,
  primary: '#0C1829',
  secondary: '#153580',
  accent: '#00C896',

  // Backgrounds — Sky Blue canvas backdrop with pure white sheets & cards
  background: '#F4F6F9',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F7FC',

  // Text — High-contrast deep midnight navy typography
  text: '#0C1829',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',

  // Semantic
  error: '#EF4444',
  success: '#00C896',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Borders
  border: 'rgba(12, 24, 41, 0.08)',
  borderLight: 'rgba(12, 24, 41, 0.04)',

  // Glass
  glassOpacity: 0.95,
  glassBlur: 16,
  glassBorder: 'rgba(12, 24, 41, 0.08)',
  glassSurface: '#FFFFFF',

  // Gradients
  gradientStart: '#153580',
  gradientEnd: '#5B93E1',

  // Shape
  cardRadius: 28,
  buttonRadius: 30,
  inputRadius: 22,
  chipRadius: 24,
};
