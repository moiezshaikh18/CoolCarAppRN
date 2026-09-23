// ============================================================
// GlassCard — Premium glassmorphic card component
// ============================================================

import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type GlassCardVariant = 'default' | 'sand' | 'dark' | 'primary' | 'success' | 'warning' | 'error';
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

  const opacityMap: Record<GlassCardIntensity, number> = {
    light: 0.05,
    medium: 0.10,
    heavy: 0.18,
  };

  const variantColor: Record<string, string> = {
    default: isDark ? '#FFFFFF' : '#121214',
    sand: '#D4CEB8',
    dark: '#121214',
    primary: isDark ? '#FFFFFF' : '#121214',
    success: theme.success,
    warning: theme.warning,
    error: theme.error,
  };

  const baseColor = variantColor[variant] || theme.primary;
  const opacity = opacityMap[intensity];

  let bg = '#FFFFFF';
  let border = theme.border;

  if (isDark) {
    if (variant === 'sand') {
      bg = '#222834';
      border = 'rgba(255, 255, 255, 0.08)';
    } else if (variant === 'dark') {
      bg = '#0D0F14';
      border = 'rgba(255, 255, 255, 0.12)';
    } else {
      bg = hexToRgba(baseColor, opacity);
      border = hexToRgba(baseColor, opacity * 2);
    }
  } else {
    if (variant === 'sand') {
      bg = '#EFECE6';
      border = 'rgba(0, 0, 0, 0.04)';
    } else if (variant === 'dark') {
      bg = '#121214';
      border = '#121214';
    } else if (variant === 'default') {
      bg = '#FFFFFF';
      border = theme.border;
    } else {
      bg = hexToRgba(baseColor, 0.08);
      border = hexToRgba(baseColor, 0.2);
    }
  }

  const shadowStyle: ViewStyle = isDark
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 3,
      }
    : {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      };

  const cardStyle: ViewStyle = {
    backgroundColor: bg,
    borderRadius: radius ?? theme.cardRadius,
    borderWidth: noBorder ? 0 : 1,
    borderColor: noBorder ? 'transparent' : border,
    padding: padding ?? theme.cardPadding,
    ...shadowStyle,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.85}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}

function hexToRgba(hex: string, alpha: number): string {
  if (!hex || !hex.startsWith('#')) return `rgba(108,76,241,${alpha})`;
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

