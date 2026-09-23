// ============================================================
// Zod Validation Schemas
// ============================================================

import { z } from 'zod';

// ─── Customer Schema ──────────────────────────────────────────

export const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

// ─── Vehicle Schema ───────────────────────────────────────────

export const vehicleSchema = z.object({
  registrationNumber: z
    .string()
    .min(5, 'Enter a valid registration number')
    .max(15)
    .regex(/^[A-Z0-9]+$/i, 'Invalid registration number format'),
  make: z.string().min(2, 'Make is required').max(50),
  model: z.string().min(1, 'Model is required').max(50),
  modelYear: z.coerce
    .number()
    .min(1980)
    .max(new Date().getFullYear() + 1)
    .optional(),
  fuelType: z.enum(['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID', 'LPG']),
  color: z.string().max(30).optional(),
  vin: z.string().max(17).optional(),
  insuranceExpiry: z.string().optional(),
  nextServiceDate: z.string().optional(),
  notes: z.string().max(1000).optional(),
  customerId: z.string().min(1, 'Customer is required'),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

// ─── Payment Schema ───────────────────────────────────────────

export const paymentSchema = z.object({
  amount: z.coerce
    .number()
    .positive('Amount must be positive')
    .max(10_00_00_000, 'Amount too large'),
  paymentMode: z.enum(['CASH', 'UPI', 'CARD_SWIPE']),
  paymentAccountId: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  referenceNumber: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
}).refine(
  (data) => {
    if (data.paymentMode === 'CASH') return true;
    return !!data.paymentAccountId;
  },
  {
    message: 'Bank account is required for UPI and Card Swipe payments',
    path: ['paymentAccountId'],
  }
);

export type PaymentFormValues = z.infer<typeof paymentSchema>;

// ─── Expense Schema ───────────────────────────────────────────

export const expenseSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.coerce
    .number()
    .positive('Amount must be positive')
    .max(10_00_00_000),
  paymentMode: z.enum(['CASH', 'UPI', 'CARD_SWIPE']),
  paymentAccountId: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  description: z.string().max(500).optional(),
}).refine(
  (data) => {
    if (data.paymentMode === 'CASH') return true;
    return !!data.paymentAccountId;
  },
  {
    message: 'Bank account is required for UPI and Card Swipe',
    path: ['paymentAccountId'],
  }
);

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

// ─── Bank Account Schema ──────────────────────────────────────

export const bankAccountSchema = z.object({
  accountName: z.string().min(2, 'Account name required').max(100),
  bankName: z.string().max(100).optional(),
  accountNumberMasked: z.string().max(20).optional(),
  accountType: z.enum(['SAVINGS', 'CURRENT', 'CASH_IN_HAND', 'WALLET']),
  openingBalance: z.coerce.number().min(0).max(10_00_00_00_000),
});

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;

// ─── Spare Part Schema ────────────────────────────────────────

export const sparePartSchema = z.object({
  name: z.string().min(2, 'Part name required').max(100),
  partNumber: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  purchasePrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  stockQuantity: z.coerce.number().int().min(0),
  minimumStock: z.coerce.number().int().min(0),
  unit: z.string().max(20).optional(),
});

export type SparePartFormValues = z.infer<typeof sparePartSchema>;

// ─── Job Sheet Schema ─────────────────────────────────────────

export const jobSheetSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().max(1000).optional(),
  discount: z.coerce.number().min(0).optional(),
});

export type JobSheetFormValues = z.infer<typeof jobSheetSchema>;

export const jobItemSchema = z.object({
  type: z.enum(['SERVICE', 'PART']),
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(300).optional(),
  quantity: z.coerce.number().positive().max(10000),
  unitPrice: z.coerce.number().min(0).max(10_00_00_000),
  partId: z.string().optional(),
  serviceId: z.string().optional(),
});

export type JobItemFormValues = z.infer<typeof jobItemSchema>;

