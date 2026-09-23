// ============================================================
// Report Types
// ============================================================

export type DateRangePreset =
  | 'TODAY'
  | 'THIS_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'CUSTOM';

export interface DateRange {
  start: Date | string;
  end: Date | string;
  preset: DateRangePreset;
}

export interface DashboardMetrics {
  todayCollections: number;
  todayExpenses: number;
  pendingAmount: number;
  todayJobs: number;
  monthlyJobValue: number;
  monthlyCollected: number;
  monthlyExpenses: number;
  monthlyOutstanding: number;
}

export interface CollectionReport {
  dateRange: DateRange;
  totalCollected: number;
  cashCollected: number;
  upiCollected: number;
  cardCollected: number;
  byAccount: { accountId: string; accountName: string; amount: number }[];
  byDay: { date: string; amount: number }[];
}

export interface ExpenseReport {
  dateRange: DateRange;
  totalExpenses: number;
  byCategory: { categoryId: string; categoryName: string; amount: number }[];
  byPaymentMode: { mode: string; amount: number }[];
  byDay: { date: string; amount: number }[];
}

export interface ProfitLossReport {
  dateRange: DateRange;
  totalJobValue: number;
  totalCollected: number;
  totalOutstanding: number;
  totalExpenses: number;
  netOperatingResult: number;
}

export interface OutstandingReport {
  customers: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    totalJobValue: number;
    totalPaid: number;
    pendingAmount: number;
    lastJobDate: string;
  }[];
  totalOutstanding: number;
}

export interface PaymentModeReport {
  dateRange: DateRange;
  cash: number;
  upi: number;
  cardSwipe: number;
  total: number;
}

