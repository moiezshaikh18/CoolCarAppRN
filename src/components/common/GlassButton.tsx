// ============================================================
// GlassButton — Premium glassmorphic button
// ============================================================

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function GlassButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}: GlassButtonProps) {
  const { theme } = useTheme();

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 },
    md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 15 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 17 },
  };

  const variantStyles: Record<ButtonVariant, { bg: string; border: string; text: string }> = {
    primary: {
      bg: hexToRgba(theme.primary, 0.85),
      border: hexToRgba(theme.primary, 1),
      text: '#FFFFFF',
    },
    secondary: {
      bg: hexToRgba(theme.secondary, 0.2),
      border: hexToRgba(theme.secondary, 0.5),
      text: theme.secondary,
    },
    ghost: {
      bg: 'rgba(255,255,255,0.08)',
      border: 'rgba(255,255,255,0.2)',
      text: theme.text,
    },
    danger: {
      bg: hexToRgba(theme.error, 0.85),
      border: hexToRgba(theme.error, 1),
      text: '#FFFFFF',
    },
    success: {
      bg: hexToRgba(theme.success, 0.85),
      border: hexToRgba(theme.success, 1),
      text: '#FFFFFF',
    },
  };

  const v = variantStyles[variant];
  const s = sizeStyles[size];

  const buttonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: disabled ? 'rgba(255,255,255,0.1)' : v.bg,
    borderWidth: 1,
    borderColor: disabled ? 'rgba(255,255,255,0.15)' : v.border,
    borderRadius: theme.buttonRadius,
    paddingVertical: s.paddingVertical,
    paddingHorizontal: s.paddingHorizontal,
    gap: 8,
    ...(fullWidth && { width: '100%' }),
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: variant === 'primary' ? 0.35 : 0.1,
    shadowRadius: 8,
    elevation: variant === 'primary' ? 4 : 1,
  };

  const labelStyle: TextStyle = {
    color: disabled ? 'rgba(255,255,255,0.4)' : v.text,
    fontSize: s.fontSize,
    fontWeight: '600',
    letterSpacing: 0.3,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[buttonStyle, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[labelStyle, textStyle]}>{label}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  if (!hex || !hex.startsWith('#')) return `rgba(108,76,241,${alpha})`;
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

