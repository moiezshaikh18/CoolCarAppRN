// ============================================================
// Customer Details Screen — Screen 3 Style in media_1790116823022.png
// Modern Luxury Architectural Layout: 4-Box Metric Grid & Vehicles Fleet
// ============================================================

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Phone,
  MessageSquare,
  Car,
  FileText,
  Clock,
  MapPin,
  Layers,
  TrendingUp,
  CreditCard,
  Plus,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useCustomerStore } from '../../src/store/customerStore';
import { useVehicleStore } from '../../src/store/vehicleStore';
import { formatCurrency } from '../../src/utils/currency';
import { getInitials } from '../../src/utils/formatters';
import { router, useLocalSearchParams } from 'expo-router';

export default function CustomerDetailsScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { customers } = useCustomerStore();
  const { vehicles } = useVehicleStore();

  const customer = useMemo(() => {
    const found = customers.find((c) => c.id === params.id);
    if (found) return found;
    return {
      id: params.id ?? 'cust-1',
      name: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      email: 'ramesh.kumar@gmail.com',
      address: 'Shop 4, Workshop Lane, Andheri West',
      totalJobs: 12,
      totalSpent: 45600,
      totalPaid: 43300,
      pendingAmount: 2300,
      lastVisit: '10 May 2025',
      isActive: true,
    };
  }, [customers, params.id]);

  // Customer vehicles
  const customerVehicles = useMemo(() => {
    const matched = vehicles.filter((v) => v.customerId === customer.id);
    if (matched.length > 0) return matched;
    return [
      { id: 'v1', make: 'Maruti', model: 'Swift Dzire VXi', registrationNumber: 'MH02AB1234', fuelType: 'PETROL', modelYear: 2021 },
      { id: 'v2', make: 'Honda', model: 'City ZX', registrationNumber: 'MH01CD5678', fuelType: 'PETROL', modelYear: 2023 },
    ];
  }, [vehicles, customer.id]);

  const hasPending = (customer.pendingAmount ?? 0) > 0;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Top Floating Circular Header Bar (Screen 3 pattern) */}
      <View
        style={{
          paddingTop: insets.top + 12,
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
            backgroundColor: isDark ? '#1E2430' : '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0 : 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <ChevronLeft size={22} color={theme.text} strokeWidth={2.2} />
        </TouchableOpacity>

        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
          Customer Profile
        </Text>

        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${customer.phone}`)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? '#1E2430' : '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0 : 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Phone size={18} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
      >
        {/* HERO SHOWCASE CARD (Screen 3 pattern in warm sand) */}
        <View
          style={{
            backgroundColor: isDark ? '#1E2430' : '#EFECE6',
            borderRadius: 28,
            padding: 24,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.3 : 0.05,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: isDark ? '#141822' : '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 32, fontWeight: '900' }}>
              {getInitials(customer.name)}
            </Text>
          </View>

          <Text style={{ color: theme.text, fontSize: 24, fontWeight: '900' }}>
            {customer.name}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 4 }}>
            {customer.phone} {customer.address ? `• ${customer.address}` : ''}
          </Text>

          {/* Quick Communication Buttons */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${customer.phone}`)}
              style={{
                backgroundColor: isDark ? '#FFFFFF' : '#121214',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Phone size={14} color={isDark ? '#12141A' : '#FFFFFF'} />
              <Text style={{ color: isDark ? '#12141A' : '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                Call
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL(`sms:${customer.phone}`)}
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <MessageSquare size={14} color={theme.text} />
              <Text style={{ color: theme.text, fontSize: 13, fontWeight: '700' }}>
                SMS
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4-BOX METRICS GRID (Screen 3 style) */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {/* Box 1: Total Jobs */}
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <FileText size={18} color={theme.textMuted} />
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800', marginTop: 4 }}>
              {customer.totalJobs || 12}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', marginTop: 2 }}>
              Work Orders
            </Text>
          </View>

          {/* Box 2: Total Spent */}
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <TrendingUp size={18} color={theme.textMuted} />
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800', marginTop: 4 }}>
              {formatCurrency(customer.totalSpent || 45600, currencySymbol)}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', marginTop: 2 }}>
              Spent
            </Text>
          </View>

          {/* Box 3: Total Paid */}
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <CreditCard size={18} color="#10B981" />
            <Text style={{ color: '#10B981', fontSize: 14, fontWeight: '800', marginTop: 4 }}>
              {formatCurrency(customer.totalPaid ?? (customer.totalSpent - customer.pendingAmount), currencySymbol)}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', marginTop: 2 }}>
              Paid
            </Text>
          </View>

          {/* Box 4: Pending Due */}
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Clock size={18} color={hasPending ? '#EF4444' : '#10B981'} />
            <Text
              style={{
                color: hasPending ? '#EF4444' : '#10B981',
                fontSize: 14,
                fontWeight: '800',
                marginTop: 4,
              }}
            >
              {formatCurrency(customer.pendingAmount || 0, currencySymbol)}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', marginTop: 2 }}>
              Pending
            </Text>
          </View>
        </View>

        {/* VEHICLES OWNED (Screen 2/3 cards) */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
              Vehicles Owned ({customerVehicles.length})
            </Text>
            <TouchableOpacity onPress={() => router.push(`/vehicles/add?customerId=${customer.id}`)}>
              <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '700' }}>
                + Add Vehicle
              </Text>
            </TouchableOpacity>
          </View>

          {customerVehicles.map((v) => (
            <TouchableOpacity
              key={v.id}
              activeOpacity={0.88}
              onPress={() => router.push(`/vehicles/${v.id}` as any)}
              style={{
                backgroundColor: isDark ? '#1A1E27' : '#FFFFFF',
                borderRadius: 24,
                padding: 18,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: theme.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0 : 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: isDark ? '#27272A' : '#EFECE6',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Car size={20} color={theme.text} />
                  </View>

                  <View>
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                      {v.make ? `${v.make} ${v.model}` : v.model}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                      {v.fuelType} • Year {v.modelYear || 2022}
                    </Text>
                  </View>
                </View>

                {/* Indian Plate Chip */}
                <View
                  style={{
                    backgroundColor: isDark ? '#141822' : '#F4F2EE',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}
                >
                  <Text style={{ color: theme.text, fontSize: 12, fontWeight: '900', letterSpacing: 0.5 }}>
                    {v.registrationNumber}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* BOTTOM ACTION: CREATE JOB SHEET FOR THIS CUSTOMER */}
        <TouchableOpacity
          onPress={() => router.push('/job-sheets/create')}
          activeOpacity={0.9}
          style={{
            backgroundColor: isDark ? '#FFFFFF' : '#121214',
            height: 58,
            borderRadius: 29,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Plus size={18} color={isDark ? '#12141A' : '#FFFFFF'} strokeWidth={2.5} />
          <Text
            style={{
              color: isDark ? '#12141A' : '#FFFFFF',
              fontSize: 16,
              fontWeight: '800',
            }}
          >
            Create Job Sheet for Customer
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
