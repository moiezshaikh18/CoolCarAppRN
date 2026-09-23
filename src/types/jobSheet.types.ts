// ============================================================
// Job Sheet Types
// ============================================================

import { PaymentMode, PaymentStatus } from './payment.types';

export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type JobItemType = 'SERVICE' | 'PART';

export interface JobItem {
  id: string;
  type: JobItemType;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  amount: number; // quantity * unitPrice
  partId?: string; // if type === PART
  serviceId?: string; // if type === SERVICE
}

export type WorkCategory = 'AC' | 'MECHANICAL' | 'BOTH';

export interface JobSheet {
  id: string;
  enterpriseId: string;
  jobNumber: string;
  customerId: string;
  customerName?: string; // denormalized
  customerPhone?: string; // denormalized
  vehicleId: string;
  vehicleNumber?: string; // denormalized
  vehicleMake?: string;
  vehicleModel?: string;
  workCategory: WorkCategory;
  date: Date | string;
  status: JobStatus;
  items: JobItem[];
  subtotal: number;
  discount: number;
  previousPendingAmount: number;
  finalAmount: number; // (subtotal - discount) + previousPendingAmount
  amountCollectedNow: number;
  totalPaid: number;
  pendingAmount: number;
  paymentStatus: PaymentStatus;
  paymentMode?: PaymentMode;
  bankAccountId?: string;
  bankAccountName?: string;
  assignedMechanicId?: string;
  assignedMechanicName?: string;
  notes?: string;
  voided: boolean;
  voidReason?: string;
  voidedBy?: string;
  voidedAt?: Date | string;
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface JobSheetFormData {
  customerId: string;
  vehicleId: string;
  date: string;
  notes?: string;
  discount?: number;
}

export interface JobItemFormData {
  type: JobItemType;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  partId?: string;
  serviceId?: string;
}

export interface Service {
  id: string;
  enterpriseId: string;
  name: string;
  description?: string;
  defaultPrice: number;
  categoryId?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

