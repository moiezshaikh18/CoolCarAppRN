// ============================================================
// Bank Account Store — Cool Car Workshop
// Unlimited Bank Accounts & Cash in Hand with Persistence
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BankAccount, AccountTransaction } from '../types/bankAccount.types';

const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-cash',
    enterpriseId: 'enterprise-cool-car',
    accountName: 'Cash Counter Register',
    bankName: 'Cash in Hand',
    accountNumber: 'CASH-001',
    accountType: 'CASH_IN_HAND',
    openingBalance: 0,
    currentBalance: 0,
    isDefault: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface BankAccountStore {
  accounts: BankAccount[];
  selectedAccount: BankAccount | null;
  transactions: AccountTransaction[];
  isLoading: boolean;
  error: string | null;

  setAccounts: (accounts: BankAccount[]) => void;
  addAccount: (account: BankAccount) => void;
  updateAccount: (id: string, data: Partial<BankAccount>) => void;
  deleteAccount: (id: string) => void;
  creditAccount: (id: string, amount: number) => void;
  debitAccount: (id: string, amount: number) => void;
  setSelectedAccount: (account: BankAccount | null) => void;
  setTransactions: (transactions: AccountTransaction[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useBankAccountStore = create<BankAccountStore>()(
  persist(
    (set) => ({
      accounts: INITIAL_BANK_ACCOUNTS,
      selectedAccount: null,
      transactions: [],
      isLoading: false,
      error: null,

      setAccounts: (accounts) => set({ accounts }),
      addAccount: (account) =>
        set((state) => ({ accounts: [account, ...state.accounts] })),
      updateAccount: (id, data) =>
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...data } : a)),
        })),
      deleteAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        })),
      creditAccount: (id, amount) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, currentBalance: a.currentBalance + amount } : a
          ),
        })),
      debitAccount: (id, amount) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, currentBalance: Math.max(0, a.currentBalance - amount) } : a
          ),
        })),
      setSelectedAccount: (selectedAccount) => set({ selectedAccount }),
      setTransactions: (transactions) => set({ transactions }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          accounts: INITIAL_BANK_ACCOUNTS,
          selectedAccount: null,
          transactions: [],
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'cool-car-bank-accounts-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors
export const selectActiveAccounts = (state: BankAccountStore) =>
  (state?.accounts || []).filter((a) => a?.isActive);
export const selectCashAccount = (state: BankAccountStore) =>
  (state?.accounts || []).find((a) => a?.accountType === 'CASH_IN_HAND');

