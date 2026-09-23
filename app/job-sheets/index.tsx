// ============================================================
// Job Sheets Screen — Master Job Cards, Status Filters & Search
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Plus,
  Car,
  User,
  Phone,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { formatCurrency } from '../../src/utils/currency';
import { JobSheet, JobStatus } from '../../src/types/jobSheet.types';

const STATUS_TABS: { label: string; value: JobStatus | 'ALL' }[] = [
  { label: 'All Jobs', value: 'ALL' },
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
];

export default function JobSheetsScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { jobSheets, setJobSheets } = useJobSheetStore();

  const [activeTab, setActiveTab] = useState<JobStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Firestore real-time listener
  useEffect(() => {
    const entId = enterpriseId || 'enterprise-dev-001';
    let unsubscribe: () => void;

    async function subscribeJobSheets() {
      try {
        const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');
        const jobsRef = collection(db, 'enterprises', entId, 'jobSheets');
        const q = query(jobsRef, orderBy('createdAt', 'desc'));

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const list: JobSheet[] = [];
            snapshot.forEach((doc) => {
              list.push({ id: doc.id, ...(doc.data() as any) });
            });
            if (list.length > 0) {
              setJobSheets(list);
            }
          },
          (err) => {
            console.log('[JobSheets] Firestore listener offline/error:', err);
          }
        );
      } catch (err) {
        console.log('[JobSheets] listener setup error:', err);
      }
    }

    subscribeJobSheets();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [enterpriseId]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobSheets.filter((job) => {
      const matchesTab = activeTab === 'ALL' || job.status === activeTab;
      if (!matchesTab) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const numMatch = job.jobNumber?.toLowerCase().includes(q);
      const vehMatch = job.vehicleNumber?.toLowerCase().includes(q) || job.vehicleModel?.toLowerCase().includes(q);
      const custMatch = job.customerName?.toLowerCase().includes(q) || job.customerPhone?.includes(q);
      return Boolean(numMatch || vehMatch || custMatch);
    });
  }, [jobSheets, activeTab, searchQuery]);

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'OPEN':
        return { bg: isDark ? '#78350F' : '#FEF3C7', text: isDark ? '#FBBF24' : '#B45309', label: 'Open' };
      case 'IN_PROGRESS':
        return { bg: isDark ? '#1E3A8A' : '#DBEAFE', text: isDark ? '#60A5FA' : '#1D4ED8', label: 'In Progress' };
      case 'COMPLETED':
        return { bg: isDark ? '#064E3B' : '#DCFCE7', text: isDark ? '#34D399' : '#15803D', label: 'Completed' };
      case 'CANCELLED':
        return { bg: isDark ? '#7F1D1D' : '#FEE2E2', text: isDark ? '#F87171' : '#B91C1C', label: 'Cancelled' };
      default:
        return { bg: isDark ? '#1F2937' : '#F3F4F6', text: isDark ? '#9CA3AF' : '#4B5563', label: status };
    }
  };

  const renderJobCard = ({ item }: { item: JobSheet }) => {
    const statusStyle = getStatusBadge(item.status);
    const hasPending = (item.pendingAmount ?? 0) > 0;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push(`/job-sheets/${item.id}` as any)}
        style={{ marginBottom: 14 }}
      >
        <GlassCard variant="sand" padding={18} style={{ borderRadius: 28 }}>
          {/* Top Row: Job Number & Status Badge */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: theme.text, fontSize: 13, fontWeight: '800' }}>
                  {item.jobNumber || '#CCG-0000'}
                </Text>
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                {typeof item.date === 'string' ? item.date.slice(0, 10) : 'Today'}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: statusStyle.bg,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: statusStyle.text, fontSize: 12, fontWeight: '700' }}>
                {statusStyle.label}
              </Text>
            </View>
          </View>

          {/* Vehicle Info */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <View
              style={{
                backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              }}
            >
              <Text style={{ color: theme.text, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 }}>
                {item.vehicleNumber || 'NO PLATE'}
              </Text>
            </View>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700', flex: 1 }} numberOfLines={1}>
              {item.vehicleMake ? `${item.vehicleMake} ${item.vehicleModel || ''}` : item.vehicleModel || 'Vehicle'}
            </Text>
          </View>

          {/* Customer & Call */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 8,
              borderTopWidth: 1,
              borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
              <User size={14} color={theme.textMuted} />
              <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600' }} numberOfLines={1}>
                {item.customerName || 'Walk-in Customer'}
              </Text>
            </View>
            {item.customerPhone ? (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${item.customerPhone}`)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 10,
                  backgroundColor: isDark ? '#064E3B' : '#DCFCE7',
                }}
              >
                <Phone size={12} color={isDark ? '#34D399' : '#15803D'} />
                <Text style={{ color: isDark ? '#34D399' : '#15803D', fontSize: 11, fontWeight: '700' }}>
                  Call
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Financial Breakdown: Final Amount, Paid, Pending */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: isDark ? '#252B38' : '#FFFFFF',
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          >
            <View>
              <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Total Bill</Text>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800', marginTop: 2 }}>
                {formatCurrency(item.finalAmount || 0, currencySymbol)}
              </Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Paid</Text>
              <Text style={{ color: isDark ? '#34D399' : '#15803D', fontSize: 14, fontWeight: '700', marginTop: 2 }}>
                {formatCurrency(item.totalPaid || 0, currencySymbol)}
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Balance</Text>
              <Text
                style={{
                  color: hasPending ? (isDark ? '#F87171' : '#B91C1C') : (isDark ? '#34D399' : '#15803D'),
                  fontSize: 14,
                  fontWeight: '800',
                  marginTop: 2,
                }}
              >
                {hasPending
                  ? formatCurrency(item.pendingAmount || 0, currencySymbol)
                  : 'Cleared ✓'}
              </Text>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isDark ? '#1C212B' : '#EFECE6',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={20} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
              Job Sheets
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
              {filteredJobs.length} active work orders
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/job-sheets/create')}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? '#FFFFFF' : '#121214',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Luxury Search Pill */}
      <View style={{ paddingHorizontal: 22, marginBottom: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#1C212B' : '#EFECE6',
            borderRadius: 26,
            paddingHorizontal: 16,
            height: 52,
            gap: 12,
          }}
        >
          <Search size={18} color={theme.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by job #, car reg, or owner..."
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '500' }}
          />
        </View>
      </View>

      {/* Filter Tabs (Nestora active black / inactive sand) */}
      <View style={{ paddingHorizontal: 22, marginBottom: 16 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={STATUS_TABS}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => {
            const isSelected = activeTab === item.value;
            return (
              <TouchableOpacity
                onPress={() => setActiveTab(item.value)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                  borderRadius: 20,
                  backgroundColor: isSelected
                    ? (isDark ? '#FFFFFF' : '#121214')
                    : (isDark ? '#1C212B' : '#EFECE6'),
                }}
              >
                <Text
                  style={{
                    color: isSelected ? (isDark ? '#121214' : '#FFFFFF') : theme.textMuted,
                    fontSize: 13,
                    fontWeight: isSelected ? '700' : '600',
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Job Sheet List */}
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobCard}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: isDark ? '#1C212B' : '#EFECE6',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Car size={30} color={theme.text} />
            </View>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
              No Job Sheets Found
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, textAlign: 'center', maxWidth: 280 }}>
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Create your first job sheet to track services, spare parts, and customer payments'}
            </Text>
          </View>
        }
      />

      {/* Bottom Floating Pill CTA Button */}
      <View style={{ position: 'absolute', bottom: 24, left: 22, right: 22 }}>
        <TouchableOpacity
          onPress={() => router.push('/job-sheets/create')}
          activeOpacity={0.88}
          style={{
            backgroundColor: isDark ? '#FFFFFF' : '#121214',
            paddingVertical: 18,
            borderRadius: 34,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Plus size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
          <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            Create New Job Sheet
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
