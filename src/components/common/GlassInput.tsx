// ============================================================
// GlassInput — Glassmorphic text input
// ============================================================

import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface GlassInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const GlassInput = forwardRef<TextInput, GlassInputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      required,
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [focused, setFocused] = useState(false);

    const borderColor = error
      ? theme.error
      : focused
      ? theme.primary
      : theme.border;

    const inputContainerStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `rgba(255,255,255,0.07)`,
      borderWidth: 1,
      borderColor,
      borderRadius: theme.inputRadius,
      paddingHorizontal: 16,
      minHeight: 52,
    };

    return (
      <View style={[{ marginBottom: 16 }, containerStyle]}>
        {label && (
          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 13,
                fontWeight: '500',
                letterSpacing: 0.2,
              }}
            >
              {label}
            </Text>
            {required && (
              <Text style={{ color: theme.error, marginLeft: 2 }}>*</Text>
            )}
          </View>
        )}

        <View style={inputContainerStyle}>
          {leftIcon && (
            <View style={{ marginRight: 10, opacity: 0.7 }}>{leftIcon}</View>
          )}

          <TextInput
            ref={ref}
            {...props}
            style={[
              {
                flex: 1,
                color: theme.text,
                fontSize: 15,
                paddingVertical: 12,
              },
              style,
            ]}
            placeholderTextColor={theme.textMuted}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
          />

          {rightIcon && (
            <TouchableOpacity
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
              style={{ marginLeft: 10, opacity: 0.7 }}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

        {error ? (
          <Text
            style={{
              color: theme.error,
              fontSize: 12,
              marginTop: 4,
              marginLeft: 4,
            }}
          >
            {error}
          </Text>
        ) : hint ? (
          <Text
            style={{
              color: theme.textMuted,
              fontSize: 12,
              marginTop: 4,
              marginLeft: 4,
            }}
          >
            {hint}
          </Text>
        ) : null}
      </View>
    );
  }
);

GlassInput.displayName = 'GlassInput';

