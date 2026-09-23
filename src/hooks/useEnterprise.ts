// ============================================================
// useEnterprise Hook — Access active enterprise context
// ============================================================

import { useEnterpriseStore } from '../store/enterpriseStore';
import { useThemeContext } from '../theme/theme.provider';
import { Enterprise, EnterpriseMember, UserRole } from '../types/enterprise.types';
import { hasPermission } from '../utils/permissions';

export interface UseEnterpriseReturn {
  enterprise: Enterprise | null;
  member: EnterpriseMember | null;
  enterpriseId: string | null;
  role: UserRole | null;
  currencySymbol: string;
  can: (permission: string) => boolean;
  isOwner: boolean;
  isAdmin: boolean;
}

export function useEnterprise(): UseEnterpriseReturn {
  const { activeEnterprise, activeMember } = useEnterpriseStore();
  const { applyEnterpriseTheme } = useThemeContext();

  const role = activeMember?.role ?? null;

  return {
    enterprise: activeEnterprise,
    member: activeMember,
    enterpriseId: activeEnterprise?.id ?? null,
    role,
    currencySymbol: activeEnterprise?.currencySymbol ?? '₹',
    can: (permission: string) =>
      role ? hasPermission(role, permission as Parameters<typeof hasPermission>[1]) : false,
    isOwner: role === 'OWNER',
    isAdmin: role === 'OWNER' || role === 'ADMIN',
  };
}

