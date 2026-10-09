// ============================================================
// Expense Store
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, ExpenseCategory } from '../types/expense.types';

export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: '1', enterpriseId: 'enterprise-cool-car', name: 'Shop Rent', icon: 'Home', isActive: true, createdAt: new Date().toISOString() },
  { id: '2', enterpriseId: 'enterprise-cool-car', name: 'Electricity Bill', icon: 'Zap', isActive: true, createdAt: new Date().toISOString() },
  { id: '3', enterpriseId: 'enterprise-cool-car', name: 'Staff Salaries', icon: 'Briefcase', isActive: true, createdAt: new Date().toISOString() },
  { id: '4', enterpriseId: 'enterprise-cool-car', name: 'Tools & Equipment', icon: 'Wrench', isActive: true, createdAt: new Date().toISOString() },
  { id: '5', enterpriseId: 'enterprise-cool-car', name: 'Oil & Lubricants', icon: 'Droplet', isActive: true, createdAt: new Date().toISOString() },
  { id: '6', enterpriseId: 'enterprise-cool-car', name: 'Spare Parts & Material', icon: 'Package', isActive: true, createdAt: new Date().toISOString() },
  { id: '7', enterpriseId: 'enterprise-cool-car', name: 'Tea & Snacks', icon: 'Coffee', isActive: true, createdAt: new Date().toISOString() },
  { id: '8', enterpriseId: 'enterprise-cool-car', name: 'Miscellaneous', icon: 'MoreHorizontal', isActive: true, createdAt: new Date().toISOString() },
];

interface ExpenseStore {
  expenses: Expense[];
  categories: ExpenseCategory[];
  isLoading: boolean;
  error: string | null;
  dateFilter: { start: string; end: string } | null;

  setExpenses: (expenses: Expense[]) => void;
  setCategories: (categories: ExpenseCategory[]) => void;
  addCategory: (category: ExpenseCategory) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  voidExpense: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDateFilter: (filter: { start: string; end: string } | null) => void;
  reset: () => void;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],
      categories: DEFAULT_EXPENSE_CATEGORIES,
      isLoading: false,
      error: null,
      dateFilter: null,

      setExpenses: (expenses) => set({ expenses }),
      setCategories: (categories) => set({ categories }),
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      addExpense: (expense) =>
        set((state) => ({ expenses: [expense, ...state.expenses] })),
      updateExpense: (id, data) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      voidExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, voided: true } : e
          ),
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setDateFilter: (dateFilter) => set({ dateFilter }),
      reset: () =>
        set({ expenses: [], categories: DEFAULT_EXPENSE_CATEGORIES, isLoading: false, error: null, dateFilter: null }),
    }),
    {
      name: 'cool-car-expense-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

