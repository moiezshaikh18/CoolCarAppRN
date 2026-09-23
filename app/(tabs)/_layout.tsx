// ============================================================
// Tabs Layout — Glass bottom navigation
// ============================================================

import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Home, List, BarChart3, MoreHorizontal, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useState } from 'react';
import { GlassBottomSheet } from '../../src/components/common/GlassBottomSheet';
import { router } from 'expo-router';

function GlassTabBar({ state, descriptors, navigation }: any) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [addSheetOpen, setAddSheetOpen] = useState(false);

  const icons = [Home, List, null, BarChart3, MoreHorizontal];

  return (
    <>
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom > 0 ? insets.bottom + 8 : 16,
          left: 20,
          right: 20,
          height: 68,
          borderRadius: 34,
          backgroundColor: isDark ? 'rgba(26, 30, 39, 0.96)' : 'rgba(255, 255, 255, 0.96)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          paddingHorizontal: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark ? 0.35 : 0.08,
          shadowRadius: 18,
          elevation: 10,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const isCenter = index === 2;

          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => setAddSheetOpen(true)}
                activeOpacity={0.8}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#EFECE6',
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                }}
              >
                <Plus size={20} color={isDark ? '#FFFFFF' : '#121214'} strokeWidth={2.5} />
              </TouchableOpacity>
            );
          }

          const Icon = icons[index] as any;
          const inactiveColor = isDark ? 'rgba(255,255,255,0.55)' : '#71717A';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              activeOpacity={0.8}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isFocused
                  ? isDark
                    ? '#FFFFFF'
                    : '#121214'
                  : isDark
                  ? 'rgba(255,255,255,0.06)'
                  : '#EFECE6',
                borderWidth: 1,
                borderColor: isFocused
                  ? 'transparent'
                  : isDark
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.03)',
                shadowColor: isFocused ? '#000' : 'transparent',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: isFocused ? 0.2 : 0,
                shadowRadius: 6,
                elevation: isFocused ? 4 : 0,
              }}
            >
              <Icon
                size={20}
                color={isFocused ? (isDark ? '#12141A' : '#FFFFFF') : inactiveColor}
                strokeWidth={isFocused ? 2.2 : 1.8}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Add Entry Bottom Sheet */}
      <GlassBottomSheet
        visible={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        title="Add New Record"
        snapHeight={460}
      >
        {[
          { label: 'Job Sheet', desc: 'Create vehicle work order', emoji: '📋', route: '/job-sheets/create' },
          { label: 'Customer', desc: 'Register new car owner', emoji: '👤', route: '/customers/add' },
          { label: 'Vehicle', desc: 'Link vehicle to customer', emoji: '🚗', route: '/vehicles/add' },
          { label: 'Spare Part', desc: 'Stock inventory item', emoji: '📦', route: '/inventory/add' },
          { label: 'Expense', desc: 'Log garage outgoing payment', emoji: '💸', route: '/expenses/add' },
          { label: 'Bank Account / Cash', desc: 'Link bank or counter cash', emoji: '🏦', route: '/bank-accounts/add' },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => {
              setAddSheetOpen(false);
              router.push(item.route as any);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              paddingVertical: 12,
              paddingHorizontal: 4,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            }}
          >
            <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>{item.label}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 1 }}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </GlassBottomSheet>
    </>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="entries" options={{ title: 'Entries' }} />
      <Tabs.Screen name="add" options={{ title: '' }} />
      <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
    </Tabs>
  );
}

