// ============================================================
// Financial Calculations — Centralized business logic
// Never duplicate these in UI components
// ============================================================

import { JobItem } from '../types/jobSheet.types';
import { Payment, PaymentStatus } from '../types/payment.types';

// ─── Job Sheet Calculations ───────────────────────────────────

/**
 * Sum all item amounts in a job sheet
 */
export function calculateJobSubtotal(items: JobItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Job total after discount (never go below 0)
 */
export function calculateJobTotal(subtotal: number, discount: number): number {
  return Math.max(0, subtotal - discount);
}

/**
 * Item amount = quantity × unit price
 */
export function calculateItemAmount(quantity: number, unitPrice: number): number {
  return parseFloat((quantity * unitPrice).toFixed(2));
}

// ─── Payment Calculations ─────────────────────────────────────

/**
 * Sum of non-voided payments
 */
export function calculateTotalPaid(payments: Payment[]): number {
  return payments
    .filter((p) => !p.voided)
    .reduce((sum, p) => sum + p.amount, 0);
}

/**
 * Outstanding amount for a job
 */
export function calculatePendingAmount(
  finalAmount: number,
  totalPaid: number
): number {
  return Math.max(0, finalAmount - totalPaid);
}

/**
 * Derive payment status from amounts
 */
export function derivePaymentStatus(
  finalAmount: number,
  totalPaid: number
): PaymentStatus {
  if (totalPaid <= 0) return 'PENDING';
  if (totalPaid >= finalAmount) return 'PAID';
  return 'PARTIALLY_PAID';
}

// ─── Customer Calculations ────────────────────────────────────

/**
 * Customer outstanding = sum of pending across all job sheets
 */
export function calculateCustomerOutstanding(
  jobs: Array<{ finalAmount: number; totalPaid: number; voided: boolean }>
): number {
  return jobs
    .filter((j) => !j.voided)
    .reduce((sum, j) => sum + calculatePendingAmount(j.finalAmount, j.totalPaid), 0);
}

/**
 * Customer total job value (non-voided)
 */
export function calculateCustomerJobValue(
  jobs: Array<{ finalAmount: number; voided: boolean }>
): number {
  return jobs.filter((j) => !j.voided).reduce((sum, j) => sum + j.finalAmount, 0);
}

// ─── P&L Calculations ────────────────────────────────────────

/**
 * Net operating result = collected - expenses
 */
export function calculateNetResult(
  totalCollected: number,
  totalExpenses: number
): number {
  return totalCollected - totalExpenses;
}

// ─── Payment Mode Totals ──────────────────────────────────────

export interface PaymentModeTotals {
  cash: number;
  upi: number;
  cardSwipe: number;
  total: number;
}

export function calculatePaymentModeTotals(
  payments: Payment[]
): PaymentModeTotals {
  const valid = payments.filter((p) => !p.voided);
  const cash = valid
    .filter((p) => p.paymentMode === 'CASH')
    .reduce((s, p) => s + p.amount, 0);
  const upi = valid
    .filter((p) => p.paymentMode === 'UPI')
    .reduce((s, p) => s + p.amount, 0);
  const cardSwipe = valid
    .filter((p) => p.paymentMode === 'CARD_SWIPE')
    .reduce((s, p) => s + p.amount, 0);
  return { cash, upi, cardSwipe, total: cash + upi + cardSwipe };
}

// ─── Bank Account Balance ─────────────────────────────────────

export function calculateAccountBalance(
  openingBalance: number,
  credits: number,
  debits: number
): number {
  return openingBalance + credits - debits;
}

// ─── Inventory ────────────────────────────────────────────────

export function isLowStock(stockQuantity: number, minimumStock: number): boolean {
  return stockQuantity <= minimumStock;
}

export function calculateStockShortage(
  stockQuantity: number,
  minimumStock: number
): number {
  return Math.max(0, minimumStock - stockQuantity);
}

