// ============================================================
// Customer Service — Enterprise-scoped CRUD
// ============================================================

import { where, orderBy, limit } from 'firebase/firestore';
import {
  fetchCollection,
  addDocument,
  updateDocument,
  softDelete,
  subscribeCollection,
} from './firebase/firestore.service';
import { Customer, CustomerFormData } from '../types/customer.types';
import { COLLECTIONS, enterprisePath } from '../constants/firestore';
import { normalizePhone } from '../utils/search';

const customerPath = (enterpriseId: string) =>
  enterprisePath(enterpriseId, COLLECTIONS.CUSTOMERS);

/**
 * Fetch all active customers for an enterprise
 * (Paginated in production with fetchPage)
 */
export async function getCustomers(
  enterpriseId: string,
  limitCount = 50
): Promise<Customer[]> {
  return fetchCollection<Customer>(customerPath(enterpriseId), [
    where('isActive', '==', true),
    orderBy('name', 'asc'),
    limit(limitCount),
  ]);
}

/**
 * Search customers by phone
 */
export async function searchCustomersByPhone(
  enterpriseId: string,
  phone: string
): Promise<Customer[]> {
  const normalized = normalizePhone(phone);
  return fetchCollection<Customer>(customerPath(enterpriseId), [
    where('phone', '==', normalized),
    where('isActive', '==', true),
  ]);
}

/**
 * Create a new customer
 */
export async function createCustomer(
  enterpriseId: string,
  data: CustomerFormData,
  createdBy: string
): Promise<string> {
  const customer: Omit<Customer, 'id'> = {
    enterpriseId,
    ...data,
    totalJobs: 0,
    totalSpent: 0,
    totalPaid: 0,
    pendingAmount: 0,
    isActive: true,
    createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return addDocument(customerPath(enterpriseId), customer);
}

/**
 * Update customer data
 */
export async function updateCustomer(
  enterpriseId: string,
  customerId: string,
  data: Partial<CustomerFormData>
): Promise<void> {
  const path = `${customerPath(enterpriseId)}/${customerId}`;
  await updateDocument(path, data as Record<string, unknown>);
}

/**
 * Soft delete (isActive = false)
 */
export async function deleteCustomer(
  enterpriseId: string,
  customerId: string,
  deletedBy: string
): Promise<void> {
  const path = `${customerPath(enterpriseId)}/${customerId}`;
  await softDelete(path, deletedBy);
}

/**
 * Real-time subscription to customers
 */
export function subscribeToCustomers(
  enterpriseId: string,
  callback: (customers: Customer[]) => void
) {
  return subscribeCollection<Customer>(
    customerPath(enterpriseId),
    [where('isActive', '==', true), orderBy('name', 'asc')],
    callback
  );
}

