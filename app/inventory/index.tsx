// ============================================================
// Inventory & Spare Parts Screen — Rules 14 & 15
// Low Stock Warnings & Parts Management
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
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
  AlertTriangle,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
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
      <View
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
                  paddingVertical: 3,
                  borderRadius: 8,
                  backgroundColor: isDark ? '#141926' : '#F1F5F9',
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
              borderRadius: 10,
              backgroundColor: isOut
                ? (isDark ? '#450A0A' : '#FEE2E2')
                : isLow
                ? (isDark ? '#3B2F04' : '#FEF3C7')
                : (isDark ? '#064E3B' : '#DCFCE7'),
            }}
          >
            <Text
              style={{
                color: isOut
                  ? (isDark ? '#F87171' : '#DC2626')
                  : isLow
                  ? (isDark ? '#FBBF24' : '#B45309')
                  : (isDark ? '#34D399' : '#15803D'),
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
            backgroundColor: isDark ? '#141926' : '#F8FAFC',
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 10,
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
      </View>
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
                Spare Parts
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
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

        {/* LOW STOCK ALERT BANNER (Rule 14 & 15) */}
        {lowStockItems.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => setActiveTab('LOW_STOCK')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 237, 213, 0.95)',
              borderRadius: 18,
              paddingHorizontal: 14,
              paddingVertical: 10,
              gap: 10,
              marginBottom: 12,
            }}
          >
            <AlertTriangle size={18} color="#C2410C" />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#9A3412', fontSize: 12, fontWeight: '800' }}>
                Low Stock Threshold ({lowStockItems.length} items)
              </Text>
              <Text style={{ color: '#C2410C', fontSize: 11, marginTop: 1 }}>
                Tap to view parts requiring immediate supplier order
              </Text>
            </View>
            <ChevronRight size={16} color="#9A3412" />
          </TouchableOpacity>
        )}

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
            placeholder="Search parts by name or SKU..."
            placeholderTextColor={isDark ? '#64748B' : 'rgba(255,255,255,0.7)'}
            style={{ flex: 1, color: '#FFFFFF', fontSize: 14, fontWeight: '500' }}
          />
        </View>

        {/* Capsule Filter Tabs */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('ALL')}
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: 20,
              backgroundColor: activeTab === 'ALL' ? '#0C1829' : 'rgba(255,255,255,0.2)',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: activeTab === 'ALL' ? '800' : '600' }}>
              All Parts ({displayParts.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('LOW_STOCK')}
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: 20,
              backgroundColor: activeTab === 'LOW_STOCK' ? '#0C1829' : 'rgba(255,255,255,0.2)',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: activeTab === 'LOW_STOCK' ? '800' : '600' }}>
              Low Stock ({lowStockItems.length})
            </Text>
          </TouchableOpacity>
        </View>
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
          data={filteredParts}
          keyExtractor={(item) => item.id}
          renderItem={renderPartCard}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110, paddingTop: 4 }}
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

        {/* Bottom Floating Midnight Navy CTA */}
        <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <TouchableOpacity
            onPress={() => router.push('/inventory/add')}
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
              Add New Spare Part
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
