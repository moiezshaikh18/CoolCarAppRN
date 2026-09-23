// ============================================================
// GlassBottomSheet — Sliding bottom drawer
// ============================================================

import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { X } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GlassBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapHeight?: number | 'half' | 'full';
  showHandle?: boolean;
  showHeader?: boolean;
  contentStyle?: ViewStyle;
}

export function GlassBottomSheet({
  visible,
  onClose,
  title,
  children,
  snapHeight = 'half',
  showHandle = true,
  showHeader = true,
  contentStyle,
}: GlassBottomSheetProps) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [slideAnim] = useState(() => new Animated.Value(SCREEN_HEIGHT));

  const height =
    snapHeight === 'half'
      ? SCREEN_HEIGHT * 0.55
      : snapHeight === 'full'
      ? SCREEN_HEIGHT * 0.9
      : snapHeight;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            slideAnim.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > height * 0.3) {
            onClose();
          } else {
            Animated.spring(slideAnim, {
              toValue: 0,
              useNativeDriver: true,
              tension: 65,
              friction: 11,
            }).start();
          }
        },
      }),
    [slideAnim, height, onClose]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Sheet */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height,
          backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          borderWidth: 1,
          borderColor: theme.border,
          borderBottomWidth: 0,
          transform: [{ translateY: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.35 : 0.08,
          shadowRadius: 20,
          elevation: 24,
          paddingBottom: insets.bottom,
        }}
      >
        {/* Drag handle */}
        {showHandle && (
          <View
            {...panResponder.panHandlers}
            style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}
          >
            <View
              style={{
                width: 44,
                height: 4,
                borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
              }}
            />
          </View>
        )}

        {/* Header */}
        {showHeader && (title || true) && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: theme.borderLight,
            }}
          >
            <Text
              style={{ color: theme.text, fontSize: 18, fontWeight: '700' }}
            >
              {title ?? ''}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(255,255,255,0.08)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        <ScrollView
          style={[{ flex: 1 }, contentStyle]}
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

