// ============================================================
// Add Customer Screen — Form for registering customers
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
import { ArrowLeft, User, Phone, Mail, MapPin, FileText, Check } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { useCustomerStore } from '../../src/store/customerStore';

export default function AddCustomerScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { addCustomer } = useCustomerStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter customer name');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    const newCustId = `cust-${Date.now()}`;
    const entId = enterpriseId || 'enterprise-dev-001';

    const customerObj = {
      id: newCustId,
      enterpriseId: entId,
      name: name.trim(),
      phone: `+91${cleanPhone.slice(-10)}`,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
      totalJobs: 0,
      totalSpent: 0,
      totalPaid: 0,
      pendingAmount: 0,
      createdBy: 'user-owner-001',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      const custRef = doc(db, 'enterprises', entId, 'customers', newCustId);
      await setDoc(custRef, customerObj);
    } catch (err) {
      console.log('[AddCustomer] Firestore sync error/offline:', err);
    }

    addCustomer(customerObj);
    setLoading(false);

    Alert.alert('Success', 'Customer registered successfully!', [
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
              Add Customer
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
              Register new client in workshop database
            </Text>
          </View>
        </View>

        {/* Form Fields Card in Warm Sand */}
        <View style={{ paddingHorizontal: 22 }}>
          <GlassCard variant="sand" padding={22} style={{ borderRadius: 28, gap: 18 }}>
            {/* Customer Name */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '700', marginBottom: 8, letterSpacing: 0.3 }}>
                FULL NAME *
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  height: 54,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <User size={18} color={theme.textMuted} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Ramesh Kumar"
                  placeholderTextColor={theme.textMuted}
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '700', marginBottom: 8, letterSpacing: 0.3 }}>
                PHONE NUMBER *
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  height: 54,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <Phone size={18} color={theme.textMuted} />
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>+91</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="98765 43210"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>

            {/* Email Address */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '700', marginBottom: 8, letterSpacing: 0.3 }}>
                EMAIL (OPTIONAL)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  height: 54,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <Mail size={18} color={theme.textMuted} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="customer@email.com"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>

            {/* Address */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '700', marginBottom: 8, letterSpacing: 0.3 }}>
                ADDRESS / CITY (OPTIONAL)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  height: 54,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <MapPin size={18} color={theme.textMuted} />
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="e.g. Bandra West, Mumbai"
                  placeholderTextColor={theme.textMuted}
                  style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                />
              </View>
            </View>

            {/* Notes */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '700', marginBottom: 8, letterSpacing: 0.3 }}>
                GARAGE NOTES (OPTIONAL)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 12,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  minHeight: 90,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <FileText size={18} color={theme.textMuted} style={{ marginTop: 2 }} />
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="e.g. Regular customer, prefers synthetic engine oil"
                  placeholderTextColor={theme.textMuted}
                  multiline
                  style={{ flex: 1, color: theme.text, fontSize: 14, textAlignVertical: 'top', fontWeight: '500' }}
                />
              </View>
            </View>
          </GlassCard>

          {/* Solid Black Pill Submit Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.88}
            style={{
              marginTop: 20,
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
                  Save Customer Profile
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
