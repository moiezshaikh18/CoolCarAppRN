// ============================================================
// Business Info Screen — Garage Business Profile
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Building2, User, Phone, MapPin, Edit3, Check } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';

export default function BusinessInfoScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { activeEnterprise, setActiveEnterprise } = useEnterpriseStore();

  const [businessName, setBusinessName] = useState(activeEnterprise?.name || 'Super Auto Garage');
  const [ownerName, setOwnerName] = useState('Manish Kumar');
  const [phone, setPhone] = useState(activeEnterprise?.phone || '9876543210');
  const [address, setAddress] = useState(activeEnterprise?.address || '123, Auto Nagar, New Delhi - 110015');

  const [editModal, setEditModal] = useState(false);
  const [tempName, setTempName] = useState(businessName);
  const [tempOwner, setTempOwner] = useState(ownerName);
  const [tempPhone, setTempPhone] = useState(phone);
  const [tempAddress, setTempAddress] = useState(address);

  const handleSave = () => {
    setBusinessName(tempName);
    setOwnerName(tempOwner);
    setPhone(tempPhone);
    setAddress(tempAddress);
    if (activeEnterprise) {
      setActiveEnterprise({
        ...activeEnterprise,
        name: tempName,
        phone: tempPhone,
        address: tempAddress,
      });
    }
    setEditModal(false);
    Alert.alert('Saved', 'Business profile details updated successfully.');
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
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
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
              Business Profile
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
              Workshop registration details
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            setTempName(businessName);
            setTempOwner(ownerName);
            setTempPhone(phone);
            setTempAddress(address);
            setEditModal(true);
          }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#0C1829',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <Edit3 size={18} color="#FFFFFF" />
        </TouchableOpacity>
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
          {/* Main Info Card */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: borderColor,
              gap: 16,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: isDark ? '#141926' : '#EFF6FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building2 size={26} color={isDark ? '#FFFFFF' : '#3B82F6'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
                  {businessName}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>
                  Automobile Service Center
                </Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: borderColor }} />

            {/* Field rows */}
            <View style={{ gap: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <User size={18} color={theme.textMuted} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Workshop Owner</Text>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700', marginTop: 2 }}>{ownerName}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Phone size={18} color={theme.textMuted} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Official Phone</Text>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700', marginTop: 2 }}>{phone}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <MapPin size={18} color={theme.textMuted} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Workshop Address</Text>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600', marginTop: 2 }}>{address}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Edit CTA */}
          <TouchableOpacity
            onPress={() => {
              setTempName(businessName);
              setTempOwner(ownerName);
              setTempPhone(phone);
              setTempAddress(address);
              setEditModal(true);
            }}
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
            <Edit3 size={18} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Edit Business Details
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Edit Modal */}
      <Modal visible={editModal} transparent animationType="slide" onRequestClose={() => setEditModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: isDark ? '#101927' : '#FFFFFF',
              borderTopLeftRadius: 36,
              borderTopRightRadius: 36,
              paddingTop: 24,
              paddingHorizontal: 20,
              paddingBottom: insets.bottom + 20,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800' }}>Edit Business Profile</Text>
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <Text style={{ color: isDark ? '#60A5FA' : '#2563EB', fontSize: 15, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 14 }}>
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>GARAGE NAME</Text>
                <TextInput
                  value={tempName}
                  onChangeText={setTempName}
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    height: 50,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                />
              </View>

              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>OWNER NAME</Text>
                <TextInput
                  value={tempOwner}
                  onChangeText={setTempOwner}
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    height: 50,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                />
              </View>

              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>PHONE NUMBER</Text>
                <TextInput
                  value={tempPhone}
                  onChangeText={setTempPhone}
                  keyboardType="phone-pad"
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    height: 50,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                />
              </View>

              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>WORKSHOP ADDRESS</Text>
                <TextInput
                  value={tempAddress}
                  onChangeText={setTempAddress}
                  multiline
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    minHeight: 70,
                    color: theme.text,
                    fontSize: 14,
                    fontWeight: '500',
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={handleSave}
                style={{
                  backgroundColor: '#0C1829',
                  paddingVertical: 16,
                  borderRadius: 32,
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
