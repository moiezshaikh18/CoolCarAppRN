// ============================================================
// Expense Categories Screen — Expense Ledger Categories
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// Fully Interactive Add Category Modal with Cloud & Local Persistence
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ChevronRight,
  Plus,
  Home as HomeIcon,
  Zap,
  Briefcase,
  Wrench,
  Droplet,
  Package,
  Coffee,
  MoreHorizontal,
  X,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useExpenseStore } from '../../src/store/expenseStore';
import { ExpenseCategory } from '../../src/types/expense.types';
import { router } from 'expo-router';

export default function ExpenseCategoriesScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { categories, addCategory } = useExpenseStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('MoreHorizontal');

  const getIcon = (iconName?: string) => {
    const size = 20;
    const color = isDark ? '#FFFFFF' : '#3B82F6';
    switch (iconName) {
      case 'Home': return <HomeIcon size={size} color={color} />;
      case 'Zap': return <Zap size={size} color={color} />;
      case 'Briefcase': return <Briefcase size={size} color={color} />;
      case 'Wrench': return <Wrench size={size} color={color} />;
      case 'Droplet': return <Droplet size={size} color={color} />;
      case 'Package': return <Package size={size} color={color} />;
      case 'Coffee': return <Coffee size={size} color={color} />;
      default: return <MoreHorizontal size={size} color={color} />;
    }
  };

  const handleSaveCategory = async () => {
    if (!newCatName.trim()) {
      Alert.alert('Required', 'Please enter a category name');
      return;
    }

    const entId = enterpriseId || 'enterprise-cool-car';
    const newCat: ExpenseCategory = {
      id: `cat_${Date.now()}`,
      enterpriseId: entId,
      name: newCatName.trim(),
      icon: selectedIcon,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    addCategory(newCat);

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      await setDoc(doc(db, 'enterprises', entId, 'expenseCategories', newCat.id), newCat);
    } catch (err) {
      console.log('[ExpenseCategories] Firestore sync error:', err);
    }

    setNewCatName('');
    setIsAddModalOpen(false);
  };

  const skyBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          backgroundColor: skyBg,
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 22,
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
            Expense Categories
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
            Workshop classification tags ({categories.length})
          </Text>
        </View>
      </View>

      {/* Signature Lower Content Sheet with ZERO Blue Bleed */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          marginTop: -14,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingTop: 16,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110, paddingTop: 4 }}
        >
          <View style={{ gap: 12 }}>
            {categories.map((cat) => (
              <View
                key={cat.id}
                style={{
                  backgroundColor: isDark ? '#101927' : '#FFFFFF',
                  borderRadius: 24,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  shadowColor: '#000',
                  shadowOpacity: isDark ? 0.3 : 0.04,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: isDark ? '#141926' : '#EFF6FF',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getIcon(cat.icon)}
                  </View>
                  <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
                    {cat.name}
                  </Text>
                </View>
                <ChevronRight size={18} color={theme.textMuted} />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Floating Midnight Navy CTA */}
        <View style={{ position: 'absolute', bottom: Math.max(insets.bottom + 12, 24), left: 20, right: 20 }}>
          <TouchableOpacity
            onPress={() => setIsAddModalOpen(true)}
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
              + Add Category
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Category Modal */}
      <Modal
        visible={isAddModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 380,
              backgroundColor: isDark ? '#111E33' : '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text }}>
                New Expense Category
              </Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)} hitSlop={10}>
                <X size={20} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: theme.textMuted, marginBottom: 16 }}>
              Add a custom ledger classification for workshop expenses.
            </Text>

            <TextInput
              value={newCatName}
              onChangeText={setNewCatName}
              placeholder="e.g. Generator Diesel, Welding Rods"
              placeholderTextColor="#94A3B8"
              autoFocus
              style={{
                backgroundColor: isDark ? '#0C1829' : '#F8FAFC',
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 15,
                fontWeight: '700',
                color: theme.text,
                marginBottom: 20,
              }}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setIsAddModalOpen(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textMuted }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveCategory}
                style={{
                  flex: 2,
                  paddingVertical: 12,
                  backgroundColor: '#0C1829',
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFFFFF' }}>
                  Save Category
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
