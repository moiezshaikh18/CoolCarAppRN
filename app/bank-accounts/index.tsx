// ============================================================
// Screen 19: Payment Modes — Ledgers & Accounts
// Directly matching Screen 19 in Reference Design Mockup
// ============================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Banknote,
  QrCode,
  CreditCard,
  Building2,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useBankAccountStore } from '../../src/store/bankAccountStore';

const PAYMENT_MODES_LIST = [
  { id: '1', name: 'Cash', icon: Banknote, color: '#10B981', bgColor: '#ECFDF5', desc: 'Cash Drawer / Counter' },
  { id: '2', name: 'UPI', icon: QrCode, color: '#2563EB', bgColor: '#EFF6FF', desc: 'GooglePay / PhonePe / Paytm' },
  { id: '3', name: 'Card', icon: CreditCard, color: '#7C3AED', bgColor: '#EDE9FE', desc: 'POS Terminal Machine' },
  { id: '4', name: 'Bank Transfer', icon: Building2, color: '#0284C7', bgColor: '#E0F2FE', desc: 'NEFT / RTGS / IMPS' },
];

export default function PaymentModesScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { accounts } = useBankAccountStore();

  const handleAddMode = () => {
    router.push('/bank-accounts/add');
  };

  const bg = isDark ? '#0C1829' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';
  const cardBg = isDark ? '#111E33' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Top Header matching Screen 19 */}
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
          Payment Modes
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 90,
          gap: 12,
        }}
      >
        {PAYMENT_MODES_LIST.map((mode) => {
          const Icon = mode.icon;
          return (
            <TouchableOpacity
              key={mode.id}
              onPress={() => router.push('/bank-accounts/add')}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 16,
                paddingHorizontal: 16,
                backgroundColor: cardBg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: mode.bgColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={22} color={mode.color} strokeWidth={2.2} />
                </View>

                <View>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: textPrimary }}>
                    {mode.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: textMuted, fontWeight: '500', marginTop: 2 }}>
                    {mode.desc}
                  </Text>
                </View>
              </View>

              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Fixed Bottom Button matching Screen 19 */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 22,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 20,
          paddingTop: 12,
          backgroundColor: bg,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <TouchableOpacity
          onPress={handleAddMode}
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
            + Add Payment Mode
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
