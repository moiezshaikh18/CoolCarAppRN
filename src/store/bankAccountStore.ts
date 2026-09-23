// ============================================================
// Bank Account Store
// ============================================================

import { create } from 'zustand';
import { BankAccount, AccountTransaction } from '../types/bankAccount.types';

interface BankAccountStore {
  accounts: BankAccount[];
  selectedAccount: BankAccount | null;
  transactions: AccountTransaction[];
  isLoading: boolean;
  error: string | null;

  setAccounts: (accounts: BankAccount[]) => void;
  addAccount: (account: BankAccount) => void;
  updateAccount: (id: string, data: Partial<BankAccount>) => void;
  setSelectedAccount: (account: BankAccount | null) => void;
  setTransactions: (transactions: AccountTransaction[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useBankAccountStore = create<BankAccountStore>((set) => ({
  accounts: [],
  selectedAccount: null,
  transactions: [],
  isLoading: false,
  error: null,

  setAccounts: (accounts) => set({ accounts }),
  addAccount: (account) =>
    set((state) => ({ accounts: [...state.accounts, account] })),
  updateAccount: (id, data) =>
    set((state) => ({
      accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...data } : a)),
    })),
  setSelectedAccount: (selectedAccount) => set({ selectedAccount }),
  setTransactions: (transactions) => set({ transactions }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({ accounts: [], selectedAccount: null, transactions: [], isLoading: false, error: null }),
}));

// Selectors
export const selectActiveAccounts = (state: BankAccountStore) =>
  state.accounts.filter((a) => a.isActive);
export const selectCashAccount = (state: BankAccountStore) =>
  state.accounts.find((a) => a.accountType === 'CASH_IN_HAND');

