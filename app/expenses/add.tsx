// ============================================================
// Screen 8: Expense Entry — Add Daily Expense
// Directly matching Screen 8 in Reference Design Mockup
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Wallet, ChevronDown, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useExpenseStore } from '../../src/store/expenseStore';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { ThemedAlert, ThemedAlertProps } from '../../src/components/common/ThemedAlert';
import { PaymentMode } from '../../src/types/payment.types';

const CATEGORIES = [
  'Shop Rent',
  'Electricity Bill',
  'Salary',
  'Tools & Equipment',
  'Tea & Snacks',
  'Hardware & Fasteners',
  'Nitrogen & Gases',
  'Lubricants & Oil',
  'Miscellaneous',
];

const PAYMENT_MODES: { label: string; value: PaymentMode }[] = [
  { label: 'Cash', value: 'CASH' },
  { label: 'UPI', value: 'UPI' },
  { label: 'Card Swipe', value: 'CARD_SWIPE' },
];

export default function AddExpenseScreen() {
  const { isDark } = useTheme();
  const { currencySymbol, enterpriseId } = useEnterprise();
  const insets = useSafeAreaInsets();

  const { addExpense } = useExpenseStore();
  const rawEmployees = useEmployeeStore((s) => s.employees);
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const rawAccounts = useBankAccountStore((s) => s.accounts);
  const accounts = Array.isArray(rawAccounts) ? rawAccounts : [];
  const debitAccount = useBankAccountStore((s) => s.debitAccount);

  const [amount, setAmount] = useState('2350');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);

  const [note, setNote] = useState('');
  const [alertConfig, setAlertConfig] = useState<ThemedAlertProps>({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = (
    title: string,
    message: string,
    type: 'error' | 'warning' | 'success' | 'info' = 'warning',
    buttons?: any[]
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      buttons: buttons || [{ text: 'OK', style: 'default' }],
      onClose: () => setAlertConfig((prev) => ({ ...prev, visible: false })),
    });
  };

  const handleSave = () => {
    const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num <= 0) {
      showAlert('Amount Required', 'Please enter a valid expense amount.', 'warning');
      return;
    }

    const defaultAccount = accounts[0];
    if (defaultAccount) {
      debitAccount(defaultAccount.id, num);
    }

    const entId = enterpriseId || 'enterprise-cool-car';
    const expenseId = `exp-${Date.now()}`;
    const dateStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newExpense = {
      id: expenseId,
      enterpriseId: entId,
      categoryId: `cat-${category.toLowerCase().replace(/\s+/g, '-')}`,
      categoryName: category,
      amount: num,
      paymentMode,
      paymentAccountId: defaultAccount?.id || 'bank-cash',
      paymentAccountName: defaultAccount?.accountName || 'Cash Drawer',
      date: dateStr,
      time: timeStr,
      spentBy: employees[0]?.name || 'Workshop Staff',
      description: `${category}${note ? ` (${note})` : ''}`,
      voided: false,
      createdBy: 'Cool Car Manager',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addExpense(newExpense);

    import('firebase/firestore').then(async ({ doc, setDoc }) => {
      try {
        const { db } = await import('../../src/services/firebase/firebase.config');
        await setDoc(doc(db, 'enterprises', entId, 'expenses', expenseId), newExpense);
      } catch (err) {
        console.log('[AddExpense] Firestore sync error:', err);
      }
    }).catch(() => {});

    showAlert(
      'Expense Saved!',
      `Recorded ${currencySymbol}${num} under ${category}`,
      'success',
      [{ text: 'Done', style: 'default', onPress: () => router.back() }]
    );
  };

  const bg = isDark ? '#0C1829' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';
  const inputBg = isDark ? '#111E33' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: bg }}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Top Header matching Screen 8 */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{ width: 40, height: 40, justifyContent: 'center' }}
        >
          <ArrowLeft size={22} color={textPrimary} strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary }}>
          Expense Entry
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: 24,
          paddingBottom: insets.bottom + 90,
        }}
      >
        {/* Top Center Round Navy Icon Container */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <View
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              backgroundColor: '#0C1829',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#0C1829',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            <Wallet size={24} color="#FFFFFF" strokeWidth={2.2} />
          </View>
        </View>

        {/* Input Fields matching Screen 8 */}
        <View style={{ gap: 20 }}>
          {/* Amount Field */}
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary, marginBottom: 8 }}>
              Amount
            </Text>
            <View
              style={{
                height: 54,
                backgroundColor: inputBg,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: borderColor,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary, marginRight: 6 }}>
                {currencySymbol}
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                style={{ flex: 1, fontSize: 16, fontWeight: '700', color: textPrimary }}
              />
            </View>
          </View>

          {/* Category Dropdown Field */}
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary, marginBottom: 8 }}>
              Category
            </Text>
            <TouchableOpacity
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              activeOpacity={0.8}
              style={{
                height: 54,
                backgroundColor: inputBg,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: borderColor,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: textPrimary }}>
                {category}
              </Text>
              <ChevronDown size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Inline Category Options */}
            {showCategoryPicker && (
              <View
                style={{
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: borderColor,
                  marginTop: 6,
                  overflow: 'hidden',
                }}
              >
                {CATEGORIES.map((cat, idx) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryPicker(false);
                    }}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderBottomWidth: idx < CATEGORIES.length - 1 ? 1 : 0,
                      borderBottomColor: borderColor,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: textPrimary }}>
                      {cat}
                    </Text>
                    {category === cat && <Check size={16} color="#0C1829" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Payment Mode Field */}
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary, marginBottom: 8 }}>
              Payment Mode
            </Text>
            <TouchableOpacity
              onPress={() => setShowPaymentPicker(!showPaymentPicker)}
              activeOpacity={0.8}
              style={{
                height: 54,
                backgroundColor: inputBg,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: borderColor,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: textPrimary }}>
                {PAYMENT_MODES.find((m) => m.value === paymentMode)?.label || 'Cash'}
              </Text>
              <ChevronDown size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Inline Payment Options */}
            {showPaymentPicker && (
              <View
                style={{
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: borderColor,
                  marginTop: 6,
                  overflow: 'hidden',
                }}
              >
                {PAYMENT_MODES.map((pm, idx) => (
                  <TouchableOpacity
                    key={pm.value}
                    onPress={() => {
                      setPaymentMode(pm.value);
                      setShowPaymentPicker(false);
                    }}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderBottomWidth: idx < PAYMENT_MODES.length - 1 ? 1 : 0,
                      borderBottomColor: borderColor,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: textPrimary }}>
                      {pm.label}
                    </Text>
                    {paymentMode === pm.value && <Check size={16} color="#0C1829" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Note (Optional) Field */}
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary, marginBottom: 8 }}>
              Note (Optional)
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add note"
              placeholderTextColor="#94A3B8"
              style={{
                height: 54,
                backgroundColor: inputBg,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: borderColor,
                paddingHorizontal: 16,
                fontSize: 15,
                fontWeight: '600',
                color: textPrimary,
              }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Save Button matching Screen 8 */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 22,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 20,
          paddingTop: 12,
          backgroundColor: bg,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.88}
          style={{
            height: 52,
            backgroundColor: '#0C1829',
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#0C1829',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            Save Expense
          </Text>
        </TouchableOpacity>
      </View>

      <ThemedAlert {...alertConfig} />
    </KeyboardAvoidingView>
  );
}
