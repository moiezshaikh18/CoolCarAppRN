// ============================================================
// UI Store — App-wide UI state (loading overlays, toasts, etc.)
// ============================================================

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface UIStore {
  // Global loading
  globalLoading: boolean;
  globalLoadingMessage: string;

  // Toast notifications
  toasts: Toast[];

  // Bottom sheet
  activeBottomSheet: string | null;

  // Actions
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
  openBottomSheet: (id: string) => void;
  closeBottomSheet: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  globalLoading: false,
  globalLoadingMessage: '',
  toasts: [],
  activeBottomSheet: null,

  showLoading: (message = 'Please wait...') =>
    set({ globalLoading: true, globalLoadingMessage: message }),

  hideLoading: () =>
    set({ globalLoading: false, globalLoadingMessage: '' }),

  showToast: (message, type = 'info', duration = 3000) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: Date.now().toString(), message, type, duration },
      ],
    })),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  openBottomSheet: (id) => set({ activeBottomSheet: id }),
  closeBottomSheet: () => set({ activeBottomSheet: null }),
}));

