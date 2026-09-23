// ============================================================
// GlassModal — Glassmorphic modal overlay
// ============================================================

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { X } from 'lucide-react-native';

interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  contentStyle?: ViewStyle;
  scrollable?: boolean;
}

export function GlassModal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  contentStyle,
  scrollable = false,
}: GlassModalProps) {
  const { theme } = useTheme();

  const Content = scrollable ? ScrollView : View;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <View
            style={{
              backgroundColor: `rgba(20,15,40,0.95)`,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: theme.border,
              overflow: 'hidden',
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 24,
              elevation: 20,
            }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 24,
                  paddingTop: 20,
                  paddingBottom: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.borderLight,
                }}
              >
                {title ? (
                  <Text
                    style={{
                      color: theme.text,
                      fontSize: 18,
                      fontWeight: '700',
                    }}
                  >
                    {title}
                  </Text>
                ) : (
                  <View />
                )}
                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={16} color={theme.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Body */}
            <Content style={[{ padding: 24 }, contentStyle]}>
              {children}
            </Content>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

