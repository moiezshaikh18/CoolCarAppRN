// ============================================================
// Report Store
// ============================================================

import { create } from 'zustand';
import {
  DashboardMetrics,
  CollectionReport,
  ExpenseReport,
  ProfitLossReport,
  DateRange,
} from '../types/report.types';

interface ReportStore {
  dashboardMetrics: DashboardMetrics | null;
  collectionReport: CollectionReport | null;
  expenseReport: ExpenseReport | null;
  profitLossReport: ProfitLossReport | null;
  activeDateRange: DateRange | null;
  isLoading: boolean;
  error: string | null;

  setDashboardMetrics: (metrics: DashboardMetrics | null) => void;
  setCollectionReport: (report: CollectionReport | null) => void;
  setExpenseReport: (report: ExpenseReport | null) => void;
  setProfitLossReport: (report: ProfitLossReport | null) => void;
  setActiveDateRange: (range: DateRange | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  dashboardMetrics: null,
  collectionReport: null,
  expenseReport: null,
  profitLossReport: null,
  activeDateRange: null,
  isLoading: false,
  error: null,

  setDashboardMetrics: (dashboardMetrics) => set({ dashboardMetrics }),
  setCollectionReport: (collectionReport) => set({ collectionReport }),
  setExpenseReport: (expenseReport) => set({ expenseReport }),
  setProfitLossReport: (profitLossReport) => set({ profitLossReport }),
  setActiveDateRange: (activeDateRange) => set({ activeDateRange }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      dashboardMetrics: null,
      collectionReport: null,
      expenseReport: null,
      profitLossReport: null,
      activeDateRange: null,
      isLoading: false,
      error: null,
    }),
}));

