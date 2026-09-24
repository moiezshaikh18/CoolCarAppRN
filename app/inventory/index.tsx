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
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useChalanStore } from '../../src/store/chalanStore';
import { formatCurrency } from '../../src/utils/currency';
import { PurchaseChalan } from '../../src/types/chalan.types';

export default function InventoryScreen() {
  const { isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { chalans } = useChalanStore();

  const [searchQuery, setSearchQuery] = useState('');

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

          {/* Paid / Due Badge */}
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
    </View>
  );
}
