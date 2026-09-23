// ============================================================
// OTP Verification Screen
// Signature Sky Blue Header & Mega-Curved Lower Sheet
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
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, RefreshCw, Check } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { MOCK_ENTERPRISE } from '../../src/features/enterprise/mockEnterprise';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function OTPScreen() {
  const { theme, isDark } = useTheme();
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

  const skyBg = isDark ? '#070A0F' : '#6B9FE8';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
  const inputBg = isDark ? '#141926' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: skyBg }}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'light-content'} backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          paddingTop: 50,
          paddingHorizontal: 20,
          paddingBottom: 24,
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
          Verify OTP
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4, fontWeight: '500' }}>
          Sent 6-digit code to {phone || 'registered phone'}
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
          paddingHorizontal: 20,
          paddingTop: 30,
        }}
      >
        {/* OTP Input Card */}
        <Animated.View
          style={{
            backgroundColor: cardBg,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: borderColor,
            transform: [{ translateX: shakeAnim }],
            marginBottom: 20,
          }}
        >
          <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 16, textAlign: 'center', letterSpacing: 0.5 }}>
            ENTER 6-DIGIT VERIFICATION CODE
          </Text>

          {/* 6 Digit Inputs */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
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
                  width: 46,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: inputBg,
                  borderWidth: digit ? 2 : 1,
                  borderColor: digit ? (isDark ? '#60A5FA' : '#3B82F6') : borderColor,
                  color: theme.text,
                  fontSize: 22,
                  fontWeight: '800',
                }}
              />
            ))}
          </View>

          {error && (
            <Text style={{ color: isDark ? '#F87171' : '#DC2626', fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 16 }}>
              {error}
            </Text>
          )}

          {/* Midnight Navy CTA Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={isLoading}
            activeOpacity={0.88}
            style={{
              backgroundColor: '#0C1829',
              paddingVertical: 18,
              borderRadius: 34,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
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
              <Text style={{ color: isDark ? '#60A5FA' : '#1D4ED8', fontSize: 14, fontWeight: '700' }}>
                Resend New Code
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: '500' }}>
              Resend available in {resendTimer}s
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
