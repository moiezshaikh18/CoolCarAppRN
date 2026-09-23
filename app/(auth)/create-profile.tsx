// ============================================================
// Create Profile Screen — New user onboarding
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { User, Mail, ArrowLeft, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { GlassCard } from '../../src/components/common/GlassCard';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { MOCK_ENTERPRISE } from '../../src/features/enterprise/mockEnterprise';

export default function CreateProfileScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { isLoading, setLoading, setError, error, user, setUser, setAuthState } = useAuthStore();
  const { setActiveEnterprise, setActiveMember } = useEnterpriseStore();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

  const handleCreateProfile = async () => {
    if (!displayName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mockProfile = {
        uid: 'dev-user-001',
        phone: user?.phone ?? '+919999999999',
        displayName: displayName.trim(),
        email: email.trim() || undefined,
        enterpriseIds: [MOCK_ENTERPRISE.id],
        activeEnterpriseId: MOCK_ENTERPRISE.id,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(mockProfile);
      setActiveEnterprise(MOCK_ENTERPRISE);
      setActiveMember({
        userId: 'dev-user-001',
        enterpriseId: MOCK_ENTERPRISE.id,
        role: 'OWNER',
        displayName: displayName.trim(),
        phone: mockProfile.phone,
        isActive: true,
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setAuthState('authenticated');
      router.replace('/(tabs)');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Symmetrical Top Header */}
      <View
        style={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 22,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? '#1C212B' : '#EFECE6',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 22, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginBottom: 28 }}>
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Owner Onboarding
            </Text>
            <Text style={{ color: theme.text, fontSize: 32, fontWeight: '900', marginTop: 2, letterSpacing: -0.5 }}>
              Create Profile
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 15, marginTop: 4 }}>
              Setup your name and garage owner credentials
            </Text>
          </View>

          <GlassCard variant="sand" padding={22} style={{ borderRadius: 28, gap: 18 }}>
            {/* Full Name */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                YOUR FULL NAME *
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  height: 54,
                  gap: 12,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <User size={18} color={theme.textMuted} />
                <TextInput
                  placeholder="e.g. Rahul Sharma"
                  placeholderTextColor={theme.textMuted}
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                EMAIL (OPTIONAL)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  height: 54,
                  gap: 12,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <Mail size={18} color={theme.textMuted} />
                <TextInput
                  placeholder="e.g. rahul@example.com"
                  placeholderTextColor={theme.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>

            {error && (
              <Text style={{ color: isDark ? '#F87171' : '#DC2626', fontSize: 13, textAlign: 'center', fontWeight: '600' }}>
                {error}
              </Text>
            )}

            {/* Solid Obsidian Black Pill CTA Button */}
            <TouchableOpacity
              onPress={handleCreateProfile}
              disabled={isLoading}
              activeOpacity={0.88}
              style={{
                marginTop: 6,
                backgroundColor: isDark ? '#FFFFFF' : '#121214',
                paddingVertical: 18,
                borderRadius: 34,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 6,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color={isDark ? '#121214' : '#FFFFFF'} />
              ) : (
                <>
                  <Check size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
                  <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                    Complete Setup
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
