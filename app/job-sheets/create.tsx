// ============================================================
// Create Job Sheet Screen — Cool Car Workshop
// Specialized AC vs Mechanical Work, Previous Pending Balance,
// Amount Paid Now with Bank Account Binding & 1-Tap Intake
// Sky Blue (#6B9FE8) & Midnight Navy (#0C1829) Luxury Aesthetic
// ============================================================

import React, { useState, useMemo, useRef } from 'react';
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
  Car,
  Plus,
  Trash2,
  Wrench,
  Package,
  UserCheck,
  Check,
  X,
  Sparkles,
  Phone,
  User,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { BankPaymentSelector } from '../../src/components/common/BankPaymentSelector';
import { formatCurrency } from '../../src/utils/currency';
import { router } from 'expo-router';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { WorkCategory } from '../../src/types/jobSheet.types';
import { PaymentMode } from '../../src/types/payment.types';

// Preset sample vehicles with previous pending balances for Cool Car
const RECENT_SAMPLE_VEHICLES = [
  { reg: 'MH02AB1234', model: 'Honda City ZX', customer: 'Rajesh Sharma', phone: '9820112345', previousPending: 0 },
  { reg: 'DL04AB1234', model: 'Maruti Swift Dzire', customer: 'Priya Kapoor', phone: '9811223344', previousPending: 1200 },
  { reg: 'HR26BC4321', model: 'Hyundai Creta SX', customer: 'Suresh Gupta', phone: '9899001122', previousPending: 2500 },
];

// Presets for Car AC Work
const AC_PRESETS = [
  { name: 'AC Gas Refill (R134a)', type: 'SERVICE' as const, price: 1800 },
  { name: 'Cooling Coil Service & Clean', type: 'SERVICE' as const, price: 2500 },
  { name: 'AC Compressor Overhaul / Repair', type: 'SERVICE' as const, price: 3500 },
  { name: 'AC Condenser Wash & Cleaning', type: 'SERVICE' as const, price: 800 },
  { name: 'Nitrogen AC Leak Test', type: 'SERVICE' as const, price: 600 },
  { name: 'Cabin AC Filter OEM', type: 'PART' as const, price: 450 },
  { name: 'R134a Refrigerant Can 450g', type: 'PART' as const, price: 650 },
  { name: 'AC Compressor Oil (PAG 46)', type: 'PART' as const, price: 350 },
  { name: 'Expansion Valve OEM', type: 'PART' as const, price: 1200 },
];

// Presets for Mechanical Work
const MECHANICAL_PRESETS = [
  { name: 'Front Brake Pads Replacement', type: 'SERVICE' as const, price: 1500 },
  { name: 'Engine Oil & Filter Service', type: 'SERVICE' as const, price: 2200 },
  { name: 'Clutch Plate Overhaul & Labor', type: 'SERVICE' as const, price: 4500 },
  { name: 'Suspension Bush & Link Rods', type: 'SERVICE' as const, price: 3000 },
  { name: 'Coolant Flush & Radiator Clean', type: 'SERVICE' as const, price: 950 },
  { name: 'Wheel Bearing & Disc Lathe', type: 'SERVICE' as const, price: 1800 },
  { name: 'Motul 5W-30 Synthetic Oil (4L)', type: 'PART' as const, price: 3200 },
  { name: 'Engine Oil Filter OEM', type: 'PART' as const, price: 450 },
  { name: 'Brake Disc Rotors Pair', type: 'PART' as const, price: 2800 },
];

interface JobItem {
  id: string;
  name: string;
  type: 'SERVICE' | 'PART';
  price: number;
}

function generateNewJobId(): string {
  return `JS-${Date.now()}`;
}

function generateNewJobNumber(): string {
  return `CCG-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function CreateJobSheetScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const { addJobSheet } = useJobSheetStore();
  const { employees } = useEmployeeStore();
  const { accounts, creditAccount } = useBankAccountStore();

  // Work Type: AC vs Mechanical vs Both
  const [workCategory, setWorkCategory] = useState<WorkCategory>('AC');

  // Primary Car & Customer Details
  const [carNumber, setCarNumber] = useState('');
  const [carModel, setCarModel] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [hasValidationError, setHasValidationError] = useState(false);

  // Financials: Previous Pending, Discount, Amount Paid Now
  const [previousPending, setPreviousPending] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [amountPaidNow, setAmountPaidNow] = useState('0');

  // Payment Mode & Bank Account
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'bank-cash');
  const [selectedAccountName, setSelectedAccountName] = useState<string>(accounts[0]?.accountName || 'Cash Counter');

  // Assigned mechanic
  const [assignedEmployeeId, setAssignedEmployeeId] = useState<string>(
    employees[0]?.id || ''
  );

  // Job Items List
  const [items, setItems] = useState<JobItem[]>([
    { id: '1', name: 'AC Gas Refill (R134a)', type: 'SERVICE', price: 1800 },
    { id: '2', name: 'Cabin AC Filter OEM', type: 'PART', price: 450 },
  ]);

  // Custom Item Modal state
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemType, setNewItemType] = useState<'SERVICE' | 'PART'>('SERVICE');

  // Calculations
  const currentSubtotal = useMemo(() => items.reduce((sum, it) => sum + it.price, 0), [items]);
  const discountVal = parseFloat(discount) || 0;
  const prevPendingVal = parseFloat(previousPending) || 0;
  const currentJobNet = Math.max(0, currentSubtotal - discountVal);
  const totalBillDue = currentJobNet + prevPendingVal;

  const paidNowVal = parseFloat(amountPaidNow) || 0;
  const remainingBalance = Math.max(0, totalBillDue - paidNowVal);

  const selectedMechanic = useMemo(() => {
    return employees.find((e) => e.id === assignedEmployeeId);
  }, [employees, assignedEmployeeId]);

  // Autofill from 1-tap sample vehicle pills
  const handleSelectRecentVehicle = (v: typeof RECENT_SAMPLE_VEHICLES[0]) => {
    setCarNumber(v.reg);
    setCarModel(v.model);
    setCustomerName(v.customer);
    setCustomerPhone(v.phone);
    setPreviousPending(String(v.previousPending));
    setHasValidationError(false);
  };

  // Presets based on selected work type
  const activePresets = useMemo(() => {
    if (workCategory === 'AC') return AC_PRESETS;
    if (workCategory === 'MECHANICAL') return MECHANICAL_PRESETS;
    return [...AC_PRESETS, ...MECHANICAL_PRESETS];
  }, [workCategory]);

  const handleAddPresetItem = (preset: { name: string; type: 'SERVICE' | 'PART'; price: number }) => {
    const exists = items.some((i) => i.name === preset.name);
    if (exists) {
      Alert.alert('Already Added', `"${preset.name}" is already in this job sheet.`);
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: preset.name,
        type: preset.type,
        price: preset.price,
      },
    ]);
  };

  const handleSaveCustomItem = () => {
    if (!newItemName.trim()) {
      Alert.alert('Name Required', 'Please enter service or part name.');
      return;
    }
    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Price Required', 'Please enter a valid price.');
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newItemName.trim(),
        type: newItemType,
        price: priceNum,
      },
    ]);
    setNewItemName('');
    setNewItemPrice('');
    setIsAddItemModalOpen(false);
  };

  const handleCreateJobSheet = async () => {
    const cleanReg = carNumber.trim().toUpperCase().replace(/\s+/g, '');

    if (!cleanReg) {
      setHasValidationError(true);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      Alert.alert(
        'Car Number Required',
        'Please enter the Car Number (e.g. MH02AB1234) at the top of the form, or tap one of the recent car pills.'
      );
      return;
    }

    if (items.length === 0) {
      Alert.alert('Add Items', 'Please add at least one service or spare part to this job sheet.');
      return;
    }

    const entId = enterpriseId || 'enterprise-cool-car';
    const newJobId = generateNewJobId();
    const jobNum = generateNewJobNumber();
    const finalModel = carModel.trim() || 'Car';
    const finalCustName = customerName.trim() || 'Walk-in Customer';
    const finalCustPhone = customerPhone.trim();

    // If customer paid now, credit the selected bank account / cash drawer
    if (paidNowVal > 0 && selectedAccountId) {
      creditAccount(selectedAccountId, paidNowVal);
    }

    const newJob = {
      id: newJobId,
      enterpriseId: entId,
      jobNumber: jobNum,
      customerId: `cust-${Date.now()}`,
      customerName: finalCustName,
      customerPhone: finalCustPhone,
      vehicleId: `veh-${Date.now()}`,
      vehicleNumber: cleanReg,
      vehicleMake: finalModel.split(' ')[0],
      vehicleModel: finalModel,
      workCategory,
      date: new Date().toISOString(),
      status: 'OPEN' as const,
      assignedMechanicId: selectedMechanic?.id || '',
      assignedMechanicName: selectedMechanic ? `${selectedMechanic.name} (${selectedMechanic.role})` : 'Unassigned',
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        type: it.type,
        quantity: 1,
        unitPrice: it.price,
        amount: it.price,
      })),
      subtotal: currentSubtotal,
      discount: discountVal,
      previousPendingAmount: prevPendingVal,
      finalAmount: totalBillDue,
      amountCollectedNow: paidNowVal,
      totalPaid: paidNowVal,
      pendingAmount: remainingBalance,
      paymentStatus: (remainingBalance === 0 ? 'PAID' : paidNowVal > 0 ? 'PARTIALLY_PAID' : 'PENDING') as any,
      paymentMode: paidNowVal > 0 ? paymentMode : undefined,
      bankAccountId: paidNowVal > 0 ? selectedAccountId : undefined,
      bankAccountName: paidNowVal > 0 ? selectedAccountName : undefined,
      notes: `${workCategory} Work Order - Intaken at Cool Car`,
      voided: false,
      createdBy: 'Cool Car Manager',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      await setDoc(doc(db, 'enterprises', entId, 'jobSheets', newJobId), newJob);
    } catch (err) {
      console.log('[CreateJobSheet] Firestore sync error/offline:', err);
    }

    addJobSheet(newJob as any);

    Alert.alert(
      'Job Sheet Created!',
      `Job Sheet #${jobNum} created for ${finalModel} (${cleanReg})\nWork: ${workCategory}\nTotal Bill: ${currencySymbol}${totalBillDue}\nPaid Now: ${currencySymbol}${paidNowVal}\nBalance Due: ${currencySymbol}${remainingBalance}`,
      [{ text: 'View All Job Sheets', onPress: () => router.replace('/job-sheets' as any) }]
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
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
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
              Daily Job Sheet
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 12, fontWeight: '600' }}>
              Cool Car Workshop
            </Text>
          </View>

          <View
            style={{
              backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 14,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
              {formatCurrency(totalBillDue, currencySymbol)}
            </Text>
          </View>
        </View>

        {/* WORK CATEGORY TOGGLE (Mechanical vs AC vs Both) */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.22)',
            borderRadius: 22,
            padding: 4,
            gap: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => setWorkCategory('AC')}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 18,
              alignItems: 'center',
              backgroundColor: workCategory === 'AC' ? '#FFFFFF' : 'transparent',
            }}
          >
            <Text
              style={{
                color: workCategory === 'AC' ? '#0C1829' : '#FFFFFF',
                fontSize: 12,
                fontWeight: '800',
              }}
            >
              ❄️ AC Work
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setWorkCategory('MECHANICAL')}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 18,
              alignItems: 'center',
              backgroundColor: workCategory === 'MECHANICAL' ? '#FFFFFF' : 'transparent',
            }}
          >
            <Text
              style={{
                color: workCategory === 'MECHANICAL' ? '#0C1829' : '#FFFFFF',
                fontSize: 12,
                fontWeight: '800',
              }}
            >
              🔧 Mechanical
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setWorkCategory('BOTH')}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 18,
              alignItems: 'center',
              backgroundColor: workCategory === 'BOTH' ? '#FFFFFF' : 'transparent',
            }}
          >
            <Text
              style={{
                color: workCategory === 'BOTH' ? '#0C1829' : '#FFFFFF',
                fontSize: 12,
                fontWeight: '800',
              }}
            >
              ⚙️ Both
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Crisp Lower Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
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
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 130 }}
        >
          {/* STEP 1: Car & Customer Information */}
          <View
            style={{
              marginBottom: 18,
              backgroundColor: isDark ? '#141926' : '#F8FAFD',
              padding: 16,
              borderRadius: 24,
              borderWidth: 1.5,
              borderColor: hasValidationError && !carNumber.trim() ? '#EF4444' : cardBorder,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isDark ? '#1C2538' : '#0C1829',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Car size={16} color="#FFFFFF" />
                </View>
                <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  Car & Customer Details
                </Text>
              </View>

              {hasValidationError && !carNumber.trim() && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <AlertCircle size={14} color="#EF4444" />
                  <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '800' }}>Car No. Required</Text>
                </View>
              )}
            </View>

            {/* Quick 1-tap Sample / Recent Vehicle Chips */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 6, textTransform: 'uppercase' }}>
                Tap to quick-fill car:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {RECENT_SAMPLE_VEHICLES.map((v, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleSelectRecentVehicle(v)}
                    style={{
                      backgroundColor: carNumber.replace(/\s+/g, '') === v.reg ? (isDark ? '#FFFFFF' : '#0C1829') : (isDark ? '#1C2538' : '#FFFFFF'),
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: cardBorder,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '800',
                        color: carNumber.replace(/\s+/g, '') === v.reg ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#FFFFFF' : '#0C1829'),
                      }}
                    >
                      {v.reg} ({v.model.split(' ')[0]}) {v.previousPending > 0 ? `• Due: ₹${v.previousPending}` : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Car Number & Model */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              <View style={{ flex: 1.2 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                  Car Number *
                </Text>
                <TextInput
                  value={carNumber}
                  onChangeText={(text) => {
                    setCarNumber(text);
                    if (text.trim()) setHasValidationError(false);
                  }}
                  placeholder="MH02AB1234"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                  style={{
                    backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                    borderRadius: 14,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 14,
                    fontWeight: '800',
                    color: isDark ? '#FFFFFF' : '#0C1829',
                    borderWidth: 1,
                    borderColor: hasValidationError && !carNumber.trim() ? '#EF4444' : cardBorder,
                  }}
                />
              </View>

              <View style={{ flex: 1.4 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                  Car Model
                </Text>
                <TextInput
                  value={carModel}
                  onChangeText={setCarModel}
                  placeholder="Honda City / Swift"
                  placeholderTextColor="#94A3B8"
                  style={{
                    backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                    borderRadius: 14,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 13,
                    fontWeight: '700',
                    color: isDark ? '#FFFFFF' : '#0C1829',
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                />
              </View>
            </View>

            {/* Customer Name & Mobile */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                  Customer Name
                </Text>
                <TextInput
                  value={customerName}
                  onChangeText={setCustomerName}
                  placeholder="Rajesh Sharma"
                  placeholderTextColor="#94A3B8"
                  style={{
                    backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                    borderRadius: 14,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 13,
                    fontWeight: '700',
                    color: isDark ? '#FFFFFF' : '#0C1829',
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                  Mobile Number
                </Text>
                <TextInput
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  placeholder="9820112345"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  style={{
                    backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                    borderRadius: 14,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 13,
                    fontWeight: '700',
                    color: isDark ? '#FFFFFF' : '#0C1829',
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                />
              </View>
            </View>
          </View>

          {/* STEP 2: Assign Mechanic / Staff */}
          <View style={{ marginBottom: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <UserCheck size={16} color="#6B9FE8" />
                <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  Assign Mechanic / Staff
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/staff' as any)}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B9FE8' }}>
                  Staff Directory
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {employees.map((emp) => {
                const isSelected = emp.id === assignedEmployeeId;
                return (
                  <TouchableOpacity
                    key={emp.id}
                    onPress={() => setAssignedEmployeeId(emp.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingVertical: 9,
                      paddingHorizontal: 12,
                      borderRadius: 16,
                      backgroundColor: isSelected
                        ? (isDark ? '#FFFFFF' : '#0C1829')
                        : (isDark ? '#141926' : '#F4F7FC'),
                      borderWidth: 1,
                      borderColor: isSelected ? (isDark ? '#FFFFFF' : '#0C1829') : cardBorder,
                    }}
                  >
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: isSelected
                          ? (isDark ? '#0C1829' : '#FFFFFF')
                          : '#6B9FE8',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected ? (
                        <Check size={13} color={isDark ? '#FFFFFF' : '#0C1829'} strokeWidth={3} />
                      ) : (
                        <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>
                          {emp.name.charAt(0)}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '800',
                          color: isSelected
                            ? (isDark ? '#0C1829' : '#FFFFFF')
                            : (isDark ? '#FFFFFF' : '#0C1829'),
                        }}
                      >
                        {emp.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '600',
                          color: isSelected
                            ? (isDark ? 'rgba(12,24,41,0.7)' : 'rgba(255,255,255,0.7)')
                            : '#64748B',
                        }}
                      >
                        {emp.role}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* STEP 3: Quick Add Presets (AC vs Mechanical) */}
          <View style={{ marginBottom: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Sparkles size={16} color="#6B9FE8" />
              <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                Quick Add {workCategory === 'AC' ? 'Car AC' : workCategory === 'MECHANICAL' ? 'Mechanical' : 'Workshop'} Items
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {activePresets.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleAddPresetItem(item)}
                  style={{
                    backgroundColor: isDark ? '#141926' : '#F8FAFD',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: cardBorder,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Plus size={13} color="#6B9FE8" strokeWidth={2.5} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#6B9FE8' }}>
                    ₹{item.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* STEP 4: Job Items List */}
          <View style={{ marginBottom: 18 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                Billed Services & Parts ({items.length})
              </Text>
              <TouchableOpacity
                onPress={() => setIsAddItemModalOpen(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: isDark ? '#141926' : '#F4F7FC',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 14,
                }}
              >
                <Plus size={13} color={isDark ? '#FFFFFF' : '#0C1829'} />
                <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  Custom Item
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 8 }}>
              {items.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 12,
                    borderRadius: 18,
                    backgroundColor: isDark ? '#141926' : '#F8FAFD',
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: isDark ? '#1C2538' : '#0C1829',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.type === 'PART' ? <Package size={15} color="#FFFFFF" /> : <Wrench size={15} color="#FFFFFF" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '600' }}>
                        {item.type === 'SERVICE' ? 'Service / Labor' : 'Spare Part'}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                      {formatCurrency(item.price, currencySymbol)}
                    </Text>
                    <TouchableOpacity onPress={() => setItems(items.filter((i) => i.id !== item.id))}>
                      <Trash2 size={15} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* STEP 5: Multi-Layer Bill Breakdown (Previous Due + Current Bill) */}
          <GlassCard
            variant={isDark ? 'navy' : 'sand'}
            padding={16}
            style={{ borderRadius: 24, marginBottom: 18, gap: 10 }}
          >
            <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829', textTransform: 'uppercase' }}>
              Bill Breakdown & Settlement
            </Text>

            {/* Current Job Services Subtotal */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '600' }}>Current Work Total</Text>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 14, fontWeight: '800' }}>
                {formatCurrency(currentSubtotal, currencySymbol)}
              </Text>
            </View>

            {/* Previous Pending Due Input */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '600' }}>Previous Pending Balance</Text>
                <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: '700' }}>Old Due from Customer</Text>
              </View>
              <TextInput
                value={previousPending}
                onChangeText={setPreviousPending}
                keyboardType="numeric"
                style={{
                  width: 90,
                  textAlign: 'right',
                  color: prevPendingVal > 0 ? '#EF4444' : (isDark ? '#FFFFFF' : '#0C1829'),
                  fontSize: 14,
                  fontWeight: '800',
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: cardBorder,
                }}
              />
            </View>

            {/* Discount */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '600' }}>Discount ({currencySymbol})</Text>
              <TextInput
                value={discount}
                onChangeText={setDiscount}
                keyboardType="numeric"
                style={{
                  width: 90,
                  textAlign: 'right',
                  color: '#34D399',
                  fontSize: 14,
                  fontWeight: '800',
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: cardBorder,
                }}
              />
            </View>

            <View style={{ height: 1, backgroundColor: cardBorder }} />

            {/* Total Bill Due */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 16, fontWeight: '900' }}>
                Total Bill Due
              </Text>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 22, fontWeight: '900' }}>
                {formatCurrency(totalBillDue, currencySymbol)}
              </Text>
            </View>

            {/* Amount Paid Now Input */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <View>
                <Text style={{ color: isDark ? '#34D399' : '#059669', fontSize: 14, fontWeight: '800' }}>
                  Amount Paid Now ({currencySymbol})
                </Text>
                <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '600' }}>
                  Customer paid today
                </Text>
              </View>
              <TextInput
                value={amountPaidNow}
                onChangeText={setAmountPaidNow}
                keyboardType="numeric"
                style={{
                  width: 100,
                  textAlign: 'right',
                  color: '#34D399',
                  fontSize: 16,
                  fontWeight: '900',
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: '#34D399',
                }}
              />
            </View>

            {/* Remaining Balance Due */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '700' }}>
                Remaining Balance Due
              </Text>
              <Text
                style={{
                  color: remainingBalance > 0 ? '#EF4444' : '#34D399',
                  fontSize: 16,
                  fontWeight: '900',
                }}
              >
                {remainingBalance > 0 ? formatCurrency(remainingBalance, currencySymbol) : 'Fully Cleared ✓'}
              </Text>
            </View>
          </GlassCard>

          {/* STEP 6: Payment Mode & Bank Account (Only if Amount Paid Now > 0) */}
          {paidNowVal > 0 ? (
            <BankPaymentSelector
              paymentMode={paymentMode}
              onPaymentModeChange={setPaymentMode}
              selectedAccountId={selectedAccountId}
              onAccountChange={(accId, accName) => {
                setSelectedAccountId(accId);
                setSelectedAccountName(accName);
              }}
              label="Deposit Payment Into Account"
            />
          ) : null}

          {/* Submit CTA Button */}
          <TouchableOpacity
            onPress={handleCreateJobSheet}
            activeOpacity={0.88}
            style={{
              backgroundColor: primaryBtnBg,
              paddingVertical: 18,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              shadowColor: '#0C1829',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
              Create Job Sheet ({workCategory})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Add Custom Item Modal */}
      <Modal
        visible={isAddItemModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddItemModalOpen(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? '#111622' : '#FFFFFF',
              borderRadius: 28,
              padding: 24,
              gap: 16,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                Add Custom Item
              </Text>
              <TouchableOpacity onPress={() => setIsAddItemModalOpen(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Type selector */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setNewItemType('SERVICE')}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 14,
                  alignItems: 'center',
                  backgroundColor: newItemType === 'SERVICE' ? (isDark ? '#FFFFFF' : '#0C1829') : (isDark ? '#1C2538' : '#F1F5F9'),
                }}
              >
                <Text
                  style={{
                    color: newItemType === 'SERVICE' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#FFFFFF' : '#0C1829'),
                    fontWeight: '800',
                    fontSize: 13,
                  }}
                >
                  Labor / Service
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setNewItemType('PART')}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 14,
                  alignItems: 'center',
                  backgroundColor: newItemType === 'PART' ? (isDark ? '#FFFFFF' : '#0C1829') : (isDark ? '#1C2538' : '#F1F5F9'),
                }}
              >
                <Text
                  style={{
                    color: newItemType === 'PART' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#FFFFFF' : '#0C1829'),
                    fontWeight: '800',
                    fontSize: 13,
                  }}
                >
                  Spare Part
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              value={newItemName}
              onChangeText={setNewItemName}
              placeholder="Item name (e.g. Brake Caliper Repair)"
              placeholderTextColor="#94A3B8"
              style={{
                backgroundColor: isDark ? '#1C2538' : '#F8FAFD',
                borderRadius: 16,
                padding: 14,
                fontSize: 14,
                fontWeight: '700',
                color: isDark ? '#FFFFFF' : '#0C1829',
              }}
            />

            <TextInput
              value={newItemPrice}
              onChangeText={setNewItemPrice}
              placeholder="Price (₹)"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              style={{
                backgroundColor: isDark ? '#1C2538' : '#F8FAFD',
                borderRadius: 16,
                padding: 14,
                fontSize: 14,
                fontWeight: '700',
                color: isDark ? '#FFFFFF' : '#0C1829',
              }}
            />

            <TouchableOpacity
              onPress={handleSaveCustomItem}
              style={{
                backgroundColor: primaryBtnBg,
                paddingVertical: 14,
                borderRadius: 20,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: primaryBtnText, fontSize: 15, fontWeight: '800' }}>
                Add to Job Sheet
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
