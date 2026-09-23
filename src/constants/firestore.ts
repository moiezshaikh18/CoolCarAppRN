// ============================================================
// Constants — Firestore collection paths
// ============================================================

export const COLLECTIONS = {
  USERS: 'users',
  ENTERPRISES: 'enterprises',

  // Sub-collections under enterprises/{enterpriseId}/
  MEMBERS: 'members',
  CUSTOMERS: 'customers',
  VEHICLES: 'vehicles',
  JOB_SHEETS: 'jobSheets',
  JOB_ITEMS: 'items',
  PAYMENTS: 'payments',
  EXPENSES: 'expenses',
  EXPENSE_CATEGORIES: 'expenseCategories',
  BANK_ACCOUNTS: 'bankAccounts',
  ACCOUNT_TRANSACTIONS: 'accountTransactions',
  SPARE_PARTS: 'spareParts',
  INVENTORY_TRANSACTIONS: 'inventoryTransactions',
  REMINDERS: 'reminders',
  SERVICES: 'services',
  SETTINGS: 'settings',
} as const;

/**
 * Enterprise-scoped collection path builder
 * Usage: enterprisePath('ent123', COLLECTIONS.CUSTOMERS)
 */
export function enterprisePath(enterpriseId: string, collection: string): string {
  return `${COLLECTIONS.ENTERPRISES}/${enterpriseId}/${collection}`;
}

/**
 * Enterprise-scoped document path builder
 */
export function enterpriseDocPath(
  enterpriseId: string,
  collection: string,
  docId: string
): string {
  return `${COLLECTIONS.ENTERPRISES}/${enterpriseId}/${collection}/${docId}`;
}

/**
 * Job sheet items path
 */
export function jobItemsPath(enterpriseId: string, jobSheetId: string): string {
  return `${COLLECTIONS.ENTERPRISES}/${enterpriseId}/${COLLECTIONS.JOB_SHEETS}/${jobSheetId}/${COLLECTIONS.JOB_ITEMS}`;
}

