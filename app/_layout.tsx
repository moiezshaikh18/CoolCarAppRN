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
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

