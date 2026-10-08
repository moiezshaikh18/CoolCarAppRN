// ============================================================
// Screen 13: Vehicle Details — Garage Fleet & Specs
// Directly matching Screen 13 in Reference Design Mockup
// ============================================================

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Car, Edit2, Phone } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useVehicleStore } from '../../src/store/vehicleStore';

export default function VehicleDetailsScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { vehicles } = useVehicleStore();

  const vehicle = useMemo(() => {
    return vehicles.find((v) => v.id === params.id || v.registrationNumber === params.id) || {
      id: params.id || 'veh-1',
      model: 'Maruti Swift',
      registrationNumber: 'DL 04 AB 1234',
      customerName: 'Ramesh Kumar',
      customerPhone: '9876543210',
      modelYear: 2018,
      fuelType: 'PETROL' as const,
      lastServiceDate: '10 May 2025',
    };
  }, [params.id, vehicles]);

  const bg = isDark ? '#0C1829' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';
  const cardBg = isDark ? '#111E33' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Top Header matching Screen 13 */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{ width: 40, height: 40, justifyContent: 'center' }}
        >
          <ArrowLeft size={22} color={textPrimary} strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary }}>
          Vehicle Details
        </Text>

        <TouchableOpacity
          onPress={() => router.push(`/vehicles/add?editId=${vehicle.id}` as any)}
          style={{ width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <Edit2 size={20} color={textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: insets.bottom + 90,
        }}
      >
        {/* Vehicle Icon & Header */}
        <View style={{ alignItems: 'center', marginBottom: 26 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#EFF6FF',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <Car size={34} color="#2563EB" strokeWidth={2.2} />
          </View>

          <Text style={{ fontSize: 20, fontWeight: '800', color: textPrimary }}>
            {(vehicle as any).model || (vehicle as any).modelName || 'Maruti Swift'}
          </Text>
          <Text style={{ fontSize: 14, color: textMuted, fontWeight: '700', marginTop: 4 }}>
            {vehicle.registrationNumber}
          </Text>
        </View>

        {/* Specs & Owner Card matching Screen 13 */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: borderColor,
            overflow: 'hidden',
          }}
        >
          {/* Owner */}
          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
            }}
          >
            <Text style={{ fontSize: 12, color: textMuted, fontWeight: '600' }}>
              Owner
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '800', color: textPrimary, marginTop: 4 }}>
              {(vehicle as any).customerName || (vehicle as any).ownerName || 'Ramesh Kumar'}
            </Text>
            {Boolean((vehicle as any).customerPhone || (vehicle as any).ownerPhone) && (
              <Text style={{ fontSize: 13, color: '#2563EB', fontWeight: '700', marginTop: 2 }}>
                📞 {(vehicle as any).customerPhone || (vehicle as any).ownerPhone}
              </Text>
            )}
          </View>

          {/* Model Year */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
            }}
          >
            <Text style={{ fontSize: 14, color: textMuted, fontWeight: '600' }}>
              Model Year
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '800', color: textPrimary }}>
              {vehicle.modelYear || 2018}
            </Text>
          </View>

          {/* Fuel Type */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
            }}
          >
            <Text style={{ fontSize: 14, color: textMuted, fontWeight: '600' }}>
              Fuel Type
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '800', color: textPrimary }}>
              {vehicle.fuelType || 'Petrol'}
            </Text>
          </View>

          {/* Last Service */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 16,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ fontSize: 14, color: textMuted, fontWeight: '600' }}>
              Last Service
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '800', color: textPrimary }}>
              {vehicle.lastServiceDate ? String(vehicle.lastServiceDate) : '10 May 2025'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button matching Screen 13 */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 22,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 20,
          paddingTop: 12,
          backgroundColor: bg,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push(`/job-sheets?search=${encodeURIComponent(vehicle.registrationNumber)}` as any)}
          activeOpacity={0.88}
          style={{
            height: 52,
            backgroundColor: '#0C1829',
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#0C1829',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            View History
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
