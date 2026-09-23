// ============================================================
// Business Info Screen — Luxury Nestora Warm-Minimalist Redesign
// Strictly follows media_1790116823022.png aesthetic
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
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Building2, User, Phone, MapPin, Edit3, Check } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { GlassCard } from '../../src/components/common/GlassCard';

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

  const canvasBg = isDark ? '#14171F' : '#F8F6F2';
  const cardBg = isDark ? '#1C212B' : '#EFECE6';
  const circleBtnBg = isDark ? '#1C212B' : '#EFECE6';
  const primaryBtnBg = isDark ? '#FFFFFF' : '#121214';
  const primaryBtnText = isDark ? '#121214' : '#FFFFFF';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      {/* Symmetrical Top Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: circleBtnBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color={theme.text} />
        </TouchableOpacity>

        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 }}>
          Business Profile
        </Text>

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
            backgroundColor: circleBtnBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Edit3 size={18} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
      >
        {/* Enterprise Brand Identity Hero Card */}
        <GlassCard
          variant="sand"
          padding={24}
          style={{
            borderRadius: 28,
            marginBottom: 20,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <Building2 size={34} color={theme.text} />
          </View>

          <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', textAlign: 'center', letterSpacing: -0.4 }}>
            {businessName}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600', marginTop: 4 }}>
            Automobile Workshop & Body Shop
          </Text>

          <View
            style={{
              marginTop: 14,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4',
            }}
          >
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: '700' }}>
              Multi-Tenant ID: {activeEnterprise?.id || 'ent_default'}
            </Text>
          </View>
        </GlassCard>

        {/* Business Specifications Card */}
        <GlassCard
          variant="sand"
          padding={22}
          style={{
            borderRadius: 28,
            gap: 16,
          }}
        >
          <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 }}>
            Workshop Details
          </Text>

          {/* Owner */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={18} color={theme.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>Owner / Proprietor</Text>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700', marginTop: 2 }}>{ownerName}</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          {/* Phone */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Phone size={18} color={theme.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>Phone / WhatsApp</Text>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700', marginTop: 2 }}>+91 {phone}</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          {/* Address */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 2,
              }}
            >
              <MapPin size={18} color={theme.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>Workshop Location</Text>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600', marginTop: 2, lineHeight: 20 }}>
                {address}
              </Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>

      {/* Floating Solid Obsidian CTA Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => {
            setTempName(businessName);
            setTempOwner(ownerName);
            setTempPhone(phone);
            setTempAddress(address);
            setEditModal(true);
          }}
          style={{
            backgroundColor: primaryBtnBg,
            paddingVertical: 18,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
            Edit Business Info
          </Text>
        </TouchableOpacity>
      </View>

      {/* Edit Modal with Luxury Pill Inputs */}
      <Modal visible={editModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? '#1C212B' : '#F8F6F2',
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: 24,
              paddingBottom: 40,
              gap: 16,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800' }}>
              Edit Business Info
            </Text>

            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                Garage Name
              </Text>
              <TextInput
                value={tempName}
                onChangeText={setTempName}
                style={{
                  backgroundColor: isDark ? '#262D3B' : '#EFECE6',
                  borderRadius: 22,
                  paddingHorizontal: 18,
                  paddingVertical: 14,
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: '600',
                }}
              />
            </View>

            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                Owner Name
              </Text>
              <TextInput
                value={tempOwner}
                onChangeText={setTempOwner}
                style={{
                  backgroundColor: isDark ? '#262D3B' : '#EFECE6',
                  borderRadius: 22,
                  paddingHorizontal: 18,
                  paddingVertical: 14,
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: '600',
                }}
              />
            </View>

            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                Phone Number
              </Text>
              <TextInput
                value={tempPhone}
                onChangeText={setTempPhone}
                keyboardType="phone-pad"
                style={{
                  backgroundColor: isDark ? '#262D3B' : '#EFECE6',
                  borderRadius: 22,
                  paddingHorizontal: 18,
                  paddingVertical: 14,
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: '600',
                }}
              />
            </View>

            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                Workshop Address
              </Text>
              <TextInput
                value={tempAddress}
                onChangeText={setTempAddress}
                multiline
                numberOfLines={2}
                style={{
                  backgroundColor: isDark ? '#262D3B' : '#EFECE6',
                  borderRadius: 22,
                  paddingHorizontal: 18,
                  paddingVertical: 14,
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: '600',
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => setEditModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? '#262D3B' : '#EFECE6',
                  paddingVertical: 16,
                  borderRadius: 28,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={{
                  flex: 1,
                  backgroundColor: primaryBtnBg,
                  paddingVertical: 16,
                  borderRadius: 28,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: primaryBtnText, fontSize: 15, fontWeight: '800' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
