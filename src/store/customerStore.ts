// ============================================================
// Customer Store
// ============================================================

import { create } from 'zustand';
import { Customer, CustomerFilter } from '../types/customer.types';

interface CustomerStore {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  filter: CustomerFilter;
  searchQuery: string;
  lastFetched: number | null;

  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: Partial<CustomerFilter>) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  filter: { isActive: true, sortBy: 'name', sortOrder: 'asc' },
  searchQuery: '',
  lastFetched: null,

  setCustomers: (customers) => set({ customers, lastFetched: Date.now() }),
  addCustomer: (customer) =>
    set((state) => ({ customers: [customer, ...state.customers] })),
  updateCustomer: (id, data) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),
  removeCustomer: (id) =>
    set((state) => ({ customers: state.customers.filter((c) => c.id !== id) })),
  setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  reset: () =>
    set({
      customers: [],
      selectedCustomer: null,
      isLoading: false,
      error: null,
      searchQuery: '',
      lastFetched: null,
    }),
}));

