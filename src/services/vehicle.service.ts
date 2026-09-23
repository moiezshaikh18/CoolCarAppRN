// ============================================================
// Vehicle Service — Enterprise-scoped CRUD
// ============================================================

import { where, orderBy, limit } from 'firebase/firestore';
import {
  fetchCollection,
  addDocument,
  updateDocument,
  softDelete,
} from './firebase/firestore.service';
import { Vehicle, VehicleFormData } from '../types/vehicle.types';
import { COLLECTIONS, enterprisePath } from '../constants/firestore';
import { normalizeRegNumber } from '../utils/search';

const vehiclePath = (enterpriseId: string) =>
  enterprisePath(enterpriseId, COLLECTIONS.VEHICLES);

/**
 * Get vehicles for a specific customer
 */
export async function getCustomerVehicles(
  enterpriseId: string,
  customerId: string
): Promise<Vehicle[]> {
  return fetchCollection<Vehicle>(vehiclePath(enterpriseId), [
    where('customerId', '==', customerId),
    where('isActive', '==', true),
  ]);
}

/**
 * Search vehicle by registration number
 */
export async function searchVehicleByRegNumber(
  enterpriseId: string,
  regNumber: string
): Promise<Vehicle | null> {
  const normalized = normalizeRegNumber(regNumber);
  const results = await fetchCollection<Vehicle>(vehiclePath(enterpriseId), [
    where('registrationNumber', '==', normalized),
    where('isActive', '==', true),
    limit(1),
  ]);
  return results[0] ?? null;
}

/**
 * Create a new vehicle
 * Ensures registration number is unique within enterprise
 */
export async function createVehicle(
  enterpriseId: string,
  data: VehicleFormData
): Promise<string> {
  const vehicle: Omit<Vehicle, 'id'> = {
    enterpriseId,
    ...data,
    registrationNumber: normalizeRegNumber(data.registrationNumber),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return addDocument(vehiclePath(enterpriseId), vehicle);
}

/**
 * Update vehicle
 */
export async function updateVehicle(
  enterpriseId: string,
  vehicleId: string,
  data: Partial<VehicleFormData>
): Promise<void> {
  const path = `${vehiclePath(enterpriseId)}/${vehicleId}`;
  await updateDocument(path, data as Record<string, unknown>);
}

/**
 * Soft delete vehicle
 */
export async function deleteVehicle(
  enterpriseId: string,
  vehicleId: string,
  deletedBy: string
): Promise<void> {
  const path = `${vehiclePath(enterpriseId)}/${vehicleId}`;
  await softDelete(path, deletedBy);
}

