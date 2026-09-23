// ============================================================
// Theme Types — Enterprise-driven design tokens
// ============================================================

export interface EnterpriseTheme {
  // Brand colors
  primary: string;
  secondary: string;
  accent: string;

  // Backgrounds
  background: string;
  surface: string;
  surfaceAlt: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Semantic
  error: string;
  success: string;
  warning: string;
  info: string;

  // Borders
  border: string;
  borderLight: string;

  // Glass effect
  glassOpacity: number;
  glassBlur: number;
  glassBorder: string;
  glassSurface: string;

  // Gradients
  gradientStart: string;
  gradientEnd: string;
  gradientAngle?: number;

  // Shape
  cardRadius: number;
  buttonRadius: number;
  inputRadius: number;
  chipRadius: number;

  // Spacing
  cardPadding: number;
  sectionPadding: number;
}

export interface GlassCardVariant {
  background: string;
  borderColor: string;
  shadowColor: string;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  theme: EnterpriseTheme;
  mode: ThemeMode;
  toggleMode: () => void;
  applyEnterpriseTheme: (enterpriseTheme: Partial<EnterpriseTheme>) => void;
}

