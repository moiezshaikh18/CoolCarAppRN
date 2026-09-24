// ============================================================
// Notification Settings Screen — Master Design
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
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
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';

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

  const skyBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

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
            Notifications
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
            Alert preferences & reminders
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
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 }}
        >
          {/* Main Notification Toggles Card */}
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
            {/* Service Due Reminders */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1, marginRight: 12 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: isDark ? '#141926' : '#EFF6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Calendar size={20} color={isDark ? '#FFFFFF' : '#3B82F6'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                    Service Due Reminders
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                    Notify customers when periodic service is approaching
                  </Text>
                </View>
              </View>
              <Switch
                value={serviceReminders}
                onValueChange={setServiceReminders}
                trackColor={{ false: isDark ? '#1E293B' : '#E2E8F0', true: '#0C1829' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={{ height: 1, backgroundColor: borderColor }} />

            {/* Low Stock Alerts */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1, marginRight: 12 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: isDark ? '#141926' : '#EFF6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AlertTriangle size={20} color={isDark ? '#FFFFFF' : '#3B82F6'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                    Low Stock Threshold
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                    Trigger alert when inventory reaches minimum level
                  </Text>
                </View>
              </View>
              <Switch
                value={lowStockAlerts}
                onValueChange={setLowStockAlerts}
                trackColor={{ false: isDark ? '#1E293B' : '#E2E8F0', true: '#0C1829' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={{ height: 1, backgroundColor: borderColor }} />

            {/* Payment Receipts */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1, marginRight: 12 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: isDark ? '#141926' : '#EFF6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Receipt size={20} color={isDark ? '#FFFFFF' : '#3B82F6'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                    Payment Receipts
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                    Auto-send digital receipts on payment collection
                  </Text>
                </View>
              </View>
              <Switch
                value={paymentReceipts}
                onValueChange={setPaymentReceipts}
                trackColor={{ false: isDark ? '#1E293B' : '#E2E8F0', true: '#0C1829' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={{ height: 1, backgroundColor: borderColor }} />

            {/* Daily Evening Summary */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1, marginRight: 12 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: isDark ? '#141926' : '#EFF6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BarChart3 size={20} color={isDark ? '#FFFFFF' : '#3B82F6'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                    Daily Financial Summary
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                    Receive end-of-day revenue & jobs completed digest
                  </Text>
                </View>
              </View>
              <Switch
                value={dailySummary}
                onValueChange={setDailySummary}
                trackColor={{ false: isDark ? '#1E293B' : '#E2E8F0', true: '#0C1829' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Midnight Navy CTA */}
          <TouchableOpacity
            onPress={handleSave}
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
            <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Save Alert Preferences
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
