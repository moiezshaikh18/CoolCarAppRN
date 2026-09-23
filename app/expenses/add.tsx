// ============================================================
// Add New Entry Screen — Income & Expense Ledger
// Strict Master Business Rules (UPI/Card requires bank account)
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ChevronDown,
  Building,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { router, useLocalSearchParams } from 'expo-router';
import { PaymentMode } from '../../src/types/payment.types';

const CATEGORIES_INCOME = [
  'Service Income',
  'Spare Parts Sale',
  'Car Wash & Detailing',
  'Consulting / Inspection',
  'Other Income',
];

const CATEGORIES_EXPENSE = [
  'Shop Rent',
  'Electricity Bill',
  'Salary',
  'Tools & Equipment',
  'Oil & Lubricants',
  'Parts & Material',
  'Tea & Snacks',
  'Miscellaneous',
];

const SAMPLE_CUSTOMERS = [
  'Ramesh Kumar',
  'Ajay Singh',
  'Neha Sharma',
  'Rahul Verma',
  'Pooja Mehta',
];

const BANK_ACCOUNTS = [
  { id: 'bank-1', name: 'HDFC Bank - 8923' },
  { id: 'bank-2', name: 'ICICI Bank - 4401' },
  { id: 'bank-3', name: 'State Bank of India - 1092' },
  { id: 'bank-4', name: 'Axis Bank - 7721' },
];

export default function AddNewEntryScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ type?: string }>();

  const [entryType, setEntryType] = useState<'income' | 'expense'>(
    params.type === 'income' ? 'income' : 'expense'
  );
  const [amount, setAmount] = useState('5000');
  const [selectedCategory, setSelectedCategory] = useState(
    params.type === 'income' ? 'Service Income' : 'Parts & Material'
  );
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [selectedBankId, setSelectedBankId] = useState(BANK_ACCOUNTS[0].id);
  const [selectedCustomer, setSelectedCustomer] = useState('Ramesh Kumar');
  const [note, setNote] = useState('Full service charge');

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);

  const categories = entryType === 'income' ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;

  const handleSave = () => {
    const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    if ((paymentMode === 'UPI' || paymentMode === 'CARD_SWIPE') && !selectedBankId) {
      Alert.alert('Bank Account Required', 'UPI and Card Swipe require selecting a bank account.');
      return;
    }

    Alert.alert(
      'Entry Saved',
      `Successfully recorded ${entryType === 'income' ? 'Income' : 'Expense'} of ${currencySymbol}${num} via ${paymentMode}!`,
      [{ text: 'OK', onPress: () => router.back() }]
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
            Add Transaction
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
            Record cashflow or workshop expense
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 110 }}
      >
        {/* Income / Expense Segmented Capsule */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: isDark ? '#1C212B' : '#EFECE6',
            borderRadius: 30,
            padding: 4,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setEntryType('income');
              setSelectedCategory(CATEGORIES_INCOME[0]);
            }}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: 'center',
              borderRadius: 26,
              backgroundColor: entryType === 'income' ? (isDark ? '#FFFFFF' : '#121214') : 'transparent',
            }}
          >
            <Text
              style={{
                color: entryType === 'income' ? (isDark ? '#121214' : '#FFFFFF') : theme.textMuted,
                fontSize: 14,
                fontWeight: '700',
              }}
            >
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEntryType('expense');
              setSelectedCategory(CATEGORIES_EXPENSE[0]);
            }}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: 'center',
              borderRadius: 26,
              backgroundColor: entryType === 'expense' ? (isDark ? '#FFFFFF' : '#121214') : 'transparent',
            }}
          >
            <Text
              style={{
                color: entryType === 'expense' ? (isDark ? '#121214' : '#FFFFFF') : theme.textMuted,
                fontSize: 14,
                fontWeight: '700',
              }}
            >
              Expense
            </Text>
          </TouchableOpacity>
        </View>

        {/* Large Amount Display Card in Warm Sand */}
        <GlassCard
          variant="sand"
          padding={24}
          style={{
            borderRadius: 28,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
            Amount ({currencySymbol})
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Text style={{ color: theme.text, fontSize: 32, fontWeight: '800', marginRight: 4 }}>
              {currencySymbol}
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={{
                color: theme.text,
                fontSize: 36,
                fontWeight: '900',
                minWidth: 140,
                textAlign: 'center',
                letterSpacing: -0.5,
              }}
            />
          </View>
        </GlassCard>

        {/* Form Fields Card in Warm Sand */}
        <GlassCard variant="sand" padding={22} style={{ borderRadius: 28, gap: 16 }}>
          {/* Category Picker */}
          <View>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
              CATEGORY
            </Text>
            <TouchableOpacity
              onPress={() => setCategoryModalOpen(!categoryModalOpen)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                borderRadius: 20,
                paddingHorizontal: 16,
                height: 54,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
            >
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                {selectedCategory}
              </Text>
              <ChevronDown size={18} color={theme.textMuted} />
            </TouchableOpacity>

            {categoryModalOpen && (
              <View
                style={{
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  marginTop: 6,
                  padding: 8,
                  gap: 4,
                }}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setCategoryModalOpen(false);
                    }}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      borderRadius: 14,
                      backgroundColor: selectedCategory === cat ? (isDark ? '#1C212B' : '#EFECE6') : 'transparent',
                    }}
                  >
                    <Text style={{ color: theme.text, fontWeight: selectedCategory === cat ? '800' : '600' }}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Payment Mode (Cash, UPI, Card Swipe) — Rules 7, 8, 9, 10 */}
          <View>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
              PAYMENT METHOD
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {(['CASH', 'UPI', 'CARD_SWIPE'] as PaymentMode[]).map((mode) => {
                const label = mode === 'CASH' ? 'Cash' : mode === 'UPI' ? 'UPI' : 'Card Swipe';
                const isSelected = paymentMode === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => setPaymentMode(mode)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 18,
                      alignItems: 'center',
                      backgroundColor: isSelected ? (isDark ? '#FFFFFF' : '#121214') : (isDark ? '#252B38' : '#FFFFFF'),
                      borderWidth: 1,
                      borderColor: isSelected ? (isDark ? '#FFFFFF' : '#121214') : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? (isDark ? '#121214' : '#FFFFFF') : theme.text,
                        fontSize: 13,
                        fontWeight: '700',
                      }}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Bank Account Selector (Mandatory for UPI and Card Swipe) */}
          {paymentMode !== 'CASH' ? (
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                LINKED BANK ACCOUNT * (REQUIRED FOR {paymentMode})
              </Text>
              <TouchableOpacity
                onPress={() => setBankModalOpen(!bankModalOpen)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  height: 54,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Building size={16} color={theme.text} />
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>
                    {BANK_ACCOUNTS.find((b) => b.id === selectedBankId)?.name}
                  </Text>
                </View>
                <ChevronDown size={18} color={theme.textMuted} />
              </TouchableOpacity>

              {bankModalOpen && (
                <View
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    marginTop: 6,
                    padding: 8,
                    gap: 4,
                  }}
                >
                  {BANK_ACCOUNTS.map((bank) => (
                    <TouchableOpacity
                      key={bank.id}
                      onPress={() => {
                        setSelectedBankId(bank.id);
                        setBankModalOpen(false);
                      }}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        borderRadius: 14,
                        backgroundColor: selectedBankId === bank.id ? (isDark ? '#1C212B' : '#EFECE6') : 'transparent',
                      }}
                    >
                      <Text style={{ color: theme.text, fontWeight: selectedBankId === bank.id ? '800' : '600' }}>
                        {bank.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View
              style={{
                padding: 14,
                borderRadius: 18,
                backgroundColor: isDark ? '#064E3B' : '#DCFCE7',
              }}
            >
              <Text style={{ color: isDark ? '#6EE7B7' : '#15803D', fontSize: 12, fontWeight: '700' }}>
                ✓ Cash In Hand Selected — Direct Cash Counter Ledger (RULE 10)
              </Text>
            </View>
          )}

          {/* Customer (Optional) */}
          <View>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
              CUSTOMER (OPTIONAL)
            </Text>
            <TouchableOpacity
              onPress={() => setCustomerModalOpen(!customerModalOpen)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                borderRadius: 20,
                paddingHorizontal: 16,
                height: 54,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
            >
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                {selectedCustomer}
              </Text>
              <ChevronDown size={18} color={theme.textMuted} />
            </TouchableOpacity>

            {customerModalOpen && (
              <View
                style={{
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  marginTop: 6,
                  padding: 8,
                  gap: 4,
                }}
              >
                {SAMPLE_CUSTOMERS.map((cust) => (
                  <TouchableOpacity
                    key={cust}
                    onPress={() => {
                      setSelectedCustomer(cust);
                      setCustomerModalOpen(false);
                    }}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      borderRadius: 14,
                      backgroundColor: selectedCustomer === cust ? (isDark ? '#1C212B' : '#EFECE6') : 'transparent',
                    }}
                  >
                    <Text style={{ color: theme.text, fontWeight: selectedCustomer === cust ? '800' : '600' }}>
                      {cust}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Note (Optional) */}
          <View>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
              NOTE / REMARKS
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Full service charge"
              placeholderTextColor={theme.textMuted}
              style={{
                backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                borderRadius: 20,
                paddingHorizontal: 16,
                height: 54,
                color: theme.text,
                fontSize: 15,
                fontWeight: '600',
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
            />
          </View>
        </GlassCard>

        {/* Solid Obsidian Black Pill Submit Button */}
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.88}
          style={{
            marginTop: 22,
            backgroundColor: isDark ? '#FFFFFF' : '#121214',
            paddingVertical: 18,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            Save Entry
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
