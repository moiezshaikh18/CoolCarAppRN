// ============================================================
// Job Sheet Details Screen — Cool Car AC Repair Workshop
// Zero-Bleed Sky Blue Header & Clean Lower Sheet
// Status Logic: In Progress until paid -> then Done
// Payment CTA with Amount Modification & Bank Account Selector
// ============================================================

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
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
  Layers,
  Printer,
  CheckSquare,
  Sparkles,
  Sliders,
  Check,
  RotateCcw,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { usePaymentStore } from '../../src/store/paymentStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { JobSheet, JobStatus } from '../../src/types/jobSheet.types';
import { PaymentMode } from '../../src/types/payment.types';
import { DynamicCarIllustration } from '../../src/components/common/CarIllustrations';
import { printJobCard } from '../../src/utils/jobCardPdf';
import { STANDARD_18_ROUTINE_ITEMS } from '../../src/constants/routineCheckup';

export default function JobSheetDetailsScreen() {
  const { isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; openPayment?: string }>();
  const { jobSheets, updateJobSheet } = useJobSheetStore();
  const { addPayment } = usePaymentStore();
  const accounts = useBankAccountStore((s) => s.accounts);
  const activeAccounts = useMemo(() => accounts.filter((a) => a.isActive), [accounts]);

  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'inspection'>('overview');
  const [routineValues, setRoutineValues] = useState<Record<string, string>>({});
  const [isSavingRoutine, setIsSavingRoutine] = useState(false);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'SINGLE' | 'SPLIT'>('SINGLE');

  // Single mode state
  const [paymentAmountStr, setPaymentAmountStr] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [selectedBankId, setSelectedBankId] = useState<string>('');

  // Multi-mode Split Payment state (e.g. ₹1000 Cash + ₹3000 UPI + ₹2000 Swipe)
  const [splitCashStr, setSplitCashStr] = useState('');
  const [splitUpiStr, setSplitUpiStr] = useState('');
  const [splitUpiBankId, setSplitUpiBankId] = useState<string>('');
  const [splitSwipeStr, setSplitSwipeStr] = useState('');
  const [splitSwipeBankId, setSplitSwipeBankId] = useState<string>('');

  // PDF generation loading state
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const [dbJob, setDbJob] = useState<JobSheet | null>(null);

  useEffect(() => {
    if (!params.id) return;
    const found = jobSheets.find((j) => j.id === params.id || j.jobNumber === params.id);
    if (found) {
      return;
    }
    const fetchFromDb = async () => {
      try {
        const entId = enterpriseId || 'enterprise-cool-car';
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');
        const snap = await getDoc(doc(db, 'enterprises', entId, 'jobSheets', params.id as string));
        if (snap.exists()) {
          setDbJob({ id: snap.id, ...snap.data() } as JobSheet);
        }
      } catch (err) {
        console.log('[JobDetail] fetch error:', err);
      }
    };
    fetchFromDb();
  }, [params.id, jobSheets, enterpriseId]);

  const job = useMemo(() => {
    return jobSheets.find((j) => j.id === params.id || j.jobNumber === params.id) || dbJob;
  }, [params.id, jobSheets, dbJob]);

  useEffect(() => {
    if (job?.routineCheckup) {
      const timer = setTimeout(() => {
        setRoutineValues(job.routineCheckup || {});
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [job?.id, job?.routineCheckup]);

  const filledRoutineCount = useMemo(() => {
    return STANDARD_18_ROUTINE_ITEMS.filter((it) => {
      const v = routineValues[it.key] ?? job?.routineCheckup?.[it.key];
      return Boolean(v && v.trim() !== '');
    }).length;
  }, [routineValues, job?.routineCheckup]);

  const handleUpdateRoutineItem = (key: string, value: string) => {
    setRoutineValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleMarkAllOk = () => {
    const allOk: Record<string, string> = {};
    STANDARD_18_ROUTINE_ITEMS.forEach((it) => {
      allOk[it.key] = it.defaultVal;
    });
    setRoutineValues(allOk);
    Alert.alert('18 Standard Checks Updated', 'All 18 Routine AC checkpoints populated with standard OK values. Tap "Save Checkup" to save.');
  };

  const handleClearAllRoutine = () => {
    const cleared: Record<string, string> = {};
    STANDARD_18_ROUTINE_ITEMS.forEach((it) => {
      cleared[it.key] = '';
    });
    setRoutineValues(cleared);
    Alert.alert('Checkpoints Cleared', 'All 18 Routine Checkpoints cleared. They will print as blank lines for manual pen writing.');
  };

  const handleSaveRoutineCheckup = async () => {
    if (!job) return;
    setIsSavingRoutine(true);
    try {
      updateJobSheet(job.id, {
        routineCheckup: routineValues,
      });
      const entId = enterpriseId || 'enterprise-cool-car';
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      await setDoc(
        doc(db, 'enterprises', entId, 'jobSheets', job.id),
        { routineCheckup: routineValues, updatedAt: new Date().toISOString() },
        { merge: true }
      );
      Alert.alert('Saved ✓', '18-Point Routine AC Check-up saved to cloud & will print on the physical-style Job Card.');
    } catch (err) {
      console.log('Error saving routine checkup:', err);
      Alert.alert('Saved Locally', 'Saved in app memory.');
    } finally {
      setIsSavingRoutine(false);
    }
  };

  // ── Cool Car Job Card Payload Builder ────────────────────────
  const getJobCardData = () => {
    if (!job) return null;
    const services = ((job as any)?.items || [])
      .filter((it: any) => it.type === 'SERVICE')
      .map((it: any) => it.name);

    const parts = ((job as any)?.items || [])
      .filter((it: any) => it.type === 'PART')
      .map((it: any) => ({
        name: it.name,
        qty: it.quantity,
        price: it.unitPrice,
      }));

    // Dynamic routine checkup: strictly manual values without forcing fake OK defaults
    const rc: Record<string, string> = {};
    STANDARD_18_ROUTINE_ITEMS.forEach((it) => {
      rc[it.key] = routineValues[it.key] ?? job.routineCheckup?.[it.key] ?? '';
    });

    return {
      jobNumber: job.jobNumber || job.id,
      date: typeof job.date === 'string' ? job.date : new Date(job.date).toLocaleDateString('en-IN'),
      time: job.time,
      customerName: job.customerName,
      customerPhone: job.customerPhone,
      vehicleNumber: job.vehicleNumber,
      vehicleMake: job.vehicleMake,
      vehicleModel: job.vehicleModel,
      workCategory: job.workCategory,
      assignedMechanicName: job.assignedMechanicName,
      demandedWork: services.length > 0 ? services : undefined,
      workDone: services,
      partsInUse: parts,
      routineCheckup: rc as any,
      notes: (job as any).notes,
      subtotal: job.subtotal,
      discount: job.discount,
      finalAmount: job.finalAmount,
      totalPaid: job.totalPaid,
      pendingAmount: job.pendingAmount,
      paymentStatus: job.paymentStatus,
      currencySymbol,
    };
  };

  // ── Direct Native Print ──────────────────────────────────────
  const handleDirectPrint = async () => {
    const data = getJobCardData();
    if (!data) return;
    setIsPdfGenerating(true);
    try {
      await printJobCard(data);
    } catch (err) {
      console.error('[JobCardPDF] Error printing:', err);
      Alert.alert('Print Error', `Could not open printer.\nDetails: ${String(err)}`);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Open Payment modal with pre-filled pending amount
  const handleOpenPayment = () => {
    if (!job) return;
    const defaultAmt = job.pendingAmount > 0 ? String(job.pendingAmount) : String(job.finalAmount);
    setPaymentAmountStr(defaultAmt);
    setPaymentMode('CASH');
    if (activeAccounts.length > 0) {
      setSelectedBankId(activeAccounts[0].id);
      setSplitUpiBankId(activeAccounts[0].id);
      setSplitSwipeBankId(activeAccounts[0].id);
    }
    setSplitCashStr(defaultAmt);
    setSplitUpiStr('');
    setSplitSwipeStr('');
    setPaymentType('SINGLE');
    setIsPaymentModalOpen(true);
  };

  // Auto-open if query param openPayment === 'true'
  useEffect(() => {
    if (params.openPayment === 'true') {
      const timer = setTimeout(() => {
        handleOpenPayment();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [params.openPayment]);

  // Mark Work as Completed directly without payment (e.g. car ready for delivery)
  const handleMarkWorkDone = () => {
    if (!job) return;
    updateJobSheet(job.id, {
      status: 'COMPLETED',
    });
    Alert.alert(
      'Work Completed ✓',
      `Job #${job.jobNumber} marked as COMPLETED.\n${job.pendingAmount > 0 ? `Remaining customer balance (₹${job.pendingAmount}) can be collected anytime.` : 'All dues are settled.'}`
    );
  };

  const handleConfirmPayment = () => {
    if (!job) return;
    if (paymentType === 'SINGLE') {
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

      // 2. Update Job Sheet: Always mark as COMPLETED as work is done!
      updateJobSheet(job.id, {
        totalPaid: newTotalPaid,
        pendingAmount: newPending,
        status: 'COMPLETED',
        paymentStatus: isFullyPaid ? 'PAID' : (newTotalPaid > 0 ? 'PARTIALLY_PAID' : 'PENDING'),
      });

      setIsPaymentModalOpen(false);
      Alert.alert(
        'Payment Recorded',
        `Collected ${formatCurrency(amt, currencySymbol)} via ${paymentMode === 'CARD_SWIPE' ? 'Swipe' : paymentMode}.\nJob Status: Completed${!isFullyPaid ? ` • Pending Udhari: ${formatCurrency(newPending, currencySymbol)}` : ' • Fully Settled'}`
      );
    } else {
      // Split Multi-Mode Payment
      const cashAmt = parseFloat(splitCashStr) || 0;
      const upiAmt = parseFloat(splitUpiStr) || 0;
      const swipeAmt = parseFloat(splitSwipeStr) || 0;
      const totalCollected = cashAmt + upiAmt + swipeAmt;

      if (totalCollected <= 0) {
        Alert.alert('Invalid Amount', 'Please enter at least one payment amount (Cash, UPI, or Swipe).');
        return;
      }

      const upiAcc = activeAccounts.find((a) => a.id === splitUpiBankId);
      const swipeAcc = activeAccounts.find((a) => a.id === splitSwipeBankId);
      const now = Date.now();
      const modesUsed: string[] = [];

      if (cashAmt > 0) {
        addPayment({
          id: `pay-${now}-cash`,
          enterpriseId: enterpriseId || 'enterprise-dev-001',
          jobSheetId: job.id,
          customerId: (job as any).customerId || 'cust-walkin',
          vehicleId: (job as any).vehicleId || 'veh-generic',
          amount: cashAmt,
          paymentMode: 'CASH',
          paymentAccountName: 'Cash Counter Register',
          date: new Date().toISOString(),
          referenceNumber: `CSH-${now.toString().slice(-4)}`,
          voided: false,
          createdBy: 'user-manager',
          createdAt: new Date().toISOString(),
        });
        modesUsed.push(`Cash: ${formatCurrency(cashAmt, currencySymbol)}`);
      }

      if (upiAmt > 0) {
        addPayment({
          id: `pay-${now + 1}-upi`,
          enterpriseId: enterpriseId || 'enterprise-dev-001',
          jobSheetId: job.id,
          customerId: (job as any).customerId || 'cust-walkin',
          vehicleId: (job as any).vehicleId || 'veh-generic',
          amount: upiAmt,
          paymentMode: 'UPI',
          paymentAccountId: splitUpiBankId || undefined,
          paymentAccountName: upiAcc?.bankName || 'UPI Account',
          date: new Date().toISOString(),
          referenceNumber: `UPI-${(now + 1).toString().slice(-4)}`,
          voided: false,
          createdBy: 'user-manager',
          createdAt: new Date().toISOString(),
        });
        modesUsed.push(`UPI (${upiAcc?.bankName || 'Bank'}): ${formatCurrency(upiAmt, currencySymbol)}`);
      }

      if (swipeAmt > 0) {
        addPayment({
          id: `pay-${now + 2}-swipe`,
          enterpriseId: enterpriseId || 'enterprise-dev-001',
          jobSheetId: job.id,
          customerId: (job as any).customerId || 'cust-walkin',
          vehicleId: (job as any).vehicleId || 'veh-generic',
          amount: swipeAmt,
          paymentMode: 'CARD_SWIPE',
          paymentAccountId: splitSwipeBankId || undefined,
          paymentAccountName: swipeAcc?.bankName || 'POS Terminal',
          date: new Date().toISOString(),
          referenceNumber: `POS-${(now + 2).toString().slice(-4)}`,
          voided: false,
          createdBy: 'user-manager',
          createdAt: new Date().toISOString(),
        });
        modesUsed.push(`Swipe (${swipeAcc?.bankName || 'POS'}): ${formatCurrency(swipeAmt, currencySymbol)}`);
      }

      const newTotalPaid = (job.totalPaid || 0) + totalCollected;
      const newPending = Math.max(0, job.finalAmount - newTotalPaid);
      const isFullyPaid = newPending === 0;

      // Update Job Sheet: Always mark as COMPLETED as work is done!
      updateJobSheet(job.id, {
        totalPaid: newTotalPaid,
        pendingAmount: newPending,
        status: 'COMPLETED',
        paymentStatus: isFullyPaid ? 'PAID' : (newTotalPaid > 0 ? 'PARTIALLY_PAID' : 'PENDING'),
      });

      setIsPaymentModalOpen(false);
      Alert.alert(
        'Split Payment Recorded',
        `Total Collected: ${formatCurrency(totalCollected, currencySymbol)}\n` +
        modesUsed.join('\n') +
        `\n\nJob Status: Completed${!isFullyPaid ? `\nRemaining Udhari: ${formatCurrency(newPending, currencySymbol)}` : '\nAll Dues Settled ✓'}`
      );
    }
  };

  const canvasBg = isDark ? '#0A0D14' : '#153580';
  const sheetBg = isDark ? '#0A0D14' : '#F4F6F9';
  const cardBg = isDark ? '#141824' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.08)';

  if (!job) {
    return (
      <View style={{ flex: 1, backgroundColor: sheetBg, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <StatusBar barStyle="light-content" backgroundColor={canvasBg} />
        <Text style={{ fontSize: 18, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829', marginBottom: 8 }}>
          Job Sheet Not Found
        </Text>
        <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20 }}>
          The requested job sheet could not be located.
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

  const isDone = (job.pendingAmount === 0 && job.finalAmount > 0) || job.status === 'COMPLETED';

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

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={handleDirectPrint}
              disabled={isPdfGenerating}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: 'rgba(255, 255, 255, 0.28)',
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.35)',
              }}
              accessibilityLabel="Print Job Card"
            >
              {isPdfGenerating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Printer size={15} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '900' }}>Print</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
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
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity onPress={() => setActiveTab('overview')} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 15,
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
                  fontSize: 15,
                  fontWeight: activeTab === 'items' ? '900' : '600',
                  color: activeTab === 'items' ? (isDark ? '#FFFFFF' : '#0F172A') : '#94A3B8',
                }}
              >
                Items ({job.items.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveTab('inspection')} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: activeTab === 'inspection' ? '900' : '600',
                    color: activeTab === 'inspection' ? (isDark ? '#FFFFFF' : '#0F172A') : '#94A3B8',
                  }}
                >
                  18-Pt AC Check
                </Text>
                <View style={{ backgroundColor: '#10B981', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 6 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '900' }}>PRINT</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {activeTab === 'overview' ? (
            <View style={{ gap: 12 }}>
              {/* ══ Prominent Job Card Actions Banner (Print & PDF) ══ */}
              <View
                style={{
                  backgroundColor: isDark ? '#111827' : '#FFFFFF',
                  borderRadius: 22,
                  padding: 16,
                  borderWidth: 1.5,
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Printer size={18} color={isDark ? '#60A5FA' : '#153580'} strokeWidth={2.4} />
                    <Text style={{ fontSize: 14, fontWeight: '900', color: isDark ? '#F1F5F9' : '#0F172A' }}>
                      Job Card Actions
                    </Text>
                  </View>
                  <View style={{ backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: isDark ? '#34D399' : '#15803D' }}>
                      Official B&W Format ✓
                    </Text>
                  </View>
                </View>

                {/* Full-Width Print Job Card Button */}
                <TouchableOpacity
                  onPress={handleDirectPrint}
                  disabled={isPdfGenerating}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    backgroundColor: '#153580',
                    paddingVertical: 15,
                    borderRadius: 16,
                    shadowColor: '#153580',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.25,
                    shadowRadius: 6,
                    elevation: 3,
                  }}
                >
                  {isPdfGenerating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Printer size={18} color="#FFFFFF" strokeWidth={2.4} />
                      <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '900' }}>
                        Print Job Card
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* ══ Routine AC Check-Up (Manual Option) Card in Overview ══ */}
              <View
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  gap: 12,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                      18-Point Routine AC Check-Up
                    </Text>
                    <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                      {filledRoutineCount > 0
                        ? `${filledRoutineCount} of 18 checkpoints recorded`
                        : 'Manual Option: Not filled yet (Prints blank lines for pen fill)'}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                      backgroundColor:
                        filledRoutineCount === 18
                          ? 'rgba(16, 185, 129, 0.15)'
                          : filledRoutineCount > 0
                          ? 'rgba(59, 130, 246, 0.15)'
                          : 'rgba(100, 116, 139, 0.15)',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '800',
                        color:
                          filledRoutineCount === 18
                            ? '#10B981'
                            : filledRoutineCount > 0
                            ? '#3B82F6'
                            : '#64748B',
                      }}
                    >
                      {filledRoutineCount === 18 ? 'Complete 18/18' : `${filledRoutineCount}/18 Done`}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setActiveTab('inspection')}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    backgroundColor: isDark ? '#1C2538' : '#EFF6FF',
                    paddingVertical: 12,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#DBEAFE',
                  }}
                >
                  <CheckSquare size={16} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                  <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#60A5FA' : '#1D4ED8' }}>
                    {filledRoutineCount > 0 ? 'Edit Routine Check-Up (18 Items)' : 'Fill Routine Check-Up Manually'}
                  </Text>
                </TouchableOpacity>
              </View>

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
          ) : activeTab === 'items' ? (
            <View style={{ gap: 8 }}>
              {(job.items || []).map((item: any) => (
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
          ) : (
            <View style={{ gap: 12 }}>
              {/* Inspection Banner & Action Bar */}
              <View
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  gap: 12,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                      Routine AC Check-Up
                    </Text>
                    <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                      Exact 18 physical job card inspection checkpoints
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      onPress={handleClearAllRoutine}
                      activeOpacity={0.8}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderRadius: 12,
                      }}
                    >
                      <RotateCcw size={12} color={isDark ? '#94A3B8' : '#64748B'} />
                      <Text style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: 11, fontWeight: '800' }}>Clear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleMarkAllOk}
                      activeOpacity={0.8}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        backgroundColor: '#153580',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 12,
                      }}
                    >
                      <Sparkles size={13} color="#FFFFFF" />
                      <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>All OK ✓</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  onPress={handleSaveRoutineCheckup}
                  disabled={isSavingRoutine}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: '#10B981',
                    borderRadius: 14,
                    paddingVertical: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 6,
                  }}
                >
                  {isSavingRoutine ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <CheckSquare size={16} color="#FFFFFF" />
                      <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '900' }}>
                        Save Routine Check-Up (Will Print on PDF)
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* 18 Routine Checkpoints List */}
              <View style={{ gap: 8 }}>
                {STANDARD_18_ROUTINE_ITEMS.map((item) => {
                  const currentVal = routineValues[item.key] ?? '';
                  const isChecked = Boolean(currentVal && currentVal.trim() !== '');
                  return (
                    <View
                      key={item.key}
                      style={{
                        backgroundColor: cardBg,
                        borderRadius: 16,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: cardBorder,
                        gap: 8,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', flex: 1 }}>
                          {item.label}
                        </Text>
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 8,
                            backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                          }}
                        >
                          <Text style={{ fontSize: 11, fontWeight: '800', color: isChecked ? '#10B981' : '#64748B' }}>
                            {currentVal || 'Blank (Pen Fill)'}
                          </Text>
                        </View>
                      </View>

                      {/* Quick Chips + Custom Input */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <TextInput
                          value={routineValues[item.key] ?? ''}
                          onChangeText={(t) => handleUpdateRoutineItem(item.key, t)}
                          placeholder={item.placeholder}
                          placeholderTextColor="#94A3B8"
                          style={{
                            flex: 1,
                            backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 7,
                            fontSize: 12,
                            fontWeight: '700',
                            color: isDark ? '#FFFFFF' : '#0F172A',
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => handleUpdateRoutineItem(item.key, 'OK ✓')}
                          style={{
                            backgroundColor: currentVal === 'OK ✓' ? '#10B981' : (isDark ? '#1C2538' : '#F1F5F9'),
                            paddingHorizontal: 10,
                            paddingVertical: 7,
                            borderRadius: 10,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: '800',
                              color: currentVal === 'OK ✓' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B'),
                            }}
                          >
                            OK ✓
                          </Text>
                        </TouchableOpacity>

                        {item.defaultVal !== 'OK ✓' && (
                          <TouchableOpacity
                            onPress={() => handleUpdateRoutineItem(item.key, item.defaultVal)}
                            style={{
                              backgroundColor:
                                currentVal === item.defaultVal
                                  ? '#153580'
                                  : isDark
                                  ? '#1C2538'
                                  : '#F1F5F9',
                              paddingHorizontal: 8,
                              paddingVertical: 7,
                              borderRadius: 10,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: '800',
                                color:
                                  currentVal === item.defaultVal
                                    ? '#FFFFFF'
                                    : isDark
                                    ? '#94A3B8'
                                    : '#64748B',
                              }}
                            >
                              {item.defaultVal}
                            </Text>
                          </TouchableOpacity>
                        )}

                        {isChecked && (
                          <TouchableOpacity
                            onPress={() => handleUpdateRoutineItem(item.key, '')}
                            style={{
                              backgroundColor: isDark ? '#2D1F2D' : '#FEE2E2',
                              paddingHorizontal: 8,
                              paddingVertical: 7,
                              borderRadius: 10,
                            }}
                          >
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#EF4444' }}>
                              ✕
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Workflow Action Buttons */}
          {job.status === 'COMPLETED' ? (
            job.pendingAmount > 0 ? (
              <View style={{ marginTop: 20, gap: 10 }}>
                {/* Completed badge with pending udhari note */}
                <View
                  style={{
                    backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                    padding: 14,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#F59E0B',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                      Workshop Work Completed
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: '#EF4444' }}>
                    Due: {formatCurrency(job.pendingAmount, currencySymbol)}
                  </Text>
                </View>

                {/* Collect Pending Udhari Button */}
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
                    shadowColor: '#153580',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 4,
                  }}
                >
                  <ArrowDown size={18} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                    Collect Pending Udhari ({formatCurrency(job.pendingAmount, currencySymbol)})
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
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
            )
          ) : (
            <View style={{ marginTop: 20, gap: 10 }}>
              {/* Payment & Settle Bill */}
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

              {/* Mark Work Completed without immediate payment */}
              <TouchableOpacity
                onPress={handleMarkWorkDone}
                activeOpacity={0.88}
                style={{
                  backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                  borderWidth: 1.5,
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#CBD5E1',
                  paddingVertical: 14,
                  borderRadius: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <CheckCircle2 size={18} color="#10B981" />
                <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 14, fontWeight: '800' }}>
                  Mark Workshop Work as Completed
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Payment Collection Modal with Amount Modify, Split Payment & Bank Selection */}
      <Modal
        visible={isPaymentModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPaymentModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}
        >
          <View
            style={{
              backgroundColor: cardBg,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 20,
              paddingBottom: insets.bottom + 16,
              maxHeight: '88%',
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

            {/* Payment Type Switcher: Single Mode vs Split Payment */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: isDark ? '#141824' : '#E2E8F0',
                borderRadius: 14,
                padding: 4,
                gap: 4,
              }}
            >
              <TouchableOpacity
                onPress={() => setPaymentType('SINGLE')}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 10,
                  alignItems: 'center',
                  backgroundColor: paymentType === 'SINGLE' ? '#153580' : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '800',
                    color: paymentType === 'SINGLE' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B'),
                  }}
                >
                  Single Mode
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setPaymentType('SPLIT');
                  if (!splitCashStr && !splitUpiStr && !splitSwipeStr) {
                    setSplitCashStr(job.pendingAmount > 0 ? String(job.pendingAmount) : String(job.finalAmount));
                  }
                }}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 5,
                  backgroundColor: paymentType === 'SPLIT' ? '#153580' : 'transparent',
                }}
              >
                <Layers size={13} color={paymentType === 'SPLIT' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B')} />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '800',
                    color: paymentType === 'SPLIT' ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B'),
                  }}
                >
                  Split (Cash + UPI + Card)
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ gap: 14, paddingBottom: 60 }}
            >
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

              {paymentType === 'SINGLE' ? (
                <>
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
                </>
              ) : (
                /* Multi-Mode Split Payment UI (Cash + UPI + Swipe) */
                <View style={{ gap: 14 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#94A3B8' : '#64748B' }}>
                    Enter payment amounts received across modes:
                  </Text>

                  {/* 1. Cash Portion */}
                  <View style={{ backgroundColor: isDark ? '#1C2538' : '#F8FAFC', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: cardBorder }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <Banknote size={16} color="#10B981" />
                      <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                        Cash Received
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: isDark ? '#141824' : '#FFFFFF',
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        height: 44,
                        borderWidth: 1,
                        borderColor: cardBorder,
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '800', color: '#10B981', marginRight: 6 }}>₹</Text>
                      <TextInput
                        value={splitCashStr}
                        onChangeText={setSplitCashStr}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#94A3B8"
                        style={{ flex: 1, fontSize: 16, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}
                      />
                    </View>
                  </View>

                  {/* 2. UPI Portion */}
                  <View style={{ backgroundColor: isDark ? '#1C2538' : '#F8FAFC', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: cardBorder }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <QrCode size={16} color="#3B82F6" />
                      <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                        UPI / Online QR
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: isDark ? '#141824' : '#FFFFFF',
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        height: 44,
                        borderWidth: 1,
                        borderColor: cardBorder,
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '800', color: '#3B82F6', marginRight: 6 }}>₹</Text>
                      <TextInput
                        value={splitUpiStr}
                        onChangeText={setSplitUpiStr}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#94A3B8"
                        style={{ flex: 1, fontSize: 16, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}
                      />
                    </View>
                    {/* Bank selector for UPI */}
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 6, textTransform: 'uppercase' }}>
                      Deposit Bank:
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                      {activeAccounts.map((acc) => {
                        const isSelected = splitUpiBankId === acc.id;
                        return (
                          <TouchableOpacity
                            key={acc.id}
                            onPress={() => setSplitUpiBankId(acc.id)}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderRadius: 10,
                              backgroundColor: isSelected ? '#153580' : (isDark ? '#141824' : '#E2E8F0'),
                            }}
                          >
                            <Text style={{ fontSize: 11, fontWeight: '800', color: isSelected ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#475569') }}>
                              {acc.bankName}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>

                  {/* 3. Card Swipe / POS Portion */}
                  <View style={{ backgroundColor: isDark ? '#1C2538' : '#F8FAFC', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: cardBorder }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <CreditCard size={16} color="#8B5CF6" />
                      <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                        Card Swipe / POS
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: isDark ? '#141824' : '#FFFFFF',
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        height: 44,
                        borderWidth: 1,
                        borderColor: cardBorder,
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '800', color: '#8B5CF6', marginRight: 6 }}>₹</Text>
                      <TextInput
                        value={splitSwipeStr}
                        onChangeText={setSplitSwipeStr}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#94A3B8"
                        style={{ flex: 1, fontSize: 16, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}
                      />
                    </View>
                    {/* Bank selector for Swipe */}
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 6, textTransform: 'uppercase' }}>
                      POS Settlement Bank:
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                      {activeAccounts.map((acc) => {
                        const isSelected = splitSwipeBankId === acc.id;
                        return (
                          <TouchableOpacity
                            key={acc.id}
                            onPress={() => setSplitSwipeBankId(acc.id)}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderRadius: 10,
                              backgroundColor: isSelected ? '#153580' : (isDark ? '#141824' : '#E2E8F0'),
                            }}
                          >
                            <Text style={{ fontSize: 11, fontWeight: '800', color: isSelected ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#475569') }}>
                              {acc.bankName}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>

                  {/* Split Summary */}
                  {(() => {
                    const c = parseFloat(splitCashStr) || 0;
                    const u = parseFloat(splitUpiStr) || 0;
                    const s = parseFloat(splitSwipeStr) || 0;
                    const totalNow = c + u + s;
                    const rem = Math.max(0, job.pendingAmount - totalNow);
                    return (
                      <View
                        style={{
                          backgroundColor: rem > 0 ? (isDark ? '#450A0A' : '#FEF2F2') : (isDark ? '#064E3B' : '#F0FDF4'),
                          padding: 12,
                          borderRadius: 14,
                          gap: 4,
                        }}
                      >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 12, fontWeight: '700', color: rem > 0 ? '#EF4444' : '#10B981' }}>
                            Total Collecting Now:
                          </Text>
                          <Text style={{ fontSize: 14, fontWeight: '900', color: rem > 0 ? '#EF4444' : '#10B981' }}>
                            {formatCurrency(totalNow, currencySymbol)}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 12, fontWeight: '700', color: rem > 0 ? '#EF4444' : '#10B981' }}>
                            Remaining Customer Udhari:
                          </Text>
                          <Text style={{ fontSize: 14, fontWeight: '900', color: rem > 0 ? '#EF4444' : '#10B981' }}>
                            {formatCurrency(rem, currencySymbol)}
                          </Text>
                        </View>
                      </View>
                    );
                  })()}
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
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
