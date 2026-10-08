// ============================================================
// App Index — Entry router
// Always displays the modern Splash screen first on launch,
// which transitions to Welcome and Dashboard seamlessly.
// ============================================================

import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  return <Redirect href="/(auth)/splash" />;
}
