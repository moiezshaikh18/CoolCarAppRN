// ============================================================
// Payments Screen — Rules 7, 8, 9, 10 & 13
// Payment Collection History & Mode Breakdown
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Building,
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
    paymentAccountName: 'Cash in Hand (Counter)',
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
    paymentAccountName: 'HDFC Current A/c',
    date: new Date().toISOString(),
    referenceNumber: 'UPI/38291048201/PAY',
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

  const [activeTab, setActiveTab] = useState<PaymentMode | 'ALL'>('ALL');

  // Real-time Firestore sync
  useEffect(() => {
    const entId = enterpriseId || 'enterprise-dev-001';
    let unsubscribe: () => void;

    async function subscribePayments() {
      try {
        const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');
        const payRef = collection(db, 'enterprises', entId, 'payments');
        const q = query(payRef, orderBy('createdAt', 'desc'));

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const list: Payment[] = [];
            snapshot.forEach((doc) => {
              list.push({ id: doc.id, ...(doc.data() as any) });
            });
            if (list.length > 0) {
              setPayments(list);
            } else if (payments.length === 0) {
              setPayments(DEFAULT_PAYMENTS);
            }
          },
          (err) => {
            console.log('[Payments] listener error:', err);
            if (payments.length === 0) setPayments(DEFAULT_PAYMENTS);
          }
        );
      } catch (err) {
        console.log('[Payments] setup error:', err);
        if (payments.length === 0) setPayments(DEFAULT_PAYMENTS);
      }
    }

    subscribePayments();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [enterpriseId]);

  const displayPayments = payments.length > 0 ? payments : DEFAULT_PAYMENTS;

  const filteredPayments = useMemo(() => {
    if (activeTab === 'ALL') return displayPayments;
    return displayPayments.filter((p) => p.paymentMode === activeTab);
  }, [displayPayments, activeTab]);

  const totalCollected = displayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const upiCollected = displayPayments
    .filter((p) => p.paymentMode === 'UPI')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const cardCollected = displayPayments
    .filter((p) => p.paymentMode === 'CARD_SWIPE')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const cashCollected = displayPayments
    .filter((p) => p.paymentMode === 'CASH')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const getModeBadge = (mode: PaymentMode) => {
    switch (mode) {
      case 'UPI':
        return { label: 'UPI Linked', bg: isDark ? '#1E3A8A' : '#DBEAFE', text: isDark ? '#60A5FA' : '#1D4ED8' };
      case 'CARD_SWIPE':
        return { label: 'Card Swipe', bg: isDark ? '#701A75' : '#FCE7F3', text: isDark ? '#F472B6' : '#BE185D' };
      case 'CASH':
        return { label: 'Cash Drawer', bg: isDark ? '#064E3B' : '#DCFCE7', text: isDark ? '#34D399' : '#15803D' };
    }
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => {
    const badge = getModeBadge(item.paymentMode);
    return (
      <GlassCard variant="sand" padding={18} style={{ borderRadius: 28, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <View>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '900' }}>
              {formatCurrency(item.amount, currencySymbol)}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
              {typeof item.date === 'string' ? item.date.slice(0, 10) : 'Today'} • {item.jobSheetId}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: badge.bg,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: badge.text, fontSize: 11, fontWeight: '800' }}>
              {badge.label}
            </Text>
          </View>
        </View>

        {/* Target destination account */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: isDark ? '#252B38' : '#FFFFFF',
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Building size={14} color={theme.textMuted} />
          <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600', flex: 1 }}>
            Credited to: {item.paymentAccountName || (item.paymentMode === 'CASH' ? 'Cash Counter' : 'Bank Account')}
          </Text>
          {item.referenceNumber && (
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>
              Ref: {item.referenceNumber.slice(0, 16)}
            </Text>
          )}
        </View>
      </GlassCard>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Symmetrical Top Header */}
      <View
        style={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 22,
          paddingBottom: 16,
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
            Customer Receipts
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
            Cash counter & bank collections
          </Text>
        </View>
      </View>

      {/* Summary 3-pill Obsidian Hero Card */}
      <View style={{ paddingHorizontal: 22, marginBottom: 16 }}>
        <View
          style={{
            borderRadius: 28,
            padding: 22,
            backgroundColor: isDark ? '#FFFFFF' : '#121214',
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <Text style={{ color: isDark ? '#4B5563' : '#9CA3AF', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Total Revenue Collected
          </Text>
          <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 32, fontWeight: '900', marginTop: 4, marginBottom: 16, letterSpacing: -0.5 }}>
            {formatCurrency(totalCollected, currencySymbol)}
          </Text>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1, backgroundColor: isDark ? '#F3F4F6' : '#1E2430', borderRadius: 16, padding: 10 }}>
              <Text style={{ color: isDark ? '#6B7280' : '#9CA3AF', fontSize: 10, fontWeight: '700' }}>UPI</Text>
              <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 14, fontWeight: '800', marginTop: 2 }}>
                {formatCurrency(upiCollected, currencySymbol)}
              </Text>
            </View>

            <View style={{ flex: 1, backgroundColor: isDark ? '#F3F4F6' : '#1E2430', borderRadius: 16, padding: 10 }}>
              <Text style={{ color: isDark ? '#6B7280' : '#9CA3AF', fontSize: 10, fontWeight: '700' }}>Cards</Text>
              <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 14, fontWeight: '800', marginTop: 2 }}>
                {formatCurrency(cardCollected, currencySymbol)}
              </Text>
            </View>

            <View style={{ flex: 1, backgroundColor: isDark ? '#F3F4F6' : '#1E2430', borderRadius: 16, padding: 10 }}>
              <Text style={{ color: isDark ? '#6B7280' : '#9CA3AF', fontSize: 10, fontWeight: '700' }}>Cash</Text>
              <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 14, fontWeight: '800', marginTop: 2 }}>
                {formatCurrency(cashCollected, currencySymbol)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ paddingHorizontal: 22, marginBottom: 16 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={MODE_TABS}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => {
            const isSelected = activeTab === item.value;
            return (
              <TouchableOpacity
                onPress={() => setActiveTab(item.value)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                  borderRadius: 20,
                  backgroundColor: isSelected
                    ? (isDark ? '#FFFFFF' : '#121214')
                    : (isDark ? '#1C212B' : '#EFECE6'),
                }}
              >
                <Text
                  style={{
                    color: isSelected ? (isDark ? '#121214' : '#FFFFFF') : theme.textMuted,
                    fontSize: 13,
                    fontWeight: isSelected ? '700' : '600',
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Payments List */}
      <FlatList
        data={filteredPayments}
        keyExtractor={(item) => item.id}
        renderItem={renderPaymentItem}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
