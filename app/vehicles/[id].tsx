// ============================================================
// Vehicle Details Screen — Sky Blue & Midnight Navy Luxury Layout
// Directly matching media_1790189780212.png center screen
// ============================================================

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Share2,
  Phone,
  Car,
  FileText,
  Plus,
  Clock,
  Gauge,
  Fuel,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useVehicleStore } from '../../src/store/vehicleStore';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';

export default function VehicleDetailsScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { vehicles } = useVehicleStore();
  const [activeTab, setActiveTab] = useState<'specs' | 'history'>('specs');

  const vehicle = useMemo(() => {
    const found = vehicles.find((v) => v.id === params.id || v.registrationNumber === params.id);
    if (found) return found;
    return {
      id: 'v1',
      make: 'Honda',
      model: 'City ZX i-VTEC',
      registrationNumber: 'MH02AB1234',
      customerName: 'Rajesh Sharma',
      customerPhone: '+91 98201 12345',
      fuelType: 'Petrol',
      modelYear: 2022,
      lastServiceDate: '15 May 2025',
      nextServiceDate: '15 Nov 2025',
      totalSpent: 42500,
      totalVisits: 6,
      history: [
        { id: 'h1', date: '15 May 2025', job: 'Major 40,000 KM Service & Brake Overhaul', amount: 8500, status: 'Paid' },
        { id: 'h2', date: '10 Jan 2025', job: 'Suspension Bushing & Alignment', amount: 6200, status: 'Paid' },
        { id: 'h3', date: '04 Oct 2024', job: 'AC Cooling Coil & Blower Replacement', amount: 12400, status: 'Paid' },
      ],
    };
  }, [params.id, vehicles]);

  const canvasBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#111622' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.06)';
  const primaryBtnBg = isDark ? '#FFFFFF' : '#0C1829';
  const primaryBtnText = isDark ? '#0C1829' : '#FFFFFF';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Sky Blue Header */}
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 24, alignItems: 'center' }}>
          {/* Top Bar with Back & Share */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 16 }}>
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

            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Vehicle Profile
            </Text>

            <TouchableOpacity
              onPress={() => Alert.alert('Share', 'Vehicle summary link copied.')}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Share2 size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Central Car Badge */}
          <View
            style={{
              width: 68,
              height: 68,
              borderRadius: 34,
              backgroundColor: isDark ? '#1C2538' : '#0C1829',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              shadowColor: '#0C1829',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Car size={32} color="#FFFFFF" />
          </View>

          {/* Registration Plate & Model */}
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900', letterSpacing: -0.3 }}>
            {vehicle.registrationNumber}
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, fontWeight: '600', marginTop: 2 }}>
            {vehicle.make} {vehicle.model}
          </Text>

          {/* Total Spent Lifetime */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 12, marginBottom: 8 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1 }}>
              {formatCurrency(vehicle.totalSpent || 0, currencySymbol)}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: 'rgba(0, 200, 150, 0.2)',
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 16,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: '#00C896', fontSize: 12, fontWeight: '800' }}>
              Lifetime Garage Spent • {vehicle.totalVisits} Visits
            </Text>
          </View>

          {/* 4 Circular Action Buttons (↓ New Job, ↗ Record Exp, 📞 Call, + Edit) */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, width: '100%' }}>
            <TouchableOpacity
              onPress={() => router.push('/job-sheets/create')}
              activeOpacity={0.8}
              style={{ alignItems: 'center', gap: 6 }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileText size={20} color="#FFFFFF" />
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                New Job
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${vehicle.customerPhone}`)}
              activeOpacity={0.8}
              style={{ alignItems: 'center', gap: 6 }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Phone size={19} color="#FFFFFF" strokeWidth={2.2} />
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                Call Owner
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/job-sheets')}
              activeOpacity={0.8}
              style={{ alignItems: 'center', gap: 6 }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileText size={20} color="#FFFFFF" strokeWidth={2.2} />
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                Job Sheets
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Edit Vehicle', 'Edit vehicle details')}
              activeOpacity={0.8}
              style={{ alignItems: 'center', gap: 6 }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={22} color="#FFFFFF" strokeWidth={2.4} />
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Crisp White Lower Sheet */}
        <View
          style={{
            backgroundColor: sheetBg,
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            paddingTop: 24,
            paddingHorizontal: 20,
            paddingBottom: 24,
            minHeight: 500,
            shadowColor: '#0C1829',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDark ? 0.4 : 0.06,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {/* Segmented Switcher */}
          <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => setActiveTab('specs')} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: activeTab === 'specs' ? '900' : '600',
                  color: activeTab === 'specs' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                }}
              >
                Vehicle Specs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveTab('history')} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: activeTab === 'history' ? '900' : '600',
                  color: activeTab === 'history' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                }}
              >
                Service History
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'specs' ? (
            <View style={{ gap: 14 }}>
              {/* 4-Box Spec Metric Grid */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Fuel Type</Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    {vehicle.fuelType}
                  </Text>
                </GlassCard>

                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Model Year</Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    {vehicle.modelYear}
                  </Text>
                </GlassCard>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Last Service</Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 15, fontWeight: '800', marginTop: 2 }}>
                    {vehicle.lastServiceDate ? String(vehicle.lastServiceDate) : 'N/A'}
                  </Text>
                </GlassCard>

                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Next Service Due</Text>
                  <Text style={{ color: '#F59E0B', fontSize: 15, fontWeight: '800', marginTop: 2 }}>
                    {vehicle.nextServiceDate ? String(vehicle.nextServiceDate) : 'Not scheduled'}
                  </Text>
                </GlassCard>
              </View>

              {/* Customer Contact Card */}
              <GlassCard
                variant={isDark ? 'navy' : 'sand'}
                padding={18}
                style={{
                  borderRadius: 24,
                  marginTop: 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
                    Registered Owner
                  </Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 16, fontWeight: '800', marginTop: 2 }}>
                    {vehicle.customerName}
                  </Text>
                  <Text style={{ color: '#64748B', fontSize: 13, marginTop: 1 }}>
                    {vehicle.customerPhone}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${vehicle.customerPhone}`)}
                  style={{
                    backgroundColor: primaryBtnBg,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: primaryBtnText, fontSize: 13, fontWeight: '800' }}>
                    Call
                  </Text>
                </TouchableOpacity>
              </GlassCard>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {(((vehicle as any).history) || []).map((h: any) => (
                <View
                  key={h.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 22,
                    backgroundColor: isDark ? '#141926' : '#F8FAFD',
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 14, fontWeight: '800' }}>
                      {h.job}
                    </Text>
                    <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 2 }}>
                      {h.date} • {h.status}
                    </Text>
                  </View>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 15, fontWeight: '900', marginLeft: 10 }}>
                    {formatCurrency(h.amount, currencySymbol)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* New Job Sheet for this Vehicle CTA */}
          <TouchableOpacity
            onPress={() => router.push('/job-sheets/create')}
            activeOpacity={0.88}
            style={{
              backgroundColor: primaryBtnBg,
              paddingVertical: 18,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 24,
              shadowColor: '#0C1829',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
              Create Job Sheet for this Vehicle
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
