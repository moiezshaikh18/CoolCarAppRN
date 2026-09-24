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
    accountName: 'Cash Counter / In Hand',
    bankName: 'Cash in Hand',
    accountNumber: 'CASH-001',
    accountType: 'CASH_IN_HAND',
    openingBalance: 25000,
    currentBalance: 32450,
    isDefault: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bank-hdfc',
    enterpriseId: 'enterprise-cool-car',
    accountName: 'HDFC Current A/c (Primary)',
    bankName: 'HDFC Bank',
    accountNumber: '50200089234112',
    accountNumberMasked: '••••4112',
    ifscCode: 'HDFC0001234',
    accountType: 'CURRENT',
    openingBalance: 50000,
    currentBalance: 78500,
    isDefault: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bank-sbi',
    enterpriseId: 'enterprise-cool-car',
    accountName: 'SBI Workshop Savings',
    bankName: 'State Bank of India',
    accountNumber: '30982341902',
    accountNumberMasked: '••••1902',
    ifscCode: 'SBIN0004321',
    accountType: 'SAVINGS',
    openingBalance: 15000,
    currentBalance: 24000,
    isDefault: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bank-icici-qr',
    enterpriseId: 'enterprise-cool-car',
    accountName: 'ICICI Workshop UPI QR',
    bankName: 'ICICI Bank',
    accountNumber: '001205009941',
    accountNumberMasked: '••••9941',
    ifscCode: 'ICIC0000012',
    accountType: 'CURRENT',
    openingBalance: 10000,
    currentBalance: 18200,
    isDefault: false,
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
      name: 'cool-car-bank-accounts',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors
export const selectActiveAccounts = (state: BankAccountStore) =>
  (state?.accounts || []).filter((a) => a?.isActive);
export const selectCashAccount = (state: BankAccountStore) =>
  (state?.accounts || []).find((a) => a?.accountType === 'CASH_IN_HAND');

