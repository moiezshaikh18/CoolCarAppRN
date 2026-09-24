// ============================================================
// Add Staff Screen — Register Mechanic / Helper
// Joining Date, Official Documents, Salary & Role
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
  FileText,
  CreditCard,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { Employee, SalaryType, OfficialDocType } from '../../src/types/employee.types';

const COMMON_ROLES = [
  'Head AC Mechanic',
  'AC Mechanic',
  'AC Helper',
  'Mechanical Technician',
  'Car Electrician',
  'Workshop Supervisor',
];

const DOC_TYPES: { label: string; value: OfficialDocType }[] = [
  { label: 'Aadhaar Card', value: 'AADHAAR' },
  { label: 'PAN Card', value: 'PAN' },
  { label: 'Driving License', value: 'DRIVING_LICENSE' },
  { label: 'Voter ID', value: 'VOTER_ID' },
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
  const [officialDocType, setOfficialDocType] = useState<OfficialDocType>('AADHAAR');
  const [officialDocNumber, setOfficialDocNumber] = useState('');
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
      joiningDate: joiningDate.trim() || new Date().toISOString().slice(0, 10),
      status: 'ACTIVE',
      officialDocType,
      officialDocNumber: officialDocNumber.trim(),
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

  const skyBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
  const inputBg = isDark ? '#141926' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Header */}
      <View
        style={{
          backgroundColor: skyBg,
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 22,
        }}
      >
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
            <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800' }}>
              Add Staff Member
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
              Cool Car Workshop Staff
            </Text>
          </View>
        </View>
      </View>

      {/* Form Sheet with ZERO Blue Bleed */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          marginTop: -14,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingTop: 20,
          paddingHorizontal: 20,
          overflow: 'hidden',
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
          {/* Card 1: Basic Info */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor,
              gap: 14,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Personal & Contact Details
            </Text>

            {/* Full Name */}
            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                Full Name *
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  height: 48,
                  gap: 10,
                  borderWidth: 1,
                  borderColor,
                }}
              >
                <User size={18} color={theme.textMuted} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Irfan Khan"
                  placeholderTextColor="#94A3B8"
                  style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: '700' }}
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                Mobile Number *
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  height: 48,
                  gap: 10,
                  borderWidth: 1,
                  borderColor,
                }}
              >
                <Phone size={18} color={theme.textMuted} />
                <Text style={{ color: theme.textSecondary, fontWeight: '700', fontSize: 14 }}>+91</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="98200 11223"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: '700' }}
                />
              </View>
            </View>

            {/* Role Selection */}
            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 8 }}>
                Job Role
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {COMMON_ROLES.map((r) => {
                  const isSel = r === role;
                  return (
                    <TouchableOpacity
                      key={r}
                      onPress={() => setRole(r)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 12,
                        backgroundColor: isSel
                          ? (isDark ? '#FFFFFF' : '#0F172A')
                          : (isDark ? '#1E293B' : '#F1F5F9'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '700',
                          color: isSel
                            ? (isDark ? '#0F172A' : '#FFFFFF')
                            : (isDark ? '#FFFFFF' : '#475569'),
                        }}
                      >
                        {r}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* Card 2: Official Document & Joining Date */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor,
              gap: 14,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Official Documents & Joining Date
            </Text>

            {/* Joining Date */}
            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                Joining Date (YYYY-MM-DD)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  height: 48,
                  gap: 10,
                  borderWidth: 1,
                  borderColor,
                }}
              >
                <Calendar size={18} color={theme.textMuted} />
                <TextInput
                  value={joiningDate}
                  onChangeText={setJoiningDate}
                  placeholder="2024-01-15"
                  placeholderTextColor="#94A3B8"
                  style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: '700' }}
                />
              </View>
            </View>

            {/* Document Type Selector */}
            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 8 }}>
                Document Type
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {DOC_TYPES.map((dt) => {
                  const isSel = dt.value === officialDocType;
                  return (
                    <TouchableOpacity
                      key={dt.value}
                      onPress={() => setOfficialDocType(dt.value)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 7,
                        borderRadius: 12,
                        backgroundColor: isSel
                          ? (isDark ? '#FFFFFF' : '#0F172A')
                          : (isDark ? '#1E293B' : '#F1F5F9'),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '700',
                          color: isSel
                            ? (isDark ? '#0F172A' : '#FFFFFF')
                            : (isDark ? '#FFFFFF' : '#475569'),
                        }}
                      >
                        {dt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Document Number */}
            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                Document Number (Aadhaar / PAN / DL)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  height: 48,
                  gap: 10,
                  borderWidth: 1,
                  borderColor,
                }}
              >
                <CreditCard size={18} color={theme.textMuted} />
                <TextInput
                  value={officialDocNumber}
                  onChangeText={setOfficialDocNumber}
                  placeholder="e.g. 4821 9081 2341 or ABCPS8912K"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                  style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: '700' }}
                />
              </View>
            </View>
          </View>

          {/* Card 3: Salary Terms */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              padding: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor,
              gap: 14,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Salary Structure
            </Text>

            {/* Type Toggle: Monthly vs Daily */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setSalaryType('MONTHLY')}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 14,
                  alignItems: 'center',
                  backgroundColor: salaryType === 'MONTHLY'
                    ? (isDark ? '#FFFFFF' : '#0F172A')
                    : (isDark ? '#1E293B' : '#F1F5F9'),
                }}
              >
                <Text
                  style={{
                    color: salaryType === 'MONTHLY'
                      ? (isDark ? '#0F172A' : '#FFFFFF')
                      : (isDark ? '#FFFFFF' : '#475569'),
                    fontWeight: '800',
                    fontSize: 13,
                  }}
                >
                  Monthly Salary
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSalaryType('DAILY')}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 14,
                  alignItems: 'center',
                  backgroundColor: salaryType === 'DAILY'
                    ? (isDark ? '#FFFFFF' : '#0F172A')
                    : (isDark ? '#1E293B' : '#F1F5F9'),
                }}
              >
                <Text
                  style={{
                    color: salaryType === 'DAILY'
                      ? (isDark ? '#0F172A' : '#FFFFFF')
                      : (isDark ? '#FFFFFF' : '#475569'),
                    fontWeight: '800',
                    fontSize: 13,
                  }}
                >
                  Daily Wage
                </Text>
              </TouchableOpacity>
            </View>

            {/* Salary Amount */}
            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                {salaryType === 'MONTHLY' ? 'Monthly Salary (₹)' : 'Daily Rate (₹)'}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  height: 52,
                  gap: 8,
                  borderWidth: 1,
                  borderColor,
                }}
              >
                <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: 18, fontWeight: '800' }}>
                  {currencySymbol}
                </Text>
                <TextInput
                  value={salaryAmount}
                  onChangeText={setSalaryAmount}
                  keyboardType="numeric"
                  placeholder="20000"
                  placeholderTextColor="#94A3B8"
                  style={{ flex: 1, color: theme.text, fontSize: 18, fontWeight: '800' }}
                />
              </View>
            </View>

            {/* Notes */}
            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                Notes / Skills
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="e.g. AC compressor, wiring, tools provided"
                placeholderTextColor="#94A3B8"
                style={{
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: theme.text,
                  fontSize: 13,
                  fontWeight: '600',
                  borderWidth: 1,
                  borderColor,
                }}
              />
            </View>
          </View>

          {/* Submit CTA */}
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.88}
            style={{
              backgroundColor: isDark ? '#FFFFFF' : '#0F172A',
              paddingVertical: 16,
              borderRadius: 22,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
            }}
          >
            <Text style={{ color: isDark ? '#0F172A' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Save Staff Member
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
