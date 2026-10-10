// ============================================================
// Entries Tab — Daily Ledger & Operational Tracking
// 3 Dedicated Sections: Job Sheets, Daily Expenses, Purchase Chalans
// Comprehensive Date Filtering: Today, This Month, This Year, Custom Range
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calendar,
  FileText,
  Plus,
  Receipt,
  Car,
  TrendingDown,
  TrendingUp,
  Trash2,
  Package,
  ArrowRight,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { router } from 'expo-router';
import { useExpenseStore } from '../../src/store/expenseStore';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { useChalanStore } from '../../src/store/chalanStore';
import { useHideOnScroll } from '../../src/store/tabBarStore';
import { CalendarPickerModal } from '../../src/components/common/CalendarPickerModal';

interface JobSheetEntry {
  id: string;
  jobNumber: string;
  vehicleModel: string;
  customerName: string;
  amount: number;
  paidAmount: number;
  pendingAmount: number;
  status: 'Paid' | 'Pending' | 'Partially Paid';
  date: string;
}

export default function EntriesScreen() {
  const { theme, isDark } = useTheme();
  const { enterprise, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { onScroll: onHideNavScroll } = useHideOnScroll();

  const [activeTab, setActiveTab] = useState<'jobSheets' | 'expenses' | 'chalans'>('jobSheets');

  // Dates state
  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);
  const firstOfMonthIso = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  }, []);
  const firstOfYearIso = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-01-01`;
  }, []);

  const [rangeMode, setRangeMode] = useState<'TODAY' | 'MONTH' | 'YEAR' | 'CUSTOM'>('TODAY');
  const [fromDate, setFromDate] = useState(todayIso);
  const [toDate, setToDate] = useState(todayIso);
  const [calendarTarget, setCalendarTarget] = useState<'FROM' | 'TO' | null>(null);

  const setDateFilter = (mode: 'TODAY' | 'MONTH' | 'YEAR') => {
    setRangeMode(mode);
    setToDate(todayIso);
    if (mode === 'TODAY') {
      setFromDate(todayIso);
    } else if (mode === 'MONTH') {
      setFromDate(firstOfMonthIso);
    } else if (mode === 'YEAR') {
      setFromDate(firstOfYearIso);
    }
  };

  // Live entries state
  const [jobs, setJobs] = useState<JobSheetEntry[]>([]);
  const realExpenses = useExpenseStore((s) => s.expenses);
  const { deleteExpense, setExpenses } = useExpenseStore();
  const { deleteJobSheet } = useJobSheetStore();
  const { chalans, setChalans, deleteChalan } = useChalanStore();

  const handleDeleteJobEntry = (id: string, jobNum: string) => {
    Alert.alert(
      'Delete Job Sheet',
      `Are you sure you want to delete Job Sheet ${jobNum}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            deleteJobSheet(id);
            try {
              const entId = enterprise?.id || 'enterprise-cool-car';
              const { doc, deleteDoc } = await import('firebase/firestore');
              const { db } = await import('../../src/services/firebase/firebase.config');
              await deleteDoc(doc(db, 'enterprises', entId, 'jobSheets', id));
            } catch (err) {
              console.log('[DeleteJob] Firestore notice:', err);
            }
          },
        },
      ]
    );
  };

  const handleDeleteExpenseEntry = (id: string, name: string) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete expense "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            deleteExpense(id);
            try {
              const entId = enterprise?.id || 'enterprise-cool-car';
              const { doc, deleteDoc } = await import('firebase/firestore');
              const { db } = await import('../../src/services/firebase/firebase.config');
              await deleteDoc(doc(db, 'enterprises', entId, 'expenses', id));
            } catch (err) {
              console.log('[DeleteExpense] Firestore notice:', err);
            }
          },
        },
      ]
    );
  };

  const handleDeleteChalanEntry = (id: string, chalanNum: string) => {
    Alert.alert(
      'Delete Purchase Chalan',
      `Are you sure you want to delete Chalan ${chalanNum}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            deleteChalan(id);
            try {
              const entId = enterprise?.id || 'enterprise-cool-car';
              const { doc, deleteDoc } = await import('firebase/firestore');
              const { db } = await import('../../src/services/firebase/firebase.config');
              await deleteDoc(doc(db, 'enterprises', entId, 'chalans', id));
            } catch (err) {
              console.log('[DeleteChalan] Firestore notice:', err);
            }
          },
        },
      ]
    );
  };

  // Live Firestore Sync for Jobs, Expenses, and Chalans
  useEffect(() => {
    let unsubscribeJobs: (() => void) | undefined;
    let unsubscribeExpenses: (() => void) | undefined;
    let unsubscribeChalans: (() => void) | undefined;

    const syncEntries = async () => {
      try {
        const entId = enterprise?.id || 'enterprise-cool-car';
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');

        // 1. Jobs
        const jobsRef = collection(db, 'enterprises', entId, 'jobSheets');
        unsubscribeJobs = onSnapshot(jobsRef, (snap) => {
          if (!snap.empty) {
            const list: JobSheetEntry[] = snap.docs.map((d) => {
              const data = d.data();
              const isPaid = Number(data.paidAmount) >= Number(data.finalAmount || data.estimatedAmount);
              const isPartial = Number(data.paidAmount) > 0 && !isPaid;
              const rawDate = data.date || data.createdAt || '';
              return {
                id: d.id,
                jobNumber: data.jobNumber || d.id,
                vehicleModel: data.vehicleMakeModel || data.vehicleRegNumber || 'Vehicle',
                customerName: data.customerName || 'Customer',
                amount: Number(data.finalAmount || data.estimatedAmount) || 0,
                paidAmount: Number(data.paidAmount) || 0,
                pendingAmount: Number(data.pendingAmount) || 0,
                status: isPaid ? 'Paid' : isPartial ? 'Partially Paid' : 'Pending',
                date: typeof rawDate === 'string' ? rawDate.split('T')[0] : '',
              };
            });
            setJobs(list);
          } else {
            setJobs([]);
          }
        });

        // 2. Expenses
        const expRef = collection(db, 'enterprises', entId, 'expenses');
        unsubscribeExpenses = onSnapshot(expRef, (snap) => {
          const list = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as any[];
          setExpenses(list);
        });

        // 3. Purchase Chalans
        const chalanRef = collection(db, 'enterprises', entId, 'chalans');
        unsubscribeChalans = onSnapshot(chalanRef, (snap) => {
          const list = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as any[];
          list.sort((a, b) => {
            const timeA = new Date(a.createdAt || a.date || 0).getTime();
            const timeB = new Date(b.createdAt || b.date || 0).getTime();
            return timeB - timeA;
          });
          setChalans(list);
        });
      } catch (err) {
        console.log('[Entries] Firestore sync error:', err);
      }
    };

    syncEntries();
    return () => {
      if (unsubscribeJobs) unsubscribeJobs();
      if (unsubscribeExpenses) unsubscribeExpenses();
      if (unsubscribeChalans) unsubscribeChalans();
    };
  }, [enterprise?.id]);

  // Operational Expenses ONLY (Tea, rent, electricity, tools)
  // Chalans strictly excluded from general expenses!
  const generalExpenses = useMemo(() => {
    return realExpenses.filter(
      (exp) =>
        !exp.id?.startsWith('exp_chalan') &&
        exp.categoryId !== 'cat_parts' &&
        !exp.categoryName?.toLowerCase().includes('spare parts purchase') &&
        !exp.categoryName?.toLowerCase().includes('chalan')
    );
  }, [realExpenses]);

  // Filter items by Date Range
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const d = j.date || '';
      return d >= fromDate && d <= toDate;
    });
  }, [jobs, fromDate, toDate]);

  const filteredExpenses = useMemo(() => {
    return generalExpenses.filter((e) => {
      const rawDate = e.date || e.createdAt || '';
      const d = (typeof rawDate === 'string' ? rawDate : new Date(rawDate).toISOString()).split('T')[0];
      return d >= fromDate && d <= toDate;
    });
  }, [generalExpenses, fromDate, toDate]);

  const filteredChalans = useMemo(() => {
    return chalans.filter((c) => {
      const rawDate = c.date || c.createdAt || '';
      const d = (typeof rawDate === 'string' ? rawDate : new Date(rawDate).toISOString()).split('T')[0];
      return d >= fromDate && d <= toDate;
    });
  }, [chalans, fromDate, toDate]);

  // Aggregated amounts for the active view & period
  const totalJobsAmount = filteredJobs.reduce((sum, j) => sum + j.amount, 0);
  const totalJobsPaid = filteredJobs.reduce((sum, j) => sum + j.paidAmount, 0);
  const totalExpensesAmount = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalChalansAmount = filteredChalans.reduce((sum, c) => sum + (Number(c.totalAmount) || 0), 0);
  const totalChalansPaid = filteredChalans.reduce((sum, c) => sum + (Number(c.amountPaid) || 0), 0);
  const totalChalansDue = filteredChalans.reduce((sum, c) => sum + (Number(c.pendingAmount) || 0), 0);

  const canvasBg = isDark ? '#181A20' : '#153580';
  const sheetBg = isDark ? '#181A20' : '#F4F6F9';
  const cardBg = isDark ? '#242834' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onHideNavScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
      >
        {/* Royal Blue Top Header */}
        <View
          style={{
            backgroundColor: canvasBg,
            paddingTop: insets.top + 8,
            paddingHorizontal: 20,
            paddingBottom: 22,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <View style={{ marginBottom: 14 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>
              Daily Ledger
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 13, fontWeight: '600', marginTop: 2 }}>
              Job Sheets, Daily Expenses & Purchase Chalans
            </Text>
          </View>

          {/* Quick Date Range Selector Pills */}
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
            {[
              { label: 'Today', mode: 'TODAY' as const },
              { label: 'This Month', mode: 'MONTH' as const },
              { label: 'This Year', mode: 'YEAR' as const },
            ].map((p) => {
              const isSelected = rangeMode === p.mode;
              return (
                <TouchableOpacity
                  key={p.mode}
                  onPress={() => setDateFilter(p.mode)}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 16,
                    backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.18)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? '#0C1829' : '#FFFFFF',
                      fontSize: 12,
                      fontWeight: '800',
                    }}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => {
                setRangeMode('CUSTOM');
                setCalendarTarget('FROM');
              }}
              style={{
                flex: 1.2,
                paddingVertical: 8,
                borderRadius: 16,
                backgroundColor: rangeMode === 'CUSTOM' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.18)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: rangeMode === 'CUSTOM' ? '#0C1829' : '#FFFFFF',
                  fontSize: 12,
                  fontWeight: '800',
                }}
              >
                Between...
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Date Range Indicator */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.22)',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setRangeMode('CUSTOM');
                setCalendarTarget('FROM');
              }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Calendar size={14} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                From: {fromDate}
              </Text>
            </TouchableOpacity>

            <ArrowRight size={14} color="rgba(255, 255, 255, 0.7)" />

            <TouchableOpacity
              onPress={() => {
                setRangeMode('CUSTOM');
                setCalendarTarget('TO');
              }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                To: {toDate}
              </Text>
              <Calendar size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Unified Lower Content */}
        <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
          {/* 3 Dedicated Segmented Tabs Switcher */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: isDark ? '#182030' : '#E2E8F0',
              borderRadius: 24,
              padding: 4,
              marginBottom: 18,
            }}
          >
            <TouchableOpacity
              onPress={() => setActiveTab('jobSheets')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: activeTab === 'jobSheets' ? (isDark ? '#FFFFFF' : '#153580') : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '800',
                  color: activeTab === 'jobSheets' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
                }}
              >
                Jobs ({filteredJobs.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('expenses')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: activeTab === 'expenses' ? (isDark ? '#FFFFFF' : '#153580') : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '800',
                  color: activeTab === 'expenses' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
                }}
              >
                Expenses ({filteredExpenses.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('chalans')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: activeTab === 'chalans' ? (isDark ? '#FFFFFF' : '#153580') : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '800',
                  color: activeTab === 'chalans' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
                }}
              >
                Chalans ({filteredChalans.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Period Total Metric Card */}
          <GlassCard
            variant={isDark ? 'navy' : 'sand'}
            padding={18}
            style={{
              borderRadius: 24,
              marginBottom: 18,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
                {activeTab === 'jobSheets'
                  ? 'Billed Revenue'
                  : activeTab === 'expenses'
                  ? 'General Operational Outflow'
                  : 'Inward Parts Purchases'}
              </Text>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 24, fontWeight: '900', marginTop: 4 }}>
                {formatCurrency(
                  activeTab === 'jobSheets'
                    ? totalJobsAmount
                    : activeTab === 'expenses'
                    ? totalExpensesAmount
                    : totalChalansAmount,
                  currencySymbol
                )}
              </Text>
              {activeTab === 'chalans' && (
                <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                  Paid: {formatCurrency(totalChalansPaid, currencySymbol)} • Due:{' '}
                  {formatCurrency(totalChalansDue, currencySymbol)}
                </Text>
              )}
              {activeTab === 'jobSheets' && (
                <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                  Collected: {formatCurrency(totalJobsPaid, currencySymbol)}
                </Text>
              )}
            </View>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor:
                  activeTab === 'jobSheets'
                    ? 'rgba(0, 200, 150, 0.15)'
                    : activeTab === 'expenses'
                    ? 'rgba(239, 68, 68, 0.15)'
                    : 'rgba(245, 158, 11, 0.15)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeTab === 'jobSheets' ? (
                <TrendingUp size={22} color="#00C896" />
              ) : activeTab === 'expenses' ? (
                <TrendingDown size={22} color="#EF4444" />
              ) : (
                <Package size={22} color="#F59E0B" />
              )}
            </View>
          </GlassCard>

          {/* Tab 1: Job Sheets List */}
          {activeTab === 'jobSheets' && (
            <View style={{ gap: 12 }}>
              {filteredJobs.length === 0 ? (
                <View style={{ padding: 28, alignItems: 'center' }}>
                  <Text style={{ color: '#64748B', fontSize: 14, fontWeight: '700' }}>
                    No Job Sheets for selected period
                  </Text>
                </View>
              ) : (
                filteredJobs.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => router.push(`/job-sheets/${item.id}`)}
                    activeOpacity={0.85}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderRadius: 22,
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: cardBorder,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.2 : 0.04,
                      shadowRadius: 8,
                      elevation: 2,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
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
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                          {item.vehicleModel}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                          {item.jobNumber} • {item.customerName}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>
                          {item.date}
                        </Text>
                      </View>
                    </View>

                    <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                        {formatCurrency(item.amount, currencySymbol)}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '800',
                            color:
                              item.status === 'Paid'
                                ? '#00C896'
                                : item.status === 'Partially Paid'
                                ? '#F59E0B'
                                : '#EF4444',
                          }}
                        >
                          {item.status}
                        </Text>
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            handleDeleteJobEntry(item.id, item.jobNumber);
                          }}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 4,
                          }}
                        >
                          <Trash2 size={13} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* Tab 2: Daily Expenses List (General Operational Outflow ONLY) */}
          {activeTab === 'expenses' && (
            <View style={{ gap: 12 }}>
              {filteredExpenses.length === 0 ? (
                <View style={{ padding: 28, alignItems: 'center' }}>
                  <Text style={{ color: '#64748B', fontSize: 14, fontWeight: '700' }}>
                    No General Expenses for selected period
                  </Text>
                </View>
              ) : (
                filteredExpenses.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderRadius: 22,
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: cardBorder,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.2 : 0.04,
                      shadowRadius: 8,
                      elevation: 2,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
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
                        <Receipt size={18} color="#FFFFFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                          {item.categoryName || item.description}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                          {item.spentBy ? `Taken by: ${item.spentBy}` : 'General Expense'}{' '}
                          {item.date ? `• ${String(item.date).split('T')[0]}` : ''}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            color: isDark ? '#60A5FA' : '#153580',
                            fontWeight: '700',
                            marginTop: 1,
                          }}
                        >
                          {item.paymentMode} {item.paymentAccountName ? `(${item.paymentAccountName})` : ''}
                        </Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      <Text style={{ fontSize: 16, fontWeight: '900', color: '#EF4444' }}>
                        -{formatCurrency(item.amount, currencySymbol)}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          handleDeleteExpenseEntry(item.id, item.categoryName || item.description || 'Expense')
                        }
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: isDark ? '#450A0A' : '#FEE2E2',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={14} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* Tab 3: Dedicated Purchase Chalans List (Inward Parts Purchases) */}
          {activeTab === 'chalans' && (
            <View style={{ gap: 12 }}>
              {/* Add Chalan CTA Button */}
              <TouchableOpacity
                onPress={() => router.push('/inventory/chalan-add')}
                activeOpacity={0.85}
                style={{
                  backgroundColor: isDark ? '#1C2538' : '#153580',
                  borderRadius: 20,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                  Record New Purchase Chalan
                </Text>
              </TouchableOpacity>

              {filteredChalans.length === 0 ? (
                <View style={{ padding: 28, alignItems: 'center' }}>
                  <Text style={{ color: '#64748B', fontSize: 14, fontWeight: '700' }}>
                    No Purchase Chalans for selected period
                  </Text>
                </View>
              ) : (
                filteredChalans.map((item) => {
                  const isFullyPaid = (item.pendingAmount || 0) <= 0;
                  const isUnpaid = (item.amountPaid || 0) <= 0;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => router.push('/inventory')}
                      activeOpacity={0.85}
                      style={{
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderRadius: 22,
                        backgroundColor: cardBg,
                        borderWidth: 1,
                        borderColor: cardBorder,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: isDark ? 0.2 : 0.04,
                        shadowRadius: 8,
                        elevation: 2,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
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
                            <Package size={18} color="#FFFFFF" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                              Chalan #{item.chalanNumber}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                              Vendor: {item.vendorName || 'Parts Supplier'}
                            </Text>
                            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>
                              {item.date} • {item.items?.length || 0} item(s)
                            </Text>
                          </View>
                        </View>

                        <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
                          <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                            {formatCurrency(item.totalAmount, currencySymbol)}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: '800',
                                color: isFullyPaid ? '#00C896' : isUnpaid ? '#EF4444' : '#F59E0B',
                              }}
                            >
                              {isFullyPaid
                                ? 'Fully Paid'
                                : isUnpaid
                                ? 'Unpaid Due'
                                : `Due: ${formatCurrency(item.pendingAmount || 0, currencySymbol)}`}
                            </Text>
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                handleDeleteChalanEntry(item.id, item.chalanNumber);
                              }}
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 4,
                              }}
                            >
                              <Trash2 size={13} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Calendar Picker Modal for Custom Date Range */}
      <CalendarPickerModal
        visible={calendarTarget !== null}
        selectedDate={calendarTarget === 'FROM' ? fromDate : toDate}
        title={calendarTarget === 'FROM' ? 'Select Start Date' : 'Select End Date'}
        onSelectDate={(dateStr) => {
          if (calendarTarget === 'FROM') {
            setFromDate(dateStr);
            if (dateStr > toDate) {
              setToDate(dateStr);
            }
          } else {
            setToDate(dateStr);
            if (dateStr < fromDate) {
              setFromDate(dateStr);
            }
          }
          setCalendarTarget(null);
        }}
        onClose={() => setCalendarTarget(null)}
      />
    </View>
  );
}
