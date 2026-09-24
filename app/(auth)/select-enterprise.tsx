// ============================================================
// Select Enterprise Screen — Multi-garage switcher
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Building2, ChevronRight, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { MOCK_ENTERPRISE, MOCK_ENTERPRISE_ABC } from '../../src/features/enterprise/mockEnterprise';
import { Enterprise } from '../../src/types/enterprise.types';

const MOCK_ENTERPRISES = [MOCK_ENTERPRISE, MOCK_ENTERPRISE_ABC];

export default function SelectEnterpriseScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { activeEnterprise, setActiveEnterprise, setActiveMember } = useEnterpriseStore();

  const handleSelect = (enterprise: Enterprise) => {
    setActiveEnterprise(enterprise);
    setActiveMember({
      userId: user?.uid ?? 'dev-user-001',
      enterpriseId: enterprise.id,
      role: 'OWNER',
      displayName: user?.displayName ?? 'User',
      phone: user?.phone ?? '',
      isActive: true,
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    router.replace('/(tabs)');
  };

  const skyBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          backgroundColor: skyBg,
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 28,
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Multi-Tenant Switcher
        </Text>
        <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginTop: 4, letterSpacing: -0.5 }}>
          Select Garage
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4, fontWeight: '500' }}>
          Choose active workshop workspace to continue
        </Text>
      </View>

      {/* Signature Lower Content Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          marginTop: -16,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
          paddingHorizontal: 20,
          paddingTop: 24,
        }}
      >
        <FlatList
          data={MOCK_ENTERPRISES}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 14 }}
          renderItem={({ item }) => {
            const isActive = activeEnterprise?.id === item.id;
            return (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                activeOpacity={0.88}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 24,
                  padding: 18,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  borderWidth: isActive ? 2 : 1,
                  borderColor: isActive ? '#0C1829' : borderColor,
                  shadowColor: '#000',
                  shadowOpacity: isDark ? 0.3 : 0.04,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 2,
                }}
              >
                {/* Logo / Icon */}
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: isDark ? '#141926' : '#EFF6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Building2 size={24} color={isDark ? '#FFFFFF' : '#3B82F6'} />
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>
                    {item.address ?? item.phone}
                  </Text>
                </View>

                {/* Status indicator */}
                {isActive ? (
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: '#0C1829',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                ) : (
                  <ChevronRight size={20} color={theme.textMuted} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}
