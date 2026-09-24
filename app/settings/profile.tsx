// ============================================================
// User Profile Screen — Manage personal details & role
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
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Check,
  Shield,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { getInitials, formatRoleLabel } from '../../src/utils/formatters';

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuthStore();
  const { activeEnterprise, activeMember } = useEnterpriseStore();

  const [name, setName] = useState(user?.displayName || 'Workshop Owner');
  const [email, setEmail] = useState(user?.email || 'owner@coolcargarage.com');
  const [phone] = useState(user?.phone || '+91 98765 43210');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    setLoading(true);

    if (user) {
      const updated = { ...user, displayName: name.trim(), email: email.trim() };
      setUser(updated);
      try {
        const { doc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');
        await updateDoc(doc(db, 'users', user.uid), {
          displayName: name.trim(),
          email: email.trim(),
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.log('[Profile] Firestore update error:', err);
      }
    }

    setLoading(false);
    Alert.alert('Saved', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const skyBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
  const inputBg = isDark ? '#141926' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          backgroundColor: skyBg,
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 22,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
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
          }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
            My Profile
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
            Account details & permissions
          </Text>
        </View>
      </View>

      {/* Signature Lower Content Sheet with ZERO Blue Bleed */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          marginTop: -14,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 }}
        >
          {/* Avatar Hero Card */}
          <View
            style={{
              backgroundColor: '#0C1829',
              borderRadius: 26,
              padding: 22,
              alignItems: 'center',
              marginBottom: 20,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: 'rgba(255,255,255,0.18)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '900' }}>
                {getInitials(name)}
              </Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '800' }}>
              {name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: 'rgba(255,255,255,0.14)',
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 16,
                marginTop: 8,
              }}
            >
              <Shield size={12} color="#00C896" />
              <Text style={{ color: '#00C896', fontSize: 12, fontWeight: '800' }}>
                {formatRoleLabel(activeMember?.role ?? 'OWNER')}
              </Text>
            </View>
          </View>

          {/* Edit Fields Card */}
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
            {/* Name */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                DISPLAY NAME *
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
                  value={name}
                  onChangeText={setName}
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                EMAIL ADDRESS
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
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>

            {/* Phone (Read Only) */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                PHONE NUMBER (VERIFIED)
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
                  opacity: 0.7,
                }}
              >
                <Phone size={18} color={theme.textMuted} />
                <TextInput
                  value={phone}
                  editable={false}
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>
          </View>

          {/* Midnight Navy CTA */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
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
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                  Save Profile
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
