// ============================================================
// Screen 21: Settings — Modern Clean Settings Hub
// Directly matching Screen 21 in Reference Design Mockup
// ============================================================

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  Building2,
  Database,
  Download,
  Sliders,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Users,
  Car,
  FileSpreadsheet,
  Wallet,
  Receipt,
  Layers,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useHideOnScroll } from '../../src/store/tabBarStore';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { router } from 'expo-router';

export default function MoreScreen() {
  const { isDark, toggleMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { onScroll: onHideNavScroll } = useHideOnScroll();
  const { user, reset: resetAuth, setAuthState } = useAuthStore();
  const { reset: resetEnterprise } = useEnterpriseStore();

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

  const bg = isDark ? '#0C1829' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';
  const cardBg = isDark ? '#111E33' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9';
  const rowHover = isDark ? '#1A2942' : '#F8FAFC';

  // Primary settings matching Screen 21 mockup
  const SETTINGS_ITEMS = [
    {
      title: 'Profile',
      icon: User,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      route: '/settings/profile',
    },
    {
      title: 'Business Info',
      icon: Building2,
      iconColor: '#F59E0B',
      bgColor: '#FEF3C7',
      route: '/settings/business',
    },
    {
      title: 'Backup & Restore',
      icon: Database,
      iconColor: '#8B5CF6',
      bgColor: '#EDE9FE',
      route: '/settings/backup',
    },
    {
      title: 'Export Data',
      icon: Download,
      iconColor: '#10B981',
      bgColor: '#D1FAE5',
      route: '/settings/export',
    },
    {
      title: 'App Settings',
      icon: Sliders,
      iconColor: '#06B6D4',
      bgColor: '#CFFAFE',
      route: '/settings/app',
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      iconColor: '#EC4899',
      bgColor: '#FCE7F3',
      route: '/settings/help',
    },
    {
      title: 'About Us',
      icon: Info,
      iconColor: '#64748B',
      bgColor: '#F1F5F9',
      route: '/settings/about',
    },
  ];

  // Workshop management shortcuts
  const WORKSHOP_MODULES = [
    { title: 'Job Sheets Register', icon: FileSpreadsheet, iconColor: '#2563EB', bgColor: '#EFF6FF', route: '/job-sheets' },
    { title: 'Staff & Technicians', icon: Users, iconColor: '#059669', bgColor: '#ECFDF5', route: '/staff' },
    { title: 'Expenses & Ledgers', icon: Receipt, iconColor: '#DC2626', bgColor: '#FEF2F2', route: '/entries' },
    { title: 'Customers Directory', icon: User, iconColor: '#D97706', bgColor: '#FFFBEB', route: '/customers' },
    { title: 'Vehicles Fleet', icon: Car, iconColor: '#7C3AED', bgColor: '#F5F3FF', route: '/vehicles' },
    { title: 'Payment Modes', icon: Wallet, iconColor: '#0891B2', bgColor: '#ECFEFF', route: '/bank-accounts' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Top Header matching Screen 21 */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: '900', color: textPrimary, letterSpacing: -0.5 }}>
          Settings
        </Text>

        {/* Theme Mode Toggle Button */}
        <TouchableOpacity
          onPress={toggleMode}
          activeOpacity={0.8}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isDark ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#0C1829" />}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onHideNavScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 90,
          gap: 20,
        }}
      >
        {/* User Card */}
        <TouchableOpacity
          onPress={() => router.push('/settings/profile' as any)}
          activeOpacity={0.88}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: cardBg,
            borderRadius: 18,
            padding: 16,
            borderWidth: 1,
            borderColor: borderColor,
            gap: 14,
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#0C1829',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900' }}>
              {(user?.displayName || 'Super Auto Garage').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>
              {user?.displayName || 'Super Auto Garage'}
            </Text>
            <Text style={{ fontSize: 13, color: textMuted, marginTop: 2 }}>
              {user?.phone || user?.email || 'Workshop Admin'}
            </Text>
          </View>
          <ChevronRight size={18} color={textMuted} />
        </TouchableOpacity>

        {/* Core Settings List matching Screen 21 */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: borderColor,
            overflow: 'hidden',
          }}
        >
          {SETTINGS_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === SETTINGS_ITEMS.length - 1;
            return (
              <TouchableOpacity
                key={item.title}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderBottomWidth: isLast ? 0 : 1,
                  borderBottomColor: borderColor,
                }}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: item.bgColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  <Icon size={18} color={item.iconColor} strokeWidth={2.4} />
                </View>

                <Text style={{ flex: 1, fontSize: 15, fontWeight: '700', color: textPrimary }}>
                  {item.title}
                </Text>

                <ChevronRight size={18} color={textMuted} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Workshop Modules Section */}
        <View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '800',
              color: textMuted,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 10,
              marginLeft: 4,
            }}
          >
            Workshop Management
          </Text>

          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: borderColor,
              overflow: 'hidden',
            }}
          >
            {WORKSHOP_MODULES.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === WORKSHOP_MODULES.length - 1;
              return (
                <TouchableOpacity
                  key={item.title}
                  onPress={() => router.push(item.route as any)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: isLast ? 0 : 1,
                    borderBottomColor: borderColor,
                  }}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      backgroundColor: item.bgColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 14,
                    }}
                  >
                    <Icon size={18} color={item.iconColor} strokeWidth={2.4} />
                  </View>

                  <Text style={{ flex: 1, fontSize: 15, fontWeight: '700', color: textPrimary }}>
                    {item.title}
                  </Text>

                  <ChevronRight size={18} color={textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.88}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(239, 68, 68, 0.25)' : '#FEE2E2',
          }}
        >
          <LogOut size={18} color="#EF4444" strokeWidth={2.4} />
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#EF4444' }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
