// ============================================================
// Job Sheet Store
// ============================================================

import { create } from 'zustand';
import { JobSheet } from '../types/jobSheet.types';

interface JobSheetStore {
  jobSheets: JobSheet[];
  selectedJobSheet: JobSheet | null;
  isLoading: boolean;
  error: string | null;
  statusFilter: string | null;

  setJobSheets: (jobSheets: JobSheet[]) => void;
  addJobSheet: (jobSheet: JobSheet) => void;
  updateJobSheet: (id: string, data: Partial<JobSheet>) => void;
  setSelectedJobSheet: (jobSheet: JobSheet | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStatusFilter: (status: string | null) => void;
  reset: () => void;
}

export const useJobSheetStore = create<JobSheetStore>((set) => ({
  jobSheets: [],
  selectedJobSheet: null,
  isLoading: false,
  error: null,
  statusFilter: null,

  setJobSheets: (jobSheets) => set({ jobSheets }),
  addJobSheet: (jobSheet) =>
    set((state) => ({ jobSheets: [jobSheet, ...state.jobSheets] })),
  updateJobSheet: (id, data) =>
    set((state) => ({
      jobSheets: state.jobSheets.map((j) => (j.id === id ? { ...j, ...data } : j)),
    })),
  setSelectedJobSheet: (selectedJobSheet) => set({ selectedJobSheet }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  reset: () =>
    set({ jobSheets: [], selectedJobSheet: null, isLoading: false, error: null }),
}));

