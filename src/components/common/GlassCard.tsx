// ============================================================
// GlassCard — Sky Blue & Midnight Navy Luxury Card Component
// Directly matching media_1790189780212.png & media_1790189816628.png
// ============================================================

import React from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type GlassCardVariant =
  | 'default'
  | 'navy'
  | 'white'
  | 'sky'
  | 'sand'
  | 'dark'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error';

export type GlassCardIntensity = 'light' | 'medium' | 'heavy';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: GlassCardVariant;
  intensity?: GlassCardIntensity;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  padding?: number;
  radius?: number;
  noBorder?: boolean;
}

export function GlassCard({
  children,
  variant = 'default',
  intensity = 'medium',
  style,
  onPress,
  disabled = false,
  padding,
  radius,
  noBorder = false,
}: GlassCardProps) {
  const { theme, isDark } = useTheme();

  let bg = '#FFFFFF';
  let border = theme.border;

  if (isDark) {
    if (variant === 'navy' || variant === 'dark') {
      bg = '#101927';
      border = 'rgba(255, 255, 255, 0.12)';
    } else if (variant === 'sky') {
      bg = '#16243A';
      border = 'rgba(107, 159, 232, 0.25)';
    } else if (variant === 'sand') {
      bg = '#141A24';
      border = 'rgba(255, 255, 255, 0.08)';
    } else {
      bg = '#111622';
      border = 'rgba(255, 255, 255, 0.08)';
    }
  } else {
    if (variant === 'navy' || variant === 'dark') {
      bg = '#0C1829';
      border = '#0C1829';
    } else if (variant === 'sky') {
      bg = '#6B9FE8';
      border = 'rgba(255, 255, 255, 0.2)';
    } else if (variant === 'sand') {
      bg = '#F4F7FC';
      border = 'rgba(12, 24, 41, 0.05)';
    } else {
      bg = '#FFFFFF';
      border = 'rgba(12, 24, 41, 0.06)';
    }
  }

  const shadowStyle: ViewStyle = isDark
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 4,
      }
    : variant === 'navy'
    ? {
        shadowColor: '#0C1829',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 8,
      }
    : {
        shadowColor: '#0C1829',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
      };

  const cardStyle: ViewStyle = {
    backgroundColor: bg,
    borderRadius: radius !== undefined ? radius : 28,
    borderWidth: noBorder ? 0 : 1,
    borderColor: noBorder ? 'transparent' : border,
    padding: padding !== undefined ? padding : 20,
    overflow: 'hidden',
    ...shadowStyle,
    ...style,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.88}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}
