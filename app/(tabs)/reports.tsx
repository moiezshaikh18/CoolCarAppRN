// ============================================================
// Reports Screen — Sky Blue & Midnight Navy Luxury Analytic Layout
// Directly matching media_1790189780212.png center screen
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
  TrendingUp,
  TrendingDown,
  Download,
  Share2,
  FileSpreadsheet,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const RANGE_PILLS = ['4h', '1d', '1w', '1mo', '1y', 'All'];

const CHART_POINTS = [
  { label: 'Jan', val: 110 },
  { label: 'Feb', val: 130 },
  { label: 'Mar', val: 120 },
  { label: 'Apr', val: 145 },
  { label: 'May', val: 175 },
  { label: 'Jun', val: 160 },
];

export default function ReportsScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const [selectedRange, setSelectedRange] = useState('1mo');
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown'>('overview');

  const canvasBg = isDark ? '#070A0F' : '#6B9FE8';
  const sheetBg = isDark ? '#111622' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 24, 41, 0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Sky Blue Header */}
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <View>
              <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>
                Analytics & Profit
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 13, fontWeight: '600', marginTop: 2 }}>
                Real-Time Workshop Margins
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/settings/export')}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? '#141926' : 'rgba(255, 255, 255, 0.25)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Download size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Crisp White Lower Sheet */}
        <View
          style={{
            backgroundColor: sheetBg,
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            paddingTop: 24,
            paddingHorizontal: 20,
            paddingBottom: 24,
            minHeight: 600,
            shadowColor: '#0C1829',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDark ? 0.4 : 0.06,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {/* Segmented Switcher: Overview / Breakdown */}
          <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => setActiveTab('overview')} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: activeTab === 'overview' ? '900' : '600',
                  color: activeTab === 'overview' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                }}
              >
                Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveTab('breakdown')} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: activeTab === 'breakdown' ? '900' : '600',
                  color: activeTab === 'breakdown' ? (isDark ? '#FFFFFF' : '#0C1829') : '#94A3B8',
                }}
              >
                Breakdown
              </Text>
            </TouchableOpacity>
          </View>

          {/* Large Financial Metric Display (Matching Center Screen) */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View>
              <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }}>
                Net Monthly Inflow
              </Text>
              <Text style={{ fontSize: 32, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0C1829', marginTop: 4 }}>
                {formatCurrency(145600, currencySymbol)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: 'rgba(0, 200, 150, 0.15)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
              }}
            >
              <TrendingUp size={14} color="#00C896" />
              <Text style={{ color: '#00C896', fontSize: 12, fontWeight: '800' }}>
                +14.2%
              </Text>
            </View>
          </View>

          {/* Area Line Chart Representation */}
          <View
            style={{
              height: 140,
              backgroundColor: isDark ? '#141926' : '#F8FAFD',
              borderRadius: 24,
              padding: 16,
              justifyContent: 'flex-end',
              marginBottom: 16,
              borderWidth: 1,
              borderColor: cardBorder,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 90 }}>
              {CHART_POINTS.map((pt, idx) => {
                const heightPercent = (pt.val / 180) * 80;
                const isCurrent = idx === CHART_POINTS.length - 2;
                return (
                  <View key={pt.label} style={{ alignItems: 'center', gap: 6, flex: 1 }}>
                    <View
                      style={{
                        width: 24,
                        height: heightPercent,
                        backgroundColor: isCurrent ? (isDark ? '#FFFFFF' : '#0C1829') : '#6B9FE8',
                        borderRadius: 12,
                        opacity: isCurrent ? 1 : 0.45,
                      }}
                    />
                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748B' }}>{pt.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Range Pills Row (4h, 1d, 1w, 1mo, 1y, All) */}
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 24 }}>
            {RANGE_PILLS.map((pill) => {
              const isSelected = selectedRange === pill;
              return (
                <TouchableOpacity
                  key={pill}
                  onPress={() => setSelectedRange(pill)}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 18,
                    backgroundColor: isSelected ? (isDark ? '#FFFFFF' : '#0C1829') : (isDark ? '#182030' : '#F4F7FC'),
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: isSelected ? '800' : '600',
                      color: isSelected ? (isDark ? '#0C1829' : '#FFFFFF') : '#64748B',
                    }}
                  >
                    {pill}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 4-Box Spec Metric Grid */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <GlassCard
              variant={isDark ? 'navy' : 'sand'}
              padding={16}
              style={{ flex: 1, borderRadius: 22 }}
            >
              <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600' }}>Gross Inflow</Text>
              <Text style={{ color: '#00C896', fontSize: 18, fontWeight: '900', marginTop: 4 }}>
                +₹1,45,600
              </Text>
            </GlassCard>

            <GlassCard
              variant={isDark ? 'navy' : 'sand'}
              padding={16}
              style={{ flex: 1, borderRadius: 22 }}
            >
              <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600' }}>Total Expenses</Text>
              <Text style={{ color: '#EF4444', fontSize: 18, fontWeight: '900', marginTop: 4 }}>
                -₹95,300
              </Text>
            </GlassCard>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <GlassCard
              variant={isDark ? 'navy' : 'sand'}
              padding={16}
              style={{ flex: 1, borderRadius: 22 }}
            >
              <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600' }}>Net Profit</Text>
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 18, fontWeight: '900', marginTop: 4 }}>
                ₹50,300
              </Text>
            </GlassCard>

            <GlassCard
              variant={isDark ? 'navy' : 'sand'}
              padding={16}
              style={{ flex: 1, borderRadius: 22 }}
            >
              <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600' }}>Profit Margin</Text>
              <Text style={{ color: '#00C896', fontSize: 18, fontWeight: '900', marginTop: 4 }}>
                34.5%
              </Text>
            </GlassCard>
          </View>

          {/* Quick Links to Detailed Statements */}
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              onPress={() => router.push('/reports/income')}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                borderRadius: 20,
                backgroundColor: isDark ? '#141926' : '#F8FAFD',
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            >
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 14, fontWeight: '800' }}>
                View Full Income Report
              </Text>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/reports/profit-loss')}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                borderRadius: 20,
                backgroundColor: isDark ? '#141926' : '#F8FAFD',
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            >
              <Text style={{ color: isDark ? '#FFFFFF' : '#0C1829', fontSize: 14, fontWeight: '800' }}>
                Profit & Loss Statement
              </Text>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
