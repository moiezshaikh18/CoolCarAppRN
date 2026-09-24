// ============================================================
// Add Spare Part Screen — Form for registering stock & pricing
// Signature Sky Blue Header & Mega-Curved Lower Sheet
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
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Check,
  Package,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
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

  const skyBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
  const inputBg = isDark ? '#141926' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          backgroundColor: skyBg,
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 24,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
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
            Add Spare Part
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
            Catalog item, cost & selling pricing
          </Text>
        </View>
      </View>

      {/* Signature Mega-Curved Lower Content Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          marginTop: -14,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 }}
        >
          <View style={{ gap: 16 }}>
            {/* Part Description Card */}
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: borderColor,
                gap: 16,
              }}
            >
              {/* Part Name */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  PART NAME / DESCRIPTION *
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Bosch Front Brake Pads"
                  placeholderTextColor={theme.textMuted}
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: borderColor,
                    paddingHorizontal: 16,
                    height: 52,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                  }}
                />
              </View>

              {/* SKU / Part Number */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  SKU / PART NUMBER (OPTIONAL)
                </Text>
                <TextInput
                  value={partNumber}
                  onChangeText={setPartNumber}
                  placeholder="e.g. BSH-BP-041"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="characters"
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: borderColor,
                    paddingHorizontal: 16,
                    height: 52,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}
                />
              </View>

              {/* Unit Type Selection */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  UNIT OF MEASURE
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {POPULAR_UNITS.map((u) => {
                    const isSelected = unit === u;
                    return (
                      <TouchableOpacity
                        key={u}
                        onPress={() => setUnit(u)}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderRadius: 16,
                          backgroundColor: isSelected ? '#0C1829' : inputBg,
                        }}
                      >
                        <Text
                          style={{
                            color: isSelected ? '#FFFFFF' : theme.text,
                            fontSize: 13,
                            fontWeight: '700',
                          }}
                        >
                          {u}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            {/* Pricing & Stock Card */}
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: borderColor,
                gap: 16,
              }}
            >
              {/* Purchase & Selling Price */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                    COST PRICE ({currencySymbol})
                  </Text>
                  <TextInput
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                    placeholder="0.00"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: inputBg,
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: borderColor,
                      paddingHorizontal: 16,
                      height: 52,
                      color: theme.text,
                      fontSize: 15,
                      fontWeight: '700',
                    }}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                    SELLING PRICE ({currencySymbol}) *
                  </Text>
                  <TextInput
                    value={sellingPrice}
                    onChangeText={setSellingPrice}
                    placeholder="0.00"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: inputBg,
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: borderColor,
                      paddingHorizontal: 16,
                      height: 52,
                      color: theme.text,
                      fontSize: 15,
                      fontWeight: '700',
                    }}
                  />
                </View>
              </View>

              {/* Initial Stock & Low Stock Threshold */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                    INITIAL STOCK
                  </Text>
                  <TextInput
                    value={stockQuantity}
                    onChangeText={setStockQuantity}
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: inputBg,
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: borderColor,
                      paddingHorizontal: 16,
                      height: 52,
                      color: theme.text,
                      fontSize: 15,
                      fontWeight: '700',
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
                    placeholder="3"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: inputBg,
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: borderColor,
                      paddingHorizontal: 16,
                      height: 52,
                      color: theme.text,
                      fontSize: 15,
                      fontWeight: '700',
                    }}
                  />
                </View>
              </View>

              {/* Supplier Info */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  SUPPLIER / VENDOR NAME
                </Text>
                <TextInput
                  value={supplierName}
                  onChangeText={setSupplierName}
                  placeholder="e.g. Bosch Distributor, Metro Spares"
                  placeholderTextColor={theme.textMuted}
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: borderColor,
                    paddingHorizontal: 16,
                    height: 52,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                  }}
                />
              </View>
            </View>

            {/* Midnight Navy Pill Submit Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.88}
              style={{
                backgroundColor: '#0C1829',
                paddingVertical: 18,
                borderRadius: 34,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                shadowColor: '#000',
                shadowOpacity: 0.35,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 6,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                    Save to Inventory
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
