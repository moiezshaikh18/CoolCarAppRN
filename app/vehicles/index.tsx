// ============================================================
// Vehicles List Screen — Garage Vehicle Fleet
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Car,
  Plus,
  ChevronRight,
  User,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useVehicleStore } from '../../src/store/vehicleStore';
import { Vehicle } from '../../src/types/vehicle.types';

const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: 'veh-001',
    enterpriseId: 'enterprise-dev-001',
    customerId: 'cust-001',
    customerName: 'Rajesh Sharma',
    customerPhone: '+919820112345',
    registrationNumber: 'MH 02 AB 1234',
    make: 'Honda',
    model: 'City',
    modelYear: 2021,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    color: 'White',
    odometerKm: 34500,
    totalJobs: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'veh-002',
    enterpriseId: 'enterprise-dev-001',
    customerId: 'cust-002',
    customerName: 'Amit Patel',
    customerPhone: '+919811154321',
    registrationNumber: 'MH 01 CD 5678',
    make: 'Hyundai',
    model: 'Creta',
    modelYear: 2022,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    color: 'Black',
    odometerKm: 28000,
    totalJobs: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'veh-003',
    enterpriseId: 'enterprise-dev-001',
    customerId: 'cust-003',
    customerName: 'Priya Verma',
    customerPhone: '+919765432109',
    registrationNumber: 'MH 03 EF 9012',
    make: 'Maruti Suzuki',
    model: 'Swift',
    modelYear: 2020,
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    color: 'Red',
    odometerKm: 42100,
    totalJobs: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function VehiclesListScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { setVehicles } = useVehicleStore();

  const [search, setSearch] = useState('');
  const [selectedFuel, setSelectedFuel] = useState<string>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [vehicles, setLocalVehicles] = useState<Vehicle[]>(DEFAULT_VEHICLES);

  // Sync with Firestore
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const fetchVehicles = async () => {
      try {
        const entId = enterpriseId || 'enterprise-dev-001';
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');

        const vehRef = collection(db, 'enterprises', entId, 'vehicles');
        unsubscribe = onSnapshot(vehRef, (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Vehicle));
            setLocalVehicles(list);
            setVehicles(list);
          }
        });
      } catch (err) {
        console.log('[VehiclesList] Firestore sync:', err);
      }
    };

    fetchVehicles();
    return () => unsubscribe?.();
  }, [enterpriseId]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch =
        !search.trim() ||
        v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.make.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        (v.customerName && v.customerName.toLowerCase().includes(search.toLowerCase()));

      const matchFuel = selectedFuel === 'ALL' || v.fuelType === selectedFuel;
      return matchSearch && matchFuel;
    });
  }, [vehicles, search, selectedFuel]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  };

  const skyBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          backgroundColor: skyBg,
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 22,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
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
                Vehicles Fleet
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
                {vehicles.length} vehicle(s) registered
              </Text>
            </View>
          </View>
        </View>

        {/* Search Pill */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#141926' : 'rgba(255,255,255,0.24)',
            borderRadius: 22,
            paddingHorizontal: 16,
            height: 48,
            gap: 10,
            marginBottom: 12,
          }}
        >
          <Search size={18} color={isDark ? '#94A3B8' : 'rgba(255,255,255,0.85)'} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by reg number, model, owner..."
            placeholderTextColor={isDark ? '#64748B' : 'rgba(255,255,255,0.7)'}
            style={{ flex: 1, color: '#FFFFFF', fontSize: 14, fontWeight: '500' }}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Fuel Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {['ALL', 'PETROL', 'DIESEL', 'CNG', 'ELECTRIC'].map((fuel) => {
            const active = selectedFuel === fuel;
            return (
              <TouchableOpacity
                key={fuel}
                onPress={() => setSelectedFuel(fuel)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 7,
                  borderRadius: 20,
                  backgroundColor: active ? '#0C1829' : 'rgba(255,255,255,0.2)',
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: active ? '800' : '600',
                  }}
                >
                  {fuel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Signature Lower Content Sheet with ZERO Blue Bleed */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          marginTop: -14,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 }}
        >
          <View style={{ gap: 12 }}>
            {filteredVehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                activeOpacity={0.88}
                onPress={() => router.push(`/vehicles/${vehicle.id}` as any)}
                style={{
                  backgroundColor: isDark ? '#101927' : '#FFFFFF',
                  borderRadius: 24,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  shadowColor: '#000',
                  shadowOpacity: isDark ? 0.3 : 0.04,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  {/* Circular Car Icon Avatar */}
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: isDark ? '#141926' : '#EFF6FF',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Car size={22} color={isDark ? '#FFFFFF' : '#3B82F6'} />
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                        {vehicle.make} {vehicle.model}
                      </Text>
                      {/* Reg Plate Pill */}
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 8,
                          backgroundColor: isDark ? '#141926' : '#F1F5F9',
                          borderWidth: 1,
                          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                        }}
                      >
                        <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 }}>
                          {vehicle.registrationNumber}
                        </Text>
                      </View>
                    </View>

                    {/* Customer / Owner */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <User size={13} color={theme.textMuted} />
                      <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '500' }}>
                        {vehicle.customerName || 'Registered Owner'}
                      </Text>
                    </View>

                    {/* Spec Badges: Fuel & Year */}
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 3,
                          borderRadius: 10,
                          backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                        }}
                      >
                        <Text style={{ color: theme.text, fontSize: 11, fontWeight: '700' }}>
                          {vehicle.fuelType}
                        </Text>
                      </View>
                      {vehicle.modelYear && (
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 3,
                            borderRadius: 10,
                            backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                          }}
                        >
                          <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>
                            Year {vehicle.modelYear}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <ChevronRight size={18} color={theme.textMuted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Floating Add Vehicle Button */}
        <View style={{ position: 'absolute', bottom: Math.max(insets.bottom + 10, 20), left: 20, right: 20 }}>
          <TouchableOpacity
            onPress={() => router.push('/vehicles/add')}
            activeOpacity={0.88}
            style={{
              backgroundColor: '#0C1829',
              paddingVertical: 16,
              borderRadius: 32,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 5 },
              elevation: 6,
            }}
          >
            <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Add New Vehicle
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
