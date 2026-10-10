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
  Modal,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, X } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { MOCK_ENTERPRISE } from '../../src/features/enterprise/mockEnterprise';
import { verifyPhoneNumberAccess, formatIndianPhone } from '../../src/services/authWhitelist.service';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export default function OTPScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ phone: string }>();
  const { setUser, setAuthState } = useAuthStore();
  const { setActiveEnterprise, setActiveMember } = useEnterpriseStore();

  const [currentPhone, setCurrentPhone] = useState(
    params.phone ? formatIndianPhone(params.phone) : '+91 87934 36778'
  );
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [newPhoneInput, setNewPhoneInput] = useState('');

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

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

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 4) {
      Alert.alert('Incomplete Code', 'Please enter the verification code.');
      return;
    }

    const entId = useEnterpriseStore.getState().activeEnterprise?.id || 'enterprise-cool-car';

    // Verify phone number access against Dynamic Owners & Registered Staff
    const access = await verifyPhoneNumberAccess(currentPhone, entId);

    if (!access.allowed) {
      Alert.alert(
        'Access Denied 🔒',
        access.denialReason || 'Unauthorized mobile number.',
        [
          {
            text: 'Change Number',
            onPress: () => {
              setOtp(Array(OTP_LENGTH).fill(''));
              setShowChangeModal(true);
            },
          },
          {
            text: 'OK',
            onPress: () => {
              setOtp(Array(OTP_LENGTH).fill(''));
              inputs.current[0]?.focus();
            },
          },
        ]
      );
      return;
    }

    // Sign into Firebase Auth anonymously if needed to establish auth state
    try {
      const { signInAnonymously } = await import('firebase/auth');
      const { auth } = await import('../../src/services/firebase/firebase.config');
      await signInAnonymously(auth);
    } catch (authErr) {
      console.log('[OTP] Firebase auth notice:', authErr);
    }

    const { auth } = await import('../../src/services/firebase/firebase.config');
    const currentUid =
      auth.currentUser?.uid ||
      (access.employeeId ? `staff-${access.employeeId}` : `owner-${access.phone}`);

    const authenticatedUser = {
      uid: currentUid,
      phone: access.formattedPhone,
      displayName: access.displayName,
      email: `${access.phone}@coolcar.in`,
      enterpriseIds: [MOCK_ENTERPRISE.id],
      activeEnterpriseId: MOCK_ENTERPRISE.id,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUser(authenticatedUser);
    setActiveEnterprise(MOCK_ENTERPRISE);
    setActiveMember({
      userId: currentUid,
      enterpriseId: MOCK_ENTERPRISE.id,
      role: access.role,
      displayName: access.displayName,
      phone: access.formattedPhone,
      isActive: true,
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setAuthState('authenticated');
    router.replace('/(tabs)');
  };

  const handleUpdatePhoneNumber = () => {
    const clean = newPhoneInput.replace(/\D/g, '');
    if (clean.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    const formatted = `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
    setCurrentPhone(formatted);
    setOtp(Array(OTP_LENGTH).fill(''));
    setResendTimer(RESEND_SECONDS);
    setCanResend(false);
    setShowChangeModal(false);
    setNewPhoneInput('');
    setTimeout(() => inputs.current[0]?.focus(), 250);
    Alert.alert('OTP Sent', `A fresh verification code has been sent to ${formatted}`);
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
              We sent a verification code to
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: textPrimary }}>{currentPhone}</Text>
              <TouchableOpacity
                onPress={() => {
                  setNewPhoneInput('');
                  setShowChangeModal(true);
                }}
                activeOpacity={0.7}
                style={{
                  backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#EFF6FF',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#2563EB' }}>Change</Text>
              </TouchableOpacity>
            </View>
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
          onPress={() => {
            setNewPhoneInput('');
            setShowChangeModal(true);
          }}
          style={{ alignItems: 'center', marginTop: 24 }}
        >
          <Text style={{ fontSize: 13, color: textMuted, fontWeight: '600' }}>
            Wrong number? <Text style={{ color: '#2563EB', fontWeight: '800' }}>Change Phone Number</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Change Phone Number Modal */}
      <Modal
        visible={showChangeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowChangeModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 380,
              backgroundColor: isDark ? '#111E33' : '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 19, fontWeight: '800', color: textPrimary }}>
                Change Mobile Number
              </Text>
              <TouchableOpacity onPress={() => setShowChangeModal(false)} hitSlop={12}>
                <X size={20} color={textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: textMuted, marginBottom: 18, lineHeight: 18 }}>
              Enter your 10-digit mobile number to receive a new verification code.
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? '#0C1829' : '#F8FAFC',
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: borderColor,
                paddingHorizontal: 14,
                height: 52,
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: textPrimary, marginRight: 8 }}>
                +91
              </Text>
              <TextInput
                value={newPhoneInput}
                onChangeText={(t) => setNewPhoneInput(t.replace(/\D/g, '').slice(0, 10))}
                placeholder="98765 43210"
                placeholderTextColor={textMuted}
                keyboardType="phone-pad"
                autoFocus
                maxLength={10}
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: '700',
                  color: textPrimary,
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowChangeModal(false)}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: borderColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: textMuted }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdatePhoneNumber}
                style={{
                  flex: 2,
                  height: 48,
                  backgroundColor: '#0C1829',
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFFFFF' }}>
                  Send New OTP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
}
