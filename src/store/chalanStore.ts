// ============================================================
// Chalan Store — Cool Car Workshop
// Module 4: Daily Inward Spare Parts Purchase Tracker
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PurchaseChalan, ChalanItem } from '../types/chalan.types';

const INITIAL_CHALANS: PurchaseChalan[] = [
  {
    id: 'chalan-001',
    chalanNumber: 'CH-8842',
    vendorName: 'National Auto Spares',
    vendorPhone: '+919822100123',
    date: '2026-09-24',
    time: '10:30 AM',
    items: [
      {
        id: 'item-1',
        partName: 'Denso AC Compressor (Honda)',
        quantity: 1,
        unitPrice: 12500,
        totalPrice: 12500,
        assignedVehicleNumber: 'MH02AB1234',
        assignedVehicleModel: 'Honda City ZX',
      },
      {
        id: 'item-2',
        partName: 'Bosch Front Brake Pads Set',
        quantity: 1,
        unitPrice: 2200,
        totalPrice: 2200,
        assignedVehicleNumber: 'DL04CD5678',
        assignedVehicleModel: 'Hyundai Creta SX',
      },
      {
        id: 'item-3',
        partName: 'AC Gas R134a Canisters (450g)',
        quantity: 3,
        unitPrice: 900,
        totalPrice: 2700,
        assignedVehicleNumber: 'General Workshop Stock',
        assignedVehicleModel: 'Workshop Inventory',
      },
    ],
    totalAmount: 17400,
    amountPaid: 17400,
    pendingAmount: 0,
    paymentMode: 'UPI',
    bankAccountId: 'bank-icici-qr',
    bankAccountName: 'ICICI Workshop UPI QR',
    notes: 'Urgent morning parts delivery for ongoing jobs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chalan-002',
    chalanNumber: 'CH-8839',
    vendorName: 'Metro Car AC Emporium',
    vendorPhone: '+919833099881',
    date: '2026-09-23',
    time: '04:15 PM',
    items: [
      {
        id: 'item-4',
        partName: 'Subros AC Cooling Coil',
        quantity: 1,
        unitPrice: 4800,
        totalPrice: 4800,
        assignedVehicleNumber: 'MH04EF9012',
        assignedVehicleModel: 'Maruti Brezza ZDi',
      },
      {
        id: 'item-5',
        partName: 'Expansion Valve Genuine',
        quantity: 1,
        unitPrice: 1650,
        totalPrice: 1650,
        assignedVehicleNumber: 'MH04EF9012',
        assignedVehicleModel: 'Maruti Brezza ZDi',
      },
    ],
    totalAmount: 6450,
    amountPaid: 4000,
    pendingAmount: 2450,
    paymentMode: 'CASH',
    bankAccountId: 'bank-cash',
    bankAccountName: 'Cash Counter / In Hand',
    notes: 'Rs 2,450 remaining balance to be settled Saturday',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

interface ChalanStore {
  chalans: PurchaseChalan[];
  isLoading: boolean;
  addChalan: (chalan: PurchaseChalan) => void;
  deleteChalan: (id: string) => void;
  getChalanById: (id: string) => PurchaseChalan | undefined;
}

export const useChalanStore = create<ChalanStore>()(
  persist(
    (set, get) => ({
      chalans: INITIAL_CHALANS,
      isLoading: false,

      addChalan: (chalan) =>
        set((state) => ({ chalans: [chalan, ...state.chalans] })),

      deleteChalan: (id) =>
        set((state) => ({
          chalans: state.chalans.filter((c) => c.id !== id),
        })),

      getChalanById: (id) => get().chalans.find((c) => c.id === id),
    }),
    {
      name: 'cool-car-chalan-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
