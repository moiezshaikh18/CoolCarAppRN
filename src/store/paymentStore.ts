// ============================================================
// Payment Store
// ============================================================

import { create } from 'zustand';
import { Payment } from '../types/payment.types';

interface PaymentStore {
  payments: Payment[];
  jobSheetPayments: Payment[]; // payments for current job sheet
  isLoading: boolean;
  error: string | null;

  setPayments: (payments: Payment[]) => void;
  setJobSheetPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  voidPayment: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  jobSheetPayments: [],
  isLoading: false,
  error: null,

  setPayments: (payments) => set({ payments }),
  setJobSheetPayments: (jobSheetPayments) => set({ jobSheetPayments }),
  addPayment: (payment) =>
    set((state) => ({ payments: [payment, ...state.payments] })),
  voidPayment: (id) =>
    set((state) => ({
      payments: state.payments.map((p) =>
        p.id === id ? { ...p, voided: true } : p
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ payments: [], jobSheetPayments: [], isLoading: false, error: null }),
}));

