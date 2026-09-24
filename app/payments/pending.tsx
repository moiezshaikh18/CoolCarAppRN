// ============================================================
// Pending Customer Balances Screen — Quick Operations Module
// Real-time Outstanding Udhari Ledger, Total Balance & One-Tap Collection
// Signboard Royal Blue (#153580) & Zero Blue Bleed Architecture
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Phone,
  Car,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { formatCurrency } from '../../src/utils/currency';

export default function PendingCustomerPaymentsScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { jobSheets } = useJobSheetStore();

  const [search, setSearch] = useState('');

  // Extract all jobs that have an unpaid balance
  const pendingJobs = useMemo(() => {
    return jobSheets.filter((job) => {
      const pending = job.pendingAmount !== undefined 
        ? job.pendingAmount 
        : Math.max(0, (job.finalAmount || 0) - (job.totalPaid || 0));
      return pending > 0;
    });
  }, [jobSheets]);

  // Total Outstanding Balance
  const totalOutstandingBalance = useMemo(() => {
    return pendingJobs.reduce((sum, job) => {
      const pending = job.pendingAmount !== undefined 
        ? job.pendingAmount 
        : Math.max(0, (job.finalAmount || 0) - (job.totalPaid || 0));
      return sum + pending;
    }, 0);
  }, [pendingJobs]);

  // Filtered List based on Search
  const filteredList = useMemo(() => {
    if (!search.trim()) return pendingJobs;
    const q = search.toLowerCase();
    return pendingJobs.filter((j) => {
      const matchName = j.customerName?.toLowerCase().includes(q);
      const matchPhone = j.customerPhone?.includes(q);
      const matchVeh = j.vehicleNumber?.toLowerCase().includes(q) || j.vehicleModel?.toLowerCase().includes(q);
      const matchJob = j.jobNumber?.toLowerCase().includes(q);
      return Boolean(matchName || matchPhone || matchVeh || matchJob);
    });
  }, [pendingJobs, search]);

  const skyBg = isDark ? '#181A20' : '#153580';
  const sheetBg = isDark ? '#181A20' : '#F4F6F9';
  const cardBg = isDark ? '#242834' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          backgroundColor: skyBg,
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 22,
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
                Pending Customer Dues
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
                Customer Udhari & Outstanding Collections
              </Text>
            </View>
          </View>
        </View>

        {/* Search Pill */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#141926' : 'rgba(255,255,255,0.24)',
            borderRadius: 22,
            paddingHorizontal: 16,
            height: 48,
            gap: 10,
          }}
        >
          <Search size={18} color={isDark ? '#94A3B8' : 'rgba(255,255,255,0.85)'} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search customer, phone, car number..."
            placeholderTextColor={isDark ? '#64748B' : 'rgba(255,255,255,0.7)'}
            style={{ flex: 1, color: '#FFFFFF', fontSize: 14, fontWeight: '500' }}
          />
        </View>
      </View>

      {/* Signature Mega-Curved Lower Content Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          marginTop: -14,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 }}
        >
          {/* Top Outstanding Master Card */}
          <View
            style={{
              backgroundColor: '#0C1829',
              borderRadius: 26,
              padding: 20,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Total Outstanding Customer Due
              </Text>
              <View
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.25)',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: '#FCA5A5', fontSize: 11, fontWeight: '800' }}>
                  {pendingJobs.length} Customers
                </Text>
              </View>
            </View>

            <Text style={{ color: '#EF4444', fontSize: 34, fontWeight: '900', letterSpacing: -0.5 }}>
              {formatCurrency(totalOutstandingBalance, currencySymbol)}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' }}>
              <Clock size={14} color="rgba(255,255,255,0.6)" />
              <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, fontWeight: '600' }}>
                Tap any customer below to record full or partial payment
              </Text>
            </View>
          </View>

          {/* Section Heading */}
          <Text
            style={{
              color: '#64748B',
              fontSize: 12,
              fontWeight: '800',
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 12,
              paddingLeft: 4,
            }}
          >
            Customers with Pending Balances ({filteredList.length})
          </Text>

          {/* List of Pending Customers */}
          {filteredList.length === 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 50,
                backgroundColor: cardBg,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: cardBorder,
                paddingHorizontal: 20,
              }}
            >
              <CheckCircle2 size={44} color="#10B981" />
              <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text, marginTop: 12 }}>
                {search ? 'No matching customer found' : 'All Customer Balances Cleared!'}
              </Text>
              <Text style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center', marginTop: 4 }}>
                {search ? 'Try checking the name or phone number' : 'There are currently no unpaid work orders or customer udhari.'}
              </Text>
            </View>
          ) : (
            <View style={{ gap: 14 }}>
              {filteredList.map((job) => {
                const pending = job.pendingAmount !== undefined 
                  ? job.pendingAmount 
                  : Math.max(0, (job.finalAmount || 0) - (job.totalPaid || 0));

                return (
                  <View
                    key={job.id}
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: 22,
                      padding: 18,
                      borderWidth: 1,
                      borderColor: cardBorder,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.25 : 0.04,
                      shadowRadius: 8,
                      elevation: 2,
                    }}
                  >
                    {/* Header: Customer Name & Call Icon */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }}>
                          {job.customerName || 'Walk-in Customer'}
                        </Text>
                        <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
                          Job #{job.jobNumber || 'CCG'} • {typeof job.date === 'string' ? job.date.slice(0, 10) : 'Today'}
                        </Text>
                      </View>

                      {job.customerPhone ? (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(`tel:${job.customerPhone}`)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: isDark ? '#1C2538' : '#EFF6FF',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Phone size={16} color="#153580" />
                        </TouchableOpacity>
                      ) : null}
                    </View>

                    {/* Vehicle Plate & Model */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        backgroundColor: isDark ? '#1C2538' : '#F8FAFC',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 14,
                        marginBottom: 14,
                      }}
                    >
                      <Car size={15} color="#64748B" />
                      <Text style={{ fontSize: 12, fontWeight: '800', color: theme.text }}>
                        {job.vehicleNumber || 'NO PLATE'}
                      </Text>
                      <Text style={{ fontSize: 12, color: theme.textMuted, flex: 1 }} numberOfLines={1}>
                        • {job.vehicleModel || 'Vehicle'}
                      </Text>
                    </View>

                    {/* Financial Row: Total Bill, Paid, and Outstanding */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 10,
                        borderTopWidth: 1,
                        borderTopColor: cardBorder,
                        marginBottom: 14,
                      }}
                    >
                      <View>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                          Total Bill
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: theme.text, marginTop: 2 }}>
                          {formatCurrency(job.finalAmount || 0, currencySymbol)}
                        </Text>
                      </View>

                      <View>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                          Paid So Far
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: '#10B981', marginTop: 2 }}>
                          {formatCurrency(job.totalPaid || 0, currencySymbol)}
                        </Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#EF4444', textTransform: 'uppercase' }}>
                          Balance Due
                        </Text>
                        <Text style={{ fontSize: 17, fontWeight: '900', color: '#EF4444', marginTop: 2 }}>
                          {formatCurrency(pending, currencySymbol)}
                        </Text>
                      </View>
                    </View>

                    {/* Action Button: Collect Payment */}
                    <TouchableOpacity
                      onPress={() => router.push(`/job-sheets/${job.id}`)}
                      activeOpacity={0.88}
                      style={{
                        backgroundColor: '#153580',
                        borderRadius: 16,
                        paddingVertical: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>
                        Collect Payment ({formatCurrency(pending, currencySymbol)})
                      </Text>
                      <ArrowRight size={16} color="#FFFFFF" />
                    </TouchableOpacity>
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

