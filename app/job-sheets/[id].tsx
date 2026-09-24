// ============================================================
// Job Sheet Details Screen — Cool Car AC Repair Workshop
// Simple English labels, Mechanic Assignment, Balance Due & Status Management
// Signboard Royal Blue (#153580) & Midnight Navy (#0C1829) Luxury Aesthetic
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
  Repeat,
  CheckCircle2,
  Clock,
  Wrench,
  Package,
  UserCheck,
  Calendar,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { JobStatus } from '../../src/types/jobSheet.types';
import { DynamicCarIllustration } from '../../src/components/common/CarIllustrations';

export default function JobSheetDetailsScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { jobSheets, updateJobSheet } = useJobSheetStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'items'>('overview');

  const job = useMemo(() => {
    const found = jobSheets.find((j) => j.id === params.id || j.jobNumber === params.id);
    if (found) return found;
    return {
      id: params.id ?? 'JS-2026-001',
      jobNumber: 'CCG-1024',
      date: 'Today, 11:30 AM',
      time: '11:30 AM',
      status: 'IN_PROGRESS' as JobStatus,
      paymentStatus: 'PARTIALLY_PAID' as const,
      customerName: 'Rajesh Sharma',
      customerPhone: '+91 98201 12345',
      vehicleNumber: 'MH02AB1234',
      vehicleMake: 'Honda',
      vehicleModel: 'City ZX i-VTEC',
      workCategory: 'AC' as const,
      assignedMechanicName: 'Irfan Khan (Head AC Mechanic)',
      subtotal: 5150,
      discount: 250,
      previousPendingAmount: 0,
      finalAmount: 4900,
      totalPaid: 3000,
      pendingAmount: 1900,
      paymentMode: 'UPI' as const,
      bankAccountName: 'HDFC Current A/c (Primary)',
      items: [
        { id: '1', name: 'AC Gas Refill (R134a)', type: 'SERVICE' as const, quantity: 1, unitPrice: 1800, amount: 1800 },
        { id: '2', name: 'Cooling Coil Service & Clean', type: 'SERVICE' as const, quantity: 1, unitPrice: 2500, amount: 2500 },
        { id: '3', name: 'Cabin AC Filter OEM', type: 'PART' as const, quantity: 1, unitPrice: 450, amount: 450 },
        { id: '4', name: 'AC Compressor Oil (PAG 46)', type: 'PART' as const, quantity: 1, unitPrice: 350, amount: 350 },
      ],
    };
  }, [params.id, jobSheets]);

  const [currentStatus, setCurrentStatus] = useState<JobStatus>(job.status);

  const handleToggleStatus = () => {
    const nextStatus: JobStatus =
      currentStatus === 'OPEN'
        ? 'IN_PROGRESS'
        : currentStatus === 'IN_PROGRESS'
        ? 'COMPLETED'
        : 'OPEN';

    setCurrentStatus(nextStatus);
    updateJobSheet(job.id, { status: nextStatus });
    Alert.alert('Status Updated', `Job Sheet #${job.jobNumber} marked as "${nextStatus.replace('_', ' ')}".`);
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'OPEN':
        return { bg: 'rgba(251, 191, 36, 0.25)', text: '#FBBF24', label: 'Open' };
      case 'IN_PROGRESS':
        return { bg: 'rgba(96, 165, 250, 0.25)', text: '#60A5FA', label: 'In Progress' };
      case 'COMPLETED':
        return { bg: 'rgba(52, 211, 153, 0.25)', text: '#34D399', label: 'Completed' };
      case 'CANCELLED':
        return { bg: 'rgba(248, 113, 113, 0.25)', text: '#F87171', label: 'Cancelled' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.25)', text: '#94A3B8', label: status };
    }
  };

  const statusStyle = getStatusBadge(currentStatus);

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

            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                {job.jobNumber}
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 11, fontWeight: '600' }}>
                Cool Car AC Repair
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => Alert.alert('Share Job Sheet', `Job Sheet #${job.jobNumber} details copied to clipboard.`)}
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
          {/* Distinct Car Silhouette & Badge */}
          <View style={{ marginBottom: 10 }}>
            <DynamicCarIllustration modelName={job.vehicleModel} size={70} showBadge={true} />
          </View>

          {/* Vehicle Model & Registration */}
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900', letterSpacing: -0.3 }}>
            {job.vehicleModel}
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 14, fontWeight: '800', marginTop: 2 }}>
            {job.vehicleNumber} • <Text style={{ fontWeight: '600' }}>{job.customerName}</Text>
          </Text>

          {/* Intake Date & Logged Time (Direct User Request) */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginTop: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Clock size={13} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
              Logged: {job.time || '11:30 AM'} • {typeof job.date === 'string' ? job.date : 'Today'}
            </Text>
          </View>

          {/* Prominent Amount */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 12, marginBottom: 8 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1 }}>
              {formatCurrency(job.finalAmount, currencySymbol)}
            </Text>
          </View>

          {/* Status & Payment & Work Category Pills */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
            {/* Work Category Pill */}
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 16,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                {job.workCategory === 'AC' ? '❄️ AC Work' : job.workCategory === 'MECHANICAL' ? '🔧 Mechanical' : '⚙️ Both'}
              </Text>
            </View>

            {/* Status Pill */}
            <View
              style={{
                backgroundColor: statusStyle.bg,
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 16,
              }}
            >
              <Text style={{ color: statusStyle.text, fontSize: 12, fontWeight: '800' }}>
                {statusStyle.label}
              </Text>
            </View>

            {/* Payment Balance Pill */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: job.pendingAmount === 0 ? 'rgba(52, 211, 153, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 16,
              }}
            >
              {job.pendingAmount === 0 ? (
                <CheckCircle2 size={13} color="#34D399" />
              ) : (
                <Clock size={13} color="#EF4444" />
              )}
              <Text
                style={{
                  color: job.pendingAmount === 0 ? '#34D399' : '#EF4444',
                  fontSize: 12,
                  fontWeight: '800',
                }}
              >
                {job.pendingAmount === 0 ? 'Fully Paid' : `Balance Due: ${formatCurrency(job.pendingAmount, currencySymbol)}`}
              </Text>
            </View>
          </View>

          {/* 4 Circular Action Buttons (Payment, Status, Call, WhatsApp) */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, width: '100%' }}>
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
                Collect
              </Text>
            </TouchableOpacity>

            {/* Toggle Status */}
            <TouchableOpacity
              onPress={handleToggleStatus}
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
                Next Status
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

            {/* Share / Invoice */}
            <TouchableOpacity
              onPress={() => Alert.alert('Bill Generated', `Invoice for Job #${job.jobNumber} ready to print or WhatsApp.`)}
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
                <Share2 size={19} color="#FFFFFF" strokeWidth={2.2} />
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                Share Bill
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Crisp Lower Sheet */}
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
                Services & Parts ({job.items.length})
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'overview' ? (
            <View style={{ gap: 14 }}>
              {/* Assigned Staff / Mechanic Card */}
              <GlassCard
                variant={isDark ? 'navy' : 'sand'}
                padding={16}
                style={{
                  borderRadius: 22,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: isDark ? '#60A5FA' : '#153580',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UserCheck size={20} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
                      Assigned Mechanic
                    </Text>
                    <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 15, fontWeight: '800', marginTop: 2 }}>
                      {job.assignedMechanicName || 'Irfan Khan (Head AC Mechanic)'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => router.push('/staff' as any)}
                  style={{
                    backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 14,
                  }}
                >
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 12, fontWeight: '800' }}>
                    Staff Details
                  </Text>
                </TouchableOpacity>
              </GlassCard>

              {/* 4-Box Spec Metric Grid */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Current Work</Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    {formatCurrency(job.subtotal, currencySymbol)}
                  </Text>
                </GlassCard>

                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Previous Due</Text>
                  <Text style={{ color: (job.previousPendingAmount || 0) > 0 ? '#EF4444' : '#34D399', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    {formatCurrency(job.previousPendingAmount || 0, currencySymbol)}
                  </Text>
                </GlassCard>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Paid So Far</Text>
                  <Text style={{ color: '#34D399', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    {formatCurrency(job.totalPaid, currencySymbol)}
                  </Text>
                </GlassCard>

                <GlassCard variant={isDark ? 'navy' : 'sand'} padding={16} style={{ flex: 1, borderRadius: 22 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Balance Due</Text>
                  <Text style={{ color: job.pendingAmount > 0 ? '#EF4444' : '#34D399', fontSize: 17, fontWeight: '900', marginTop: 2 }}>
                    {formatCurrency(job.pendingAmount, currencySymbol)}
                  </Text>
                </GlassCard>
              </View>

              {/* Payment Mode & Bank Account Info Card */}
              {job.paymentMode && (
                <GlassCard
                  variant={isDark ? 'navy' : 'sand'}
                  padding={14}
                  style={{ borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700' }}>
                    Payment Mode & Account:
                  </Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 13, fontWeight: '800' }}>
                    {job.paymentMode} {job.bankAccountName ? `• ${job.bankAccountName}` : ''}
                  </Text>
                </GlassCard>
              )}

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
                    Customer Details
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
                    Call Customer
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
                        {item.type === 'SERVICE' ? 'Service / Labor' : 'Spare Part'} • Qty: {item.quantity} × {formatCurrency(item.unitPrice, currencySymbol)}
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
              {job.pendingAmount > 0 ? `Collect Balance (${formatCurrency(job.pendingAmount, currencySymbol)})` : 'Print Invoice'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
