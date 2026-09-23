// ============================================================
// Add Bank Account Screen — Link Bank or Register Cash Counter
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Building,
  CreditCard,
  Wallet,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { AccountType, BankAccount } from '../../src/types/bankAccount.types';

const ACCOUNT_TYPES: { label: string; value: AccountType; icon: any }[] = [
  { label: 'Current A/c', value: 'CURRENT', icon: Building },
  { label: 'Savings A/c', value: 'SAVINGS', icon: CreditCard },
  { label: 'Cash in Hand', value: 'CASH_IN_HAND', icon: Wallet },
];

const POPULAR_BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'];

export default function AddBankAccountScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { addAccount } = useBankAccountStore();

  const [accountType, setAccountType] = useState<AccountType>('CURRENT');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!accountName.trim()) {
      Alert.alert('Required', 'Please enter an account name (e.g. Primary Current Account)');
      return;
    }

    if (accountType !== 'CASH_IN_HAND' && !bankName.trim()) {
      Alert.alert('Required', 'Please enter or select a bank name');
      return;
    }

    setLoading(true);
    const newAccId = `acc-${Date.now()}`;
    const entId = enterpriseId || 'enterprise-dev-001';
    const balanceNum = parseFloat(openingBalance) || 0;

    let masked = undefined;
    if (accountNumber.trim()) {
      const cleanNum = accountNumber.replace(/\s/g, '');
      masked = `****${cleanNum.slice(-4)}`;
    }

    const accountObj: BankAccount = {
      id: newAccId,
      enterpriseId: entId,
      accountName: accountName.trim(),
      bankName: accountType === 'CASH_IN_HAND' ? undefined : bankName.trim(),
      accountNumberMasked: masked,
      accountType,
      openingBalance: balanceNum,
      currentBalance: balanceNum,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      const accRef = doc(db, 'enterprises', entId, 'bankAccounts', newAccId);
      await setDoc(accRef, accountObj);
    } catch (err) {
      console.log('[AddBankAccount] Firestore sync error/offline:', err);
    }

    addAccount(accountObj);
    setLoading(false);

    Alert.alert('Success', 'Account added successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Symmetrical Top Header */}
        <View
          style={{
            paddingTop: insets.top + 14,
            paddingHorizontal: 22,
            paddingBottom: 20,
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
              Add Account
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
              Link bank or register cash drawer
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, gap: 18 }}>
          {/* Account Type Selector in Warm Sand */}
          <GlassCard variant="sand" padding={20} style={{ borderRadius: 28, gap: 12 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
              ACCOUNT TYPE *
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {ACCOUNT_TYPES.map((type) => {
                const isSelected = accountType === type.value;
                const Icon = type.icon;
                return (
                  <TouchableOpacity
                    key={type.value}
                    onPress={() => {
                      setAccountType(type.value);
                      if (type.value === 'CASH_IN_HAND' && !accountName) {
                        setAccountName('Counter Cash Drawer');
                      }
                    }}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      paddingHorizontal: 8,
                      borderRadius: 20,
                      alignItems: 'center',
                      backgroundColor: isSelected
                        ? (isDark ? '#FFFFFF' : '#121214')
                        : (isDark ? '#252B38' : '#FFFFFF'),
                      borderWidth: 1,
                      borderColor: isSelected ? (isDark ? '#FFFFFF' : '#121214') : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                      gap: 6,
                    }}
                  >
                    <Icon size={20} color={isSelected ? (isDark ? '#121214' : '#FFFFFF') : theme.text} />
                    <Text
                      style={{
                        color: isSelected ? (isDark ? '#121214' : '#FFFFFF') : theme.text,
                        fontSize: 12,
                        fontWeight: '700',
                        textAlign: 'center',
                      }}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlassCard>

          {/* Form Fields in Warm Sand */}
          <GlassCard variant="sand" padding={22} style={{ borderRadius: 28, gap: 16 }}>
            {/* Account Name */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                ACCOUNT NAME *
              </Text>
              <TextInput
                value={accountName}
                onChangeText={setAccountName}
                placeholder={
                  accountType === 'CASH_IN_HAND'
                    ? 'e.g. Counter Cash Drawer'
                    : 'e.g. HDFC Main Workshop A/c'
                }
                placeholderTextColor={theme.textMuted}
                style={{
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  paddingHorizontal: 16,
                  height: 54,
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: '600',
                }}
              />
            </View>

            {/* Bank Name (only if not Cash) */}
            {accountType !== 'CASH_IN_HAND' && (
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  BANK NAME *
                </Text>
                <TextInput
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="e.g. HDFC Bank, ICICI Bank"
                  placeholderTextColor={theme.textMuted}
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    paddingHorizontal: 16,
                    height: 54,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                  }}
                />

                {/* Popular Banks chips */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, marginTop: 10 }}
                >
                  {POPULAR_BANKS.map((b) => (
                    <TouchableOpacity
                      key={b}
                      onPress={() => setBankName(b)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 16,
                        backgroundColor:
                          bankName === b
                            ? (isDark ? '#FFFFFF' : '#121214')
                            : (isDark ? '#252B38' : '#FFFFFF'),
                      }}
                    >
                      <Text
                        style={{
                          color: bankName === b ? (isDark ? '#121214' : '#FFFFFF') : theme.textSecondary,
                          fontSize: 12,
                          fontWeight: '700',
                        }}
                      >
                        {b}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Account Number (only if not Cash) */}
            {accountType !== 'CASH_IN_HAND' && (
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  ACCOUNT NUMBER (OPTIONAL / MASKED)
                </Text>
                <TextInput
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="e.g. 50200012345678"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    paddingHorizontal: 16,
                    height: 54,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                  }}
                />
              </View>
            )}

            {/* Opening Balance */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                OPENING BALANCE ({currencySymbol})
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  paddingHorizontal: 16,
                  height: 54,
                }}
              >
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginRight: 8 }}>
                  {currencySymbol}
                </Text>
                <TextInput
                  value={openingBalance}
                  onChangeText={setOpeningBalance}
                  placeholder="0.00"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={{ flex: 1, color: theme.text, fontSize: 17, fontWeight: '800' }}
                />
              </View>
            </View>
          </GlassCard>

          {/* Solid Obsidian Black Pill Submit Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
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
            {loading ? (
              <ActivityIndicator color={isDark ? '#121214' : '#FFFFFF'} />
            ) : (
              <>
                <Check size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
                <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                  Save Account
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
