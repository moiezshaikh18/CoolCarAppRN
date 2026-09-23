// ============================================================
// Search Utilities — Enterprise-scoped search helpers
// ============================================================

import { Customer } from '../types/customer.types';
import { Vehicle } from '../types/vehicle.types';

/**
 * Filter customers by name or phone (client-side, for cached data)
 * For production, use Firestore queries with proper indexes
 */
export function filterCustomers(
  customers: Customer[],
  query: string
): Customer[] {
  if (!query.trim()) return customers;
  const q = query.toLowerCase().trim();
  return customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
  );
}

/**
 * Filter vehicles by registration number (client-side)
 */
export function filterVehicles(
  vehicles: Vehicle[],
  query: string
): Vehicle[] {
  if (!query.trim()) return vehicles;
  const q = query.toUpperCase().trim().replace(/\s/g, '');
  return vehicles.filter((v) =>
    v.registrationNumber.toUpperCase().replace(/\s/g, '').includes(q)
  );
}

/**
 * Normalize registration number for storage and comparison
 * Strips spaces, converts to uppercase
 */
export function normalizeRegNumber(regNumber: string): string {
  return regNumber.toUpperCase().replace(/\s/g, '');
}

/**
 * Normalize phone for comparison
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '').slice(-10);
}

