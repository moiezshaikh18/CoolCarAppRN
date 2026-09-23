// ============================================================
// Sign Up Screen — New Garage Registration
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff, Phone } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { GlassCard } from '../../src/components/common/GlassCard';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { MOCK_ENTERPRISE } from '../../src/features/enterprise/mockEnterprise';

export default function SignUpScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { setUser, setAuthState } = useAuthStore();
  const { setActiveEnterprise, setActiveMember } = useEnterpriseStore();

  const [fullName, setFullName] = useState('Manish Kumar');
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    if (!fullName.trim() || !identifier.trim()) {
      Alert.alert('Required', 'Please fill in all required fields.');
      return;
    }

    const mockUser = {
      uid: 'user-new-' + Date.now(),
      phone: identifier.replace(/\D/g, '').length === 10 ? identifier : '9876543210',
      displayName: fullName,
      email: identifier.includes('@') ? identifier : undefined,
      enterpriseIds: [MOCK_ENTERPRISE.id],
      activeEnterpriseId: MOCK_ENTERPRISE.id,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setActiveEnterprise(MOCK_ENTERPRISE);
    setActiveMember({
      userId: mockUser.uid,
      enterpriseId: MOCK_ENTERPRISE.id,
      role: 'OWNER',
      displayName: fullName,
      phone: mockUser.phone,
      isActive: true,
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setAuthState('authenticated');
    router.replace('/(tabs)');
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 60 }}
      >
        {/* Title Section */}
        <View style={{ marginTop: 12, marginBottom: 28 }}>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            New Workshop Setup
          </Text>
          <Text style={{ color: theme.text, fontSize: 32, fontWeight: '900', marginTop: 2, letterSpacing: -0.5 }}>
            Create Account
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 15, marginTop: 4 }}>
            Register your garage enterprise in seconds
          </Text>
        </View>

        {/* Form Fields Card in Warm Sand */}
        <GlassCard variant="sand" padding={22} style={{ borderRadius: 28, gap: 18 }}>
          {/* Full Name */}
          <View>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
              FULL NAME
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Manish Kumar"
              placeholderTextColor={theme.textMuted}
              style={{
                backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                borderRadius: 20,
                paddingHorizontal: 16,
                height: 54,
                color: theme.text,
                fontSize: 15,
                fontWeight: '600',
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
            />
          </View>

          {/* Email / Phone */}
          <View>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
              EMAIL OR PHONE NUMBER
            </Text>
            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="e.g. 98765 43210"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="none"
              style={{
                backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                borderRadius: 20,
                paddingHorizontal: 16,
                height: 54,
                color: theme.text,
                fontSize: 15,
                fontWeight: '600',
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
            />
          </View>

          {/* Password */}
          <View>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
              PASSWORD
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                borderRadius: 20,
                paddingHorizontal: 16,
                height: 54,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create strong password"
                placeholderTextColor={theme.textMuted}
                secureTextEntry={!showPassword}
                style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={18} color={theme.textMuted} />
                ) : (
                  <Eye size={18} color={theme.textMuted} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Solid Obsidian Black Pill Submit Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            activeOpacity={0.88}
            style={{
              marginTop: 6,
              backgroundColor: isDark ? '#FFFFFF' : '#121214',
              paddingVertical: 18,
              borderRadius: 34,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
            }}
          >
            <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Create Account
            </Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />
          <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            or continue with
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />
        </View>

        {/* Social / Phone Buttons */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={handleSignUp}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 16,
              borderRadius: 24,
              backgroundColor: isDark ? '#1C212B' : '#EFECE6',
            }}
          >
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '900' }}>G</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 16,
              borderRadius: 24,
              backgroundColor: isDark ? '#1C212B' : '#EFECE6',
            }}
          >
            <Phone size={18} color={theme.text} />
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>Phone</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
          <Text style={{ color: theme.textMuted, fontSize: 14 }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
