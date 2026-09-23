// ============================================================
// Create Job Sheet Screen — Cool Car AC Repair Workshop
// Seamless, Intuitive Car Entry (with 1-tap recent car pills & autofill)
// Mechanic Assignment, AC Quick Presets, and Simple English Labels
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
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { router } from 'expo-router';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { useEmployeeStore } from '../../src/store/employeeStore';

// Preset sample vehicles for fast 1-tap intake in Cool Car Workshop
const RECENT_SAMPLE_VEHICLES = [
  { reg: 'MH02AB1234', model: 'Honda City ZX', customer: 'Rajesh Sharma', phone: '9820112345' },
  { reg: 'DL04AB1234', model: 'Maruti Swift Dzire', customer: 'Priya Kapoor', phone: '9811223344' },
  { reg: 'HR26BC4321', model: 'Hyundai Creta SX', customer: 'Suresh Gupta', phone: '9899001122' },
];

// Popular Car AC Repair services and parts for Cool Car
const POPULAR_AC_ITEMS: { name: string; type: 'SERVICE' | 'PART'; price: number }[] = [
  { name: 'AC Gas Refill (R134a)', type: 'SERVICE', price: 1800 },
  { name: 'Cooling Coil Service & Clean', type: 'SERVICE', price: 2500 },
  { name: 'AC Compressor Overhaul / Repair', type: 'SERVICE', price: 3500 },
  { name: 'AC Condenser Wash & Cleaning', type: 'SERVICE', price: 800 },
  { name: 'Nitrogen AC Leak Test', type: 'SERVICE', price: 600 },
  { name: 'Cabin AC Filter Change', type: 'SERVICE', price: 450 },
  { name: 'R134a Refrigerant Can 450g', type: 'PART', price: 650 },
  { name: 'AC Compressor Oil (PAG 46)', type: 'PART', price: 350 },
  { name: 'Expansion Valve OEM', type: 'PART', price: 1200 },
  { name: 'AC Relay & Fuse Kit', type: 'PART', price: 250 },
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

  // Primary Car & Customer Details
  const [carNumber, setCarNumber] = useState('');
  const [carModel, setCarModel] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [hasValidationError, setHasValidationError] = useState(false);

  // Assigned mechanic
  const [assignedEmployeeId, setAssignedEmployeeId] = useState<string>(
    employees[0]?.id || ''
  );

  // Job Items List
  const [items, setItems] = useState<JobItem[]>([
    { id: '1', name: 'AC Gas Refill (R134a)', type: 'SERVICE', price: 1800 },
    { id: '2', name: 'Cabin AC Filter Change', type: 'SERVICE', price: 450 },
  ]);

  const [discount, setDiscount] = useState<string>('0');

  // Custom Item Modal state
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemType, setNewItemType] = useState<'SERVICE' | 'PART'>('SERVICE');

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.price, 0), [items]);
  const discountVal = parseFloat(discount) || 0;
  const finalAmount = Math.max(0, subtotal - discountVal);

  const selectedMechanic = useMemo(() => {
    return employees.find((e) => e.id === assignedEmployeeId);
  }, [employees, assignedEmployeeId]);

  // Autofill from 1-tap sample vehicle pills
  const handleSelectRecentVehicle = (v: typeof RECENT_SAMPLE_VEHICLES[0]) => {
    setCarNumber(v.reg);
    setCarModel(v.model);
    setCustomerName(v.customer);
    setCustomerPhone(v.phone);
    setHasValidationError(false);
  };

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

    const entId = enterpriseId || 'enterprise-dev-001';
    const newJobId = generateNewJobId();
    const jobNum = generateNewJobNumber();
    const finalModel = carModel.trim() || 'Car';
    const finalCustName = customerName.trim() || 'Walk-in Customer';
    const finalCustPhone = customerPhone.trim();

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
      subtotal,
      discount: discountVal,
      finalAmount,
      totalPaid: 0,
      pendingAmount: finalAmount,
      paymentStatus: 'PENDING' as const,
      notes: 'Car AC repair & maintenance service',
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
      console.log('[CreateJobSheet] Firestore error:', err);
    }

    addJobSheet(newJob as any);

    Alert.alert(
      'Job Sheet Created!',
      `Job Sheet #${jobNum} created for ${finalModel} (${cleanReg})\nTotal: ${currencySymbol}${finalAmount}\nAssigned: ${selectedMechanic?.name || 'General Workshop'}`,
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
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 20 }}>
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
              New Job Sheet
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, fontWeight: '600' }}>
              Cool Car AC Repair
            </Text>
          </View>

          {/* Quick status pill in header */}
          <View
            style={{
              backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 14,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
              {formatCurrency(finalAmount, currencySymbol)}
            </Text>
          </View>
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
          {/* STEP 1: Car & Customer Information Card (The First & Most Important Section) */}
          <View
            style={{
              marginBottom: 20,
              backgroundColor: isDark ? '#141926' : '#F8FAFD',
              padding: 16,
              borderRadius: 24,
              borderWidth: 1.5,
              borderColor: hasValidationError && !carNumber.trim() ? '#EF4444' : cardBorder,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
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
                  <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '800' }}>Required</Text>
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
                      {v.reg} ({v.model.split(' ')[0]})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Input 1: Car Registration Number (PROMINENT) */}
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                Car Number *
              </Text>
              <TextInput
                value={carNumber}
                onChangeText={(text) => {
                  setCarNumber(text);
                  if (text.trim()) setHasValidationError(false);
                }}
                placeholder="e.g. MH 02 AB 1234"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                style={{
                  backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  fontWeight: '800',
                  color: isDark ? '#FFFFFF' : '#0C1829',
                  borderWidth: 1,
                  borderColor: hasValidationError && !carNumber.trim() ? '#EF4444' : cardBorder,
                  letterSpacing: 1,
                }}
              />
            </View>

            {/* Input 2: Car Model & Make */}
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                Car Model
              </Text>
              <TextInput
                value={carModel}
                onChangeText={setCarModel}
                placeholder="e.g. Honda City ZX / Swift Dzire"
                placeholderTextColor="#94A3B8"
                style={{
                  backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontWeight: '700',
                  color: isDark ? '#FFFFFF' : '#0C1829',
                  borderWidth: 1,
                  borderColor: cardBorder,
                }}
              />
            </View>

            {/* Inputs 3 & 4: Customer Name and Phone */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                  Customer Name
                </Text>
                <TextInput
                  value={customerName}
                  onChangeText={setCustomerName}
                  placeholder="e.g. Rajesh Sharma"
                  placeholderTextColor="#94A3B8"
                  style={{
                    backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                    borderRadius: 16,
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
                  placeholder="e.g. 9820112345"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  style={{
                    backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                    borderRadius: 16,
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
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <UserCheck size={16} color="#6B9FE8" />
                <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  Assign Mechanic / Staff
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/staff' as any)}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B9FE8' }}>
                  Manage Staff
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 10 }}>
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
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: 18,
                      backgroundColor: isSelected
                        ? (isDark ? '#FFFFFF' : '#0C1829')
                        : (isDark ? '#141926' : '#F4F7FC'),
                      borderWidth: 1,
                      borderColor: isSelected ? (isDark ? '#FFFFFF' : '#0C1829') : cardBorder,
                    }}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: isSelected
                          ? (isDark ? '#0C1829' : '#FFFFFF')
                          : '#6B9FE8',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected ? (
                        <Check size={14} color={isDark ? '#FFFFFF' : '#0C1829'} strokeWidth={3} />
                      ) : (
                        <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
                          {emp.name.charAt(0)}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 13,
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

          {/* STEP 3: Quick Add Popular Car AC Jobs */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Sparkles size={16} color="#6B9FE8" />
              <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                Quick Add AC Services & Parts
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 10 }}>
              {POPULAR_AC_ITEMS.map((item, idx) => (
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
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                Job Items ({items.length})
              </Text>
              <TouchableOpacity
                onPress={() => setIsAddItemModalOpen(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: isDark ? '#141926' : '#F4F7FC',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <Plus size={14} color={isDark ? '#FFFFFF' : '#0C1829'} />
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
                    padding: 14,
                    borderRadius: 20,
                    backgroundColor: isDark ? '#141926' : '#F8FAFD',
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: isDark ? '#1C2538' : '#0C1829',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.type === 'PART' ? <Package size={15} color="#FFFFFF" /> : <Wrench size={15} color="#FFFFFF" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 1 }}>
                        {item.type === 'SERVICE' ? 'Labor / Service' : 'Spare Part'}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                      {formatCurrency(item.price, currencySymbol)}
                    </Text>
                    <TouchableOpacity onPress={() => setItems(items.filter((i) => i.id !== item.id))}>
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* STEP 5: Pricing Summary Card */}
          <GlassCard
            variant={isDark ? 'navy' : 'sand'}
            padding={18}
            style={{ borderRadius: 24, marginBottom: 24, gap: 10 }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '600' }}>Subtotal</Text>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 15, fontWeight: '800' }}>
                {formatCurrency(subtotal, currencySymbol)}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '600' }}>Discount ({currencySymbol})</Text>
              <TextInput
                value={discount}
                onChangeText={setDiscount}
                keyboardType="numeric"
                style={{
                  width: 80,
                  textAlign: 'right',
                  color: '#EF4444',
                  fontSize: 15,
                  fontWeight: '800',
                  paddingVertical: 2,
                  paddingHorizontal: 8,
                  backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                  borderRadius: 8,
                }}
              />
            </View>

            <View style={{ height: 1, backgroundColor: cardBorder }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 17, fontWeight: '900' }}>
                  Total Bill
                </Text>
                <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>
                  Assigned: {selectedMechanic?.name || 'Workshop'}
                </Text>
              </View>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 24, fontWeight: '900' }}>
                {formatCurrency(finalAmount, currencySymbol)}
              </Text>
            </View>
          </GlassCard>

          {/* Solid Midnight Navy CTA Button */}
          <TouchableOpacity
            onPress={handleCreateJobSheet}
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
              Create Job Sheet
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

            {/* Type selector: Service vs Part */}
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

            {/* Item Name */}
            <TextInput
              value={newItemName}
              onChangeText={setNewItemName}
              placeholder="Item name (e.g. AC Gas Refill)"
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

            {/* Item Price */}
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
