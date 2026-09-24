// ============================================================
// More Tab — Sky Blue & Midnight Navy Luxury Settings Layout
// Directly matching media_1790189780212.png & media_1790189816628.png
// ============================================================

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  Building2,
  Bell,
  Database,
  Download,
  Shield,
  Info,
  LogOut,
  ChevronRight,
  Palette,
  Sun,
  Moon,
  Users,
  Car,
  FileSpreadsheet,
  Package,
  Wallet,
  Receipt,
  Calendar,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useHideOnScroll } from '../../src/store/tabBarStore';

import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { GlassCard } from '../../src/components/common/GlassCard';
import { router } from 'expo-router';
import { getInitials, formatRoleLabel } from '../../src/utils/formatters';

const MENU_SECTIONS = [
  {
    title: 'Core Workshop Modules',
    items: [
      { label: 'Staff & Salary Tracker', icon: Users, route: '/staff' },
      { label: 'Daily Job Sheets (AC & Mech)', icon: FileSpreadsheet, route: '/job-sheets' },
      { label: 'Daily Expenses Ledger', icon: Receipt, route: '/entries' },
      { label: 'Spare Part Purchase Chalans', icon: Package, route: '/inventory' },
      { label: 'Bank Accounts & Cash Counter', icon: Wallet, route: '/bank-accounts' },
    ],
  },
  {
    title: 'Garage Records & Tools',
    items: [
      { label: 'Customers Directory', icon: Users, route: '/customers' },
      { label: 'Vehicles Fleet', icon: Car, route: '/vehicles' },
      { label: 'Expense Categories', icon: Building2, route: '/expenses/categories' },
    ],
  },
  {
    title: 'System & Backup',
    items: [
      { label: 'Export Reports (PDF / Excel)', icon: Download, route: '/settings/export' },
      { label: 'Cloud Backup & Sync', icon: Database, route: '/settings/backup' },
      { label: 'About Cool Car Workshop', icon: Info, route: '/settings/about' },
    ],
  },
];

export default function MoreScreen() {
  const { theme, isDark, toggleMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { onScroll: onHideNavScroll } = useHideOnScroll();
  const { user, reset: resetAuth, setAuthState } = useAuthStore();
  const { activeMember, reset: resetEnterprise } = useEnterpriseStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of your garage account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          resetAuth();
          resetEnterprise();
          setAuthState('unauthenticated');
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const canvasBg = isDark ? '#000000' : '#153580';
  const sheetBg = isDark ? '#0A0D14' : '#F4F6F9';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(43, 53, 68, 0.08)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onHideNavScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        {/* Royal Blue Top Header */}
        <View style={{ backgroundColor: canvasBg, paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <View>
              <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>
                Garage Control
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 13, fontWeight: '600', marginTop: 2 }}>
                Settings & Workshop Modules
              </Text>
            </View>


            {/* Dark/Light Mode Toggle */}
            <TouchableOpacity
              onPress={toggleMode}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isDark ? <Sun size={20} color="#FBBF24" /> : <Moon size={20} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>

          {/* User Profile Card (Featured Midnight Navy Style) */}
          <TouchableOpacity
            onPress={() => router.push('/settings/profile' as any)}
            activeOpacity={0.88}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#101927' : '#0C1829',
              borderRadius: 28,
              padding: 16,
              gap: 14,
              shadowColor: '#0C1829',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 14,
              elevation: 4,
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900' }}>
                {getInitials(user?.displayName ?? 'Garage Owner')}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                {user?.displayName ?? 'Manish Kumar'}
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 12, marginTop: 2 }}>
                {user?.phone ?? '+91 98765 43210'} • {formatRoleLabel(activeMember?.role ?? 'OWNER')}
              </Text>
            </View>

            <ChevronRight size={18} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
        </View>

        {/* Crisp White Lower Sheet */}
        <View
          style={{
            backgroundColor: sheetBg,
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            paddingTop: 24,
            paddingHorizontal: 20,
            paddingBottom: 24,
            minHeight: 600,
            shadowColor: '#0C1829',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDark ? 0.4 : 0.06,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {MENU_SECTIONS.map((section, sIdx) => (
            <View key={section.title} style={{ marginBottom: 24 }}>
              <Text
                style={{
                  color: '#64748B',
                  fontSize: 12,
                  fontWeight: '800',
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  marginBottom: 12,
                  marginLeft: 4,
                }}
              >
                {section.title}
              </Text>

              <View
                style={{
                  backgroundColor: isDark ? '#141926' : '#F8FAFD',
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  overflow: 'hidden',
                }}
              >
                {section.items.map((item, idx) => {
                  const Icon = item.icon;
                  const isLast = idx === section.items.length - 1;

                  return (
                    <TouchableOpacity
                      key={item.label}
                      onPress={() => router.push(item.route as any)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderBottomWidth: isLast ? 0 : 1,
                        borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(12, 24, 41, 0.04)',
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
                        <View
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 19,
                            backgroundColor: isDark ? '#1C2538' : '#0C1829',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={17} color="#FFFFFF" />
                        </View>
                        <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 14, fontWeight: '700', flex: 1 }}>
                          {item.label}
                        </Text>
                      </View>
                      <ChevronRight size={16} color="#94A3B8" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Sign Out Button */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
              paddingVertical: 16,
              borderRadius: 28,
              gap: 8,
              marginTop: 8,
            }}
          >
            <LogOut size={18} color="#EF4444" />
            <Text style={{ color: '#EF4444', fontSize: 15, fontWeight: '800' }}>
              Sign Out of Garage
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
