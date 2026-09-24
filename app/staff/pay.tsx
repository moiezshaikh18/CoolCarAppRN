// ============================================================
// Pay Staff Screen — Record Salary or Advance Payment
// Plain Simple English Terms & Auto-Logged to Garage Expenses
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  User,
  Banknote,
  DollarSign,
  Check,
  Calendar,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { useExpenseStore } from '../../src/store/expenseStore';
import { PaymentType, SalaryPayment } from '../../src/types/employee.types';
import { PaymentMode } from '../../src/types/payment.types';
import { BankPaymentSelector } from '../../src/components/common/BankPaymentSelector';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { formatCurrency } from '../../src/utils/currency';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function PayStaffScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ staffId?: string; defaultType?: PaymentType }>();

  const rawEmployees = useEmployeeStore((s) => s.employees);
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const recordSalaryPayment = useEmployeeStore((s) => s.recordSalaryPayment);
  const { addExpense } = useExpenseStore();
  const rawAccounts = useBankAccountStore((s) => s.accounts);
  const accounts = Array.isArray(rawAccounts) ? rawAccounts : [];
  const debitAccount = useBankAccountStore((s) => s.debitAccount);

  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    params.staffId || (employees[0]?.id ?? '')
  );
  const [paymentType, setPaymentType] = useState<PaymentType>(
    params.defaultType === 'ADVANCE' ? 'ADVANCE' : 'SALARY'
  );
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'bank-cash');
  const [selectedAccountName, setSelectedAccountName] = useState<string>(accounts[0]?.accountName || 'Cash Counter');
  const [forMonth, setForMonth] = useState(`${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');


  const selectedStaff = useMemo(() => {
    return employees.find((e) => e.id === selectedStaffId);
  }, [employees, selectedStaffId]);

  // Set default amount when salary is chosen
  const handleSelectSalaryType = (type: PaymentType) => {
    setPaymentType(type);
    if (type === 'SALARY' && selectedStaff && !amount) {
      setAmount(String(selectedStaff.salaryAmount));
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedStaff) {
      Alert.alert('Required Field', 'Please select a staff member');
      return;
    }
    const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    const entId = enterpriseId || 'enterprise-cool-car';
    const paymentId = `sp-${Date.now()}`;

    const paymentRecord: SalaryPayment = {
      id: paymentId,
      enterpriseId: entId,
      employeeId: selectedStaff.id,
      employeeName: selectedStaff.name,
      type: paymentType,
      amount: num,
      date,
      paymentMode: paymentMode === 'CARD_SWIPE' ? 'UPI' : paymentMode,
      bankAccountId: selectedAccountId,
      bankAccountName: selectedAccountName,
      forMonth: paymentType === 'SALARY' ? forMonth : undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    // 1. Save in Employee Store
    recordSalaryPayment(paymentRecord);

    // 2. Debit the Bank Account / Cash drawer
    if (selectedAccountId) {
      debitAccount(selectedAccountId, num);
    }

    // 3. Automatically Log in Garage Expenses
    const expenseRecord = {
      id: `exp-${Date.now()}`,
      enterpriseId: entId,
      categoryId: paymentType === 'SALARY' ? 'cat-salary' : 'cat-advance',
      categoryName: paymentType === 'SALARY' ? 'Staff Salary' : 'Staff Advance',
      amount: num,
      paymentMode,
      paymentAccountId: selectedAccountId,
      paymentAccountName: selectedAccountName,
      date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      spentBy: selectedStaff.name,
      description: `${paymentType === 'SALARY' ? 'Salary paid to' : 'Advance given to'} ${selectedStaff.name}${notes ? ` - ${notes}` : ''}`,
      voided: false,
      createdBy: 'user-owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addExpense(expenseRecord);

    // 3. Firestore Sync (background)
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      await setDoc(doc(db, 'enterprises', entId, 'salaryPayments', paymentId), paymentRecord);
      await setDoc(doc(db, 'enterprises', entId, 'expenses', expenseRecord.id), expenseRecord);
    } catch (err) {
      console.log('[PayStaff] Firestore sync offline/deferred:', err);
    }

    Alert.alert(
      'Payment Recorded',
      `Successfully recorded ${paymentType === 'SALARY' ? 'Salary' : 'Advance'} of ${formatCurrency(num, currencySymbol)} to ${selectedStaff.name}!`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const skyBg = isDark ? '#000000' : '#153580';
  const sheetBg = isDark ? '#0A0D14' : '#F4F6F9';
  const cardBg = isDark ? '#141824' : '#FFFFFF';
  const inputBg = isDark ? '#1C2538' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(43,53,68,0.08)';

  return (
    <View style={{ flex: 1, backgroundColor: skyBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Royal Blue Top Header */}

      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.22)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
            Pay Staff
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
            Record salary or advance payment
          </Text>
        </View>
      </View>

      {/* Signature Mega-Curved Lower Content Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 }}
        >
          <View style={{ gap: 16 }}>
            {/* Step 1: Select Staff Member */}
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 18,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 10, letterSpacing: 0.5 }}>
                SELECT STAFF MEMBER
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {employees.map((staff) => {
                  const isSelected = selectedStaffId === staff.id;
                  return (
                    <TouchableOpacity
                      key={staff.id}
                      onPress={() => setSelectedStaffId(staff.id)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 18,
                        backgroundColor: isSelected ? (isDark ? '#FFFFFF' : '#153580') : inputBg,
                        borderWidth: 1,
                        borderColor: isSelected ? (isDark ? '#FFFFFF' : '#153580') : borderColor,
                      }}
                    >
                      <Text style={{ color: isSelected ? (isDark ? '#0C1829' : '#FFFFFF') : theme.text, fontSize: 14, fontWeight: '800' }}>

                        {staff.name}
                      </Text>
                      <Text style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : theme.textMuted, fontSize: 11, marginTop: 2 }}>
                        {staff.role}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Step 2: Payment Type Toggle (Salary vs Advance) */}
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 18,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 10, letterSpacing: 0.5 }}>
                PAYMENT TYPE
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => handleSelectSalaryType('SALARY')}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 20,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    backgroundColor: paymentType === 'SALARY' ? '#0C1829' : inputBg,
                  }}
                >
                  <Banknote size={18} color={paymentType === 'SALARY' ? '#FFFFFF' : theme.textMuted} />
                  <Text style={{ color: paymentType === 'SALARY' ? '#FFFFFF' : theme.text, fontSize: 15, fontWeight: '800' }}>
                    Pay Salary
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSelectSalaryType('ADVANCE')}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 20,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    backgroundColor: paymentType === 'ADVANCE' ? '#0C1829' : inputBg,
                  }}
                >
                  <DollarSign size={18} color={paymentType === 'ADVANCE' ? '#FFFFFF' : theme.textMuted} />
                  <Text style={{ color: paymentType === 'ADVANCE' ? '#FFFFFF' : theme.text, fontSize: 15, fontWeight: '800' }}>
                    Give Advance
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedStaff && (
                <View style={{ marginTop: 12, padding: 12, borderRadius: 14, backgroundColor: inputBg }}>
                  <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                    Monthly Salary: <Text style={{ color: theme.text, fontWeight: '700' }}>{formatCurrency(selectedStaff.salaryAmount, currencySymbol)}</Text> • Current Advance: <Text style={{ color: selectedStaff.currentAdvance ? '#EF4444' : '#10B981', fontWeight: '800' }}>{formatCurrency(selectedStaff.currentAdvance || 0, currencySymbol)}</Text>
                  </Text>
                </View>
              )}
            </View>

            {/* Step 3: Payment Details (Amount, Mode, Date) */}
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: borderColor,
                gap: 16,
              }}
            >
              {/* Amount */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  AMOUNT TO PAY ({currencySymbol}) *
                </Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 18,
                    paddingHorizontal: 16,
                    height: 56,
                    color: theme.text,
                    fontSize: 22,
                    fontWeight: '900',
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                />
              </View>

              {/* Payment Mode & Bank Account Selector */}
              <BankPaymentSelector
                paymentMode={paymentMode}
                onPaymentModeChange={setPaymentMode}
                selectedAccountId={selectedAccountId}
                onAccountChange={(accId, accName) => {
                  setSelectedAccountId(accId);
                  setSelectedAccountName(accName);
                }}
                label="PAYMENT SOURCE / ACCOUNT *"
              />

              {/* For Month (if Salary) */}
              {paymentType === 'SALARY' && (
                <View>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                    SALARY FOR MONTH
                  </Text>
                  <TextInput
                    value={forMonth}
                    onChangeText={setForMonth}
                    placeholder="e.g. September 2026"
                    placeholderTextColor={theme.textMuted}
                    style={{
                      backgroundColor: inputBg,
                      borderRadius: 18,
                      paddingHorizontal: 16,
                      height: 50,
                      color: theme.text,
                      fontSize: 15,
                      fontWeight: '600',
                      borderWidth: 1,
                      borderColor: borderColor,
                    }}
                  />
                </View>
              )}

              {/* Payment Date */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  PAYMENT DATE
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: inputBg,
                    borderRadius: 18,
                    paddingHorizontal: 16,
                    height: 50,
                    gap: 10,
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                >
                  <Calendar size={18} color={theme.textMuted} />
                  <TextInput
                    value={date}
                    onChangeText={setDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={theme.textMuted}
                    style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: '600' }}
                  />
                </View>
              </View>

              {/* Notes */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  NOTES / REASON (OPTIONAL)
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder={paymentType === 'ADVANCE' ? 'e.g. Family medical emergency' : 'e.g. Full month salary'}
                  placeholderTextColor={theme.textMuted}
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 18,
                    paddingHorizontal: 16,
                    height: 50,
                    color: theme.text,
                    fontSize: 14,
                    fontWeight: '500',
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                />
              </View>
            </View>

            {/* Midnight Navy Confirm CTA */}
            <TouchableOpacity
              onPress={handleConfirmPayment}
              activeOpacity={0.88}
              style={{
                backgroundColor: '#0C1829',
                paddingVertical: 18,
                borderRadius: 34,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                shadowColor: '#000',
                shadowOpacity: 0.35,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 6,
              }}
            >
              <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                Confirm & Record Payment
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

