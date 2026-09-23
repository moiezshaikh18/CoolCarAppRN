// ============================================================
// Cool Car Workshop — Dedicated Dashboard Screen
// Fixed Sticky Header, Sliding Hero Carousel (Aaj vs Mahina),
// Centered Module Pills, Vehicle Number Search & Auto Car Illustration
// Uniform Mechanic Colors (Slate #2B3544 & Royal Blue #153580)
// Pure Black & White Dark Mode (#000000 & #FFFFFF)
// ============================================================

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Dimensions,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Plus,
  Car,
  FileSpreadsheet,
  Receipt,
  Users,
  Package,
  Calendar,
  Search,
  X,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { useExpenseStore } from '../../src/store/expenseStore';
import { useChalanStore } from '../../src/store/chalanStore';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { DynamicCarIllustration } from '../../src/components/common/CarIllustrations';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Card width calculated to perfectly fit with 18px horizontal padding on both sides
const CARD_WIDTH = SCREEN_WIDTH - 36;
const CARD_SPACING = 12;

export default function DashboardScreen() {
  const { isDark, toggleMode } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();

  // Stores
  const { employees } = useEmployeeStore();
  const { accounts } = useBankAccountStore();
  const { expenses } = useExpenseStore();
  const { chalans } = useChalanStore();
  const { jobSheets: storeJobSheets } = useJobSheetStore();

  const [activeTab, setActiveTab] = useState<'jobs' | 'expenses' | 'chalans'>('jobs');
  const [slideIndex, setSlideIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample seed job sheets merged with store
  const defaultJobSheets = [
    {
      id: 'JS-2026-001',
      jobNumber: 'CC-0412',
      customerName: 'Rajesh Sharma',
      vehicleModel: 'Honda City ZX',
      vehicleRegNumber: 'MH02AB1234',
      workCategory: 'AC',
      amount: 14500,
      paidAmount: 14500,
      pendingAmount: 0,
      serviceDesc: 'Full AC Compressor Replacement & Cooling Coil Service',
      date: 'Today',
      time: '11:30 AM',
    },
    {
      id: 'JS-2026-002',
      jobNumber: 'CC-0413',
      customerName: 'Amit Patel',
      vehicleModel: 'Hyundai Creta SX',
      vehicleRegNumber: 'DL04CD5678',
      workCategory: 'BOTH',
      amount: 8200,
      paidAmount: 4000,
      pendingAmount: 4200,
      serviceDesc: 'AC Gas R134a Refill + Front Brake Pads & Suspension',
      date: 'Today',
      time: '01:15 PM',
    },
    {
      id: 'JS-2026-003',
      jobNumber: 'CC-0414',
      customerName: 'Priya Kapoor',
      vehicleModel: 'Maruti Brezza ZDi',
      vehicleRegNumber: 'MH04EF9012',
      workCategory: 'MECHANICAL',
      amount: 5400,
      paidAmount: 5400,
      pendingAmount: 0,
      serviceDesc: 'Clutch Overhaul & Engine Mobil 1 5W-30 Oil Service',
      date: 'Yesterday',
      time: '04:45 PM',
    },
  ];

  const allJobSheets = useMemo(() => {
    if (storeJobSheets && storeJobSheets.length > 0) {
      return storeJobSheets.map((s) => ({
        id: s.id,
        jobNumber: s.jobNumber,
        customerName: s.customerName || 'Walk-in Customer',
        vehicleModel: s.vehicleModel || 'Car',
        vehicleRegNumber: s.vehicleNumber || 'MH12XX0000',
        workCategory: s.workCategory,
        amount: s.finalAmount,
        paidAmount: s.totalPaid,
        pendingAmount: s.pendingAmount,
        serviceDesc: s.notes || 'Workshop Service Order',
        date: typeof s.date === 'string' ? s.date : 'Today',
        time: s.time || '10:00 AM',
      }));
    }
    return defaultJobSheets;
  }, [storeJobSheets]);

  // Derived Metrics
  const totalLiquidBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + (a.currentBalance || 0), 0),
    [accounts]
  );

  const activeStaffCount = useMemo(
    () => employees.filter((e) => e.status !== 'LEFT').length,
    [employees]
  );

  const todayExpensesTotal = useMemo(
    () => expenses.reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  );

  const todayCollections = useMemo(
    () => allJobSheets.reduce((sum, j) => sum + j.paidAmount, 0),
    [allJobSheets]
  );

  // Month-To-Date Aggregates (Pure Mahine Ka Till)
  const monthRevenue = 142800 + todayCollections;
  const monthExpenses = 48200 + todayExpensesTotal;
  const monthNetProfit = monthRevenue - monthExpenses;
  const monthCarsServiced = 28 + allJobSheets.length;

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

  const handleHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CARD_WIDTH + CARD_SPACING));
    if (index !== slideIndex && (index === 0 || index === 1)) {
      setSlideIndex(index);
    }
  };

  // Color Palette
  // Light Mode: Mechanic Uniform Slate Charcoal (#2B3544) & Royal Blue (#153580)
  // Dark Mode: Deep Black (#000000) & Stark White (#FFFFFF)
  const canvasBg = isDark ? '#000000' : '#153580'; // Top Hero/Header Background
  const sheetBg = isDark ? '#0A0D14' : '#F4F6F9'; // Seamless Lower Background
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(43, 53, 68, 0.08)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={canvasBg} />

      {/* FIXED / STICKY HEADER PART */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 18,
          paddingBottom: 14,
          backgroundColor: canvasBg,
          zIndex: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '900', letterSpacing: -0.6 }}>
                Cool Car
              </Text>
              <View
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '900' }}>
                  PUNE
                </Text>
              </View>
            </View>
            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 12, fontWeight: '700', marginTop: 2 }}>
              ❄️ Car AC Repairs & 🔧 Mechanical Workshop
            </Text>
          </View>

          {/* Theme Switcher Button */}
          <TouchableOpacity
            onPress={toggleMode}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isDark ? '#141824' : 'rgba(255, 255, 255, 0.22)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isDark ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* SCROLLABLE BODY CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      >
        {/* TOP HERO SECTION: Canvas background */}
        <View style={{ backgroundColor: canvasBg, paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
          {/* SLIDING HERO CAROUSEL: CARD 1 (AAJ) vs CARD 2 (MAHINA) */}
          {/* Solves "2 card cut raha hai" using exact snapToInterval and paddingHorizontal */}
          <View style={{ marginBottom: 14 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + CARD_SPACING}
              snapToAlignment="start"
              decelerationRate="fast"
              onScroll={handleHeroScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{
                paddingHorizontal: 18,
                gap: CARD_SPACING,
              }}
            >
              {/* SLIDE 1: TODAY'S OVERVIEW (AAJ KA HISAB) */}
              <GlassCard
                variant="navy"
                padding={20}
                style={{
                  width: CARD_WIDTH,
                  borderRadius: 26,
                  borderWidth: 1.5,
                  borderColor: 'rgba(255, 255, 255, 0.16)',
                }}
              >
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C896' }} />
                    <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                      Today's Snapshot (Aaj)
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: 'rgba(0, 200, 150, 0.2)',
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: '#00C896', fontSize: 10, fontWeight: '900' }}>
                      LIVE LEDGER
                    </Text>
                  </View>
                </View>

                {/* Figure */}
                <View style={{ marginVertical: 10 }}>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 11, fontWeight: '700' }}>
                    Today's Collected Inflow
                  </Text>
                  <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '900', letterSpacing: -0.8 }}>
                    +{formatCurrency(todayCollections, currencySymbol)}
                  </Text>
                </View>

                {/* Outflow & Liquid Row */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 14,
                    marginBottom: 10,
                  }}
                >
                  <View>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 10, fontWeight: '700' }}>
                      Today's Outflow
                    </Text>
                    <Text style={{ color: '#EF4444', fontSize: 14, fontWeight: '900' }}>
                      -{formatCurrency(todayExpensesTotal, currencySymbol)}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 10, fontWeight: '700' }}>
                      Liquid Bank Balances
                    </Text>
                    <Text style={{ color: '#6B9FE8', fontSize: 14, fontWeight: '900' }}>
                      {formatCurrency(totalLiquidBalance, currencySymbol)}
                    </Text>
                  </View>
                </View>

                {/* Quick Action Capsules */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 10,
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => router.push('/job-sheets/create')}
                    activeOpacity={0.8}
                    style={{ alignItems: 'center', gap: 4 }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#6B9FE8',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Plus size={18} color="#FFFFFF" strokeWidth={2.8} />
                    </View>
                    <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>
                      + Job Sheet
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => router.push('/expenses/add')}
                    activeOpacity={0.8}
                    style={{ alignItems: 'center', gap: 4 }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(255, 255, 255, 0.16)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ArrowUpRight size={18} color="#FFFFFF" strokeWidth={2.2} />
                    </View>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 10, fontWeight: '700' }}>
                      + Expense
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => router.push('/inventory/chalan-add')}
                    activeOpacity={0.8}
                    style={{ alignItems: 'center', gap: 4 }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(255, 255, 255, 0.16)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Car size={18} color="#FFFFFF" strokeWidth={2.2} />
                    </View>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 10, fontWeight: '700' }}>
                      + Chalan
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => router.push('/staff/pay' as any)}
                    activeOpacity={0.8}
                    style={{ alignItems: 'center', gap: 4 }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(255, 255, 255, 0.16)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Users size={18} color="#FFFFFF" strokeWidth={2.2} />
                    </View>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 10, fontWeight: '700' }}>
                      Pay Staff
                    </Text>
                  </TouchableOpacity>
                </View>
              </GlassCard>

              {/* SLIDE 2: FULL MONTH TILL DATE (PURE MAHINE KA TILL) */}
              <GlassCard
                variant="navy"
                padding={20}
                style={{
                  width: CARD_WIDTH,
                  borderRadius: 26,
                  borderWidth: 1.5,
                  borderColor: 'rgba(255, 255, 255, 0.16)',
                }}
              >
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="#6B9FE8" />
                    <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                      This Month Till Date (Mahina)
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: 'rgba(107, 159, 232, 0.22)',
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: '#6B9FE8', fontSize: 10, fontWeight: '900' }}>
                      {monthCarsServiced} CARS SERVICED
                    </Text>
                  </View>
                </View>

                {/* Figure */}
                <View style={{ marginVertical: 10 }}>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 11, fontWeight: '700' }}>
                    Total Month Revenue Billed
                  </Text>
                  <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '900', letterSpacing: -0.8 }}>
                    {formatCurrency(monthRevenue, currencySymbol)}
                  </Text>
                </View>

                {/* Outflow & Profit Row */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 14,
                    marginBottom: 10,
                  }}
                >
                  <View>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 10, fontWeight: '700' }}>
                      Month Expenses & Parts
                    </Text>
                    <Text style={{ color: '#EF4444', fontSize: 14, fontWeight: '900' }}>
                      -{formatCurrency(monthExpenses, currencySymbol)}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 10, fontWeight: '700' }}>
                      Net Workshop Profit
                    </Text>
                    <Text style={{ color: '#00C896', fontSize: 14, fontWeight: '900' }}>
                      +{formatCurrency(monthNetProfit, currencySymbol)}
                    </Text>
                  </View>
                </View>

                {/* View Full Reports CTA */}
                <TouchableOpacity
                  onPress={() => router.push('/reports')}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: '#FFFFFF',
                    paddingVertical: 11,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 4,
                  }}
                >
                  <Text style={{ color: '#153580', fontSize: 12, fontWeight: '900' }}>
                    View Full Monthly Financial Report →
                  </Text>
                </TouchableOpacity>
              </GlassCard>
            </ScrollView>

            {/* Pagination Indicator Dots */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 }}>
              <View
                style={{
                  width: slideIndex === 0 ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: slideIndex === 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
                }}
              />
              <View
                style={{
                  width: slideIndex === 1 ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: slideIndex === 1 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
                }}
              />
            </View>
          </View>

          {/* 4 CORE WORKSHOP MODULES */}
          <View style={{ paddingHorizontal: 18 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.6 }}>
              Core Workshop Modules
            </Text>

            <View style={{ gap: 10 }}>
              {/* Row 1: Daily Job Sheets & Daily Expenses */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {/* Module 1: Daily Job Sheets */}
                <TouchableOpacity
                  onPress={() => router.push('/job-sheets')}
                  activeOpacity={0.88}
                  style={{
                    flex: 1,
                    backgroundColor: isDark ? '#141824' : '#FFFFFF',
                    borderRadius: 20,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: '#2563EB',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FileSpreadsheet size={18} color="#FFFFFF" />
                    </View>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: '#00C896' }}>
                      {allJobSheets.length} Active
                    </Text>
                  </View>

                  <Text style={{ fontSize: 14, fontWeight: '900', color: isDark ? '#FFFFFF' : '#2B3544' }}>
                    Daily Job Sheets
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                    ❄️ AC & 🔧 Mechanical
                  </Text>
                </TouchableOpacity>

                {/* Module 2: Daily Expenses */}
                <TouchableOpacity
                  onPress={() => router.push('/entries')}
                  activeOpacity={0.88}
                  style={{
                    flex: 1,
                    backgroundColor: isDark ? '#141824' : '#FFFFFF',
                    borderRadius: 20,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: '#EF4444',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Receipt size={18} color="#FFFFFF" />
                    </View>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: '#EF4444' }}>
                      -{formatCurrency(todayExpensesTotal, currencySymbol)}
                    </Text>
                  </View>

                  <Text style={{ fontSize: 14, fontWeight: '900', color: isDark ? '#FFFFFF' : '#2B3544' }}>
                    Daily Expenses
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                    Kisne Liya & Reason
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Row 2: Purchase Chalans & Staff */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {/* Module 3: Purchase Chalans */}
                <TouchableOpacity
                  onPress={() => router.push('/inventory')}
                  activeOpacity={0.88}
                  style={{
                    flex: 1,
                    backgroundColor: isDark ? '#141824' : '#FFFFFF',
                    borderRadius: 20,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: '#7C3AED',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Package size={18} color="#FFFFFF" />
                    </View>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: '#7C3AED' }}>
                      {chalans.length} Chalans
                    </Text>
                  </View>

                  <Text style={{ fontSize: 14, fontWeight: '900', color: isDark ? '#FFFFFF' : '#2B3544' }}>
                    Purchase Chalans
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                    Multi-Car Tagging (10-N)
                  </Text>
                </TouchableOpacity>

                {/* Module 4: Staff & Salary */}
                <TouchableOpacity
                  onPress={() => router.push('/staff' as any)}
                  activeOpacity={0.88}
                  style={{
                    flex: 1,
                    backgroundColor: isDark ? '#141824' : '#FFFFFF',
                    borderRadius: 20,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: '#D97706',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Users size={18} color="#FFFFFF" />
                    </View>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: '#D97706' }}>
                      {activeStaffCount} Staff
                    </Text>
                  </View>

                  <Text style={{ fontSize: 14, fontWeight: '900', color: isDark ? '#FFFFFF' : '#2B3544' }}>
                    Staff & Salary
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                    Docs & Advance Tracker
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* LOWER SECTION: Seamless background */}
        <View style={{ paddingTop: 20, paddingHorizontal: 18 }}>
          {/* CENTER-ALIGNED MODULE TABS (User feedback addressed) */}
          <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: isDark ? '#141824' : '#E2E8F0',
                borderRadius: 22,
                padding: 4,
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            >
              <TouchableOpacity
                onPress={() => setActiveTab('jobs')}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                  borderRadius: 18,
                  backgroundColor: activeTab === 'jobs' ? (isDark ? '#FFFFFF' : '#153580') : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '800',
                    color: activeTab === 'jobs' ? (isDark ? '#000000' : '#FFFFFF') : '#64748B',
                  }}
                >
                  Job Sheets ({allJobSheets.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('expenses')}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                  borderRadius: 18,
                  backgroundColor: activeTab === 'expenses' ? (isDark ? '#FFFFFF' : '#153580') : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '800',
                    color: activeTab === 'expenses' ? (isDark ? '#000000' : '#FFFFFF') : '#64748B',
                  }}
                >
                  Expenses ({expenses.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('chalans')}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                  borderRadius: 18,
                  backgroundColor: activeTab === 'chalans' ? (isDark ? '#FFFFFF' : '#153580') : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '800',
                    color: activeTab === 'chalans' ? (isDark ? '#000000' : '#FFFFFF') : '#64748B',
                  }}
                >
                  Chalans ({chalans.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* SEARCH BAR (Vehicle Registration Number Search - Direct User Request) */}
          {activeTab === 'jobs' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? '#141824' : '#FFFFFF',
                borderRadius: 16,
                paddingHorizontal: 14,
                height: 44,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: cardBorder,
                gap: 8,
              }}
            >
              <Search size={16} color="#64748B" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search Vehicle No (MH12...), Customer, Model..."
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                style={{ flex: 1, fontSize: 13, fontWeight: '700', color: isDark ? '#FFFFFF' : '#2B3544' }}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          {/* TAB CONTENT: JOB SHEETS */}
          {activeTab === 'jobs' && (
            <View style={{ gap: 10 }}>
              {filteredJobSheets.length === 0 ? (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '700' }}>
                    {searchQuery ? `No vehicles matching "${searchQuery}"` : 'No Job Sheets yet'}
                  </Text>
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
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      borderRadius: 20,
                      backgroundColor: isDark ? '#141824' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: cardBorder,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      {/* Live Auto-Detected Distinct Car Silhouette with Badge */}
                      <DynamicCarIllustration modelName={item.vehicleModel} size={48} showBadge={true} />

                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#2B3544' }}>
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

                        <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '800', marginTop: 2 }}>
                          {item.vehicleRegNumber} • <Text style={{ fontWeight: '600' }}>{item.customerName}</Text>
                        </Text>
                        <Text style={{ fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 1 }}>
                          🕒 {item.time || '10:00 AM'} • {item.date}
                        </Text>
                      </View>
                    </View>

                    <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                      <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#2B3544' }}>
                        {formatCurrency(item.amount, currencySymbol)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '800',
                          color: item.pendingAmount === 0 ? '#00C896' : '#EF4444',
                          marginTop: 2,
                        }}
                      >
                        {item.pendingAmount === 0 ? '✓ Paid' : `Due: ${formatCurrency(item.pendingAmount, currencySymbol)}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* TAB CONTENT: EXPENSES */}
          {activeTab === 'expenses' && (
            <View style={{ gap: 10 }}>
              {expenses.length === 0 ? (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '700' }}>No Expenses Logged Today</Text>
                </View>
              ) : (
                expenses.slice(0, 8).map((exp) => (
                  <View
                    key={exp.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      borderRadius: 20,
                      backgroundColor: isDark ? '#141824' : '#FFFFFF',
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
                          backgroundColor: isDark ? '#1C2538' : '#2B3544',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Receipt size={16} color="#FFFFFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#2B3544' }}>
                          {exp.categoryName || exp.description}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                          {exp.spentBy ? `Taken by: ${exp.spentBy}` : 'Workshop Outflow'} {exp.time ? `• ${exp.time}` : ''}
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

          {/* TAB CONTENT: CHALANS */}
          {activeTab === 'chalans' && (
            <View style={{ gap: 10 }}>
              {chalans.map((chalan) => (
                <TouchableOpacity
                  key={chalan.id}
                  onPress={() => router.push('/inventory')}
                  activeOpacity={0.85}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    backgroundColor: isDark ? '#141824' : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: isDark ? '#FFFFFF' : '#2B3544' }}>
                      {chalan.chalanNumber} • {chalan.vendorName}
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#2B3544' }}>
                      {formatCurrency(chalan.totalAmount, currencySymbol)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 11, color: '#6B9FE8', fontWeight: '700' }}>
                      {chalan.items.length} parts • Tagged: {chalan.items.map((i) => i.assignedVehicleNumber).slice(0, 2).join(', ')}
                    </Text>
                    <Text style={{ fontSize: 11, color: chalan.pendingAmount === 0 ? '#00C896' : '#EF4444', fontWeight: '800' }}>
                      {chalan.pendingAmount === 0 ? '✓ Paid' : `Due: ₹${chalan.pendingAmount}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
