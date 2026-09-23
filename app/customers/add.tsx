// ============================================================
// Add Customer Screen — Form for registering customers
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
import { ArrowLeft, User, Phone, Mail, MapPin, FileText, Check } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
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

  const skyBg = isDark ? '#070A0F' : '#6B9FE8';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
  const inputBg = isDark ? '#141926' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: skyBg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'light-content'} backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 20,
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
            Add Customer
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
            Register new car owner profile
          </Text>
        </View>
      </View>

      {/* Signature Mega-Curved Lower Content Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 }}
        >
          <View style={{ gap: 16 }}>
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: borderColor,
                gap: 16,
              }}
            >
              {/* Full Name */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  FULL NAME *
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
                    placeholder="e.g. Ramesh Kumar"
                    placeholderTextColor={theme.textMuted}
                    style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                  />
                </View>
              </View>

              {/* Mobile Phone */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  MOBILE NUMBER *
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
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  EMAIL ADDRESS (OPTIONAL)
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
                    placeholder="ramesh@example.com"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                  />
                </View>
              </View>

              {/* Physical Address */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  ADDRESS / LOCALITY
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
                  <MapPin size={18} color={theme.textMuted} />
                  <TextInput
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Sector 14, Andheri West"
                    placeholderTextColor={theme.textMuted}
                    style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                  />
                </View>
              </View>

              {/* Notes */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  INTERNAL NOTES
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    backgroundColor: inputBg,
                    borderRadius: 18,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    gap: 12,
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                >
                  <FileText size={18} color={theme.textMuted} style={{ marginTop: 2 }} />
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="VIP customer, corporate fleet owner, etc."
                    placeholderTextColor={theme.textMuted}
                    multiline
                    style={{
                      flex: 1,
                      color: theme.text,
                      fontSize: 14,
                      minHeight: 60,
                      textAlignVertical: 'top',
                      fontWeight: '500',
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Midnight Navy Pill Submit Button */}
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
                    Save Customer Profile
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
