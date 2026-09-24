// ============================================================
// Add Purchase Chalan Screen — Cool Car Workshop
// Module 4: Daily Inward Spare Parts Purchase Entry
// Supports 10-N items & Multi-Car Allocation per Chalan
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
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Package,
  Plus,
  Trash2,
  Car,
  Receipt,
  Check,
  Calendar,
  Clock,
  Layers,
  Store,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useChalanStore } from '../../src/store/chalanStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { useExpenseStore } from '../../src/store/expenseStore';
import { BankPaymentSelector } from '../../src/components/common/BankPaymentSelector';
import { ChalanItem, PurchaseChalan } from '../../src/types/chalan.types';
import { PaymentMode } from '../../src/types/payment.types';
import { formatCurrency } from '../../src/utils/currency';
import { ThemedAlert, ThemedAlertProps } from '../../src/components/common/ThemedAlert';
import { CalendarPickerModal } from '../../src/components/common/CalendarPickerModal';

const VENDOR_PRESETS = [
  'National Auto Spares',
  'Metro Car AC Emporium',
  'Sharma Motor Parts',
  'Bosch Genuine Distributor',
  'Subros Authorized Spares',
];

const VEHICLE_PRESETS = [
  { reg: 'MH02AB1234', model: 'Honda City ZX' },
  { reg: 'DL04CD5678', model: 'Hyundai Creta SX' },
  { reg: 'MH04EF9012', model: 'Maruti Brezza ZDi' },
  { reg: 'General Stock', model: 'Workshop Stock' },
];

interface FormChalanItem {
  id: string;
  partName: string;
  quantity: string;
  unitPrice: string;
  assignedVehicleNumber: string;
  assignedVehicleModel?: string;
}

export default function AddPurchaseChalanScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();

  const { addChalan } = useChalanStore();
  const { accounts, debitAccount } = useBankAccountStore();
  const { addExpense } = useExpenseStore();

  // Basic Info
  const [chalanNumber, setChalanNumber] = useState(() => `CH-${Math.floor(1000 + Math.random() * 9000)}`);
  const [vendorName, setVendorName] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [notes, setNotes] = useState('');

  const now = new Date();
  const [date, setDate] = useState(now.toISOString().split('T')[0]);
  const [time] = useState(
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  );

  // Dynamic 10-N Items
  const [items, setItems] = useState<FormChalanItem[]>([
    {
      id: '1',
      partName: '',
      quantity: '1',
      unitPrice: '',
      assignedVehicleNumber: 'MH02AB1234',
      assignedVehicleModel: 'Honda City ZX',
    },
  ]);

  // Payment Settlement
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'bank-cash');
  const [selectedAccountName, setSelectedAccountName] = useState<string>(
    accounts[0]?.accountName || 'Cash Counter'
  );
  const [amountPaidCustom, setAmountPaidCustom] = useState<string | null>(null);

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

  // Totals
  const grandTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const q = parseFloat(item.quantity) || 0;
      const p = parseFloat(item.unitPrice) || 0;
      return sum + q * p;
    }, 0);
  }, [items]);

  const effectiveAmountPaid = amountPaidCustom !== null ? parseFloat(amountPaidCustom) || 0 : grandTotal;
  const remainingDue = Math.max(0, grandTotal - effectiveAmountPaid);

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        partName: '',
        quantity: '1',
        unitPrice: '',
        assignedVehicleNumber: 'General Stock',
        assignedVehicleModel: 'Workshop Stock',
      },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) {
      Alert.alert('Minimum One Item', 'A purchase chalan must have at least one spare part item.');
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof FormChalanItem, val: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const setItemVehicle = (index: number, reg: string, model?: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        assignedVehicleNumber: reg,
        assignedVehicleModel: model || reg,
      };
      return next;
    });
  };

  const handleSaveChalan = () => {
    if (!chalanNumber.trim()) {
      showAlert('Chalan No Required', 'Please enter a chalan number.', 'warning');
      return;
    }
    if (!vendorName.trim()) {
      showAlert('Vendor Required', 'Please enter or select a supplier / vendor name.', 'warning');
      return;
    }

    // Validate items
    const invalidItem = items.find((it) => !it.partName.trim() || !(parseFloat(it.unitPrice) > 0));
    if (invalidItem) {
      showAlert(
        'Incomplete Parts',
        'Please ensure each spare part has a name and a valid purchase price.',
        'warning'
      );
      return;
    }

    const compiledItems: ChalanItem[] = items.map((it) => {
      const q = parseFloat(it.quantity) || 1;
      const p = parseFloat(it.unitPrice) || 0;
      return {
        id: it.id,
        partName: it.partName.trim(),
        quantity: q,
        unitPrice: p,
        totalPrice: q * p,
        assignedVehicleNumber: it.assignedVehicleNumber.trim() || 'General Stock',
        assignedVehicleModel: it.assignedVehicleModel || 'Workshop Stock',
      };
    });

    const newChalan: PurchaseChalan = {
      id: `chalan_${Date.now()}`,
      chalanNumber: chalanNumber.trim(),
      vendorName: vendorName.trim(),
      vendorPhone: vendorPhone.trim(),
      date,
      time,
      items: compiledItems,
      totalAmount: grandTotal,
      amountPaid: effectiveAmountPaid,
      pendingAmount: remainingDue,
      paymentMode: effectiveAmountPaid > 0 ? (paymentMode as any) : 'PENDING',
      bankAccountId: effectiveAmountPaid > 0 ? selectedAccountId : undefined,
      bankAccountName: effectiveAmountPaid > 0 ? selectedAccountName : undefined,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addChalan(newChalan);

    // Auto-debit bank account if payment made
    if (effectiveAmountPaid > 0) {
      debitAccount(selectedAccountId, effectiveAmountPaid);

      // Auto-log to expense store
      addExpense({
        id: `exp_chalan_${Date.now()}`,
        enterpriseId: enterpriseId || 'enterprise-cool-car',
        categoryId: 'cat_parts',
        categoryName: `Spare Parts Purchase (${chalanNumber.trim()})`,
        amount: effectiveAmountPaid,
        description: `Chalan ${chalanNumber.trim()} from ${vendorName.trim()} (${items.length} items)`,
        spentBy: 'Workshop Store',
        time,
        paymentMode: paymentMode,
        paymentAccountId: selectedAccountId,
        paymentAccountName: selectedAccountName,
        date,
        voided: false,
        createdBy: 'Workshop Store',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    showAlert(
      'Chalan Saved Successfully',
      `Chalan ${newChalan.chalanNumber} for ${items.length} items (Total: ₹${grandTotal.toLocaleString()}) recorded.`,
      'success',
      [{ text: 'View Chalans', style: 'default', onPress: () => router.replace('/inventory') }]
    );
  };

  const canvasBg = isDark ? '#000000' : '#F4F6F9';
  const headerBg = isDark ? '#0A0D14' : '#153580';
  const sheetBg = isDark ? '#000000' : '#F4F6F9';
  const cardBg = isDark ? '#141A23' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(43, 53, 68, 0.08)';
  const inputBg = isDark ? '#1C2538' : '#F8FAFD';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" />

      {/* Signboard Royal Blue Header */}
      <View style={{ backgroundColor: headerBg, paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.18)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900', letterSpacing: -0.3 }}>
              Inward Purchase Chalan
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, fontWeight: '600', marginTop: 1 }}>
              Daily Spare Parts Entry
            </Text>
          </View>

          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Main Content Area */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          marginTop: -14,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
          paddingTop: 16,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section: Chalan & Supplier Info */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: cardBorder,
              padding: 18,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#60A5FA' : '#153580', textTransform: 'uppercase', marginBottom: 14 }}>
              Chalan & Supplier Details
            </Text>

            {/* Chalan No & Date Row */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>
                  Chalan / Bill No *
                </Text>
                <TextInput
                  value={chalanNumber}
                  onChangeText={setChalanNumber}
                  placeholder="e.g. CH-9402"
                  placeholderTextColor="#94A3B8"
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 14,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    fontWeight: '800',
                    color: textPrimary,
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>
                  Date & Time
                </Text>
                <TouchableOpacity
                  onPress={() => setIsCalendarOpen(true)}
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 14,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary }}>
                    📅 {date} • {time}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Vendor Name */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>
              Supplier / Vendor Name *
            </Text>
            <TextInput
              value={vendorName}
              onChangeText={setVendorName}
              placeholder="e.g. National Auto Spares"
              placeholderTextColor="#94A3B8"
              style={{
                backgroundColor: inputBg,
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
                fontWeight: '700',
                color: textPrimary,
                marginBottom: 10,
              }}
            />

            {/* Quick Vendor Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
              {VENDOR_PRESETS.map((v) => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setVendorName(v)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 14,
                    backgroundColor: vendorName === v ? '#153580' : isDark ? '#222D42' : '#E2E8F0',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: vendorName === v ? '#FFFFFF' : textPrimary,
                    }}
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Section: Items with Multi-Car Tagging (10-N Items) */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '900', color: textPrimary }}>
                  Parts in this Chalan ({items.length})
                </Text>
                <Text style={{ fontSize: 12, color: textMuted, fontWeight: '600', marginTop: 1 }}>
                  Tag each part to a vehicle or workshop stock
                </Text>
              </View>

              <TouchableOpacity
                onPress={addItemRow}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: '#153580',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 16,
                }}
              >
                <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                  Add Part
                </Text>
              </TouchableOpacity>
            </View>

            {/* Items Cards */}
            {items.map((item, index) => {
              const rowTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);

              return (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 22,
                    borderWidth: 1,
                    borderColor: cardBorder,
                    padding: 16,
                    marginBottom: 14,
                  }}
                >
                  {/* Row Header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: '#153580',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '900' }}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: textPrimary }}>
                        Part Item #{index + 1}
                      </Text>
                    </View>

                    {items.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeItemRow(index)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={15} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Part Name */}
                  <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted, marginBottom: 5 }}>
                    Spare Part Name & Specs *
                  </Text>
                  <TextInput
                    value={item.partName}
                    onChangeText={(val) => updateItem(index, 'partName', val)}
                    placeholder="e.g. Denso AC Compressor / Front Brake Pads"
                    placeholderTextColor="#94A3B8"
                    style={{
                      backgroundColor: inputBg,
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      fontSize: 14,
                      fontWeight: '700',
                      color: textPrimary,
                      marginBottom: 12,
                    }}
                  />

                  {/* Qty, Unit Price & Row Total */}
                  <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted, marginBottom: 5 }}>
                        Quantity
                      </Text>
                      <TextInput
                        value={item.quantity}
                        onChangeText={(val) => updateItem(index, 'quantity', val)}
                        keyboardType="numeric"
                        placeholder="1"
                        placeholderTextColor="#94A3B8"
                        style={{
                          backgroundColor: inputBg,
                          borderRadius: 12,
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                          fontSize: 14,
                          fontWeight: '800',
                          color: textPrimary,
                          textAlign: 'center',
                        }}
                      />
                    </View>

                    <View style={{ flex: 1.4 }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted, marginBottom: 5 }}>
                        Price / Unit (₹) *
                      </Text>
                      <TextInput
                        value={item.unitPrice}
                        onChangeText={(val) => updateItem(index, 'unitPrice', val)}
                        keyboardType="numeric"
                        placeholder="0.00"
                        placeholderTextColor="#94A3B8"
                        style={{
                          backgroundColor: inputBg,
                          borderRadius: 12,
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                          fontSize: 14,
                          fontWeight: '800',
                          color: textPrimary,
                        }}
                      />
                    </View>

                    <View style={{ flex: 1.4 }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted, marginBottom: 5 }}>
                        Item Total
                      </Text>
                      <View
                        style={{
                          backgroundColor: inputBg,
                          borderRadius: 12,
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                        }}
                      >
                        <Text style={{ fontSize: 14, fontWeight: '900', color: isDark ? '#60A5FA' : '#153580' }}>
                          ₹{rowTotal.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Assigned Car / Vehicle Tagging */}
                  <View
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      backgroundColor: isDark ? '#111622' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: cardBorder,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <Car size={14} color={isDark ? '#60A5FA' : '#153580'} />
                      <Text style={{ fontSize: 11, fontWeight: '800', color: textPrimary, textTransform: 'uppercase' }}>
                        Brought for Vehicle (Car Tag):
                      </Text>
                    </View>

                    {/* Quick Car Chips */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingBottom: 6 }}>
                      {VEHICLE_PRESETS.map((vp) => {
                        const isSelected = item.assignedVehicleNumber === vp.reg;
                        return (
                          <TouchableOpacity
                            key={vp.reg}
                            onPress={() => setItemVehicle(index, vp.reg, vp.model)}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 10,
                              backgroundColor: isSelected ? (isDark ? '#FFFFFF' : '#0C1829') : isDark ? '#222D42' : '#F1F5F9',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: '700',
                                color: isSelected ? (isDark ? '#0C1829' : '#FFFFFF') : textPrimary,
                              }}
                            >
                              {vp.reg} {vp.reg !== 'General Stock' ? `(${vp.model.split(' ')[0]})` : ''}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>

                    {/* Custom Car Input */}
                    <TextInput
                      value={item.assignedVehicleNumber}
                      onChangeText={(val) => updateItem(index, 'assignedVehicleNumber', val)}
                      placeholder="Or enter custom Car No (e.g. MH01AB1122)"
                      placeholderTextColor="#94A3B8"
                      style={{
                        backgroundColor: inputBg,
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        fontSize: 12,
                        fontWeight: '700',
                        color: textPrimary,
                        marginTop: 4,
                      }}
                    />
                  </View>
                </View>
              );
            })}

            {/* Add More Items Button */}
            <TouchableOpacity
              onPress={addItemRow}
              style={{
                borderWidth: 1.5,
                borderColor: '#153580',
                borderStyle: 'dashed',
                borderRadius: 20,
                paddingVertical: 14,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
              }}
            >
              <Plus size={18} color="#153580" />
              <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#60A5FA' : '#153580' }}>
                + Add Another Part to Chalan (10-N items)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section: Financial Summary & Settlement */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: cardBorder,
              padding: 18,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#60A5FA' : '#153580', textTransform: 'uppercase', marginBottom: 14 }}>
              Payment & Settlement
            </Text>

            {/* Total Chalan Amount */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: textMuted }}>
                Total Chalan Bill:
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: textPrimary }}>
                ₹{grandTotal.toLocaleString()}
              </Text>
            </View>

            {/* Amount Paid Now Input */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: textMuted }}>
                Amount Paid Now:
              </Text>
              <View style={{ width: 140 }}>
                <TextInput
                  value={amountPaidCustom !== null ? amountPaidCustom : String(grandTotal)}
                  onChangeText={(val) => setAmountPaidCustom(val)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    fontSize: 16,
                    fontWeight: '900',
                    color: '#00C896',
                    textAlign: 'right',
                  }}
                />
              </View>
            </View>

            {/* Remaining Pending to Vendor */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: cardBorder,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: remainingDue > 0 ? '#EF4444' : '#00C896' }}>
                {remainingDue > 0 ? 'Balance Due to Vendor:' : 'Payment Status:'}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '900', color: remainingDue > 0 ? '#EF4444' : '#00C896' }}>
                {remainingDue > 0 ? `₹${remainingDue.toLocaleString()}` : 'Fully Paid ✓'}
              </Text>
            </View>
          </View>

          {/* Bank & Payment Mode Selector */}
          {effectiveAmountPaid > 0 && (
            <View style={{ marginBottom: 20 }}>
              <BankPaymentSelector
                paymentMode={paymentMode}
                onPaymentModeChange={setPaymentMode}
                selectedAccountId={selectedAccountId}
                onAccountChange={(id: string, name: string) => {
                  setSelectedAccountId(id);
                  setSelectedAccountName(name);
                }}
                label="Pay Supplier Using"
              />
            </View>
          )}

          {/* Notes */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>
              Chalan Notes / Comments (Optional)
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Urgent morning delivery, 1 coil warranty replacement"
              placeholderTextColor="#94A3B8"
              style={{
                backgroundColor: inputBg,
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                color: textPrimary,
              }}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSaveChalan}
            activeOpacity={0.88}
            style={{
              backgroundColor: '#153580',
              borderRadius: 24,
              paddingVertical: 18,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#153580',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900' }}>
              Save Purchase Chalan (₹{grandTotal.toLocaleString()})
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
        title="Select Chalan Date"
      />

      {/* THEMED CUSTOM ALERT MODAL */}
      <ThemedAlert {...alertConfig} />
    </View>
  );
}
