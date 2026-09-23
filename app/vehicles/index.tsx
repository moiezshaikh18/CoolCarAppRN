// ============================================================
// Vehicles List Screen — Garage Vehicle Fleet
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
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
import { GlassCard } from '../../src/components/common/GlassCard';
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
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
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
              Vehicles Fleet
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
              {vehicles.length} vehicle(s) registered
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/vehicles/add')}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? '#FFFFFF' : '#121214',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Luxury Search Pill */}
      <View style={{ paddingHorizontal: 22, marginBottom: 14 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#1C212B' : '#EFECE6',
            borderRadius: 26,
            paddingHorizontal: 16,
            height: 52,
            gap: 12,
          }}
        >
          <Search size={18} color={theme.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by reg number, model, owner..."
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '500' }}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600' }}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Fuel Filter Pills (Nestora style: active is solid black, inactive is sand) */}
      <View style={{ paddingHorizontal: 22, marginBottom: 18 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {['ALL', 'PETROL', 'DIESEL', 'CNG', 'ELECTRIC'].map((fuel) => {
            const active = selectedFuel === fuel;
            return (
              <TouchableOpacity
                key={fuel}
                onPress={() => setSelectedFuel(fuel)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                  borderRadius: 20,
                  backgroundColor: active ? (isDark ? '#FFFFFF' : '#121214') : (isDark ? '#1C212B' : '#EFECE6'),
                }}
              >
                <Text
                  style={{
                    color: active ? (isDark ? '#121214' : '#FFFFFF') : theme.textMuted,
                    fontSize: 12,
                    fontWeight: active ? '700' : '600',
                  }}
                >
                  {fuel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Vehicles List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 110 }}
      >
        <View style={{ gap: 14 }}>
          {filteredVehicles.map((vehicle) => (
            <GlassCard
              key={vehicle.id}
              variant="sand"
              padding={18}
              onPress={() => router.push(`/vehicles/${vehicle.id}` as any)}
              style={{ borderRadius: 28 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                {/* Circular Car Icon Avatar */}
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  }}
                >
                  <Car size={24} color={theme.text} />
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: theme.text, fontSize: 17, fontWeight: '800' }}>
                      {vehicle.make} {vehicle.model}
                    </Text>
                    {/* Reg Plate Pill */}
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 8,
                        backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                        borderWidth: 1,
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                      }}
                    >
                      <Text style={{ color: theme.text, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 }}>
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
                        borderRadius: 12,
                        backgroundColor: isDark ? '#252B38' : '#FFFFFF',
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
                          borderRadius: 12,
                          backgroundColor: isDark ? '#252B38' : '#FFFFFF',
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
            </GlassCard>
          ))}
        </View>
      </ScrollView>

      {/* Floating Add Vehicle Button */}
      <View style={{ position: 'absolute', bottom: 24, left: 22, right: 22 }}>
        <TouchableOpacity
          onPress={() => router.push('/vehicles/add')}
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
          <Plus size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
          <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            Add New Vehicle
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
