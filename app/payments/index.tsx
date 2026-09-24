// ============================================================
// Payments Screen — Sky Blue & Midnight Navy Luxury Layout
// Directly matching media_1790189780212.png & media_1790189816628.png
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Receipt,
  ArrowDownLeft,
  Smartphone,
  CreditCard,
  Wallet,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { usePaymentStore } from '../../src/store/paymentStore';
import { formatCurrency } from '../../src/utils/currency';
import { Payment, PaymentMode } from '../../src/types/payment.types';

const MODE_TABS: { label: string; value: PaymentMode | 'ALL' }[] = [
  { label: 'All Receipts', value: 'ALL' },
  { label: 'UPI', value: 'UPI' },
  { label: 'Card Swipe', value: 'CARD_SWIPE' },
  { label: 'Cash Counter', value: 'CASH' },
];

const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    enterpriseId: 'enterprise-dev-001',
    jobSheetId: 'JS-2026-001',
    customerId: 'cust-001',
    vehicleId: 'veh-001',
    amount: 8500,
    paymentMode: 'CASH',
    paymentAccountName: 'Cash Counter Register',
    date: new Date().toISOString(),
    referenceNumber: 'CSH-001',
    voided: false,
    createdBy: 'user-owner-001',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pay-002',
    enterpriseId: 'enterprise-dev-001',
    jobSheetId: 'JS-2026-002',
    customerId: 'cust-002',
    vehicleId: 'veh-002',
    amount: 1700,
    paymentMode: 'UPI',
    paymentAccountId: 'acc-hdfc-01',
    paymentAccountName: 'HDFC Bank - 8923',
    date: new Date().toISOString(),
    referenceNumber: 'UPI-9821334',
    voided: false,
    createdBy: 'user-owner-001',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pay-003',
    enterpriseId: 'enterprise-dev-001',
    jobSheetId: 'JS-2026-003',
    customerId: 'cust-003',
    vehicleId: 'veh-003',
    amount: 14200,
    paymentMode: 'CARD_SWIPE',
    paymentAccountId: 'acc-icici-01',
    paymentAccountName: 'ICICI Bank - 4401',
    date: new Date().toISOString(),
    referenceNumber: 'POS-77124',
    voided: false,
    createdBy: 'user-owner-001',
    createdAt: new Date().toISOString(),
  },
];

export default function PaymentsScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { payments, setPayments } = usePaymentStore();
  const [selectedMode, setSelectedMode] = useState<PaymentMode | 'ALL'>('ALL');

  // Real-time Firestore sync
  useEffect(() => {
    const entId = enterpriseId || 'enterprise-dev-001';
    let unsubscribe: () => void;

    async function subscribePayments() {
      try {
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');
        const paysRef = collection(db, 'enterprises', entId, 'payments');

        unsubscribe = onSnapshot(
          paysRef,
          (snapshot) => {
            if (!snapshot.empty) {
              const fetched: Payment[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  id: doc.id,
                  enterpriseId: data.enterpriseId,
                  jobSheetId: data.jobSheetId,
                  customerId: data.customerId,
                  vehicleId: data.vehicleId,
                  amount: Number(data.amount) || 0,
                  paymentMode: data.paymentMode,
                  paymentAccountId: data.paymentAccountId,
                  paymentAccountName: data.paymentAccountName,
                  date: data.date,
                  referenceNumber: data.referenceNumber,
                  voided: Boolean(data.voided),
                  createdBy: data.createdBy,
                  createdAt: data.createdAt,
                };
              });
              setPayments(fetched);
            }
          },
          (err) => console.log('[Payments] sync error:', err)
        );
      } catch (err) {
        console.log('[Payments] setup error:', err);
      }
    }

    subscribePayments();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [enterpriseId, setPayments]);

  const allPayments = payments.length > 0 ? payments : DEFAULT_PAYMENTS;

  const filteredPayments = useMemo(() => {
    if (selectedMode === 'ALL') return allPayments;
    return allPayments.filter((p) => p.paymentMode === selectedMode);
  }, [allPayments, selectedMode]);

  const totalCollected = allPayments.reduce((acc, p) => acc + (p.voided ? 0 : p.amount), 0);

  const getModeIcon = (mode: PaymentMode) => {
    switch (mode) {
      case 'UPI':
        return Smartphone;
      case 'CARD_SWIPE':
        return CreditCard;
      default:
        return Wallet;
    }
  };

  const canvasBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#111622' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Sky Blue Header */}
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronLeft size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
              Receipts Ledger
            </Text>

            <View style={{ width: 44 }} />
          </View>

          {/* Featured Midnight Navy Card */}
          <GlassCard
            variant="navy"
            padding={22}
            style={{ borderRadius: 30, marginBottom: 6 }}
          >
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 13, fontWeight: '600' }}>
              Total Collections Settled
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1, marginTop: 8 }}>
              {formatCurrency(totalCollected, currencySymbol)}
            </Text>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                  {allPayments.length} Total Settlements
                </Text>
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(0, 200, 150, 0.2)' }}>
                <Text style={{ color: '#00C896', fontSize: 11, fontWeight: '800' }}>
                  Verified Cashflow
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Crisp White Lower Sheet */}
        <View
          style={{
            backgroundColor: sheetBg,
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            paddingTop: 24,
            paddingHorizontal: 20,
            paddingBottom: 24,
            minHeight: 500,
            shadowColor: '#0C1829',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDark ? 0.4 : 0.06,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {/* Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
            {MODE_TABS.map((t) => {
              const isSelected = selectedMode === t.value;
              return (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => setSelectedMode(t.value)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: isSelected ? (isDark ? '#FFFFFF' : '#0C1829') : (isDark ? '#141926' : '#F8FAFD'),
                    borderWidth: 1,
                    borderColor: isSelected ? (isDark ? '#FFFFFF' : '#0C1829') : cardBorder,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '800',
                      color: isSelected ? (isDark ? '#0C1829' : '#FFFFFF') : '#64748B',
                    }}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* List of Receipts */}
          <View style={{ gap: 12 }}>
            {filteredPayments.map((p) => {
              const Icon = getModeIcon(p.paymentMode);
              return (
                <View
                  key={p.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 22,
                    backgroundColor: isDark ? '#141926' : '#F8FAFD',
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: isDark ? '#1C2538' : '#0C1829',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                        {p.paymentAccountName || p.paymentMode}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                        Ref: {p.referenceNumber || p.id} • {p.paymentMode}
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: '#00C896' }}>
                      +{formatCurrency(p.amount, currencySymbol)}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                      Verified
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
