// ============================================================
// User Profile Screen — Manage personal details & role
// Luxury Warm-Minimalist Aesthetic (Nestora style)
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
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/store/authStore';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { GlassCard } from '../../src/components/common/GlassCard';
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Symmetrical Top Header */}
        <View
          style={{
            paddingTop: insets.top + 14,
            paddingHorizontal: 22,
            paddingBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isDark ? '#1C212B' : '#EFECE6',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={20} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
              Owner Profile
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
              Personal account & access rights
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, gap: 18 }}>
          {/* Avatar Hero Card in Warm Sand */}
          <GlassCard
            variant="sand"
            padding={24}
            style={{ borderRadius: 28, alignItems: 'center' }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: isDark ? '#FFFFFF' : '#121214',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 26, fontWeight: '900' }}>
                {getInitials(name)}
              </Text>
            </View>

            <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800' }}>
              {name}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>
              {phone}
            </Text>

            <View
              style={{
                marginTop: 10,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: isDark ? '#252B38' : '#FFFFFF',
              }}
            >
              <Text style={{ color: theme.text, fontSize: 11, fontWeight: '800' }}>
                {formatRoleLabel(activeMember?.role ?? 'OWNER')}
              </Text>
            </View>
          </GlassCard>

          {/* Form Fields Card in Warm Sand */}
          <GlassCard variant="sand" padding={22} style={{ borderRadius: 28, gap: 16 }}>
            {/* Full Name */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                DISPLAY NAME *
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  height: 54,
                  gap: 12,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <User size={18} color={theme.textMuted} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter full name"
                  placeholderTextColor={theme.textMuted}
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
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  height: 54,
                  gap: 12,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <Mail size={18} color={theme.textMuted} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email address"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>

            {/* Mobile (Read-only) */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                PRIMARY MOBILE (VERIFIED)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: isDark ? '#1C212B' : '#EFECE6',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  height: 54,
                  gap: 12,
                }}
              >
                <Phone size={18} color={theme.textMuted} />
                <Text style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '700' }}>
                  {phone}
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Solid Obsidian Black Pill Submit Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.88}
            style={{
              backgroundColor: isDark ? '#FFFFFF' : '#121214',
              paddingVertical: 18,
              borderRadius: 34,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
            }}
          >
            {loading ? (
              <ActivityIndicator color={isDark ? '#121214' : '#FFFFFF'} />
            ) : (
              <>
                <Check size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
                <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                  Save Profile Changes
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
