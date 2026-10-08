// ============================================================
// Screen 15: Expense Categories — Categories Directory
// Directly matching Screen 15 in Reference Design Mockup
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
  Store,
  Zap,
  Briefcase,
  Wrench,
  Coffee,
  MoreHorizontal,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { router } from 'expo-router';

interface CategoryItem {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Shop Rent', icon: Store, color: '#D97706', bgColor: '#FEF3C7' },
  { id: '2', name: 'Electricity Bill', icon: Zap, color: '#0284C7', bgColor: '#E0F2FE' },
  { id: '3', name: 'Salary', icon: Briefcase, color: '#0D9488', bgColor: '#CCFBF1' },
  { id: '4', name: 'Tools & Equipment', icon: Wrench, color: '#2563EB', bgColor: '#EFF6FF' },
  { id: '5', name: 'Tea & Snacks', icon: Coffee, color: '#DC2626', bgColor: '#FEE2E2' },
  { id: '6', name: 'Miscellaneous', icon: MoreHorizontal, color: '#7C3AED', bgColor: '#EDE9FE' },
];

export default function ExpenseCategoriesScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);

  const handleAddCategory = () => {
    Alert.prompt
      ? Alert.prompt('New Category', 'Enter category name', (text) => {
          if (text?.trim()) {
            setCategories([
              ...categories,
              {
                id: Date.now().toString(),
                name: text.trim(),
                icon: MoreHorizontal,
                color: '#2563EB',
                bgColor: '#EFF6FF',
              },
            ]);
          }
        })
      : Alert.alert('Add Category', 'Quick category added.');
  };

  const bg = isDark ? '#0C1829' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#94A3B8';
  const cardBg = isDark ? '#111E33' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Top Header matching Screen 15 */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{ width: 40, height: 40, justifyContent: 'center' }}
        >
          <ArrowLeft size={22} color={textPrimary} strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary }}>
          Expense Categories
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: insets.bottom + 90,
          gap: 10,
        }}
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 14,
                paddingHorizontal: 16,
                backgroundColor: cardBg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: cat.bgColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} color={cat.color} strokeWidth={2.2} />
                </View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: textPrimary }}>
                  {cat.name}
                </Text>
              </View>

              <ChevronRight size={18} color={textMuted} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Fixed Bottom Button matching Screen 15 */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 22,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 20,
          paddingTop: 12,
          backgroundColor: bg,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <TouchableOpacity
          onPress={handleAddCategory}
          activeOpacity={0.88}
          style={{
            height: 52,
            backgroundColor: '#0C1829',
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#0C1829',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            + Add Category
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
