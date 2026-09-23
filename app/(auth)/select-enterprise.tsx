// ============================================================
// Select Enterprise Screen — Multi-garage switcher
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Building2, ChevronRight, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { GlassCard } from '../../src/components/common/GlassCard';
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: insets.top + 20 }}>
        <View style={{ marginBottom: 28 }}>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Multi-Tenant Switcher
          </Text>
          <Text style={{ color: theme.text, fontSize: 32, fontWeight: '900', marginTop: 2, letterSpacing: -0.5 }}>
            Select Garage
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 15, marginTop: 4 }}>
            Choose active workshop workspace to continue
          </Text>
        </View>

        <FlatList
          data={MOCK_ENTERPRISES}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 14 }}
          renderItem={({ item }) => {
            const isActive = activeEnterprise?.id === item.id;
            return (
              <GlassCard
                onPress={() => handleSelect(item)}
                variant="sand"
                style={{
                  borderRadius: 28,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  borderWidth: isActive ? 2 : 1,
                  borderColor: isActive ? (isDark ? '#FFFFFF' : '#121214') : 'transparent',
                }}
                padding={18}
              >
                {/* Logo / Icon */}
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  }}
                >
                  <Building2 size={24} color={theme.text} />
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>
                    {item.address ?? item.phone}
                  </Text>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 8,
                      backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    }}
                  >
                    <Text style={{ color: theme.text, fontSize: 11, fontWeight: '700' }}>
                      OWNER
                    </Text>
                  </View>
                </View>

                {isActive ? (
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: isDark ? '#FFFFFF' : '#121214',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={18} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
                  </View>
                ) : (
                  <ChevronRight size={20} color={theme.textMuted} />
                )}
              </GlassCard>
            );
          }}
        />
      </View>
    </View>
  );
}
