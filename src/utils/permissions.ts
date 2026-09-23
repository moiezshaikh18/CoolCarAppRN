// ============================================================
// Permission Utilities — Role-based access control
// ============================================================

import { UserRole } from '../types/enterprise.types';

type Permission =
  | 'customers.view'
  | 'customers.create'
  | 'customers.edit'
  | 'customers.delete'
  | 'vehicles.view'
  | 'vehicles.create'
  | 'vehicles.edit'
  | 'jobSheets.view'
  | 'jobSheets.create'
  | 'jobSheets.edit'
  | 'jobSheets.void'
  | 'payments.view'
  | 'payments.create'
  | 'payments.void'
  | 'expenses.view'
  | 'expenses.create'
  | 'expenses.edit'
  | 'expenses.void'
  | 'bankAccounts.view'
  | 'bankAccounts.manage'
  | 'inventory.view'
  | 'inventory.manage'
  | 'reports.view'
  | 'reports.financial'
  | 'settings.view'
  | 'settings.manage'
  | 'users.view'
  | 'users.manage'
  | 'enterprise.manage';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  OWNER: [
    'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
    'vehicles.view', 'vehicles.create', 'vehicles.edit',
    'jobSheets.view', 'jobSheets.create', 'jobSheets.edit', 'jobSheets.void',
    'payments.view', 'payments.create', 'payments.void',
    'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.void',
    'bankAccounts.view', 'bankAccounts.manage',
    'inventory.view', 'inventory.manage',
    'reports.view', 'reports.financial',
    'settings.view', 'settings.manage',
    'users.view', 'users.manage',
    'enterprise.manage',
  ],
  ADMIN: [
    'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
    'vehicles.view', 'vehicles.create', 'vehicles.edit',
    'jobSheets.view', 'jobSheets.create', 'jobSheets.edit', 'jobSheets.void',
    'payments.view', 'payments.create', 'payments.void',
    'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.void',
    'bankAccounts.view', 'bankAccounts.manage',
    'inventory.view', 'inventory.manage',
    'reports.view', 'reports.financial',
    'settings.view', 'settings.manage',
    'users.view', 'users.manage',
  ],
  MANAGER: [
    'customers.view', 'customers.create', 'customers.edit',
    'vehicles.view', 'vehicles.create', 'vehicles.edit',
    'jobSheets.view', 'jobSheets.create', 'jobSheets.edit',
    'payments.view',
    'expenses.view', 'expenses.create', 'expenses.edit',
    'inventory.view',
    'reports.view',
    'settings.view',
    'users.view',
  ],
  ACCOUNTANT: [
    'customers.view',
    'vehicles.view',
    'jobSheets.view',
    'payments.view', 'payments.create', 'payments.void',
    'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.void',
    'bankAccounts.view', 'bankAccounts.manage',
    'inventory.view',
    'reports.view', 'reports.financial',
    'settings.view',
  ],
  EMPLOYEE: [
    'customers.view', 'customers.create', 'customers.edit',
    'vehicles.view', 'vehicles.create', 'vehicles.edit',
    'jobSheets.view', 'jobSheets.create', 'jobSheets.edit',
    'payments.view',
    'inventory.view',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getUserPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function canManageUsers(role: UserRole): boolean {
  return hasPermission(role, 'users.manage');
}

export function canViewFinancials(role: UserRole): boolean {
  return hasPermission(role, 'reports.financial');
}

export function isOwnerOrAdmin(role: UserRole): boolean {
  return role === 'OWNER' || role === 'ADMIN';
}

