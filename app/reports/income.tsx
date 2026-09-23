// ============================================================
// Income Report Screen — Screen 17 from Master Design
// Strictly follows media_1790116823022.png aesthetic
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, TrendingUp, Calendar, Download, Sparkles } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { formatCurrency } from '../../src/utils/currency';

const { width } = Dimensions.get('window');

const TREND_POINTS = [
  { date: '1 May', val: 50 },
  { date: '8 May', val: 90 },
  { date: '15 May', val: 70 },
  { date: '22 May', val: 120 },
  { date: '29 May', val: 160 },
];

const PERIODS = ['This Month', 'Last Month', 'This Quarter', 'YTD'];

export default function IncomeReportScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

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
          Income Report
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

        {/* Hero Revenue Card */}
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
              Total Gross Inflow
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
              <Text style={{ color: '#00C896', fontSize: 11, fontWeight: '800' }}>+18.4%</Text>
            </View>
          </View>

          <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1, marginTop: 8 }}>
            {formatCurrency(145600, currencySymbol)}
          </Text>

          {/* Bar Chart Representation */}
          <View style={{ marginTop: 24, height: 110, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            {TREND_POINTS.map((pt, idx) => {
              const barHeight = (pt.val / 160) * 80;
              const isPeak = idx === TREND_POINTS.length - 1;
              return (
                <View key={pt.date} style={{ alignItems: 'center', gap: 8, flex: 1 }}>
                  <View
                    style={{
                      width: 28,
                      height: barHeight,
                      backgroundColor: isPeak ? '#FFFFFF' : 'rgba(255,255,255,0.2)',
                      borderRadius: 14,
                    }}
                  />
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' }}>{pt.date}</Text>
                </View>
              );
            })}
          </View>
        </GlassCard>

        {/* Breakdown by Revenue Stream */}
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
          Inflow Stream Breakdown
        </Text>

        <GlassCard
          variant="sand"
          padding={20}
          style={{
            borderRadius: 28,
            gap: 16,
          }}
        >
          {/* Services */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#00C896' }} />
              </View>
              <View>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                  Mechanical & Labor Charges
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                  48 Completed Job Sheets
                </Text>
              </View>
            </View>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
              {formatCurrency(85000, currencySymbol)}
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          {/* Spare Parts */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6' }} />
              </View>
              <View>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                  Spare Parts Invoiced
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                  OEM Filters, Fluids & Hardware
                </Text>
              </View>
            </View>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
              {formatCurrency(45000, currencySymbol)}
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          {/* Quick Counter Sales */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#F59E0B' }} />
              </View>
              <View>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                  Direct Counter Sales
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                  Direct Lubes, Washing & Accessories
                </Text>
              </View>
            </View>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
              {formatCurrency(15600, currencySymbol)}
            </Text>
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
          onPress={() => Alert.alert('Report Exported', 'Income statement downloaded as PDF.')}
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
            Download Statement
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
