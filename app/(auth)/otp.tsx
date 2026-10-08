// ============================================================
// OTP Verification Screen
// Clean Minimalist Authentication matching Reference Mockup
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { MOCK_ENTERPRISE } from '../../src/features/enterprise/mockEnterprise';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export default function OTPScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ phone: string }>();
  const { setUser, setAuthState } = useAuthStore();
  const { setActiveEnterprise, setActiveMember } = useEnterpriseStore();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const phone = params.phone || '+91 98765 43210';

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      cleanDigits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      const targetIndex = Math.min(cleanDigits.length, OTP_LENGTH - 1);
      inputs.current[targetIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 4) {
      Alert.alert('Incomplete Code', 'Please enter the verification code.');
      return;
    }

    const mockUser = {
      uid: 'user-phone-' + Date.now(),
      phone: phone,
      displayName: 'Workshop Owner',
      email: 'owner@coolcar.com',
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
      displayName: 'Workshop Owner',
      phone: phone,
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
          {/* Back button */}
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

          {/* Title */}
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <Text style={{ fontSize: 26, fontWeight: '800', color: textPrimary, letterSpacing: -0.5 }}>
              Verification Code
            </Text>
            <Text style={{ fontSize: 14, color: textMuted, fontWeight: '500', marginTop: 6, textAlign: 'center' }}>
              We sent a verification code to{'\n'}
              <Text style={{ fontWeight: '700', color: textPrimary }}>{phone}</Text>
            </Text>
          </View>

          {/* 6 Digit Input Boxes */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 30 }}>
            {otp.map((digit, index) => {
              const isFilled = !!digit;
              return (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(val, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={OTP_LENGTH}
                  selectTextOnFocus
                  style={{
                    width: 48,
                    height: 54,
                    backgroundColor: inputBg,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: isFilled ? '#0C1829' : borderColor,
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '800',
                    color: textPrimary,
                  }}
                />
              );
            })}
          </View>

          {/* Resend Timer */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            {canResend ? (
              <TouchableOpacity
                onPress={() => {
                  setResendTimer(RESEND_SECONDS);
                  setCanResend(false);
                  Alert.alert('Code Resent', 'A fresh OTP code has been sent.');
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#0C1829' }}>
                  Resend Code
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ fontSize: 13, color: textMuted, fontWeight: '500' }}>
                Resend code in <Text style={{ fontWeight: '700', color: textPrimary }}>0:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}</Text>
              </Text>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            activeOpacity={0.88}
            style={{
              height: 52,
              backgroundColor: '#0C1829',
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#0C1829',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Verify & Proceed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Change Number Option */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ alignItems: 'center', marginTop: 24 }}
        >
          <Text style={{ fontSize: 13, color: textMuted, fontWeight: '600' }}>
            Wrong number? <Text style={{ color: '#0C1829', fontWeight: '800' }}>Change</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
