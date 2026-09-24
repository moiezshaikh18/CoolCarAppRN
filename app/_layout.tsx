// ============================================================
// Root Layout — App entry with providers
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
    return () => clearTimeout(timer);
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

