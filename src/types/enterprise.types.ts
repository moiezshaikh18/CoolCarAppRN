// ============================================================
// Enterprise Types — Multi-Tenant Architecture
// ============================================================

export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'EMPLOYEE';

export interface EnterpriseTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  glassOpacity: number;
  glassBlur: number;
  cardRadius: number;
  buttonRadius: number;
  gradientStart: string;
  gradientEnd: string;
}

export interface EnterpriseFeatures {
  customers: boolean;
  vehicles: boolean;
  jobSheets: boolean;
  expenses: boolean;
  income: boolean;
  payments: boolean;
  bankAccounts: boolean;
  inventory: boolean;
  reminders: boolean;
  reports: boolean;
  export: boolean;
  backup: boolean;
}

export interface EnterpriseSettings {
  currency: string;
  currencySymbol: string;
  timezone: string;
  dateFormat: string;
  jobNumberPrefix: string;
  jobNumberPadding: number;
  lowStockWarning: boolean;
  autoReminders: boolean;
  defaultPaymentMode: 'CASH' | 'UPI' | 'CARD_SWIPE';
}

export interface EnterpriseBranding {
  logoUrl?: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  appName?: string;
}

export interface Enterprise {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  ownerId: string;
  phone: string;
  email?: string;
  address?: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  dateFormat: string;
  branding: EnterpriseBranding;
  theme: EnterpriseTheme;
  features: EnterpriseFeatures;
  settings: EnterpriseSettings;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface EnterpriseMember {
  userId: string;
  enterpriseId: string;
  role: UserRole;
  displayName: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  isActive: boolean;
  joinedAt: Date | string;
  updatedAt: Date | string;
}

export interface UserEnterpriseMapping {
  enterpriseId: string;
  enterpriseName: string;
  enterpriseLogoUrl?: string;
  role: UserRole;
  isActive: boolean;
}

