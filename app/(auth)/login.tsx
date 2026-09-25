// ============================================================
// Login Screen — Authentication Portal
// Clean Unified Layout, Vertically Centered Content
// Zero Cut-off Divs & Full Light/Dark Consistency
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
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, EyeOff, Phone, Lock, Mail } from 'lucide-react-native';
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

  const handleLogin = async () => {
    if (!identifier.trim()) {
      Alert.alert('Required', 'Please enter your email or phone.');
      return;
    }

    try {
      // 1. Establish real Firebase Auth session so Firestore permissions are granted
      const { signInAnonymouslyUser } = await import('../../src/services/firebase/auth.service');
      const fbUser = await signInAnonymouslyUser();
      const uid = fbUser.uid || 'user-owner-1';

      // 2. Check for previously saved owner name & email from AsyncStorage
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const savedName = await AsyncStorage.getItem('cool_car_saved_owner_name');
      const savedEmail = await AsyncStorage.getItem('cool_car_saved_owner_email');

      const ownerName = savedName || 'Workshop Owner';
      const ownerEmail = savedEmail || (identifier.includes('@') ? identifier : 'owner@coolcargarage.com');

      const loggedInUser = {
        uid,
        phone: '9876543210',
        displayName: ownerName,
        email: ownerEmail,
        enterpriseIds: [MOCK_ENTERPRISE.id],
        activeEnterpriseId: MOCK_ENTERPRISE.id,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(loggedInUser);
      setActiveEnterprise(MOCK_ENTERPRISE);
      setActiveMember({
        userId: uid,
        enterpriseId: MOCK_ENTERPRISE.id,
        role: 'OWNER',
        displayName: ownerName,
        phone: '9876543210',
        isActive: true,
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setAuthState('authenticated');
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('[Login] Auth error:', err);
      // Fallback in case of network issue
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const savedName = await AsyncStorage.getItem('cool_car_saved_owner_name');
      const ownerName = savedName || 'Workshop Owner';

      const fallbackUser = {
        uid: 'user-owner-1',
        phone: '9876543210',
        displayName: ownerName,
        email: identifier.includes('@') ? identifier : 'owner@coolcargarage.com',
        enterpriseIds: [MOCK_ENTERPRISE.id],
        activeEnterpriseId: MOCK_ENTERPRISE.id,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(fallbackUser);
      setActiveEnterprise(MOCK_ENTERPRISE);
      setActiveMember({
        userId: 'user-owner-1',
        enterpriseId: MOCK_ENTERPRISE.id,
        role: 'OWNER',
        displayName: ownerName,
        phone: '9876543210',
        isActive: true,
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setAuthState('authenticated');
      router.replace('/(tabs)');
    }
  };

  const handlePhoneOTPFlow = () => {
    const trimmed = identifier.trim();
    const phoneToUse = trimmed && !trimmed.includes('@') ? trimmed : '+91 98765 43210';
    router.push({
      pathname: '/(auth)/otp',
      params: { phone: phoneToUse, verificationId: 'mock-verification-id' },
    });
  };

  const pageBg = isDark ? '#181A20' : '#F4F6F9';
  const cardBg = isDark ? '#242834' : '#FFFFFF';
  const inputBg = isDark ? '#1E232F' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(43,53,68,0.08)';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: pageBg }}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={pageBg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 22,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
        }}
      >
        {/* Centered Brand Logo & Typography */}
        <View style={{ alignItems: 'center', marginBottom: 26 }}>
          <Image
            source={require('../../assets/cool_car_logo.png')}
            style={{ width: 190, height: 65, marginBottom: 12 }}
            resizeMode="contain"
          />
          <Text
            style={{
              color: isDark ? '#FFFFFF' : '#0F172A',
              fontSize: 26,
              fontWeight: '900',
              letterSpacing: -0.5,
              textAlign: 'center',
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              color: isDark ? '#94A3B8' : '#64748B',
              fontSize: 14,
              marginTop: 4,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Sign in to manage your workshop operations
          </Text>
        </View>

        {/* Centered Main Form Card */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 24,
            padding: 22,
            borderWidth: 1,
            borderColor: borderColor,
            gap: 16,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.25 : 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          {/* Email or Phone Input */}
          <View>
            <Text
              style={{
                color: isDark ? '#CBD5E1' : '#475569',
                fontSize: 11,
                fontWeight: '800',
                marginBottom: 8,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Email or Phone Number
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: inputBg,
                borderRadius: 16,
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
            <Text
              style={{
                color: isDark ? '#CBD5E1' : '#475569',
                fontSize: 11,
                fontWeight: '800',
                marginBottom: 8,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Password
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: inputBg,
                borderRadius: 16,
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

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.88}
            style={{
              backgroundColor: '#153580',
              paddingVertical: 16,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 4,
              shadowColor: '#153580',
              shadowOpacity: 0.35,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: borderColor }} />
          <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>
            OR CONTINUE WITH
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: borderColor }} />
        </View>

        {/* OTP Quick Login Button */}
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
            paddingVertical: 15,
            marginBottom: 20,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.2 : 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Phone size={18} color="#153580" />
          <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 15, fontWeight: '800' }}>
            Sign in with OTP
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: '500' }}>
            {"Don't have a garage account?"}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={{ color: '#153580', fontSize: 14, fontWeight: '800' }}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
