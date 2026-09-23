// ============================================================
// Income Report Screen — Financial Inflow Analytics
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, TrendingUp, Calendar, Download, Sparkles } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
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

  const skyBg = isDark ? '#070A0F' : '#6B9FE8';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: skyBg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'light-content'} backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
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
                Income Report
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
                Workshop revenue breakdown
              </Text>
            </View>
          </View>

          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255,255,255,0.22)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={18} color="#FFFFFF" />
          </View>
        </View>

        {/* Period Switchers */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {PERIODS.map((period) => {
            const isSelected = selectedPeriod === period;
            return (
              <TouchableOpacity
                key={period}
                onPress={() => setSelectedPeriod(period)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isSelected ? '#0C1829' : 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
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
      </View>

      {/* Signature Mega-Curved Lower Content Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 }}
        >
          {/* Midnight Navy Featured Hero Card */}
          <View
            style={{
              backgroundColor: '#0C1829',
              borderRadius: 30,
              padding: 22,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
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
          </View>

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

          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: borderColor,
              gap: 16,
              marginBottom: 20,
            }}
          >
            {/* Services */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: isDark ? '#141926' : '#EFF6FF',
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

            <View style={{ height: 1, backgroundColor: borderColor }} />

            {/* Spare Parts */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: isDark ? '#141926' : '#EFF6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6' }} />
                </View>
                <View>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                    Spare Parts & Consumables
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                    Filters, Oils, Brake Pads
                  </Text>
                </View>
              </View>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                {formatCurrency(60600, currencySymbol)}
              </Text>
            </View>
          </View>

          {/* Export Report CTA */}
          <TouchableOpacity
            onPress={() => Alert.alert('Report Exported', 'Income statement PDF generated.')}
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
            <Download size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Export Income Statement
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
