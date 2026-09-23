// ============================================================
// Create Job Sheet Screen — Section 10 & 11 Core Business Entity
// Features TWO explicit search modes:
// 1. Search by Vehicle Number
// 2. Search by Customer Name / Mobile Number
// Sky Blue & Midnight Navy Luxury Aesthetic (media_1790189780212.png)
// ============================================================

import React, { useState, useMemo } from 'react';
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
  Search,
  Car,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Wrench,
  Package,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { router } from 'expo-router';
import { useCustomerStore } from '../../src/store/customerStore';
import { useVehicleStore } from '../../src/store/vehicleStore';
import { useJobSheetStore } from '../../src/store/jobSheetStore';

interface MockVehicle {
  id: string;
  reg: string;
  make: string;
  model: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  lastVisit: string;
  pendingAmount: number;
}

interface MockCustomer {
  id: string;
  name: string;
  phone: string;
  vehicles: { id: string; reg: string; model: string }[];
  pendingAmount: number;
}

const DATABASE_VEHICLES: MockVehicle[] = [
  { id: 'v1', reg: 'DL04AB1234', make: 'Maruti', model: 'Swift', customerId: 'c1', customerName: 'Rahul Sharma', customerPhone: '9876543210', lastVisit: '10 May 2025', pendingAmount: 1000 },
  { id: 'v2', reg: 'UP32XY9876', make: 'Honda', model: 'City', customerId: 'c2', customerName: 'Priya Kapoor', customerPhone: '9811223344', lastVisit: '22 Apr 2025', pendingAmount: 0 },
  { id: 'v3', reg: 'HR26BC4321', make: 'Hyundai', model: 'i20', customerId: 'c3', customerName: 'Suresh Gupta', customerPhone: '9899001122', lastVisit: '05 Jan 2025', pendingAmount: 2500 },
];

const DATABASE_CUSTOMERS: MockCustomer[] = [
  {
    id: 'c1',
    name: 'Rahul Sharma',
    phone: '9876543210',
    pendingAmount: 1000,
    vehicles: [
      { id: 'v1', reg: 'DL04AB1234', model: 'Maruti Swift' },
      { id: 'v4', reg: 'DL08XY5678', model: 'Honda Amaze' },
    ],
  },
  {
    id: 'c2',
    name: 'Priya Kapoor',
    phone: '9811223344',
    pendingAmount: 0,
    vehicles: [
      { id: 'v2', reg: 'UP32XY9876', model: 'Honda City' },
    ],
  },
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
  const { customers } = useCustomerStore();
  const { vehicles } = useVehicleStore();
  const { addJobSheet } = useJobSheetStore();

  const [searchMode, setSearchMode] = useState<'vehicle' | 'customer'>('vehicle');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<MockVehicle | null>(null);

  const allVehicles: MockVehicle[] = useMemo(() => {
    const fromStore: MockVehicle[] = vehicles.map((v) => {
      const cust = customers.find((c) => c.id === v.customerId);
      return {
        id: v.id,
        reg: v.registrationNumber,
        make: v.make,
        model: v.model,
        customerId: v.customerId,
        customerName: cust?.name || 'Customer',
        customerPhone: cust?.phone || '',
        lastVisit: 'Recent',
        pendingAmount: cust?.pendingAmount || 0,
      };
    });
    return [...DATABASE_VEHICLES, ...fromStore];
  }, [vehicles, customers]);

  const vehicleResults = useMemo(() => {
    if (!searchQuery.trim() || searchMode !== 'vehicle') return [];
    const q = searchQuery.toLowerCase().replace(/\s+/g, '');
    return allVehicles.filter((v) => v.reg.toLowerCase().replace(/\s+/g, '').includes(q));
  }, [searchQuery, searchMode, allVehicles]);

  const customerResults = useMemo(() => {
    if (!searchQuery.trim() || searchMode !== 'customer') return [];
    const q = searchQuery.toLowerCase();
    return DATABASE_CUSTOMERS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [searchQuery, searchMode]);

  const [items, setItems] = useState<JobItem[]>([
    { id: '1', name: 'Oil Change', type: 'SERVICE', price: 1200 },
    { id: '2', name: 'Brake Service', type: 'SERVICE', price: 1500 },
    { id: '3', name: 'Oil Filter OEM', type: 'PART', price: 500 },
  ]);

  const [discount, setDiscount] = useState<string>('0');

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.price, 0), [items]);
  const discountVal = parseFloat(discount) || 0;
  const finalAmount = Math.max(0, subtotal - discountVal);

  const handleSelectVehicle = (v: MockVehicle) => {
    setSelectedVehicle(v);
    setSearchQuery('');
  };

  const handleSelectCustomerVehicle = (cust: MockCustomer, v: { id: string; reg: string; model: string }) => {
    setSelectedVehicle({
      id: v.id,
      reg: v.reg,
      make: v.model.split(' ')[0],
      model: v.model,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      lastVisit: 'Recent',
      pendingAmount: cust.pendingAmount,
    });
    setSearchQuery('');
  };

  const handleCreateJobSheet = async () => {
    if (!selectedVehicle) {
      Alert.alert('Vehicle Required', 'Please search and select a vehicle first.');
      return;
    }

    const entId = enterpriseId || 'enterprise-dev-001';
    const newJobId = generateNewJobId();
    const jobNum = generateNewJobNumber();

    const newJob = {
      id: newJobId,
      enterpriseId: entId,
      jobNumber: jobNum,
      customerId: selectedVehicle.customerId,
      customerName: selectedVehicle.customerName,
      customerPhone: selectedVehicle.customerPhone,
      vehicleId: selectedVehicle.id,
      vehicleNumber: selectedVehicle.reg,
      vehicleMake: selectedVehicle.make,
      vehicleModel: selectedVehicle.model,
      date: new Date().toISOString(),
      status: 'OPEN' as const,
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
      notes: 'Initial work order intake',
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
      'Job Sheet Created',
      `Job Sheet #${jobNum} created for ${selectedVehicle.model} (${selectedVehicle.reg}) for ${currencySymbol}${finalAmount}!`,
      [{ text: 'View All Jobs', onPress: () => router.replace('/job-sheets' as any) }]
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
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

          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
            New Work Order
          </Text>

          <View style={{ width: 44 }} />
        </View>

        {/* Search Mode Capsule */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.22)',
            borderRadius: 24,
            padding: 4,
            marginBottom: 14,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setSearchMode('vehicle');
              setSearchQuery('');
            }}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 20,
              alignItems: 'center',
              backgroundColor: searchMode === 'vehicle' ? '#FFFFFF' : 'transparent',
            }}
          >
            <Text
              style={{
                color: searchMode === 'vehicle' ? '#0C1829' : '#FFFFFF',
                fontSize: 13,
                fontWeight: '800',
              }}
            >
              Vehicle Number
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSearchMode('customer');
              setSearchQuery('');
            }}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 20,
              alignItems: 'center',
              backgroundColor: searchMode === 'customer' ? '#FFFFFF' : 'transparent',
            }}
          >
            <Text
              style={{
                color: searchMode === 'customer' ? '#0C1829' : '#FFFFFF',
                fontSize: 13,
                fontWeight: '800',
              }}
            >
              Customer Name/No.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pill Search Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#141926' : '#FFFFFF',
            borderRadius: 26,
            paddingHorizontal: 16,
            height: 52,
            gap: 12,
            borderWidth: 1,
            borderColor: cardBorder,
          }}
        >
          <Search size={18} color="#64748B" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              searchMode === 'vehicle'
                ? 'Search vehicle e.g. DL04AB1234'
                : 'Search customer e.g. Rahul or 9876543210'
            }
            placeholderTextColor="#94A3B8"
            autoCapitalize={searchMode === 'vehicle' ? 'characters' : 'none'}
            style={{
              flex: 1,
              color: isDark ? '#FFFFFF' : '#0C1829',
              fontSize: 14,
              fontWeight: '700',
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
          {/* Selected Vehicle or Search Results */}
          {selectedVehicle ? (
            <GlassCard
              variant={isDark ? 'navy' : 'sand'}
              padding={18}
              style={{ borderRadius: 24, marginBottom: 18 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: isDark ? '#1C2538' : '#0C1829',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Car size={20} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                      {selectedVehicle.model}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '700', marginTop: 2 }}>
                      {selectedVehicle.reg} • {selectedVehicle.customerName}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedVehicle(null)}
                  style={{
                    backgroundColor: '#FEE2E2',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 14,
                  }}
                >
                  <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '800' }}>Change</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          ) : vehicleResults.length > 0 ? (
            <View style={{ marginBottom: 18, gap: 10 }}>
              <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' }}>
                Search Results ({vehicleResults.length})
              </Text>
              {vehicleResults.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => handleSelectVehicle(v)}
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
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                      {v.reg} — {v.model}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                      {v.customerName} • {v.customerPhone}
                    </Text>
                  </View>
                  <ArrowRight size={16} color="#64748B" />
                </TouchableOpacity>
              ))}
            </View>
          ) : customerResults.length > 0 ? (
            <View style={{ marginBottom: 18, gap: 10 }}>
              <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' }}>
                Customer Results ({customerResults.length})
              </Text>
              {customerResults.map((c) => (
                <View
                  key={c.id}
                  style={{
                    padding: 14,
                    borderRadius: 20,
                    backgroundColor: isDark ? '#141926' : '#F8FAFD',
                    borderWidth: 1,
                    borderColor: cardBorder,
                    gap: 8,
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                    {c.name} ({c.phone})
                  </Text>
                  <View style={{ gap: 6 }}>
                    {c.vehicles.map((v) => (
                      <TouchableOpacity
                        key={v.id}
                        onPress={() => handleSelectCustomerVehicle(c, v)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 10,
                          borderRadius: 14,
                          backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                        }}
                      >
                        <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                          {v.model} ({v.reg})
                        </Text>
                        <ArrowRight size={14} color="#64748B" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {/* Job Items (Services & Spare Parts) */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                Services & Spare Parts
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setItems([
                    ...items,
                    { id: Date.now().toString(), name: 'General Labor Inspection', type: 'SERVICE', price: 800 },
                  ]);
                }}
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
                  Add Line
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
                        {item.type}
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

          {/* Pricing Summary Card */}
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
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 17, fontWeight: '900' }}>
                Total Job Value
              </Text>
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
    </View>
  );
}
