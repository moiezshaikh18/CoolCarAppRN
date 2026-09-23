// ============================================================
// Purchase Chalan Types — Cool Car Workshop
// Module 4: Daily Inward Spare Parts Purchase Entry
// Supports 10-N items & Multi-Vehicle allocation per chalan
// ============================================================

export interface ChalanItem {
  id: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  // Which vehicle (car) this part is purchased for (or General Stock)
  assignedVehicleNumber: string; // e.g. 'MH02AB1234' or 'General Stock'
  assignedVehicleModel?: string; // e.g. 'Honda City ZX'
  notes?: string;
}

export interface PurchaseChalan {
  id: string;
  chalanNumber: string; // e.g. 'CH-9401' or 'INV-2026-44'
  vendorName: string;   // e.g. 'National Auto Spares', 'Metro AC Emporium'
  vendorPhone?: string;
  date: string;         // e.g. '2026-09-24'
  time: string;         // e.g. '11:45 AM'
  items: ChalanItem[];  // Dynamic 1 to N items
  totalAmount: number;
  amountPaid: number;
  pendingAmount: number;
  paymentMode: 'CASH' | 'UPI' | 'CARD_SWIPE' | 'PENDING';
  bankAccountId?: string;
  bankAccountName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
