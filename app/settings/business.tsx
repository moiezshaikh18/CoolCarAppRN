// ============================================================
// Screen 22: Business Info — Garage Business Profile
// Directly matching Screen 22 in Reference Design Mockup
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
  const { isDark } = useTheme();
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

  const bg = isDark ? '#0C1829' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';
  const cardBg = isDark ? '#111E33' : '#FFFFFF';
  const fieldBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Top Header matching Screen 22 */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{ width: 40, height: 40, justifyContent: 'center' }}
        >
          <ArrowLeft size={22} color={textPrimary} strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary }}>
          Business Info
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 90,
          gap: 16,
        }}
      >
        {/* Garage Name Field Card */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>
            Garage Name
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>
            {businessName}
          </Text>
        </View>

        {/* Owner Name Field Card */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>
            Owner Name
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>
            {ownerName}
          </Text>
        </View>

        {/* Phone Field Card */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>
            Phone
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>
            {phone}
          </Text>
        </View>

        {/* Address Field Card */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>
            Address
          </Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: textPrimary, lineHeight: 22 }}>
            {address}
          </Text>
        </View>

        {/* Edit Info Button matching Screen 22 */}
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
            paddingVertical: 16,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginTop: 10,
          }}
        >
          <Edit3 size={18} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>
            Edit Info
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editModal} transparent animationType="slide" onRequestClose={() => setEditModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: isDark ? '#111E33' : '#FFFFFF',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingTop: 24,
              paddingHorizontal: 20,
              paddingBottom: insets.bottom + 24,
              gap: 16,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary }}>
                Edit Business Details
              </Text>
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: textMuted }}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 12 }}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>Garage Name</Text>
                <TextInput
                  value={tempName}
                  onChangeText={setTempName}
                  style={{
                    backgroundColor: fieldBg,
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    fontWeight: '700',
                    color: textPrimary,
                  }}
                />
              </View>

              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>Owner Name</Text>
                <TextInput
                  value={tempOwner}
                  onChangeText={setTempOwner}
                  style={{
                    backgroundColor: fieldBg,
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    fontWeight: '700',
                    color: textPrimary,
                  }}
                />
              </View>

              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>Phone</Text>
                <TextInput
                  value={tempPhone}
                  onChangeText={setTempPhone}
                  keyboardType="phone-pad"
                  style={{
                    backgroundColor: fieldBg,
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    fontWeight: '700',
                    color: textPrimary,
                  }}
                />
              </View>

              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>Address</Text>
                <TextInput
                  value={tempAddress}
                  onChangeText={setTempAddress}
                  multiline
                  numberOfLines={2}
                  style={{
                    backgroundColor: fieldBg,
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    fontWeight: '700',
                    color: textPrimary,
                    minHeight: 70,
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.88}
              style={{
                backgroundColor: '#0C1829',
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 6,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
