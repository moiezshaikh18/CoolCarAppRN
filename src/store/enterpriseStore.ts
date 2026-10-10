// ============================================================
// Enterprise Store — Active enterprise + membership
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Enterprise, EnterpriseMember, UserEnterpriseMapping } from '../types/enterprise.types';

interface EnterpriseStore {
  // State
  activeEnterprise: Enterprise | null;
  activeMember: EnterpriseMember | null;
  enterprises: UserEnterpriseMapping[]; // list user belongs to
  isLoading: boolean;
  error: string | null;

  // Actions
  setActiveEnterprise: (enterprise: Enterprise | null) => void;
  setActiveMember: (member: EnterpriseMember | null) => void;
  setEnterprises: (list: UserEnterpriseMapping[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

import { MOCK_ENTERPRISE } from '../features/enterprise/mockEnterprise';

const initialState = {
  activeEnterprise: MOCK_ENTERPRISE,
  activeMember: {
    userId: 'owner',
    enterpriseId: MOCK_ENTERPRISE.id,
    role: 'OWNER' as const,
    displayName: 'Workshop Owner',
    phone: '+91 98765 43210',
    isActive: true,
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  enterprises: [],
  isLoading: false,
  error: null,
};

export const useEnterpriseStore = create<EnterpriseStore>()(
  persist(
    (set) => ({
      ...initialState,

      setActiveEnterprise: (activeEnterprise) => set({ activeEnterprise }),
      setActiveMember: (activeMember) => set({ activeMember }),
      setEnterprises: (enterprises) => set({ enterprises }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'enterprise-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activeEnterprise: state.activeEnterprise,
        activeMember: state.activeMember,
        enterprises: state.enterprises,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !state.activeEnterprise) {
          state.activeEnterprise = MOCK_ENTERPRISE;
        }
      },
    }
  )
);

// Selectors
export const selectActiveEnterprise = (state: EnterpriseStore) => state.activeEnterprise;
export const selectActiveMember = (state: EnterpriseStore) => state.activeMember;
export const selectEnterpriseId = (state: EnterpriseStore) =>
  state.activeEnterprise?.id ?? null;
export const selectUserRole = (state: EnterpriseStore) =>
  state.activeMember?.role ?? null;
export const selectCurrencySymbol = (state: EnterpriseStore) =>
  state.activeEnterprise?.currencySymbol ?? '₹';

