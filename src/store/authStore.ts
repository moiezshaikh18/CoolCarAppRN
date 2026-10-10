// ============================================================
// Auth Store — Firebase authentication state
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, AuthState } from '../types/auth.types';

interface AuthStore {
  // State
  authState: AuthState;
  user: UserProfile | null;
  firebaseUid: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAuthState: (state: AuthState) => void;
  setUser: (user: UserProfile | null) => void;
  setFirebaseUid: (uid: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  authState: 'loading' as AuthState,
  user: null,
  firebaseUid: null,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setAuthState: (authState) => set({ authState }),
      setUser: (user) => set({ user }),
      setFirebaseUid: (firebaseUid) => set({ firebaseUid }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        firebaseUid: state.firebaseUid,
        authState: state.user ? 'authenticated' : 'unauthenticated',
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.user) {
          state.authState = 'authenticated';
        }
      },
    }
  )
);

// Selectors
export const selectUser = (state: AuthStore) => state.user;
export const selectAuthState = (state: AuthStore) =>
  state.user ? 'authenticated' : state.authState;
export const selectIsAuthenticated = (state: AuthStore) => Boolean(state.user);

