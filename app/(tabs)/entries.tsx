// ============================================================
// Entries Tab — Sky Blue & Midnight Navy Luxury Aesthetic
// Directly matching media_1790189780212.png & media_1790189816628.png
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Receipt,
  Car,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { router } from 'expo-router';
import { useExpenseStore } from '../../src/store/expenseStore';
import { useHideOnScroll } from '../../src/store/tabBarStore';


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
}

const DEFAULT_JOBS: JobSheetEntry[] = [
  { id: '1', jobNumber: 'CCG-0001', vehicleModel: 'Honda City ZX', customerName: 'Rajesh Sharma', amount: 8500, status: 'Paid' },
  { id: '2', jobNumber: 'CCG-0002', vehicleModel: 'Hyundai Creta SX', customerName: 'Amit Patel', amount: 4200, status: 'Partially Paid' },
  { id: '3', jobNumber: 'CCG-0003', vehicleModel: 'Maruti Brezza ZDi', customerName: 'Priya Kapoor', amount: 14200, status: 'Paid' },
];

const DEFAULT_EXPENSES: ExpenseEntry[] = [
  { id: '1', category: 'Mobil 1 Fully Synthetic 4L', amount: 4500, iconName: 'Fuel' },
  { id: '2', category: 'Workshop Electricity Bill', amount: 3200, iconName: 'Zap' },
  { id: '3', category: 'Technician Lunch & Tea', amount: 450, iconName: 'Coffee' },
];

export default function EntriesScreen() {
  const { theme, isDark } = useTheme();
  const { enterprise, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { onScroll: onHideNavScroll } = useHideOnScroll();
  const [activeTab, setActiveTab] = useState<'jobSheets' | 'expenses'>('jobSheets');

  const [currentDate] = useState('Today');
  const [jobs, setJobs] = useState<JobSheetEntry[]>(DEFAULT_JOBS);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(DEFAULT_EXPENSES);
  const realExpenses = useExpenseStore((s) => s.expenses);

  // Live Firestore Sync
  useEffect(() => {
    let unsubscribeJobs: (() => void) | undefined;
    let unsubscribeExpenses: (() => void) | undefined;

    const syncEntries = async () => {
      try {
        const entId = enterprise?.id || 'enterprise-dev-001';
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');

        // Jobs
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

        // Expenses
        const expRef = collection(db, 'enterprises', entId, 'expenses');
        unsubscribeExpenses = onSnapshot(expRef, (snap) => {
          if (!snap.empty) {
            const list: ExpenseEntry[] = snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                category: data.category || 'General Expense',
                amount: Number(data.amount) || 0,
                iconName: 'Receipt',
              };
            });
            setExpenses(list);
          }
        });
      } catch (err) {
        console.log('[Entries] Firestore sync error:', err);
      }
    };

    syncEntries();
    return () => {
      if (unsubscribeJobs) unsubscribeJobs();
      if (unsubscribeExpenses) unsubscribeExpenses();
    };
  }, [enterprise?.id]);

  const totalJobsAmount = jobs.reduce((sum, j) => sum + j.amount, 0);
  const totalExpensesAmount = realExpenses.reduce((sum, e) => sum + e.amount, 0);

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
        <View style={{ backgroundColor: canvasBg, paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>
              Daily Ledger
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 13, fontWeight: '600', marginTop: 2 }}>
              Operational & Financial Tracking
            </Text>
          </View>

          {/* Date Selector Pill */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.22)',
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <TouchableOpacity style={{ padding: 4 }}>
              <ChevronLeft size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                {currentDate}
              </Text>
            </View>
            <TouchableOpacity style={{ padding: 4 }}>
              <ChevronRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Unified Lower Content (Seamless with zero cut-off lines) */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Segmented Switcher Capsule */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: isDark ? '#182030' : '#E2E8F0',
              borderRadius: 24,
              padding: 4,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setActiveTab('jobSheets')}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 20,
                backgroundColor: activeTab === 'jobSheets' ? (isDark ? '#FFFFFF' : '#153580') : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '800',
                  color: activeTab === 'jobSheets' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
                }}
              >
                Job Sheets ({jobs.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('expenses')}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 20,
                backgroundColor: activeTab === 'expenses' ? (isDark ? '#FFFFFF' : '#153580') : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '800',
                  color: activeTab === 'expenses' ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
                }}
              >
                Expenses ({realExpenses.length})
              </Text>
            </TouchableOpacity>
          </View>


          {/* Day Total Metric Card */}
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
              <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }}>
                {activeTab === 'jobSheets' ? 'Daily Billed Revenue' : 'Daily Outflow'}
              </Text>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 24, fontWeight: '900', marginTop: 4 }}>
                {formatCurrency(activeTab === 'jobSheets' ? totalJobsAmount : totalExpensesAmount, currencySymbol)}
              </Text>
            </View>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: activeTab === 'jobSheets' ? 'rgba(0, 200, 150, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeTab === 'jobSheets' ? (
                <TrendingUp size={22} color="#00C896" />
              ) : (
                <TrendingDown size={22} color="#EF4444" />
              )}
            </View>
          </GlassCard>

          {/* List Entries */}
          {activeTab === 'jobSheets' ? (
            <View style={{ gap: 12 }}>
              {jobs.map((item) => (
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
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                      {formatCurrency(item.amount, currencySymbol)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '800',
                        color: item.status === 'Paid' ? '#00C896' : item.status === 'Partially Paid' ? '#F59E0B' : '#EF4444',
                        marginTop: 4,
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {realExpenses.length === 0 ? (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Text style={{ color: '#64748B', fontSize: 14, fontWeight: '700' }}>No Expenses Logged Today</Text>
                </View>
              ) : (
                realExpenses.map((item) => (
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
                          {item.spentBy ? `Taken by: ${item.spentBy}` : 'General Expense'} {item.time ? `• ${item.time}` : ''}
                        </Text>
                        <Text style={{ fontSize: 10, color: isDark ? '#60A5FA' : '#153580', fontWeight: '700', marginTop: 1 }}>
                          {item.paymentMode} {item.paymentAccountName ? `(${item.paymentAccountName})` : ''}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: '#EF4444' }}>
                      -{formatCurrency(item.amount, currencySymbol)}
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
