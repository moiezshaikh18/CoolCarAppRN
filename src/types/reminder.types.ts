// ============================================================
// Reminder Types
// ============================================================

export type ReminderType =
  | 'SERVICE_DUE'
  | 'INSURANCE_EXPIRY'
  | 'PENDING_PAYMENT'
  | 'CUSTOMER_FOLLOWUP';

export type ReminderStatus = 'PENDING' | 'SENT' | 'DISMISSED' | 'COMPLETED';

export interface Reminder {
  id: string;
  enterpriseId: string;
  type: ReminderType;
  title: string;
  description?: string;
  customerId?: string;
  customerName?: string;
  vehicleId?: string;
  vehicleNumber?: string;
  jobSheetId?: string;
  dueDate: Date | string;
  status: ReminderStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ReminderFormData {
  type: ReminderType;
  title: string;
  description?: string;
  customerId?: string;
  vehicleId?: string;
  jobSheetId?: string;
  dueDate: string;
}

