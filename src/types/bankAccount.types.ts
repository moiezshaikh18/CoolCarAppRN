// ============================================================
// Bank Account Types
// ============================================================

export type AccountType = 'SAVINGS' | 'CURRENT' | 'CASH_IN_HAND' | 'WALLET';

export interface BankAccount {
  id: string;
  enterpriseId: string;
  accountName: string;
  bankName?: string; // null for CASH_IN_HAND
  accountNumber?: string;
  accountNumberMasked?: string;
  ifscCode?: string;
  accountType: AccountType;
  openingBalance: number;
  currentBalance: number;
  isDefault?: boolean;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BankAccountFormData {
  accountName: string;
  bankName?: string;
  accountNumberMasked?: string;
  accountType: AccountType;
  openingBalance: number;
}

export interface AccountTransaction {
  id: string;
  enterpriseId: string;
  accountId: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  referenceType: 'PAYMENT' | 'EXPENSE' | 'ADJUSTMENT';
  referenceId: string;
  description: string;
  balanceAfter: number;
  date: Date | string;
  createdAt: Date | string;
}

