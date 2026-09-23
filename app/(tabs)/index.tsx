// ============================================================
// Dashboard Screen — Modern Luxury Warm-Minimalist (Nestora Style)
// Matching Screen 2 in media_1790116823022.png
// ============================================================

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  SlidersHorizontal,
  Bell,
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  Clock,
  Car,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Wrench,
  Fuel,
  Calendar,
  Layers,
  FileText,
  CheckCircle2,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useAuthStore } from '../../src/store/authStore';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency, formatCompactCurrency } from '../../src/utils/currency';
import { getInitials } from '../../src/utils/formatters';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const FILTER_PILLS = ['All Orders', 'In Progress', 'Completed', 'Unpaid'];

export default function DashboardScreen() {
  const { theme, isDark, toggleMode } = useTheme();
  const { enterprise, currencySymbol } = useEnterprise();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [activeFilter, setActiveFilter] = useState('All Orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Financial & Operational State
  const [metrics, setMetrics] = useState({
    todayCollections: 10200,
    todayExpenses: 8150,
    pendingAmount: 2500,
    todayJobs: 2,
    monthlyJobValue: 12700,
    monthlyCollected: 10200,
    monthlyOutstanding: 2500,
  });

  const [jobSheets, setJobSheets] = useState<any[]>([
    {
      id: 'JS-2026-002',
      jobNumber: 'CCG-0002',
      customerName: 'Amit Patel',
      customerPhone: '+919811154321',
      vehicleModel: 'Hyundai Creta SX',
      vehicleRegNumber: 'MH01CD5678',
      amount: 4200,
      paidAmount: 1700,
      pendingAmount: 2500,
      status: 'IN_PROGRESS',
      serviceType: 'AC Gas & Coil Service',
      fuelType: 'Petrol',
      date: 'Today, 11:30 AM',
    },
    {
      id: 'JS-2026-001',
      jobNumber: 'CCG-0001',
      customerName: 'Rajesh Sharma',
      customerPhone: '+919820112345',
      vehicleModel: 'Honda City ZX',
      vehicleRegNumber: 'MH02AB1234',
      amount: 8500,
      paidAmount: 8500,
      pendingAmount: 0,
      status: 'COMPLETED',
      serviceType: 'Brake Pads & Synth 4L',
      fuelType: 'Petrol',
      date: 'Today, 09:15 AM',
    },
  ]);

  // Live Firestore Sync
  useEffect(() => {
    let unsubscribeJobs: (() => void) | undefined;
    const syncLiveFirestore = async () => {
      try {
        const entId = enterprise?.id || 'enterprise-dev-001';
        const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');

        const jobsRef = collection(db, 'enterprises', entId, 'jobSheets');
        unsubscribeJobs = onSnapshot(jobsRef, (snap) => {
          if (!snap.empty) {
            const jobsList = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
            const totalCollected = jobsList.reduce((sum, j) => sum + (Number(j.paidAmount || j.totalPaid) || 0), 0);
            const totalJobValue = jobsList.reduce((sum, j) => sum + (Number(j.finalAmount || j.estimatedAmount) || 0), 0);
            const totalOutstanding = Math.max(0, totalJobValue - totalCollected);

            setMetrics((prev) => ({
              ...prev,
              todayCollections: totalCollected,
              todayJobs: jobsList.length,
              pendingAmount: totalOutstanding,
              monthlyJobValue: totalJobValue,
              monthlyCollected: totalCollected,
              monthlyOutstanding: totalOutstanding,
            }));

            const mapped = jobsList.map((j) => ({
              id: j.id,
              jobNumber: j.jobNumber || j.id,
              customerName: j.customerName || 'Customer',
              customerPhone: j.customerPhone || '',
              vehicleModel: j.vehicleMakeModel || j.vehicleModel || 'Vehicle',
              vehicleRegNumber: j.vehicleRegNumber || j.vehicleNumber || 'MH00XX0000',
              amount: Number(j.finalAmount || j.estimatedAmount) || 0,
              paidAmount: Number(j.paidAmount || j.totalPaid) || 0,
              pendingAmount: Number(j.pendingAmount || 0),
              status: j.status || 'OPEN',
              serviceType: j.items?.[0]?.name || 'General Periodic Service',
              fuelType: j.fuelType || 'Petrol',
              date: typeof j.date === 'string' ? j.date.slice(0, 10) : 'Recent',
            }));
            setJobSheets(mapped);
          }
        });
      } catch (err) {
        console.log('[Dashboard] Firestore listener error:', err);
      }
    };

    syncLiveFirestore();
    return () => {
      if (unsubscribeJobs) unsubscribeJobs();
    };
  }, [enterprise]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobSheets.filter((j) => {
      if (activeFilter === 'In Progress' && j.status !== 'IN_PROGRESS') return false;
      if (activeFilter === 'Completed' && j.status !== 'COMPLETED') return false;
      if (activeFilter === 'Unpaid' && (j.pendingAmount || 0) <= 0) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        j.jobNumber?.toLowerCase().includes(q) ||
        j.vehicleModel?.toLowerCase().includes(q) ||
        j.vehicleRegNumber?.toLowerCase().includes(q) ||
        j.customerName?.toLowerCase().includes(q)
      );
    });
  }, [jobSheets, activeFilter, searchQuery]);

  // Hero Card Target (Top active order)
  const heroJob = filteredJobs[0] || jobSheets[0];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* TOP BAR (Matching Explore Header in media_1790116823022.png) */}
        <View
          style={{
            paddingTop: insets.top + 10,
            paddingHorizontal: 20,
            paddingBottom: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text style={{ color: theme.text, fontSize: 26, fontWeight: '900', letterSpacing: -0.5 }}>
              Explore
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1, fontWeight: '600' }}>
              {enterprise?.name ?? 'Super Auto Garage'}
            </Text>
          </View>

          {/* Right: Theme Switcher, Bell, Avatar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* Theme Toggle Pill */}
            <TouchableOpacity
              onPress={toggleMode}
              activeOpacity={0.8}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              {isDark ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#18181B" />}
            </TouchableOpacity>

            {/* Notification Bell with Badge */}
            <TouchableOpacity
              onPress={() => router.push('/reminders')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Bell size={18} color={theme.text} />
              <View
                style={{
                  position: 'absolute',
                  top: 9,
                  right: 9,
                  width: 7,
                  height: 7,
                  borderRadius: 3.5,
                  backgroundColor: '#EF4444',
                }}
              />
            </TouchableOpacity>

            {/* Profile Avatar */}
            <TouchableOpacity
              onPress={() => router.push('/settings/profile')}
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: isDark ? '#27272A' : '#EFECE6',
                borderWidth: 2,
                borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>
                {getInitials(user?.displayName ?? 'Manish')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PILL SEARCH BAR WITH FILTER BUTTON (Screen 2 pattern) */}
        <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 28,
              height: 52,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: theme.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0 : 0.04,
              shadowRadius: 8,
              elevation: 2,
              gap: 12,
            }}
          >
            <Search size={18} color={theme.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search vehicles, jobs, customers..."
              placeholderTextColor={theme.textMuted}
              style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: '600' }}
            />
            {/* Filter Toggle Icon Box */}
            <TouchableOpacity
              onPress={() => router.push('/job-sheets' as any)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F4F2EE',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SlidersHorizontal size={15} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* CATEGORY / FILTER PILLS (Solid Black for Active, Clean Off-White for Inactive) */}
        <View style={{ marginBottom: 18 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          >
            {FILTER_PILLS.map((pill) => {
              const isSelected = activeFilter === pill;
              return (
                <TouchableOpacity
                  key={pill}
                  onPress={() => setActiveFilter(pill)}
                  activeOpacity={0.85}
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                    borderRadius: 24,
                    backgroundColor: isSelected
                      ? isDark
                        ? '#FFFFFF'
                        : '#121214'
                      : isDark
                      ? '#1A1E27'
                      : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: isSelected
                      ? isDark
                        ? '#FFFFFF'
                        : '#121214'
                      : theme.border,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSelected ? 0.15 : 0.03,
                    shadowRadius: 6,
                    elevation: isSelected ? 3 : 1,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected
                        ? isDark
                          ? '#12141A'
                          : '#FFFFFF'
                        : theme.textSecondary,
                      fontSize: 13,
                      fontWeight: '700',
                    }}
                  >
                    {pill}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SECTION HEADER: BEST OFFERS / ACTIVE ORDERS */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
            Featured Order
          </Text>
          <TouchableOpacity onPress={() => router.push('/job-sheets' as any)}>
            <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '700' }}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {/* HERO SHOWCASE CARD (The iconic warm sand card from Screen 2 in media_1790116823022.png) */}
        {heroJob && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => router.push(`/job-sheets/${heroJob.id}` as any)}
              style={{
                backgroundColor: isDark ? '#1E2430' : '#EFECE6',
                borderRadius: 28,
                padding: 20,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: isDark ? 0.3 : 0.06,
                shadowRadius: 16,
                elevation: 4,
              }}
            >
              {/* Floating Top Tag & Floating Circular Action */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <View
                  style={{
                    backgroundColor: isDark ? '#12141A' : '#FFFFFF',
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text style={{ color: theme.text, fontSize: 12, fontWeight: '800' }}>
                    {heroJob.status === 'COMPLETED' ? 'Completed Order' : 'Active Work Order'}
                  </Text>
                </View>

                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: isDark ? '#12141A' : '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <ArrowUpRight size={18} color={theme.text} />
                </View>
              </View>

              {/* Graphic / Indian Plate Banner */}
              <View
                style={{
                  backgroundColor: isDark ? '#141822' : '#FFFFFF',
                  borderRadius: 20,
                  padding: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {/* Indian Plate Pill */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#1E3A8A',
                      borderRadius: 6,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: '#1E3A8A',
                    }}
                  >
                    <View style={{ paddingHorizontal: 6, paddingVertical: 3 }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '900' }}>IND</Text>
                    </View>
                    <View style={{ backgroundColor: isDark ? '#000' : '#FFFFFF', paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ color: isDark ? '#FFF' : '#000', fontSize: 12, fontWeight: '900', letterSpacing: 1 }}>
                        {heroJob.vehicleRegNumber}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                  {heroJob.jobNumber}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                  {heroJob.serviceType}
                </Text>
              </View>

              {/* Bottom Info: Title, Owner & Price */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{ color: theme.text, fontSize: 18, fontWeight: '900' }}>
                    {heroJob.vehicleModel}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2, fontWeight: '600' }}>
                    {heroJob.customerName} • {heroJob.date}
                  </Text>
                </View>

                <Text style={{ color: theme.text, fontSize: 22, fontWeight: '900' }}>
                  {formatCurrency(heroJob.amount, currencySymbol)}
                </Text>
              </View>

              {/* 3-Spec Micro Pills Row (Screen 2 pattern) */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: isDark ? '#141822' : '#FFFFFF',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 14,
                  }}
                >
                  <Car size={13} color={theme.textMuted} />
                  <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700' }}>
                    4-Wheeler
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: isDark ? '#141822' : '#FFFFFF',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 14,
                  }}
                >
                  <Fuel size={13} color={theme.textMuted} />
                  <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700' }}>
                    {heroJob.fuelType}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: isDark ? '#141822' : '#FFFFFF',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 14,
                  }}
                >
                  <Clock size={13} color={heroJob.pendingAmount > 0 ? '#F59E0B' : '#10B981'} />
                  <Text
                    style={{
                      color: heroJob.pendingAmount > 0 ? '#F59E0B' : '#10B981',
                      fontSize: 12,
                      fontWeight: '800',
                    }}
                  >
                    {heroJob.pendingAmount > 0
                      ? `Due: ${formatCurrency(heroJob.pendingAmount, currencySymbol)}`
                      : 'Paid ✓'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* FINANCIAL SUMMARY CARDS (Screen 2 style) */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginBottom: 12 }}>
            Financial Overview
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Revenue Collected */}
            <View
              style={{
                flex: 1,
                backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
                borderRadius: 24,
                padding: 18,
                borderWidth: 1,
                borderColor: theme.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0 : 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700' }}>
                  COLLECTED
                </Text>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: 'rgba(16,185,129,0.12)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp size={14} color="#10B981" />
                </View>
              </View>
              <Text style={{ color: theme.text, fontSize: 22, fontWeight: '900' }}>
                {formatCurrency(metrics.todayCollections, currencySymbol)}
              </Text>
              <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '700', marginTop: 4 }}>
                {metrics.todayJobs} jobs completed
              </Text>
            </View>

            {/* Pending Balance */}
            <View
              style={{
                flex: 1,
                backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
                borderRadius: 24,
                padding: 18,
                borderWidth: 1,
                borderColor: theme.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0 : 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700' }}>
                  OUTSTANDING
                </Text>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: 'rgba(245,158,11,0.12)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Clock size={14} color="#F59E0B" />
                </View>
              </View>
              <Text style={{ color: metrics.pendingAmount > 0 ? '#F59E0B' : theme.text, fontSize: 22, fontWeight: '900' }}>
                {formatCurrency(metrics.pendingAmount, currencySymbol)}
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '700', marginTop: 4 }}>
                Customer dues
              </Text>
            </View>
          </View>
        </View>

        {/* QUICK MANAGEMENT CHIPS */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { label: 'Job Sheet', icon: FileText, route: '/job-sheets/create' },
              { label: 'Customers', icon: Car, route: '/customers' },
              { label: 'Vehicles', icon: Wrench, route: '/vehicles' },
              { label: 'Expenses', icon: TrendingDown, route: '/expenses/add' },
            ].map((btn) => {
              const Icon = btn.icon;
              return (
                <TouchableOpacity
                  key={btn.label}
                  onPress={() => router.push(btn.route as any)}
                  activeOpacity={0.85}
                  style={{
                    flex: 1,
                    backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
                    borderRadius: 20,
                    paddingVertical: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}
                >
                  <Icon size={18} color={theme.text} />
                  <Text style={{ color: theme.text, fontSize: 11, fontWeight: '700' }}>
                    {btn.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ALL WORK ORDERS LIST (Screen 2 cards) */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
              All Work Orders ({filteredJobs.length})
            </Text>
            <TouchableOpacity onPress={() => router.push('/job-sheets' as any)}>
              <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '700' }}>
                View all
              </Text>
            </TouchableOpacity>
          </View>

          {filteredJobs.slice(1).map((job) => (
            <TouchableOpacity
              key={job.id}
              activeOpacity={0.88}
              onPress={() => router.push(`/job-sheets/${job.id}` as any)}
              style={{
                backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
                borderRadius: 24,
                padding: 18,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: theme.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0 : 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F4F2EE',
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: theme.text, fontSize: 11, fontWeight: '800' }}>
                      {job.jobNumber}
                    </Text>
                  </View>
                  <Text style={{ color: theme.textMuted, fontSize: 12 }}>{job.date}</Text>
                </View>

                <Text style={{ color: theme.text, fontSize: 16, fontWeight: '900' }}>
                  {formatCurrency(job.amount, currencySymbol)}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                    {job.vehicleModel} ({job.vehicleRegNumber})
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                    Owner: {job.customerName}
                  </Text>
                </View>

                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    backgroundColor:
                      job.status === 'COMPLETED'
                        ? 'rgba(16,185,129,0.12)'
                        : 'rgba(245,158,11,0.12)',
                  }}
                >
                  <Text
                    style={{
                      color: job.status === 'COMPLETED' ? '#10B981' : '#F59E0B',
                      fontSize: 11,
                      fontWeight: '800',
                    }}
                  >
                    {job.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
