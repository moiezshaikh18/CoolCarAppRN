// ============================================================
// Profit & Loss Screen — Comprehensive P&L Overview
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
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, TrendingUp, Calendar, Download } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
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

  const skyBg = isDark ? '#070A0F' : '#153580';
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
                Profit & Loss
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
                Net operating margin analysis
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
          {/* Net Profit Main Midnight Navy Card */}
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
          </View>

          {/* Performance Metrics */}
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
            <View
              style={{
                flex: 1,
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 16,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>Gross Inflow</Text>
              <Text style={{ color: '#00C896', fontSize: 18, fontWeight: '800', marginTop: 4 }}>
                +{formatCurrency(income, currencySymbol)}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 16,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>Total Expenses</Text>
              <Text style={{ color: '#EF4444', fontSize: 18, fontWeight: '800', marginTop: 4 }}>
                -{formatCurrency(expense, currencySymbol)}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 16,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>Operating Ratio</Text>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginTop: 4 }}>
                65.4%
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 16,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>Job Sheet ROI</Text>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginTop: 4 }}>
                +34.6%
              </Text>
            </View>
          </View>

          {/* Export CTA Button */}
          <TouchableOpacity
            onPress={() => Alert.alert('Exported', 'P&L fiscal statement downloaded.')}
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
              Download P&L Balance Sheet
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
