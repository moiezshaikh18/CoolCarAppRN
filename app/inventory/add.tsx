// ============================================================
// Add Spare Part Screen — Form for registering stock & pricing
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { useInventoryStore } from '../../src/store/inventoryStore';
import { SparePart } from '../../src/types/inventory.types';

const POPULAR_UNITS = ['Pcs', 'Litre', 'Can', 'Set', 'Bottle', 'Box', 'Kg'];

export default function AddSparePartScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { addPart } = useInventoryStore();

  const [name, setName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [unit, setUnit] = useState('Pcs');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [minimumStock, setMinimumStock] = useState('3');
  const [supplierName, setSupplierName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter part name (e.g. Bosch Oil Filter)');
      return;
    }
    const sellPriceNum = parseFloat(sellingPrice);
    if (isNaN(sellPriceNum) || sellPriceNum < 0) {
      Alert.alert('Required', 'Please enter a valid selling price');
      return;
    }

    setLoading(true);
    const newPartId = `part-${Date.now()}`;
    const entId = enterpriseId || 'enterprise-dev-001';

    const partObj: SparePart = {
      id: newPartId,
      enterpriseId: entId,
      name: name.trim(),
      partNumber: partNumber.trim() ? partNumber.trim().toUpperCase() : undefined,
      unit,
      purchasePrice: parseFloat(purchasePrice) || 0,
      sellingPrice: sellPriceNum,
      stockQuantity: parseInt(stockQuantity, 10) || 0,
      minimumStock: parseInt(minimumStock, 10) || 3,
      supplierName: supplierName.trim() || undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      const partRef = doc(db, 'enterprises', entId, 'inventory', newPartId);
      await setDoc(partRef, partObj);
    } catch (err) {
      console.log('[AddSparePart] Firestore sync error/offline:', err);
    }

    addPart(partObj);
    setLoading(false);

    Alert.alert('Success', `${name} registered in inventory!`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Symmetrical Top Header */}
        <View
          style={{
            paddingTop: insets.top + 14,
            paddingHorizontal: 22,
            paddingBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
          }}
        >
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
              Add Spare Part
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
              Catalog item & inventory stock tracking
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, gap: 18 }}>
          <GlassCard variant="sand" padding={22} style={{ borderRadius: 28, gap: 16 }}>
            {/* Part Name */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                PART / ITEM NAME *
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Bosch Front Brake Pads"
                placeholderTextColor={theme.textMuted}
                style={{
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  paddingHorizontal: 16,
                  height: 54,
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: '600',
                }}
              />
            </View>

            {/* Part Number & Unit */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  SKU / PART # (OPTIONAL)
                </Text>
                <TextInput
                  value={partNumber}
                  onChangeText={(val) => setPartNumber(val.toUpperCase())}
                  placeholder="e.g. BP-HY-22"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="characters"
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    paddingHorizontal: 16,
                    height: 54,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  UNIT
                </Text>
                <TextInput
                  value={unit}
                  onChangeText={setUnit}
                  placeholder="Pcs, Litre, Can"
                  placeholderTextColor={theme.textMuted}
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    paddingHorizontal: 16,
                    height: 54,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                  }}
                />
              </View>
            </View>

            {/* Quick Unit Selector Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {POPULAR_UNITS.map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => setUnit(u)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 16,
                    backgroundColor:
                      unit === u
                        ? (isDark ? '#FFFFFF' : '#121214')
                        : (isDark ? '#252B38' : '#FFFFFF'),
                  }}
                >
                  <Text
                    style={{
                      color: unit === u ? (isDark ? '#121214' : '#FFFFFF') : theme.textSecondary,
                      fontSize: 12,
                      fontWeight: '700',
                    }}
                  >
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Pricing: Purchase Cost & Selling Price */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  PURCHASE COST ({currencySymbol})
                </Text>
                <TextInput
                  value={purchasePrice}
                  onChangeText={setPurchasePrice}
                  placeholder="0.00"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    paddingHorizontal: 16,
                    height: 54,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '700',
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  SELLING PRICE * ({currencySymbol})
                </Text>
                <TextInput
                  value={sellingPrice}
                  onChangeText={setSellingPrice}
                  placeholder="0.00"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    paddingHorizontal: 16,
                    height: 54,
                    color: theme.text,
                    fontSize: 16,
                    fontWeight: '800',
                  }}
                />
              </View>
            </View>

            {/* Stock Quantity & Minimum Alert Threshold */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  OPENING STOCK
                </Text>
                <TextInput
                  value={stockQuantity}
                  onChangeText={setStockQuantity}
                  placeholder="e.g. 10"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    paddingHorizontal: 16,
                    height: 54,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  LOW STOCK ALERT AT
                </Text>
                <TextInput
                  value={minimumStock}
                  onChangeText={setMinimumStock}
                  placeholder="e.g. 3"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    paddingHorizontal: 16,
                    height: 54,
                    color: isDark ? '#FBBF24' : '#B45309',
                    fontSize: 15,
                    fontWeight: '800',
                  }}
                />
              </View>
            </View>

            {/* Supplier */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                SUPPLIER NAME (OPTIONAL)
              </Text>
              <TextInput
                value={supplierName}
                onChangeText={setSupplierName}
                placeholder="e.g. Shell Lubricants Distributor"
                placeholderTextColor={theme.textMuted}
                style={{
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  paddingHorizontal: 16,
                  height: 54,
                  color: theme.text,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              />
            </View>
          </GlassCard>

          {/* Solid Obsidian Black Pill Submit Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
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
            {loading ? (
              <ActivityIndicator color={isDark ? '#121214' : '#FFFFFF'} />
            ) : (
              <>
                <Check size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
                <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                  Save Part to Catalog
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
