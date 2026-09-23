// ============================================================
// Job Sheet Details Screen — Sky Blue & Midnight Navy Luxury Layout
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
  ArrowDown,
  Plus,
  Repeat,
  CheckCircle2,
  Clock,
  Wrench,
  Package,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';

export default function JobSheetDetailsScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { jobSheets } = useJobSheetStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'items'>('overview');

  const job = useMemo(() => {
    const found = jobSheets.find((j) => j.id === params.id || j.jobNumber === params.id);
    if (found) return found;
    return {
      id: params.id ?? 'JS-2026-001',
      jobNumber: 'CCG-0001',
      date: 'Today, 11:30 AM',
      status: 'IN_PROGRESS' as const,
      paymentStatus: 'PARTIALLY_PAID' as const,
      customerName: 'Rajesh Sharma',
      customerPhone: '+91 98201 12345',
      vehicleNumber: 'MH02AB1234',
      vehicleMake: 'Honda',
      vehicleModel: 'City ZX i-VTEC',
      subtotal: 8500,
      discount: 500,
      finalAmount: 8000,
      totalPaid: 5500,
      pendingAmount: 2500,
      items: [
        { id: '1', name: 'Front Brake Pads Set Replacement', type: 'PART', quantity: 1, unitPrice: 2800, amount: 2800 },
        { id: '2', name: 'Motul 5W-30 Full Synthetic Oil (4L)', type: 'PART', quantity: 1, unitPrice: 3200, amount: 3200 },
        { id: '3', name: 'Engine Oil Filter OEM', type: 'PART', quantity: 1, unitPrice: 450, amount: 450 },
        { id: '4', name: 'Brake Disc Lathe & Inspection Labor', type: 'SERVICE', quantity: 1, unitPrice: 2050, amount: 2050 },
      ],
    };
  }, [params.id, jobSheets]);

  const canvasBg = isDark ? '#070A0F' : '#6B9FE8';
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
              {job.jobNumber}
            </Text>

            <TouchableOpacity
              onPress={() => Alert.alert('Share Invoice', 'Work order link copied.')}
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

          {/* Vehicle Model & Registration */}
          <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '900', letterSpacing: -0.3 }}>
            {job.vehicleModel}
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 13, fontWeight: '600', marginTop: 2 }}>
            {job.vehicleNumber} • {job.customerName}
          </Text>

          {/* Prominent Amount */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 12, marginBottom: 8 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1 }}>
              {formatCurrency(job.finalAmount, currencySymbol)}
            </Text>
          </View>

          {/* Status Badge Pill */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: job.pendingAmount === 0 ? 'rgba(0, 200, 150, 0.2)' : 'rgba(245, 158, 11, 0.25)',
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 16,
              marginBottom: 20,
            }}
          >
            {job.pendingAmount === 0 ? (
              <CheckCircle2 size={13} color="#00C896" />
            ) : (
              <Clock size={13} color="#FBBF24" />
            )}
            <Text
              style={{
                color: job.pendingAmount === 0 ? '#00C896' : '#FBBF24',
                fontSize: 12,
                fontWeight: '800',
              }}
            >
              {job.pendingAmount === 0 ? 'Fully Paid' : `Due: ${formatCurrency(job.pendingAmount, currencySymbol)}`}
            </Text>
          </View>

          {/* 4 Circular Action Buttons (↓ ↗ ⇄ 📞) */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, width: '100%' }}>
            {/* Payment */}
            <TouchableOpacity
              onPress={() => router.push('/payments')}
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
                <ArrowDown size={20} color="#FFFFFF" strokeWidth={2.2} />
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                Payment
              </Text>
            </TouchableOpacity>

            {/* Add Item */}
            <TouchableOpacity
              onPress={() => Alert.alert('Add Item', 'Add service or part modal')}
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
                Add Item
              </Text>
            </TouchableOpacity>

            {/* Status */}
            <TouchableOpacity
              onPress={() => Alert.alert('Update Status', 'Mark job complete or in-progress')}
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
                <Repeat size={20} color="#FFFFFF" strokeWidth={2.2} />
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                Status
              </Text>
            </TouchableOpacity>

            {/* Call */}
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${job.customerPhone}`)}
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
            <TouchableOpacity onPress={() => setActiveTab('overview')} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: activeTab === 'overview' ? '900' : '600',
                  color: activeTab === 'overview' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                }}
              >
                Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveTab('items')} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: activeTab === 'items' ? '900' : '600',
                  color: activeTab === 'items' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                }}
              >
                Parts & Labor ({job.items.length})
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'overview' ? (
            <View style={{ gap: 14 }}>
              {/* 4-Box Spec Metric Grid */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Subtotal</Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    {formatCurrency(job.subtotal, currencySymbol)}
                  </Text>
                </GlassCard>

                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Discount</Text>
                  <Text style={{ color: '#00C896', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    -{formatCurrency(job.discount, currencySymbol)}
                  </Text>
                </GlassCard>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Paid So Far</Text>
                  <Text style={{ color: '#00C896', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    {formatCurrency(job.totalPaid, currencySymbol)}
                  </Text>
                </GlassCard>

                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Balance Due</Text>
                  <Text style={{ color: job.pendingAmount > 0 ? '#EF4444' : '#00C896', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    {formatCurrency(job.pendingAmount, currencySymbol)}
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
                    Vehicle Owner
                  </Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 16, fontWeight: '800', marginTop: 2 }}>
                    {job.customerName}
                  </Text>
                  <Text style={{ color: '#64748B', fontSize: 13, marginTop: 1 }}>
                    {job.customerPhone}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${job.customerPhone}`)}
                  style={{
                    backgroundColor: primaryBtnBg,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: primaryBtnText, fontSize: 13, fontWeight: '800' }}>
                    Call Owner
                  </Text>
                </TouchableOpacity>
              </GlassCard>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {job.items.map((item) => (
                <View
                  key={item.id}
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
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: isDark ? '#1C2538' : '#0C1829',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.type === 'PART' ? <Package size={16} color="#FFFFFF" /> : <Wrench size={16} color="#FFFFFF" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 14, fontWeight: '800' }}>
                        {item.name}
                      </Text>
                      <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 2 }}>
                        Qty: {item.quantity} × {formatCurrency(item.unitPrice, currencySymbol)}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 15, fontWeight: '900' }}>
                    {formatCurrency(item.amount, currencySymbol)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Settle / Record Payment CTA */}
          <TouchableOpacity
            onPress={() => router.push('/payments')}
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
              {job.pendingAmount > 0 ? `Collect Balance (${formatCurrency(job.pendingAmount, currencySymbol)})` : 'Print Final Invoice'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
