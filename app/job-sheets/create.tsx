// ============================================================
// Create Job Sheet Screen — Cool Car Workshop
// AC vs Mechanical Dropdown inside sheet, Quick-Add Dropdown,
// Tap-to-Edit items, Model Year + Distinct Car Illustration,
// Interactive Calendar Date Picker & Themed Alert Dialogs
// ============================================================

import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Car,
  Plus,
  Trash2,
  Edit2,
  Wrench,
  Package,
  UserCheck,
  Check,
  X,
  Sparkles,
  Phone,
  User,
  AlertCircle,
  Calendar as CalendarIcon,
  Clock,
  Search,
  RotateCcw,
  CheckSquare,
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
import { useCustomerStore } from '../../src/store/customerStore';
import { useVehicleStore } from '../../src/store/vehicleStore';
import { usePaymentStore } from '../../src/store/paymentStore';
import { WorkCategory } from '../../src/types/jobSheet.types';
import { PaymentMode } from '../../src/types/payment.types';
import { ThemedAlert, ThemedAlertProps } from '../../src/components/common/ThemedAlert';
import { CalendarPickerModal } from '../../src/components/common/CalendarPickerModal';
import { DynamicCarIllustration } from '../../src/components/common/CarIllustrations';
import { YEARS_LIST } from '../../src/utils/carDatabase';
import { STANDARD_18_ROUTINE_ITEMS } from '../../src/constants/routineCheckup';

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

// 1-Tap Quick Standard Services & Parts Chips (Cool Car Workshop Core)
const STANDARD_SERVICES_AND_PARTS = [
  { name: 'AC Gas Refill (R134a)', price: 1800, type: 'SERVICE' as const, emoji: '❄️' },
  { name: 'Cooling Coil Service & Clean', price: 2500, type: 'SERVICE' as const, emoji: '❄️' },
  { name: 'AC Compressor Service / Repair', price: 3500, type: 'SERVICE' as const, emoji: '❄️' },
  { name: 'Cabin AC Filter OEM', price: 450, type: 'PART' as const, emoji: '❄️' },
  { name: 'AC Condenser Wash', price: 800, type: 'SERVICE' as const, emoji: '❄️' },
  { name: 'Front Brake Pads Replacement', price: 1500, type: 'SERVICE' as const, emoji: '🔧' },
  { name: 'Engine Oil & Filter Service', price: 2200, type: 'SERVICE' as const, emoji: '🔧' },
  { name: 'Coolant Flush & Clean', price: 950, type: 'SERVICE' as const, emoji: '🔧' },
  { name: 'Full Workshop General Service', price: 3200, type: 'SERVICE' as const, emoji: '🔧' },
];

interface JobItem {
  id: string;
  name: string;
  type: 'SERVICE' | 'PART';
  price: number;
}

export default function CreateJobSheetScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const { addJobSheet } = useJobSheetStore();
  const rawEmployees = useEmployeeStore((s) => s.employees);
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const rawAccounts = useBankAccountStore((s) => s.accounts);
  const accounts = Array.isArray(rawAccounts) ? rawAccounts : [];
  const creditAccount = useBankAccountStore((s) => s.creditAccount);

  // Work Type: Dropdown inside Job Sheet
  const [workCategory, setWorkCategory] = useState<WorkCategory>('AC');
  const [isWorkCategoryModalOpen, setIsWorkCategoryModalOpen] = useState(false);

  // Date & Log Time
  const [jobDate, setJobDate] = useState(new Date().toISOString().split('T')[0]);
  const [jobTime, setJobTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Car Details
  const [carNumber, setCarNumber] = useState('');
  const [carModel, setCarModel] = useState('');
  const [modelYear, setModelYear] = useState('2022');
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

  // Customer Details (Optional)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [hasValidationError, setHasValidationError] = useState(false);

  // Financials
  const [previousPending, setPreviousPending] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [amountPaidNow, setAmountPaidNow] = useState('0');

  // Payment Mode & Bank Selection
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'bank-cash');
  const [selectedAccountName, setSelectedAccountName] = useState<string>(accounts[0]?.accountName || 'Cash Counter');

  // Staff Assignment
  const [assignedEmployeeId, setAssignedEmployeeId] = useState<string>(employees[0]?.id || '');

  // Job Items List
  const [items, setItems] = useState<JobItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Add Services Dropdown Modal & Category Tabs
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [presetCategory, setPresetCategory] = useState<'ALL' | 'AC' | 'MECHANICAL' | 'PARTS'>('ALL');
  const [quickAddSearch, setQuickAddSearch] = useState('');

  // Custom Item Modal
  const [isAddCustomModalOpen, setIsAddCustomModalOpen] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [customItemType, setCustomItemType] = useState<'SERVICE' | 'PART'>('SERVICE');

  // Edit Item Modal (Tap to Edit)
  const [editingItem, setEditingItem] = useState<JobItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editType, setEditType] = useState<'SERVICE' | 'PART'>('SERVICE');

  // Manual Routine Check-Up (18 checkpoints)
  const [routineValues, setRoutineValues] = useState<Record<string, string>>({});
  const [isRoutineSectionOpen, setIsRoutineSectionOpen] = useState(false);

  const filledRoutineCount = useMemo(() => {
    return STANDARD_18_ROUTINE_ITEMS.filter((it) => {
      const v = routineValues[it.key];
      return Boolean(v && v.trim() !== '');
    }).length;
  }, [routineValues]);

  const handleUpdateRoutineItem = (key: string, value: string) => {
    setRoutineValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleMarkAllRoutineOk = () => {
    const allOk: Record<string, string> = {};
    STANDARD_18_ROUTINE_ITEMS.forEach((it) => {
      allOk[it.key] = it.defaultVal;
    });
    setRoutineValues(allOk);
  };

  const handleClearAllRoutine = () => {
    setRoutineValues({});
  };

  // Custom Themed Alert
  const [alertConfig, setAlertConfig] = useState<ThemedAlertProps>({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = (title: string, message: string, type: 'error' | 'warning' | 'success' | 'info' = 'warning', buttons?: any[]) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      buttons: buttons || [{ text: 'OK', style: 'default' }],
      onClose: () => setAlertConfig((prev) => ({ ...prev, visible: false })),
    });
  };

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

  // Combined Active Presets with Category Filtering
  const allPresets = useMemo(() => {
    let list: Array<{ name: string; type: 'SERVICE' | 'PART'; price: number; category: 'AC' | 'MECHANICAL' | 'PARTS'; emoji: string }> = [
      ...AC_PRESETS.map((p) => ({
        ...p,
        category: (p.type === 'PART' ? 'PARTS' : 'AC') as 'AC' | 'MECHANICAL' | 'PARTS',
        emoji: '❄️',
      })),
      ...MECHANICAL_PRESETS.map((p) => ({
        ...p,
        category: (p.type === 'PART' ? 'PARTS' : 'MECHANICAL') as 'AC' | 'MECHANICAL' | 'PARTS',
        emoji: '🔧',
      })),
    ];

    if (presetCategory === 'AC') {
      list = list.filter((p) => p.category === 'AC');
    } else if (presetCategory === 'MECHANICAL') {
      list = list.filter((p) => p.category === 'MECHANICAL');
    } else if (presetCategory === 'PARTS') {
      list = list.filter((p) => p.category === 'PARTS' || p.type === 'PART');
    }

    if (!quickAddSearch.trim()) return list;
    const q = quickAddSearch.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q));
  }, [quickAddSearch, presetCategory]);

  const handleTogglePresetItem = (preset: { name: string; type: 'SERVICE' | 'PART'; price: number }) => {
    const existingIndex = items.findIndex((i) => i.name === preset.name);
    if (existingIndex >= 0) {
      setItems((prev) => prev.filter((_, idx) => idx !== existingIndex));
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: Date.now().toString() + Math.random().toString().slice(2, 6),
          name: preset.name,
          type: preset.type,
          price: preset.price,
        },
      ]);
    }
  };


  // Open Edit Modal for an item
  const openEditModal = (item: JobItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditPrice(String(item.price));
    setEditType(item.type);
  };

  const handleSaveEditedItem = () => {
    if (!editingItem) return;
    if (!editName.trim()) {
      showAlert('Name Required', 'Please enter a valid item name.');
      return;
    }
    const priceNum = parseFloat(editPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showAlert('Price Required', 'Please enter a valid price.');
      return;
    }

    setItems((prev) =>
      prev.map((it) =>
        it.id === editingItem.id
          ? { ...it, name: editName.trim(), price: priceNum, type: editType }
          : it
      )
    );
    setEditingItem(null);
  };

  const handleAddCustomItem = () => {
    if (!customItemName.trim()) {
      showAlert('Name Required', 'Please enter a valid item name.');
      return;
    }
    const priceNum = parseFloat(customItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showAlert('Price Required', 'Please enter a valid price.');
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString().slice(2, 6),
        name: customItemName.trim(),
        type: customItemType,
        price: priceNum,
      },
    ]);
    setCustomItemName('');
    setCustomItemPrice('');
    setIsAddCustomModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  };

  const handleCreateJobSheet = async () => {
    const cleanReg = carNumber.trim().toUpperCase().replace(/\s+/g, '');

    if (!cleanReg) {
      setHasValidationError(true);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      showAlert(
        'Car Number Required',
        'Please enter the Vehicle / Car Registration Number (e.g. MH02AB1234). It serves as the unique garage ID.',
        'warning'
      );
      return;
    }

    if (items.length === 0) {
      showAlert('Add Items', 'Please add at least one service or spare part to this job sheet.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const entId = enterpriseId || 'enterprise-cool-car';
      const newJobId = `JS-${Date.now()}`;
      const jobNum = `CCG-${Math.floor(1000 + Math.random() * 9000)}`;
      const finalModel = carModel.trim() ? `${carModel.trim()} (${modelYear})` : `Vehicle (${modelYear})`;
      const finalCustName = customerName.trim() || 'Walk-in Customer';
      const finalCustPhone = customerPhone.trim();

      const actualPaid = paidNowVal > 0 ? paidNowVal : 0;
      const actualPending = Math.max(0, totalBillDue - actualPaid);
      const isPaid = actualPending === 0 && totalBillDue > 0;
      const paymentStatus = isPaid ? 'PAID' : (actualPaid > 0 ? 'PARTIALLY_PAID' : 'PENDING');

      const custId = `cust-${cleanReg.toLowerCase()}`;
      const vehId = `veh-${cleanReg.toLowerCase()}`;

      const newJob = {
        id: newJobId,
        enterpriseId: entId,
        jobNumber: jobNum,
        customerId: custId,
        customerName: finalCustName,
        customerPhone: finalCustPhone,
        vehicleId: vehId,
        vehicleNumber: cleanReg,
        vehicleMake: finalModel.split(' ')[0] || 'Car',
        vehicleModel: finalModel,
        workCategory,
        date: jobDate,
        time: jobTime,
        status: 'IN_PROGRESS' as any,
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
        amountCollectedNow: actualPaid,
        totalPaid: actualPaid,
        pendingAmount: actualPending,
        paymentStatus: paymentStatus as any,
        routineCheckup: routineValues,
        notes: `${workCategory} Work Order - Intaken at Cool Car`,
        voided: false,
        createdBy: 'Cool Car Manager',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 1. Add to local JobSheet store
      addJobSheet(newJob as any);

      // 2. Add customer & vehicle to local directory stores
      const customerData = {
        id: custId,
        enterpriseId: entId,
        name: finalCustName,
        phone: finalCustPhone,
        address: '',
        totalVisits: 1,
        totalSpent: totalBillDue,
        outstandingBalance: actualPending,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      useCustomerStore.getState().addCustomer(customerData as any);

      const vehicleData = {
        id: vehId,
        enterpriseId: entId,
        customerId: custId,
        registrationNumber: cleanReg,
        make: finalModel.split(' ')[0] || 'Car',
        model: finalModel,
        year: Number(modelYear) || new Date().getFullYear(),
        customerName: finalCustName,
        customerPhone: finalCustPhone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      useVehicleStore.getState().addVehicle(vehicleData as any);

      // 3. Process payment if paid now
      if (actualPaid > 0 && selectedAccountId) {
        creditAccount(selectedAccountId, actualPaid);
        const payId = `pay-${Date.now()}`;
        const payData = {
          id: payId,
          enterpriseId: entId,
          jobSheetId: newJobId,
          customerId: custId,
          vehicleId: vehId,
          amount: actualPaid,
          paymentMode,
          paymentAccountId: selectedAccountId,
          paymentAccountName: selectedAccountName,
          date: new Date().toISOString(),
          referenceNumber: `REC-${Date.now().toString().slice(-4)}`,
          voided: false,
          createdBy: 'Cool Car Manager',
          createdAt: new Date().toISOString(),
        };
        usePaymentStore.getState().addPayment(payData as any);
      }

      // 4. Cloud Firestore Persistent Sync
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');

        // Write JobSheet
        await setDoc(doc(db, 'enterprises', entId, 'jobSheets', newJobId), newJob);

        // Auto-save Customer in directory
        await setDoc(doc(db, 'enterprises', entId, 'customers', custId), customerData, { merge: true });

        // Auto-save Vehicle in fleet
        await setDoc(doc(db, 'enterprises', entId, 'vehicles', vehId), vehicleData, { merge: true });

        // Write Payment if applicable
        if (actualPaid > 0) {
          const payId = `pay-${Date.now()}`;
          const payData = {
            id: payId,
            enterpriseId: entId,
            jobSheetId: newJobId,
            customerId: custId,
            vehicleId: vehId,
            amount: actualPaid,
            paymentMode,
            paymentAccountId: selectedAccountId,
            paymentAccountName: selectedAccountName,
            date: new Date().toISOString(),
            referenceNumber: `REC-${Date.now().toString().slice(-4)}`,
            voided: false,
            createdBy: 'Cool Car Manager',
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'enterprises', entId, 'payments', payId), payData);
        }
      } catch (cloudErr) {
        console.log('[CreateJob] Cloud sync notice:', cloudErr);
      }

      showAlert(
        'Job Sheet Created!',
        `Job Sheet #${jobNum} created for ${finalModel} (${cleanReg}).\nTotal Bill: ₹${totalBillDue.toLocaleString()}.\nSaved to Cloud Firestore.`,
        'success',
        [
          {
            text: 'View Job Sheets',
            onPress: () => router.replace('/job-sheets'),
          },
        ]
      );
    } catch (err: any) {
      console.log('[CreateJob] error:', err);
      showAlert('Error', err?.message || 'Could not create job sheet. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canvasBg = isDark ? '#000000' : '#153580';
  const sheetBg = isDark ? '#0A0D14' : '#F4F6F9';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(43, 53, 68, 0.08)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      {/* Royal Blue Top Header */}
      <View style={{ backgroundColor: canvasBg, paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 16 }}>

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
              Create Daily Job Sheet
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
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '900' }}>
              {formatCurrency(totalBillDue, currencySymbol)}
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
          paddingTop: 20,
          paddingHorizontal: 20,
        }}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* STEP 1: WORK CATEGORY DROPDOWN INSIDE JOB SHEET (No top tab buttons) */}
          <View
            style={{
              backgroundColor: isDark ? '#141926' : '#F8FAFD',
              borderRadius: 20,
              padding: 14,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '800', color: isDark ? '#60A5FA' : '#153580', textTransform: 'uppercase', marginBottom: 6 }}>
              Nature of Work (Job Category) *
            </Text>

            <TouchableOpacity
              onPress={() => setIsWorkCategoryModalOpen(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                {workCategory === 'AC'
                  ? '❄️ Car AC Repair & Service'
                  : workCategory === 'MECHANICAL'
                  ? '🔧 Mechanical Repair & Service'
                  : '⚙️ Complete AC & Mechanical Work'}
              </Text>
              <ChevronDown size={18} color={isDark ? '#60A5FA' : '#153580'} />
            </TouchableOpacity>
          </View>

          {/* STEP 2: Car & Date Information */}
          <View
            style={{
              marginBottom: 16,
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
                  Car & Intake Date
                </Text>
              </View>

              {/* Live Distinct Car Silhouette Illustration */}
              <DynamicCarIllustration modelName={carModel} size={52} showBadge={true} />
            </View>

            {/* Date & Log Time Row */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
              <View style={{ flex: 1.2 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                  Job Intake Date
                </Text>
                <TouchableOpacity
                  onPress={() => setIsCalendarOpen(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                    borderRadius: 14,
                    paddingHorizontal: 12,
                    height: 44,
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                    📅 {jobDate}
                  </Text>
                  <CalendarIcon size={16} color={isDark ? '#60A5FA' : '#153580'} />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                  Intake Time
                </Text>
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
                  <Clock size={16} color={isDark ? '#60A5FA' : '#153580'} />
                  <TextInput
                    value={jobTime}
                    onChangeText={setJobTime}
                    placeholder="11:30 AM"
                    placeholderTextColor="#94A3B8"
                    style={{ flex: 1, color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 13, fontWeight: '800' }}
                  />
                </View>
              </View>
            </View>

            {/* Car Number & Model */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              <View style={{ flex: 1.2 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                  Car Number (Unique ID) *
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
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                  Car Model & Make
                </Text>
                <TextInput
                  value={carModel}
                  onChangeText={setCarModel}
                  placeholder="Honda City / Creta"
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

            {/* Model Year Selector Button (Tap opens 1950 - Current Year Modal) */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                Model Year
              </Text>
              <TouchableOpacity
                onPress={() => setIsYearPickerOpen(true)}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  height: 46,
                  borderWidth: 1,
                  borderColor: cardBorder,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <CalendarIcon size={16} color={isDark ? '#60A5FA' : '#153580'} />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                    Model Year:{' '}
                    <Text style={{ fontWeight: '900', color: isDark ? '#60A5FA' : '#153580' }}>
                      {modelYear}
                    </Text>
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: isDark ? '#60A5FA' : '#153580' }}>
                    Change (1950 - {YEARS_LIST[0]})
                  </Text>
                  <ChevronDown size={14} color={isDark ? '#60A5FA' : '#153580'} />
                </View>
              </TouchableOpacity>
            </View>


            {/* Customer Details (Optional) */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                  Customer Name (Optional)
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
                    paddingVertical: 9,
                    fontSize: 12,
                    fontWeight: '700',
                    color: isDark ? '#FFFFFF' : '#0C1829',
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
                  Mobile (Optional)
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
                    paddingVertical: 9,
                    fontSize: 12,
                    fontWeight: '700',
                    color: isDark ? '#FFFFFF' : '#0C1829',
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                />
              </View>
            </View>
          </View>

          {/* STEP 3: Assign Staff */}
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                Assigned Mechanic / Staff
              </Text>
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
                      gap: 6,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 14,
                      backgroundColor: isSelected ? (isDark ? '#FFFFFF' : '#0C1829') : isDark ? '#141926' : '#F4F7FC',
                      borderWidth: 1,
                      borderColor: cardBorder,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '800',
                        color: isSelected ? (isDark ? '#0C1829' : '#FFFFFF') : isDark ? '#FFFFFF' : '#0C1829',
                      }}
                    >
                      {emp.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* STEP 4: BILLED ITEMS (MODAL TO ADD & TAP TO EDIT) */}
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  Billed Items ({items.length})
                </Text>
                <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>
                  Tap any item below to edit price or name
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 6 }}>
                {/* Custom Item Button */}
                <TouchableOpacity
                  onPress={() => setIsAddCustomModalOpen(true)}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: isDark ? '#1C2538' : '#EFF6FF',
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(21, 53, 128, 0.2)',
                  }}
                >
                  <Plus size={14} color={isDark ? '#93C5FD' : '#153580'} strokeWidth={2.5} />
                  <Text style={{ color: isDark ? '#93C5FD' : '#153580', fontSize: 11, fontWeight: '800' }}>
                    + Custom
                  </Text>
                </TouchableOpacity>

                {/* Standard Services & Parts Popup Button */}
                <TouchableOpacity
                  onPress={() => setIsQuickAddModalOpen(true)}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: isDark ? '#FFFFFF' : '#153580',
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderRadius: 12,
                    shadowColor: '#153580',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Plus size={14} color={isDark ? '#0C1829' : '#FFFFFF'} strokeWidth={2.8} />
                  <Text style={{ color: isDark ? '#0C1829' : '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
                    + Standard
                  </Text>
                </TouchableOpacity>
              </View>
            </View>


            {/* Items List (Click to Edit) */}
            <View style={{ gap: 8 }}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => openEditModal(item)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 14,
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
                        backgroundColor: isDark ? '#1C2538' : '#E2E8F0',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.type === 'PART' ? <Package size={14} color={isDark ? '#60A5FA' : '#153580'} /> : <Wrench size={14} color="#00C896" />}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '700' }}>
                        {item.type === 'PART' ? 'Spare Part' : 'Service Labor'} • Tap to edit
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                      ₹{item.price.toLocaleString()}
                    </Text>

                    <Edit2 size={14} color={isDark ? '#60A5FA' : '#153580'} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* STEP 5: Financials & Previous Pending */}
          <View
            style={{
              backgroundColor: isDark ? '#141926' : '#F8FAFD',
              borderRadius: 22,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#60A5FA' : '#153580', textTransform: 'uppercase', marginBottom: 12 }}>
              Bill Breakdown & Pending Balance
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>Current Job Subtotal:</Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                ₹{currentSubtotal.toLocaleString()}
              </Text>
            </View>

            {/* Previous Pending */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 13, color: '#EF4444', fontWeight: '700' }}>Previous Pending Balance:</Text>
              <TextInput
                value={previousPending}
                onChangeText={setPreviousPending}
                keyboardType="numeric"
                style={{
                  width: 90,
                  backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                  borderRadius: 10,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  fontSize: 13,
                  fontWeight: '800',
                  color: '#EF4444',
                  textAlign: 'right',
                  borderWidth: 1,
                  borderColor: cardBorder,
                }}
              />
            </View>

            {/* Total Bill Due */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: cardBorder,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                Total Bill Payable:
              </Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                ₹{totalBillDue.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* ══ STEP: 18-POINT ROUTINE AC CHECK-UP (MANUAL OPTION) ══ */}
          <View
            style={{
              backgroundColor: isDark ? '#141926' : '#FFFFFF',
              borderRadius: 20,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
          >
            {/* Header / Toggle Button */}
            <TouchableOpacity
              onPress={() => setIsRoutineSectionOpen((prev) => !prev)}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                    18-Point Routine AC Check-Up
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 8,
                      backgroundColor:
                        filledRoutineCount > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '800',
                        color: filledRoutineCount > 0 ? '#10B981' : '#64748B',
                      }}
                    >
                      {filledRoutineCount > 0 ? `${filledRoutineCount}/18 Recorded` : 'Optional / Manual'}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 3 }}>
                  {isRoutineSectionOpen
                    ? 'Enter manual readings, tap OK ✓, or leave blank for pen writing'
                    : 'Tap to fill checkpoints now or print blank for manual pen entry'}
                </Text>
              </View>

              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isRoutineSectionOpen ? (
                  <ChevronUp size={16} color={isDark ? '#94A3B8' : '#64748B'} />
                ) : (
                  <ChevronDown size={16} color={isDark ? '#94A3B8' : '#64748B'} />
                )}
              </View>
            </TouchableOpacity>

            {/* Expanded Content */}
            {isRoutineSectionOpen && (
              <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: cardBorder, gap: 10 }}>
                {/* Action Buttons: Clear All & All OK */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginBottom: 4 }}>
                  <TouchableOpacity
                    onPress={handleClearAllRoutine}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 10,
                    }}
                  >
                    <RotateCcw size={12} color={isDark ? '#94A3B8' : '#64748B'} />
                    <Text style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: 11, fontWeight: '800' }}>
                      Clear All
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleMarkAllRoutineOk}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: '#153580',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 10,
                    }}
                  >
                    <Sparkles size={12} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>All OK ✓</Text>
                  </TouchableOpacity>
                </View>

                {/* 18 Checkpoints */}
                {STANDARD_18_ROUTINE_ITEMS.map((item) => {
                  const currentVal = routineValues[item.key] ?? '';
                  const isChecked = Boolean(currentVal && currentVal.trim() !== '');
                  return (
                    <View
                      key={item.key}
                      style={{
                        backgroundColor: isDark ? '#0D111A' : '#F8FAFC',
                        borderRadius: 12,
                        padding: 10,
                        borderWidth: 1,
                        borderColor: cardBorder,
                        gap: 6,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', flex: 1 }}>
                          {item.label}
                        </Text>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: isChecked ? '#10B981' : '#64748B' }}>
                          {currentVal || 'Blank'}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <TextInput
                          value={currentVal}
                          onChangeText={(t) => handleUpdateRoutineItem(item.key, t)}
                          placeholder={item.placeholder}
                          placeholderTextColor="#94A3B8"
                          style={{
                            flex: 1,
                            backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 6,
                            fontSize: 11,
                            fontWeight: '700',
                            color: isDark ? '#FFFFFF' : '#0F172A',
                            borderWidth: 1,
                            borderColor: cardBorder,
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => handleUpdateRoutineItem(item.key, 'OK ✓')}
                          style={{
                            backgroundColor: currentVal === 'OK ✓' ? '#10B981' : isDark ? '#1C2538' : '#FFFFFF',
                            paddingHorizontal: 9,
                            paddingVertical: 6,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: currentVal === 'OK ✓' ? '#10B981' : cardBorder,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: '800',
                              color: currentVal === 'OK ✓' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B',
                            }}
                          >
                            OK ✓
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleUpdateRoutineItem(item.key, item.defaultVal)}
                          style={{
                            backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                            paddingHorizontal: 8,
                            paddingVertical: 6,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: cardBorder,
                          }}
                        >
                          <Text style={{ fontSize: 10, fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B' }}>
                            Std
                          </Text>
                        </TouchableOpacity>

                        {isChecked && (
                          <TouchableOpacity
                            onPress={() => handleUpdateRoutineItem(item.key, '')}
                            style={{
                              backgroundColor: isDark ? '#2D1F2D' : '#FEE2E2',
                              paddingHorizontal: 7,
                              paddingVertical: 6,
                              borderRadius: 8,
                            }}
                          >
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#EF4444' }}>✕</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            onPress={handleCreateJobSheet}
            activeOpacity={0.88}
            style={{
              backgroundColor: isDark ? '#FFFFFF' : '#0C1829',
              borderRadius: 24,
              paddingVertical: 18,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <Text style={{ color: isDark ? '#0C1829' : '#FFFFFF', fontSize: 16, fontWeight: '900' }}>
              Create Job Sheet (₹{totalBillDue.toLocaleString()})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* MODAL 1: WORK CATEGORY PICKER */}
      <Modal
        visible={isWorkCategoryModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsWorkCategoryModalOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsWorkCategoryModalOpen(false)}
          style={styles.modalOverlay}
        >
          <View style={[styles.pickerModal, { backgroundColor: isDark ? '#141926' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0C1829' }]}>
              Select Work Category
            </Text>

            <TouchableOpacity
              onPress={() => {
                setWorkCategory('AC');
                setIsWorkCategoryModalOpen(false);
              }}
              style={styles.modalOption}
            >
              <Text style={{ fontSize: 15, fontWeight: '800', color: workCategory === 'AC' ? (isDark ? '#60A5FA' : '#153580') : isDark ? '#FFFFFF' : '#0C1829' }}>
                ❄️ Car AC Repair & Service
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setWorkCategory('MECHANICAL');
                setIsWorkCategoryModalOpen(false);
              }}
              style={styles.modalOption}
            >
              <Text style={{ fontSize: 15, fontWeight: '800', color: workCategory === 'MECHANICAL' ? (isDark ? '#60A5FA' : '#153580') : isDark ? '#FFFFFF' : '#0C1829' }}>
                🔧 Mechanical Repair & Service
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setWorkCategory('BOTH');
                setIsWorkCategoryModalOpen(false);
              }}
              style={styles.modalOption}
            >
              <Text style={{ fontSize: 15, fontWeight: '800', color: workCategory === 'BOTH' ? (isDark ? '#60A5FA' : '#153580') : isDark ? '#FFFFFF' : '#0C1829' }}>
                ⚙️ Complete AC & Mechanical Work
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL 2: QUICK-ADD STANDARD SERVICES & PARTS POPUP */}
      <Modal
        visible={isQuickAddModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsQuickAddModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.sheetModal,
              {
                backgroundColor: isDark ? '#111622' : '#FFFFFF',
                maxHeight: '85%',
                width: '92%',
                maxWidth: 440,
                padding: 18,
              },
            ]}
          >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  Standard Services & Parts
                </Text>
                <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                  Tap to add or remove standard catalog items
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsQuickAddModalOpen(false)}
                style={{ padding: 6, borderRadius: 8, backgroundColor: isDark ? '#1C2538' : '#F1F5F9' }}
              >
                <X size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            {/* Category Filter Tabs */}
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
              {(
                [
                  { key: 'ALL', label: 'All' },
                  { key: 'AC', label: '❄️ AC' },
                  { key: 'MECHANICAL', label: '🔧 Mech' },
                  { key: 'PARTS', label: '📦 Parts' },
                ] as const
              ).map((tab) => {
                const isActive = presetCategory === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setPresetCategory(tab.key)}
                    style={{
                      flex: 1,
                      paddingVertical: 7,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isActive
                        ? '#153580'
                        : isDark
                        ? '#1C2538'
                        : '#F1F5F9',
                      borderWidth: 1,
                      borderColor: isActive ? '#153580' : cardBorder,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '800',
                        color: isActive ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B',
                      }}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Search */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                borderRadius: 12,
                paddingHorizontal: 12,
                height: 40,
                gap: 8,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            >
              <Search size={15} color="#64748B" />
              <TextInput
                value={quickAddSearch}
                onChangeText={setQuickAddSearch}
                placeholder="Search AC gas, coil, brake pads, oil..."
                placeholderTextColor="#94A3B8"
                style={{ flex: 1, fontSize: 13, color: isDark ? '#FFFFFF' : '#0C1829' }}
              />
              {quickAddSearch.length > 0 && (
                <TouchableOpacity onPress={() => setQuickAddSearch('')}>
                  <X size={14} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Presets List */}
            <ScrollView showsVerticalScrollIndicator={true} style={{ maxHeight: 280 }}>
              {allPresets.length === 0 ? (
                <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>
                    No matching items found
                  </Text>
                </View>
              ) : (
                allPresets.map((preset, idx) => {
                  const isAdded = items.some((it) => it.name === preset.name);
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleTogglePresetItem(preset)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderRadius: 12,
                        marginBottom: 6,
                        backgroundColor: isAdded
                          ? isDark
                            ? 'rgba(21, 53, 128, 0.25)'
                            : '#EFF4FF'
                          : isDark
                          ? '#161E2E'
                          : '#F8FAFD',
                        borderWidth: 1,
                        borderColor: isAdded ? '#153580' : cardBorder,
                      }}
                    >
                      <View style={{ flex: 1, marginRight: 10 }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: '800',
                            color: isDark ? '#FFFFFF' : '#0C1829',
                          }}
                        >
                          {preset.emoji} {preset.name}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                          {preset.type === 'PART' ? 'Spare Part' : 'Service Labor'} • ₹{preset.price.toLocaleString()}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                          paddingVertical: 6,
                          paddingHorizontal: 10,
                          borderRadius: 8,
                          backgroundColor: isAdded ? '#059669' : '#153580',
                        }}
                      >
                        {isAdded ? (
                          <>
                            <Check size={13} color="#FFFFFF" strokeWidth={3} />
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFFFFF' }}>Added</Text>
                          </>
                        ) : (
                          <>
                            <Plus size={13} color="#FFFFFF" strokeWidth={3} />
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFFFFF' }}>Add</Text>
                          </>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>

            {/* Bottom Done CTA */}
            <TouchableOpacity
              onPress={() => setIsQuickAddModalOpen(false)}
              style={{
                marginTop: 14,
                backgroundColor: '#153580',
                paddingVertical: 13,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFFFFF' }}>
                Done ({items.length} {items.length === 1 ? 'Item' : 'Items'} in Job Sheet)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2.5: ADD CUSTOM ITEM MODAL */}
      <Modal
        visible={isAddCustomModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddCustomModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.dialogModal, { backgroundColor: isDark ? '#121A29' : '#FFFFFF' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                Add Custom Item
              </Text>
              <TouchableOpacity
                onPress={() => setIsAddCustomModalOpen(false)}
                style={{ padding: 4, borderRadius: 8, backgroundColor: isDark ? '#1C2538' : '#F1F5F9' }}
              >
                <X size={16} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            {/* Type Selector (Service vs Part) */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => setCustomItemType('SERVICE')}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 10,
                  alignItems: 'center',
                  backgroundColor: customItemType === 'SERVICE' ? '#153580' : (isDark ? '#1C2538' : '#F1F5F9'),
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '800', color: customItemType === 'SERVICE' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B') }}>
                  🔧 Service / Labor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCustomItemType('PART')}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 10,
                  alignItems: 'center',
                  backgroundColor: customItemType === 'PART' ? '#153580' : (isDark ? '#1C2538' : '#F1F5F9'),
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '800', color: customItemType === 'PART' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B') }}>
                  📦 Spare Part
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
              Item or Service Name
            </Text>
            <TextInput
              value={customItemName}
              onChangeText={setCustomItemName}
              placeholder="e.g. Front Bumper Repair, AC Sensor"
              placeholderTextColor="#94A3B8"
              style={{
                backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 13,
                fontWeight: '700',
                color: isDark ? '#FFFFFF' : '#0C1829',
                marginBottom: 10,
              }}
            />

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
              Price (₹)
            </Text>
            <TextInput
              value={customItemPrice}
              onChangeText={setCustomItemPrice}
              placeholder="0"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              style={{
                backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                fontWeight: '900',
                color: isDark ? '#FFFFFF' : '#0C1829',
                marginBottom: 16,
              }}
            />

            {/* Actions: Add / Cancel */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setIsAddCustomModalOpen(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: 'center',
                  backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddCustomItem}
                style={{
                  flex: 1.5,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: 'center',
                  backgroundColor: '#153580',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '900', color: '#FFFFFF' }}>
                  Add Item
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: TAP-TO-EDIT ITEM MODAL */}
      <Modal
        visible={editingItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.dialogModal, { backgroundColor: isDark ? '#121A29' : '#FFFFFF' }]}>
            <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829', marginBottom: 12 }}>
              Edit Billed Item
            </Text>

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
              Item / Service Name
            </Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              style={{
                backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 13,
                fontWeight: '700',
                color: isDark ? '#FFFFFF' : '#0C1829',
                marginBottom: 10,
              }}
            />

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4 }}>
              Price (₹)
            </Text>
            <TextInput
              value={editPrice}
              onChangeText={setEditPrice}
              keyboardType="numeric"
              style={{
                backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                fontWeight: '900',
                color: isDark ? '#FFFFFF' : '#0C1829',
                marginBottom: 16,
              }}
            />

            {/* Actions: Save / Delete / Cancel */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {editingItem && (
                <TouchableOpacity
                  onPress={() => handleDeleteItem(editingItem.id)}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => setEditingItem(null)}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? '#1C2538' : '#E2E8F0',
                  paddingVertical: 12,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 13, fontWeight: '800' }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveEditedItem}
                style={{
                  flex: 1.5,
                  backgroundColor: '#153580',
                  paddingVertical: 12,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '900' }}>
                  Save Item
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FULL MODEL YEAR SCROLLER MODAL (1950 to Current Year) */}
      <Modal
        visible={isYearPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsYearPickerOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsYearPickerOpen(false)}
        >
          <View
            style={[
              styles.sheetModal,
              {
                backgroundColor: isDark ? '#111622' : '#FFFFFF',
                maxHeight: '75%',
              },
            ]}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0C1829', marginBottom: 0 }]}>
                Select Model Year
              </Text>
              <TouchableOpacity onPress={() => setIsYearPickerOpen(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={true} style={{ flexGrow: 0 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {YEARS_LIST.map((yr) => {
                  const isSelected = modelYear === String(yr);
                  return (
                    <TouchableOpacity
                      key={yr}
                      onPress={() => {
                        setModelYear(String(yr));
                        setIsYearPickerOpen(false);
                      }}
                      style={{
                        width: '22%',
                        paddingVertical: 10,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected
                          ? '#153580'
                          : isDark
                          ? '#1C2538'
                          : '#F1F5F9',
                        borderWidth: 1,
                        borderColor: isSelected ? '#153580' : cardBorder,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '800',
                          color: isSelected ? '#FFFFFF' : isDark ? '#FFFFFF' : '#0C1829',
                        }}
                      >
                        {yr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* CALENDAR PICKER MODAL */}
      <CalendarPickerModal
        visible={isCalendarOpen}
        selectedDate={jobDate}
        onSelectDate={setJobDate}
        onClose={() => setIsCalendarOpen(false)}
        title="Select Job Intake Date"
      />

      {/* THEMED CUSTOM ALERT (Replaces native OS alert) */}
      <ThemedAlert {...alertConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  pickerModal: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  dialogModal: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  sheetModal: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 14,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.12)',
  },
});
