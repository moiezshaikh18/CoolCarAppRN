// ============================================================
// Inventory Store
// ============================================================

import { create } from 'zustand';
import { SparePart, InventoryTransaction } from '../types/inventory.types';

interface InventoryStore {
  parts: SparePart[];
  selectedPart: SparePart | null;
  transactions: InventoryTransaction[];
  isLoading: boolean;
  error: string | null;

  setParts: (parts: SparePart[]) => void;
  addPart: (part: SparePart) => void;
  updatePart: (id: string, data: Partial<SparePart>) => void;
  setSelectedPart: (part: SparePart | null) => void;
  setTransactions: (transactions: InventoryTransaction[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  parts: [],
  selectedPart: null,
  transactions: [],
  isLoading: false,
  error: null,

  setParts: (parts) => set({ parts }),
  addPart: (part) =>
    set((state) => ({ parts: [part, ...state.parts] })),
  updatePart: (id, data) =>
    set((state) => ({
      parts: state.parts.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  setSelectedPart: (selectedPart) => set({ selectedPart }),
  setTransactions: (transactions) => set({ transactions }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({ parts: [], selectedPart: null, transactions: [], isLoading: false, error: null }),
}));

// Selectors
export const selectLowStockParts = (state: InventoryStore) =>
  state.parts.filter((p) => p.isActive && p.stockQuantity <= p.minimumStock);

