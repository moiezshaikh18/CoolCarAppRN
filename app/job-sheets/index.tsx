// ============================================================
// Job Sheets Screen — Master Job Cards, Status Filters & Search
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Linking,
  StatusBar,
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
  Wrench,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
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
        return { bg: isDark ? '#3B2F04' : '#FEF3C7', text: isDark ? '#FBBF24' : '#B45309', label: 'Open' };
      case 'IN_PROGRESS':
        return { bg: isDark ? '#1E293B' : '#DBEAFE', text: isDark ? '#60A5FA' : '#1D4ED8', label: 'In Progress' };
      case 'COMPLETED':
        return { bg: isDark ? '#064E3B' : '#DCFCE7', text: isDark ? '#34D399' : '#15803D', label: 'Completed' };
      case 'CANCELLED':
        return { bg: isDark ? '#450A0A' : '#FEE2E2', text: isDark ? '#F87171' : '#B91C1C', label: 'Cancelled' };
      default:
        return { bg: isDark ? '#1F2937' : '#F1F5F9', text: isDark ? '#94A3B8' : '#475569', label: status };
    }
  };

  const renderJobCard = ({ item }: { item: JobSheet }) => {
    const statusStyle = getStatusBadge(item.status);
    const hasPending = (item.pendingAmount ?? 0) > 0;

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => router.push(`/job-sheets/${item.id}` as any)}
        style={{
          backgroundColor: isDark ? '#101927' : '#FFFFFF',
          borderRadius: 24,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.3 : 0.04,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        }}
      >
        {/* Top Row: Job Number & Status Badge */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 13, fontWeight: '800' }}>
                {item.jobNumber || '#CCG-0000'}
              </Text>
            </View>
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '500' }}>
              {typeof item.date === 'string' ? item.date.slice(0, 10) : 'Today'}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: statusStyle.bg,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: statusStyle.text, fontSize: 12, fontWeight: '700' }}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <View
            style={{
              backgroundColor: isDark ? '#141926' : '#F8FAFC',
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            }}
          >
            <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 }}>
              {item.vehicleNumber || 'NO PLATE'}
            </Text>
          </View>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700', flex: 1 }} numberOfLines={1}>
            {item.vehicleMake ? `${item.vehicleMake} ${item.vehicleModel || ''}` : item.vehicleModel || 'Vehicle'}
          </Text>
          {item.workCategory && (
            <View
              style={{
                backgroundColor: item.workCategory === 'AC' ? (isDark ? 'rgba(107,159,232,0.2)' : '#EFF6FF') : (isDark ? 'rgba(245,158,11,0.2)' : '#FEF3C7'),
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: item.workCategory === 'AC' ? (isDark ? '#60A5FA' : '#1D4ED8') : (isDark ? '#FBBF24' : '#B45309'),
                  fontSize: 10,
                  fontWeight: '800',
                }}
              >
                {item.workCategory === 'AC' ? '❄️ AC' : item.workCategory === 'MECHANICAL' ? '🔧 Mech' : '⚙️ Both'}
              </Text>
            </View>
          )}
        </View>

        {/* Customer & Call */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            marginBottom: 6,
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
                paddingVertical: 5,
                borderRadius: 10,
                backgroundColor: isDark ? 'rgba(52, 211, 153, 0.15)' : '#DCFCE7',
              }}
            >
              <Phone size={12} color={isDark ? '#34D399' : '#15803D'} />
              <Text style={{ color: isDark ? '#34D399' : '#15803D', fontSize: 11, fontWeight: '700' }}>
                Call
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Assigned Mechanic */}
        {item.assignedMechanicName ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Wrench size={13} color="#6B9FE8" />
            <Text style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: 12, fontWeight: '600' }} numberOfLines={1}>
              Staff: <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontWeight: '700' }}>{item.assignedMechanicName}</Text>
            </Text>
          </View>
        ) : null}

        {/* Financial Breakdown: Final Amount, Paid, Pending */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? '#141926' : '#F8FAFC',
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 10,
          }}
        >
          <View>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Total Bill</Text>
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800', marginTop: 2 }}>
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
                color: hasPending ? (isDark ? '#F87171' : '#DC2626') : (isDark ? '#34D399' : '#15803D'),
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
      </TouchableOpacity>
    );
  };

  const skyBg = isDark ? '#070A0F' : '#6B9FE8';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';

  return (
    <View style={{ flex: 1, backgroundColor: skyBg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'light-content'} backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(255,255,255,0.22)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View>
              <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
                Job Sheets
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
                Cool Car AC Repair • {filteredJobs.length} active orders
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/job-sheets/create')}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#0C1829',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Search Pill */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#141926' : 'rgba(255,255,255,0.24)',
            borderRadius: 22,
            paddingHorizontal: 16,
            height: 48,
            gap: 10,
            marginBottom: 12,
          }}
        >
          <Search size={18} color={isDark ? '#94A3B8' : 'rgba(255,255,255,0.85)'} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search job #, vehicle reg, owner..."
            placeholderTextColor={isDark ? '#64748B' : 'rgba(255,255,255,0.7)'}
            style={{ flex: 1, color: '#FFFFFF', fontSize: 14, fontWeight: '500' }}
          />
        </View>

        {/* Filter Tabs */}
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
                  paddingVertical: 7,
                  borderRadius: 20,
                  backgroundColor: isSelected
                    ? '#0C1829'
                    : 'rgba(255,255,255,0.2)',
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: isSelected ? '800' : '600',
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Signature Mega-Curved Lower Content Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          paddingTop: 16,
          overflow: 'hidden',
        }}
      >
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJobCard}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110, paddingTop: 4 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: isDark ? '#141926' : '#EFF6FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Car size={30} color={isDark ? '#FFFFFF' : '#3B82F6'} />
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

        {/* Bottom Floating Midnight Navy CTA */}
        <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <TouchableOpacity
            onPress={() => router.push('/job-sheets/create')}
            activeOpacity={0.88}
            style={{
              backgroundColor: '#0C1829',
              paddingVertical: 16,
              borderRadius: 32,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 5 },
              elevation: 6,
            }}
          >
            <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Create New Job Sheet
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
