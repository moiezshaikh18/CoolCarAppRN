// ============================================================
// AppHeader — Top navigation bar with glassmorphic style
// ============================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  showNotifications?: boolean;
  onNotificationsPress?: () => void;
  transparent?: boolean;
  style?: ViewStyle;
}

export function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightElement,
  showNotifications = false,
  onNotificationsPress,
  transparent = false,
  style,
}: AppHeaderProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        {
          paddingTop: insets.top + (Platform.OS === 'android' ? 8 : 0),
          paddingBottom: 12,
          paddingHorizontal: 20,
          backgroundColor: transparent ? 'transparent' : 'rgba(13,11,31,0.9)',
          borderBottomWidth: transparent ? 0 : 1,
          borderBottomColor: theme.borderLight,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        },
        style,
      ]}
    >
      {/* Left */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: 'rgba(255,255,255,0.08)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.borderLight,
            }}
          >
            <ArrowLeft size={18} color={theme.text} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: theme.text,
              fontSize: subtitle ? 16 : 20,
              fontWeight: '700',
              letterSpacing: -0.3,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                color: theme.textMuted,
                fontSize: 12,
                marginTop: 1,
              }}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Right */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {rightElement}
        {showNotifications && (
          <TouchableOpacity
            onPress={onNotificationsPress}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: 'rgba(255,255,255,0.08)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.borderLight,
            }}
          >
            <Bell size={18} color={theme.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

