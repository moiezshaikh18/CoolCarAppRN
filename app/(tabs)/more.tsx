// ============================================================
// More Tab — Settings, Garage Modules & Preferences
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User, Building2, Bell, Database, Download,
  Shield, Info, LogOut, ChevronRight, Palette, Sun, Moon,
  Users, Car, FileSpreadsheet, Package, Wallet, Receipt, Calendar,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { GlassCard } from '../../src/components/common/GlassCard';
import { router } from 'expo-router';
import { getInitials, formatRoleLabel } from '../../src/utils/formatters';

const MENU_SECTIONS = [
  {
    title: 'Operations Hub',
    items: [
      { label: 'Job Sheets (Work Orders)', icon: FileSpreadsheet, route: '/job-sheets' },
      { label: 'Customers Directory', icon: Users, route: '/customers' },
      { label: 'Vehicles Fleet', icon: Car, route: '/vehicles' },
      { label: 'Spare Parts & Inventory', icon: Package, route: '/inventory' },
      { label: 'Bank Accounts & Cash Counter', icon: Wallet, route: '/bank-accounts' },
      { label: 'Customer Payments & Receipts', icon: Receipt, route: '/payments' },
      { label: 'Service Due Reminders', icon: Calendar, route: '/reminders' },
      { label: 'Expense Categories', icon: Building2, route: '/expenses/categories' },
    ],
  },
  {
    title: 'Enterprise & Security',
    items: [
      { label: 'Team Members & Roles (RBAC)', icon: Shield, route: '/settings/users' },
      { label: 'Garage Profile & Branding', icon: Palette, route: '/settings/branding' },
      { label: 'Business Address & GST', icon: Building2, route: '/settings/business' },
    ],
  },
  {
    title: 'System & Data',
    items: [
      { label: 'Notification Alerts', icon: Bell, route: '/settings/notifications' },
      { label: 'Export Reports (PDF / Excel)', icon: Download, route: '/settings/export' },
      { label: 'Cloud Backup & Sync', icon: Database, route: '/settings/backup' },
      { label: 'About Garage Expense Tracker', icon: Info, route: '/settings/about' },
    ],
  },
];

export default function MoreScreen() {
  const { theme, isDark, toggleMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, reset: resetAuth, setAuthState } = useAuthStore();
  const { activeMember, reset: resetEnterprise } = useEnterpriseStore();

  const handleLogout = () => {
    resetAuth();
    resetEnterprise();
    setAuthState('unauthenticated');
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top + 14, paddingHorizontal: 22, paddingBottom: 16 }}>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            System Settings
          </Text>
          <Text style={{ color: theme.text, fontSize: 26, fontWeight: '800', marginTop: 2, letterSpacing: -0.5 }}>
            Garage Control
          </Text>

          {/* Luxury Profile Card */}
          <GlassCard
            variant="sand"
            style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 16, borderRadius: 28 }}
            padding={18}
            onPress={() => router.push('/settings/profile' as any)}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: isDark ? '#FFFFFF' : '#121214',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
                {getInitials(user?.displayName ?? 'Garage Owner')}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 17, fontWeight: '800' }}>
                {user?.displayName ?? 'Garage Owner'}
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>
                {user?.phone ?? user?.email ?? '+91 98201 12345'}
              </Text>
              <View
                style={{
                  alignSelf: 'flex-start',
                  marginTop: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 12,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                }}
              >
                <Text style={{ color: theme.text, fontSize: 11, fontWeight: '700' }}>
                  {formatRoleLabel(activeMember?.role ?? 'OWNER')}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.textMuted} />
          </GlassCard>
        </View>

        {/* Theme Appearance Mode Switcher Card */}
        <View style={{ paddingHorizontal: 22, marginBottom: 20 }}>
          <GlassCard
            variant="sand"
            padding={18}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 24 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isDark ? <Moon size={20} color="#FBBF24" /> : <Sun size={20} color="#121214" />}
              </View>
              <View>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                  {isDark ? 'Obsidian luxury dark scheme' : 'Warm sand minimalist theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleMode}
              trackColor={{ false: '#D1D5DB', true: '#121214' }}
              thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
            />
          </GlassCard>
        </View>

        {/* Menu sections */}
        <View style={{ paddingHorizontal: 22, gap: 24 }}>
          {MENU_SECTIONS.map((section) => (
            <View key={section.title}>
              <Text
                style={{
                  color: theme.textMuted,
                  fontSize: 12,
                  fontWeight: '700',
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  paddingLeft: 4,
                }}
              >
                {section.title}
              </Text>
              <GlassCard variant="sand" padding={0} style={{ borderRadius: 28, overflow: 'hidden' }}>
                {section.items.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.label}
                      onPress={() => router.push(item.route as any)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 14,
                        padding: 16,
                        borderBottomWidth: idx < section.items.length - 1 ? 1 : 0,
                        borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={18} color={theme.text} />
                      </View>
                      <Text style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}>
                        {item.label}
                      </Text>
                      <ChevronRight size={18} color={theme.textMuted} />
                    </TouchableOpacity>
                  );
                })}
              </GlassCard>
            </View>
          ))}

          {/* Logout */}
          <GlassCard
            onPress={handleLogout}
            variant="sand"
            style={{ flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 24, marginTop: 4 }}
            padding={16}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isDark ? '#7F1D1D' : '#FEE2E2',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LogOut size={18} color="#EF4444" />
            </View>
            <Text style={{ flex: 1, color: '#EF4444', fontSize: 15, fontWeight: '700' }}>
              Sign Out from Garage
            </Text>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}
