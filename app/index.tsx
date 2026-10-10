// ============================================================
// App Index — Auth-aware Entry Screen
// Waits for Zustand store hydration, then routes:
//   authenticated  → /(tabs)
//   unauthenticated → /(auth)/welcome
//   loading/unknown → /(auth)/splash (show branding while deciding)
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { useEnterpriseStore } from '../src/store/enterpriseStore';

export default function Index() {
  const [hydrated, setHydrated] = useState(false);

  // Subscribe to store hydration
  useEffect(() => {
    // Both stores use AsyncStorage persist — wait for both to rehydrate
    let authReady = false;
    let enterpriseReady = false;

    const checkReady = () => {
      if (authReady && enterpriseReady) setHydrated(true);
    };

    // useAuthStore.persist.onFinishHydration fires once on first load
    const unsubAuth = useAuthStore.persist.onFinishHydration(() => {
      authReady = true;
      checkReady();
    });

    const unsubEnterprise = useEnterpriseStore.persist.onFinishHydration(() => {
      enterpriseReady = true;
      checkReady();
    });

    // Safety: if already hydrated (e.g. fast second render), mark ready
    if (useAuthStore.persist.hasHydrated()) authReady = true;
    if (useEnterpriseStore.persist.hasHydrated()) enterpriseReady = true;
    checkReady();

    // Absolute timeout: after 2s, proceed regardless
    const safetyTimer = setTimeout(() => setHydrated(true), 2000);

    return () => {
      unsubAuth();
      unsubEnterprise();
      clearTimeout(safetyTimer);
    };
  }, []);

  const authState = useAuthStore((s) => s.authState);
  const user = useAuthStore((s) => s.user);
  const activeEnterprise = useEnterpriseStore((s) => s.activeEnterprise);

  // Show minimal loading screen while stores hydrate
  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: '#031636', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // Authenticated — go directly to dashboard
  if (user || authState === 'authenticated') {
    return <Redirect href="/(tabs)" />;
  }

  // Has Firebase UID but no profile yet — go to profile creation
  if (authState === 'onboarding') {
    return <Redirect href="/(auth)/create-profile" />;
  }

  // Not authenticated — show the branded splash then welcome flow
  return <Redirect href="/(auth)/splash" />;
}
