// ============================================================
// Inventory Types
// ============================================================

export interface SparePart {
  id: string;
  enterpriseId: string;
  name: string;
  partNumber?: string;
  description?: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minimumStock: number;
  supplierId?: string;
  supplierName?: string;
  unit?: string; // pcs, litre, kg, etc.
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SparePartFormData {
  name: string;
  partNumber?: string;
  description?: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minimumStock: number;
  unit?: string;
}

export type InventoryTransactionType =
  | 'JOB_USAGE' // part used in job sheet
  | 'PURCHASE' // stock added
  | 'ADJUSTMENT' // manual correction
  | 'RETURN'; // returned to supplier

export interface InventoryTransaction {
  id: string;
  enterpriseId: string;
  partId: string;
  partName?: string;
  type: InventoryTransactionType;
  quantity: number; // positive = in, negative = out
  quantityBefore: number;
  quantityAfter: number;
  referenceId?: string; // jobSheetId or purchaseId
  referenceType?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date | string;
}

export interface LowStockItem {
  part: SparePart;
  shortage: number;
}

