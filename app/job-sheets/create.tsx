// ============================================================
// Create Job Sheet Screen — Section 10 & 11 Core Business Entity
// Features TWO explicit search modes:
// 1. Search by Vehicle Number
// 2. Search by Customer Name / Mobile Number
// Luxury Warm-Minimalist Aesthetic (Nestora style)
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
  ArrowLeft,
  Search,
  Car,
  Plus,
  Trash2,
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
      { id: 'v1b', reg: 'DL04CD5678', model: 'Honda City' },
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

  // Step 1: Find Customer / Vehicle (Search Mode)
  const [searchMode, setSearchMode] = useState<'vehicle' | 'customer'>('vehicle');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Target
  const [selectedVehicle, setSelectedVehicle] = useState<MockVehicle | null>(null);

  // Combine static and live vehicles
  const allVehicles = useMemo(() => {
    const list: MockVehicle[] = [...DATABASE_VEHICLES];
    vehicles.forEach((v) => {
      if (!list.some((existing) => existing.reg === v.registrationNumber)) {
        list.push({
          id: v.id,
          reg: v.registrationNumber,
          make: v.make,
          model: `${v.make} ${v.model}`,
          customerId: v.customerId,
          customerName: v.customerName || 'Customer',
          customerPhone: v.customerPhone || '',
          lastVisit: 'Recent',
          pendingAmount: 0,
        });
      }
    });
    return list;
  }, [vehicles]);

  // Combine static and live customers
  const allCustomers = useMemo(() => {
    const list: MockCustomer[] = [...DATABASE_CUSTOMERS];
    customers.forEach((c) => {
      if (!list.some((existing) => existing.id === c.id)) {
        const custVehicles = allVehicles
          .filter((v) => v.customerId === c.id)
          .map((v) => ({ id: v.id, reg: v.reg, model: v.model }));
        list.push({
          id: c.id,
          name: c.name,
          phone: c.phone,
          pendingAmount: c.pendingAmount || 0,
          vehicles: custVehicles,
        });
      }
    });
    return list;
  }, [customers, allVehicles]);

  // Job Items (Services & Parts)
  const [items, setItems] = useState<JobItem[]>([
    { id: '1', name: 'Oil Change', type: 'SERVICE', price: 1200 },
    { id: '2', name: 'Brake Service', type: 'SERVICE', price: 1500 },
    { id: '3', name: 'Oil Filter', type: 'PART', price: 500 },
  ]);
  const [discount, setDiscount] = useState('200');

  // Search results
  const vehicleResults = useMemo(() => {
    if (!searchQuery.trim() || searchMode !== 'vehicle') return [];
    const q = searchQuery.toUpperCase().replace(/\s/g, '');
    return allVehicles.filter((v) => v.reg.replace(/\s/g, '').includes(q));
  }, [searchQuery, searchMode, allVehicles]);

  const customerResults = useMemo(() => {
    if (!searchQuery.trim() || searchMode !== 'customer') return [];
    const q = searchQuery.toLowerCase().trim();
    return allCustomers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [searchQuery, searchMode, allCustomers]);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discountNum = parseFloat(discount) || 0;
  const finalAmount = Math.max(0, subtotal - discountNum);

  const handleSelectVehicle = (vehicle: MockVehicle) => {
    setSelectedVehicle(vehicle);
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
      discount: discountNum,
      finalAmount,
      totalPaid: 0,
      pendingAmount: finalAmount,
      paymentStatus: 'PENDING' as const,
      voided: false,
      createdBy: 'user-owner-001',
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Symmetrical Top Header */}
      <View
        style={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 22,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? '#1C212B' : '#EFECE6',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color={theme.text} />
        </TouchableOpacity>
        <View>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
            New Job Sheet
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
            Work order & service billing
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 110 }}
      >
        {/* Step 1: Find Customer / Vehicle Box in Warm Sand */}
        {!selectedVehicle ? (
          <GlassCard
            variant="sand"
            padding={22}
            style={{
              borderRadius: 28,
              marginBottom: 18,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 17, fontWeight: '800', marginBottom: 4 }}>
              Find Customer / Vehicle (Section 10)
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 16 }}>
              Select search method to identify the vehicle and owner
            </Text>

            {/* TWO EXPLICIT SEARCH OPTIONS CAPSULE */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                borderRadius: 24,
                padding: 4,
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setSearchMode('vehicle');
                  setSearchQuery('');
                }}
                style={{
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 20,
                  alignItems: 'center',
                  backgroundColor: searchMode === 'vehicle' ? (isDark ? '#FFFFFF' : '#121214') : 'transparent',
                }}
              >
                <Text
                  style={{
                    color: searchMode === 'vehicle' ? (isDark ? '#121214' : '#FFFFFF') : theme.textMuted,
                    fontSize: 13,
                    fontWeight: '700',
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
                  paddingVertical: 11,
                  borderRadius: 20,
                  alignItems: 'center',
                  backgroundColor: searchMode === 'customer' ? (isDark ? '#FFFFFF' : '#121214') : 'transparent',
                }}
              >
                <Text
                  style={{
                    color: searchMode === 'customer' ? (isDark ? '#121214' : '#FFFFFF') : theme.textMuted,
                    fontSize: 13,
                    fontWeight: '700',
                  }}
                >
                  Customer Name/No.
                </Text>
              </TouchableOpacity>
            </View>

            {/* Luxury Search Pill */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                borderRadius: 24,
                paddingHorizontal: 16,
                height: 52,
                gap: 12,
              }}
            >
              <Search size={18} color={theme.textMuted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={
                  searchMode === 'vehicle'
                    ? 'e.g. DL04AB1234'
                    : 'e.g. Rahul or 9876543210'
                }
                placeholderTextColor={theme.textMuted}
                autoCapitalize={searchMode === 'vehicle' ? 'characters' : 'none'}
                style={{
                  flex: 1,
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: '600',
                }}
              />
            </View>

            {/* Quick Demo Pre-fill helpers */}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  setSearchMode('vehicle');
                  setSearchQuery('DL04');
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                }}
              >
                <Text style={{ color: theme.text, fontSize: 11, fontWeight: '700' }}>
                  Demo: DL04AB1234
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSearchMode('customer');
                  setSearchQuery('Rahul');
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                }}
              >
                <Text style={{ color: theme.text, fontSize: 11, fontWeight: '700' }}>
                  Demo: Rahul
                </Text>
              </TouchableOpacity>
            </View>

            {/* Vehicle Search Results */}
            {vehicleResults.length > 0 && (
              <View style={{ marginTop: 16, gap: 10 }}>
                {vehicleResults.map((v) => (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => handleSelectVehicle(v)}
                    style={{
                      padding: 16,
                      borderRadius: 22,
                      backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                        {v.model} ({v.reg})
                      </Text>
                      <Text style={{ color: theme.text, fontSize: 13, fontWeight: '800' }}>
                        Select →
                      </Text>
                    </View>
                    <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 4 }}>
                      Owner: {v.customerName} • {v.customerPhone}
                    </Text>
                    <Text style={{ color: v.pendingAmount > 0 ? (isDark ? '#F87171' : '#DC2626') : (isDark ? '#34D399' : '#16A34A'), fontSize: 12, marginTop: 4, fontWeight: '700' }}>
                      Pending: {currencySymbol}{v.pendingAmount} • Last Visit: {v.lastVisit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Customer Search Results */}
            {customerResults.length > 0 && (
              <View style={{ marginTop: 16, gap: 10 }}>
                {customerResults.map((cust) => (
                  <View
                    key={cust.id}
                    style={{
                      padding: 16,
                      borderRadius: 22,
                      backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    }}
                  >
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                      {cust.name} ({cust.phone})
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2, marginBottom: 10 }}>
                      {cust.vehicles.length} Vehicle(s) owned — Select one:
                    </Text>
                    {cust.vehicles.map((v) => (
                      <TouchableOpacity
                        key={v.id}
                        onPress={() => handleSelectCustomerVehicle(cust, v)}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingVertical: 10,
                          paddingHorizontal: 14,
                          backgroundColor: isDark ? '#1C212B' : '#EFECE6',
                          borderRadius: 14,
                          marginBottom: 6,
                        }}
                      >
                        <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>
                          🚗 {v.model} ({v.reg})
                        </Text>
                        <Text style={{ color: theme.text, fontSize: 13, fontWeight: '800' }}>
                          Select
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* If vehicle/customer not found fallback */}
            {searchQuery.trim().length > 0 &&
              ((searchMode === 'vehicle' && vehicleResults.length === 0) ||
                (searchMode === 'customer' && customerResults.length === 0)) && (
                <View
                  style={{
                    marginTop: 16,
                    padding: 16,
                    borderRadius: 20,
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                    No matching records found
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, textAlign: 'center' }}>
                    If vehicle or customer is not registered in this garage yet:
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 10, width: '100%', marginTop: 4 }}>
                    <TouchableOpacity
                      onPress={() => router.push('/customers/add')}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 18,
                        backgroundColor: isDark ? '#FFFFFF' : '#121214',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                        + Customer
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => router.push('/vehicles/add')}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 18,
                        backgroundColor: isDark ? '#1C212B' : '#EFECE6',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: theme.text, fontSize: 13, fontWeight: '800' }}>
                        + Vehicle
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
          </GlassCard>
        ) : (
          /* Selected Vehicle Header Banner */
          <GlassCard
            variant="sand"
            padding={20}
            style={{
              borderRadius: 28,
              marginBottom: 18,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Car size={24} color={theme.text} />
                </View>
                <View>
                  <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
                    {selectedVehicle.model}
                  </Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '800', marginTop: 2 }}>
                    {selectedVehicle.reg}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedVehicle(null)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 14,
                  backgroundColor: isDark ? '#7F1D1D' : '#FEE2E2',
                }}
              >
                <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '700' }}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>
                Customer: <Text style={{ color: theme.text, fontWeight: '700' }}>{selectedVehicle.customerName}</Text> ({selectedVehicle.customerPhone})
              </Text>
            </View>
          </GlassCard>
        )}

        {/* Step 2: Job Items (Services & Spare Parts) */}
        <GlassCard
          variant="sand"
          padding={22}
          style={{
            borderRadius: 28,
            marginBottom: 18,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: theme.text, fontSize: 17, fontWeight: '800' }}>
              Services & Spare Parts
            </Text>
            <TouchableOpacity
              onPress={() => {
                setItems([
                  ...items,
                  { id: Date.now().toString(), name: 'General Labor', type: 'SERVICE', price: 800 },
                ]);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 14,
              }}
            >
              <Plus size={14} color={theme.text} />
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: '700' }}>Add Item</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 10 }}>
            {items.map((item, idx) => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  borderBottomWidth: idx < items.length - 1 ? 1 : 0,
                  borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                    {item.type}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                    {formatCurrency(item.price, currencySymbol)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setItems(items.filter((i) => i.id !== item.id))}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Step 3: Summary & Calculations */}
        <GlassCard
          variant="sand"
          padding={22}
          style={{
            borderRadius: 28,
            marginBottom: 24,
          }}
        >
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: theme.textMuted, fontSize: 14 }}>Subtotal</Text>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
                {formatCurrency(subtotal, currencySymbol)}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: theme.textMuted, fontSize: 14 }}>Discount ({currencySymbol})</Text>
              <TextInput
                value={discount}
                onChangeText={setDiscount}
                keyboardType="numeric"
                style={{
                  width: 90,
                  textAlign: 'right',
                  color: isDark ? '#F87171' : '#DC2626',
                  fontSize: 16,
                  fontWeight: '800',
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 10,
                }}
              />
            </View>

            <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
                Final Amount
              </Text>
              <Text style={{ color: theme.text, fontSize: 24, fontWeight: '900' }}>
                {formatCurrency(finalAmount, currencySymbol)}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Solid Obsidian Black Pill CTA Button */}
        <TouchableOpacity
          onPress={handleCreateJobSheet}
          activeOpacity={0.88}
          style={{
            backgroundColor: isDark ? '#FFFFFF' : '#121214',
            paddingVertical: 18,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            Create Job Sheet
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
