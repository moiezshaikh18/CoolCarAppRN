// ============================================================
// Payment Service — Enterprise-scoped CRUD
// Payment mode business rules enforced here
// ============================================================

import { where, orderBy } from 'firebase/firestore';
import {
  fetchCollection,
  addDocument,
  voidDocument,
  updateDocument,
} from './firebase/firestore.service';
import { Payment, PaymentFormData, PaymentMode } from '../types/payment.types';
import { COLLECTIONS, enterprisePath } from '../constants/firestore';

const paymentPath = (enterpriseId: string) =>
  enterprisePath(enterpriseId, COLLECTIONS.PAYMENTS);

/**
 * Validate payment mode against account requirement
 * RULE 7-10: UPI/CARD need account; CASH does not
 */
export function validatePaymentMode(
  mode: PaymentMode,
  accountId?: string
): { valid: boolean; error?: string } {
  if (mode === 'CASH') return { valid: true };
  if (!accountId) {
    return {
      valid: false,
      error: `${mode === 'UPI' ? 'UPI' : 'Card Swipe'} payment requires a bank account`,
    };
  }
  return { valid: true };
}

/**
 * Get payments for a job sheet
 */
export async function getJobSheetPayments(
  enterpriseId: string,
  jobSheetId: string
): Promise<Payment[]> {
  return fetchCollection<Payment>(paymentPath(enterpriseId), [
    where('jobSheetId', '==', jobSheetId),
    where('voided', '==', false),
    orderBy('createdAt', 'desc'),
  ]);
}

/**
 * Get payments in a date range
 */
export async function getPaymentsByDateRange(
  enterpriseId: string,
  startDate: string,
  endDate: string
): Promise<Payment[]> {
  return fetchCollection<Payment>(paymentPath(enterpriseId), [
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    where('voided', '==', false),
    orderBy('date', 'desc'),
  ]);
}

/**
 * Create a new payment
 * Enforces mode/account rules
 */
export async function createPayment(
  enterpriseId: string,
  data: PaymentFormData & {
    jobSheetId: string;
    customerId: string;
    vehicleId: string;
    paymentAccountName?: string;
  },
  createdBy: string
): Promise<string> {
  const { valid, error } = validatePaymentMode(data.paymentMode, data.paymentAccountId);
  if (!valid) throw new Error(error);

  const payment: Omit<Payment, 'id'> = {
    enterpriseId,
    jobSheetId: data.jobSheetId,
    customerId: data.customerId,
    vehicleId: data.vehicleId,
    amount: data.amount,
    paymentMode: data.paymentMode,
    paymentAccountId: data.paymentMode === 'CASH' ? undefined : data.paymentAccountId,
    paymentAccountName: data.paymentMode === 'CASH' ? undefined : data.paymentAccountName,
    date: data.date,
    referenceNumber: data.referenceNumber,
    notes: data.notes,
    voided: false,
    createdBy,
    createdAt: new Date().toISOString(),
  };

  return addDocument(paymentPath(enterpriseId), payment);
}

/**
 * Void a payment (never hard-delete)
 */
export async function voidPayment(
  enterpriseId: string,
  paymentId: string,
  reason: string,
  voidedBy: string
): Promise<void> {
  const path = `${paymentPath(enterpriseId)}/${paymentId}`;
  await voidDocument(path, reason, voidedBy);
}

