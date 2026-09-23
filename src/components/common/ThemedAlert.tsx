// ============================================================
// ThemedAlertModal Component — Cool Car Workshop
// Replaces basic native OS Alert with luxury themed dialogs
// Directly solves media_1790195805530.png feedback
// ============================================================

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';

export type AlertType = 'error' | 'success' | 'warning' | 'info';

export interface ThemedAlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface ThemedAlertProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message: string;
  buttons?: ThemedAlertButton[];
  onClose?: () => void;
}

export function ThemedAlert({
  visible,
  type = 'error',
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onClose,
}: ThemedAlertProps) {
  const { isDark } = useTheme();

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={32} color="#00C896" />;
      case 'warning':
        return <AlertTriangle size={32} color="#F59E0B" />;
      case 'info':
        return <Info size={32} color="#6B9FE8" />;
      case 'error':
      default:
        return <AlertCircle size={32} color="#EF4444" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'success':
        return 'rgba(0, 200, 150, 0.14)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.14)';
      case 'info':
        return 'rgba(107, 159, 232, 0.14)';
      case 'error':
      default:
        return 'rgba(239, 68, 68, 0.14)';
    }
  };

  const cardBg = isDark ? '#121A29' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(12, 24, 41, 0.08)';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = isDark ? '#94A3B8' : '#64748B';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.dialogContainer,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                },
              ]}
            >
              {/* Icon Badge */}
              <View style={[styles.iconWrapper, { backgroundColor: getIconBg() }]}>
                {getIcon()}
              </View>

              {/* Title & Message */}
              <Text style={[styles.title, { color: textPrimary }]}>{title}</Text>
              <Text style={[styles.message, { color: textMuted }]}>{message}</Text>

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                {buttons.map((btn, index) => {
                  const isCancel = btn.style === 'cancel';
                  const isDestructive = btn.style === 'destructive';

                  let btnBg = isDark ? '#FFFFFF' : '#0C1829';
                  let btnTextColor = isDark ? '#0C1829' : '#FFFFFF';

                  if (isCancel) {
                    btnBg = isDark ? '#1C2538' : '#F1F5F9';
                    btnTextColor = textPrimary;
                  } else if (isDestructive) {
                    btnBg = '#EF4444';
                    btnTextColor = '#FFFFFF';
                  }

                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.85}
                      onPress={() => {
                        if (btn.onPress) btn.onPress();
                        if (onClose) onClose();
                      }}
                      style={[
                        styles.button,
                        {
                          backgroundColor: btnBg,
                          flex: buttons.length > 1 ? 1 : undefined,
                          width: buttons.length === 1 ? '100%' : undefined,
                        },
                      ]}
                    >
                      <Text style={[styles.buttonText, { color: btnTextColor }]}>
                        {btn.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
  },
});

