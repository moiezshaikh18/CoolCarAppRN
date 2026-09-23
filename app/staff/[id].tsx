// ============================================================
// Staff Detail Screen — Profile, Salary & Advance History
// Plain Simple English Terms
// ============================================================

import React from 'react';
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
import {
  ArrowLeft,
  User,
  Phone,
  Banknote,
  DollarSign,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { formatCurrency } from '../../src/utils/currency';

export default function StaffDetailScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { getEmployeeById, getPaymentsByEmployeeId } = useEmployeeStore();
  const staff = getEmployeeById(id);
  const paymentHistory = getPaymentsByEmployeeId(id);

  if (!staff) {
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? '#070A0F' : '#6B9FE8', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>Staff Member Not Found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 14 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasAdvance = (staff.currentAdvance || 0) > 0;
  const skyBg = isDark ? '#070A0F' : '#6B9FE8';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: skyBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
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

          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
            Staff Profile
          </Text>

          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${staff.phone}`)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255,255,255,0.22)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Phone size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Card Header */}
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: 'rgba(255,255,255,0.22)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <User size={32} color="#FFFFFF" />
          </View>
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900' }}>
            {staff.name}
          </Text>
          <View
            style={{
              backgroundColor: '#0C1829',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
              marginTop: 6,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
              {staff.role}
            </Text>
          </View>
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
          {/* Featured Midnight Navy Advance Balance Card */}
          <View
            style={{
              backgroundColor: '#0C1829',
              borderRadius: 28,
              padding: 22,
              marginBottom: 18,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Current Advance Balance
              </Text>
              <View
                style={{
                  backgroundColor: hasAdvance ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0, 200, 150, 0.25)',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: hasAdvance ? '#F87171' : '#00C896', fontSize: 11, fontWeight: '800' }}>
                  {hasAdvance ? 'Advance Due' : 'All Clear'}
                </Text>
              </View>
            </View>

            <Text style={{ color: '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: -1, marginTop: 8 }}>
              {formatCurrency(staff.currentAdvance || 0, currencySymbol)}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>
              To be adjusted against next monthly salary payment
            </Text>

            {/* Quick 2-Grid Specs */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' }}>Salary Rate</Text>
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginTop: 2 }}>
                  {formatCurrency(staff.salaryAmount, currencySymbol)} / {staff.salaryType === 'MONTHLY' ? 'Mo' : 'Day'}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' }}>Total Paid Lifetime</Text>
                <Text style={{ color: '#00C896', fontSize: 15, fontWeight: '800', marginTop: 2 }}>
                  {formatCurrency(staff.totalPaidSalary || 0, currencySymbol)}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/staff/pay', params: { staffId: staff.id, defaultType: 'SALARY' } } as any)}
              activeOpacity={0.88}
              style={{
                flex: 1,
                backgroundColor: '#0C1829',
                paddingVertical: 14,
                borderRadius: 22,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                shadowColor: '#000',
                shadowOpacity: 0.25,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              }}
            >
              <Banknote size={17} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>
                Pay Salary
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push({ pathname: '/staff/pay', params: { staffId: staff.id, defaultType: 'ADVANCE' } } as any)}
              activeOpacity={0.88}
              style={{
                flex: 1,
                backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#BFDBFE',
                paddingVertical: 14,
                borderRadius: 22,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <DollarSign size={17} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              <Text style={{ color: isDark ? '#60A5FA' : '#1D4ED8', fontSize: 14, fontWeight: '800' }}>
                Give Advance
              </Text>
            </TouchableOpacity>
          </View>

          {/* Payment History Ledger */}
          <Text
            style={{
              color: theme.textMuted,
              fontSize: 11,
              fontWeight: '800',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 12,
              paddingLeft: 4,
            }}
          >
            Salary & Advance History ({paymentHistory.length})
          </Text>

          {paymentHistory.length === 0 ? (
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 22,
                padding: 24,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <FileText size={32} color={theme.textMuted} />
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700', marginTop: 8 }}>
                No Payment Records Yet
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                Tap "Pay Salary" or "Give Advance" to create first entry
              </Text>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {paymentHistory.map((item) => {
                const isAdvance = item.type === 'ADVANCE';
                return (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: 20,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: borderColor,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: isAdvance
                            ? (isDark ? '#450A0A' : '#FEE2E2')
                            : (isDark ? '#064E3B' : '#DCFCE7'),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isAdvance ? (
                          <DollarSign size={20} color={isDark ? '#F87171' : '#DC2626'} />
                        ) : (
                          <Banknote size={20} color={isDark ? '#34D399' : '#15803D'} />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                          {isAdvance ? 'Advance Given' : `Salary (${item.forMonth || 'Month'})`}
                        </Text>
                        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                          {item.date} • Paid via {item.paymentMode}
                        </Text>
                        {item.notes ? (
                          <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2, fontStyle: 'italic' }}>
                            "{item.notes}"
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    <Text
                      style={{
                        color: isAdvance ? (isDark ? '#F87171' : '#DC2626') : (isDark ? '#34D399' : '#15803D'),
                        fontSize: 16,
                        fontWeight: '900',
                      }}
                    >
                      {formatCurrency(item.amount, currencySymbol)}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
