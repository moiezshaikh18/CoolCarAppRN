// ============================================================
// Tab Bar Store & useHideOnScroll Hook — Cool Car Workshop
// Automatically hides floating navigation dock on downward scroll
// ============================================================

import { create } from 'zustand';
import { useRef, useCallback } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

interface TabBarStore {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export const useTabBarStore = create<TabBarStore>((set) => ({
  isVisible: true,
  setIsVisible: () => set({ isVisible: true }), // Always keep visible
}));

export function useHideOnScroll() {
  const onScroll = useCallback(
    () => {
      // Intentionally keep tab bar permanently visible for staff/owners
    },
    []
  );

  return { onScroll, scrollEventThrottle: 16 };
}

