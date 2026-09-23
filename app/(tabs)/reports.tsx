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
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { CalendarPickerModal } from '../../src/components/common/CalendarPickerModal';
import { formatCurrency } from '../../src/utils/currency';
import { useExpenseStore } from '../../src/store/expenseStore';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { useChalanStore } from '../../src/store/chalanStore';
import { router } from 'expo-router';

export default function ReportsScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();

  const { expenses } = useExpenseStore();
  const { jobSheets } = useJobSheetStore();
  const { chalans } = useChalanStore();

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

  // Aggregated Financials
  const totalBilled = filteredJobs.reduce((sum, j) => sum + (j.finalAmount || 0), 0);
  const totalCollected = filteredJobs.reduce((sum, j) => sum + (j.totalPaid || 0), 0);
  const totalPendingReceivables = filteredJobs.reduce((sum, j) => sum + (j.pendingAmount || 0), 0);

  const totalExpenseOutflow = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalChalanPaid = filteredChalans.reduce((sum, c) => sum + c.amountPaid, 0);
  const totalChalanPending = filteredChalans.reduce((sum, c) => sum + c.pendingAmount, 0);

  const totalOutflow = totalExpenseOutflow + totalChalanPaid;
  const netSurplus = totalCollected - totalOutflow;

  const canvasBg = isDark ? '#070A0F' : '#6B9FE8';
  const sheetBg = isDark ? '#111622' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      <StatusBar barStyle="light-content" />

      {/* Top Header */}
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 16 }}>
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
            onPress={() => router.push('/settings/export')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Download size={18} color="#FFFFFF" />
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
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
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#6B9FE8', textTransform: 'uppercase', marginBottom: 8 }}>
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
                <Calendar size={15} color="#6B9FE8" />
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
                <Calendar size={15} color="#6B9FE8" />
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
