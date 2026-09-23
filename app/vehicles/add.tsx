// ============================================================
// Add Vehicle Screen — Register vehicle & associate with customer
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  User,
  Check,
  Search,
  ChevronDown,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { useVehicleStore } from '../../src/store/vehicleStore';
import { useCustomerStore } from '../../src/store/customerStore';
import { FuelType, Vehicle } from '../../src/types/vehicle.types';

const POPULAR_MAKES = ['Maruti', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia'];
const FUEL_TYPES: { label: string; value: FuelType }[] = [
  { label: 'Petrol', value: 'PETROL' },
  { label: 'Diesel', value: 'DIESEL' },
  { label: 'CNG', value: 'CNG' },
  { label: 'Electric', value: 'ELECTRIC' },
  { label: 'Hybrid', value: 'HYBRID' },
];

export default function AddVehicleScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ customerId?: string }>();
  const { addVehicle } = useVehicleStore();
  const { customers } = useCustomerStore();

  const preselectedCustomer = useMemo(() => {
    if (params.customerId) {
      return customers.find((c) => c.id === params.customerId);
    }
    return null;
  }, [params.customerId, customers]);

  const [selectedCustomer, setSelectedCustomer] = useState(preselectedCustomer || customers[0] || null);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  const [regNumber, setRegNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [modelYear, setModelYear] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('PETROL');
  const [color, setColor] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [customers, customerSearch]);

  const handleSave = async () => {
    const cleanReg = regNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!cleanReg || cleanReg.length < 5) {
      Alert.alert('Required', 'Please enter a valid Registration Number (e.g. MH02AB1234)');
      return;
    }
    if (!make.trim()) {
      Alert.alert('Required', 'Please specify or select vehicle Make (Brand)');
      return;
    }
    if (!model.trim()) {
      Alert.alert('Required', 'Please enter vehicle Model (e.g. Swift, City)');
      return;
    }
    if (!selectedCustomer) {
      Alert.alert('Required', 'Please select or add a Customer for this vehicle');
      return;
    }

    setLoading(true);
    const newVehId = `veh-${Date.now()}`;
    const entId = enterpriseId || 'enterprise-dev-001';

    const vehicleObj: Vehicle = {
      id: newVehId,
      enterpriseId: entId,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      registrationNumber: cleanReg,
      make: make.trim(),
      model: model.trim(),
      modelYear: modelYear ? parseInt(modelYear, 10) : undefined,
      fuelType,
      color: color.trim() || undefined,
      insuranceExpiry: insuranceExpiry.trim() || undefined,
      notes: notes.trim() || undefined,
      totalVisits: 0,
      totalSpent: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      const vehRef = doc(db, 'enterprises', entId, 'vehicles', newVehId);
      await setDoc(vehRef, vehicleObj);
    } catch (err) {
      console.log('[AddVehicle] Firestore sync error/offline:', err);
    }

    addVehicle(vehicleObj);
    setLoading(false);

    Alert.alert('Success', `Vehicle ${cleanReg} registered successfully!`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Symmetrical Top Header */}
        <View
          style={{
            paddingTop: insets.top + 14,
            paddingHorizontal: 22,
            paddingBottom: 20,
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
              Add Vehicle
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
              Link automobile to customer garage profile
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, gap: 16 }}>
          {/* Owner / Customer Selection Card in Warm Sand */}
          <GlassCard variant="sand" padding={20} style={{ borderRadius: 28, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
                REGISTERED OWNER *
              </Text>
              <TouchableOpacity onPress={() => router.push('/customers/add')}>
                <Text style={{ color: theme.text, fontSize: 13, fontWeight: '800' }}>
                  + New Customer
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setCustomerModalVisible(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                borderRadius: 20,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: isDark ? '#1C212B' : '#EFECE6',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User size={18} color={theme.text} />
                </View>
                <View>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                    {selectedCustomer?.name || 'Tap to choose Customer'}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 1 }}>
                    {selectedCustomer?.phone || 'Required field'}
                  </Text>
                </View>
              </View>
              <ChevronDown size={18} color={theme.textMuted} />
            </TouchableOpacity>
          </GlassCard>

          {/* Vehicle Details Card in Warm Sand */}
          <GlassCard variant="sand" padding={22} style={{ borderRadius: 28, gap: 16 }}>
            {/* Registration Number */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                REGISTRATION NUMBER *
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                  height: 54,
                }}
              >
                {/* Indian Plate IND Badge */}
                <View
                  style={{
                    backgroundColor: '#1E3A8A',
                    paddingHorizontal: 12,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 }}>
                    IND
                  </Text>
                </View>
                <TextInput
                  value={regNumber}
                  onChangeText={(val) => setRegNumber(val.toUpperCase())}
                  placeholder="e.g. MH02AB1234"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="characters"
                  style={{
                    flex: 1,
                    paddingHorizontal: 14,
                    color: theme.text,
                    fontSize: 16,
                    fontWeight: '800',
                    letterSpacing: 1.5,
                  }}
                />
              </View>
            </View>

            {/* Make (Brand) */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                BRAND / MAKE *
              </Text>
              <TextInput
                value={make}
                onChangeText={setMake}
                placeholder="e.g. Maruti Suzuki, Hyundai"
                placeholderTextColor={theme.textMuted}
                style={{
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  paddingHorizontal: 16,
                  height: 54,
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: '600',
                }}
              />
              {/* Quick Brand Selector Chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, marginTop: 10 }}
              >
                {POPULAR_MAKES.map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    onPress={() => setMake(brand)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 16,
                      backgroundColor:
                        make === brand
                          ? (isDark ? '#FFFFFF' : '#121214')
                          : (isDark ? '#252B38' : '#FFFFFF'),
                    }}
                  >
                    <Text
                      style={{
                        color: make === brand ? (isDark ? '#121214' : '#FFFFFF') : theme.textSecondary,
                        fontSize: 12,
                        fontWeight: '700',
                      }}
                    >
                      {brand}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Model & Year */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 2 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  MODEL *
                </Text>
                <TextInput
                  value={model}
                  onChangeText={setModel}
                  placeholder="e.g. Swift, Creta"
                  placeholderTextColor={theme.textMuted}
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    paddingHorizontal: 16,
                    height: 54,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  YEAR
                </Text>
                <TextInput
                  value={modelYear}
                  onChangeText={setModelYear}
                  placeholder="2022"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  maxLength={4}
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    paddingHorizontal: 16,
                    height: 54,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                  }}
                />
              </View>
            </View>

            {/* Fuel Type Pills */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                FUEL TYPE
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {FUEL_TYPES.map((fuel) => {
                  const isSelected = fuelType === fuel.value;
                  return (
                    <TouchableOpacity
                      key={fuel.value}
                      onPress={() => setFuelType(fuel.value)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 9,
                        borderRadius: 16,
                        backgroundColor: isSelected
                          ? (isDark ? '#FFFFFF' : '#121214')
                          : (isDark ? '#252B38' : '#FFFFFF'),
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected ? (isDark ? '#121214' : '#FFFFFF') : theme.text,
                          fontSize: 13,
                          fontWeight: '700',
                        }}
                      >
                        {fuel.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Color & Insurance Expiry */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  COLOR
                </Text>
                <TextInput
                  value={color}
                  onChangeText={setColor}
                  placeholder="Silver, White"
                  placeholderTextColor={theme.textMuted}
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    paddingHorizontal: 16,
                    height: 54,
                    color: theme.text,
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  INSURANCE EXPIRY
                </Text>
                <TextInput
                  value={insuranceExpiry}
                  onChangeText={setInsuranceExpiry}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={theme.textMuted}
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    paddingHorizontal: 16,
                    height: 54,
                    color: theme.text,
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                />
              </View>
            </View>

            {/* Notes */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                GARAGE NOTES / SCRATCHES
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="e.g. Minor dent on rear bumper, AC check required"
                placeholderTextColor={theme.textMuted}
                multiline
                style={{
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  minHeight: 80,
                  color: theme.text,
                  fontSize: 14,
                  textAlignVertical: 'top',
                  fontWeight: '500',
                }}
              />
            </View>
          </GlassCard>

          {/* Solid Obsidian Black Pill Submit Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.88}
            style={{
              backgroundColor: isDark ? '#FFFFFF' : '#121214',
              paddingVertical: 18,
              borderRadius: 34,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
            }}
          >
            {loading ? (
              <ActivityIndicator color={isDark ? '#121214' : '#FFFFFF'} />
            ) : (
              <>
                <Check size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
                <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                  Register Vehicle
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Customer Picker Modal */}
      <Modal
        visible={customerModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCustomerModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? '#14171F' : '#F8F6F2',
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              paddingTop: 24,
              paddingHorizontal: 22,
              paddingBottom: insets.bottom + 20,
              maxHeight: '80%',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.5 }}>
                Select Customer
              </Text>
              <TouchableOpacity onPress={() => setCustomerModalVisible(false)}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? '#1C212B' : '#EFECE6',
                borderRadius: 24,
                paddingHorizontal: 14,
                height: 48,
                gap: 10,
                marginBottom: 16,
              }}
            >
              <Search size={16} color={theme.textMuted} />
              <TextInput
                value={customerSearch}
                onChangeText={setCustomerSearch}
                placeholder="Search by name or phone..."
                placeholderTextColor={theme.textMuted}
                style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: '600' }}
              />
            </View>

            {/* List */}
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
              <View style={{ gap: 8 }}>
                {filteredCustomers.map((cust) => {
                  const isSelected = selectedCustomer?.id === cust.id;
                  return (
                    <TouchableOpacity
                      key={cust.id}
                      onPress={() => {
                        setSelectedCustomer(cust);
                        setCustomerModalVisible(false);
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        backgroundColor: isSelected
                          ? (isDark ? '#FFFFFF' : '#121214')
                          : (isDark ? '#1C212B' : '#FFFFFF'),
                        borderRadius: 20,
                      }}
                    >
                      <View>
                        <Text style={{ color: isSelected ? (isDark ? '#121214' : '#FFFFFF') : theme.text, fontSize: 15, fontWeight: '700' }}>
                          {cust.name}
                        </Text>
                        <Text style={{ color: isSelected ? (isDark ? '#4B5563' : '#9CA3AF') : theme.textMuted, fontSize: 13, marginTop: 2 }}>
                          {cust.phone}
                        </Text>
                      </View>
                      {isSelected && <Check size={18} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
