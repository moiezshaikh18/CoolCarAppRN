// ============================================================
// Root Layout — App entry with providers
// Central Firestore real-time listeners (employees, bank accounts)
// that persist throughout the entire app lifecycle.
// ============================================================

import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/theme/theme.provider';
import { useSettingsStore } from '../src/store/settingsStore';

// Prevent auto-hide so we can control it
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const prefersDarkMode = useSettingsStore((s) => s.prefersDarkMode);

  useEffect(() => {
    // Hide splash after brief delay so providers mount
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 300);

    // -------------------------------------------------------
    // Central Firebase Auth State Observer
    // Keeps authStore in sync across the full app lifecycle.
    // -------------------------------------------------------
    let unsubAuth: (() => void) | undefined;

    (async () => {
      try {
        const { onAuthStateChanged } = await import('firebase/auth');
        const { auth } = await import('../src/services/firebase/firebase.config');
        const { useAuthStore } = await import('../src/store/authStore');

        unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser) {
            useAuthStore.getState().setFirebaseUid(fbUser.uid);
            const currentState = useAuthStore.getState().authState;
            if (currentState !== 'authenticated') {
              try {
                const { getUserProfile } = await import('../src/services/firebase/auth.service');
                const profile = await getUserProfile(fbUser.uid);
                if (profile) {
                  useAuthStore.getState().setUser(profile);
                  useAuthStore.getState().setAuthState('authenticated');
                }
              } catch {
                // offline — leave existing persisted state intact
              }
            }
          }
          // Note: If fbUser is null, DO NOT wipe the local auth store.
          // The user session is persisted locally in Zustand AsyncStorage.
          // Explicit logout only happens when the user clicks 'Sign Out'.
        });
      } catch (e) {
        console.log('[Layout] Auth sync notice:', e);
      }
    })();

    // -------------------------------------------------------
    // Central Firestore Real-Time Listeners
    // Keeps employees and bank accounts in sync on all devices.
    // -------------------------------------------------------
    let unsubEmployees: (() => void) | undefined;
    let unsubBankAccounts: (() => void) | undefined;

    (async () => {
      try {
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../src/services/firebase/firebase.config');
        const { useEmployeeStore } = await import('../src/store/employeeStore');
        const { useBankAccountStore } = await import('../src/store/bankAccountStore');
        const { useEnterpriseStore } = await import('../src/store/enterpriseStore');

        // Wait briefly for stores to hydrate before setting up listeners
        await new Promise((resolve) => setTimeout(resolve, 800));

        const entId =
          useEnterpriseStore.getState().activeEnterprise?.id || 'enterprise-cool-car';

        // Listen to employees collection
        unsubEmployees = onSnapshot(
          collection(db, 'enterprises', entId, 'employees'),
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
              useEmployeeStore.getState().setEmployees(list);
            }
          },
          (err) => console.log('[Layout] Employees listener error:', err.message)
        );

        // Listen to bank accounts collection
        unsubBankAccounts = onSnapshot(
          collection(db, 'enterprises', entId, 'bankAccounts'),
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
              useBankAccountStore.getState().setAccounts(list);
            }
          },
          (err) => console.log('[Layout] BankAccounts listener error:', err.message)
        );
      } catch (e) {
        console.log('[Layout] Firestore listeners notice:', e);
      }
    })();

    return () => {
      clearTimeout(timer);
      unsubAuth?.();
      unsubEmployees?.();
      unsubBankAccounts?.();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider initialMode={prefersDarkMode ? 'dark' : 'light'}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="job-sheets/create" />
            <Stack.Screen name="job-sheets/[id]" />
            <Stack.Screen name="job-sheets/index" />
            <Stack.Screen name="expenses/add" />
            <Stack.Screen name="expenses/categories" />
            <Stack.Screen name="inventory/chalan-add" />
            <Stack.Screen name="inventory/[id]" />
            <Stack.Screen name="inventory/index" />
            <Stack.Screen name="staff/pay" />
            <Stack.Screen name="staff/add" />
            <Stack.Screen name="staff/[id]" />
            <Stack.Screen name="staff/index" />
            <Stack.Screen name="bank-accounts/index" />
            <Stack.Screen name="bank-accounts/add" />
            <Stack.Screen name="vehicles/add" />
            <Stack.Screen name="vehicles/index" />
            <Stack.Screen name="vehicles/[id]" />
            <Stack.Screen name="customers/index" />
            <Stack.Screen name="customers/add" />
            <Stack.Screen name="customers/[id]" />
            <Stack.Screen name="settings/export" />
            <Stack.Screen name="settings/backup" />
            <Stack.Screen name="settings/about" />
          </Stack>

        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
