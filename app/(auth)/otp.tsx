// ============================================================
// OTP Verification Screen
// Clean Unified Layout, Vertically Centered Content
// Zero Cut-off Divs & Full Light/Dark Consistency
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, RefreshCw, Check } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { MOCK_ENTERPRISE } from '../../src/features/enterprise/mockEnterprise';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function OTPScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ phone: string; verificationId: string }>();
  const { setLoading, isLoading, setError, error, setUser, setAuthState } = useAuthStore();
  const { setActiveEnterprise, setActiveMember } = useEnterpriseStore();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [shakeAnim] = useState(() => new Animated.Value(0));

  const phone = params.phone ?? '';

  // Countdown timer
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

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

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

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < OTP_LENGTH) {
      triggerShake();
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockUser = {
        uid: 'user-demo-1',
        phone: phone || '9876543210',
        displayName: 'Manish Kumar',
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
        phone: phone || '9876543210',
        isActive: true,
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setAuthState('authenticated');
      router.replace('/(tabs)');
    } catch {
      triggerShake();
      setError('Invalid OTP code. Please check and re-enter.');
    } finally {
      setLoading(false);
    }
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

      {/* Top Bar with Back Button */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 10,
          left: 16,
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 22,
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 20,
        }}
      >
        {/* Centered Header Text */}
        <View style={{ alignItems: 'center', marginBottom: 26 }}>
          <Text
            style={{
              color: isDark ? '#FFFFFF' : '#0F172A',
              fontSize: 26,
              fontWeight: '900',
              letterSpacing: -0.5,
              textAlign: 'center',
            }}
          >
            Verify OTP
          </Text>
          <Text
            style={{
              color: isDark ? '#94A3B8' : '#64748B',
              fontSize: 14,
              marginTop: 6,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Sent 6-digit code to {phone || 'registered phone'}
          </Text>
        </View>

        {/* Centered Verification Card */}
        <Animated.View
          style={{
            backgroundColor: cardBg,
            borderRadius: 24,
            padding: 22,
            borderWidth: 1,
            borderColor: borderColor,
            transform: [{ translateX: shakeAnim }],
            marginBottom: 20,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.25 : 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <Text
            style={{
              color: isDark ? '#CBD5E1' : '#475569',
              fontSize: 11,
              fontWeight: '800',
              marginBottom: 16,
              textAlign: 'center',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Enter 6-Digit Verification Code
          </Text>

          {/* 6 Digit Inputs */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputs.current[index] = ref; }}
                value={digit}
                onChangeText={(val) => handleOtpChange(val, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                style={{
                  width: 44,
                  height: 54,
                  borderRadius: 14,
                  backgroundColor: inputBg,
                  borderWidth: digit ? 2 : 1,
                  borderColor: digit ? '#153580' : borderColor,
                  color: theme.text,
                  fontSize: 22,
                  fontWeight: '800',
                }}
              />
            ))}
          </View>

          {error && (
            <Text
              style={{
                color: isDark ? '#F87171' : '#DC2626',
                fontSize: 13,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              {error}
            </Text>
          )}

          {/* Royal Blue CTA Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={isLoading}
            activeOpacity={0.88}
            style={{
              backgroundColor: '#153580',
              paddingVertical: 16,
              borderRadius: 30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#153580',
              shadowOpacity: 0.35,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                  Verify & Enter
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Resend Section */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          <RefreshCw size={15} color={theme.textMuted} />
          {canResend ? (
            <TouchableOpacity onPress={() => { setResendTimer(RESEND_SECONDS); setCanResend(false); }}>
              <Text style={{ color: '#153580', fontSize: 14, fontWeight: '800' }}>
                Resend New Code
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: '500' }}>
              Resend available in {resendTimer}s
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
