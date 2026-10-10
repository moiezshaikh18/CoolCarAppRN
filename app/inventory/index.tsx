// ============================================================
// Purchase Chalans Screen — Cool Car Workshop
// Simplified to track inward spare parts & monthly purchase totals
// (Parts stock/inventory section removed per user request)
// ============================================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Plus,
  Package,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  Car,
  CreditCard,
  Banknote,
  QrCode,
  X,
  Trash2,
  Phone,
  Wrench,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useChalanStore } from '../../src/store/chalanStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { formatCurrency } from '../../src/utils/currency';
import { PurchaseChalan, DealerSummary } from '../../src/types/chalan.types';
import { aggregateDealerPurchases } from '../../src/services/dealer.service';

export default function InventoryScreen() {
  const { isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { chalans, updateChalan, deleteChalan, setChalans } = useChalanStore();
  const accounts = useBankAccountStore((s) => s.accounts);
  const activeAccounts = useMemo(() => accounts.filter((a) => a.isActive), [accounts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'CHALANS' | 'DEALERS'>('CHALANS');
  const [dealerDateRange, setDealerDateRange] = useState<'MONTH' | 'YEAR' | 'ALL'>('MONTH');

  // Live Firestore Sync for Chalans
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const fetchChalans = async () => {
      try {
        const entId = enterpriseId || 'enterprise-cool-car';
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');

        const chalanRef = collection(db, 'enterprises', entId, 'chalans');
        unsubscribe = onSnapshot(
          chalanRef,
          (snap) => {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
            list.sort((a, b) => {
              const timeA = new Date(a.createdAt || a.date || 0).getTime();
              const timeB = new Date(b.createdAt || b.date || 0).getTime();
              return timeB - timeA;
            });
            setChalans(list);
          },
          (err) => {
            console.log('[Chalans] Firestore sync notice:', err);
          }
        );
      } catch (err) {
        console.log('[Chalans] Firestore init notice:', err);
      }
    };
    fetchChalans();
    return () => unsubscribe?.();
  }, [enterpriseId, setChalans]);

  const handleDeleteChalan = (id: string, chalanNum: string) => {
    Alert.alert(
      'Delete Chalan',
      `Are you sure you want to delete Chalan ${chalanNum}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            deleteChalan(id);
            try {
              const entId = enterpriseId || 'enterprise-cool-car';
              const { doc, deleteDoc } = await import('firebase/firestore');
              const { db } = await import('../../src/services/firebase/firebase.config');
              await deleteDoc(doc(db, 'enterprises', entId, 'chalans', id));
            } catch (err) {
              console.log('[DeleteChalan] Firestore delete notice:', err);
            }
          },
        },
      ]
    );
  };

  // Clear Due Modal State
  const [selectedChalan, setSelectedChalan] = useState<PurchaseChalan | null>(null);
  const [isClearDueModalOpen, setIsClearDueModalOpen] = useState(false);
  const [payingAmountStr, setPayingAmountStr] = useState('');
  const [payMode, setPayMode] = useState<'CASH' | 'UPI' | 'CARD_SWIPE'>('CASH');
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate Current Month Total Purchases
  const monthlyPurchaseTotal = useMemo(() => {
    return chalans.reduce((acc, c) => acc + (c.totalAmount || 0), 0);
  }, [chalans]);

  // Filtered Chalans by search query
  const filteredChalans = useMemo(() => {
    if (!Array.isArray(chalans)) return [];
    if (!searchQuery.trim()) return chalans;
    const q = searchQuery.toLowerCase().trim();
    return chalans.filter((c) => {
      const numMatch = c.chalanNumber ? c.chalanNumber.toLowerCase().includes(q) : false;
      const vendorMatch = c.vendorName ? c.vendorName.toLowerCase().includes(q) : false;
      const itemMatch = Array.isArray(c.items)
        ? c.items.some(
            (it) =>
              (it.partName && it.partName.toLowerCase().includes(q)) ||
              (it.assignedVehicleNumber && it.assignedVehicleNumber.toLowerCase().includes(q))
          )
        : false;
      return numMatch || vendorMatch || itemMatch;
    });
  }, [chalans, searchQuery]);

  // Aggregate Dealer Purchases based on Selected Date Range (Month / Year / All Time)
  const dealerSummaries = useMemo(() => {
    const now = new Date();
    let start: string | undefined = undefined;
    let end: string | undefined = undefined;

    if (dealerDateRange === 'MONTH') {
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      start = `${yr}-${mo}-01`;
    } else if (dealerDateRange === 'YEAR') {
      start = `${now.getFullYear()}-01-01`;
    }

    return aggregateDealerPurchases(chalans, start, end);
  }, [chalans, dealerDateRange]);

  // Filtered Dealers by Search Query
  const filteredDealers = useMemo(() => {
    if (!searchQuery.trim()) return dealerSummaries;
    const q = searchQuery.toLowerCase().trim();
    return dealerSummaries.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.phone && d.phone.includes(q)) ||
        (d.purchasedParts && d.purchasedParts.some((p) => p.toLowerCase().includes(q)))
    );
  }, [dealerSummaries, searchQuery]);

  const dealerPeriodPurchases = useMemo(() => {
    return filteredDealers.reduce((sum, d) => sum + d.totalPurchases, 0);
  }, [filteredDealers]);

  const dealerPeriodDue = useMemo(() => {
    return filteredDealers.reduce((sum, d) => sum + d.totalPending, 0);
  }, [filteredDealers]);

  const handleOpenClearDue = (chalan: PurchaseChalan) => {
    setSelectedChalan(chalan);
    setPayingAmountStr(String(chalan.pendingAmount));
    setPayMode('CASH');
    if (activeAccounts.length > 0) {
      setSelectedBankId(activeAccounts[0].id);
    }
    setIsClearDueModalOpen(true);
  };

  const handleConfirmClearDue = async () => {
    if (!selectedChalan) return;
    const payingNow = parseFloat(payingAmountStr);
    if (isNaN(payingNow) || payingNow <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to pay.');
      return;
    }
    if (payingNow > selectedChalan.pendingAmount) {
      Alert.alert('Amount Too High', `Amount cannot exceed remaining vendor due (${formatCurrency(selectedChalan.pendingAmount, currencySymbol)}).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const newPaid = (selectedChalan.amountPaid || 0) + payingNow;
      const newPending = Math.max(0, selectedChalan.pendingAmount - payingNow);
      const updates: Record<string, any> = {
        amountPaid: newPaid,
        pendingAmount: newPending,
        paymentMode: payMode,
        updatedAt: new Date().toISOString(),
      };
      if (payMode !== 'CASH' && selectedBankId) {
        updates.bankAccountId = selectedBankId;
      }

      updateChalan(selectedChalan.id, updates);

      // Cloud Firestore sync
      const entId = enterpriseId || 'enterprise-cool-car';
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      await setDoc(doc(db, 'enterprises', entId, 'chalans', selectedChalan.id), updates, { merge: true });

      setIsClearDueModalOpen(false);
      Alert.alert(
        'Due Cleared ✓',
        `Paid ${formatCurrency(payingNow, currencySymbol)} to ${selectedChalan.vendorName}.\nRemaining Due: ${formatCurrency(newPending, currencySymbol)}`
      );
    } catch (err) {
      console.log('Error clearing chalan due:', err);
      Alert.alert('Updated Locally', 'Saved in app memory.');
      setIsClearDueModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canvasBg = isDark ? '#0A0D14' : '#153580';
  const sheetBg = isDark ? '#0A0D14' : '#F4F6F9';
  const cardBg = isDark ? '#141824' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.08)';

  const renderChalanCard = ({ item }: { item: PurchaseChalan }) => {
    const isFullyPaid = (item.pendingAmount || 0) <= 0;
    const safeItems = Array.isArray(item.items) ? item.items : [];

    return (
      <View
        style={{
          backgroundColor: cardBg,
          borderRadius: 22,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: cardBorder,
          shadowColor: '#000',
          shadowOpacity: 0.03,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Header: Chalan No, Vendor & Status */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                {item.chalanNumber}
              </Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                  backgroundColor: isDark ? '#1C2538' : '#EFF6FF',
                }}
              >
                <Text style={{ color: '#153580', fontSize: 10, fontWeight: '800' }}>
                  {safeItems.length} {safeItems.length === 1 ? 'part' : 'parts'}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
              <Building2 size={12} color={isDark ? '#94A3B8' : '#64748B'} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#93C5FD' : '#153580' }}>
                {item.vendorName}
              </Text>
            </View>
          </View>

          {/* Paid / Due Badge & Delete Action */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: isFullyPaid
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
              }}
            >
              <Text
                style={{
                  color: isFullyPaid ? '#10B981' : '#EF4444',
                  fontSize: 11,
                  fontWeight: '800',
                }}
              >
                {isFullyPaid ? 'Paid' : `Due: ${formatCurrency(item.pendingAmount || 0, currencySymbol)}`}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handleDeleteChalan(item.id, item.chalanNumber)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                padding: 6,
                borderRadius: 10,
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trash2 size={13} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* List of Purchased Items in this Chalan */}
        <View
          style={{
            backgroundColor: isDark ? '#1A2234' : '#F8FAFC',
            borderRadius: 14,
            padding: 10,
            marginBottom: 10,
            gap: 6,
          }}
        >
          {safeItems.map((part) => (
            <View
              key={part.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#F1F5F9' : '#1E293B' }}>
                  • {part.partName} <Text style={{ color: '#64748B', fontWeight: '500' }}>x{part.quantity}</Text>
                </Text>
                {part.assignedVehicleNumber && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 }}>
                    <Car size={10} color="#64748B" />
                    <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '600' }}>
                      For {part.assignedVehicleNumber}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                {formatCurrency(part.totalPrice, currencySymbol)}
              </Text>
            </View>
          ))}
        </View>

        {/* Chalan Footer */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: cardBorder,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Calendar size={12} color="#64748B" />
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>Total:</Text>
            <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
              {formatCurrency(item.totalAmount, currencySymbol)}
            </Text>
          </View>
        </View>

        {/* Clear Due Button if vendor balance is pending */}
        {item.pendingAmount > 0 && (
          <TouchableOpacity
            onPress={() => handleOpenClearDue(item)}
            activeOpacity={0.85}
            style={{
              marginTop: 10,
              backgroundColor: '#153580',
              borderRadius: 14,
              paddingVertical: 10,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <CreditCard size={15} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
              Clear Due / Pay Vendor ({formatCurrency(item.pendingAmount, currencySymbol)})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderDealerCard = ({ item }: { item: DealerSummary }) => {
    const isSettled = item.totalPending <= 0;

    return (
      <View
        style={{
          backgroundColor: cardBg,
          borderRadius: 22,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: cardBorder,
          shadowColor: '#000',
          shadowOpacity: 0.03,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Dealer Header: Name, Phone & Status */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Building2 size={16} color={isDark ? '#60A5FA' : '#153580'} />
              <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                {item.name}
              </Text>
            </View>

            {item.phone ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Phone size={11} color="#64748B" />
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748B' }}>
                  {item.phone}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Pending Due / Cleared Badge */}
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
              backgroundColor: isSettled
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            }}
          >
            <Text
              style={{
                color: isSettled ? '#10B981' : '#EF4444',
                fontSize: 11,
                fontWeight: '800',
              }}
            >
              {isSettled ? '✓ Cleared' : `Due: ${formatCurrency(item.totalPending, currencySymbol)}`}
            </Text>
          </View>
        </View>

        {/* Purchase Metrics Breakdown */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: isDark ? '#1A2234' : '#F8FAFC',
            borderRadius: 14,
            padding: 12,
            marginBottom: 10,
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
              Total Purchases
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 2 }}>
              {formatCurrency(item.totalPurchases, currencySymbol)}
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
              Paid Amount
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '900', color: '#10B981', marginTop: 2 }}>
              {formatCurrency(item.totalPaid, currencySymbol)}
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
              Chalans
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '900', color: '#7C3AED', marginTop: 2 }}>
              {item.chalanCount} Orders
            </Text>
          </View>
        </View>

        {/* Purchased Parts List */}
        {item.purchasedParts && item.purchasedParts.length > 0 && (
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <Wrench size={11} color="#64748B" />
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B' }}>
                Goods / Parts Purchased ({item.purchasedParts.length}):
              </Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {item.purchasedParts.map((part, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: isDark ? '#242834' : '#EEF2F6',
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: isDark ? '#E2E8F0' : '#334155' }}>
                    {part}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Card Footer */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: cardBorder,
          }}
        >
          {item.lastPurchaseDate ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Calendar size={11} color="#64748B" />
              <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>
                Last Purchase: {item.lastPurchaseDate}
              </Text>
            </View>
          ) : <View />}

          <TouchableOpacity
            onPress={() => {
              setSearchQuery(item.name);
              setViewMode('CHALANS');
            }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
          >
            <Text style={{ fontSize: 11, fontWeight: '800', color: isDark ? '#60A5FA' : '#153580' }}>
              View Chalans →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={canvasBg} />

      {/* Royal Blue Top Header */}
      <View
        style={{
          backgroundColor: canvasBg,
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 22,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeft size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View>
              <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900', letterSpacing: -0.4 }}>
                Purchase Chalans
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' }}>
                Spare Parts Inward Purchases & Khata
              </Text>
            </View>
          </View>

          {/* Quick Add Button */}
          <TouchableOpacity
            onPress={() => router.push('/inventory/chalan-add')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 16,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Plus size={16} color="#153580" strokeWidth={3} />
            <Text style={{ color: '#153580', fontSize: 12, fontWeight: '900' }}>
              + Add
            </Text>
          </TouchableOpacity>
        </View>

        {/* View Mode Toggle Pills */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            borderRadius: 16,
            padding: 3,
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setViewMode('CHALANS')}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 13,
              backgroundColor: viewMode === 'CHALANS' ? '#FFFFFF' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '800',
                color: viewMode === 'CHALANS' ? '#153580' : 'rgba(255, 255, 255, 0.85)',
              }}
            >
              All Chalans ({chalans.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewMode('DEALERS')}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 13,
              backgroundColor: viewMode === 'DEALERS' ? '#FFFFFF' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '800',
                color: viewMode === 'DEALERS' ? '#153580' : 'rgba(255, 255, 255, 0.85)',
              }}
            >
              Dealer Purchases ({dealerSummaries.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Range Selector (When in Dealer Mode) */}
        {viewMode === 'DEALERS' && (
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
            {[
              { id: 'MONTH' as const, label: 'This Month' },
              { id: 'YEAR' as const, label: 'This Year' },
              { id: 'ALL' as const, label: 'All Time' },
            ].map((pill) => {
              const isSelected = dealerDateRange === pill.id;
              return (
                <TouchableOpacity
                  key={pill.id}
                  onPress={() => setDealerDateRange(pill.id)}
                  style={{
                    flex: 1,
                    paddingVertical: 6,
                    borderRadius: 12,
                    backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.14)',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '800',
                      color: isSelected ? '#153580' : 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    {pill.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Spend / Procurement Summary Card */}
        <View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderRadius: 20,
            padding: 14,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.15)',
          }}
        >
          <Text style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
            {viewMode === 'CHALANS'
              ? 'This Month Total Parts Purchases'
              : dealerDateRange === 'MONTH'
              ? 'This Month Dealer Procurement'
              : dealerDateRange === 'YEAR'
              ? 'This Year Dealer Procurement'
              : 'All-Time Dealer Procurement'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 }}>
              {formatCurrency(viewMode === 'CHALANS' ? monthlyPurchaseTotal : dealerPeriodPurchases, currencySymbol)}
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 12, fontWeight: '700' }}>
              {viewMode === 'CHALANS'
                ? `${chalans.length} Chalans`
                : `${filteredDealers.length} Active Dealers`}
            </Text>
          </View>
          {viewMode === 'DEALERS' && dealerPeriodDue > 0 && (
            <Text style={{ color: '#FCA5A5', fontSize: 11, fontWeight: '800', marginTop: 4 }}>
              Total Balance Due to Dealers: {formatCurrency(dealerPeriodDue, currencySymbol)}
            </Text>
          )}
        </View>

        {/* Search Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 16,
            paddingHorizontal: 14,
            height: 42,
            gap: 8,
          }}
        >
          <Search size={16} color="rgba(255,255,255,0.85)" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              viewMode === 'CHALANS'
                ? 'Search by chalan #, vendor, or part...'
                : 'Search dealer name, phone, or parts...'
            }
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={{ flex: 1, color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}
          />
        </View>
      </View>

      {/* Main Content Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          marginTop: -14,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
        }}
      >
        <FlatList
          data={viewMode === 'CHALANS' ? (filteredChalans as any[]) : (filteredDealers as any[])}
          keyExtractor={(item) => item.id}
          renderItem={viewMode === 'CHALANS' ? (renderChalanCard as any) : (renderDealerCard as any)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 18, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Package size={36} color={isDark ? '#475569' : '#94A3B8'} />
              <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', marginTop: 10 }}>
                {viewMode === 'CHALANS' ? 'No purchase chalans logged' : 'No dealer purchases found'}
              </Text>
              <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, textAlign: 'center' }}>
                {viewMode === 'CHALANS'
                  ? 'Tap "+ Add" above to record an inward spare parts purchase chalan.'
                  : 'Save chalans with dealer names to track purchases by month, year, or range.'}
              </Text>
            </View>
          }
        />
      </View>

      {/* Clear Vendor Due Modal */}
      <Modal
        visible={isClearDueModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsClearDueModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}
        >
          <View
            style={{
              backgroundColor: cardBg,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 20,
              paddingBottom: insets.bottom + 16,
              maxHeight: '85%',
              gap: 14,
            }}
          >
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  Clear Vendor Due
                </Text>
                <Text style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', marginTop: 2 }}>
                  {selectedChalan?.vendorName} • {selectedChalan?.chalanNumber}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsClearDueModalOpen(false)}
                style={{ padding: 6, borderRadius: 12, backgroundColor: isDark ? '#1C2538' : '#F1F5F9' }}
              >
                <X size={18} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ gap: 14, paddingBottom: 40 }}
            >
              {/* Due Overview Banner */}
              <View
                style={{
                  backgroundColor: isDark ? '#450A0A' : '#FEF2F2',
                  padding: 14,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#EF4444', textTransform: 'uppercase' }}>
                    Remaining Vendor Due
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: '900', color: '#EF4444', marginTop: 2 }}>
                    {formatCurrency(selectedChalan?.pendingAmount || 0, currencySymbol)}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748B' }}>Total Chalan:</Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                    {formatCurrency(selectedChalan?.totalAmount || 0, currencySymbol)}
                  </Text>
                </View>
              </View>

              {/* Amount Paying Now Input */}
              <View>
                <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', marginBottom: 6 }}>
                  Amount Paying Now:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: isDark ? '#1C2538' : '#F1F5F9',
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: cardBorder,
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: '900', color: '#153580', marginRight: 8 }}>₹</Text>
                  <TextInput
                    value={payingAmountStr}
                    onChangeText={setPayingAmountStr}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    style={{
                      flex: 1,
                      fontSize: 20,
                      fontWeight: '900',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                    }}
                  />
                </View>
              </View>

              {/* Payment Mode Selector */}
              <View>
                <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', marginBottom: 8 }}>
                  Payment Method:
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { mode: 'CASH' as const, label: 'Cash', icon: Banknote },
                    { mode: 'UPI' as const, label: 'UPI / Online', icon: QrCode },
                    { mode: 'CARD_SWIPE' as const, label: 'Bank / POS', icon: CreditCard },
                  ].map((item) => {
                    const isSelected = payMode === item.mode;
                    const ModeIcon = item.icon;
                    return (
                      <TouchableOpacity
                        key={item.mode}
                        onPress={() => setPayMode(item.mode)}
                        style={{
                          flex: 1,
                          paddingVertical: 10,
                          borderRadius: 14,
                          backgroundColor: isSelected ? '#153580' : (isDark ? '#1C2538' : '#F1F5F9'),
                          alignItems: 'center',
                          gap: 4,
                          borderWidth: 1,
                          borderColor: isSelected ? '#153580' : cardBorder,
                        }}
                      >
                        <ModeIcon size={15} color={isSelected ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B')} />
                        <Text style={{ fontSize: 11, fontWeight: '800', color: isSelected ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#475569') }}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Bank Account Selector (for UPI / Bank Transfer) */}
              {payMode !== 'CASH' && activeAccounts.length > 0 && (
                <View>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', marginBottom: 8 }}>
                    Paid From Bank Account:
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {activeAccounts.map((acc) => {
                      const isSelected = selectedBankId === acc.id;
                      return (
                        <TouchableOpacity
                          key={acc.id}
                          onPress={() => setSelectedBankId(acc.id)}
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 12,
                            backgroundColor: isSelected ? '#153580' : (isDark ? '#1C2538' : '#F1F5F9'),
                            borderWidth: 1,
                            borderColor: isSelected ? '#153580' : cardBorder,
                          }}
                        >
                          <Text style={{ fontSize: 11, fontWeight: '800', color: isSelected ? '#FFFFFF' : (isDark ? '#CBD5E1' : '#475569') }}>
                            {acc.bankName} {acc.accountNumber ? `(${acc.accountNumber.slice(-4)})` : ''}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Confirm Pay Button */}
              <TouchableOpacity
                onPress={handleConfirmClearDue}
                disabled={isSubmitting}
                activeOpacity={0.88}
                style={{
                  backgroundColor: '#10B981',
                  paddingVertical: 14,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 6,
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '900' }}>
                    Confirm Payment & Settle Due
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
