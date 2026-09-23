// ============================================================
// Login Screen — Authentication Portal
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

export default function LoginScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { setUser, setAuthState } = useAuthStore();
  const { setActiveEnterprise, setActiveMember } = useEnterpriseStore();

  const [identifier, setIdentifier] = useState('demo@garage.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!identifier.trim()) {
      Alert.alert('Required', 'Please enter your email or phone.');
      return;
    }

    const mockUser = {
      uid: 'user-demo-1',
      phone: '9876543210',
      displayName: 'Manish Kumar',
      email: identifier.includes('@') ? identifier : 'manish@garage.com',
      enterpriseIds: [MOCK_ENTERPRISE.id],
      activeEnterpriseId: MOCK_ENTERPRISE.id,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setActiveEnterprise(MOCK_ENTERPRISE);
    setActiveMember({
      userId: 'user-demo-1',
      enterpriseId: MOCK_ENTERPRISE.id,
      role: 'OWNER',
      displayName: 'Manish Kumar',
      phone: '9876543210',
      isActive: true,
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setAuthState('authenticated');
    router.replace('/(tabs)');
  };

  const handlePhoneOTPFlow = () => {
    const trimmed = identifier.trim();
    const phoneToUse = trimmed && !trimmed.includes('@') ? trimmed : '+91 98765 43210';
    router.push({
      pathname: '/(auth)/otp',
      params: { phone: phoneToUse, verificationId: 'mock-verification-id' },
    });
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
            Account Access
          </Text>
          <Text style={{ color: theme.text, fontSize: 32, fontWeight: '900', marginTop: 2, letterSpacing: -0.5 }}>
            Welcome Back
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 15, marginTop: 4 }}>
            Sign in to manage your workshop operations
          </Text>
        </View>

        {/* Form Container in Warm Sand */}
        <GlassCard variant="sand" padding={22} style={{ borderRadius: 28, gap: 18 }}>
          {/* Email / Phone Field */}
          <View>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
              EMAIL OR PHONE NUMBER
            </Text>
            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="e.g. owner@garage.com"
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

          {/* Password Field */}
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
                placeholder="Enter your password"
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

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => Alert.alert('Forgot Password', 'Password reset instructions sent.')}
            style={{ alignSelf: 'flex-end' }}
          >
            <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '700' }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Solid Obsidian Black Pill Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.88}
            style={{
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
              Sign In
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

        {/* Phone OTP and Google Buttons */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={handlePhoneOTPFlow}
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
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>Phone OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
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
        </View>

        {/* Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
          <Text style={{ color: theme.textMuted, fontSize: 14 }}>Don&apos;t have a garage account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
