// ============================================================
// Screen 9: Daily Job Sheet — Master Job Cards & Date Slider
// Matches Reference Design:
// Back Arrow, Daily Date Slider (< 15 May 2025 >),
// Clean Job Cards (Car Icon, Job Number, Make/Model, Customer, Amount, Paid/Pending Badge),
// Midnight Navy Floating Button "+ New Job Sheet"
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
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Plus,
  Car,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Printer,
  Phone,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { formatCurrency } from '../../src/utils/currency';
import { JobSheet, JobStatus } from '../../src/types/jobSheet.types';
import { printJobCard } from '../../src/utils/jobCardPdf';

const STATUS_TABS: { label: string; value: JobStatus | 'ALL' }[] = [
  { label: 'All Jobs', value: 'ALL' },
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

  // Daily Date Navigation (< 15 May 2025 >) matching Screen 9
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDailyFilterActive, setIsDailyFilterActive] = useState<boolean>(false);

  const formattedDateStr = useMemo(() => {
    return selectedDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [selectedDate]);

  const handlePrevDay = () => {
    setSelectedDate((prev) => new Date(prev.getTime() - 86400000));
    setIsDailyFilterActive(true);
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => new Date(prev.getTime() + 86400000));
    setIsDailyFilterActive(true);
  };

  const handleToggleDailyFilter = () => {
    setIsDailyFilterActive(!isDailyFilterActive);
  };

  // Firestore real-time listener
  useEffect(() => {
    const entId = enterpriseId || 'enterprise-cool-car';
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
            setJobSheets(list);
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
      // Date filter if active
      if (isDailyFilterActive) {
        const jobDateStr = typeof job.date === 'string' ? job.date.slice(0, 10) : '';
        const curDateStr = selectedDate.toISOString().slice(0, 10);
        if (jobDateStr && jobDateStr !== curDateStr) return false;
      }

      const matchesTab = activeTab === 'ALL' || job.status === activeTab;
      if (!matchesTab) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const numMatch = job.jobNumber?.toLowerCase().includes(q);
      const vehMatch = job.vehicleNumber?.toLowerCase().includes(q) || job.vehicleModel?.toLowerCase().includes(q);
      const custMatch = job.customerName?.toLowerCase().includes(q) || job.customerPhone?.includes(q);
      return Boolean(numMatch || vehMatch || custMatch);
    });
  }, [jobSheets, activeTab, searchQuery, isDailyFilterActive, selectedDate]);

  const handlePrintItem = async (item: JobSheet, e: any) => {
    e?.stopPropagation?.();
    const services = ((item as any)?.items || [])
      .filter((it: any) => it.type === 'SERVICE')
      .map((it: any) => it.name);

    const parts = ((item as any)?.items || [])
      .filter((it: any) => it.type === 'PART')
      .map((it: any) => ({
        name: it.name,
        qty: it.quantity,
        price: it.unitPrice,
      }));

    try {
      await printJobCard({
        jobNumber: item.jobNumber || item.id,
        date: typeof item.date === 'string' ? item.date : new Date(item.date).toLocaleDateString('en-IN'),
        time: item.time,
        customerName: item.customerName,
        customerPhone: item.customerPhone,
        vehicleNumber: item.vehicleNumber,
        vehicleMake: item.vehicleMake,
        vehicleModel: item.vehicleModel,
        workCategory: item.workCategory,
        assignedMechanicName: item.assignedMechanicName,
        demandedWork: services.length > 0 ? services : undefined,
        workDone: services,
        partsInUse: parts,
        routineCheckup: (item as any).routineCheckup,
        notes: (item as any).notes,
        subtotal: item.subtotal,
        discount: item.discount,
        finalAmount: item.finalAmount,
        totalPaid: item.totalPaid,
        pendingAmount: item.pendingAmount,
        paymentStatus: item.paymentStatus,
        currencySymbol,
      });
    } catch (err) {
      console.log('[PrintCard] error:', err);
    }
  };

  // Render Job Card exactly styled like Screen 9 in Ref Photo
  const renderJobCard = ({ item }: { item: JobSheet }) => {
    const isPaid = (item.pendingAmount ?? 0) === 0 && (item.totalPaid ?? 0) > 0;
    const isPending = (item.pendingAmount ?? 0) > 0;

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => router.push(`/job-sheets/${item.id}` as any)}
        style={[
          styles.cardContainer,
          {
            backgroundColor: isDark ? '#101927' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
          },
        ]}
      >
        <View style={styles.cardContentRow}>
          {/* Left Avatar Icon & Job Details */}
          <View style={styles.cardLeftGroup}>
            {/* Circular Car Badge */}
            <View
              style={[
                styles.cardAvatar,
                { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
              ]}
            >
              <Car size={20} color={isDark ? '#60A5FA' : '#2563EB'} />
            </View>

            {/* Information Texts */}
            <View style={styles.cardInfo}>
              <View style={styles.jobNumberRow}>
                <Text style={[styles.cardJobNumber, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  {item.jobNumber || '#CCG-0000'}
                </Text>
                {item.workCategory && (
                  <View style={styles.miniCategoryBadge}>
                    <Text style={styles.miniCategoryText}>
                      {item.workCategory === 'AC' ? 'AC' : 'Mech'}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={[styles.cardVehicleName, { color: isDark ? '#CBD5E1' : '#334155' }]} numberOfLines={1}>
                {item.vehicleModel || item.vehicleMake || 'Vehicle'}
              </Text>

              <Text style={styles.cardCustomerName} numberOfLines={1}>
                Customer: {item.customerName || 'Walk-in'}
              </Text>
            </View>
          </View>

          {/* Right Amount & Status Badge (Screen 9 in Ref Photo) */}
          <View style={styles.cardRightGroup}>
            <Text style={[styles.cardAmount, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {formatCurrency(item.finalAmount || 0, currencySymbol)}
            </Text>

            {/* Soft Status Pill Badge */}
            <View
              style={[
                styles.cardStatusBadge,
                isPaid
                  ? styles.statusPaid
                  : isPending
                  ? styles.statusPending
                  : styles.statusNeutral,
              ]}
            >
              <Text
                style={[
                  styles.cardStatusText,
                  isPaid
                    ? styles.statusTextPaid
                    : isPending
                    ? styles.statusTextPending
                    : styles.statusTextNeutral,
                ]}
              >
                {isPaid ? 'Paid' : isPending ? 'Pending' : 'Open'}
              </Text>
            </View>

            {/* Quick Print Button */}
            <TouchableOpacity
              onPress={(e) => handlePrintItem(item, e)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.cardPrintButton}
            >
              <Printer size={13} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const pageBg = isDark ? '#070A0F' : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={pageBg} />

      {/* Top Header: Back Arrow, Title "Daily Job Sheet" (Screen 9 in Ref Photo) */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBackButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Daily Job Sheet
          </Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Date Navigator Slider (< 15 May 2025 >) matching Screen 9 */}
        <View style={styles.dateNavigatorContainer}>
          <TouchableOpacity
            onPress={handlePrevDay}
            style={[styles.dateArrowButton, { backgroundColor: isDark ? '#141926' : '#F8FAFC' }]}
          >
            <ChevronLeft size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleToggleDailyFilter}
            style={[
              styles.dateCenterBadge,
              { backgroundColor: isDailyFilterActive ? (isDark ? '#1E293B' : '#EFF6FF') : (isDark ? '#141926' : '#F8FAFC') },
            ]}
          >
            <Calendar size={14} color={isDailyFilterActive ? '#2563EB' : '#64748B'} />
            <Text
              style={[
                styles.dateCenterText,
                { color: isDailyFilterActive ? '#2563EB' : (isDark ? '#FFFFFF' : '#0F172A') },
              ]}
            >
              {formattedDateStr}
            </Text>
            {isDailyFilterActive ? (
              <Text style={styles.dateFilterLabel}>• Active</Text>
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNextDay}
            style={[styles.dateArrowButton, { backgroundColor: isDark ? '#141926' : '#F8FAFC' }]}
          >
            <ChevronRight size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>
        </View>

        {/* Search Input Bar */}
        <View style={[styles.searchBar, { backgroundColor: isDark ? '#141926' : '#F8FAFC' }]}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search job #, vehicle, customer..."
            placeholderTextColor="#94A3B8"
            style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.searchClearText}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Status Filter Tabs (All, In Progress, Completed) */}
        <View style={styles.tabsRow}>
          {STATUS_TABS.map((tab) => {
            const isSelected = activeTab === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                onPress={() => setActiveTab(tab.value)}
                style={[
                  styles.tabButton,
                  isSelected && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    isSelected ? styles.tabTextActive : styles.tabTextInactive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Job Sheet List */}
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobCard}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyAvatar, { backgroundColor: isDark ? '#141926' : '#F1F5F9' }]}>
              <Car size={32} color="#94A3B8" />
            </View>
            <Text style={[styles.emptyTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              No Job Sheets Found
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || isDailyFilterActive
                ? 'No matching job sheets for this date or search.'
                : 'Create your first job sheet to track services, spare parts and customer billing.'}
            </Text>
            {isDailyFilterActive ? (
              <TouchableOpacity
                onPress={() => setIsDailyFilterActive(false)}
                style={styles.showAllDatesBtn}
              >
                <Text style={styles.showAllDatesText}>Show All Dates</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }
      />

      {/* Floating Bottom Button: "+ New Job Sheet" (Screen 9 in Ref Photo) */}
      <View style={[styles.bottomButtonWrapper, { bottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          onPress={() => router.push('/job-sheets/create')}
          activeOpacity={0.88}
          style={styles.floatingNewButton}
        >
          <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.floatingNewButtonText}>+ New Job Sheet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  dateNavigatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  dateArrowButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateCenterBadge: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateCenterText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dateFilterLabel: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  searchClearText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButtonActive: {
    backgroundColor: '#0C1829',
    borderColor: '#0C1829',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabTextInactive: {
    color: '#64748B',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  cardContainer: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  jobNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardJobNumber: {
    fontSize: 14,
    fontWeight: '800',
  },
  miniCategoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  miniCategoryText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  cardVehicleName: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  cardCustomerName: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  cardRightGroup: {
    alignItems: 'flex-end',
    gap: 4,
    marginLeft: 8,
  },
  cardAmount: {
    fontSize: 15,
    fontWeight: '900',
  },
  cardStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPaid: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusNeutral: {
    backgroundColor: '#F1F5F9',
  },
  cardStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextPaid: {
    color: '#15803D',
  },
  statusTextPending: {
    color: '#B45309',
  },
  statusTextNeutral: {
    color: '#475569',
  },
  cardPrintButton: {
    padding: 3,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  showAllDatesBtn: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  showAllDatesText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  bottomButtonWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  floatingNewButton: {
    backgroundColor: '#0C1829', // Exact Midnight Navy from Screen 9
    paddingVertical: 15,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0C1829',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  floatingNewButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
