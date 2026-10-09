// ============================================================
// Screen 9: Daily Job Sheet — Master Job Cards & Date Slider
// Matches Reference Design:
// Back Arrow, Daily Date Slider (< 15 May 2025 >),
// Large, Legible Workshop Fonts & Clean Badges,
// Midnight Navy Floating Button "+ New Job Sheet"
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Linking,
  StatusBar,
  StyleSheet,
  Alert,
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
  CheckCircle2,
  Trash2,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { CalendarPickerModal } from '../../src/components/common/CalendarPickerModal';
import { formatCurrency } from '../../src/utils/currency';
import { JobSheet, JobStatus } from '../../src/types/jobSheet.types';
import { printJobCard } from '../../src/utils/jobCardPdf';

const STATUS_TABS: { label: string; value: JobStatus | 'ALL' }[] = [
  { label: 'All Jobs', value: 'ALL' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
];

type DateFilterMode = 'ALL' | 'TODAY' | 'YESTERDAY' | 'THIS_WEEK' | 'CUSTOM';

export default function JobSheetsScreen() {
  const { isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { jobSheets, setJobSheets, updateJobSheet, deleteJobSheet } = useJobSheetStore();

  const [activeTab, setActiveTab] = useState<JobStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Daily Date Navigation (< 15 May 2025 >) matching Screen 9
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateFilterMode, setDateFilterMode] = useState<DateFilterMode>('ALL');
  const [isDailyFilterActive, setIsDailyFilterActive] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
    setDateFilterMode('CUSTOM');
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => new Date(prev.getTime() + 86400000));
    setIsDailyFilterActive(true);
    setDateFilterMode('CUSTOM');
  };

  const handleToggleDailyFilter = () => {
    setIsDailyFilterActive(!isDailyFilterActive);
    if (!isDailyFilterActive) {
      setDateFilterMode('CUSTOM');
    } else {
      setDateFilterMode('ALL');
    }
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
  }, [enterpriseId, setJobSheets]);

  const [todayTimestamp] = useState(() => Date.now());

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    const todayStr = new Date(todayTimestamp).toISOString().slice(0, 10);
    const yesterdayDate = new Date(todayTimestamp - 86400000);
    const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);
    const sevenDaysAgoStr = new Date(todayTimestamp - 7 * 86400000).toISOString().slice(0, 10);

    return jobSheets.filter((job) => {
      const jobDateStr = typeof job.date === 'string' ? job.date.slice(0, 10) : '';

      if (dateFilterMode === 'TODAY') {
        if (jobDateStr !== todayStr) return false;
      } else if (dateFilterMode === 'YESTERDAY') {
        if (jobDateStr !== yesterdayStr) return false;
      } else if (dateFilterMode === 'THIS_WEEK') {
        if (jobDateStr < sevenDaysAgoStr) return false;
      } else if (dateFilterMode === 'CUSTOM' || isDailyFilterActive) {
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
  }, [jobSheets, activeTab, searchQuery, isDailyFilterActive, selectedDate, dateFilterMode, todayTimestamp]);

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

  const handleDeleteItem = (item: JobSheet, e?: any) => {
    e?.stopPropagation?.();
    Alert.alert(
      'Delete Job Sheet',
      `Are you sure you want to delete Job Sheet #${item.jobNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            deleteJobSheet(item.id);
            try {
              const entId = enterpriseId || 'enterprise-cool-car';
              const { doc, deleteDoc } = await import('firebase/firestore');
              const { db } = await import('../../src/services/firebase/firebase.config');
              await deleteDoc(doc(db, 'enterprises', entId, 'jobSheets', item.id));
            } catch (err) {
              console.log('[DeleteJobSheet] Firestore notice:', err);
            }
          },
        },
      ]
    );
  };

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
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.cardContentRow}>
          <View style={styles.cardLeftGroup}>
            <View
              style={[
                styles.cardAvatar,
                { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
              ]}
            >
              <Car size={22} color={isDark ? '#60A5FA' : '#2563EB'} />
            </View>

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

              <Text style={[styles.cardVehicleName, { color: isDark ? '#CBD5E1' : '#1E293B' }]} numberOfLines={1}>
                {item.vehicleModel || item.vehicleMake || 'Vehicle'}
              </Text>

              <Text style={styles.cardCustomerName} numberOfLines={1}>
                Customer: {item.customerName || 'Walk-in'}
              </Text>
            </View>
          </View>

          <View style={styles.cardRightGroup}>
            <Text style={[styles.cardAmount, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {formatCurrency(item.finalAmount || 0, currencySymbol)}
            </Text>

            <View
              style={[
                styles.cardStatusBadge,
                item.status === 'COMPLETED'
                  ? styles.statusPaid
                  : styles.statusNeutral,
              ]}
            >
              <Text
                style={[
                  styles.cardStatusText,
                  item.status === 'COMPLETED'
                    ? styles.statusTextPaid
                    : styles.statusTextNeutral,
                ]}
              >
                {item.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
              </Text>
            </View>

            {isPending && item.status === 'COMPLETED' ? (
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#F59E0B', marginTop: 1 }}>
                Due: {formatCurrency(item.pendingAmount ?? 0, currencySymbol)}
              </Text>
            ) : null}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <TouchableOpacity
                onPress={(e) => handleDeleteItem(item, e)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEE2E2',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trash2 size={14} color="#EF4444" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={(e) => handlePrintItem(item, e)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.cardPrintButton}
              >
                <Printer size={15} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const pageBg = isDark ? '#070A0F' : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={pageBg} />

      <View style={[styles.topHeader, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBackButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Daily Job Sheet
          </Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Quick Date Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 4, marginBottom: 10 }}
        >
          {[
            { id: 'ALL', label: 'All Jobs' },
            { id: 'TODAY', label: "Today's Jobs" },
            { id: 'YESTERDAY', label: 'Yesterday' },
            { id: 'THIS_WEEK', label: 'This Week' },
            { id: 'CUSTOM', label: isDailyFilterActive ? `📅 ${formattedDateStr}` : 'Pick Date 📅' },
          ].map((chip) => {
            const isSelected = dateFilterMode === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                onPress={() => {
                  if (chip.id === 'CUSTOM') {
                    setIsCalendarOpen(true);
                  } else {
                    setDateFilterMode(chip.id as DateFilterMode);
                    setIsDailyFilterActive(false);
                  }
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 14,
                  backgroundColor: isSelected ? (isDark ? '#FFFFFF' : '#153580') : (isDark ? '#141926' : '#F1F5F9'),
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '800',
                    color: isSelected ? (isDark ? '#0C1829' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'),
                  }}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.dateNavigatorContainer}>
          <TouchableOpacity
            onPress={handlePrevDay}
            style={[styles.dateArrowButton, { backgroundColor: isDark ? '#141926' : '#F8FAFC' }]}
          >
            <ChevronLeft size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsCalendarOpen(true)}
            style={[
              styles.dateCenterBadge,
              { backgroundColor: isDailyFilterActive ? (isDark ? '#1E293B' : '#EFF6FF') : (isDark ? '#141926' : '#F8FAFC') },
            ]}
          >
            <Calendar size={16} color={isDailyFilterActive ? '#2563EB' : '#475569'} />
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
            <ChevronRight size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchBar, { backgroundColor: isDark ? '#141926' : '#F8FAFC' }]}>
          <Search size={18} color="#94A3B8" />
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

      <CalendarPickerModal
        visible={isCalendarOpen}
        selectedDate={selectedDate.toISOString().slice(0, 10)}
        onSelectDate={(d) => {
          const parts = d.split('-');
          const parsed = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          setSelectedDate(parsed);
          setDateFilterMode('CUSTOM');
          setIsDailyFilterActive(true);
          setIsCalendarOpen(false);
        }}
        onClose={() => setIsCalendarOpen(false)}
      />

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
              <Car size={36} color="#94A3B8" />
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

      <View style={[styles.bottomButtonWrapper, { bottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          onPress={() => router.push('/job-sheets/create')}
          activeOpacity={0.88}
          style={styles.floatingNewButton}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
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
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  dateNavigatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  dateArrowButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateCenterBadge: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateCenterText: {
    fontSize: 15,
    fontWeight: '800',
  },
  dateFilterLabel: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  searchClearText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButtonActive: {
    backgroundColor: '#0C1829',
    borderColor: '#0C1829',
  },
  tabButtonText: {
    fontSize: 13,
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
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 15,
    fontWeight: '900',
  },
  miniCategoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  miniCategoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  cardVehicleName: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  cardCustomerName: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  cardRightGroup: {
    alignItems: 'flex-end',
    gap: 4,
    marginLeft: 8,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '900',
  },
  cardStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
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
    fontSize: 12,
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
    padding: 4,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
  },
  showAllDatesBtn: {
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  showAllDatesText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  bottomButtonWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  floatingNewButton: {
    backgroundColor: '#0C1829',
    paddingVertical: 16,
    borderRadius: 32,
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
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
