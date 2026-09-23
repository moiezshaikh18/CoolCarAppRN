// ============================================================
// Customer Types
// ============================================================

export interface Customer {
  id: string;
  enterpriseId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  // Cached aggregates (updated via cloud functions or service layer)
  totalJobs: number;
  totalSpent: number;
  totalPaid: number;
  pendingAmount: number;
  lastVisit?: Date | string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy: string;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface CustomerSearchResult {
  customer: Customer;
  matchedOn: 'name' | 'phone';
}

export type CustomerSortField = 'name' | 'lastVisit' | 'pendingAmount' | 'totalSpent';
export type SortOrder = 'asc' | 'desc';

export interface CustomerFilter {
  isActive?: boolean;
  hasPending?: boolean;
  sortBy?: CustomerSortField;
  sortOrder?: SortOrder;
}

