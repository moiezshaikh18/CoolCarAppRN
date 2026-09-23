// ============================================================
// Inventory & Spare Parts Screen — Rules 14 & 15
// Low Stock Warnings & Parts Management
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
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
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { useInventoryStore } from '../../src/store/inventoryStore';
import { formatCurrency } from '../../src/utils/currency';
import { SparePart } from '../../src/types/inventory.types';

const DEFAULT_PARTS: SparePart[] = [
  {
    id: 'part-001',
    enterpriseId: 'enterprise-dev-001',
    name: 'Castrol Magnatec 5W-30 (4L)',
    partNumber: 'CAS-5W30-4L',
    purchasePrice: 2200,
    sellingPrice: 3100,
    stockQuantity: 12,
    minimumStock: 4,
    unit: 'Can',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'part-002',
    enterpriseId: 'enterprise-dev-001',
    name: 'Front Brake Pads Set (Honda / Hyundai)',
    partNumber: 'BP-FRT-022',
    purchasePrice: 1800,
    sellingPrice: 2800,
    stockQuantity: 2,
    minimumStock: 5,
    unit: 'Set',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'part-003',
    enterpriseId: 'enterprise-dev-001',
    name: 'Bosch Oil Filter Spin-On',
    partNumber: 'OF-BSH-401',
    purchasePrice: 250,
    sellingPrice: 450,
    stockQuantity: 18,
    minimumStock: 6,
    unit: 'Pcs',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'part-004',
    enterpriseId: 'enterprise-dev-001',
    name: 'AC Gas R134a Canister',
    partNumber: 'GAS-R134-450G',
    purchasePrice: 950,
    sellingPrice: 1800,
    stockQuantity: 1,
    minimumStock: 3,
    unit: 'Can',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function InventoryScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { parts, setParts } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<'ALL' | 'LOW_STOCK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Firestore sync
  useEffect(() => {
    const entId = enterpriseId || 'enterprise-dev-001';
    let unsubscribe: () => void;

    async function subscribeParts() {
      try {
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');
        const invRef = collection(db, 'enterprises', entId, 'inventory');

        unsubscribe = onSnapshot(
          invRef,
          (snapshot) => {
            const list: SparePart[] = [];
            snapshot.forEach((doc) => {
              list.push({ id: doc.id, ...(doc.data() as any) });
            });
            if (list.length > 0) {
              setParts(list);
            } else if (parts.length === 0) {
              setParts(DEFAULT_PARTS);
            }
          },
          (err) => {
            console.log('[Inventory] listener error:', err);
            if (parts.length === 0) setParts(DEFAULT_PARTS);
          }
        );
      } catch (err) {
        console.log('[Inventory] setup error:', err);
        if (parts.length === 0) setParts(DEFAULT_PARTS);
      }
    }

    subscribeParts();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [enterpriseId]);

  const displayParts = parts.length > 0 ? parts : DEFAULT_PARTS;

  const filteredParts = useMemo(() => {
    return displayParts.filter((p) => {
      if (activeTab === 'LOW_STOCK' && p.stockQuantity > p.minimumStock) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.partNumber && p.partNumber.toLowerCase().includes(q))
      );
    });
  }, [displayParts, activeTab, searchQuery]);

  const lowStockItems = displayParts.filter((p) => p.stockQuantity <= p.minimumStock);

  const renderPartCard = ({ item }: { item: SparePart }) => {
    const isLow = item.stockQuantity <= item.minimumStock;
    const isOut = item.stockQuantity <= 0;
    const margin = item.sellingPrice - item.purchasePrice;
    const marginPercent = Math.round((margin / (item.sellingPrice || 1)) * 100);

    return (
      <GlassCard variant="sand" padding={18} style={{ borderRadius: 28, marginBottom: 14 }}>
        {/* Top: Name & SKU */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
              {item.name}
            </Text>
            {item.partNumber && (
              <View
                style={{
                  alignSelf: 'flex-start',
                  marginTop: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                }}
              >
                <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700' }}>
                  SKU: {item.partNumber}
                </Text>
              </View>
            )}
          </View>

          {/* Stock Badge */}
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
              backgroundColor: isOut
                ? (isDark ? '#7F1D1D' : '#FEE2E2')
                : isLow
                ? (isDark ? '#78350F' : '#FEF3C7')
                : (isDark ? '#064E3B' : '#DCFCE7'),
            }}
          >
            <Text
              style={{
                color: isOut
                  ? (isDark ? '#FCA5A5' : '#DC2626')
                  : isLow
                  ? (isDark ? '#FBBF24' : '#B45309')
                  : (isDark ? '#6EE7B7' : '#15803D'),
                fontSize: 11,
                fontWeight: '800',
              }}
            >
              {isOut
                ? 'Out of Stock'
                : isLow
                ? `Low: ${item.stockQuantity} ${item.unit || 'pcs'}`
                : `${item.stockQuantity} ${item.unit || 'pcs'} Available`}
            </Text>
          </View>
        </View>

        {/* Pricing Row */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? '#252B38' : '#FFFFFF',
            borderRadius: 18,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        >
          <View>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Cost Price</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, fontWeight: '700', marginTop: 2 }}>
              {formatCurrency(item.purchasePrice, currencySymbol)}
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Selling Price</Text>
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800', marginTop: 2 }}>
              {formatCurrency(item.sellingPrice, currencySymbol)}
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Margin</Text>
            <Text style={{ color: isDark ? '#34D399' : '#15803D', fontSize: 13, fontWeight: '800', marginTop: 2 }}>
              +{formatCurrency(margin, currencySymbol)} ({marginPercent}%)
            </Text>
          </View>
        </View>
      </GlassCard>
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
              Spare Parts
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
              {displayParts.length} catalog items
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/inventory/add')}
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

      {/* LOW STOCK ALERT BANNER (Rule 14 & 15) */}
      {lowStockItems.length > 0 && (
        <View style={{ paddingHorizontal: 22, marginBottom: 12 }}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => setActiveTab('LOW_STOCK')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#78350F' : '#FEF3C7',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 12,
              gap: 12,
            }}
          >
            <AlertTriangle size={20} color={isDark ? '#FBBF24' : '#B45309'} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: isDark ? '#FBBF24' : '#B45309', fontSize: 13, fontWeight: '800' }}>
                Low Stock Threshold ({lowStockItems.length} items)
              </Text>
              <Text style={{ color: isDark ? '#FDE68A' : '#92400E', fontSize: 12, marginTop: 1 }}>
                Tap to filter items requiring supplier re-order
              </Text>
            </View>
            <ChevronRight size={18} color={isDark ? '#FBBF24' : '#B45309'} />
          </TouchableOpacity>
        </View>
      )}

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
            placeholder="Search parts by name or SKU..."
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '500' }}
          />
        </View>
      </View>

      {/* Capsule Filter Tabs (Nestora active black / inactive sand) */}
      <View style={{ paddingHorizontal: 22, marginBottom: 16, flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          onPress={() => setActiveTab('ALL')}
          style={{
            flex: 1,
            paddingVertical: 11,
            borderRadius: 20,
            backgroundColor: activeTab === 'ALL' ? (isDark ? '#FFFFFF' : '#121214') : (isDark ? '#1C212B' : '#EFECE6'),
            alignItems: 'center',
          }}
        >
          <Text style={{ color: activeTab === 'ALL' ? (isDark ? '#121214' : '#FFFFFF') : theme.textMuted, fontSize: 13, fontWeight: '700' }}>
            All Parts ({displayParts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('LOW_STOCK')}
          style={{
            flex: 1,
            paddingVertical: 11,
            borderRadius: 20,
            backgroundColor: activeTab === 'LOW_STOCK' ? (isDark ? '#FFFFFF' : '#121214') : (isDark ? '#1C212B' : '#EFECE6'),
            alignItems: 'center',
          }}
        >
          <Text style={{ color: activeTab === 'LOW_STOCK' ? (isDark ? '#121214' : '#FFFFFF') : theme.textMuted, fontSize: 13, fontWeight: '700' }}>
            Low Stock ({lowStockItems.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Parts FlatList */}
      <FlatList
        data={filteredParts}
        keyExtractor={(item) => item.id}
        renderItem={renderPartCard}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 }}>
            <Package size={40} color={theme.textMuted} />
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
              No Spare Parts Found
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, textAlign: 'center' }}>
              {searchQuery ? 'Try matching a different keyword or SKU' : 'Add parts to manage stock and job sheet usage'}
            </Text>
          </View>
        }
      />

      {/* Bottom Floating Pill CTA Button */}
      <View style={{ position: 'absolute', bottom: 24, left: 22, right: 22 }}>
        <TouchableOpacity
          onPress={() => router.push('/inventory/add')}
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
            Add New Spare Part
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
