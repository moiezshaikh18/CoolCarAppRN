// ============================================================
// Notification Settings Screen — Master Design
// Strictly follows media_1790116823022.png aesthetic
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  Calendar,
  AlertTriangle,
  Receipt,
  BarChart3,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { GlassCard } from '../../src/components/common/GlassCard';

export default function NotificationsSettingsScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [serviceReminders, setServiceReminders] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [paymentReceipts, setPaymentReceipts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);

  const handleSave = () => {
    Alert.alert('Preferences Saved', 'Notification alert settings updated successfully.');
  };

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
          Notifications
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
          <Bell size={18} color={theme.text} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
      >
        {/* Main Notification Toggles Card */}
        <GlassCard
          variant="sand"
          padding={20}
          style={{
            borderRadius: 28,
            gap: 16,
          }}
        >
          <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 }}>
            Alert Preferences
          </Text>

          {/* Service Reminders */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1, paddingRight: 12 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calendar size={20} color={theme.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                  Service Reminders
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                  Automated upcoming vehicle maintenance alerts
                </Text>
              </View>
            </View>
            <Switch
              value={serviceReminders}
              onValueChange={setServiceReminders}
              trackColor={{ false: isDark ? '#262D3B' : '#DFDCD4', true: primaryBtnBg }}
              thumbColor={serviceReminders ? primaryBtnText : '#FFFFFF'}
            />
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          {/* Low Stock Alerts */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1, paddingRight: 12 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle size={20} color={theme.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                  Low Inventory Alerts
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                  Notify when spare parts fall below threshold
                </Text>
              </View>
            </View>
            <Switch
              value={lowStockAlerts}
              onValueChange={setLowStockAlerts}
              trackColor={{ false: isDark ? '#262D3B' : '#DFDCD4', true: primaryBtnBg }}
              thumbColor={lowStockAlerts ? primaryBtnText : '#FFFFFF'}
            />
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          {/* Payment Receipts */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1, paddingRight: 12 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Receipt size={20} color={theme.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                  Payment Receipts
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                  Notifications when customer settlements are logged
                </Text>
              </View>
            </View>
            <Switch
              value={paymentReceipts}
              onValueChange={setPaymentReceipts}
              trackColor={{ false: isDark ? '#262D3B' : '#DFDCD4', true: primaryBtnBg }}
              thumbColor={paymentReceipts ? primaryBtnText : '#FFFFFF'}
            />
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          {/* Daily Financial Summary */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1, paddingRight: 12 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChart3 size={20} color={theme.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                  Daily Financial Digest
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                  Evening summary of cash collections and expenses
                </Text>
              </View>
            </View>
            <Switch
              value={dailySummary}
              onValueChange={setDailySummary}
              trackColor={{ false: isDark ? '#262D3B' : '#DFDCD4', true: primaryBtnBg }}
              thumbColor={dailySummary ? primaryBtnText : '#FFFFFF'}
            />
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
          onPress={handleSave}
          style={{
            backgroundColor: primaryBtnBg,
            paddingVertical: 18,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
            Save Preferences
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
