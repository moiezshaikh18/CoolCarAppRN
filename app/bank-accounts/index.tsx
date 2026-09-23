// ============================================================
// Bank Accounts Screen — Rules 11, 12, 16, 17
// Liquid Funds Overview, Cash Counter & Bank Accounts
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Plus,
  Landmark,
  Wallet,
  Building,
  ShieldCheck,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { formatCurrency } from '../../src/utils/currency';
import { BankAccount } from '../../src/types/bankAccount.types';

export default function BankAccountsScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { accounts, setAccounts } = useBankAccountStore();

  // Real-time Firestore sync
  useEffect(() => {
    const entId = enterpriseId || 'enterprise-dev-001';
    let unsubscribe: () => void;

    async function subscribeAccounts() {
      try {
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');
        const accsRef = collection(db, 'enterprises', entId, 'bankAccounts');

        unsubscribe = onSnapshot(
          accsRef,
          (snapshot) => {
            const list: BankAccount[] = [];
            snapshot.forEach((doc) => {
              list.push({ id: doc.id, ...(doc.data() as any) });
            });
            if (list.length > 0) {
              setAccounts(list);
            }
          },
          (err) => {
            console.log('[BankAccounts] listener error:', err);
          }
        );
      } catch (err) {
        console.log('[BankAccounts] setup error:', err);
      }
    }

    subscribeAccounts();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [enterpriseId]);

  const totalLiquidFunds = accounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);
  const cashAccounts = accounts.filter((a) => a.accountType === 'CASH_IN_HAND');
  const bankAccounts = accounts.filter((a) => a.accountType !== 'CASH_IN_HAND');

  const totalCash = cashAccounts.reduce((sum, a) => sum + (a.currentBalance || 0), 0);
  const totalBank = bankAccounts.reduce((sum, a) => sum + (a.currentBalance || 0), 0);

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
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
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
              Banking & Cash
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
              Liquid funds & registers
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/bank-accounts/add')}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? '#FFFFFF' : '#121214',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Total Liquid Funds Obsidian Hero Card (Nestora centerpiece) */}
        <View style={{ paddingHorizontal: 22, marginBottom: 20 }}>
          <View
            style={{
              borderRadius: 28,
              padding: 24,
              backgroundColor: isDark ? '#FFFFFF' : '#121214',
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ color: isDark ? '#4B5563' : '#9CA3AF', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Total Liquid Assets
              </Text>
              <ShieldCheck size={20} color={isDark ? '#121214' : '#FFFFFF'} />
            </View>

            <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: -0.5, marginBottom: 20 }}>
              {formatCurrency(totalLiquidFunds, currencySymbol)}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Cash in Hand Sub-stat */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: isDark ? '#F3F4F6' : '#1E2430',
                  borderRadius: 18,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                }}
              >
                <Text style={{ color: isDark ? '#6B7280' : '#9CA3AF', fontSize: 11, fontWeight: '700' }}>
                  Cash in Hand
                </Text>
                <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800', marginTop: 2 }}>
                  {formatCurrency(totalCash, currencySymbol)}
                </Text>
              </View>

              {/* Bank Balances Sub-stat */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: isDark ? '#F3F4F6' : '#1E2430',
                  borderRadius: 18,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                }}
              >
                <Text style={{ color: isDark ? '#6B7280' : '#9CA3AF', fontSize: 11, fontWeight: '700' }}>
                  Bank Balance
                </Text>
                <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800', marginTop: 2 }}>
                  {formatCurrency(totalBank, currencySymbol)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 1: Cash in Hand (Counter) */}
        <View style={{ paddingHorizontal: 22, marginBottom: 20 }}>
          <Text
            style={{
              color: theme.textMuted,
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 10,
              paddingLeft: 4,
            }}
          >
            Cash Counter Registers (Rules 7 & 11)
          </Text>

          {cashAccounts.map((cash) => (
            <GlassCard
              key={cash.id}
              variant="sand"
              padding={18}
              style={{ borderRadius: 28, marginBottom: 12 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    }}
                  >
                    <Wallet size={22} color={theme.text} />
                  </View>
                  <View>
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                      {cash.accountName}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: isDark ? '#34D399' : '#15803D',
                        }}
                      />
                      <Text style={{ color: isDark ? '#34D399' : '#15803D', fontSize: 12, fontWeight: '700' }}>
                        Physical Drawer
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>
                    Balance
                  </Text>
                  <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginTop: 2 }}>
                    {formatCurrency(cash.currentBalance || 0, currencySymbol)}
                  </Text>
                </View>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Section 2: Bank Accounts (UPI & Card destinations) */}
        <View style={{ paddingHorizontal: 22 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingHorizontal: 4 }}>
            <Text
              style={{
                color: theme.textMuted,
                fontSize: 12,
                fontWeight: '700',
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              }}
            >
              Linked Bank Accounts ({bankAccounts.length})
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>
              UPI & POS Settled
            </Text>
          </View>

          {bankAccounts.length === 0 ? (
            <GlassCard variant="sand" padding={24} style={{ borderRadius: 28, alignItems: 'center', gap: 10 }}>
              <Landmark size={36} color={theme.textMuted} />
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
                No Bank Accounts Linked
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 13, textAlign: 'center' }}>
                Link your HDFC, ICICI, SBI or Current accounts to track UPI and Card settlements
              </Text>
            </GlassCard>
          ) : (
            bankAccounts.map((bank) => (
              <GlassCard
                key={bank.id}
                variant="sand"
                padding={18}
                style={{ borderRadius: 28, marginBottom: 12 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                      }}
                    >
                      <Building size={22} color={theme.text} />
                    </View>
                    <View>
                      <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                        {bank.bankName || bank.accountName}
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 3 }}>
                        {bank.accountType} • A/C {bank.accountNumberMasked || '••••1234'}
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>
                      Balance
                    </Text>
                    <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginTop: 2 }}>
                      {formatCurrency(bank.currentBalance || 0, currencySymbol)}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Floating Pill CTA Button */}
      <View style={{ position: 'absolute', bottom: 24, left: 22, right: 22 }}>
        <TouchableOpacity
          onPress={() => router.push('/bank-accounts/add')}
          activeOpacity={0.88}
          style={{
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
          <Plus size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
          <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            Link New Bank Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
