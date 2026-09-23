// ============================================================
// Tabs Layout — Midnight Navy Capsule Dock
// Directly matching media_1790189780212.png & media_1790189816628.png
// ============================================================

import React, { useState } from 'react';
import { Tabs, router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Wallet,
  TrendingUp,
  LayoutGrid,
  Settings,
  Plus,
  Car,
  Receipt,
  FileText,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { GlassBottomSheet } from '../../src/components/common/GlassBottomSheet';

function MidnightNavyTabBar({ state, descriptors, navigation }: any) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [addSheetOpen, setAddSheetOpen] = useState(false);

  const tabConfig = [
    { name: 'index', label: 'Wallet', icon: Wallet },
    { name: 'entries', label: 'Tracking', icon: TrendingUp },
    { name: 'add', label: '', icon: Plus, isAction: true },
    { name: 'reports', label: 'Analytics', icon: LayoutGrid },
    { name: 'more', label: 'Settings', icon: Settings },
  ];

  const dockBg = isDark ? '#101927' : '#0C1829';
  const dockBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)';

  return (
    <>
      {/* Floating Midnight Navy Capsule Dock */}
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom > 0 ? insets.bottom + 8 : 18,
          left: 20,
          right: 20,
          height: 68,
          borderRadius: 34,
          backgroundColor: dockBg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingHorizontal: 8,
          shadowColor: '#0C1829',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.35,
          shadowRadius: 20,
          elevation: 12,
          borderWidth: 1,
          borderColor: dockBorder,
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const config = tabConfig[index] || { label: route.name, icon: Wallet };
          const isFocused = state.index === index;
          const isAction = config.isAction;

          if (isAction) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => setAddSheetOpen(true)}
                activeOpacity={0.8}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
                }}
              >
                <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            );
          }

          const Icon = config.icon;
          const activeColor = '#FFFFFF';
          const inactiveColor = 'rgba(255, 255, 255, 0.5)';

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
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 6,
                paddingHorizontal: 12,
              }}
            >
              <Icon size={20} color={isFocused ? activeColor : inactiveColor} strokeWidth={isFocused ? 2.4 : 1.8} />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: isFocused ? '800' : '600',
                  color: isFocused ? activeColor : inactiveColor,
                  marginTop: 3,
                }}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quick Action Bottom Sheet */}
      <GlassBottomSheet
        visible={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        title="Quick Operations"
        snapHeight="half"
      >
        <View style={{ gap: 12, paddingBottom: 16 }}>
          {/* New Job Sheet */}
          <TouchableOpacity
            onPress={() => {
              setAddSheetOpen(false);
              router.push('/job-sheets/create');
            }}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderRadius: 22,
              backgroundColor: isDark ? '#141926' : '#F4F7FC',
              gap: 14,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#0C1829',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 16, fontWeight: '800' }}>
                Create Job Sheet
              </Text>
              <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>
                Search vehicle, assign parts & labor
              </Text>
            </View>
          </TouchableOpacity>

          {/* Add Expense */}
          <TouchableOpacity
            onPress={() => {
              setAddSheetOpen(false);
              router.push('/expenses/add');
            }}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderRadius: 22,
              backgroundColor: isDark ? '#141926' : '#F4F7FC',
              gap: 14,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#0C1829',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Receipt size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 16, fontWeight: '800' }}>
                Record Expense
              </Text>
              <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>
                Parts, tools, utilities or salaries
              </Text>
            </View>
          </TouchableOpacity>

          {/* Add Vehicle */}
          <TouchableOpacity
            onPress={() => {
              setAddSheetOpen(false);
              router.push('/vehicles/add');
            }}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderRadius: 22,
              backgroundColor: isDark ? '#141926' : '#F4F7FC',
              gap: 14,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#0C1829',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Car size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 16, fontWeight: '800' }}>
                Register Vehicle
              </Text>
              <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>
                Add vehicle to existing or new customer
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </GlassBottomSheet>
    </>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <MidnightNavyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Wallet' }} />
      <Tabs.Screen name="entries" options={{ title: 'Tracking' }} />
      <Tabs.Screen name="add" options={{ title: 'Action' }} />
      <Tabs.Screen name="reports" options={{ title: 'Analytics' }} />
      <Tabs.Screen name="more" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
