// ============================================================
// Add Daily Expense Screen — Cool Car Workshop
// Reason, Kisne Liya (Spent By), Exact Time & Date, Bank/Cash Binding
// Signboard Royal Blue (#153580) & Midnight Navy (#0C1829) Luxury Aesthetic
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
  ChevronLeft,
  User,
  Calendar,
  Clock,
  Tag,
  FileText,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { BankPaymentSelector } from '../../src/components/common/BankPaymentSelector';
import { router } from 'expo-router';
import { PaymentMode } from '../../src/types/payment.types';
import { useExpenseStore } from '../../src/store/expenseStore';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { formatCurrency } from '../../src/utils/currency';
import { ThemedAlert, ThemedAlertProps } from '../../src/components/common/ThemedAlert';
import { CalendarPickerModal } from '../../src/components/common/CalendarPickerModal';

const COMMON_EXPENSE_REASONS = [
  'Staff Salary / Advance',
  'Tea & Snacks for Staff',
  'Workshop Electricity Bill',
  'Shop Rent',
  'Petrol / Diesel for Test Drive',
  'Hardware & Fasteners / Screws',
  'Nitrogen Cylinder Refill',
  'Oxygen / Gas Welding Rods',
  'Compressor Oil & Lubricants',
  'Cleaning Detergent & Acid Wash',
  'Miscellaneous Workshop Expense',
];

export default function AddExpenseScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol, enterpriseId } = useEnterprise();
  const insets = useSafeAreaInsets();

  const { addExpense } = useExpenseStore();
  const rawEmployees = useEmployeeStore((s) => s.employees);
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const rawAccounts = useBankAccountStore((s) => s.accounts);
  const accounts = Array.isArray(rawAccounts) ? rawAccounts : [];
  const debitAccount = useBankAccountStore((s) => s.debitAccount);

  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState(COMMON_EXPENSE_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  // Spent By / Logged By
  const [spentBy, setSpentBy] = useState(employees[0]?.name || 'Irfan Khan');
  const [customSpentBy, setCustomSpentBy] = useState('');

  // Date and Time
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  // Payment Mode & Bank Account
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'bank-cash');
  const [selectedAccountName, setSelectedAccountName] = useState<string>(accounts[0]?.accountName || 'Cash Counter');
  const [notes, setNotes] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
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

  const effectiveReason = customReason.trim() || reason;
  const effectiveSpentBy = customSpentBy.trim() || spentBy;

  const handleSave = () => {
    const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num <= 0) {
      showAlert('Amount Required', 'Please enter a valid expense amount.', 'warning');
      return;
    }

    if (!effectiveReason) {
      showAlert('Reason Required', 'Please specify what the money was spent for.', 'warning');
      return;
    }

    if (!effectiveSpentBy) {
      showAlert('Person Required', 'Please specify who took or spent the money.', 'warning');
      return;
    }

    // Debit the selected bank account / cash drawer
    if (selectedAccountId) {
      debitAccount(selectedAccountId, num);
    }

    const entId = enterpriseId || 'enterprise-cool-car';
    const expenseId = `exp-${Date.now()}`;

    const newExpense = {
      id: expenseId,
      enterpriseId: entId,
      categoryId: 'cat-general-expense',
      categoryName: effectiveReason,
      amount: num,
      paymentMode,
      paymentAccountId: selectedAccountId,
      paymentAccountName: selectedAccountName,
      date,
      time,
      spentBy: effectiveSpentBy,
      description: `${effectiveReason} — Spent by: ${effectiveSpentBy}${notes ? ` (${notes})` : ''}`,
      voided: false,
      createdBy: 'Cool Car Manager',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addExpense(newExpense);

    showAlert(
      'Expense Logged!',
      `Recorded ${currencySymbol}${num} for "${effectiveReason}"\nSpent by: ${effectiveSpentBy}\nPaid from: ${selectedAccountName}`,
      'success',
      [{ text: 'Done', style: 'default', onPress: () => router.back() }]
    );
  };

  const canvasBg = isDark ? '#000000' : '#153580';
  const sheetBg = isDark ? '#0A0D14' : '#F4F6F9';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(43, 53, 68, 0.08)';
  const primaryBtnBg = isDark ? '#FFFFFF' : '#153580';
  const primaryBtnText = isDark ? '#0C1829' : '#FFFFFF';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      {/* Royal Blue Top Header */}
      <View style={{ backgroundColor: canvasBg, paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 20 }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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

          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
              Add Daily Expense
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 12, fontWeight: '600' }}>
              Cool Car Workshop Ledger
            </Text>
          </View>

          <View style={{ width: 44 }} />
        </View>
      </View>

      {/* Crisp White Lower Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          marginTop: -14,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          paddingTop: 22,
          paddingHorizontal: 20,
          shadowColor: '#0C1829',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.4 : 0.06,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Card 1: Amount to Pay */}
          <GlassCard
            variant={isDark ? 'navy' : 'sand'}
            padding={16}
            style={{ borderRadius: 24, marginBottom: 18 }}
          >
            <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 }}>
              Expense Amount *
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 28, fontWeight: '900' }}>
                {currencySymbol}
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                style={{
                  flex: 1,
                  fontSize: 28,
                  fontWeight: '900',
                  color: isDark ? '#FFFFFF' : '#0C1829',
                }}
              />
            </View>
          </GlassCard>

          {/* Card 2: What was the expense for? (Reason / Category) */}
          <View
            style={{
              backgroundColor: isDark ? '#141926' : '#F8FAFD',
              borderRadius: 22,
              padding: 16,
              marginBottom: 18,
              borderWidth: 1,
              borderColor: cardBorder,
              gap: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Tag size={16} color={isDark ? '#60A5FA' : '#153580'} />
              <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                Expense Purpose / Category *
              </Text>
            </View>


            {/* Quick Reason Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {COMMON_EXPENSE_REASONS.map((r) => {
                const isSel = r === reason && !customReason.trim();
                return (
                  <TouchableOpacity
                    key={r}
                    onPress={() => {
                      setReason(r);
                      setCustomReason('');
                    }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 7,
                      borderRadius: 14,
                      backgroundColor: isSel
                        ? (isDark ? '#FFFFFF' : '#0C1829')
                        : (isDark ? '#1C2538' : '#FFFFFF'),
                      borderWidth: 1,
                      borderColor: cardBorder,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: isSel
                          ? (isDark ? '#0C1829' : '#FFFFFF')
                          : (isDark ? '#FFFFFF' : '#0C1829'),
                      }}
                    >
                      {r}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Custom Reason Input */}
            <TextInput
              value={customReason}
              onChangeText={setCustomReason}
              placeholder="Or type custom reason e.g. Bumper clip packet"
              placeholderTextColor="#94A3B8"
              style={{
                backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                borderRadius: 14,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 13,
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : '#0C1829',
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            />
          </View>

          {/* Card 3: Kisne Liya (Who took the money) */}
          <View
            style={{
              backgroundColor: isDark ? '#141926' : '#F8FAFD',
              borderRadius: 22,
              padding: 16,
              marginBottom: 18,
              borderWidth: 1,
              borderColor: cardBorder,
              gap: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <User size={16} color={isDark ? '#60A5FA' : '#153580'} />
              <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                Spent By / Paid To *
              </Text>
            </View>

            {/* Quick Staff Selection Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {['Workshop Cashier / Self', ...(employees || []).map((e) => e?.name || '').filter(Boolean), 'Vendor / Delivery Boy'].map((person) => {
                const isSel = person === spentBy && !customSpentBy.trim();
                return (
                  <TouchableOpacity
                    key={person}
                    onPress={() => {
                      setSpentBy(person);
                      setCustomSpentBy('');
                    }}

                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 7,
                      borderRadius: 14,
                      backgroundColor: isSel
                        ? (isDark ? '#FFFFFF' : '#0C1829')
                        : (isDark ? '#1C2538' : '#FFFFFF'),
                      borderWidth: 1,
                      borderColor: cardBorder,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: isSel
                          ? (isDark ? '#0C1829' : '#FFFFFF')
                          : (isDark ? '#FFFFFF' : '#0C1829'),
                      }}
                    >
                      {person}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Custom Name Input */}
            <TextInput
              value={customSpentBy}
              onChangeText={setCustomSpentBy}
              placeholder="Or type person name (e.g. Ramesh Mechanic)"
              placeholderTextColor="#94A3B8"
              style={{
                backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                borderRadius: 14,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 13,
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : '#0C1829',
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            />
          </View>

          {/* Card 4: Date & Exact Time */}
          <View
            style={{
              backgroundColor: isDark ? '#141926' : '#F8FAFD',
              borderRadius: 22,
              padding: 16,
              marginBottom: 18,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829', marginBottom: 10 }}>
              Date & Time
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1.2 }}>
                <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600', marginBottom: 4 }}>Date</Text>
                <TouchableOpacity
                  onPress={() => setIsCalendarOpen(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                    borderRadius: 14,
                    paddingHorizontal: 10,
                    height: 44,
                    gap: 6,
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <Calendar size={15} color={isDark ? '#60A5FA' : '#153580'} />
                  <Text style={{ flex: 1, color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 13, fontWeight: '700' }}>
                    {date}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600', marginBottom: 4 }}>Time</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                    borderRadius: 14,
                    paddingHorizontal: 10,
                    height: 44,
                    gap: 6,
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <Clock size={15} color="#64748B" />
                  <TextInput
                    value={time}
                    onChangeText={setTime}
                    placeholder="02:30 PM"
                    placeholderTextColor="#94A3B8"
                    style={{ flex: 1, color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 13, fontWeight: '700' }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Card 5: Payment Mode & Bank Account Deduction */}
          <BankPaymentSelector
            paymentMode={paymentMode}
            onPaymentModeChange={setPaymentMode}
            selectedAccountId={selectedAccountId}
            onAccountChange={(accId, accName) => {
              setSelectedAccountId(accId);
              setSelectedAccountName(accName);
            }}
            label="Paid From (Bank Account / Cash Drawer) *"
          />

          {/* Optional Notes */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>
              Extra Note (Optional)
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Paid for tea vendor at corner shop"
              placeholderTextColor="#94A3B8"
              style={{
                backgroundColor: isDark ? '#141926' : '#F8FAFD',
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 10,
                fontSize: 13,
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : '#0C1829',
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            />
          </View>

          {/* Submit CTA */}
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
              Save Expense Entry
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* CALENDAR PICKER MODAL */}
      <CalendarPickerModal
        visible={isCalendarOpen}
        selectedDate={date}
        onSelectDate={setDate}
        onClose={() => setIsCalendarOpen(false)}
        title="Select Expense Date"
      />

      {/* THEMED CUSTOM ALERT MODAL */}
      <ThemedAlert {...alertConfig} />
    </View>
  );
}
