// ============================================================
// Constants — Route paths for Expo Router
// ============================================================

export const ROUTES = {
  // Auth
  SPLASH: '/(auth)/splash',
  LOGIN: '/(auth)/login',
  OTP: '/(auth)/otp',
  CREATE_PROFILE: '/(auth)/create-profile',
  SELECT_ENTERPRISE: '/(auth)/select-enterprise',

  // Tabs
  HOME: '/(tabs)/',
  ENTRIES: '/(tabs)/entries',
  REPORTS: '/(tabs)/reports',
  MORE: '/(tabs)/more',

  // Customers
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: (id: string) => `/customers/${id}`,
  CUSTOMER_ADD: '/customers/add',
  CUSTOMER_EDIT: (id: string) => `/customers/${id}/edit`,
  CUSTOMER_HISTORY: (id: string) => `/customers/${id}/history`,

  // Vehicles
  VEHICLES: '/vehicles',
  VEHICLE_DETAIL: (id: string) => `/vehicles/${id}`,
  VEHICLE_ADD: '/vehicles/add',
  VEHICLE_EDIT: (id: string) => `/vehicles/${id}/edit`,
  VEHICLE_SERVICE_HISTORY: (id: string) => `/vehicles/${id}/history`,

  // Job Sheets
  JOB_SHEETS: '/job-sheets',
  JOB_SHEET_DETAIL: (id: string) => `/job-sheets/${id}`,
  JOB_SHEET_CREATE: '/job-sheets/create',
  JOB_SHEET_FIND: '/job-sheets/find',

  // Payments
  PAYMENTS: '/payments',
  PAYMENT_ADD: (jobSheetId: string) => `/payments/add?jobSheetId=${jobSheetId}`,
  PAYMENT_DETAIL: (id: string) => `/payments/${id}`,

  // Expenses
  EXPENSES: '/expenses',
  EXPENSE_ADD: '/expenses/add',
  EXPENSE_DAILY: '/expenses/daily',
  EXPENSE_CATEGORIES: '/expenses/categories',

  // Bank Accounts
  BANK_ACCOUNTS: '/bank-accounts',
  BANK_ACCOUNT_DETAIL: (id: string) => `/bank-accounts/${id}`,
  CASH_IN_HAND: '/bank-accounts/cash',

  // Inventory
  INVENTORY: '/inventory',
  SPARE_PART_DETAIL: (id: string) => `/inventory/${id}`,
  SPARE_PART_ADD: '/inventory/add',
  LOW_STOCK: '/inventory/low-stock',

  // Reports
  REPORT_COLLECTIONS: '/reports/collections',
  REPORT_EXPENSES: '/reports/expenses',
  REPORT_PL: '/reports/profit-loss',
  REPORT_OUTSTANDING: '/reports/outstanding',
  REPORT_PAYMENT_MODE: '/reports/payment-mode',
  REPORT_BANK: '/reports/bank',
  REPORT_INVENTORY: '/reports/inventory',

  // Settings
  SETTINGS: '/settings',
  PROFILE: '/settings/profile',
  BUSINESS_INFO: '/settings/business',
  ENTERPRISE_BRANDING: '/settings/branding',
  USERS_ROLES: '/settings/users',
  NOTIFICATIONS: '/settings/notifications',
  EXPORT: '/settings/export',
  BACKUP: '/settings/backup',
} as const;

