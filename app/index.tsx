// ============================================================
// App Index — Auth-based routing guard
// ============================================================

import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { useEffect } from 'react';
import { subscribeToAuthState, getUserProfile } from '../src/services/firebase/auth.service';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { authState, setAuthState, setUser, setFirebaseUid } = useAuthStore();

  useEffect(() => {
    const useMock = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

    if (useMock) {
      // In mock mode, go straight to auth splash
      setAuthState('unauthenticated');
      return;
    }

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

  if (authState === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D0B1F', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#6C4CF1" />
      </View>
    );
  }

  if (authState === 'authenticated') {
    return <Redirect href="/(tabs)" />;
  }

  if (authState === 'onboarding') {
    return <Redirect href="/(auth)/create-profile" />;
  }

  return <Redirect href="/(auth)/splash" />;
}

