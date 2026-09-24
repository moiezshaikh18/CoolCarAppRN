// ============================================================
// Sign Up Screen — New Garage Registration
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
import { ArrowLeft, Eye, EyeOff, User, Phone, Lock } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
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

  const skyBg = isDark ? '#000000' : '#153580';
  const sheetBg = isDark ? '#0A0D14' : '#F4F6F9';
  const cardBg = isDark ? '#141824' : '#FFFFFF';
  const inputBg = isDark ? '#1C2538' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(43,53,68,0.08)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Royal Blue Top Header */}
      <View
        style={{
          backgroundColor: skyBg,
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 28,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.22)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 }}>
          Create Account
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4, fontWeight: '500' }}>
          Register your garage & join the platform
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
              marginBottom: 24,
            }}
          >
            {/* Full Name */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                YOUR FULL NAME
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
                <User size={18} color={theme.textMuted} />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="e.g. Manish Kumar"
                  placeholderTextColor={theme.textMuted}
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                MOBILE NUMBER
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
                <Phone size={18} color={theme.textMuted} />
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>+91</Text>
                <TextInput
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder="98765 43210"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                SET PASSWORD
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
                  placeholder="Create secure password"
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

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSignUp}
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
                Register Workshop
              </Text>
            </TouchableOpacity>

          </View>

          {/* Login Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: '500' }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={{ color: isDark ? '#60A5FA' : '#1D4ED8', fontSize: 14, fontWeight: '800' }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
