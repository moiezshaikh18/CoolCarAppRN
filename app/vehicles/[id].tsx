// ============================================================
// Vehicle Details Screen — Screen 3 Style in media_1790116823022.png
// Modern Luxury Architectural Layout: 4-Box Spec Grid & Contact Pill
// ============================================================

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Share2,
  Phone,
  Gauge,
  Fuel,
  Calendar,
  Layers,
  MapPin,
  ShieldCheck,
  Wrench,
  Clock,
  Car,
  FileText,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useVehicleStore } from '../../src/store/vehicleStore';
import { useCustomerStore } from '../../src/store/customerStore';
import { formatCurrency } from '../../src/utils/currency';
import { getInitials } from '../../src/utils/formatters';
import { router, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function VehicleDetailsScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { vehicles } = useVehicleStore();
  const { customers } = useCustomerStore();

  // Find vehicle from store or use luxury fallback
  const vehicle = useMemo(() => {
    const found = vehicles.find((v) => v.id === params.id);
    if (found) return found;
    return {
      id: 'v1',
      make: 'Honda',
      model: 'City ZX i-VTEC',
      registrationNumber: 'MH02AB1234',
      customerId: 'c1',
      customerName: 'Rajesh Sharma',
      customerPhone: '+919820112345',
      fuelType: 'PETROL' as const,
      modelYear: 2023,
      odometerKm: 34500,
      totalVisits: 4,
      totalSpent: 45600,
      insuranceExpiry: '15 Dec 2026',
      nextServiceDate: '10 Nov 2026',
      notes: 'VIP customer, prefers Motul synthetic engine oil.',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [vehicles, params.id]);

  const customer = useMemo(() => {
    return customers.find((c) => c.id === vehicle.customerId);
  }, [customers, vehicle.customerId]);

  const ownerName = vehicle.customerName || customer?.name || 'Rajesh Sharma';
  const ownerPhone = vehicle.customerPhone || customer?.phone || '+91 98201 12345';

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Top Floating Circular Header Bar (Screen 3 pattern) */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? '#1E2430' : '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0 : 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <ChevronLeft size={22} color={theme.text} strokeWidth={2.2} />
        </TouchableOpacity>

        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
          Vehicle Detail
        </Text>

        <TouchableOpacity
          onPress={() => {}}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? '#1E2430' : '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0 : 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Share2 size={18} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
      >
        {/* HERO SHOWCASE CARD (Matching the large property card in Screen 3) */}
        <View
          style={{
            backgroundColor: isDark ? '#1E2430' : '#EFECE6',
            borderRadius: 28,
            padding: 24,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.3 : 0.05,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          {/* Big Stylized Car Visual */}
          <View
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: isDark ? '#141822' : '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <Car size={54} color={theme.text} strokeWidth={1.8} />
          </View>

          {/* Indian Plate Badge */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1E3A8A',
              borderRadius: 8,
              overflow: 'hidden',
              borderWidth: 1.5,
              borderColor: '#1E3A8A',
            }}
          >
            <View style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '900' }}>IND</Text>
            </View>
            <View style={{ backgroundColor: isDark ? '#000' : '#FFFFFF', paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: isDark ? '#FFF' : '#000', fontSize: 15, fontWeight: '900', letterSpacing: 1.5 }}>
                {vehicle.registrationNumber}
              </Text>
            </View>
          </View>
        </View>

        {/* TITLE AND PRICE ROW (Screen 3: Title left, Price right) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>
              {vehicle.make} {vehicle.model}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <MapPin size={14} color={theme.textMuted} />
              <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600' }}>
                Workshop Garage Fleet • Andheri West
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '700' }}>
              LIFETIME SPENT
            </Text>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: '900', marginTop: 2 }}>
              {formatCurrency(vehicle.totalSpent ?? 45600, currencySymbol)}
            </Text>
          </View>
        </View>

        {/* 4-BOX SPEC GRID (Iconic 4 micro-cards from Screen 3) */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {/* Box 1: Odometer */}
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Gauge size={20} color={theme.textMuted} />
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800', marginTop: 6 }}>
              {vehicle.odometerKm ? `${Math.round(vehicle.odometerKm / 1000)}k` : '34k'}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', marginTop: 2 }}>
              Mileage
            </Text>
          </View>

          {/* Box 2: Fuel Type */}
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Fuel size={20} color={theme.textMuted} />
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800', marginTop: 6 }} numberOfLines={1}>
              {vehicle.fuelType}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', marginTop: 2 }}>
              Fuel
            </Text>
          </View>

          {/* Box 3: Model Year */}
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Calendar size={20} color={theme.textMuted} />
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800', marginTop: 6 }}>
              {vehicle.modelYear || 2023}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', marginTop: 2 }}>
              Year
            </Text>
          </View>

          {/* Box 4: Total Visits */}
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Layers size={20} color={theme.textMuted} />
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800', marginTop: 6 }}>
              {vehicle.totalVisits || 4}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', marginTop: 2 }}>
              Visits
            </Text>
          </View>
        </View>

        {/* OWNER / CUSTOMER CARD (Screen 3: Agent Card with Solid Black Pill Button) */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 10 }}>
            Vehicle Owner
          </Text>

          <View
            style={{
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 24,
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: theme.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0 : 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {/* Avatar & Details */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1, marginRight: 10 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: isDark ? '#27272A' : '#EFECE6',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                  {getInitials(ownerName)}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }} numberOfLines={1}>
                  {ownerName}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>
                  {ownerPhone}
                </Text>
              </View>
            </View>

            {/* Solid Black Action Pill Button (Screen 3 style) */}
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${ownerPhone}`)}
              activeOpacity={0.88}
              style={{
                backgroundColor: isDark ? '#FFFFFF' : '#121214',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: isDark ? '#12141A' : '#FFFFFF',
                  fontSize: 13,
                  fontWeight: '800',
                }}
              >
                Contact Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SERVICE & INSURANCE DATES CARD */}
        <View
          style={{
            backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
            borderRadius: 24,
            padding: 20,
            gap: 14,
            borderWidth: 1,
            borderColor: theme.border,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
            Service & Coverage Status
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={18} color="#10B981" />
              <Text style={{ color: theme.textSecondary, fontSize: 14, fontWeight: '600' }}>
                Insurance Expiry
              </Text>
            </View>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>
              {typeof vehicle.insuranceExpiry === 'string' ? vehicle.insuranceExpiry : 'Active'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Clock size={18} color="#F59E0B" />
              <Text style={{ color: theme.textSecondary, fontSize: 14, fontWeight: '600' }}>
                Next Service Due
              </Text>
            </View>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>
              {typeof vehicle.nextServiceDate === 'string' ? vehicle.nextServiceDate : 'Within 30 Days'}
            </Text>
          </View>
        </View>

        {/* BOTTOM ACTION: CREATE JOB SHEET FOR THIS VEHICLE */}
        <TouchableOpacity
          onPress={() => router.push('/job-sheets/create')}
          activeOpacity={0.9}
          style={{
            backgroundColor: isDark ? '#FFFFFF' : '#121214',
            height: 58,
            borderRadius: 29,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <FileText size={18} color={isDark ? '#12141A' : '#FFFFFF'} />
          <Text
            style={{
              color: isDark ? '#12141A' : '#FFFFFF',
              fontSize: 16,
              fontWeight: '800',
            }}
          >
            Create Job Sheet for Vehicle
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
