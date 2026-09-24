// ============================================================
// Reports Screen — Cool Car Workshop
// Date-Wise Custom Range Filtering ("From Date -> To Date")
// Calculates Billed Revenue, Outflow & Net Profit between dates
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  Share2,
  FileSpreadsheet,
  ChevronRight,
  ArrowRight,
  Receipt,
  Car,
  CheckCircle2,
  Banknote,
  QrCode,
  CreditCard,
  Building2,
  Package,
  Wallet,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { CalendarPickerModal } from '../../src/components/common/CalendarPickerModal';
import { formatCurrency } from '../../src/utils/currency';
import { useExpenseStore } from '../../src/store/expenseStore';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { useChalanStore } from '../../src/store/chalanStore';
import { usePaymentStore } from '../../src/store/paymentStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { generateAndShareFinancialPdf } from '../../src/utils/pdfReport';
import { router } from 'expo-router';
import { useHideOnScroll } from '../../src/store/tabBarStore';
import { Alert, ActivityIndicator } from 'react-native';

export default function ReportsScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { onScroll: onHideNavScroll } = useHideOnScroll();


  const { expenses } = useExpenseStore();
  const { jobSheets } = useJobSheetStore();
  const { chalans } = useChalanStore();
  const { payments } = usePaymentStore();
  const { accounts } = useBankAccountStore();
  const [isExporting, setIsExporting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const firstOfMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;

  // Date Range state
  const [fromDate, setFromDate] = useState(firstOfMonthStr);
  const [toDate, setToDate] = useState(todayStr);
  const [rangeMode, setRangeMode] = useState<'MONTH' | 'TODAY' | 'WEEK' | 'CUSTOM'>('MONTH');

  // Calendar Modal states
  const [calendarTarget, setCalendarTarget] = useState<'FROM' | 'TO' | null>(null);

  // Set predefined ranges
  const setQuickRange = (mode: 'TODAY' | 'WEEK' | 'MONTH') => {
    setRangeMode(mode);
    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];
    setToDate(todayIso);

    if (mode === 'TODAY') {
      setFromDate(todayIso);
    } else if (mode === 'WEEK') {
      const past7 = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      setFromDate(past7);
    } else if (mode === 'MONTH') {
      setFromDate(firstOfMonthStr);
    }
  };

  // Filtered Data between FromDate and ToDate
  const filteredJobs = useMemo(() => {
    return jobSheets.filter((j) => {
      const rawDate = j.date ? (typeof j.date === 'string' ? j.date : new Date(j.date).toISOString()) : '';
      const d = rawDate.split('T')[0];
      return d >= fromDate && d <= toDate;
    });
  }, [jobSheets, fromDate, toDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const d = (e.date ? (typeof e.date === 'string' ? e.date : new Date(e.date).toISOString()) : '').split('T')[0];
      return d >= fromDate && d <= toDate;
    });
  }, [expenses, fromDate, toDate]);

  const filteredChalans = useMemo(() => {
    return chalans.filter((c) => {
      const d = (c.date || '').split('T')[0];
      return d >= fromDate && d <= toDate;
    });
  }, [chalans, fromDate, toDate]);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const d = (p.date ? (typeof p.date === 'string' ? p.date : new Date(p.date).toISOString()) : '').split('T')[0];
      return d >= fromDate && d <= toDate;
    });
  }, [payments, fromDate, toDate]);

  // Aggregated Financials
  const totalBilled = filteredJobs.reduce((sum, j) => sum + (j.finalAmount || 0), 0);
  const totalCollected = filteredJobs.reduce((sum, j) => sum + (j.totalPaid || 0), 0);
  const totalPendingReceivables = filteredJobs.reduce((sum, j) => sum + (j.pendingAmount || 0), 0);

  const totalExpenseOutflow = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalChalanPaid = filteredChalans.reduce((sum, c) => sum + c.amountPaid, 0);
  const totalChalanPending = filteredChalans.reduce((sum, c) => sum + c.pendingAmount, 0);

  const totalOutflow = totalExpenseOutflow + totalChalanPaid;
  const netSurplus = totalCollected - totalOutflow;

  // Granular Collections Breakdown
  const cashCollections = useMemo(() => {
    return filteredPayments.filter((p) => p.paymentMode === 'CASH').reduce((sum, p) => sum + p.amount, 0);
  }, [filteredPayments]);

  const upiCollections = useMemo(() => {
    return filteredPayments.filter((p) => p.paymentMode === 'UPI').reduce((sum, p) => sum + p.amount, 0);
  }, [filteredPayments]);

  const swipeCollections = useMemo(() => {
    return filteredPayments.filter((p) => p.paymentMode === 'CARD_SWIPE').reduce((sum, p) => sum + p.amount, 0);
  }, [filteredPayments]);

  const bankCollections = useMemo(() => {
    const map = new Map<string, { bankName: string; amount: number; mode: string }>();
    filteredPayments.forEach((p) => {
      if ((p.paymentMode === 'UPI' || p.paymentMode === 'CARD_SWIPE') && p.paymentAccountName) {
        const key = `${p.paymentAccountName}-${p.paymentMode}`;
        const existing = map.get(key) || { 
          bankName: p.paymentAccountName, 
          amount: 0, 
          mode: p.paymentMode === 'CARD_SWIPE' ? 'Swipe (POS)' : 'UPI QR' 
        };
        existing.amount += p.amount;
        map.set(key, existing);
      }
    });
    return Array.from(map.values());
  }, [filteredPayments]);

  const staffSalaryExpenses = useMemo(() => {
    return filteredExpenses
      .filter((e) => e.categoryId === 'cat-salary' || e.categoryId === 'cat-advance' || e.categoryName?.toLowerCase().includes('salary') || e.categoryName?.toLowerCase().includes('advance'))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const generalExpenses = useMemo(() => {
    return Math.max(0, totalExpenseOutflow - staffSalaryExpenses);
  }, [totalExpenseOutflow, staffSalaryExpenses]);

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      await generateAndShareFinancialPdf({
        fromDate,
        toDate,
        currencySymbol,
        totalBilled,
        totalCollected,
        totalPendingReceivables,
        totalExpenseOutflow,
        totalChalanPaid,
        totalChalanPending,
        netSurplus,
        cashCollections,
        upiCollections,
        swipeCollections,
        bankCollections,
        staffSalaryExpenses,
        partsPurchasesAmount: totalChalanPaid,
        generalExpenses,
        jobsCount: filteredJobs.length,
        chalansCount: filteredChalans.length,
      });
    } catch (err: any) {
      Alert.alert('Export Error', err?.message || 'Could not generate PDF report.');
    } finally {
      setIsExporting(false);
    }
  };

  const canvasBg = isDark ? '#181A20' : '#153580';
  const sheetBg = isDark ? '#181A20' : '#F4F6F9';
  const cardBg = isDark ? '#242834' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" />

      {/* Royal Blue Top Header */}
      <View style={{ backgroundColor: canvasBg, paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 16 }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View>
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>
              Financial Reports
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
              Date-Wise Revenue, Expenses & Net Profit
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleExportPdf}
            disabled={isExporting}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Download size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Range Pills */}
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity
            onPress={() => setQuickRange('TODAY')}
            style={{
              flex: 1,
              paddingVertical: 7,
              borderRadius: 14,
              backgroundColor: rangeMode === 'TODAY' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '800', color: rangeMode === 'TODAY' ? '#0C1829' : '#FFFFFF' }}>
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setQuickRange('WEEK')}
            style={{
              flex: 1,
              paddingVertical: 7,
              borderRadius: 14,
              backgroundColor: rangeMode === 'WEEK' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '800', color: rangeMode === 'WEEK' ? '#0C1829' : '#FFFFFF' }}>
              Past 7 Days
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setQuickRange('MONTH')}
            style={{
              flex: 1,
              paddingVertical: 7,
              borderRadius: 14,
              backgroundColor: rangeMode === 'MONTH' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '800', color: rangeMode === 'MONTH' ? '#0C1829' : '#FFFFFF' }}>
              This Month
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setRangeMode('CUSTOM')}
            style={{
              flex: 1,
              paddingVertical: 7,
              borderRadius: 14,
              backgroundColor: rangeMode === 'CUSTOM' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '800', color: rangeMode === 'CUSTOM' ? '#0C1829' : '#FFFFFF' }}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Crisp White Lower Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          paddingTop: 20,
          paddingHorizontal: 20,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={onHideNavScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 120 }}
        >

          {/* CUSTOM DATE-WISE BETWEEN PICKER ("From Date -> To Date") */}
          <View
            style={{
              backgroundColor: isDark ? '#141926' : '#F8FAFD',
              borderRadius: 22,
              padding: 14,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '800', color: isDark ? '#60A5FA' : '#153580', textTransform: 'uppercase', marginBottom: 8 }}>
              Between Dates Filter
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {/* From Date Button */}
              <TouchableOpacity
                onPress={() => {
                  setRangeMode('CUSTOM');
                  setCalendarTarget('FROM');
                }}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '700' }}>FROM DATE</Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829', marginTop: 1 }}>
                    {fromDate}
                  </Text>
                </View>
                <Calendar size={15} color={isDark ? '#60A5FA' : '#153580'} />
              </TouchableOpacity>

              <ArrowRight size={16} color="#64748B" />

              {/* To Date Button */}
              <TouchableOpacity
                onPress={() => {
                  setRangeMode('CUSTOM');
                  setCalendarTarget('TO');
                }}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? '#1C2538' : '#FFFFFF',
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '700' }}>TO DATE</Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829', marginTop: 1 }}>
                    {toDate}
                  </Text>
                </View>
                <Calendar size={15} color={isDark ? '#60A5FA' : '#153580'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* NET SURPLUS / PROFIT CARD */}
          <GlassCard
            variant={isDark ? 'navy' : 'sand'}
            padding={20}
            style={{
              borderRadius: 24,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }}>
                Net Workshop Balance Between Dates
              </Text>
              <View
                style={{
                  backgroundColor: netSurplus >= 0 ? 'rgba(0, 200, 150, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: netSurplus >= 0 ? '#00C896' : '#EF4444', fontSize: 11, fontWeight: '900' }}>
                  {netSurplus >= 0 ? 'PROFIT' : 'DEFICIT'}
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 32, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829', marginTop: 6 }}>
              {formatCurrency(netSurplus, currencySymbol)}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
              Total Collections minus Expenses & Parts purchases
            </Text>
          </GlassCard>

          {/* 4 Financial Metrics Grid */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            {/* Revenue Collected */}
            <View
              style={{
                flex: 1,
                backgroundColor: isDark ? '#141926' : '#F8FAFD',
                borderRadius: 20,
                padding: 14,
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            >
              <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '700' }}>Collected Revenue</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#00C896', marginTop: 4 }}>
                +{formatCurrency(totalCollected, currencySymbol)}
              </Text>
              <Text style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{filteredJobs.length} job sheets</Text>
            </View>

            {/* Total Outflow */}
            <View
              style={{
                flex: 1,
                backgroundColor: isDark ? '#141926' : '#F8FAFD',
                borderRadius: 20,
                padding: 14,
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            >
              <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '700' }}>Total Outflow</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#EF4444', marginTop: 4 }}>
                -{formatCurrency(totalOutflow, currencySymbol)}
              </Text>
              <Text style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>Expenses & Chalans</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            {/* Customer Pending Receivables */}
            <View
              style={{
                flex: 1,
                backgroundColor: isDark ? '#141926' : '#F8FAFD',
                borderRadius: 20,
                padding: 14,
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            >
              <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '700' }}>Pending From Customers</Text>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#F59E0B', marginTop: 4 }}>
                {formatCurrency(totalPendingReceivables, currencySymbol)}
              </Text>
              <Text style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>Due collections</Text>
            </View>

            {/* Vendor Payables */}
            <View
              style={{
                flex: 1,
                backgroundColor: isDark ? '#141926' : '#F8FAFD',
                borderRadius: 20,
                padding: 14,
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            >
              <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '700' }}>Due to Parts Vendors</Text>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#EF4444', marginTop: 4 }}>
                {formatCurrency(totalChalanPending, currencySymbol)}
              </Text>
              <Text style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{filteredChalans.length} chalans</Text>
            </View>
          </View>

          {/* Granular Inflow Breakdown by Channel & Bank Accounts */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 22,
              padding: 16,
              marginBottom: 14,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: 'rgba(0, 200, 150, 0.12)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Wallet size={16} color="#00C896" />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  Inflows by Channel & Bank
                </Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '900', color: '#00C896' }}>
                +{formatCurrency(totalCollected, currencySymbol)}
              </Text>
            </View>

            {/* Cash Counter */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Banknote size={16} color="#10B981" />
                <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  Cash Counter Collection
                </Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                {formatCurrency(cashCollections, currencySymbol)}
              </Text>
            </View>

            {/* UPI QR Inflows */}
            <View
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <QrCode size={16} color="#3B82F6" />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                    UPI QR Inflows
                  </Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  {formatCurrency(upiCollections, currencySymbol)}
                </Text>
              </View>

              {/* Sub-rows for each UPI bank account */}
              {bankCollections
                .filter((b) => b.mode === 'UPI QR')
                .map((b, idx) => (
                  <View
                    key={`upi-${b.bankName}-${idx}`}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 24,
                      paddingTop: 6,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>
                      ↳ {b.bankName}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#94A3B8' : '#475569' }}>
                      {formatCurrency(b.amount, currencySymbol)}
                    </Text>
                  </View>
                ))}
            </View>

            {/* Card Swipe / POS Inflows */}
            <View style={{ paddingVertical: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <CreditCard size={16} color="#8B5CF6" />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                    Card Swipe (POS Machine)
                  </Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  {formatCurrency(swipeCollections, currencySymbol)}
                </Text>
              </View>

              {/* Sub-rows for each Swipe bank account */}
              {bankCollections
                .filter((b) => b.mode === 'Swipe (POS)')
                .map((b, idx) => (
                  <View
                    key={`swipe-${b.bankName}-${idx}`}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 24,
                      paddingTop: 6,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>
                      ↳ {b.bankName}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#94A3B8' : '#475569' }}>
                      {formatCurrency(b.amount, currencySymbol)}
                    </Text>
                  </View>
                ))}
            </View>
          </View>

          {/* Granular Outflow Breakdown: Parts, Staff & General Expenses */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 22,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingDown size={16} color="#EF4444" />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  Outflows Breakdown
                </Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '900', color: '#EF4444' }}>
                -{formatCurrency(totalOutflow, currencySymbol)}
              </Text>
            </View>

            {/* Spare Parts Purchases */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Package size={16} color="#F59E0B" />
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                    Inward Parts Purchases
                  </Text>
                  <Text style={{ fontSize: 10, color: '#64748B', marginTop: 1 }}>From vendor chalans</Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                {formatCurrency(totalChalanPaid, currencySymbol)}
              </Text>
            </View>

            {/* Staff Salaries & Advances */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Building2 size={16} color="#6366F1" />
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                    Staff Salary & Advances
                  </Text>
                  <Text style={{ fontSize: 10, color: '#64748B', marginTop: 1 }}>Mechanic & helper payroll</Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                {formatCurrency(staffSalaryExpenses, currencySymbol)}
              </Text>
            </View>

            {/* General Workshop Expenses */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 10,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Receipt size={16} color="#64748B" />
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                    General Expenses
                  </Text>
                  <Text style={{ fontSize: 10, color: '#64748B', marginTop: 1 }}>Rent, tea, utilities, consumables</Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                {formatCurrency(generalExpenses, currencySymbol)}
              </Text>
            </View>
          </View>

          {/* Activity Breakdown in Date Range */}
          <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829', marginBottom: 12 }}>
            Transactions in Selected Period
          </Text>

          <View style={{ gap: 10 }}>
            {filteredJobs.slice(0, 5).map((job) => (
              <View
                key={job.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  borderRadius: 18,
                  backgroundColor: isDark ? '#141926' : '#F8FAFD',
                  borderWidth: 1,
                  borderColor: cardBorder,
                }}
              >
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                    {job.vehicleNumber} • {job.vehicleModel}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                    {job.date ? String(job.date).split('T')[0] : 'Today'} • {job.workCategory || 'AC'} Work
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 14, fontWeight: '900', color: '#00C896' }}>
                    +{formatCurrency(job.totalPaid || job.finalAmount || 0, currencySymbol)}
                  </Text>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: job.pendingAmount === 0 ? '#00C896' : '#EF4444' }}>
                    {job.pendingAmount === 0 ? 'Settled' : `Due: ₹${job.pendingAmount}`}
                  </Text>
                </View>
              </View>
            ))}

            {filteredExpenses.slice(0, 3).map((exp) => (
              <View
                key={exp.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  borderRadius: 18,
                  backgroundColor: isDark ? '#141926' : '#F8FAFD',
                  borderWidth: 1,
                  borderColor: cardBorder,
                }}
              >
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                    {exp.categoryName || exp.description}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                    Taken by: {exp.spentBy || 'Workshop'} {exp.time ? `• ${exp.time}` : ''}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '900', color: '#EF4444' }}>
                  -{formatCurrency(exp.amount, currencySymbol)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* CALENDAR PICKER MODAL */}
      <CalendarPickerModal
        visible={calendarTarget !== null}
        selectedDate={calendarTarget === 'FROM' ? fromDate : toDate}
        onSelectDate={(date) => {
          if (calendarTarget === 'FROM') {
            setFromDate(date);
          } else {
            setToDate(date);
          }
          setCalendarTarget(null);
        }}
        onClose={() => setCalendarTarget(null)}
        title={calendarTarget === 'FROM' ? 'Select Start Date' : 'Select End Date'}
      />
    </View>
  );
}
