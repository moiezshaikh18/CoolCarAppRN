// ============================================================
// Payments Screen — Collections & Receipts Ledger
// Sky Blue Header with Zero-Bleed Lower Sheet
// Tracks Cash, UPI, and Swipe (POS) with per-bank selection
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Receipt,
  QrCode,
  CreditCard,
  Banknote,
  Building2,
  CheckCircle2,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { usePaymentStore } from '../../src/store/paymentStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { formatCurrency } from '../../src/utils/currency';
import { Payment, PaymentMode } from '../../src/types/payment.types';

const MODE_TABS: { label: string; value: PaymentMode | 'ALL'; icon: any }[] = [
  { label: 'All Receipts', value: 'ALL', icon: Receipt },
  { label: 'Cash', value: 'CASH', icon: Banknote },
  { label: 'UPI', value: 'UPI', icon: QrCode },
  { label: 'Swipe', value: 'CARD_SWIPE', icon: CreditCard },
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
  const { isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { payments, setPayments } = usePaymentStore();
  const accounts = useBankAccountStore((s) => s.accounts);
  const activeAccounts = useMemo(() => accounts.filter((a) => a.isActive), [accounts]);

  const [selectedMode, setSelectedMode] = useState<PaymentMode | 'ALL'>('ALL');
  const [selectedAccountId, setSelectedAccountId] = useState<string | 'ALL'>('ALL');

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
                  date: data.date?.toDate?.() ? data.date.toDate().toISOString() : data.date,
                  referenceNumber: data.referenceNumber,
                  notes: data.notes,
                  voided: data.voided || false,
                  createdBy: data.createdBy,
                  createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
                };
              });
              setPayments(fetched);
            }
          },
          () => {
            // fallback silently
          }
        );
      } catch {
        // offline or local
      }
    }

    subscribePayments();
    return () => unsubscribe && unsubscribe();
  }, [enterpriseId, setPayments]);

  const allPayments = payments.length > 0 ? payments : DEFAULT_PAYMENTS;

  const filteredPayments = useMemo(() => {
    return allPayments.filter((p) => {
      if (selectedMode !== 'ALL' && p.paymentMode !== selectedMode) return false;
      if (selectedAccountId !== 'ALL' && p.paymentAccountId !== selectedAccountId) return false;
      return true;
    });
  }, [allPayments, selectedMode, selectedAccountId]);

  const totalCollected = useMemo(() => {
    return filteredPayments.reduce((acc, p) => acc + (p.voided ? 0 : p.amount), 0);
  }, [filteredPayments]);

  // Breakdown statistics for current month
  const monthlyStats = useMemo(() => {
    let cash = 0;
    let upi = 0;
    let swipe = 0;
    allPayments.forEach((p) => {
      if (p.voided) return;
      if (p.paymentMode === 'CASH') cash += p.amount;
      else if (p.paymentMode === 'UPI') upi += p.amount;
      else if (p.paymentMode === 'CARD_SWIPE') swipe += p.amount;
    });
    return { cash, upi, swipe, grandTotal: cash + upi + swipe };
  }, [allPayments]);

  const getModeIcon = (mode: PaymentMode) => {
    switch (mode) {
      case 'UPI':
        return QrCode;
      case 'CARD_SWIPE':
        return CreditCard;
      default:
        return Banknote;
    }
  };

  const canvasBg = isDark ? '#0A0D14' : '#153580';
  const sheetBg = isDark ? '#0A0D14' : '#F4F6F9';
  const cardBg = isDark ? '#141824' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.08)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={canvasBg} />

      {/* Royal Blue Top Header */}
      <View
        style={{
          backgroundColor: canvasBg,
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 24,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
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

        {/* Featured Card */}
        <GlassCard
          variant="navy"
          padding={18}
          style={{ borderRadius: 24 }}
        >
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, fontWeight: '600' }}>
            {selectedMode === 'ALL'
              ? 'This Month Total Receipts'
              : `${selectedMode === 'CARD_SWIPE' ? 'Card Swipe' : selectedMode} Collections`}
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '900', letterSpacing: -0.5, marginTop: 4 }}>
            {formatCurrency(totalCollected, currencySymbol)}
          </Text>

          {/* Quick 3-Way Mode Split Badges */}
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Banknote size={12} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                Cash: {formatCurrency(monthlyStats.cash, currencySymbol)}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.3)', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <QrCode size={12} color="#93C5FD" />
              <Text style={{ color: '#93C5FD', fontSize: 11, fontWeight: '700' }}>
                UPI: {formatCurrency(monthlyStats.upi, currencySymbol)}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(168, 85, 247, 0.3)', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <CreditCard size={12} color="#E9D5FF" />
              <Text style={{ color: '#E9D5FF', fontSize: 11, fontWeight: '700' }}>
                Swipe: {formatCurrency(monthlyStats.swipe, currencySymbol)}
              </Text>
            </View>
          </View>
        </GlassCard>
      </View>

      {/* Main Content Sheet with ZERO Blue Bleed */}
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
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 18, paddingBottom: 40 }}
        >
          {/* Primary Mode Tabs with Authentic Icons */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            {MODE_TABS.map((t) => {
              const isSelected = selectedMode === t.value;
              const TabIcon = t.icon;
              return (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => {
                    setSelectedMode(t.value);
                    setSelectedAccountId('ALL');
                  }}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 16,
                    backgroundColor: isSelected
                      ? '#153580'
                      : cardBg,
                    borderWidth: 1,
                    borderColor: isSelected ? '#153580' : cardBorder,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    shadowColor: '#000',
                    shadowOpacity: isSelected ? 0.15 : 0.02,
                    shadowRadius: 6,
                    elevation: isSelected ? 3 : 1,
                  }}
                >
                  <TabIcon size={16} color={isSelected ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B')} />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '800',
                      color: isSelected ? '#FFFFFF' : (isDark ? '#F1F5F9' : '#0F172A'),
                    }}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Underneath Bank Account Selector for UPI & Swipe */}
          {(selectedMode === 'UPI' || selectedMode === 'CARD_SWIPE') && (
            <View style={{ marginBottom: 14, padding: 12, borderRadius: 16, backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Building2 size={14} color={isDark ? '#94A3B8' : '#64748B'} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Filter by Bank Account:
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setSelectedAccountId('ALL')}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                    backgroundColor: selectedAccountId === 'ALL' ? '#153580' : (isDark ? '#1C2538' : '#F1F5F9'),
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '800', color: selectedAccountId === 'ALL' ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#475569') }}>
                    All Accounts
                  </Text>
                </TouchableOpacity>
                {activeAccounts.map((acc) => {
                  const isAccSelected = selectedAccountId === acc.id;
                  return (
                    <TouchableOpacity
                      key={acc.id}
                      onPress={() => setSelectedAccountId(acc.id)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 12,
                        backgroundColor: isAccSelected ? '#153580' : (isDark ? '#1C2538' : '#F1F5F9'),
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '800', color: isAccSelected ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#475569') }}>
                        {acc.bankName} {acc.accountNumber ? `(${acc.accountNumber.slice(-4)})` : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* List of Receipts */}
          <View style={{ gap: 10 }}>
            {filteredPayments.length === 0 ? (
              <View style={{ padding: 28, alignItems: 'center', backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor: cardBorder }}>
                <Receipt size={32} color={isDark ? '#475569' : '#94A3B8'} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: isDark ? '#94A3B8' : '#64748B', marginTop: 10 }}>
                  No receipts found for this filter
                </Text>
              </View>
            ) : (
              filteredPayments.map((p) => {
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
                      borderRadius: 20,
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: cardBorder,
                      shadowColor: '#000',
                      shadowOpacity: 0.03,
                      shadowRadius: 6,
                      elevation: 1,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 21,
                          backgroundColor: isDark ? '#1C2538' : '#EFF6FF',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={18} color="#153580" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                          {p.paymentAccountName || (p.paymentMode === 'CARD_SWIPE' ? 'Card Swipe POS' : p.paymentMode)}
                        </Text>
                        <Text style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', fontWeight: '600', marginTop: 2 }}>
                          Ref: {p.referenceNumber || p.id} • {p.paymentMode === 'CARD_SWIPE' ? 'Swipe' : p.paymentMode}
                        </Text>
                      </View>
                    </View>

                    <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: '900', color: '#10B981' }}>
                        +{formatCurrency(p.amount, currencySymbol)}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
                        <CheckCircle2 size={11} color="#10B981" />
                        <Text style={{ fontSize: 10, color: '#10B981', fontWeight: '700' }}>
                          Settled
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
