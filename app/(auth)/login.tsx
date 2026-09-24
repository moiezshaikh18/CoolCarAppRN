// ============================================================
// Login Screen — Authentication Portal
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff, Phone, Lock, Mail } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
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

  const skyBg = isDark ? '#000000' : '#153580';
  const sheetBg = isDark ? '#0A0D14' : '#F4F6F9';
  const cardBg = isDark ? '#141824' : '#FFFFFF';
  const inputBg = isDark ? '#1C2538' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(43,53,68,0.08)';

  return (
    <View style={{ flex: 1, backgroundColor: skyBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Royal Blue Top Header */}
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 24,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 }}>
          Welcome Back
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4, fontWeight: '600' }}>
          Sign in to manage your workshop operations
        </Text>
      </View>


      {/* Signature Mega-Curved Lower Content Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
        >
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: borderColor,
              gap: 16,
              marginBottom: 20,
            }}
          >
            {/* Email or Phone Input */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                EMAIL OR PHONE NUMBER
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: inputBg,
                  borderRadius: 18,
                  paddingHorizontal: 16,
                  height: 52,
                  gap: 12,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
              >
                <Mail size={18} color={theme.textMuted} />
                <TextInput
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder="Enter email or 10-digit mobile"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="none"
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>

            {/* Password Input */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                PASSWORD
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: inputBg,
                  borderRadius: 18,
                  paddingHorizontal: 16,
                  height: 52,
                  gap: 12,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
              >
                <Lock size={18} color={theme.textMuted} />
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

            {/* Royal Blue Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.88}
              style={{
                backgroundColor: isDark ? '#FFFFFF' : '#153580',
                paddingVertical: 18,
                borderRadius: 34,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 6,
                shadowColor: '#153580',
                shadowOpacity: 0.35,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 6,
              }}
            >
              <Text style={{ color: isDark ? '#0C1829' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                Sign In
              </Text>
            </TouchableOpacity>

          </View>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: borderColor }} />
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700' }}>OR CONTINUE WITH</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: borderColor }} />
          </View>

          {/* OTP Quick Login */}
          <TouchableOpacity
            onPress={handlePhoneOTPFlow}
            activeOpacity={0.88}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor: borderColor,
              borderRadius: 30,
              paddingVertical: 16,
              marginBottom: 24,
            }}
          >
            <Phone size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
              Sign in with OTP
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: '500' }}>
              {"Don't have a garage account?"}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={{ color: isDark ? '#60A5FA' : '#1D4ED8', fontSize: 14, fontWeight: '800' }}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
