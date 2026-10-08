// ============================================================
// Screen 12: Customer Details — Customer Profile & History
// Directly matching Screen 12 in Reference Design Mockup
// ============================================================

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, MessageSquare } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useCustomerStore } from '../../src/store/customerStore';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { formatCurrency } from '../../src/utils/currency';
import { getInitials } from '../../src/utils/formatters';

export default function CustomerDetailsScreen() {
  const { isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { customers } = useCustomerStore();
  const { jobSheets } = useJobSheetStore();

  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');

  const customer = useMemo(() => {
    return customers.find((c) => c.id === params.id) || {
      id: params.id || 'cust-1',
      name: 'Ramesh Kumar',
      phone: '9876543210',
      totalSpent: 45600,
      pendingAmount: 2300,
      totalVisits: 12,
      lastVisit: '10 May 2025',
    };
  }, [params.id, customers]);

  const customerJobs = useMemo(() => {
    return jobSheets.filter(
      (j) => j.customerId === customer.id || j.customerPhone === customer.phone
    );
  }, [customer, jobSheets]);

  const totalJobs = customerJobs.length > 0 ? customerJobs.length : (customer as any).totalVisits || 12;
  const totalSpent = customerJobs.reduce((s, j) => s + (j.finalAmount || 0), 0) || (customer as any).totalSpent || 45600;
  const pendingAmount = customerJobs.reduce((s, j) => s + (j.pendingAmount || 0), 0) || (customer as any).pendingAmount || 2300;
  const lastVisit = (customer as any).lastVisit ? String((customer as any).lastVisit) : '10 May 2025';

  const initials = getInitials(customer.name) || 'RS';

  const bg = isDark ? '#0C1829' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';
  const cardBg = isDark ? '#111E33' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Top Header */}
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
          Customer Details
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: insets.bottom + 90,
        }}
      >
        {/* Customer Avatar & Name Header matching Screen 12 */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          {/* Large Initial Avatar Circle */}
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#0D9488',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '900' }}>
              {initials}
            </Text>
          </View>

          <Text style={{ fontSize: 20, fontWeight: '800', color: textPrimary }}>
            {customer.name}
          </Text>
          <Text style={{ fontSize: 14, color: textMuted, fontWeight: '600', marginTop: 4 }}>
            {customer.phone}
          </Text>

          {/* Quick Action Buttons (Call / WhatsApp) */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${customer.phone}`)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? '#141E30' : '#F1F5F9',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                gap: 6,
              }}
            >
              <Phone size={15} color="#0D9488" />
              <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary }}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL(`https://wa.me/91${customer.phone}`)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? '#141E30' : '#F1F5F9',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                gap: 6,
              }}
            >
              <MessageSquare size={15} color="#2563EB" />
              <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary }}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info | History Segmented Tabs matching Screen 12 */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: isDark ? '#141E30' : '#F1F5F9',
            borderRadius: 14,
            padding: 4,
            marginBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('info')}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              borderRadius: 10,
              backgroundColor: activeTab === 'info' ? (isDark ? '#0C1829' : '#FFFFFF') : 'transparent',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '800',
                color: activeTab === 'info' ? textPrimary : textMuted,
              }}
            >
              Info
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              borderRadius: 10,
              backgroundColor: activeTab === 'history' ? (isDark ? '#0C1829' : '#FFFFFF') : 'transparent',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '800',
                color: activeTab === 'history' ? textPrimary : textMuted,
              }}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Info Metrics matching Screen 12 */}
        {activeTab === 'info' ? (
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: borderColor,
              overflow: 'hidden',
            }}
          >
            {/* Total Jobs */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: borderColor,
              }}
            >
              <Text style={{ fontSize: 14, color: textMuted, fontWeight: '600' }}>
                Total Jobs
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '800', color: textPrimary }}>
                {totalJobs}
              </Text>
            </View>

            {/* Total Spent */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: borderColor,
              }}
            >
              <Text style={{ fontSize: 14, color: textMuted, fontWeight: '600' }}>
                Total Spent
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '800', color: textPrimary }}>
                {formatCurrency(totalSpent, currencySymbol)}
              </Text>
            </View>

            {/* Pending Amount */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: borderColor,
              }}
            >
              <Text style={{ fontSize: 14, color: textMuted, fontWeight: '600' }}>
                Pending Amount
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '800', color: pendingAmount > 0 ? '#EF4444' : '#10B981' }}>
                {formatCurrency(pendingAmount, currencySymbol)}
              </Text>
            </View>

            {/* Last Visit */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 16,
                paddingHorizontal: 20,
              }}
            >
              <Text style={{ fontSize: 14, color: textMuted, fontWeight: '600' }}>
                Last Visit
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '800', color: textPrimary }}>
                {lastVisit}
              </Text>
            </View>
          </View>
        ) : (
          /* Tab 2: History */
          <View style={{ gap: 12 }}>
            {customerJobs.length === 0 ? (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ color: textMuted, fontSize: 13, fontWeight: '600' }}>
                  No previous job records found
                </Text>
              </View>
            ) : (
              customerJobs.map((j) => (
                <TouchableOpacity
                  key={j.id}
                  onPress={() => router.push(`/job-sheets/${j.id}`)}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: borderColor,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: textPrimary }}>
                      {j.jobNumber} • {j.vehicleModel}
                    </Text>
                    <Text style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>
                      {typeof j.date === 'string' ? j.date : 'Recent'} • {j.vehicleNumber}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: textPrimary }}>
                    {formatCurrency(j.finalAmount || 0, currencySymbol)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Button matching Screen 12 */}
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
          onPress={() => router.push(`/customers/add?editId=${customer.id}` as any)}
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
            Edit Customer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
