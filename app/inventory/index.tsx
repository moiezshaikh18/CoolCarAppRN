// ============================================================
// Purchase Chalans Screen — Cool Car Workshop
// Simplified to track inward spare parts & monthly purchase totals
// (Parts stock/inventory section removed per user request)
// ============================================================

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useChalanStore } from '../../src/store/chalanStore';
import { useBankAccountStore } from '../../src/store/bankAccountStore';
import { formatCurrency } from '../../src/utils/currency';
import { PurchaseChalan } from '../../src/types/chalan.types';

export default function InventoryScreen() {
  const { isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { chalans, updateChalan, deleteChalan } = useChalanStore();
  const accounts = useBankAccountStore((s) => s.accounts);
  const activeAccounts = useMemo(() => accounts.filter((a) => a.isActive), [accounts]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleDeleteChalan = (id: string, chalanNum: string) => {
    Alert.alert(
      'Delete Chalan',
      `Are you sure you want to delete Chalan ${chalanNum}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteChalan(id),
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
    if (!searchQuery.trim()) return chalans;
    const q = searchQuery.toLowerCase();
    return chalans.filter(
      (c) =>
        c.chalanNumber.toLowerCase().includes(q) ||
        c.vendorName.toLowerCase().includes(q) ||
        c.items.some(
          (it) =>
            it.partName.toLowerCase().includes(q) ||
            (it.assignedVehicleNumber && it.assignedVehicleNumber.toLowerCase().includes(q))
        )
    );
  }, [chalans, searchQuery]);

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
      const updates = {
        amountPaid: newPaid,
        pendingAmount: newPending,
        paymentMode: payMode,
        bankAccountId: payMode !== 'CASH' ? selectedBankId : undefined,
        updatedAt: new Date().toISOString(),
      };

      if (typeof updateChalan === 'function') {
        updateChalan(selectedChalan.id, updates);
      }

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
    const isFullyPaid = item.pendingAmount <= 0;

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
                  {item.items.length} {item.items.length === 1 ? 'part' : 'parts'}
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
                {isFullyPaid ? 'Paid' : `Due: ${formatCurrency(item.pendingAmount, currencySymbol)}`}
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
          {item.items.map((part) => (
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
                Spare Parts Inward Purchases
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

        {/* Monthly Purchase Spend Card */}
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
          <Text style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 12, fontWeight: '600' }}>
            This Month Total Parts Purchases
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 }}>
              {formatCurrency(monthlyPurchaseTotal, currencySymbol)}
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 12, fontWeight: '700' }}>
              {chalans.length} Chalans
            </Text>
          </View>
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
            placeholder="Search by chalan #, vendor, or part..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={{ flex: 1, color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}
          />
        </View>
      </View>

      {/* Main Content Sheet with ZERO Blue Bleed */}
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
          data={filteredChalans}
          keyExtractor={(item) => item.id}
          renderItem={renderChalanCard}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 18, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Package size={36} color={isDark ? '#475569' : '#94A3B8'} />
              <Text style={{ fontSize: 15, fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', marginTop: 10 }}>
                No purchase chalans logged
              </Text>
              <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, textAlign: 'center' }}>
                Tap "+ Add" above to record an inward spare parts purchase chalan.
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
