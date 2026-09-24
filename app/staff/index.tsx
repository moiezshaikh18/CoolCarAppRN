// ============================================================
// Staff & Salary List Screen — Cool Car AC Repair
// Plain Simple English Terms & Advance Tracking
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Plus,
  User,
  Phone,
  Banknote,
  DollarSign,
  ChevronRight,
  Wrench,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { formatCurrency } from '../../src/utils/currency';
import { Employee } from '../../src/types/employee.types';

export default function StaffListScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { employees } = useEmployeeStore();

  const [search, setSearch] = useState('');

  // Calculations
  const totalStaff = employees.filter((e) => e.isActive).length;
  const totalAdvances = employees.reduce((sum, e) => sum + (e.currentAdvance || 0), 0);
  const totalMonthlyPayroll = employees.reduce(
    (sum, e) => sum + (e.salaryType === 'MONTHLY' ? e.salaryAmount : e.salaryAmount * 26),
    0
  );

  const filteredStaff = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter(
      (e) => e.name.toLowerCase().includes(q) || e.phone.includes(q) || e.role.toLowerCase().includes(q)
    );
  }, [employees, search]);

  const skyBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
  const inputBg = isDark ? '#141926' : '#F8FAFC';
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
          paddingBottom: 20,
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
                Staff & Salary
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
                Cool Car Workshop Mechanics & Payroll
              </Text>
            </View>
          </View>
        </View>

        {/* Search Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#141926' : 'rgba(255,255,255,0.24)',
            borderRadius: 22,
            paddingHorizontal: 16,
            height: 48,
            gap: 10,
            marginBottom: 12,
          }}
        >
          <Search size={18} color={isDark ? '#94A3B8' : 'rgba(255,255,255,0.85)'} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search staff by name, role, phone..."
            placeholderTextColor={isDark ? '#64748B' : 'rgba(255,255,255,0.7)'}
            style={{ flex: 1, color: '#FFFFFF', fontSize: 14, fontWeight: '500' }}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* 2-Pill Mini Overview */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 18,
              paddingVertical: 10,
              paddingHorizontal: 14,
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' }}>Active Staff</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900', marginTop: 2 }}>
              {totalStaff} Members
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 18,
              paddingVertical: 10,
              paddingHorizontal: 14,
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' }}>Total Advance Given</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900', marginTop: 2 }}>
              {formatCurrency(totalAdvances, currencySymbol)}
            </Text>
          </View>
        </View>
      </View>

      {/* Signature Lower Content Sheet */}
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
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 110 }}
        >
          <View style={{ gap: 14 }}>
            {filteredStaff.map((staff) => {
              const hasAdvance = (staff.currentAdvance || 0) > 0;
              return (
                <View
                  key={staff.id}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 24,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: borderColor,
                    shadowColor: '#000',
                    shadowOpacity: isDark ? 0.3 : 0.04,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 2,
                  }}
                >
                  {/* Top: Name & Role Badge */}
                  <TouchableOpacity
                    onPress={() => router.push(`/staff/${staff.id}` as any)}
                    activeOpacity={0.8}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: isDark ? '#141926' : '#EFF6FF',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <User size={22} color={isDark ? '#FFFFFF' : '#3B82F6'} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: theme.text, fontSize: 17, fontWeight: '800' }}>
                          {staff.name}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                          <View
                            style={{
                              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 8,
                            }}
                          >
                            <Text style={{ color: isDark ? '#60A5FA' : '#1D4ED8', fontSize: 11, fontWeight: '700' }}>
                              {staff.role}
                            </Text>
                          </View>
                          <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                            {staff.phone}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <ChevronRight size={18} color={theme.textMuted} />
                  </TouchableOpacity>

                  {/* Financial Overview Row: Salary & Advance Status */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: inputBg,
                      borderRadius: 16,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      marginBottom: 12,
                    }}
                  >
                    <View>
                      <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Salary Rate</Text>
                      <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800', marginTop: 2 }}>
                        {formatCurrency(staff.salaryAmount, currencySymbol)}{' '}
                        <Text style={{ fontSize: 12, fontWeight: '600', color: theme.textMuted }}>
                          / {staff.salaryType === 'MONTHLY' ? 'Month' : 'Day'}
                        </Text>
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>Advance Balance</Text>
                      <View
                        style={{
                          backgroundColor: hasAdvance ? (isDark ? '#450A0A' : '#FEE2E2') : (isDark ? '#064E3B' : '#DCFCE7'),
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 8,
                          marginTop: 2,
                        }}
                      >
                        <Text
                          style={{
                            color: hasAdvance ? (isDark ? '#F87171' : '#DC2626') : (isDark ? '#34D399' : '#15803D'),
                            fontSize: 12,
                            fontWeight: '800',
                          }}
                        >
                          {hasAdvance ? `${formatCurrency(staff.currentAdvance, currencySymbol)} Advance` : 'No Advance'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* 2 Direct Action Buttons: Pay Salary & Give Advance */}
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                      onPress={() => router.push({ pathname: '/staff/pay', params: { staffId: staff.id, defaultType: 'SALARY' } } as any)}
                      activeOpacity={0.85}
                      style={{
                        flex: 1,
                        backgroundColor: '#0C1829',
                        paddingVertical: 12,
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Banknote size={15} color="#FFFFFF" />
                      <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                        Pay Salary
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.push({ pathname: '/staff/pay', params: { staffId: staff.id, defaultType: 'ADVANCE' } } as any)}
                      activeOpacity={0.85}
                      style={{
                        flex: 1,
                        backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                        borderWidth: 1,
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#BFDBFE',
                        paddingVertical: 12,
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <DollarSign size={15} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                      <Text style={{ color: isDark ? '#60A5FA' : '#1D4ED8', fontSize: 13, fontWeight: '800' }}>
                        Give Advance
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Floating Midnight Navy CTA: Add New Staff */}
        <View style={{ position: 'absolute', bottom: Math.max(insets.bottom + 10, 20), left: 20, right: 20 }}>
          <TouchableOpacity
            onPress={() => router.push('/staff/add')}
            activeOpacity={0.88}
            style={{
              backgroundColor: '#0C1829',
              paddingVertical: 16,
              borderRadius: 32,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 5 },
              elevation: 6,
            }}
          >
            <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Add New Staff Member
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

