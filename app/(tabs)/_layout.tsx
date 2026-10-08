// ============================================================
// Tabs Layout — Clean White Bottom Navigation Bar with Center Floating Circle Button
// Directly matching Screen 5 & Screen 6 in reference design
// ============================================================

import React, { useState, useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import {
  Home,
  FileText,
  BarChart3,
  Menu,
  Plus,
  Car,
  Receipt,
  AlertCircle,
  Wallet,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { GlassBottomSheet } from '../../src/components/common/GlassBottomSheet';
import { useTabBarStore } from '../../src/store/tabBarStore';

function ReferenceBottomTabBar({ state, navigation }: any) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const isTabBarVisible = useTabBarStore((s) => s.isVisible);
  const [translateY] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isTabBarVisible ? 0 : 120,
      useNativeDriver: true,
      bounciness: 0,
      speed: 16,
    }).start();
  }, [isTabBarVisible]);

  const tabConfig = [
    { name: 'index', label: 'Home', icon: Home },
    { name: 'entries', label: 'Entries', icon: FileText },
    { name: 'add', label: '', icon: Plus, isAction: true },
    { name: 'reports', label: 'Reports', icon: BarChart3 },
    { name: 'more', label: 'More', icon: Menu },
  ];

  const barBg = isDark ? '#0C1829' : '#FFFFFF';
  const barBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';
  const activeColor = isDark ? '#FFFFFF' : '#0C1829';
  const inactiveColor = '#94A3B8';
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <>
      {/* Clean Full-Width Bottom Navigation Bar */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60 + bottomPadding,
          paddingBottom: bottomPadding,
          backgroundColor: barBg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          borderTopWidth: 1,
          borderTopColor: barBorder,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 10,
          elevation: 12,
          transform: [{ translateY }],
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const config = tabConfig[index] || { label: route.name, icon: Home };
          const isFocused = state.index === index;
          const isAction = config.isAction;

          if (isAction) {
            return (
              <View key={route.key} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={() => setAddSheetOpen(true)}
                  activeOpacity={0.85}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: isDark ? '#2563EB' : '#0C1829',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: -16,
                    borderWidth: 3,
                    borderColor: barBg,
                    shadowColor: '#0C1829',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.35,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Plus size={24} color="#FFFFFF" strokeWidth={2.8} />
                </TouchableOpacity>
              </View>
            );
          }

          const Icon = config.icon;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              activeOpacity={0.7}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 4,
              }}
            >
              <Icon
                size={21}
                color={isFocused ? activeColor : inactiveColor}
                strokeWidth={isFocused ? 2.4 : 1.8}
              />
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
      </Animated.View>

      {/* Quick Operations Bottom Sheet */}
      <GlassBottomSheet
        visible={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        title="Quick Operations"
        snapHeight="half"
      >
        <View style={{ gap: 12, paddingBottom: 16 }}>
          {/* 1. New Job Sheet */}
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
              borderRadius: 20,
              backgroundColor: isDark ? '#141926' : '#F8FAFC',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
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
                Create Daily Job Sheet
              </Text>
              <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>
                ❄️ AC Work or 🔧 Mechanical Work entry
              </Text>
            </View>
          </TouchableOpacity>

          {/* 2. Record Expense */}
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
              borderRadius: 20,
              backgroundColor: isDark ? '#141926' : '#F8FAFC',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
              gap: 14,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#EF4444',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Receipt size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 16, fontWeight: '800' }}>
                Daily Expense Entry
              </Text>
              <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>
                Reason, Spent By & Bank Ledger
              </Text>
            </View>
          </TouchableOpacity>

          {/* 3. Inward Purchase Chalan */}
          <TouchableOpacity
            onPress={() => {
              setAddSheetOpen(false);
              router.push('/inventory/chalan-add');
            }}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderRadius: 20,
              backgroundColor: isDark ? '#141926' : '#F8FAFC',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
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
                Inward Purchase Chalan
              </Text>
              <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>
                Spare parts for multiple cars in 1 chalan
              </Text>
            </View>
          </TouchableOpacity>

          {/* 4. Pay Staff Salary / Advance */}
          <TouchableOpacity
            onPress={() => {
              setAddSheetOpen(false);
              router.push('/staff/pay' as any);
            }}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderRadius: 20,
              backgroundColor: isDark ? '#141926' : '#F8FAFC',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
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
              <Wallet size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 16, fontWeight: '800' }}>
                Pay Staff Salary / Advance
              </Text>
              <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>
                Record salary payment with bank/cash deduction
              </Text>
            </View>
          </TouchableOpacity>

          {/* 5. Pending Customer Balances (Udhari) */}
          <TouchableOpacity
            onPress={() => {
              setAddSheetOpen(false);
              router.push('/payments/pending');
            }}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderRadius: 20,
              backgroundColor: isDark ? '#141926' : '#F8FAFC',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
              gap: 14,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#EF4444',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertCircle size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 16, fontWeight: '800' }}>
                Pending Customer Balances
              </Text>
              <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>
                Track udhari, unpaid work orders & collect due cash
              </Text>
            </View>
          </TouchableOpacity>

          {/* 6. Add Bank Account */}
          <TouchableOpacity
            onPress={() => {
              setAddSheetOpen(false);
              router.push('/bank-accounts/add');
            }}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderRadius: 20,
              backgroundColor: isDark ? '#141926' : '#F8FAFC',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
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
              <Plus size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 16, fontWeight: '800' }}>
                Add Bank Account
              </Text>
              <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>
                Link unlimited current, savings or UPI accounts
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
      tabBar={(props) => <ReferenceBottomTabBar {...props} />}
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
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="entries" options={{ title: 'Entries' }} />
      <Tabs.Screen name="add" options={{ title: '' }} />
      <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
    </Tabs>
  );
}
