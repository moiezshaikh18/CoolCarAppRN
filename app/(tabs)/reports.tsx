// ============================================================
// Reports Screen — Financial Analytics & Performance
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calendar,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  CreditCard,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';

const MONTHLY_BAR_DATA = [
  { month: 'Jan', income: 110, expense: 70 },
  { month: 'Feb', income: 130, expense: 85 },
  { month: 'Mar', income: 120, expense: 60 },
  { month: 'Apr', income: 145, expense: 95 },
  { month: 'May', income: 160, expense: 110 },
  { month: 'Jun', income: 145, expense: 95 },
];

export default function ReportsScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const [selectedRange, setSelectedRange] = useState('This Month');

  const maxBarHeight = 120;
  const maxVal = 180;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Symmetrical Header */}
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
          <View>
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Financial Insights
            </Text>
            <Text style={{ color: theme.text, fontSize: 26, fontWeight: '800', marginTop: 2, letterSpacing: -0.5 }}>
              Analytics & Reports
            </Text>
          </View>

          {/* Symmetrical Circular Action Button */}
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: isDark ? '#1C212B' : '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Calendar size={20} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Date Filter Dropdown Pill */}
        <View style={{ paddingHorizontal: 22, marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
              gap: 8,
              backgroundColor: isDark ? '#1C212B' : '#EFECE6',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 13, fontWeight: '700' }}>
              {selectedRange}
            </Text>
            <ChevronDown size={14} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 4-Box Spec Metric Grid (Screen 3 Layout) */}
        <View style={{ paddingHorizontal: 22, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            {/* Income */}
            <GlassCard
              variant="sand"
              padding={18}
              style={{
                flex: 1,
                borderRadius: 26,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <TrendingUp size={18} color={isDark ? '#34D399' : '#15803D'} />
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>
                Total Income
              </Text>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', marginTop: 4 }}>
                {formatCurrency(145600, currencySymbol)}
              </Text>
            </GlassCard>

            {/* Expenses */}
            <GlassCard
              variant="sand"
              padding={18}
              style={{
                flex: 1,
                borderRadius: 26,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <TrendingDown size={18} color={isDark ? '#F87171' : '#B91C1C'} />
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>
                Total Expenses
              </Text>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', marginTop: 4 }}>
                {formatCurrency(95300, currencySymbol)}
              </Text>
            </GlassCard>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Net Profit */}
            <GlassCard
              variant="sand"
              padding={18}
              style={{
                flex: 1,
                borderRadius: 26,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <DollarSign size={18} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>
                Net Profit
              </Text>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', marginTop: 4 }}>
                {formatCurrency(50300, currencySymbol)}
              </Text>
            </GlassCard>

            {/* Transactions */}
            <GlassCard
              variant="sand"
              padding={18}
              style={{
                flex: 1,
                borderRadius: 26,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Activity size={18} color={isDark ? '#FBBF24' : '#B45309'} />
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>
                Work Orders
              </Text>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', marginTop: 4 }}>
                128
              </Text>
            </GlassCard>
          </View>
        </View>

        {/* Income vs Expense Monthly Bar Chart */}
        <View style={{ paddingHorizontal: 22, marginBottom: 20 }}>
          <GlassCard
            variant="sand"
            padding={22}
            style={{ borderRadius: 28 }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                Monthly Performance
              </Text>

              {/* Symmetrical Legend */}
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isDark ? '#FFFFFF' : '#121214' }} />
                  <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Income</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isDark ? '#6B7280' : '#D1D5DB' }} />
                  <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Expense</Text>
                </View>
              </View>
            </View>

            {/* Bars container */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: maxBarHeight, paddingTop: 10 }}>
              {MONTHLY_BAR_DATA.map((item) => {
                const incomeH = (item.income / maxVal) * maxBarHeight;
                const expenseH = (item.expense / maxVal) * maxBarHeight;
                return (
                  <View key={item.month} style={{ alignItems: 'center', gap: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                      <View
                        style={{
                          width: 12,
                          height: incomeH,
                          backgroundColor: isDark ? '#FFFFFF' : '#121214',
                          borderRadius: 6,
                        }}
                      />
                      <View
                        style={{
                          width: 12,
                          height: expenseH,
                          backgroundColor: isDark ? '#4B5563' : '#CBD5E1',
                          borderRadius: 6,
                        }}
                      />
                    </View>
                    <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>{item.month}</Text>
                  </View>
                );
              })}
            </View>
          </GlassCard>
        </View>

        {/* Payment Modes Breakdown */}
        <View style={{ paddingHorizontal: 22, marginBottom: 20 }}>
          <GlassCard
            variant="sand"
            padding={22}
            style={{ borderRadius: 28 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <CreditCard size={18} color={theme.text} />
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                Payment Channel Distribution
              </Text>
            </View>

            <View style={{ gap: 14 }}>
              {[
                { mode: 'UPI (Linked Bank Account)', amount: 82000, color: isDark ? '#FFFFFF' : '#121214', pct: '56%' },
                { mode: 'Card Swipe (POS Terminal)', amount: 41600, color: isDark ? '#9CA3AF' : '#64748B', pct: '29%' },
                { mode: 'Cash Counter (In Hand)', amount: 22000, color: isDark ? '#6B7280' : '#94A3B8', pct: '15%' },
              ].map((item) => (
                <View key={item.mode}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600' }}>
                      {item.mode}
                    </Text>
                    <Text style={{ color: theme.text, fontSize: 13, fontWeight: '700' }}>
                      {formatCurrency(item.amount, currencySymbol)} ({item.pct})
                    </Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: isDark ? '#252B38' : '#FFFFFF', borderRadius: 4, overflow: 'hidden' }}>
                    <View style={{ width: item.pct as any, height: '100%', backgroundColor: item.color, borderRadius: 4 }} />
                  </View>
                </View>
              ))}
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}
