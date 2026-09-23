// ============================================================
// Expense Categories Screen — Expense Ledger Categories
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
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
import { GlassCard } from '../../src/components/common/GlassCard';
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
    const size = 18;
    const color = theme.text;
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
            Expense Categories
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
            Workshop classification tags
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 110 }}
      >
        {/* Category List */}
        <View style={{ gap: 12 }}>
          {categories.map((cat) => (
            <GlassCard
              key={cat.id}
              variant="sand"
              padding={16}
              onPress={() => {}}
              style={{
                borderRadius: 28,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                    backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  }}
                >
                  {getIcon(cat.iconName)}
                </View>
                <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
                  {cat.name}
                </Text>
              </View>
              <ChevronRight size={18} color={theme.textMuted} />
            </GlassCard>
          ))}
        </View>
      </ScrollView>

      {/* Solid Black Pill Floating CTA Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 24,
          left: 22,
          right: 22,
        }}
      >
        <TouchableOpacity
          onPress={handleAddCategory}
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
            Add Category
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
