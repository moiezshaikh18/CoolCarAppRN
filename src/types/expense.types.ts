// ============================================================
// Expense Types
// ============================================================

import { PaymentMode } from './payment.types';

export interface ExpenseCategory {
  id: string;
  enterpriseId: string;
  name: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: Date | string;
}

export interface Expense {
  id: string;
  enterpriseId: string;
  categoryId: string;
  categoryName?: string; // denormalized
  amount: number;
  paymentMode: PaymentMode;
  paymentAccountId?: string; // null for CASH
  paymentAccountName?: string; // denormalized
  date: Date | string;
  time?: string; // e.g. "02:30 PM"
  spentBy?: string; // e.g. "Irfan Khan" or "Vendor" (Kisne Liya)
  spentByEmployeeId?: string;
  description?: string;
  voided: boolean;
  voidReason?: string;
  voidedBy?: string;
  voidedAt?: Date | string;
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ExpenseFormData {
  categoryId: string;
  amount: number;
  paymentMode: PaymentMode;
  paymentAccountId?: string;
  date: string;
  description?: string;
}

export interface DailyExpenseSummary {
  date: string;
  total: number;
  expenses: Expense[];
}

export type DefaultExpenseCategory =
  | 'Shop Rent'
  | 'Electricity'
  | 'Salary'
  | 'Tools & Equipment'
  | 'Oil & Lubricants'
  | 'Parts & Material'
  | 'Tea & Snacks'
  | 'Transport'
  | 'Miscellaneous';

