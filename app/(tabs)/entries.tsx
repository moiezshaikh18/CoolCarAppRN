// ============================================================
// Entries Tab — Daily Job Sheet & Daily Expenses
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Home as HomeIcon,
  Zap,
  Coffee,
  MoreHorizontal,
  ArrowUpRight,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { router } from 'expo-router';

interface JobSheetEntry {
  id: string;
  jobNumber: string;
  vehicleModel: string;
  customerName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Partially Paid';
}

interface ExpenseEntry {
  id: string;
  category: string;
  amount: number;
  iconName: string;
  iconColor: string;
}

const DEFAULT_JOBS: JobSheetEntry[] = [
  { id: '1', jobNumber: 'CCG-0001', vehicleModel: 'Honda City', customerName: 'Rajesh Sharma', amount: 8500, status: 'Paid' },
  { id: '2', jobNumber: 'CCG-0002', vehicleModel: 'Hyundai Creta', customerName: 'Amit Patel', amount: 4200, status: 'Partially Paid' },
];

const DEFAULT_EXPENSES: ExpenseEntry[] = [
  { id: '1', category: 'Mobil 1 Engine Oil', amount: 4500, iconName: 'Home', iconColor: '#121214' },
  { id: '2', category: 'Electricity Bill', amount: 3200, iconName: 'Zap', iconColor: '#121214' },
  { id: '3', category: 'Staff Snacks & Tea', amount: 450, iconName: 'Coffee', iconColor: '#121214' },
];

export default function EntriesScreen() {
  const { theme, isDark } = useTheme();
  const { enterprise, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'jobSheets' | 'expenses'>('jobSheets');
  const [currentDate] = useState('Today');
  const [jobs, setJobs] = useState<JobSheetEntry[]>(DEFAULT_JOBS);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(DEFAULT_EXPENSES);

  // Live Firestore Sync for Job Sheets and Expenses
  useEffect(() => {
    let unsubscribeJobs: (() => void) | undefined;
    let unsubscribeExpenses: (() => void) | undefined;

    const syncEntries = async () => {
      try {
        const entId = enterprise?.id || 'enterprise-dev-001';
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');

        // Listen to jobs
        const jobsRef = collection(db, 'enterprises', entId, 'jobSheets');
        unsubscribeJobs = onSnapshot(jobsRef, (snap) => {
          if (!snap.empty) {
            const list: JobSheetEntry[] = snap.docs.map((d) => {
              const data = d.data();
              const isPaid = Number(data.paidAmount) >= Number(data.finalAmount || data.estimatedAmount);
              const isPartial = Number(data.paidAmount) > 0 && !isPaid;
              return {
                id: d.id,
                jobNumber: data.jobNumber || d.id,
                vehicleModel: data.vehicleMakeModel || data.vehicleRegNumber || 'Vehicle',
                customerName: data.customerName || 'Customer',
                amount: Number(data.finalAmount || data.estimatedAmount) || 0,
                status: isPaid ? 'Paid' : isPartial ? 'Partially Paid' : 'Pending',
              };
            });
            setJobs(list);
          }
        });

        // Listen to expenses
        const expRef = collection(db, 'enterprises', entId, 'expenses');
        unsubscribeExpenses = onSnapshot(expRef, (snap) => {
          if (!snap.empty) {
            const list: ExpenseEntry[] = snap.docs.map((d) => {
              const data = d.data();
              const cat = data.category || 'Expense';
              const isUtil = cat.toLowerCase().includes('electricity') || cat.toLowerCase().includes('utility');
              const isFood = cat.toLowerCase().includes('tea') || cat.toLowerCase().includes('refreshment');
              return {
                id: d.id,
                category: data.title || cat,
                amount: Number(data.amount) || 0,
                iconName: isUtil ? 'Zap' : isFood ? 'Coffee' : 'Home',
                iconColor: '#121214',
              };
            });
            setExpenses(list);
          }
        });
      } catch (err) {
        console.log('[Entries] Firestore sync:', err);
      }
    };

    syncEntries();
    return () => {
      unsubscribeJobs?.();
      unsubscribeExpenses?.();
    };
  }, [enterprise?.id]);

  const totalExpenseToday = expenses.reduce((s, e) => s + e.amount, 0);

  const getCategoryIcon = (iconName: string) => {
    const size = 18;
    const color = isDark ? '#FFFFFF' : '#121214';
    switch (iconName) {
      case 'Home': return <HomeIcon size={size} color={color} />;
      case 'Zap': return <Zap size={size} color={color} />;
      case 'Coffee': return <Coffee size={size} color={color} />;
      default: return <MoreHorizontal size={size} color={color} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Symmetrical Top Header */}
        <View
          style={{
            paddingTop: insets.top + 14,
            paddingHorizontal: 22,
            paddingBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Garage Ledger
            </Text>
            <Text style={{ color: theme.text, fontSize: 26, fontWeight: '800', marginTop: 2, letterSpacing: -0.5 }}>
              {activeTab === 'jobSheets' ? 'Daily Job Sheets' : 'Daily Expenses'}
            </Text>
          </View>

          {/* Symmetrical Circular Action Button */}
          <TouchableOpacity
            onPress={() => {
              if (activeTab === 'jobSheets') {
                router.push('/job-sheets/create' as any);
              } else {
                router.push('/expenses/add' as any);
              }
            }}
            activeOpacity={0.8}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: isDark ? '#FFFFFF' : '#121214',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <Plus size={22} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Symmetrical Capsule Tab Switcher */}
        <View style={{ paddingHorizontal: 22, marginBottom: 18 }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: isDark ? '#1C212B' : '#EFECE6',
              borderRadius: 30,
              padding: 4,
            }}
          >
            <TouchableOpacity
              onPress={() => setActiveTab('jobSheets')}
              activeOpacity={0.8}
              style={{
                flex: 1,
                paddingVertical: 12,
                alignItems: 'center',
                borderRadius: 26,
                backgroundColor: activeTab === 'jobSheets' ? (isDark ? '#FFFFFF' : '#121214') : 'transparent',
              }}
            >
              <Text
                style={{
                  color: activeTab === 'jobSheets' ? (isDark ? '#121214' : '#FFFFFF') : theme.textMuted,
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                Job Sheets ({jobs.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('expenses')}
              activeOpacity={0.8}
              style={{
                flex: 1,
                paddingVertical: 12,
                alignItems: 'center',
                borderRadius: 26,
                backgroundColor: activeTab === 'expenses' ? (isDark ? '#FFFFFF' : '#121214') : 'transparent',
              }}
            >
              <Text
                style={{
                  color: activeTab === 'expenses' ? (isDark ? '#121214' : '#FFFFFF') : theme.textMuted,
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                Expenses ({expenses.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Symmetrical Date Selector Bar */}
        <View style={{ paddingHorizontal: 22, marginBottom: 18 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isDark ? '#1C212B' : '#FFFFFF',
              borderRadius: 24,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            }}
          >
            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: isDark ? '#252B38' : '#F8F6F2',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronLeft size={18} color={theme.text} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Calendar size={15} color={theme.textMuted} />
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>
                {currentDate}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: isDark ? '#252B38' : '#F8F6F2',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronRight size={18} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'jobSheets' ? (
          /* ==================== DAILY JOB SHEETS ==================== */
          <View style={{ paddingHorizontal: 22, gap: 14 }}>
            {jobs.map((job) => {
              const isPaid = job.status === 'Paid';
              return (
                <GlassCard
                  key={job.id}
                  variant="sand"
                  padding={18}
                  style={{ borderRadius: 28 }}
                  onPress={() => router.push(`/job-sheets/${job.id}` as any)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                      }}
                    >
                      <FileText size={22} color={theme.text} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                          {job.jobNumber}
                        </Text>
                        <Text style={{ color: theme.text, fontSize: 17, fontWeight: '800' }}>
                          {formatCurrency(job.amount, currencySymbol)}
                        </Text>
                      </View>

                      <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2, fontWeight: '600' }}>
                        {job.vehicleModel}
                      </Text>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                          {job.customerName}
                        </Text>
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 12,
                            backgroundColor: isPaid ? (isDark ? '#064E3B' : '#DCFCE7') : (isDark ? '#78350F' : '#FEF3C7'),
                          }}
                        >
                          <Text
                            style={{
                              color: isPaid ? (isDark ? '#34D399' : '#15803D') : (isDark ? '#FBBF24' : '#B45309'),
                              fontSize: 11,
                              fontWeight: '700',
                            }}
                          >
                            {job.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </GlassCard>
              );
            })}
          </View>
        ) : (
          /* ==================== DAILY EXPENSES ==================== */
          <View style={{ paddingHorizontal: 22 }}>
            {/* Total Expenses Warm Sand Card */}
            <GlassCard
              variant="sand"
              padding={22}
              style={{
                marginBottom: 16,
                borderRadius: 28,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
                    Total Expenses
                  </Text>
                  <Text style={{ color: theme.text, fontSize: 30, fontWeight: '800', marginTop: 4, letterSpacing: -0.5 }}>
                    {formatCurrency(totalExpenseToday, currencySymbol)}
                  </Text>
                </View>

                {/* Minimalist Bar Indicator */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 44, gap: 5 }}>
                  <View style={{ width: 7, height: 18, backgroundColor: theme.text, borderRadius: 4, opacity: 0.25 }} />
                  <View style={{ width: 7, height: 30, backgroundColor: theme.text, borderRadius: 4, opacity: 0.5 }} />
                  <View style={{ width: 7, height: 20, backgroundColor: theme.text, borderRadius: 4, opacity: 0.35 }} />
                  <View style={{ width: 7, height: 42, backgroundColor: theme.text, borderRadius: 4, opacity: 0.9 }} />
                  <View style={{ width: 7, height: 26, backgroundColor: theme.text, borderRadius: 4, opacity: 0.6 }} />
                </View>
              </View>
            </GlassCard>

            {/* Expense Item List */}
            <View style={{ gap: 12 }}>
              {expenses.map((expense) => (
                <GlassCard
                  key={expense.id}
                  variant="sand"
                  padding={16}
                  style={{
                    borderRadius: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                      }}
                    >
                      {getCategoryIcon(expense.iconName)}
                    </View>
                    <View>
                      <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                        {expense.category}
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                        Daily Operations
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                    {formatCurrency(expense.amount, currencySymbol)}
                  </Text>
                </GlassCard>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
