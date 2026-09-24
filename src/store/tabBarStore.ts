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
  setIsVisible: (isVisible) => set({ isVisible }),
}));

export function useHideOnScroll() {
  const setIsVisible = useTabBarStore((s) => s.setIsVisible);
  const lastOffsetRef = useRef(0);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffset = e.nativeEvent.contentOffset.y;
      const diff = currentOffset - lastOffsetRef.current;

      // If scrolling down past initial header
      if (diff > 8 && currentOffset > 60) {
        setIsVisible(false);
      } else if (diff < -8 || currentOffset <= 25) {
        // If scrolling up or back at the top
        setIsVisible(true);
      }
      lastOffsetRef.current = currentOffset;
    },
    [setIsVisible]
  );

  return { onScroll, scrollEventThrottle: 16 };
}

