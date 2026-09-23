// ============================================================
// useAuth Hook — Firebase auth state management
// ============================================================

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useEnterpriseStore } from '../store/enterpriseStore';
import { subscribeToAuthState, getUserProfile } from '../services/firebase/auth.service';

export function useAuth() {
  const { authState, user, firebaseUid, isLoading, error,
          setAuthState, setUser, setFirebaseUid } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      if (!firebaseUser) {
        setAuthState('unauthenticated');
        setUser(null);
        setFirebaseUid(null);
        return;
      }

      setFirebaseUid(firebaseUser.uid);

      try {
        const profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          setAuthState('onboarding');
        } else {
          setUser(profile);
          setAuthState('authenticated');
        }
      } catch {
        setAuthState('unauthenticated');
      }
    });

    return unsubscribe;
  }, []);

  return { authState, user, firebaseUid, isLoading, error };
}

