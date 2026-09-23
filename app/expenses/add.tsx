// ============================================================
// Add New Entry Screen — Income & Expense Ledger
// Strict Master Business Rules (UPI/Card requires bank account)
// Sky Blue & Midnight Navy Luxury Aesthetic (media_1790189780212.png)
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronDown,
  Building,
  Check,
  Plus,
  Minus,
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
  const [note, setNote] = useState('Full service charge');

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [bankModalOpen, setBankModalOpen] = useState(false);

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
      'Entry Recorded',
      `Successfully logged ${entryType === 'income' ? 'Income' : 'Expense'} of ${currencySymbol}${num} via ${paymentMode}!`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const canvasBg = isDark ? '#070A0F' : '#6B9FE8';
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
            New Transaction
          </Text>

          <View style={{ width: 60 }} />
        </View>

        {/* Income / Expense Capsule Switcher */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.22)',
            borderRadius: 24,
            padding: 4,
            width: 220,
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
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: entryType === 'income' ? '#FFFFFF' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: entryType === 'income' ? '#0C1829' : '#FFFFFF',
                fontSize: 13,
                fontWeight: '800',
              }}
            >
              Inflow
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setEntryType('expense');
              setSelectedCategory(CATEGORIES_EXPENSE[0]);
            }}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: entryType === 'expense' ? '#FFFFFF' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: entryType === 'expense' ? '#0C1829' : '#FFFFFF',
                fontSize: 13,
                fontWeight: '800',
              }}
            >
              Expense
            </Text>
          </TouchableOpacity>
        </View>

        {/* Big Amount Typography Input */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 32, fontWeight: '800', marginRight: 4 }}>
            {currencySymbol}
          </Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            style={{
              color: '#FFFFFF',
              fontSize: 44,
              fontWeight: '900',
              letterSpacing: -1,
              textAlign: 'center',
              minWidth: 120,
            }}
          />
        </View>
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
          {/* Category Dropdown Pill */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }}>
              Category
            </Text>
            <TouchableOpacity
              onPress={() => setCategoryModalOpen(true)}
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
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 15, fontWeight: '800' }}>
                {selectedCategory}
              </Text>
              <ChevronDown size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Payment Mode Selection Chips */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }}>
              Payment Mode
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {(['CASH', 'UPI', 'CARD_SWIPE'] as PaymentMode[]).map((mode) => {
                const isSelected = paymentMode === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => setPaymentMode(mode)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 20,
                      backgroundColor: isSelected ? primaryBtnBg : (isDark ? '#141926' : '#F8FAFD'),
                      borderWidth: 1,
                      borderColor: isSelected ? primaryBtnBg : cardBorder,
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? primaryBtnText : (isDark ? '#FFFFFF' : '#0C1829'),
                        fontSize: 12,
                        fontWeight: '800',
                      }}
                    >
                      {mode === 'CARD_SWIPE' ? 'Card Swipe' : mode}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Bank Account Selection (when UPI or CARD) */}
          {(paymentMode === 'UPI' || paymentMode === 'CARD_SWIPE') && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }}>
                Receiving / Paying Bank Account
              </Text>
              <TouchableOpacity
                onPress={() => setBankModalOpen(true)}
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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Building size={16} color="#64748B" />
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 15, fontWeight: '800' }}>
                    {BANK_ACCOUNTS.find((b) => b.id === selectedBankId)?.name || 'Select Bank'}
                  </Text>
                </View>
                <ChevronDown size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          )}

          {/* Remarks Note */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' }}>
              Note / Description
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Engine oil 4L purchase bill"
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

          {/* Submit Solid Midnight Navy Button */}
          <TouchableOpacity
            onPress={handleSave}
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
            <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
              Save {entryType === 'income' ? 'Income' : 'Expense'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Category Modal */}
      <Modal visible={categoryModalOpen} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: sheetBg, borderTopLeftRadius: 36, borderTopRightRadius: 36, padding: 24, gap: 10 }}>
            <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 18, fontWeight: '800', marginBottom: 10 }}>
              Select Category
            </Text>
            {categories.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => {
                  setSelectedCategory(c);
                  setCategoryModalOpen(false);
                }}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: selectedCategory === c ? (isDark ? '#1C2538' : '#F4F7FC') : 'transparent',
                }}
              >
                <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 15, fontWeight: selectedCategory === c ? '800' : '600' }}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Bank Modal */}
      <Modal visible={bankModalOpen} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: sheetBg, borderTopLeftRadius: 36, borderTopRightRadius: 36, padding: 24, gap: 10 }}>
            <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 18, fontWeight: '800', marginBottom: 10 }}>
              Select Bank Account
            </Text>
            {BANK_ACCOUNTS.map((b) => (
              <TouchableOpacity
                key={b.id}
                onPress={() => {
                  setSelectedBankId(b.id);
                  setBankModalOpen(false);
                }}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: selectedBankId === b.id ? (isDark ? '#1C2538' : '#F4F7FC') : 'transparent',
                }}
              >
                <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 15, fontWeight: selectedBankId === b.id ? '800' : '600' }}>
                  {b.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}
