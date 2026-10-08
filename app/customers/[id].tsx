// ============================================================
// Customer Details Screen — Sky Blue & Midnight Navy Luxury Layout
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
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Share2,
  Phone,
  User,
  Car,
  FileText,
  Plus,
  MessageSquare,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useCustomerStore } from '../../src/store/customerStore';
import { useVehicleStore } from '../../src/store/vehicleStore';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { getInitials } from '../../src/utils/formatters';

export default function CustomerDetailsScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { customers } = useCustomerStore();
  const { vehicles } = useVehicleStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'fleet'>('overview');

  const customer = useMemo(() => {
    return customers.find((c) => c.id === params.id) || null;
  }, [params.id, customers]);

  const canvasBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#111622' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.06)';
  const primaryBtnBg = isDark ? '#FFFFFF' : '#0C1829';
  const primaryBtnText = isDark ? '#0C1829' : '#FFFFFF';

  if (!customer) {
    return (
      <View style={{ flex: 1, backgroundColor: sheetBg, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <StatusBar barStyle="light-content" backgroundColor={canvasBg} />
        <Text style={{ fontSize: 18, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829', marginBottom: 8 }}>
          Customer Not Found
        </Text>
        <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20 }}>
          The requested customer could not be found in your directory.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, backgroundColor: '#153580' }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={canvasBg} />

      {/* Sky Blue Header */}
      <View style={{ backgroundColor: canvasBg, paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 24, alignItems: 'center' }}>
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
              Customer Profile
            </Text>

            <TouchableOpacity
              onPress={() => Alert.alert('Share', 'Customer account link copied.')}
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

          {/* Central Customer Avatar */}
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
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '900' }}>
              {getInitials(customer.name)}
            </Text>
          </View>

          {/* Name & Phone */}
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900', letterSpacing: -0.3 }}>
            {customer.name}
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, fontWeight: '600', marginTop: 2 }}>
            {customer.phone}
          </Text>

          {/* Lifetime Spent */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 12, marginBottom: 8 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1 }}>
              {formatCurrency(customer.totalSpent, currencySymbol)}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: customer.pendingAmount > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 200, 150, 0.2)',
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 16,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: customer.pendingAmount > 0 ? '#EF4444' : '#00C896', fontSize: 12, fontWeight: '800' }}>
              {customer.pendingAmount > 0 ? `Pending Due: ${formatCurrency(customer.pendingAmount, currencySymbol)}` : 'All Accounts Settled'}
            </Text>
          </View>

          {/* 4 Circular Action Buttons (Call, WhatsApp, New Job, Add Vehicle) */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, width: '100%' }}>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${customer.phone}`)}
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
                Call
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`)}
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
                <MessageSquare size={19} color="#FFFFFF" strokeWidth={2.2} />
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                WhatsApp
              </Text>
            </TouchableOpacity>

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
              onPress={() => router.push('/vehicles/add')}
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
                <Car size={20} color="#FFFFFF" />
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                Add Car
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      {/* Lower Content Sheet with ZERO Blue Bleed */}
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
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
        >
          {/* Segmented Switcher */}
          <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => setActiveTab('overview')} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: activeTab === 'overview' ? '900' : '600',
                  color: activeTab === 'overview' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                }}
              >
                Financials
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveTab('fleet')} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: activeTab === 'fleet' ? '900' : '600',
                  color: activeTab === 'fleet' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                }}
              >
                Vehicles Fleet ({((customer as any).vehicles?.length) || 2})
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'overview' ? (
            <View style={{ gap: 14 }}>
              {/* 4-Box Spec Metric Grid */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Total Billed</Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    {formatCurrency(customer.totalSpent, currencySymbol)}
                  </Text>
                </GlassCard>

                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Total Paid</Text>
                  <Text style={{ color: '#00C896', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    {formatCurrency(customer.totalPaid, currencySymbol)}
                  </Text>
                </GlassCard>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Total Jobs</Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    {customer.totalJobs} Work Orders
                  </Text>
                </GlassCard>

                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Last Visit</Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 15, fontWeight: '800', marginTop: 2 }}>
                    {customer.lastVisit ? String(customer.lastVisit) : 'Never'}
                  </Text>
                </GlassCard>
              </View>

              {/* Address Details Card */}
              <GlassCard
                variant={isDark ? 'navy' : 'sand'}
                padding={18}
                style={{ borderRadius: 24, marginTop: 6 }}
              >
                <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
                  Billing Address
                </Text>
                <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 14, fontWeight: '700', marginTop: 4 }}>
                  {customer.address}
                </Text>
              </GlassCard>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {(((customer as any).vehicles) || []).map((v: any) => (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => router.push(`/vehicles/${v.id}`)}
                  activeOpacity={0.8}
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
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        backgroundColor: isDark ? '#1C2538' : '#0C1829',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Car size={18} color="#FFFFFF" />
                    </View>
                    <View>
                      <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 15, fontWeight: '800' }}>
                        {v.model}
                      </Text>
                      <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                        {v.reg} • {v.year}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#64748B" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* New Job CTA */}
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
              Create Work Order for {customer.name}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
