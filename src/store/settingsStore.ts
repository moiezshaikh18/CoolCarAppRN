// ============================================================
// Settings Store
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsStore {
  // User preferences
  prefersDarkMode: boolean;
  language: string;
  notificationsEnabled: boolean;
  biometricEnabled: boolean;

  // App-level
  lastBackupAt: string | null;
  onboardingCompleted: boolean;

  // Actions
  setDarkMode: (enabled: boolean) => void;
  setLanguage: (lang: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  setLastBackupAt: (date: string) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      prefersDarkMode: false,
      language: 'en',
      notificationsEnabled: true,
      biometricEnabled: false,
      lastBackupAt: null,
      onboardingCompleted: false,

      setDarkMode: (prefersDarkMode) => set({ prefersDarkMode }),
      setLanguage: (language) => set({ language }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setBiometricEnabled: (biometricEnabled) => set({ biometricEnabled }),
      setLastBackupAt: (lastBackupAt) => set({ lastBackupAt }),
      setOnboardingCompleted: (onboardingCompleted) => set({ onboardingCompleted }),
      reset: () =>
        set({
          prefersDarkMode: false,
          language: 'en',
          notificationsEnabled: true,
          biometricEnabled: false,
          lastBackupAt: null,
          onboardingCompleted: false,
        }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

