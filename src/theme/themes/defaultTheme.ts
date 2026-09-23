// ============================================================
// Default Theme — Purple/Blue Glassmorphic
// Refined with Soft Modern Dark Mode & Crisp Clean Light Mode
// ============================================================

import { EnterpriseTheme } from '../theme.types';

export const defaultTheme: EnterpriseTheme = {
  // Brand
  primary: '#FFFFFF',
  secondary: '#38BDF8',
  accent: '#10B981',

  // Backgrounds — Sophisticated deep luxury night
  background: '#12141A',
  surface: '#1A1E27',
  surfaceAlt: '#222834',

  // Text
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',

  // Semantic
  error: '#F43F5E',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#38BDF8',

  // Borders
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.05)',

  // Glass
  glassOpacity: 0.12,
  glassBlur: 20,
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassSurface: 'rgba(255, 255, 255, 0.06)',

  // Gradients
  gradientStart: '#1E2640',
  gradientEnd: '#121829',
  gradientAngle: 135,

  // Shape — Mega-curved luxury radius
  cardRadius: 28,
  buttonRadius: 32,
  inputRadius: 20,
  chipRadius: 24,

  // Spacing
  cardPadding: 20,
  sectionPadding: 16,
};

export const defaultLightTheme: EnterpriseTheme = {
  ...defaultTheme,
  primary: '#121214',
  secondary: '#27272A',
  accent: '#10B981',

  // Backgrounds — Luxury warm sand paper canvas & sand secondary cards (Nestora style)
  background: '#F8F6F2',
  surface: '#FFFFFF',
  surfaceAlt: '#EFECE6',

  // Text — High-contrast deep charcoal typography
  text: '#18181B',
  textSecondary: '#52525B',
  textMuted: '#8E8E93',
  textInverse: '#FFFFFF',

  // Semantic
  error: '#E11D48',
  success: '#10B981',
  warning: '#D97706',
  info: '#2563EB',

  // Borders
  border: 'rgba(0, 0, 0, 0.06)',
  borderLight: 'rgba(0, 0, 0, 0.03)',

  // Glass
  glassOpacity: 0.92,
  glassBlur: 16,
  glassBorder: 'rgba(0, 0, 0, 0.06)',
  glassSurface: '#FFFFFF',

  // Gradients
  gradientStart: '#F8F6F2',
  gradientEnd: '#EDE8E1',

  // Shape
  cardRadius: 28,
  buttonRadius: 32,
  inputRadius: 20,
  chipRadius: 24,
};
