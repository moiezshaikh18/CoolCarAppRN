// ============================================================
// Expense Store
// ============================================================

import { create } from 'zustand';
import { Expense, ExpenseCategory } from '../types/expense.types';

interface ExpenseStore {
  expenses: Expense[];
  categories: ExpenseCategory[];
  isLoading: boolean;
  error: string | null;
  dateFilter: { start: string; end: string } | null;

  setExpenses: (expenses: Expense[]) => void;
  setCategories: (categories: ExpenseCategory[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  voidExpense: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDateFilter: (filter: { start: string; end: string } | null) => void;
  reset: () => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: [],
  categories: [],
  isLoading: false,
  error: null,
  dateFilter: null,

  setExpenses: (expenses) => set({ expenses }),
  setCategories: (categories) => set({ categories }),
  addExpense: (expense) =>
    set((state) => ({ expenses: [expense, ...state.expenses] })),
  updateExpense: (id, data) =>
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)),
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
    set({ expenses: [], categories: [], isLoading: false, error: null, dateFilter: null }),
}));

