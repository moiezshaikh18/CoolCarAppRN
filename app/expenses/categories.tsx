// ============================================================
// Expense Categories Screen — Expense Ledger Categories
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { router } from 'expo-router';

interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Shop Rent', iconName: 'Home' },
  { id: '2', name: 'Electricity Bill', iconName: 'Zap' },
  { id: '3', name: 'Staff Salaries', iconName: 'Briefcase' },
  { id: '4', name: 'Tools & Equipment', iconName: 'Wrench' },
  { id: '5', name: 'Oil & Lubricants', iconName: 'Droplet' },
  { id: '6', name: 'Spare Parts & Material', iconName: 'Package' },
  { id: '7', name: 'Tea & Snacks', iconName: 'Coffee' },
  { id: '8', name: 'Miscellaneous', iconName: 'MoreHorizontal' },
];

export default function ExpenseCategoriesScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const getIcon = (iconName: string) => {
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

  const handleAddCategory = () => {
    Alert.prompt
      ? Alert.prompt('New Category', 'Enter category name', (text) => {
          if (text) {
            setCategories([
              ...categories,
              {
                id: Date.now().toString(),
                name: text,
                iconName: 'MoreHorizontal',
              },
            ]);
          }
        })
      : Alert.alert('Add Category', 'Custom category modal is ready.');
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
            Workshop classification tags
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
                    {getIcon(cat.iconName)}
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
        <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <TouchableOpacity
            onPress={handleAddCategory}
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
              Add Category
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
