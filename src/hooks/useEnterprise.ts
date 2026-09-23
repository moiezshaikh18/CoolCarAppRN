// ============================================================
// useEnterprise Hook — Access active enterprise context
// ============================================================

import { useEnterpriseStore } from '../store/enterpriseStore';
import { useThemeContext } from '../theme/theme.provider';
import { Enterprise, EnterpriseMember, UserRole } from '../types/enterprise.types';
import { hasPermission } from '../utils/permissions';
import { MOCK_ENTERPRISE } from '../features/enterprise/mockEnterprise';

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
  const currentEnterprise = activeEnterprise ?? MOCK_ENTERPRISE;
  const role = activeMember?.role ?? 'OWNER';

  return {
    enterprise: currentEnterprise,
    member: activeMember,
    enterpriseId: currentEnterprise.id,
    role,
    currencySymbol: currentEnterprise.currencySymbol ?? '₹',
    can: (permission: string) =>
      role ? hasPermission(role, permission as Parameters<typeof hasPermission>[1]) : true,
    isOwner: role === 'OWNER',
    isAdmin: role === 'OWNER' || role === 'ADMIN',
  };
}

