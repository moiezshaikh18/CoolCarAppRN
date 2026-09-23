// ============================================================
// usePermissions Hook — Role-based UI guards
// ============================================================

import { useEnterpriseStore } from '../store/enterpriseStore';
import { hasPermission, getUserPermissions } from '../utils/permissions';
import { UserRole } from '../types/enterprise.types';

type Permission = Parameters<typeof hasPermission>[1];

export function usePermissions() {
  const { activeMember } = useEnterpriseStore();
  const role = activeMember?.role as UserRole | undefined;

  const can = (permission: Permission): boolean => {
    if (!role) return false;
    return hasPermission(role, permission);
  };

  const canAny = (permissions: Permission[]): boolean => {
    return permissions.some((p) => can(p));
  };

  const canAll = (permissions: Permission[]): boolean => {
    return permissions.every((p) => can(p));
  };

  return {
    role,
    can,
    canAny,
    canAll,
    isOwner: role === 'OWNER',
    isAdmin: role === 'OWNER' || role === 'ADMIN',
    isManager: role === 'MANAGER',
    isAccountant: role === 'ACCOUNTANT',
    isEmployee: role === 'EMPLOYEE',
    permissions: role ? getUserPermissions(role) : [],
  };
}

