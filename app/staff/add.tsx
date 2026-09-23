// ============================================================
// Add Staff Screen — Register Mechanic / Helper
// Plain Simple English Terms
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  User,
  Phone,
  Check,
  Calendar,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { Employee, SalaryType } from '../../src/types/employee.types';

const COMMON_ROLES = [
  'Head AC Mechanic',
  'AC Mechanic',
  'AC Helper',
  'Car Electrician',
  'Fitter',
  'Workshop Supervisor',
];

export default function AddStaffScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId, currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { addEmployee } = useEmployeeStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(COMMON_ROLES[0]);
  const [salaryType, setSalaryType] = useState<SalaryType>('MONTHLY');
  const [salaryAmount, setSalaryAmount] = useState('20000');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter staff member name');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit mobile number');
      return;
    }
    const salaryNum = parseFloat(salaryAmount.replace(/[^0-9.]/g, ''));
    if (isNaN(salaryNum) || salaryNum <= 0) {
      Alert.alert('Invalid Salary', 'Please enter a valid salary amount');
      return;
    }

    const newStaff: Employee = {
      id: `emp-${Date.now()}`,
      enterpriseId: enterpriseId || 'enterprise-cool-car',
      name: name.trim(),
      phone: `+91 ${cleanPhone.slice(-10)}`,
      role,
      salaryType,
      salaryAmount: salaryNum,
      joiningDate,
      currentAdvance: 0,
      totalPaidSalary: 0,
      isActive: true,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addEmployee(newStaff);

    Alert.alert('Staff Added', `${newStaff.name} registered as ${newStaff.role}!`, [
      { text: 'Done', onPress: () => router.back() },
    ]);
  };

  const skyBg = isDark ? '#070A0F' : '#6B9FE8';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
  const inputBg = isDark ? '#141926' : '#F8FAFC';
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
            Add Staff Member
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
            Register new mechanic or helper
          </Text>
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
          <View style={{ gap: 16 }}>
            {/* Basic Info Card */}
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: borderColor,
                gap: 16,
              }}
            >
              {/* Full Name */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  FULL NAME *
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: inputBg,
                    borderRadius: 18,
                    paddingHorizontal: 16,
                    height: 52,
                    gap: 12,
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                >
                  <User size={18} color={theme.textMuted} />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Irfan Khan"
                    placeholderTextColor={theme.textMuted}
                    style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                  />
                </View>
              </View>

              {/* Phone Number */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  PHONE NUMBER *
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: inputBg,
                    borderRadius: 18,
                    paddingHorizontal: 16,
                    height: 52,
                    gap: 12,
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                >
                  <Phone size={18} color={theme.textMuted} />
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>+91</Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="98200 11223"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="phone-pad"
                    maxLength={10}
                    style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '600' }}
                  />
                </View>
              </View>

              {/* Job Role Selection */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  JOB ROLE / WORK TYPE
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {COMMON_ROLES.map((r) => {
                    const isSelected = role === r;
                    return (
                      <TouchableOpacity
                        key={r}
                        onPress={() => setRole(r)}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderRadius: 16,
                          backgroundColor: isSelected ? '#0C1829' : inputBg,
                        }}
                      >
                        <Text style={{ color: isSelected ? '#FFFFFF' : theme.text, fontSize: 13, fontWeight: '700' }}>
                          {r}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            {/* Salary Setup Card */}
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: borderColor,
                gap: 16,
              }}
            >
              {/* Salary Type Toggle */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  SALARY PAYMENT TYPE
                </Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => setSalaryType('MONTHLY')}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 18,
                      alignItems: 'center',
                      backgroundColor: salaryType === 'MONTHLY' ? '#0C1829' : inputBg,
                    }}
                  >
                    <Text style={{ color: salaryType === 'MONTHLY' ? '#FFFFFF' : theme.text, fontSize: 14, fontWeight: '700' }}>
                      Monthly Salary
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSalaryType('DAILY')}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 18,
                      alignItems: 'center',
                      backgroundColor: salaryType === 'DAILY' ? '#0C1829' : inputBg,
                    }}
                  >
                    <Text style={{ color: salaryType === 'DAILY' ? '#FFFFFF' : theme.text, fontSize: 14, fontWeight: '700' }}>
                      Daily Wage
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Fixed Salary Amount */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  SALARY AMOUNT ({currencySymbol}) *
                </Text>
                <TextInput
                  value={salaryAmount}
                  onChangeText={setSalaryAmount}
                  placeholder={salaryType === 'MONTHLY' ? '20000' : '700'}
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 18,
                    paddingHorizontal: 16,
                    height: 52,
                    color: theme.text,
                    fontSize: 16,
                    fontWeight: '800',
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                />
              </View>

              {/* Joining Date */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  JOINING DATE
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: inputBg,
                    borderRadius: 18,
                    paddingHorizontal: 16,
                    height: 52,
                    gap: 12,
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                >
                  <Calendar size={18} color={theme.textMuted} />
                  <TextInput
                    value={joiningDate}
                    onChangeText={setJoiningDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={theme.textMuted}
                    style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: '600' }}
                  />
                </View>
              </View>

              {/* Notes */}
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
                  SKILLS & NOTES
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="e.g. Expert in compressor overhaul and wiring"
                  placeholderTextColor={theme.textMuted}
                  multiline
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 18,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    minHeight: 70,
                    color: theme.text,
                    fontSize: 14,
                    textAlignVertical: 'top',
                    fontWeight: '500',
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                />
              </View>
            </View>

            {/* Midnight Navy Submit CTA */}
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
                Save Staff Member
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
