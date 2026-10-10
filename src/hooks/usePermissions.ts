// ============================================================
// Role-Based Access Control (RBAC) & Permissions Hook
// Enforces Owner vs Staff privileges across Cool Car Garage
// ============================================================

import { useMemo } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useEnterpriseStore } from '../store/enterpriseStore';
import { useEmployeeStore } from '../store/employeeStore';
import { EmployeePrivileges } from '../types/employee.types';

export interface UserPermissions extends EmployeePrivileges {
  isOwner: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  userName: string;
  userPhone: string;
  checkOrAlert: (privilege: keyof EmployeePrivileges, actionDescription?: string) => boolean;
}

export function usePermissions(): UserPermissions {
  const user = useAuthStore((s) => s.user);
  const activeMember = useEnterpriseStore((s) => s.activeMember);
  const employees = useEmployeeStore((s) => s.employees);

  return useMemo(() => {
    const rawRole = activeMember?.role || 'OWNER';
    const isOwner = rawRole === 'OWNER';
    const isAdmin = rawRole === 'ADMIN' || isOwner;
    const isStaff = !isOwner && !isAdmin;

    const userPhoneClean = (user?.phone || activeMember?.phone || '').replace(/\D/g, '').slice(-10);
    const userName = user?.displayName || activeMember?.displayName || 'User';

    // Look up staff profile if role is STAFF
    const matchedEmployee = employees.find((emp) => {
      const empPhoneClean = (emp.phone || '').replace(/\D/g, '').slice(-10);
      return (
        (userPhoneClean && empPhoneClean === userPhoneClean) ||
        (emp.name && userName && emp.name.toLowerCase() === userName.toLowerCase())
      );
    });

    let canCreateJobSheets = true;
    let canRecordExpenses = true;
    let canManageChalans = true;
    let canViewBankBalances = true;
    let canViewReports = true;

    if (isStaff) {
      if (matchedEmployee?.privileges) {
        canCreateJobSheets = Boolean(matchedEmployee.privileges.canCreateJobSheets);
        canRecordExpenses = Boolean(matchedEmployee.privileges.canRecordExpenses);
        canManageChalans = Boolean(matchedEmployee.privileges.canManageChalans);
        canViewBankBalances = Boolean(matchedEmployee.privileges.canViewBankBalances);
        canViewReports = Boolean(matchedEmployee.privileges.canViewReports);
      } else {
        // Default safe staff privileges
        canCreateJobSheets = true;
        canRecordExpenses = false;
        canManageChalans = false;
        canViewBankBalances = false;
        canViewReports = false;
      }
    }

    const checkOrAlert = (privilege: keyof EmployeePrivileges, actionDescription = 'access this section'): boolean => {
      if (isOwner || isAdmin) return true;

      const allowed = {
        canCreateJobSheets,
        canRecordExpenses,
        canManageChalans,
        canViewBankBalances,
        canViewReports,
      }[privilege];

      if (!allowed) {
        Alert.alert(
          'Access Restricted 🔒',
          `You do not have staff permission to ${actionDescription}. Please contact the Workshop Owner.`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return false;
      }
      return true;
    };

    return {
      isOwner,
      isAdmin,
      isStaff,
      userName,
      userPhone: user?.phone || '',
      canCreateJobSheets,
      canRecordExpenses,
      canManageChalans,
      canViewBankBalances,
      canViewReports,
      checkOrAlert,
    };
  }, [user, activeMember, employees]);
}
