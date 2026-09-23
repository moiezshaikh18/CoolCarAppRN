// ============================================================
// EmptyState, LoadingState, ErrorState — Utility states
// ============================================================

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { GlassButton } from './GlassButton';

// ─── Empty State ──────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        gap: 16,
      }}
    >
      {icon && (
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.06)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
          }}
        >
          {icon}
        </View>
      )}
      <Text
        style={{
          color: theme.text,
          fontSize: 18,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <GlassButton label={actionLabel} onPress={onAction} style={{ marginTop: 8 }} />
      )}
    </View>
  );
}

// ─── Loading State ────────────────────────────────────────────

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 40,
      }}
    >
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={{ color: theme.textMuted, fontSize: 14 }}>{message}</Text>
    </View>
  );
}

// ─── Error State ──────────────────────────────────────────────

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 40,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: `rgba(255,77,109,0.15)`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 28 }}>⚠️</Text>
      </View>
      <Text
        style={{
          color: theme.text,
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        Oops!
      </Text>
      <Text
        style={{
          color: theme.textMuted,
          fontSize: 14,
          textAlign: 'center',
          lineHeight: 20,
        }}
      >
        {message}
      </Text>
      {onRetry && (
        <GlassButton label="Try Again" onPress={onRetry} variant="secondary" />
      )}
    </View>
  );
}

