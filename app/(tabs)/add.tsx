// ============================================================
// Add Tab — Center + button (handled by tab bar, this is a placeholder)
// ============================================================

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';

export default function AddScreen() {
  const { theme } = useTheme();
  return <View style={{ flex: 1, backgroundColor: theme.background }} />;
}

