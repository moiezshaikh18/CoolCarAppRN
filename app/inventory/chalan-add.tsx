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
  ActivityIndicator,
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
  Search,
  ChevronDown,
  X,
} from 'lucide-react-native';
import { Modal } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useChalanStore } from '../../src/store/chalanStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { useVehicleStore } from '../../src/store/vehicleStore';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { BankPaymentSelector } from '../../src/components/common/BankPaymentSelector';
import { ChalanItem, PurchaseChalan } from '../../src/types/chalan.types';
import { PaymentMode } from '../../src/types/payment.types';
import { formatCurrency } from '../../src/utils/currency';
import { cleanFirestoreData } from '../../src/services/firebase/firestore.service';
import { ThemedAlert, ThemedAlertProps } from '../../src/components/common/ThemedAlert';
import { CalendarPickerModal } from '../../src/components/common/CalendarPickerModal';
import { usePermissions } from '../../src/hooks/usePermissions';
import { getDealersFromFirestore, upsertDealerInFirestore } from '../../src/services/dealer.service';

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
  const { canManageChalans } = usePermissions();

  React.useEffect(() => {
    if (!canManageChalans) {
      router.back();
    }
  }, [canManageChalans]);

  const { addChalan } = useChalanStore();
  const { accounts, debitAccount } = useBankAccountStore();
  const directoryVehicles = useVehicleStore((s) => s.vehicles);
  const activeJobs = useJobSheetStore((s) => s.jobSheets);

  const availableVehicles = useMemo(() => {
    const list: Array<{ reg: string; model: string }> = [
      { reg: 'General Stock', model: 'Workshop Stock' },
    ];
    activeJobs.forEach((j) => {
      if (j.vehicleNumber && !list.some((item) => item.reg === j.vehicleNumber)) {
        list.push({ reg: j.vehicleNumber, model: j.vehicleModel || 'Car' });
      }
    });
    directoryVehicles.forEach((v) => {
      if (v.registrationNumber && !list.some((item) => item.reg === v.registrationNumber)) {
        list.push({ reg: v.registrationNumber, model: v.model || 'Car' });
      }
    });
    return list;
  }, [directoryVehicles, activeJobs]);

  // Basic Info
  const [chalanNumber, setChalanNumber] = useState(() => `CH-${Math.floor(1000 + Math.random() * 9000)}`);
  const [vendorName, setVendorName] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Dealer Directory Auto-Suggestions from DB
  const [dealerList, setDealerList] = useState<Array<{ name: string; phone?: string }>>([]);
  const [showDealerSuggestions, setShowDealerSuggestions] = useState(false);

  React.useEffect(() => {
    const entId = enterpriseId || 'enterprise-cool-car';
    getDealersFromFirestore(entId).then((dealers) => {
      const mapped = dealers.map((d) => ({ name: d.name, phone: d.phone }));
      const chalansList = useChalanStore.getState().chalans;
      chalansList.forEach((c) => {
        if (c.vendorName && !mapped.some((m) => m.name.toLowerCase() === c.vendorName.toLowerCase())) {
          mapped.push({ name: c.vendorName, phone: c.vendorPhone });
        }
      });
      setDealerList(mapped);
    });
  }, [enterpriseId]);

  const dealerSuggestions = useMemo(() => {
    if (!vendorName.trim()) return [];
    const q = vendorName.toLowerCase().trim();
    return dealerList.filter((d) => d.name.toLowerCase().includes(q) && d.name.toLowerCase() !== q);
  }, [vendorName, dealerList]);

  const now = new Date();
  const [date, setDate] = useState(now.toISOString().split('T')[0]);
  const [time, setTime] = useState(
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  );

  // Dynamic 10-N Items
  const [items, setItems] = useState<FormChalanItem[]>([
    {
      id: '1',
      partName: '',
      quantity: '1',
      unitPrice: '',
      assignedVehicleNumber: 'General Stock',
      assignedVehicleModel: 'Workshop Stock',
    },
  ]);

  // Payment Settlement: DEFAULT TO UNPAID / CREDIT
  const [paymentStatusOption, setPaymentStatusOption] = useState<'UNPAID' | 'PAID' | 'PARTIAL'>('UNPAID');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'bank-cash');
  const [selectedAccountName, setSelectedAccountName] = useState<string>(
    accounts[0]?.accountName || 'Cash Counter'
  );
  const [amountPaidCustom, setAmountPaidCustom] = useState<string>('0');

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      onClose: () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        if (type === 'success') {
          router.replace('/inventory');
        }
      },
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

  // Effective Paid Amount: 0 when UNPAID, grandTotal when PAID, custom when PARTIAL
  const effectiveAmountPaid = useMemo(() => {
    if (grandTotal === 0) return 0;
    if (paymentStatusOption === 'UNPAID') return 0;
    if (paymentStatusOption === 'PAID') return grandTotal;
    const parsed = parseFloat(amountPaidCustom);
    return isNaN(parsed) ? 0 : Math.min(grandTotal, Math.max(0, parsed));
  }, [paymentStatusOption, amountPaidCustom, grandTotal]);

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

  const handleSaveChalan = async () => {
    if (isSubmitting) return;

    if (!chalanNumber.trim()) {
      showAlert('Chalan No Required', 'Please enter a chalan number.', 'warning');
      return;
    }
    if (!vendorName.trim()) {
      showAlert('Vendor Required', 'Please enter or select a supplier / vendor name.', 'warning');
      return;
    }

    // Filter valid items (ignore empty rows)
    const validItems = items.filter((it) => it.partName.trim() && parseFloat(it.unitPrice) > 0);
    if (validItems.length === 0) {
      showAlert(
        'Incomplete Parts',
        'Please enter at least one spare part with a name and a valid purchase price.',
        'warning'
      );
      return;
    }

    const compiledItems: ChalanItem[] = validItems.map((it) => {
      const q = parseFloat(it.quantity) || 1;
      const p = parseFloat(it.unitPrice) || 0;
      return {
        id: it.id,
        partName: it.partName.trim(),
        quantity: q,
        unitPrice: p,
        totalPrice: q * p,
        assignedVehicleNumber: it.assignedVehicleNumber?.trim() || 'General Stock',
        assignedVehicleModel: it.assignedVehicleModel || 'Workshop Stock',
      };
    });

    const calculatedTotal = compiledItems.reduce((sum, it) => sum + it.totalPrice, 0);
    const actualPaid = Math.min(calculatedTotal, effectiveAmountPaid);
    const pendingDue = Math.max(0, calculatedTotal - actualPaid);

    const entId = enterpriseId || 'enterprise-cool-car';
    const newChalan: PurchaseChalan = {
      id: `chalan_${Date.now()}`,
      chalanNumber: chalanNumber.trim(),
      vendorName: vendorName.trim(),
      vendorPhone: vendorPhone.trim(),
      date,
      time,
      items: compiledItems,
      totalAmount: calculatedTotal,
      amountPaid: actualPaid,
      pendingAmount: pendingDue,
      paymentMode: actualPaid > 0 ? (paymentMode as any) : 'PENDING',
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(actualPaid > 0 && selectedAccountId ? { bankAccountId: selectedAccountId } : {}),
      ...(actualPaid > 0 && selectedAccountName ? { bankAccountName: selectedAccountName } : {}),
    };

    setIsSubmitting(true);
    try {
      addChalan(newChalan);

      // Auto-debit bank account ONLY if payment was made
      if (actualPaid > 0 && selectedAccountId) {
        debitAccount(selectedAccountId, actualPaid);
      }

      // Cloud Firestore Sync (Save Chalan & Upsert Dealer Directory)
      // Chalans are recorded in their own collection and NOT bundled into Daily Expenses!
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      await setDoc(doc(db, 'enterprises', entId, 'chalans', newChalan.id), cleanFirestoreData(newChalan));

      // Auto-save Dealer in DB for month/year purchasing analytics
      await upsertDealerInFirestore(
        entId,
        vendorName.trim(),
        vendorPhone.trim(),
        calculatedTotal,
        actualPaid,
        pendingDue,
        date,
        compiledItems.map((it) => it.partName)
      );

      showAlert(
        'Chalan Saved Successfully',
        `Chalan ${newChalan.chalanNumber} for ${compiledItems.length} items recorded.\nTotal: ₹${calculatedTotal.toLocaleString()} | Paid: ₹${actualPaid.toLocaleString()} | Due: ₹${pendingDue.toLocaleString()}`,
        'success',
        [{ text: 'Done', style: 'default', onPress: () => router.replace('/inventory') }]
      );
    } catch (err: any) {
      console.log('[SaveChalan] Error:', err);
      showAlert('Save Error', err?.message || 'Could not save purchase chalan. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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

              <View style={{ flex: 1.2 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>
                  Date & Time
                </Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <TouchableOpacity
                    onPress={() => setIsCalendarOpen(true)}
                    style={{
                      flex: 1.2,
                      backgroundColor: inputBg,
                      borderRadius: 14,
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: textPrimary }} numberOfLines={1}>
                      📅 {date}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsTimePickerOpen(true)}
                    style={{
                      flex: 1,
                      backgroundColor: inputBg,
                      borderRadius: 14,
                      paddingHorizontal: 8,
                      paddingVertical: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: textPrimary }} numberOfLines={1}>
                      ⏰ {time}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Dealer / Supplier Name */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>
              Dealer / Supplier Name *
            </Text>
            <TextInput
              value={vendorName}
              onChangeText={(val) => {
                setVendorName(val);
                setShowDealerSuggestions(true);
              }}
              onFocus={() => setShowDealerSuggestions(true)}
              placeholder="e.g. National Auto Spares / Bosch Spares"
              placeholderTextColor="#94A3B8"
              style={{
                backgroundColor: inputBg,
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
                fontWeight: '700',
                color: textPrimary,
                marginBottom: showDealerSuggestions && dealerSuggestions.length > 0 ? 4 : 10,
              }}
            />

            {/* Live Dealer Suggestions Dropdown from Database */}
            {showDealerSuggestions && dealerSuggestions.length > 0 && (
              <View
                style={{
                  backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                  borderRadius: 14,
                  padding: 8,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#CBD5E1',
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, paddingHorizontal: 6, paddingVertical: 2 }}>
                  Previously Saved Dealers (Tap to Select):
                </Text>
                {dealerSuggestions.slice(0, 4).map((d) => (
                  <TouchableOpacity
                    key={d.name}
                    onPress={() => {
                      setVendorName(d.name);
                      if (d.phone) setVendorPhone(d.phone);
                      setShowDealerSuggestions(false);
                    }}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 8,
                      borderRadius: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '800', color: textPrimary }}>
                      🏢 {d.name}
                    </Text>
                    {d.phone ? (
                      <Text style={{ fontSize: 11, fontWeight: '600', color: textMuted }}>
                        📞 {d.phone}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Vendor Contact / Phone */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: textMuted, marginBottom: 6 }}>
              Dealer Contact / Phone (Optional)
            </Text>
            <TextInput
              value={vendorPhone}
              onChangeText={setVendorPhone}
              placeholder="e.g. 9822001122"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              style={{
                backgroundColor: inputBg,
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                fontWeight: '700',
                color: textPrimary,
                marginBottom: 6,
              }}
            />
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Car size={14} color={isDark ? '#60A5FA' : '#153580'} />
                        <Text style={{ fontSize: 11, fontWeight: '800', color: textPrimary, textTransform: 'uppercase' }}>
                          Vehicle Tag / Stock:
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setItemVehicle(index, 'General Stock', 'Workshop Stock')}
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 8,
                          backgroundColor: item.assignedVehicleNumber === 'General Stock' ? (isDark ? '#1E293B' : '#E2E8F0') : 'transparent',
                        }}
                      >
                        <Text style={{ fontSize: 11, fontWeight: '700', color: item.assignedVehicleNumber === 'General Stock' ? (isDark ? '#60A5FA' : '#153580') : textMuted }}>
                          📦 General Stock
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Direct Manual Vehicle Inputs */}
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                      <View style={{ flex: 1.2 }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, marginBottom: 4 }}>
                          Vehicle Number / Reg *
                        </Text>
                        <TextInput
                          value={item.assignedVehicleNumber === 'General Stock' ? '' : item.assignedVehicleNumber}
                          onChangeText={(val) => updateItem(index, 'assignedVehicleNumber', val || 'General Stock')}
                          placeholder="e.g. MH12AN8090"
                          placeholderTextColor="#94A3B8"
                          autoCapitalize="characters"
                          style={{
                            backgroundColor: inputBg,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 9,
                            fontSize: 13,
                            fontWeight: '700',
                            color: textPrimary,
                          }}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: textMuted, marginBottom: 4 }}>
                          Car Model (Optional)
                        </Text>
                        <TextInput
                          value={item.assignedVehicleModel === 'Workshop Stock' ? '' : item.assignedVehicleModel}
                          onChangeText={(val) => updateItem(index, 'assignedVehicleModel', val || 'Car')}
                          placeholder="e.g. Qualis / Innova"
                          placeholderTextColor="#94A3B8"
                          style={{
                            backgroundColor: inputBg,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 9,
                            fontSize: 13,
                            fontWeight: '700',
                            color: textPrimary,
                          }}
                        />
                      </View>
                    </View>

                    {/* Live Vehicle Auto-Suggestions from Garage Database */}
                    {item.assignedVehicleNumber !== 'General Stock' &&
                      item.assignedVehicleNumber.trim().length >= 2 &&
                      (() => {
                        const q = item.assignedVehicleNumber.toLowerCase().trim();
                        const matching = availableVehicles.filter(
                          (v) =>
                            v.reg !== 'General Stock' &&
                            (v.reg.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)) &&
                            v.reg.toLowerCase() !== q
                        );
                        if (matching.length === 0) return null;
                        return (
                          <View
                            style={{
                              backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                              borderRadius: 10,
                              padding: 6,
                              marginTop: 2,
                              borderWidth: 1,
                              borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
                            }}
                          >
                            <Text style={{ fontSize: 9, fontWeight: '800', color: textMuted, paddingHorizontal: 6, paddingVertical: 2 }}>
                              Matching Cars in Database (Tap to Select):
                            </Text>
                            {matching.slice(0, 3).map((vp) => (
                              <TouchableOpacity
                                key={vp.reg}
                                onPress={() => setItemVehicle(index, vp.reg, vp.model)}
                                style={{
                                  paddingVertical: 6,
                                  paddingHorizontal: 8,
                                  borderRadius: 6,
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <Text style={{ fontSize: 12, fontWeight: '800', color: textPrimary }}>
                                  🚗 {vp.reg}
                                </Text>
                                <Text style={{ fontSize: 11, fontWeight: '600', color: textMuted }}>
                                  {vp.model}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        );
                      })()}
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

            {/* Payment Choice Toggle: Unpaid / Credit vs Paid in Full vs Partial */}
            <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted, marginBottom: 8, textTransform: 'uppercase' }}>
              Select Payment Action:
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {/* Option 1: Unpaid / Credit (Default) */}
              <TouchableOpacity
                onPress={() => {
                  setPaymentStatusOption('UNPAID');
                  setAmountPaidCustom('0');
                }}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: paymentStatusOption === 'UNPAID' ? '#EF4444' : (isDark ? '#1C2538' : '#F1F5F9'),
                  borderWidth: 1,
                  borderColor: paymentStatusOption === 'UNPAID' ? '#EF4444' : cardBorder,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '800',
                    color: paymentStatusOption === 'UNPAID' ? '#FFFFFF' : textPrimary,
                  }}
                >
                  ⏳ Unpaid / Credit
                </Text>
              </TouchableOpacity>

              {/* Option 2: Fully Paid */}
              <TouchableOpacity
                onPress={() => {
                  setPaymentStatusOption('PAID');
                  setAmountPaidCustom(String(grandTotal));
                }}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: paymentStatusOption === 'PAID' ? '#00C896' : (isDark ? '#1C2538' : '#F1F5F9'),
                  borderWidth: 1,
                  borderColor: paymentStatusOption === 'PAID' ? '#00C896' : cardBorder,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '800',
                    color: paymentStatusOption === 'PAID' ? '#FFFFFF' : textPrimary,
                  }}
                >
                  ✓ Fully Paid
                </Text>
              </TouchableOpacity>

              {/* Option 3: Partial Payment */}
              <TouchableOpacity
                onPress={() => {
                  setPaymentStatusOption('PARTIAL');
                  if (parseFloat(amountPaidCustom) === 0 || amountPaidCustom === String(grandTotal)) {
                    setAmountPaidCustom(String(Math.round(grandTotal / 2)));
                  }
                }}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: paymentStatusOption === 'PARTIAL' ? '#F59E0B' : (isDark ? '#1C2538' : '#F1F5F9'),
                  borderWidth: 1,
                  borderColor: paymentStatusOption === 'PARTIAL' ? '#F59E0B' : cardBorder,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '800',
                    color: paymentStatusOption === 'PARTIAL' ? '#FFFFFF' : textPrimary,
                  }}
                >
                  💵 Partial Paid
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount Paid Now */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: textMuted }}>
                Amount Paid Now:
              </Text>
              {paymentStatusOption === 'PARTIAL' ? (
                <View style={{ width: 140 }}>
                  <TextInput
                    value={amountPaidCustom}
                    onChangeText={(val) => setAmountPaidCustom(val.replace(/[^0-9]/g, ''))}
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
                      color: '#F59E0B',
                      textAlign: 'right',
                      borderWidth: 1,
                      borderColor: '#F59E0B',
                    }}
                  />
                </View>
              ) : (
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '900',
                    color: effectiveAmountPaid > 0 ? '#00C896' : textMuted,
                  }}
                >
                  ₹{effectiveAmountPaid.toLocaleString()}
                </Text>
              )}
            </View>

            {/* Remaining Pending to Vendor / Accurate Payment Status */}
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
              <Text style={{ fontSize: 13, fontWeight: '700', color: textMuted }}>
                {remainingDue > 0 ? 'Balance Due to Dealer:' : 'Payment Status:'}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '900',
                  color:
                    grandTotal === 0
                      ? textMuted
                      : effectiveAmountPaid === 0
                      ? '#EF4444'
                      : remainingDue > 0
                      ? '#F59E0B'
                      : '#00C896',
                }}
              >
                {grandTotal === 0
                  ? 'Pending Parts'
                  : effectiveAmountPaid === 0
                  ? `Unpaid / Credit (₹${grandTotal.toLocaleString()} Due)`
                  : remainingDue > 0
                  ? `₹${remainingDue.toLocaleString()} Due`
                  : 'Fully Paid ✓'}
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
            disabled={isSubmitting}
            activeOpacity={0.88}
            style={{
              backgroundColor: isSubmitting ? '#94A3B8' : '#153580',
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
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900' }}>
                Save Purchase Chalan (₹{grandTotal.toLocaleString()})
              </Text>
            )}
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

      {/* TIME PICKER MODAL */}
      <Modal
        visible={isTimePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsTimePickerOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsTimePickerOpen(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 380,
              backgroundColor: isDark ? '#141926' : '#FFFFFF',
              borderRadius: 24,
              padding: 22,
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowRadius: 15,
              elevation: 8,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Clock size={20} color={isDark ? '#60A5FA' : '#153580'} />
                <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary }}>
                  Select Inward Time
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsTimePickerOpen(false)} hitSlop={10}>
                <X size={20} color={textMuted} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                const cur = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                setTime(cur);
                setIsTimePickerOpen(false);
              }}
              style={{
                backgroundColor: isDark ? '#1C2538' : '#EFF6FF',
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Text style={{ color: isDark ? '#60A5FA' : '#153580', fontSize: 13, fontWeight: '800' }}>
                ⚡ Set to Current Time
              </Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted, textTransform: 'uppercase', marginBottom: 10 }}>
              Quick Time Slots:
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {['09:00 AM', '10:30 AM', '11:45 AM', '01:30 PM', '03:15 PM', '05:00 PM', '06:30 PM', '08:00 PM'].map((slot) => (
                <TouchableOpacity
                  key={slot}
                  onPress={() => {
                    setTime(slot);
                    setIsTimePickerOpen(false);
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 12,
                    backgroundColor: time === slot ? (isDark ? '#FFFFFF' : '#153580') : isDark ? '#1C2538' : '#F1F5F9',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: time === slot ? (isDark ? '#0C1829' : '#FFFFFF') : textPrimary }}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setIsTimePickerOpen(false)}
              style={{
                backgroundColor: '#0C1829',
                borderRadius: 14,
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* THEMED CUSTOM ALERT MODAL */}
      <ThemedAlert {...alertConfig} />
    </View>
  );
}
