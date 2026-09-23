// ============================================================
// Profit & Loss Screen — Screen 18 from Master Design
// Strictly follows media_1790116823022.png aesthetic
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';

const PERIODS = ['This Month', 'Last Month', 'This Quarter', 'FY 24-25'];

export default function ProfitLossScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const income = 145600;
  const expense = 95300;
  const netProfit = income - expense;
  const profitMargin = Math.round((netProfit / income) * 100);

  const canvasBg = isDark ? '#14171F' : '#F8F6F2';
  const circleBtnBg = isDark ? '#1C212B' : '#EFECE6';
  const primaryBtnBg = isDark ? '#FFFFFF' : '#121214';
  const primaryBtnText = isDark ? '#121214' : '#FFFFFF';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      {/* Symmetrical Top Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: circleBtnBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color={theme.text} />
        </TouchableOpacity>

        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 }}>
          Profit & Loss
        </Text>

        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: circleBtnBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Calendar size={18} color={theme.text} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
      >
        {/* Period Capsule Switchers */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 18 }}>
          {PERIODS.map((period) => {
            const isSelected = selectedPeriod === period;
            return (
              <TouchableOpacity
                key={period}
                onPress={() => setSelectedPeriod(period)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 22,
                  backgroundColor: isSelected ? primaryBtnBg : circleBtnBg,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: isSelected ? primaryBtnText : theme.textMuted,
                    fontSize: 12,
                    fontWeight: isSelected ? '800' : '600',
                  }}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Net Profit Main Obsidian Card */}
        <GlassCard
          variant="dark"
          padding={24}
          style={{
            borderRadius: 28,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Net Workshop Profit
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: 'rgba(0,200,150,0.2)',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <TrendingUp size={13} color="#00C896" />
              <Text style={{ color: '#00C896', fontSize: 11, fontWeight: '800' }}>{profitMargin}% Margin</Text>
            </View>
          </View>

          <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1, marginTop: 8 }}>
            {formatCurrency(netProfit, currencySymbol)}
          </Text>

          {/* Income vs Expense Horizontal Proportional Bar */}
          <View style={{ marginTop: 22, marginBottom: 10 }}>
            <View style={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.15)', flexDirection: 'row', overflow: 'hidden' }}>
              <View style={{ flex: income, backgroundColor: '#00C896' }} />
              <View style={{ flex: expense, backgroundColor: '#EF4444' }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C896' }} />
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' }}>
                  Inflow {formatCurrency(income, currencySymbol)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' }}>
                  Outflow {formatCurrency(expense, currencySymbol)}
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* 4-Box Spec Metric Grid */}
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          Performance Metrics
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <GlassCard
            variant="sand"
            padding={16}
            style={{
              flex: 1,
              borderRadius: 24,
            }}
          >
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>Gross Inflow</Text>
            <Text style={{ color: '#00C896', fontSize: 18, fontWeight: '800', marginTop: 4 }}>
              +{formatCurrency(income, currencySymbol)}
            </Text>
          </GlassCard>

          <GlassCard
            variant="sand"
            padding={16}
            style={{
              flex: 1,
              borderRadius: 24,
            }}
          >
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>Total Expenses</Text>
            <Text style={{ color: '#EF4444', fontSize: 18, fontWeight: '800', marginTop: 4 }}>
              -{formatCurrency(expense, currencySymbol)}
            </Text>
          </GlassCard>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <GlassCard
            variant="sand"
            padding={16}
            style={{
              flex: 1,
              borderRadius: 24,
            }}
          >
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>Net Profit Margin</Text>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginTop: 4 }}>
              {profitMargin}%
            </Text>
          </GlassCard>

          <GlassCard
            variant="sand"
            padding={16}
            style={{
              flex: 1,
              borderRadius: 24,
            }}
          >
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>Operating Status</Text>
            <Text style={{ color: '#00C896', fontSize: 18, fontWeight: '800', marginTop: 4 }}>
              Healthy
            </Text>
          </GlassCard>
        </View>

        {/* Category Expense Impact Card */}
        <GlassCard
          variant="sand"
          padding={20}
          style={{
            borderRadius: 28,
            gap: 14,
          }}
        >
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
            Primary Expense Drivers
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600' }}>Spare Parts Procurement</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>₹48,200 (50.5%)</Text>
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600' }}>Mechanic & Staff Salaries</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>₹32,000 (33.6%)</Text>
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600' }}>Electricity & Workshop Rent</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>₹15,100 (15.9%)</Text>
          </View>
        </GlassCard>
      </ScrollView>

      {/* Floating Solid Obsidian CTA Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => Alert.alert('Report Exported', 'Full P&L Financial Statement downloaded as PDF.')}
          style={{
            backgroundColor: primaryBtnBg,
            paddingVertical: 18,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Download size={20} color={primaryBtnText} />
          <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
            Download P&L Statement
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
