// ============================================================
// Vehicle Store
// ============================================================

import { create } from 'zustand';
import { Vehicle } from '../types/vehicle.types';

interface VehicleStore {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  customerVehicles: Vehicle[]; // vehicles for the selected customer
  isLoading: boolean;
  error: string | null;

  setVehicles: (vehicles: Vehicle[]) => void;
  setCustomerVehicles: (vehicles: Vehicle[]) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: [],
  selectedVehicle: null,
  customerVehicles: [],
  isLoading: false,
  error: null,

  setVehicles: (vehicles) => set({ vehicles }),
  setCustomerVehicles: (customerVehicles) => set({ customerVehicles }),
  addVehicle: (vehicle) =>
    set((state) => ({ vehicles: [vehicle, ...state.vehicles] })),
  updateVehicle: (id, data) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...data } : v)),
    })),
  setSelectedVehicle: (selectedVehicle) => set({ selectedVehicle }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({ vehicles: [], selectedVehicle: null, customerVehicles: [], isLoading: false, error: null }),
}));

