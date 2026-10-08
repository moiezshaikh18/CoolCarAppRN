// ============================================================
// App Index — Entry Screen (Always launch modern Splash first)
// ============================================================

import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Always route directly to Splash screen first so user sees the animated branding
  return <Redirect href="/(auth)/splash" />;
}
