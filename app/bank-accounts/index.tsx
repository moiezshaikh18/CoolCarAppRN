// ============================================================
// Bank Accounts Screen — Sky Blue & Midnight Navy Luxury Layout
// Directly matching media_1790189780212.png & media_1790189816628.png
// ============================================================

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Plus,
  Landmark,
  Wallet,
  Building,
  CheckCircle2,
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
            if (!snapshot.empty) {
              const fetched: BankAccount[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  id: doc.id,
                  enterpriseId: data.enterpriseId,
                  accountName: data.accountName,
                  accountType: data.accountType,
                  bankName: data.bankName,
                  accountNumber: data.accountNumber,
                  ifscCode: data.ifscCode,
                  openingBalance: Number(data.openingBalance) || 0,
                  currentBalance: Number(data.currentBalance) || 0,
                  isDefault: Boolean(data.isDefault),
                  isActive: Boolean(data.isActive ?? true),
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                };
              });
              setAccounts(fetched);
            }
          },
          (err) => console.log('[BankAccounts] snapshot error:', err)
        );
      } catch (err) {
        console.log('[BankAccounts] setup error:', err);
      }
    }

    subscribeAccounts();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [enterpriseId, setAccounts]);

  const totalBankBalance = accounts.reduce((acc, a) => acc + a.currentBalance, 0);
  const cashCounterBalance = 24350;
  const totalLiquid = totalBankBalance + cashCounterBalance;

  const canvasBg = isDark ? '#070A0F' : '#6B9FE8';
  const sheetBg = isDark ? '#111622' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.06)';
  const primaryBtnBg = isDark ? '#FFFFFF' : '#0C1829';
  const primaryBtnText = isDark ? '#0C1829' : '#FFFFFF';

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
              Bank & Cash
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/bank-accounts/add')}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Featured Midnight Navy Total Liquidity Card */}
          <GlassCard
            variant="navy"
            padding={22}
            style={{ borderRadius: 30, marginBottom: 6 }}
          >
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 13, fontWeight: '600' }}>
              Total Workshop Liquidity
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1, marginTop: 8 }}>
              {formatCurrency(totalLiquid, currencySymbol)}
            </Text>

            {/* Inflow Sub-stats row */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: 18,
                  padding: 12,
                }}
              >
                <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 11, fontWeight: '700' }}>
                  Cash Counter
                </Text>
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginTop: 2 }}>
                  {formatCurrency(cashCounterBalance, currencySymbol)}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: 18,
                  padding: 12,
                }}
              >
                <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 11, fontWeight: '700' }}>
                  Bank Balance
                </Text>
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginTop: 2 }}>
                  {formatCurrency(totalBankBalance, currencySymbol)}
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
          {/* Section Heading */}
          <Text
            style={{
              color: '#64748B',
              fontSize: 12,
              fontWeight: '800',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 16,
              marginLeft: 4,
            }}
          >
            Accounts & Gateways ({accounts.length + 1})
          </Text>

          <View style={{ gap: 12 }}>
            {/* Cash Counter Entry */}
            <View
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
                  <Wallet size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                    Cash Register Counter
                  </Text>
                  <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                    On-Site Workshop Drawer
                  </Text>
                </View>
              </View>

              <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                {formatCurrency(cashCounterBalance, currencySymbol)}
              </Text>
            </View>

            {/* Bank Accounts */}
            {accounts.map((acc) => (
              <View
                key={acc.id}
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
                    <Landmark size={20} color="#FFFFFF" />
                  </View>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                        {acc.accountName}
                      </Text>
                      {acc.isDefault && (
                        <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, backgroundColor: 'rgba(0,200,150,0.15)' }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: '#00C896' }}>Primary</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                      {acc.bankName} •••• {(acc.accountNumber || acc.accountNumberMasked || '0000').slice(-4)}
                    </Text>
                  </View>
                </View>

                <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  {formatCurrency(acc.currentBalance, currencySymbol)}
                </Text>
              </View>
            ))}
          </View>

          {/* Add Account CTA */}
          <TouchableOpacity
            onPress={() => router.push('/bank-accounts/add')}
            activeOpacity={0.88}
            style={{
              backgroundColor: primaryBtnBg,
              paddingVertical: 18,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 24,
              shadowColor: '#0C1829',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
              + Add Bank Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
