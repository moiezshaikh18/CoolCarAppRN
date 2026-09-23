// ============================================================
// Inventory & Spare Parts Screen — Cool Car Workshop
// Module 4: Daily Inward Purchase Chalans & Parts Catalog
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Plus,
  Package,
  AlertTriangle,
  ChevronRight,
  FileSpreadsheet,
  Car,
  Receipt,
  Store,
  CheckCircle2,
  Clock,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useInventoryStore } from '../../src/store/inventoryStore';
import { useChalanStore } from '../../src/store/chalanStore';
import { formatCurrency } from '../../src/utils/currency';
import { SparePart } from '../../src/types/inventory.types';
import { PurchaseChalan } from '../../src/types/chalan.types';

export default function InventoryScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();

  const { parts } = useInventoryStore();
  const { chalans } = useChalanStore();

  const [mainTab, setMainTab] = useState<'CHALANS' | 'CATALOG'>('CHALANS');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered Chalans
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
            it.assignedVehicleNumber.toLowerCase().includes(q)
        )
    );
  }, [chalans, searchQuery]);

  // Filtered Parts
  const filteredParts = useMemo(() => {
    if (!searchQuery.trim()) return parts;
    const q = searchQuery.toLowerCase();
    return parts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.partNumber && p.partNumber.toLowerCase().includes(q))
    );
  }, [parts, searchQuery]);

  const canvasBg = isDark ? '#070A0F' : '#6B9FE8';
  const sheetBg = isDark ? '#111622' : '#FFFFFF';
  const cardBg = isDark ? '#182030' : '#F8FAFD';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.06)';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';

  const renderChalanCard = ({ item }: { item: PurchaseChalan }) => {
    const isFullyPaid = item.pendingAmount <= 0;
    const isPartial = item.amountPaid > 0 && item.pendingAmount > 0;

    return (
      <View
        style={{
          backgroundColor: cardBg,
          borderRadius: 24,
          padding: 18,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: cardBorder,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 2,
        }}
      >
        {/* Top: Chalan No, Vendor & Status */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 17, fontWeight: '900', color: textPrimary }}>
                {item.chalanNumber}
              </Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                  backgroundColor: '#6B9FE8',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>
                  {item.items.length} {item.items.length === 1 ? 'part' : 'parts'}
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B9FE8', marginTop: 2 }}>
              {item.vendorName}
            </Text>
          </View>

          {/* Status Badge */}
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
              backgroundColor: isFullyPaid
                ? 'rgba(0, 200, 150, 0.15)'
                : isPartial
                ? 'rgba(245, 158, 11, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '900',
                color: isFullyPaid ? '#00C896' : isPartial ? '#F59E0B' : '#EF4444',
              }}
            >
              {isFullyPaid ? 'Paid' : isPartial ? 'Partial Paid' : 'Pending'}
            </Text>
          </View>
        </View>

        {/* Date, Time & Bank Account */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: textMuted }}>
            {item.date} • {item.time}
          </Text>
          {item.bankAccountName && (
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B' }}>
              • {item.paymentMode} ({item.bankAccountName})
            </Text>
          )}
        </View>

        {/* Itemized Parts with Multi-Vehicle Tags */}
        <View
          style={{
            backgroundColor: isDark ? '#111622' : '#FFFFFF',
            borderRadius: 16,
            padding: 12,
            borderWidth: 1,
            borderColor: cardBorder,
            marginBottom: 12,
            gap: 8,
          }}
        >
          {item.items.map((part, idx) => (
            <View
              key={part.id || idx}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 2,
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary }} numberOfLines={1}>
                  {part.partName} <Text style={{ color: textMuted, fontWeight: '500' }}>({part.quantity}x)</Text>
                </Text>

                {/* Car Tag Capsule */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Car size={11} color="#6B9FE8" />
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#6B9FE8' }}>
                    {part.assignedVehicleNumber}
                  </Text>
                </View>
              </View>

              <Text style={{ fontSize: 13, fontWeight: '800', color: textPrimary }}>
                ₹{part.totalPrice.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Financial Footer */}
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
          <View>
            <Text style={{ fontSize: 11, fontWeight: '600', color: textMuted }}>
              Chalan Total
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '900', color: textPrimary }}>
              ₹{item.totalAmount.toLocaleString()}
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: isFullyPaid ? '#00C896' : '#EF4444' }}>
              {isFullyPaid ? 'Settled Full' : `Due: ₹${item.pendingAmount.toLocaleString()}`}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#00C896' }}>
              Paid: ₹{item.amountPaid.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPartCard = ({ item }: { item: SparePart }) => {
    const isLow = item.stockQuantity <= item.minimumStock;
    const isOut = item.stockQuantity <= 0;

    return (
      <View
        style={{
          backgroundColor: cardBg,
          borderRadius: 24,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: cardBorder,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={{ color: textPrimary, fontSize: 15, fontWeight: '800' }}>
              {item.name}
            </Text>
            {item.partNumber && (
              <Text style={{ color: textMuted, fontSize: 11, fontWeight: '700', marginTop: 2 }}>
                SKU: {item.partNumber}
              </Text>
            )}
          </View>

          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 10,
              backgroundColor: isOut ? '#EF4444' : isLow ? '#F59E0B' : '#00C896',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
              {item.stockQuantity} {item.unit || 'pcs'}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? '#111622' : '#FFFFFF',
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: textMuted }}>
            Cost: ₹{item.purchasePrice}
          </Text>
          <Text style={{ fontSize: 13, fontWeight: '800', color: textPrimary }}>
            Selling: ₹{item.sellingPrice}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      <StatusBar barStyle="light-content" />

      {/* Sky Blue Header */}
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeft size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View>
              <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900', letterSpacing: -0.4 }}>
                Spare Parts & Chalans
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' }}>
                Cool Car Workshop Inventory
              </Text>
            </View>
          </View>

          {/* Quick Add Button */}
          <TouchableOpacity
            onPress={() => {
              if (mainTab === 'CHALANS') router.push('/inventory/chalan-add');
              else router.push('/inventory/add');
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isDark ? '#FFFFFF' : '#0C1829',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Plus size={20} color={isDark ? '#0C1829' : '#FFFFFF'} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#141926' : 'rgba(255,255,255,0.25)',
            borderRadius: 20,
            paddingHorizontal: 14,
            height: 44,
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Search size={16} color={isDark ? '#94A3B8' : 'rgba(255,255,255,0.85)'} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={mainTab === 'CHALANS' ? 'Search by chalan no, vendor, or car...' : 'Search parts by name...'}
            placeholderTextColor={isDark ? '#64748B' : 'rgba(255,255,255,0.7)'}
            style={{ flex: 1, color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}
          />
        </View>

        {/* Tab Switcher: Inward Purchase Chalans vs Catalog */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: isDark ? '#141926' : 'rgba(255,255,255,0.22)',
            borderRadius: 22,
            padding: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => setMainTab('CHALANS')}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 18,
              backgroundColor: mainTab === 'CHALANS' ? (isDark ? '#FFFFFF' : '#0C1829') : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '800',
                color: mainTab === 'CHALANS' ? (isDark ? '#0C1829' : '#FFFFFF') : '#FFFFFF',
              }}
            >
              Daily Purchase Chalans ({chalans.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMainTab('CATALOG')}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 18,
              backgroundColor: mainTab === 'CATALOG' ? (isDark ? '#FFFFFF' : '#0C1829') : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '800',
                color: mainTab === 'CATALOG' ? (isDark ? '#0C1829' : '#FFFFFF') : '#FFFFFF',
              }}
            >
              Parts Stock ({parts.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Curved Lower Sheet */}
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
        {mainTab === 'CHALANS' ? (
          <FlatList
            data={filteredChalans}
            keyExtractor={(item) => item.id}
            renderItem={renderChalanCard}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110, paddingTop: 6 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 10 }}>
                <Receipt size={40} color={textMuted} />
                <Text style={{ color: textPrimary, fontSize: 16, fontWeight: '800' }}>
                  No Purchase Chalans Found
                </Text>
                <Text style={{ color: textMuted, fontSize: 13, textAlign: 'center' }}>
                  Record inward spare parts chalan for vehicles or workshop stock
                </Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={filteredParts}
            keyExtractor={(item) => item.id}
            renderItem={renderPartCard}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110, paddingTop: 6 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 10 }}>
                <Package size={40} color={textMuted} />
                <Text style={{ color: textPrimary, fontSize: 16, fontWeight: '800' }}>
                  No Parts in Catalog
                </Text>
              </View>
            }
          />
        )}

        {/* Floating Bottom CTA for New Inward Chalan */}
        {mainTab === 'CHALANS' && (
          <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
            <TouchableOpacity
              onPress={() => router.push('/inventory/chalan-add')}
              activeOpacity={0.88}
              style={{
                backgroundColor: isDark ? '#FFFFFF' : '#0C1829',
                paddingVertical: 16,
                borderRadius: 32,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 5 },
                elevation: 6,
              }}
            >
              <Plus size={20} color={isDark ? '#0C1829' : '#FFFFFF'} strokeWidth={2.5} />
              <Text style={{ color: isDark ? '#0C1829' : '#FFFFFF', fontSize: 16, fontWeight: '900' }}>
                New Inward Purchase Chalan
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
