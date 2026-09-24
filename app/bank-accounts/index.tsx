// ============================================================
// Bank Accounts & Receipts Screen — Cool Car Workshop
// Pure Month-to-Month Tracking (Starts at 0 each month)
// Tracks Cash Inward, UPI (per Bank), and Swipe POS (per Bank)
// Zero-Bleed Layout
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
  Building2,
  CreditCard,
  QrCode,
  Banknote,
  Plus,
  CheckCircle2,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { usePaymentStore } from '../../src/store/paymentStore';
import { formatCurrency } from '../../src/utils/currency';

export default function BankAccountsScreen() {
  const { isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const accounts = useBankAccountStore((s) => s.accounts);
  const { payments } = usePaymentStore();

  // Calculate Month Totals: Cash, UPI, Swipe per account
  const monthStats = useMemo(() => {
    let cash = 0;
    let upi = 0;
    let swipe = 0;

    const accountBreakdown: Record<string, { upi: number; swipe: number; total: number }> = {};
    accounts.forEach((a) => {
      accountBreakdown[a.id] = { upi: 0, swipe: 0, total: 0 };
    });

    payments.forEach((p) => {
      if (p.voided) return;
      if (p.paymentMode === 'CASH') {
        cash += p.amount;
      } else if (p.paymentMode === 'UPI') {
        upi += p.amount;
        if (p.paymentAccountId && accountBreakdown[p.paymentAccountId]) {
          accountBreakdown[p.paymentAccountId].upi += p.amount;
          accountBreakdown[p.paymentAccountId].total += p.amount;
        }
      } else if (p.paymentMode === 'CARD_SWIPE') {
        swipe += p.amount;
        if (p.paymentAccountId && accountBreakdown[p.paymentAccountId]) {
          accountBreakdown[p.paymentAccountId].swipe += p.amount;
          accountBreakdown[p.paymentAccountId].total += p.amount;
        }
      }
    });

    return {
      cash,
      upi,
      swipe,
      totalInflow: cash + upi + swipe,
      accountBreakdown,
    };
  }, [accounts, payments]);

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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
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
            Bank & Cash Inflow
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/bank-accounts/add')}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Featured Monthly Inflow Card */}
        <GlassCard
          variant="navy"
          padding={20}
          style={{ borderRadius: 24 }}
        >
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, fontWeight: '600' }}>
            This Month Total Collections
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: -0.5, marginTop: 4 }}>
            {formatCurrency(monthStats.totalInflow, currencySymbol)}
          </Text>

          {/* 3-Way Mode Split Row */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)', borderRadius: 14, padding: 10, alignItems: 'center' }}>
              <Banknote size={16} color="#FFFFFF" />
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', marginTop: 4 }}>
                Cash Counter
              </Text>
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800', marginTop: 2 }}>
                {formatCurrency(monthStats.cash, currencySymbol)}
              </Text>
            </View>

            <View style={{ flex: 1, backgroundColor: 'rgba(59, 130, 246, 0.25)', borderRadius: 14, padding: 10, alignItems: 'center' }}>
              <QrCode size={16} color="#93C5FD" />
              <Text style={{ color: '#93C5FD', fontSize: 10, fontWeight: '700', marginTop: 4 }}>
                UPI Received
              </Text>
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800', marginTop: 2 }}>
                {formatCurrency(monthStats.upi, currencySymbol)}
              </Text>
            </View>

            <View style={{ flex: 1, backgroundColor: 'rgba(168, 85, 247, 0.25)', borderRadius: 14, padding: 10, alignItems: 'center' }}>
              <CreditCard size={16} color="#E9D5FF" />
              <Text style={{ color: '#E9D5FF', fontSize: 10, fontWeight: '700', marginTop: 4 }}>
                Card Swipe POS
              </Text>
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800', marginTop: 2 }}>
                {formatCurrency(monthStats.swipe, currencySymbol)}
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Linked Workshop Accounts ({accounts.length})
            </Text>
            <TouchableOpacity onPress={() => router.push('/bank-accounts/add')}>
              <Text style={{ color: '#153580', fontSize: 13, fontWeight: '800' }}>
                + Link Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Account Cards */}
          <View style={{ gap: 12 }}>
            {accounts.map((acc) => {
              const breakdown = monthStats.accountBreakdown[acc.id] || { upi: 0, swipe: 0, total: 0 };
              const isCash = acc.accountType === 'CASH_IN_HAND';

              return (
                <View
                  key={acc.id}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 22,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: cardBorder,
                    shadowColor: '#000',
                    shadowOpacity: 0.03,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 21,
                          backgroundColor: isCash ? '#FEF3C7' : '#EFF6FF',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isCash ? (
                          <Banknote size={20} color="#D97706" />
                        ) : (
                          <Building2 size={20} color="#153580" />
                        )}
                      </View>
                      <View>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                          {acc.bankName}
                        </Text>
                        <Text style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', fontWeight: '600', marginTop: 1 }}>
                          {acc.accountName} {acc.accountNumber ? `• ${acc.accountNumber.slice(-4)}` : ''}
                        </Text>
                      </View>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 16, fontWeight: '900', color: '#10B981' }}>
                        {formatCurrency(isCash ? monthStats.cash : breakdown.total, currencySymbol)}
                      </Text>
                      <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '700', marginTop: 1 }}>
                        This Month Inward
                      </Text>
                    </View>
                  </View>

                  {!isCash && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingTop: 10,
                        borderTopWidth: 1,
                        borderTopColor: cardBorder,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <QrCode size={13} color="#3B82F6" />
                        <Text style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', fontWeight: '600' }}>
                          UPI: {formatCurrency(breakdown.upi, currencySymbol)}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <CreditCard size={13} color="#8B5CF6" />
                        <Text style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', fontWeight: '600' }}>
                          Swipe: {formatCurrency(breakdown.swipe, currencySymbol)}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
