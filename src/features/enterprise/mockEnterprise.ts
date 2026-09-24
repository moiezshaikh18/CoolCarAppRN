// ============================================================
// Mock Enterprise — Development data (no Firebase required)
// ============================================================

import { Enterprise } from '../../types/enterprise.types';
import { defaultTheme } from '../../theme/themes/defaultTheme';

export const MOCK_ENTERPRISE: Enterprise = {
  id: 'enterprise-cool-car',
  name: 'Cool Car',
  slug: 'cool-car',
  logoUrl: undefined,
  ownerId: 'dev-user-001',
  phone: '+91 98765 43210',
  email: 'service@coolcar.com',
  address: 'Cool Car AC Repair Workshop, Auto Hub, Mumbai',
  currency: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata',
  dateFormat: 'dd/MM/yyyy',
  branding: {
    primaryColor: '#0C1829',
    secondaryColor: '#153580',
    accentColor: '#00C896',
    tagline: 'Car AC Repair & Auto Care Specialists',
  },
  theme: defaultTheme,
  features: {
    customers: true,
    vehicles: true,
    jobSheets: true,
    expenses: true,
    income: true,
    payments: true,
    bankAccounts: true,
    inventory: true,
    reminders: true,
    reports: true,
    export: true,
    backup: true,
  },
  settings: {
    currency: 'INR',
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata',
    dateFormat: 'dd/MM/yyyy',
    jobNumberPrefix: 'CCG',
    jobNumberPadding: 4,
    lowStockWarning: true,
    autoReminders: true,
    defaultPaymentMode: 'CASH',
  },
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_ENTERPRISE_ABC: Enterprise = {
  ...MOCK_ENTERPRISE,
  id: 'enterprise-dev-002',
  name: 'ABC Motors',
  slug: 'abc-motors',
  ownerId: 'dev-user-002',
  phone: '+919876543211',
  branding: {
    primaryColor: '#E63946',
    secondaryColor: '#F4A261',
    accentColor: '#2A9D8F',
    tagline: 'Your Trusted Auto Partner',
  },
  settings: {
    ...MOCK_ENTERPRISE.settings,
    jobNumberPrefix: 'ABC',
  },
};

