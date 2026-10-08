// ============================================================
// Screen 4: Sign Up Screen ("Create Account") — Cool Car Workshop OS
// Matches Reference Design:
// Back Arrow, "Create Account", "Sign up to get started",
// Full Name, Email / Phone, Password with Eye Toggle,
// Midnight Navy "Sign Up" Button, Google & Phone Options,
// "Already have an account? Login" Footer
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
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff, Phone } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { MOCK_ENTERPRISE } from '../../src/features/enterprise/mockEnterprise';

// Google 'G' Vector Icon
function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export default function SignUpScreen() {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Top Header: Back Arrow Button (Screen 4 in Ref Photo) */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowLeft size={22} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Title Group: "Create Account" & "Sign up to get started" */}
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Full Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
              style={styles.inputField}
            />
          </View>

          {/* Email / Phone Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email / Phone</Text>
            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="Enter email or phone"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.inputField}
            />
          </View>

          {/* Password Field with Eye Toggle */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                style={[styles.inputField, { paddingRight: 44 }]}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#94A3B8" />
                ) : (
                  <Eye size={18} color="#94A3B8" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary Midnight Navy "Sign Up" Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            activeOpacity={0.88}
            style={styles.signUpButton}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* "or continue with" Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Side-by-Side Alternate Buttons: Google & Phone */}
          <View style={styles.altButtonsRow}>
            <TouchableOpacity
              onPress={handleSignUp}
              style={styles.altButton}
              activeOpacity={0.8}
            >
              <GoogleIcon size={18} />
              <Text style={styles.altButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push({ pathname: '/(auth)/otp', params: { phone: identifier } })}
              style={styles.altButton}
              activeOpacity={0.8}
            >
              <Phone size={16} color="#0F172A" />
              <Text style={styles.altButtonText}>Phone</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Link: "Already have an account? Login" */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLinkBold}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topHeader: {
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleGroup: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    fontWeight: '500',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    padding: 6,
  },
  signUpButton: {
    backgroundColor: '#0C1829', // Exact Midnight Navy from Screen 4
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0C1829',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginTop: 8,
    marginBottom: 26,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  altButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  altButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    borderRadius: 14,
  },
  altButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  footerLinkBold: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
});
