// ============================================================
// Payment Types
// ============================================================

export type PaymentMode = 'CASH' | 'UPI' | 'CARD_SWIPE';

export type PaymentStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID';

export interface Payment {
  id: string;
  enterpriseId: string;
  jobSheetId: string;
  customerId: string;
  vehicleId: string;
  amount: number;
  paymentMode: PaymentMode;
  paymentAccountId?: string; // null for CASH
  paymentAccountName?: string; // denormalized
  date: Date | string;
  referenceNumber?: string;
  notes?: string;
  voided: boolean;
  voidReason?: string;
  voidedBy?: string;
  voidedAt?: Date | string;
  createdBy: string;
  createdAt: Date | string;
}

export interface PaymentFormData {
  amount: number;
  paymentMode: PaymentMode;
  paymentAccountId?: string;
  date: string;
  referenceNumber?: string;
  notes?: string;
}

export interface PaymentSummary {
  total: number;
  cash: number;
  upi: number;
  cardSwipe: number;
  byAccount: Record<string, number>;
}

