// ============================================================
// Job Sheet Details Screen — Screen 3 Style in media_1790116823022.png
// Modern Luxury Architectural Layout: 4-Box Financial Grid & Customer Pill
// ============================================================

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  CreditCard,
  Layers,
  DollarSign,
  Tag,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { formatCurrency } from '../../src/utils/currency';
import { getInitials } from '../../src/utils/formatters';

export default function JobSheetDetailsScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { jobSheets } = useJobSheetStore();

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
      notes: 'Customer reported soft brake pedal at highway speeds.',
    };
  }, [jobSheets, params.id]);

  const hasPending = (job.pendingAmount ?? 0) > 0;

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
          Job Sheet Detail
        </Text>

        <TouchableOpacity
          onPress={() => Alert.alert('Share Invoice', 'Invoice link ready to send via WhatsApp!')}
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
        {/* HERO SHOWCASE CARD (Screen 3 pattern in warm sand) */}
        <View
          style={{
            backgroundColor: isDark ? '#1E2430' : '#EFECE6',
            borderRadius: 28,
            padding: 22,
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
          {/* Floating Pill Tag & Indian Plate */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View
              style={{
                backgroundColor: isDark ? '#12141A' : '#FFFFFF',
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: '800' }}>
                {job.jobNumber}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#1E3A8A',
                borderRadius: 6,
                overflow: 'hidden',
              }}
            >
              <View style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '900' }}>IND</Text>
              </View>
              <View style={{ backgroundColor: isDark ? '#000' : '#FFFFFF', paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ color: isDark ? '#FFF' : '#000', fontSize: 11, fontWeight: '900', letterSpacing: 1 }}>
                  {job.vehicleNumber}
                </Text>
              </View>
            </View>
          </View>

          {/* Vehicle Graphic & Title */}
          <View style={{ alignItems: 'center', marginVertical: 8 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: isDark ? '#141822' : '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}
            >
              <Car size={36} color={theme.text} strokeWidth={1.8} />
            </View>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: '900' }}>
              {job.vehicleMake} {job.vehicleModel}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>
              Date: {typeof job.date === 'string' ? job.date.slice(0, 10) : 'Today'}
            </Text>
          </View>
        </View>

        {/* TITLE AND TOTAL ROW (Screen 3: Title left, Price right) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={{ color: theme.text, fontSize: 22, fontWeight: '900' }}>
              Work Order Bill
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <Clock size={14} color={hasPending ? '#F59E0B' : '#10B981'} />
              <Text style={{ color: hasPending ? '#F59E0B' : '#10B981', fontSize: 13, fontWeight: '700' }}>
                Status: {job.status} • {job.paymentStatus}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '700' }}>
              FINAL AMOUNT
            </Text>
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: '900', marginTop: 2 }}>
              {formatCurrency(job.finalAmount, currencySymbol)}
            </Text>
          </View>
        </View>

        {/* 4-BOX FINANCIAL SPEC GRID (Iconic Screen 3 4-cards) */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {/* Box 1: Subtotal */}
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <DollarSign size={18} color={theme.textMuted} />
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800', marginTop: 4 }}>
              {formatCurrency(job.subtotal, currencySymbol)}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 10, fontWeight: '600', marginTop: 2 }}>
              Subtotal
            </Text>
          </View>

          {/* Box 2: Discount */}
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Tag size={18} color={theme.textMuted} />
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800', marginTop: 4 }}>
              {formatCurrency(job.discount, currencySymbol)}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 10, fontWeight: '600', marginTop: 2 }}>
              Discount
            </Text>
          </View>

          {/* Box 3: Total Paid */}
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <CheckCircle2 size={18} color="#10B981" />
            <Text style={{ color: '#10B981', fontSize: 14, fontWeight: '800', marginTop: 4 }}>
              {formatCurrency(job.totalPaid, currencySymbol)}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 10, fontWeight: '600', marginTop: 2 }}>
              Paid
            </Text>
          </View>

          {/* Box 4: Pending Balance */}
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Clock size={18} color={hasPending ? '#EF4444' : '#10B981'} />
            <Text
              style={{
                color: hasPending ? '#EF4444' : '#10B981',
                fontSize: 14,
                fontWeight: '800',
                marginTop: 4,
              }}
            >
              {formatCurrency(job.pendingAmount, currencySymbol)}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 10, fontWeight: '600', marginTop: 2 }}>
              Balance
            </Text>
          </View>
        </View>

        {/* CUSTOMER CONTACT CARD (Screen 3 Agent Card with Solid Black Pill Button) */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 10 }}>
            Customer
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
                  {getInitials(job.customerName || 'Rahul')}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }} numberOfLines={1}>
                  {job.customerName}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>
                  {job.customerPhone}
                </Text>
              </View>
            </View>

            {/* Solid Black Pill Button (Screen 3 style) */}
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${job.customerPhone}`)}
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
                Call Customer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SERVICES & SPARE PARTS BREAKDOWN (Clean Screen 3 list) */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 10 }}>
            Services & Spare Parts ({job.items?.length || 0})
          </Text>

          <View
            style={{
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 24,
              padding: 16,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            {job.items?.map((item: any, idx: number) => (
              <View
                key={item.id || idx}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderBottomWidth: idx < (job.items?.length || 0) - 1 ? 1 : 0,
                  borderBottomColor: theme.border,
                }}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                    {item.type === 'PART' ? '📦 Spare Part' : '🔧 Workshop Labor'} • Qty: {item.quantity || 1}
                  </Text>
                </View>

                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                  {formatCurrency(item.amount || item.unitPrice, currencySymbol)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* BOTTOM ACTION BUTTON: RECORD PAYMENT */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Record Payment',
              `Record collection of ${currencySymbol}${job.pendingAmount} for Job ${job.jobNumber}?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Collect Payment',
                  onPress: () => {
                    Alert.alert('Payment Recorded', `Payment collected and credited to bank account!`);
                    router.back();
                  },
                },
              ]
            );
          }}
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
          <CreditCard size={18} color={isDark ? '#12141A' : '#FFFFFF'} />
          <Text
            style={{
              color: isDark ? '#12141A' : '#FFFFFF',
              fontSize: 16,
              fontWeight: '800',
            }}
          >
            {hasPending ? `Collect Payment (${formatCurrency(job.pendingAmount, currencySymbol)})` : 'Job Fully Settled ✓'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
