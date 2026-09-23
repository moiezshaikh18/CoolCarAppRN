// ============================================================
// Constants — App-wide configuration
// ============================================================

export const APP_CONFIG = {
  name: 'Garage Expense Tracker',
  version: '1.0.0',
  supportEmail: 'support@garagetracker.app',
  defaultCountryCode: '+91',
  otpLength: 6,
  otpResendSeconds: 60,
  searchDebounceMs: 300,
  paginationLimit: 20,
  maxVehiclesPerCustomer: 20,
  maxItemsPerJobSheet: 50,
} as const;

export const PAYMENT_MODES = {
  CASH: 'CASH',
  UPI: 'UPI',
  CARD_SWIPE: 'CARD_SWIPE',
} as const;

export const JOB_STATUSES = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'PAID',
} as const;

export const USER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  ACCOUNTANT: 'ACCOUNTANT',
  EMPLOYEE: 'EMPLOYEE',
} as const;

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Shop Rent',
  'Electricity',
  'Salary',
  'Tools & Equipment',
  'Oil & Lubricants',
  'Parts & Material',
  'Tea & Snacks',
  'Transport',
  'Miscellaneous',
] as const;

export const FUEL_TYPES = [
  'PETROL',
  'DIESEL',
  'CNG',
  'ELECTRIC',
  'HYBRID',
  'LPG',
] as const;

