// ============================================================
// Screen 4: Create Account — Sign Up Screen
// Directly matching Screen 4 in Reference Design Mockup
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
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff, Phone, Chrome } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { MOCK_ENTERPRISE } from '../../src/features/enterprise/mockEnterprise';

export default function SignupScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { setUser, setAuthState } = useAuthStore();
  const { setActiveEnterprise, setActiveMember } = useEnterpriseStore();

  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!fullName.trim() || !identifier.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please fill in all details to create your account.');
      return;
    }

    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem('cool_car_saved_owner_name', fullName.trim());
      await AsyncStorage.setItem('cool_car_saved_owner_email', identifier.trim());
    } catch {}

    const { auth } = await import('../../src/services/firebase/firebase.config');
    const currentUid = auth.currentUser?.uid || 'user-new-' + Date.now();

    const newUser = {
      uid: currentUid,
      phone: identifier.includes('@') ? '9876543210' : identifier.trim(),
      displayName: fullName.trim(),
      email: identifier.includes('@') ? identifier.trim() : 'owner@garage.com',
      enterpriseIds: [MOCK_ENTERPRISE.id],
      activeEnterpriseId: MOCK_ENTERPRISE.id,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUser(newUser);
    setActiveEnterprise(MOCK_ENTERPRISE);
    setActiveMember({
      userId: currentUid,
      enterpriseId: MOCK_ENTERPRISE.id,
      role: 'OWNER',
      displayName: fullName.trim(),
      phone: newUser.phone,
      isActive: true,
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setAuthState('authenticated');
    router.replace('/(tabs)');
  };

  const bg = isDark ? '#0C1829' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';
  const inputBg = isDark ? '#111E33' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: bg }}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 24,
          justifyContent: 'space-between',
        }}
      >
        <View>
          {/* Top Back Navigation Arrow */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{ width: 40, height: 40, justifyContent: 'center', marginBottom: 20 }}
          >
            <ArrowLeft size={22} color={textPrimary} strokeWidth={2.4} />
          </TouchableOpacity>

          {/* Official Brand Logo */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Image
              source={isDark ? require('../../assets/cool_car_logo_white.png') : require('../../assets/cool_car_logo.png')}
              style={{ width: 170, height: 56 }}
              resizeMode="contain"
            />
          </View>

          {/* Header Typography matching Screen 4 */}
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <Text style={{ fontSize: 26, fontWeight: '800', color: textPrimary, letterSpacing: -0.5 }}>
              Create Account
            </Text>
            <Text style={{ fontSize: 14, color: textMuted, fontWeight: '500', marginTop: 6 }}>
              Sign up to get started
            </Text>
          </View>

          {/* Input Form Fields */}
          <View style={{ gap: 16 }}>
            {/* Full Name */}
            <View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary, marginBottom: 8 }}>
                Full Name
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor="#94A3B8"
                style={{
                  height: 52,
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: borderColor,
                  paddingHorizontal: 16,
                  fontSize: 15,
                  fontWeight: '600',
                  color: textPrimary,
                }}
              />
            </View>

            {/* Email / Phone */}
            <View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary, marginBottom: 8 }}>
                Email / Phone
              </Text>
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Enter email or phone"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                style={{
                  height: 52,
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: borderColor,
                  paddingHorizontal: 16,
                  fontSize: 15,
                  fontWeight: '600',
                  color: textPrimary,
                }}
              />
            </View>

            {/* Password */}
            <View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary, marginBottom: 8 }}>
                Password
              </Text>
              <View
                style={{
                  height: 52,
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: borderColor,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  style={{ flex: 1, fontSize: 15, fontWeight: '600', color: textPrimary }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Primary Button */}
            <TouchableOpacity
              onPress={handleSignup}
              activeOpacity={0.88}
              style={{
                height: 52,
                backgroundColor: '#0C1829',
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                shadowColor: '#0C1829',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                Sign Up
              </Text>
            </TouchableOpacity>

            {/* Divider: or continue with */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: borderColor }} />
              <Text style={{ paddingHorizontal: 12, fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>
                or continue with
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: borderColor }} />
            </View>

            {/* Social / Alternate Buttons */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={handleSignup}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  height: 50,
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: borderColor,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Chrome size={18} color="#EA4335" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: textPrimary }}>
                  Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push({ pathname: '/(auth)/otp', params: { phone: identifier || '+91 98765 43210' } })}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  height: 50,
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: borderColor,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Phone size={18} color="#0C1829" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: textPrimary }}>
                  Phone
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer: Already have an account? Login */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 13, color: textMuted, fontWeight: '500' }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={{ fontSize: 13, color: '#0C1829', fontWeight: '800' }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
