// ============================================================
// Add Bank Account Screen — Sky Blue & Midnight Navy Luxury Layout
// Directly matching media_1790189780212.png & media_1790189816628.png
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
  ChevronLeft,
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

const POPULAR_BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra'];

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
    const entId = enterpriseId || 'enterprise-dev-001';
    const accId = `acc_${Date.now()}`;
    const balanceNum = parseFloat(openingBalance.replace(/[^0-9.]/g, '')) || 0;

    const newAcc: BankAccount = {
      id: accId,
      enterpriseId: entId,
      accountName: accountName.trim(),
      accountType,
      bankName: accountType === 'CASH_IN_HAND' ? 'Cash Counter' : bankName.trim(),
      accountNumber: accountType === 'CASH_IN_HAND' ? 'CASH' : accountNumber.trim(),
      ifscCode: '',
      openingBalance: balanceNum,
      currentBalance: balanceNum,
      isDefault: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      await setDoc(doc(db, 'enterprises', entId, 'bankAccounts', accId), newAcc);
    } catch (err) {
      console.log('[AddBankAccount] Firestore error:', err);
    }

    addAccount(newAcc);
    setLoading(false);
    Alert.alert('Account Linked', `"${newAcc.accountName}" has been successfully added to your garage ledger.`, [
      { text: 'Done', onPress: () => router.back() },
    ]);
  };

  const canvasBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#111622' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.06)';
  const primaryBtnBg = isDark ? '#FFFFFF' : '#0C1829';
  const primaryBtnText = isDark ? '#0C1829' : '#FFFFFF';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      {/* Sky Blue Header */}
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 24, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>Cancel</Text>
          </TouchableOpacity>

          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            Link Bank Account
          </Text>

          <View style={{ width: 60 }} />
        </View>

        {/* Central Bank Badge */}
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: isDark ? '#1C2538' : '#0C1829',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
        >
          <Building size={30} color="#FFFFFF" />
        </View>

        <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '900', letterSpacing: -0.3 }}>
          Workshop Liquidity
        </Text>
        <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 13, marginTop: 2 }}>
          Configure settlement gateway & cash drawer
        </Text>
      </View>

      {/* Crisp White Lower Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          paddingTop: 24,
          paddingHorizontal: 20,
          shadowColor: '#0C1829',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.4 : 0.06,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
          {/* Account Type Chips */}
          <View style={{ marginBottom: 18 }}>
            <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }}>
              Account Type
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {ACCOUNT_TYPES.map((t) => {
                const isSelected = accountType === t.value;
                const Icon = t.icon;
                return (
                  <TouchableOpacity
                    key={t.value}
                    onPress={() => setAccountType(t.value)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 20,
                      backgroundColor: isSelected ? primaryBtnBg : (isDark ? '#141926' : '#F8FAFD'),
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      borderWidth: 1,
                      borderColor: isSelected ? primaryBtnBg : cardBorder,
                    }}
                  >
                    <Icon size={16} color={isSelected ? primaryBtnText : (isDark ? '#FFFFFF' : '#0C1829')} />
                    <Text style={{ fontSize: 12, fontWeight: '800', color: isSelected ? primaryBtnText : (isDark ? '#FFFFFF' : '#0C1829') }}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Account Nickname */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }}>
              Account Nickname
            </Text>
            <TextInput
              value={accountName}
              onChangeText={setAccountName}
              placeholder="e.g. Primary HDFC Current"
              placeholderTextColor="#94A3B8"
              style={{
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 22,
                backgroundColor: isDark ? '#141926' : '#F8FAFD',
                borderWidth: 1,
                borderColor: cardBorder,
                color: isDark ? '#FFFFFF' : '#0C1829',
                fontSize: 15,
                fontWeight: '600',
              }}
            />
          </View>

          {accountType !== 'CASH_IN_HAND' && (
            <>
              {/* Bank Name Selector */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }}>
                  Bank Name
                </Text>
                <TextInput
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="Select or enter bank name"
                  placeholderTextColor="#94A3B8"
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 22,
                    backgroundColor: isDark ? '#141926' : '#F8FAFD',
                    borderWidth: 1,
                    borderColor: cardBorder,
                    color: isDark ? '#FFFFFF' : '#0C1829',
                    fontSize: 15,
                    fontWeight: '600',
                    marginBottom: 8,
                  }}
                />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {POPULAR_BANKS.map((b) => (
                    <TouchableOpacity
                      key={b}
                      onPress={() => setBankName(b)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 14,
                        backgroundColor: bankName === b ? primaryBtnBg : (isDark ? '#182030' : '#F1F5F9'),
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '700', color: bankName === b ? primaryBtnText : '#64748B' }}>
                        {b}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Account Number */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }}>
                  Account Number
                </Text>
                <TextInput
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="e.g. 50200012345678"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 22,
                    backgroundColor: isDark ? '#141926' : '#F8FAFD',
                    borderWidth: 1,
                    borderColor: cardBorder,
                    color: isDark ? '#FFFFFF' : '#0C1829',
                    fontSize: 15,
                    fontWeight: '600',
                  }}
                />
              </View>
            </>
          )}

          {/* Initial Opening Balance */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }}>
              Opening Balance ({currencySymbol})
            </Text>
            <TextInput
              value={openingBalance}
              onChangeText={setOpeningBalance}
              placeholder="0.00"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
              style={{
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 22,
                backgroundColor: isDark ? '#141926' : '#F8FAFD',
                borderWidth: 1,
                borderColor: cardBorder,
                color: isDark ? '#FFFFFF' : '#0C1829',
                fontSize: 15,
                fontWeight: '700',
              }}
            />
          </View>

          {/* Solid Midnight Navy CTA Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.88}
            style={{
              backgroundColor: primaryBtnBg,
              paddingVertical: 18,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#0C1829',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            {loading ? (
              <ActivityIndicator color={primaryBtnText} />
            ) : (
              <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
                Save Account
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
