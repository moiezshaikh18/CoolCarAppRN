// ============================================================
// Dashboard Screen — Sky Blue & Midnight Navy Luxury Aesthetic
// Directly matching media_1790189780212.png & media_1790189816628.png
// ============================================================

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Sun,
  Moon,
  TrendingUp,
  ArrowDown,
  ArrowUpRight,
  Repeat,
  Plus,
  Car,
  ChevronDown,
  SlidersHorizontal,
  Wrench,
  Fuel,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useAuthStore } from '../../src/store/authStore';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { theme, isDark, toggleMode } = useTheme();
  const { enterprise, currencySymbol } = useEnterprise();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<'jobs' | 'vehicles' | 'expenses'>('jobs');
  const [refreshing, setRefreshing] = useState(false);

  // Financial State
  const [metrics, setMetrics] = useState({
    totalBalance: 102588,
    todayCollections: 12450,
    growthPercent: 8.82,
    activeJobsCount: 4,
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
      date: 'Yesterday',
    },
    {
      id: 'JS-2026-003',
      jobNumber: 'CCG-0003',
      customerName: 'Priya Kapoor',
      customerPhone: '+919811223344',
      vehicleModel: 'Maruti Brezza ZDi',
      vehicleRegNumber: 'DL04AB1234',
      amount: 14200,
      paidAmount: 14200,
      pendingAmount: 0,
      status: 'PAID',
      serviceType: 'Full Major 40K Service',
      fuelType: 'Diesel',
      date: '20 May',
    },
    {
      id: 'JS-2026-004',
      jobNumber: 'CCG-0004',
      customerName: 'Suresh Gupta',
      customerPhone: '+919899001122',
      vehicleModel: 'Tata Nexon EV Max',
      vehicleRegNumber: 'HR26BC4321',
      amount: 3200,
      paidAmount: 0,
      pendingAmount: 3200,
      status: 'OPEN',
      serviceType: 'Brake Fluid & Inspection',
      fuelType: 'Electric',
      date: '18 May',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  const canvasBg = isDark ? '#070A0F' : '#6B9FE8';
  const sheetBg = isDark ? '#111622' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Top Sky Blue Header Area */}
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 16 }}>
          {/* Top Bar with Garage Selector Chip & Controls */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/select-enterprise')}
              activeOpacity={0.85}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                {enterprise?.name || 'Super Auto Garage'}
              </Text>
              <ChevronDown size={14} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

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
                <View
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 7,
                    height: 7,
                    borderRadius: 3.5,
                    backgroundColor: '#EF4444',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Featured Midnight Navy Hero Card (Directly matching media_1790189780212.png) */}
          <GlassCard
            variant="navy"
            padding={24}
            style={{
              borderRadius: 32,
              marginBottom: 16,
            }}
          >
            {/* Balance Subtext */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 13, fontWeight: '600' }}>
                Workshop Liquid Balance
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: 'rgba(0, 200, 150, 0.18)',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 14,
                }}
              >
                <Text style={{ color: '#00C896', fontSize: 11, fontWeight: '800' }}>
                  +₹12,450
                </Text>
                <TrendingUp size={12} color="#00C896" />
                <Text style={{ color: '#00C896', fontSize: 11, fontWeight: '800' }}>
                  8.82%
                </Text>
              </View>
            </View>

            {/* Giant Balance Amount */}
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 10, marginBottom: 20 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1 }}>
                {currencySymbol}1,02,588
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: 24, fontWeight: '700' }}>
                .05
              </Text>
            </View>

            {/* 4 Quick Action Circular Buttons (↓ ↗ ⇄ +) */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Inflow */}
              <TouchableOpacity
                onPress={() => router.push('/payments')}
                activeOpacity={0.8}
                style={{ alignItems: 'center', gap: 6 }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ArrowDown size={20} color="#FFFFFF" strokeWidth={2.2} />
                </View>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 11, fontWeight: '700' }}>
                  Receive
                </Text>
              </TouchableOpacity>

              {/* Expense */}
              <TouchableOpacity
                onPress={() => router.push('/expenses/add')}
                activeOpacity={0.8}
                style={{ alignItems: 'center', gap: 6 }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ArrowUpRight size={20} color="#FFFFFF" strokeWidth={2.2} />
                </View>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 11, fontWeight: '700' }}>
                  Expense
                </Text>
              </TouchableOpacity>

              {/* Job Sheets */}
              <TouchableOpacity
                onPress={() => router.push('/job-sheets')}
                activeOpacity={0.8}
                style={{ alignItems: 'center', gap: 6 }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Repeat size={20} color="#FFFFFF" strokeWidth={2.2} />
                </View>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 11, fontWeight: '700' }}>
                  Orders
                </Text>
              </TouchableOpacity>

              {/* New Job */}
              <TouchableOpacity
                onPress={() => router.push('/job-sheets/create')}
                activeOpacity={0.8}
                style={{ alignItems: 'center', gap: 6 }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 11, fontWeight: '700' }}>
                  New Job
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Workshop Fleet Status Banner (Matching Screen 1's "Savings account" card) */}
          <TouchableOpacity
            onPress={() => router.push('/vehicles')}
            activeOpacity={0.88}
            style={{
              backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.22)',
              borderRadius: 24,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>
                Workshop Fleet Status
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, marginTop: 2 }}>
                4 vehicles under active service today
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' }} />
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.4)' }} />
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.4)' }} />
            </View>
          </TouchableOpacity>
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
          {/* Tab Selector & Filter Control */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            {/* Text Tabs: Assets / NFTs style from reference */}
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setActiveTab('jobs')} activeOpacity={0.7}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: activeTab === 'jobs' ? '900' : '600',
                    color: activeTab === 'jobs' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                  }}
                >
                  Job Sheets
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setActiveTab('vehicles')} activeOpacity={0.7}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: activeTab === 'vehicles' ? '900' : '600',
                    color: activeTab === 'vehicles' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                  }}
                >
                  Fleet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setActiveTab('expenses')} activeOpacity={0.7}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: activeTab === 'expenses' ? '900' : '600',
                    color: activeTab === 'expenses' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                  }}
                >
                  Expenses
                </Text>
              </TouchableOpacity>
            </View>

            {/* Filter Icon */}
            <TouchableOpacity
              onPress={() => router.push('/job-sheets')}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: isDark ? '#182030' : '#F4F7FC',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SlidersHorizontal size={16} color={isDark ? '#FFFFFF' : '#0C1829'} />
            </TouchableOpacity>
          </View>

          {/* List Items (Directly matching Bitcoin / Ethereum row styling in screenshot) */}
          <View style={{ gap: 14 }}>
            {jobSheets.map((item) => {
              const isPaid = item.pendingAmount === 0;
              const isPartial = item.paidAmount > 0 && item.pendingAmount > 0;

              return (
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
                    borderRadius: 24,
                    backgroundColor: isDark ? '#141926' : '#F8FAFD',
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  {/* Left: Circular Midnight Navy Icon Avatar & Title */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: isDark ? '#1C2538' : '#0C1829',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Car size={20} color="#FFFFFF" />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 15,
                          fontWeight: '800',
                          color: isDark ? '#FFFFFF' : '#0C1829',
                        }}
                      >
                        {item.vehicleModel}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          color: '#64748B',
                          fontWeight: '600',
                          marginTop: 2,
                        }}
                      >
                        {item.vehicleRegNumber} • {item.customerName}
                      </Text>
                    </View>
                  </View>

                  {/* Right: Bill Amount & Status Pill */}
                  <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '900',
                        color: isDark ? '#FFFFFF' : '#0C1829',
                      }}
                    >
                      {formatCurrency(item.amount, currencySymbol)}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 3,
                        marginTop: 4,
                      }}
                    >
                      {isPaid ? (
                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#00C896' }}>
                          ↑ Paid
                        </Text>
                      ) : isPartial ? (
                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#F59E0B' }}>
                          Due {formatCurrency(item.pendingAmount, currencySymbol)}
                        </Text>
                      ) : (
                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#EF4444' }}>
                          ↓ Unpaid
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
