// ============================================================
// Cool Car Workshop — Modern Home Screen Dashboard
// Directly matching Screen 5 & Screen 6 in reference design
// Dark Navy Hero Card ("Today's Summary" / "Month Summary"),
// 2x2 Quick Actions Grid, Search & Recent Workshop Activity
// ============================================================

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Banknote,
  Users,
  Car,
  Receipt,
  Search,
  X,
  FileText,
  AlertCircle,
  Package,
  Wallet,
  ArrowRight,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { useExpenseStore } from '../../src/store/expenseStore';
import { useChalanStore } from '../../src/store/chalanStore';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { formatCurrency } from '../../src/utils/currency';
import { DynamicCarIllustration } from '../../src/components/common/CarIllustrations';
import { useHideOnScroll } from '../../src/store/tabBarStore';

export default function DashboardScreen() {
  const { isDark, toggleMode } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { onScroll: onHideNavScroll } = useHideOnScroll();

  // Stores
  const { employees } = useEmployeeStore();
  const { expenses, setExpenses } = useExpenseStore();
  const { chalans } = useChalanStore();
  const { jobSheets: storeJobSheets, setJobSheets } = useJobSheetStore();

  const [summaryPeriod, setSummaryPeriod] = useState<'today' | 'month'>('today');
  const [activeTab, setActiveTab] = useState<'jobs' | 'expenses' | 'chalans'>('jobs');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Live Firestore Sync for Dashboard
  useEffect(() => {
    let unsubJobs: (() => void) | undefined;
    let unsubExp: (() => void) | undefined;

    const syncDashboard = async () => {
      try {
        const entId = enterpriseId || 'enterprise-cool-car';
        const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');

        // Sync Job Sheets
        const jobsRef = collection(db, 'enterprises', entId, 'jobSheets');
        unsubJobs = onSnapshot(
          query(jobsRef, orderBy('createdAt', 'desc')),
          (snap) => {
            const list: any[] = [];
            snap.forEach((doc) => {
              list.push({ id: doc.id, ...(doc.data() as any) });
            });
            setJobSheets(list);
          },
          (err) => {
            console.log('[Dashboard] Jobs onSnapshot error:', err.message);
          }
        );

        // Sync Expenses
        const expRef = collection(db, 'enterprises', entId, 'expenses');
        unsubExp = onSnapshot(
          query(expRef, orderBy('createdAt', 'desc')),
          (snap) => {
            const list: any[] = [];
            snap.forEach((doc) => {
              list.push({ id: doc.id, ...(doc.data() as any) });
            });
            setExpenses(list);
          },
          (err) => {
            console.log('[Dashboard] Expenses onSnapshot error:', err.message);
          }
        );
      } catch (err) {
        console.log('[Dashboard] Firestore listener error:', err);
      }
    };

    syncDashboard();
    return () => {
      unsubJobs?.();
      unsubExp?.();
    };
  }, [enterpriseId]);

  const allJobSheets = useMemo(() => {
    if (storeJobSheets && storeJobSheets.length > 0) {
      return storeJobSheets.map((s) => ({
        id: s.id,
        jobNumber: s.jobNumber,
        customerName: s.customerName || 'Walk-in Customer',
        vehicleModel: s.vehicleModel || 'Car',
        vehicleRegNumber: s.vehicleNumber || 'Vehicle',
        workCategory: s.workCategory,
        amount: s.finalAmount || 0,
        paidAmount: s.totalPaid || 0,
        pendingAmount: s.pendingAmount || 0,
        serviceDesc: s.notes || 'Workshop Service Order',
        date: typeof s.date === 'string' ? s.date : 'Today',
        time: s.time || '10:00 AM',
      }));
    }
    return [];
  }, [storeJobSheets]);

  // Derived Metrics
  const totalCustomerPendingDue = useMemo(
    () => allJobSheets.reduce((sum, j) => sum + (j.pendingAmount !== undefined ? j.pendingAmount : Math.max(0, j.amount - j.paidAmount)), 0),
    [allJobSheets]
  );

  const todayExpensesTotal = useMemo(
    () => expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0),
    [expenses]
  );

  const todayCollections = useMemo(
    () => allJobSheets.reduce((sum, j) => sum + (Number(j.paidAmount) || 0), 0),
    [allJobSheets]
  );

  const todayNetProfit = todayCollections - todayExpensesTotal;

  // Month Aggregates
  const monthRevenue = todayCollections;
  const monthExpenses = todayExpensesTotal;
  const monthNetProfit = monthRevenue - monthExpenses;

  // Filtered Job Sheets by Vehicle Registration Number / Name / Model
  const filteredJobSheets = useMemo(() => {
    if (!searchQuery.trim()) return allJobSheets;
    const q = searchQuery.toLowerCase().trim();
    return allJobSheets.filter((j) => {
      const regMatch = j.vehicleRegNumber.toLowerCase().includes(q);
      const nameMatch = j.customerName.toLowerCase().includes(q);
      const modelMatch = j.vehicleModel.toLowerCase().includes(q);
      const jobNumMatch = j.jobNumber.toLowerCase().includes(q);
      return regMatch || nameMatch || modelMatch || jobNumMatch;
    });
  }, [allJobSheets, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  // Color Palette
  const canvasBg = isDark ? '#080C14' : '#F8FAFC';
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={cardBg}
      />

      {/* TOP HEADER — Matching Reference Mockup Screen 5 (Menu, Dashboard, Bell) */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 18,
          paddingBottom: 14,
          backgroundColor: cardBg,
          borderBottomWidth: 1,
          borderBottomColor: cardBorder,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/more')}
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
          }}
        >
          <Menu size={22} color={textPrimary} strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={{ fontSize: 20, fontWeight: '800', color: textPrimary, letterSpacing: -0.4 }}>
          Dashboard
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            onPress={toggleMode}
            activeOpacity={0.7}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
            }}
          >
            {isDark ? <Sun size={19} color="#FBBF24" /> : <Moon size={19} color="#0C1829" />}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/reminders')}
            activeOpacity={0.7}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
              position: 'relative',
            }}
          >
            <Bell size={20} color={textPrimary} strokeWidth={2.2} />
            {totalCustomerPendingDue > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 9,
                  right: 9,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#EF4444',
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* SCROLLABLE BODY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onHideNavScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0C1829" />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
      >
        {/* TOP HERO CARD — Midnight Navy Card matching Screen 5 & 6 */}
        <View style={{ paddingHorizontal: 18, paddingTop: 16 }}>
          <View
            style={{
              backgroundColor: '#0C1829',
              borderRadius: 20,
              padding: 20,
              shadowColor: '#0C1829',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Header: "Today's Summary" / "This Month" with Pill Switcher */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>
                {summaryPeriod === 'today' ? "Today's Summary" : 'This Month Summary'}
              </Text>

              {/* Segmented Period Switcher */}
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: 12,
                  padding: 3,
                }}
              >
                <TouchableOpacity
                  onPress={() => setSummaryPeriod('today')}
                  activeOpacity={0.8}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 9,
                    backgroundColor: summaryPeriod === 'today' ? '#FFFFFF' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '800',
                      color: summaryPeriod === 'today' ? '#0C1829' : 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Today
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSummaryPeriod('month')}
                  activeOpacity={0.8}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 9,
                    backgroundColor: summaryPeriod === 'month' ? '#FFFFFF' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '800',
                      color: summaryPeriod === 'month' ? '#0C1829' : 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Month
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Big Font Main Amount */}
            <View style={{ marginTop: 14, marginBottom: 16 }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 32,
                  fontWeight: '900',
                  letterSpacing: -0.8,
                }}
              >
                {summaryPeriod === 'today'
                  ? formatCurrency(todayCollections, currencySymbol)
                  : formatCurrency(monthRevenue, currencySymbol)}
              </Text>
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 12,
                  fontWeight: '600',
                  marginTop: 2,
                }}
              >
                Total Income
              </Text>
            </View>

            {/* Two Column Bottom Stats Row: Expenses & Net Profit */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 14,
                borderTopWidth: 1,
                borderTopColor: 'rgba(255, 255, 255, 0.12)',
              }}
            >
              <View>
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
                  {summaryPeriod === 'today'
                    ? formatCurrency(todayExpensesTotal, currencySymbol)
                    : formatCurrency(monthExpenses, currencySymbol)}
                </Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                  Expenses
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
                  {summaryPeriod === 'today'
                    ? formatCurrency(todayNetProfit, currencySymbol)
                    : formatCurrency(monthNetProfit, currencySymbol)}
                </Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                  Net Profit
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS SECTION — 2x2 Grid directly matching Screen 5 in Reference Photo */}
        <View style={{ paddingHorizontal: 18, marginTop: 24 }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: textPrimary, marginBottom: 12 }}>
            Quick Actions
          </Text>

          <View style={{ gap: 12 }}>
            {/* Row 1: Cash Entry & Customer */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Cash Entry */}
              <TouchableOpacity
                onPress={() => router.push('/job-sheets/create')}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  backgroundColor: cardBg,
                  borderRadius: 18,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  alignItems: 'center',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.2 : 0.04,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: '#ECFDF5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Banknote size={24} color="#10B981" strokeWidth={2.2} />
                </View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: textPrimary }}>
                  Cash Entry
                </Text>
              </TouchableOpacity>

              {/* Customer */}
              <TouchableOpacity
                onPress={() => router.push('/customers')}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  backgroundColor: cardBg,
                  borderRadius: 18,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  alignItems: 'center',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.2 : 0.04,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: '#EFF6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Users size={24} color="#3B82F6" strokeWidth={2.2} />
                </View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: textPrimary }}>
                  Customer
                </Text>
              </TouchableOpacity>
            </View>

            {/* Row 2: Vehicle & Daily Expense */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Vehicle */}
              <TouchableOpacity
                onPress={() => router.push('/vehicles')}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  backgroundColor: cardBg,
                  borderRadius: 18,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  alignItems: 'center',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.2 : 0.04,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: '#FFF7ED',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Car size={24} color="#F97316" strokeWidth={2.2} />
                </View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: textPrimary }}>
                  Vehicle
                </Text>
              </TouchableOpacity>

              {/* Daily Expense */}
              <TouchableOpacity
                onPress={() => router.push('/expenses/add')}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  backgroundColor: cardBg,
                  borderRadius: 18,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  alignItems: 'center',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.2 : 0.04,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: '#FEF2F2',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Receipt size={24} color="#EF4444" strokeWidth={2.2} />
                </View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: textPrimary }}>
                  Daily Expense
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* WORKSHOP SHORTCUT PILLS (Pending Udhari, Purchase Chalans, Staff Salary) */}
        <View style={{ paddingHorizontal: 18, marginTop: 18 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {/* Pending Udhari Pill */}
            {totalCustomerPendingDue > 0 && (
              <TouchableOpacity
                onPress={() => router.push('/payments/pending')}
                activeOpacity={0.85}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: isDark ? '#2D1515' : '#FEF2F2',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#FCA5A5',
                  gap: 6,
                }}
              >
                <AlertCircle size={14} color="#EF4444" strokeWidth={2.4} />
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#EF4444' }}>
                  Pending Udhari: {formatCurrency(totalCustomerPendingDue, currencySymbol)}
                </Text>
              </TouchableOpacity>
            )}

            {/* Inward Chalan Pill */}
            <TouchableOpacity
              onPress={() => router.push('/inventory/chalan-add')}
              activeOpacity={0.85}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: cardBg,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: cardBorder,
                gap: 6,
              }}
            >
              <Package size={14} color="#7C3AED" strokeWidth={2.2} />
              <Text style={{ fontSize: 11, fontWeight: '800', color: textPrimary }}>
                + Purchase Chalan
              </Text>
            </TouchableOpacity>

            {/* Pay Staff Pill */}
            <TouchableOpacity
              onPress={() => router.push('/staff/pay' as any)}
              activeOpacity={0.85}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: cardBg,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: cardBorder,
                gap: 6,
              }}
            >
              <Wallet size={14} color="#D97706" strokeWidth={2.2} />
              <Text style={{ fontSize: 11, fontWeight: '800', color: textPrimary }}>
                Pay Staff Salary
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* RECENT ACTIVITY SECTION */}
        <View style={{ paddingHorizontal: 18, marginTop: 22 }}>
          {/* Header & Tabs */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: textPrimary }}>
              Recent Activity
            </Text>

            {/* Filter Tabs */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: isDark ? '#1F2937' : '#E2E8F0',
                borderRadius: 12,
                padding: 3,
              }}
            >
              <TouchableOpacity
                onPress={() => setActiveTab('jobs')}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 9,
                  backgroundColor: activeTab === 'jobs' ? (isDark ? '#374151' : '#FFFFFF') : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '800',
                    color: activeTab === 'jobs' ? textPrimary : textMuted,
                  }}
                >
                  Jobs ({allJobSheets.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('expenses')}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 9,
                  backgroundColor: activeTab === 'expenses' ? (isDark ? '#374151' : '#FFFFFF') : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '800',
                    color: activeTab === 'expenses' ? textPrimary : textMuted,
                  }}
                >
                  Expenses ({expenses.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('chalans')}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 9,
                  backgroundColor: activeTab === 'chalans' ? (isDark ? '#374151' : '#FFFFFF') : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '800',
                    color: activeTab === 'chalans' ? textPrimary : textMuted,
                  }}
                >
                  Chalans ({chalans.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar for Quick Vehicle Lookup */}
          {activeTab === 'jobs' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: cardBg,
                borderRadius: 14,
                paddingHorizontal: 12,
                height: 42,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: cardBorder,
                gap: 8,
              }}
            >
              <Search size={16} color="#94A3B8" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search Vehicle No, Customer, Model..."
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                style={{ flex: 1, fontSize: 13, fontWeight: '700', color: textPrimary }}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          {/* TAB 1: JOB SHEETS */}
          {activeTab === 'jobs' && (
            <View style={{ gap: 10 }}>
              {filteredJobSheets.length === 0 ? (
                <View
                  style={{
                    padding: 32,
                    alignItems: 'center',
                    backgroundColor: cardBg,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <Car size={36} color="#94A3B8" />
                  <Text style={{ color: textMuted, fontSize: 14, fontWeight: '700', marginTop: 8 }}>
                    {searchQuery ? `No vehicles matching "${searchQuery}"` : 'No job sheets yet'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/job-sheets/create')}
                    style={{
                      marginTop: 12,
                      backgroundColor: '#0C1829',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                      + Create First Job Sheet
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                filteredJobSheets.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => router.push(`/job-sheets/${item.id}`)}
                    activeOpacity={0.85}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 14,
                      paddingHorizontal: 14,
                      borderRadius: 18,
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: cardBorder,
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.2 : 0.03,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      <DynamicCarIllustration modelName={item.vehicleModel} size={44} showBadge={false} />

                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={{ fontSize: 14, fontWeight: '800', color: textPrimary }}>
                            {item.vehicleModel}
                          </Text>
                          <View
                            style={{
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                              borderRadius: 6,
                              backgroundColor: item.workCategory === 'AC' ? '#0284C7' : '#F59E0B',
                            }}
                          >
                            <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '900' }}>
                              {item.workCategory === 'AC' ? '❄️ AC' : item.workCategory === 'BOTH' ? '⚙️ BOTH' : '🔧 MECH'}
                            </Text>
                          </View>
                        </View>

                        <Text style={{ fontSize: 12, color: textMuted, fontWeight: '700', marginTop: 2 }}>
                          {item.vehicleRegNumber} • {item.customerName}
                        </Text>
                        <Text style={{ fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 1 }}>
                          {item.time || '10:00 AM'} • {item.date}
                        </Text>
                      </View>
                    </View>

                    <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                      <Text style={{ fontSize: 15, fontWeight: '900', color: textPrimary }}>
                        {formatCurrency(item.amount, currencySymbol)}
                      </Text>
                      <View
                        style={{
                          marginTop: 4,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 8,
                          backgroundColor: item.pendingAmount === 0 ? '#ECFDF5' : '#FEF3C7',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '800',
                            color: item.pendingAmount === 0 ? '#10B981' : '#D97706',
                          }}
                        >
                          {item.pendingAmount === 0 ? 'Paid' : `Pending`}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* TAB 2: EXPENSES */}
          {activeTab === 'expenses' && (
            <View style={{ gap: 10 }}>
              {expenses.length === 0 ? (
                <View
                  style={{
                    padding: 32,
                    alignItems: 'center',
                    backgroundColor: cardBg,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <Receipt size={36} color="#94A3B8" />
                  <Text style={{ color: textMuted, fontSize: 14, fontWeight: '700', marginTop: 8 }}>
                    No expenses logged today
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/expenses/add')}
                    style={{
                      marginTop: 12,
                      backgroundColor: '#0C1829',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                      + Record Expense
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                expenses.slice(0, 10).map((exp) => (
                  <View
                    key={exp.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 14,
                      paddingHorizontal: 14,
                      borderRadius: 18,
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: cardBorder,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          backgroundColor: '#FEF2F2',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Receipt size={20} color="#EF4444" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: textPrimary }}>
                          {exp.categoryName || exp.description}
                        </Text>
                        <Text style={{ fontSize: 11, color: textMuted, fontWeight: '600', marginTop: 2 }}>
                          {exp.spentBy ? `Spent by: ${exp.spentBy}` : 'Workshop Outflow'}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#EF4444' }}>
                      -{formatCurrency(exp.amount, currencySymbol)}
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}

          {/* TAB 3: CHALANS */}
          {activeTab === 'chalans' && (
            <View style={{ gap: 10 }}>
              {chalans.length === 0 ? (
                <View
                  style={{
                    padding: 32,
                    alignItems: 'center',
                    backgroundColor: cardBg,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <Package size={36} color="#94A3B8" />
                  <Text style={{ color: textMuted, fontSize: 14, fontWeight: '700', marginTop: 8 }}>
                    No purchase chalans yet
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/inventory/chalan-add')}
                    style={{
                      marginTop: 12,
                      backgroundColor: '#0C1829',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                      + Add Inward Chalan
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                chalans.map((chalan) => (
                  <TouchableOpacity
                    key={chalan.id}
                    onPress={() => router.push('/inventory')}
                    activeOpacity={0.85}
                    style={{
                      paddingVertical: 14,
                      paddingHorizontal: 14,
                      borderRadius: 18,
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: cardBorder,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 14, fontWeight: '900', color: textPrimary }}>
                        {chalan.chalanNumber} • {chalan.vendorName}
                      </Text>
                      <Text style={{ fontSize: 15, fontWeight: '900', color: textPrimary }}>
                        {formatCurrency(chalan.totalAmount, currencySymbol)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#3B82F6', fontWeight: '700' }}>
                        {chalan.items.length} parts tagged
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: chalan.pendingAmount === 0 ? '#10B981' : '#EF4444',
                          fontWeight: '800',
                        }}
                      >
                        {chalan.pendingAmount === 0 ? '✓ Paid' : `Due: ₹${chalan.pendingAmount}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
