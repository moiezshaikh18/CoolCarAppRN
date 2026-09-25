// ============================================================
// Chalan Store — Cool Car Workshop
// Module 4: Daily Inward Spare Parts Purchase Tracker
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PurchaseChalan, ChalanItem } from '../types/chalan.types';

const INITIAL_CHALANS: PurchaseChalan[] = [];

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

