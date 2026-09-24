// ============================================================
// Job Sheet Details Screen — Cool Car AC Repair Workshop
// Zero-Bleed Sky Blue Header & Clean Lower Sheet
// Status Logic: In Progress until paid -> then Done
// Payment CTA with Amount Modification & Bank Account Selector
// ============================================================

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Share2,
  Clock,
  Wrench,
  Package,
  CheckCircle2,
  CreditCard,
  QrCode,
  Banknote,
  Building2,
  X,
  ArrowDown,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { usePaymentStore } from '../../src/store/paymentStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { JobStatus } from '../../src/types/jobSheet.types';
import { PaymentMode } from '../../src/types/payment.types';
import { DynamicCarIllustration } from '../../src/components/common/CarIllustrations';

export default function JobSheetDetailsScreen() {
  const { isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { jobSheets, updateJobSheet } = useJobSheetStore();
  const { addPayment } = usePaymentStore();
  const accounts = useBankAccountStore((s) => s.accounts);
  const activeAccounts = useMemo(() => accounts.filter((a) => a.isActive), [accounts]);

  const [activeTab, setActiveTab] = useState<'overview' | 'items'>('overview');

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmountStr, setPaymentAmountStr] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [selectedBankId, setSelectedBankId] = useState<string>('');

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

  // Open Payment modal with pre-filled pending amount
  const handleOpenPayment = () => {
    setPaymentAmountStr(job.pendingAmount > 0 ? String(job.pendingAmount) : String(job.finalAmount));
    setPaymentMode('CASH');
    if (activeAccounts.length > 0) {
      setSelectedBankId(activeAccounts[0].id);
    }
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
    const amt = parseFloat(paymentAmountStr);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }

    const selectedAcc = activeAccounts.find((a) => a.id === selectedBankId);
    const newTotalPaid = (job.totalPaid || 0) + amt;
    const newPending = Math.max(0, job.finalAmount - newTotalPaid);
    const isFullyPaid = newPending === 0;

    // 1. Record in Payment Store
    addPayment({
      id: `pay-${Date.now()}`,
      enterpriseId: enterpriseId || 'enterprise-dev-001',
      jobSheetId: job.id,
      customerId: (job as any).customerId || 'cust-walkin',
      vehicleId: (job as any).vehicleId || 'veh-generic',
      amount: amt,
      paymentMode,
      paymentAccountId: (paymentMode === 'UPI' || paymentMode === 'CARD_SWIPE') ? selectedBankId : undefined,
      paymentAccountName: (paymentMode === 'UPI' || paymentMode === 'CARD_SWIPE') ? selectedAcc?.bankName : 'Cash Counter Register',
      date: new Date().toISOString(),
      referenceNumber: `${paymentMode === 'UPI' ? 'UPI' : paymentMode === 'CARD_SWIPE' ? 'POS' : 'CSH'}-${Date.now().toString().slice(-4)}`,
      voided: false,
      createdBy: 'user-manager',
      createdAt: new Date().toISOString(),
    });

    // 2. Update Job Sheet: If fully paid -> COMPLETED ("Done"), else IN_PROGRESS
    updateJobSheet(job.id, {
      totalPaid: newTotalPaid,
      pendingAmount: newPending,
      status: isFullyPaid ? 'COMPLETED' : 'IN_PROGRESS',
      paymentStatus: isFullyPaid ? 'PAID' : 'PARTIALLY_PAID',
    });

    setIsPaymentModalOpen(false);
    Alert.alert(
      'Payment Recorded',
      `Collected ${formatCurrency(amt, currencySymbol)} via ${paymentMode === 'CARD_SWIPE' ? 'Swipe' : paymentMode}.\nJob Sheet Status: ${isFullyPaid ? 'Done' : 'In Progress'}`
    );
  };

  const isDone = (job.pendingAmount === 0 && job.finalAmount > 0) || job.status === 'COMPLETED';

  const canvasBg = isDark ? '#0A0D14' : '#153580';
  const sheetBg = isDark ? '#0A0D14' : '#F4F6F9';
  const cardBg = isDark ? '#141824' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.08)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={canvasBg} />

      {/* Royal Blue Top Header */}
      <View
        style={{
          backgroundColor: canvasBg,
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 24,
          alignItems: 'center',
        }}
      >
        {/* Top Bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
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
            onPress={() => Alert.alert('Share Job Sheet', `Job Sheet #${job.jobNumber} copied to clipboard.`)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Share2 size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Dynamic Car Silhouette */}
        <View style={{ marginBottom: 8 }}>
          <DynamicCarIllustration modelName={job.vehicleModel} size={64} showBadge={true} />
        </View>

        <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '900', letterSpacing: -0.3 }}>
          {job.vehicleModel}
        </Text>
        <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: '800', marginTop: 2 }}>
          {job.vehicleNumber} • <Text style={{ fontWeight: '600' }}>{job.customerName}</Text>
        </Text>

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

        {/* Bill Total */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 10, marginBottom: 8 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '900', letterSpacing: -0.5 }}>
            {formatCurrency(job.finalAmount, currencySymbol)}
          </Text>
        </View>

        {/* Status Pill & Payment Pill */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
              {job.workCategory === 'AC' ? '❄️ AC Work' : job.workCategory === 'MECHANICAL' ? '🔧 Mechanical' : '⚙️ Both'}
            </Text>
          </View>

          {/* User Requested: In Progress until paid, then Done */}
          <View
            style={{
              backgroundColor: isDone ? 'rgba(16, 185, 129, 0.25)' : 'rgba(96, 165, 250, 0.25)',
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {isDone && <CheckCircle2 size={12} color="#10B981" />}
            <Text style={{ color: isDone ? '#10B981' : '#93C5FD', fontSize: 11, fontWeight: '800' }}>
              {isDone ? 'Done' : 'In Progress'}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: job.pendingAmount === 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                color: job.pendingAmount === 0 ? '#10B981' : '#FCA5A5',
                fontSize: 11,
                fontWeight: '800',
              }}
            >
              {job.pendingAmount === 0 ? 'Fully Paid' : `Due: ${formatCurrency(job.pendingAmount, currencySymbol)}`}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content Sheet with ZERO Blue Bleed */}
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
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 18, paddingBottom: 40 }}
        >
          {/* Segmented Switcher */}
          <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity onPress={() => setActiveTab('overview')} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: activeTab === 'overview' ? '900' : '600',
                  color: activeTab === 'overview' ? (isDark ? '#FFFFFF' : '#0F172A') : '#94A3B8',
                }}
              >
                Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveTab('items')} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: activeTab === 'items' ? '900' : '600',
                  color: activeTab === 'items' ? (isDark ? '#FFFFFF' : '#0F172A') : '#94A3B8',
                }}
              >
                Services & Parts ({job.items.length})
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'overview' ? (
            <View style={{ gap: 12 }}>
              {/* Assigned Staff Card */}
              <GlassCard
                variant={isDark ? 'navy' : 'sand'}
                padding={14}
                style={{ borderRadius: 20 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor: '#153580',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Wrench size={16} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 14, fontWeight: '800' }}>
                      {job.assignedMechanicName || 'Head AC Mechanic'}
                    </Text>
                    <Text style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: 11, fontWeight: '600' }}>
                      Cool Car Assigned Mechanic
                    </Text>
                  </View>
                </View>
              </GlassCard>

              {/* Settlement Summary Card */}
              <View
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Billing Breakdown
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: 13 }}>Items Subtotal</Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 13, fontWeight: '700' }}>
                    {formatCurrency(job.subtotal, currencySymbol)}
                  </Text>
                </View>
                {job.discount > 0 && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#10B981', fontSize: 13 }}>Discount</Text>
                    <Text style={{ color: '#10B981', fontSize: 13, fontWeight: '700' }}>
                      -{formatCurrency(job.discount, currencySymbol)}
                    </Text>
                  </View>
                )}
                <View style={{ height: 1, backgroundColor: cardBorder, marginVertical: 2 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 15, fontWeight: '800' }}>Total Bill</Text>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 15, fontWeight: '900' }}>
                    {formatCurrency(job.finalAmount, currencySymbol)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#10B981', fontSize: 13, fontWeight: '700' }}>Total Paid</Text>
                  <Text style={{ color: '#10B981', fontSize: 13, fontWeight: '800' }}>
                    {formatCurrency(job.totalPaid, currencySymbol)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: job.pendingAmount > 0 ? '#EF4444' : '#10B981', fontSize: 13, fontWeight: '700' }}>
                    Balance Due
                  </Text>
                  <Text style={{ color: job.pendingAmount > 0 ? '#EF4444' : '#10B981', fontSize: 13, fontWeight: '800' }}>
                    {formatCurrency(job.pendingAmount, currencySymbol)}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              {job.items.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderRadius: 18,
                    backgroundColor: cardBg,
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: '#153580',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.type === 'PART' ? <Package size={15} color="#FFFFFF" /> : <Wrench size={15} color="#FFFFFF" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 13, fontWeight: '800' }}>
                        {item.name}
                      </Text>
                      <Text style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: 11, fontWeight: '600', marginTop: 1 }}>
                        {item.type === 'SERVICE' ? 'Service / Labor' : 'Spare Part'} • Qty: {item.quantity}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 14, fontWeight: '900' }}>
                    {formatCurrency(item.amount, currencySymbol)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* User Requested: "Payment" button with Amount Modify & Bank Selection */}
          {isDone ? (
            <View
              style={{
                backgroundColor: '#10B981',
                paddingVertical: 16,
                borderRadius: 24,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 20,
              }}
            >
              <CheckCircle2 size={20} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                Job Completed & Paid in Full ✓
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleOpenPayment}
              activeOpacity={0.88}
              style={{
                backgroundColor: '#153580',
                paddingVertical: 16,
                borderRadius: 24,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 20,
                shadowColor: '#153580',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <ArrowDown size={18} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                Payment {job.pendingAmount > 0 ? `(${formatCurrency(job.pendingAmount, currencySymbol)})` : ''}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Payment Collection Modal with Amount Modify & Bank Selection */}
      <Modal
        visible={isPaymentModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPaymentModalOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: cardBg,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 20,
              paddingBottom: insets.bottom + 20,
              gap: 14,
            }}
          >
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  Record Payment
                </Text>
                <Text style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', marginTop: 2 }}>
                  Job #{job.jobNumber} • {job.vehicleNumber}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsPaymentModalOpen(false)}
                style={{ padding: 6, borderRadius: 12, backgroundColor: isDark ? '#1C2538' : '#F1F5F9' }}
              >
                <X size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            {/* Total, Paid, and Current Balance Overview */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: isDark ? '#1C2538' : '#F8FAFC',
                borderRadius: 16,
                padding: 12,
                borderWidth: 1,
                borderColor: cardBorder,
                justifyContent: 'space-around',
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Total Bill</Text>
                <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 2 }}>
                  {formatCurrency(job.finalAmount, currencySymbol)}
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: cardBorder }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Already Paid</Text>
                <Text style={{ fontSize: 15, fontWeight: '900', color: '#10B981', marginTop: 2 }}>
                  {formatCurrency(job.totalPaid || 0, currencySymbol)}
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: cardBorder }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Balance Due</Text>
                <Text style={{ fontSize: 15, fontWeight: '900', color: '#EF4444', marginTop: 2 }}>
                  {formatCurrency(job.pendingAmount, currencySymbol)}
                </Text>
              </View>
            </View>

            {/* Editable Amount Input */}
            <View>
              <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', marginBottom: 6 }}>
                Collecting Now (Modify if customer leaves balance/udhari)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: cardBorder,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#153580', marginRight: 8 }}>
                  ₹
                </Text>
                <TextInput
                  value={paymentAmountStr}
                  onChangeText={setPaymentAmountStr}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  style={{
                    flex: 1,
                    fontSize: 22,
                    fontWeight: '900',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  }}
                />
              </View>

              {/* Dynamic Udhari / Balance Calculation */}
              {(() => {
                const payingNow = parseFloat(paymentAmountStr) || 0;
                const remainingUdhari = Math.max(0, job.pendingAmount - payingNow);
                return remainingUdhari > 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: isDark ? '#450A0A' : '#FEF2F2',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 12,
                      marginTop: 8,
                      gap: 6,
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#EF4444' }}>
                      Remaining Udhari / Due: {formatCurrency(remainingUdhari, currencySymbol)}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: isDark ? '#064E3B' : '#F0FDF4',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 12,
                      marginTop: 8,
                      gap: 6,
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#10B981' }}>
                      Full payment — no customer balance will remain.
                    </Text>
                  </View>
                );
              })()}
            </View>

            {/* Payment Mode Selector Tabs with Authentic Logos */}
            <View>
              <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', marginBottom: 8 }}>
                Payment Method
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[
                  { mode: 'CASH' as PaymentMode, label: 'Cash', icon: Banknote },
                  { mode: 'UPI' as PaymentMode, label: 'UPI', icon: QrCode },
                  { mode: 'CARD_SWIPE' as PaymentMode, label: 'Swipe', icon: CreditCard },
                ].map((item) => {
                  const isSelected = paymentMode === item.mode;
                  const ModeIcon = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.mode}
                      onPress={() => setPaymentMode(item.mode)}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 16,
                        backgroundColor: isSelected ? '#153580' : (isDark ? '#1C2538' : '#F1F5F9'),
                        alignItems: 'center',
                        gap: 4,
                        borderWidth: 1,
                        borderColor: isSelected ? '#153580' : cardBorder,
                      }}
                    >
                      <ModeIcon size={16} color={isSelected ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B')} />
                      <Text style={{ fontSize: 12, fontWeight: '800', color: isSelected ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#475569') }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Target Bank Account (Shown when UPI or Swipe is selected) */}
            {(paymentMode === 'UPI' || paymentMode === 'CARD_SWIPE') && (
              <View>
                <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', marginBottom: 8 }}>
                  Deposit Into Bank Account:
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {activeAccounts.map((acc) => {
                    const isSelected = selectedBankId === acc.id;
                    return (
                      <TouchableOpacity
                        key={acc.id}
                        onPress={() => setSelectedBankId(acc.id)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 14,
                          backgroundColor: isSelected ? '#153580' : (isDark ? '#1C2538' : '#F1F5F9'),
                          borderWidth: 1,
                          borderColor: isSelected ? '#153580' : cardBorder,
                        }}
                      >
                        <Building2 size={13} color={isSelected ? '#FFFFFF' : '#64748B'} />
                        <Text style={{ fontSize: 12, fontWeight: '800', color: isSelected ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#475569') }}>
                          {acc.bankName} {acc.accountNumber ? `(${acc.accountNumber.slice(-4)})` : ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Confirm Payment CTA */}
            <TouchableOpacity
              onPress={handleConfirmPayment}
              activeOpacity={0.88}
              style={{
                backgroundColor: '#10B981',
                paddingVertical: 15,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 6,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900' }}>
                Confirm & Mark Job Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
