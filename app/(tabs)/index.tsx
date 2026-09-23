// ============================================================
// Cool Car Workshop — Dedicated Dashboard Screen
// Exclusively for Cool Car (AC Repair & Mechanical Auto Workshop)
// Features the 4 Core Modules + Unlimited Bank Accounts
// Sky Blue (#6B9FE8) & Midnight Navy (#0C1829) Luxury Aesthetic
// ============================================================

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
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
  Wallet,
  Building,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { useExpenseStore } from '../../src/store/expenseStore';
import { useChalanStore } from '../../src/store/chalanStore';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { router } from 'expo-router';

export default function DashboardScreen() {
  const { theme, isDark, toggleMode } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();

  // Stores
  const { employees } = useEmployeeStore();
  const { accounts } = useBankAccountStore();
  const { expenses } = useExpenseStore();
  const { chalans } = useChalanStore();

  const [activeTab, setActiveTab] = useState<'jobs' | 'expenses' | 'chalans'>('jobs');
  const [refreshing, setRefreshing] = useState(false);

  // Derived Metrics
  const totalLiquidBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + (a.currentBalance || 0), 0),
    [accounts]
  );

  const totalAdvanceDue = useMemo(
    () => employees.reduce((sum, e) => sum + (e.currentAdvance || 0), 0),
    [employees]
  );

  const activeStaffCount = useMemo(
    () => employees.filter((e) => e.status !== 'LEFT').length,
    [employees]
  );

  const todayExpensesTotal = useMemo(
    () => expenses.reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  );

  const totalChalansValue = useMemo(
    () => chalans.reduce((sum, c) => sum + c.totalAmount, 0),
    [chalans]
  );

  // Sample Live Job Sheets for Cool Car
  const [jobSheets] = useState([
    {
      id: 'JS-2026-001',
      jobNumber: 'CC-0412',
      customerName: 'Rajesh Sharma',
      customerPhone: '+919820112345',
      vehicleModel: 'Honda City ZX',
      vehicleRegNumber: 'MH02AB1234',
      workCategory: 'AC',
      amount: 14500,
      paidAmount: 14500,
      pendingAmount: 0,
      serviceDesc: 'Full AC Compressor Replacement & Cooling Coil Service',
      date: 'Today, 11:30 AM',
    },
    {
      id: 'JS-2026-002',
      jobNumber: 'CC-0413',
      customerName: 'Amit Patel',
      customerPhone: '+919811154321',
      vehicleModel: 'Hyundai Creta SX',
      vehicleRegNumber: 'DL04CD5678',
      workCategory: 'BOTH',
      amount: 8200,
      paidAmount: 4000,
      pendingAmount: 4200,
      serviceDesc: 'AC Gas R134a Refill + Front Brake Pads & Suspension',
      date: 'Today, 01:15 PM',
    },
    {
      id: 'JS-2026-003',
      jobNumber: 'CC-0414',
      customerName: 'Priya Kapoor',
      customerPhone: '+919899001122',
      vehicleModel: 'Maruti Brezza ZDi',
      vehicleRegNumber: 'MH04EF9012',
      workCategory: 'MECHANICAL',
      amount: 5400,
      paidAmount: 5400,
      pendingAmount: 0,
      serviceDesc: 'Clutch Overhaul & Engine Mobil 1 5W-30 Oil Service',
      date: 'Yesterday',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const canvasBg = isDark ? '#070A0F' : '#6B9FE8';
  const sheetBg = isDark ? '#111622' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Top Sky Blue Header Area */}
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 18 }}>
          {/* Top Bar with Cool Car Branding & Controls */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
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
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>
                    GARAGE
                  </Text>
                </View>
              </View>
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                ❄️ AC Repair & 🔧 Mechanical Auto Workshop
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {/* Theme Toggle */}
              <TouchableOpacity
                onPress={toggleMode}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isDark ? <Sun size={17} color="#FBBF24" /> : <Moon size={17} color="#FFFFFF" />}
              </TouchableOpacity>

              {/* Notification Bell */}
              <TouchableOpacity
                onPress={() => router.push('/reminders')}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bell size={17} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Featured Midnight Navy Hero Card — Workshop Total Liquid Balance */}
          <GlassCard
            variant="navy"
            padding={22}
            style={{
              borderRadius: 30,
              marginBottom: 16,
            }}
          >
            {/* Top Subtext */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 13, fontWeight: '700' }}>
                Workshop Liquid Balance
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/bank-accounts')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Wallet size={12} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
                  {accounts.length} Accounts
                </Text>
              </TouchableOpacity>
            </View>

            {/* Total Balance Amount */}
            <View style={{ marginVertical: 12 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: -1 }}>
                {formatCurrency(totalLiquidBalance, currencySymbol)}
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                Cash in Hand + UPI + Bank Accounts combined
              </Text>
            </View>

            {/* 4 Quick Action Capsules */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 14,
                borderTopWidth: 1,
                borderTopColor: 'rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* New Job Sheet */}
              <TouchableOpacity
                onPress={() => router.push('/job-sheets/create')}
                activeOpacity={0.8}
                style={{ alignItems: 'center', gap: 6 }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: '#6B9FE8',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={20} color="#FFFFFF" strokeWidth={2.8} />
                </View>
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
                  + Job Sheet
                </Text>
              </TouchableOpacity>

              {/* Add Expense */}
              <TouchableOpacity
                onPress={() => router.push('/expenses/add')}
                activeOpacity={0.8}
                style={{ alignItems: 'center', gap: 6 }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ArrowUpRight size={20} color="#FFFFFF" strokeWidth={2.2} />
                </View>
                <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 11, fontWeight: '700' }}>
                  + Expense
                </Text>
              </TouchableOpacity>

              {/* Inward Chalan */}
              <TouchableOpacity
                onPress={() => router.push('/inventory/chalan-add')}
                activeOpacity={0.8}
                style={{ alignItems: 'center', gap: 6 }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Car size={20} color="#FFFFFF" strokeWidth={2.2} />
                </View>
                <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 11, fontWeight: '700' }}>
                  + Chalan
                </Text>
              </TouchableOpacity>

              {/* Pay Staff */}
              <TouchableOpacity
                onPress={() => router.push('/staff/pay' as any)}
                activeOpacity={0.8}
                style={{ alignItems: 'center', gap: 6 }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Users size={20} color="#FFFFFF" strokeWidth={2.2} />
                </View>
                <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 11, fontWeight: '700' }}>
                  Pay Staff
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Quick Bank Balances Horizontal Ribbon */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingBottom: 6 }}
          >
            {accounts.map((acc) => (
              <TouchableOpacity
                key={acc.id}
                onPress={() => router.push('/bank-accounts')}
                activeOpacity={0.85}
                style={{
                  backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.22)',
                  borderRadius: 18,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.3)',
                  minWidth: 130,
                }}
              >
                <Text style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 11, fontWeight: '700' }}>
                  {acc.accountName.split(' ')[0]} ({(acc.bankName || 'Bank').split(' ')[0]})
                </Text>
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '900', marginTop: 2 }}>
                  {formatCurrency(acc.currentBalance, currencySymbol)}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => router.push('/bank-accounts/add')}
              activeOpacity={0.85}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 18,
                paddingHorizontal: 14,
                paddingVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 6,
              }}
            >
              <Plus size={14} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                + Add A/c
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 4 Core Modules 2x2 Grid */}
        <View style={{ paddingHorizontal: 20, marginBottom: 18 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '900', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 }}>
            Core Workshop Modules
          </Text>

          <View style={{ gap: 10 }}>
            {/* Row 1: Daily Job Sheet & Daily Expenses */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {/* Module 1: Daily Job Sheets */}
              <TouchableOpacity
                onPress={() => router.push('/job-sheets')}
                activeOpacity={0.88}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 22,
                  padding: 16,
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
                      backgroundColor: '#6B9FE8',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FileSpreadsheet size={18} color="#FFFFFF" />
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '900', color: '#00C896' }}>
                    {jobSheets.length} Active
                  </Text>
                </View>

                <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
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
                  backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 22,
                  padding: 16,
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

                <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  Daily Expenses
                </Text>
                <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                  Kisne Liya & Reason
                </Text>
              </TouchableOpacity>
            </View>

            {/* Row 2: Spare Parts Chalans & Staff Data */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {/* Module 3: Spare Part Purchase Chalans */}
              <TouchableOpacity
                onPress={() => router.push('/inventory')}
                activeOpacity={0.88}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 22,
                  padding: 16,
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
                      backgroundColor: '#8B5CF6',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Package size={18} color="#FFFFFF" />
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '900', color: '#8B5CF6' }}>
                    {chalans.length} Chalans
                  </Text>
                </View>

                <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
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
                  backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 22,
                  padding: 16,
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
                      backgroundColor: '#F59E0B',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Users size={18} color="#FFFFFF" />
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '900', color: '#F59E0B' }}>
                    {activeStaffCount} Staff
                  </Text>
                </View>

                <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                  Staff & Salary
                </Text>
                <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                  Docs & Advance Tracker
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Crisp White Lower Sheet (borderTopLeftRadius: 36, borderTopRightRadius: 36) */}
        <View
          style={{
            backgroundColor: sheetBg,
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            paddingTop: 24,
            paddingHorizontal: 20,
            paddingBottom: 20,
            shadowColor: '#0C1829',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDark ? 0.4 : 0.06,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {/* Section Heading & Filter Tabs */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setActiveTab('jobs')} activeOpacity={0.7}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: activeTab === 'jobs' ? '900' : '600',
                    color: activeTab === 'jobs' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                  }}
                >
                  Job Sheets ({jobSheets.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setActiveTab('expenses')} activeOpacity={0.7}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: activeTab === 'expenses' ? '900' : '600',
                    color: activeTab === 'expenses' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                  }}
                >
                  Expenses ({expenses.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setActiveTab('chalans')} activeOpacity={0.7}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: activeTab === 'chalans' ? '900' : '600',
                    color: activeTab === 'chalans' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                  }}
                >
                  Chalans ({chalans.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* List Content */}
          {activeTab === 'jobs' && (
            <View style={{ gap: 12 }}>
              {jobSheets.map((item) => (
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
                    backgroundColor: isDark ? '#141926' : '#F8FAFD',
                    borderWidth: 1,
                    borderColor: cardBorder,
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
                      <Car size={18} color="#FFFFFF" />
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
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

                      <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>
                        {item.vehicleRegNumber} • {item.customerName}
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
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
              ))}
            </View>
          )}

          {activeTab === 'expenses' && (
            <View style={{ gap: 12 }}>
              {expenses.length === 0 ? (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '700' }}>No Expenses Logged Today</Text>
                </View>
              ) : (
                expenses.slice(0, 5).map((exp) => (
                  <View
                    key={exp.id}
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
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: isDark ? '#1C2538' : '#0C1829',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Receipt size={17} color="#FFFFFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0C1829' }}>
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

          {activeTab === 'chalans' && (
            <View style={{ gap: 12 }}>
              {chalans.map((chalan) => (
                <TouchableOpacity
                  key={chalan.id}
                  onPress={() => router.push('/inventory')}
                  activeOpacity={0.85}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 22,
                    backgroundColor: isDark ? '#141926' : '#F8FAFD',
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
                      {chalan.chalanNumber} • {chalan.vendorName}
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829' }}>
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
