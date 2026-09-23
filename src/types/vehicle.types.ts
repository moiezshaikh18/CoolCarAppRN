// ============================================================
// Vehicle Types
// ============================================================

export type FuelType = 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC' | 'HYBRID' | 'LPG';

export interface Vehicle {
  id: string;
  enterpriseId: string;
  customerId: string;
  customerName?: string; // denormalized for search
  customerPhone?: string; // denormalized for search
  registrationNumber: string;
  make: string;
  model: string;
  modelYear?: number;
  fuelType: FuelType;
  transmission?: string;
  odometerKm?: number;
  color?: string;
  vin?: string;
  insuranceExpiry?: Date | string;
  lastServiceDate?: Date | string;
  nextServiceDate?: Date | string;
  totalVisits?: number;
  totalJobs?: number;
  totalSpent?: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface VehicleFormData {
  customerId: string;
  registrationNumber: string;
  make: string;
  model: string;
  modelYear?: number;
  fuelType: FuelType;
  color?: string;
  vin?: string;
  insuranceExpiry?: string;
  nextServiceDate?: string;
  notes?: string;
}

export interface VehicleSearchResult {
  vehicle: Vehicle;
  customer?: {
    id: string;
    name: string;
    phone: string;
    pendingAmount: number;
  };
}

