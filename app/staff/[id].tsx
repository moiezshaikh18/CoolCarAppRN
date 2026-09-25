// ============================================================
// Staff Detail Screen — Profile, Official Documents, Salary & Advance History
// Plain Simple English Terms: Joining Date, Documents, Leaving Date
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
  Switch,
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
  CreditCard,
  FileText,
  UserX,
  CheckCircle2,
  Shield,
  ShieldCheck,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { formatCurrency } from '../../src/utils/currency';
import { ThemedAlert, ThemedAlertProps } from '../../src/components/common/ThemedAlert';
import { EmployeePrivileges } from '../../src/types/employee.types';
import PayStaffScreen from './pay';

export default function StaffDetailScreen() {
  const { theme, isDark } = useTheme();
  const { currencySymbol } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { getEmployeeById, getPaymentsByEmployeeId, markEmployeeAsLeft, updateEmployee } = useEmployeeStore();
  const staff = id && id !== 'pay' ? getEmployeeById(id) : undefined;
  const paymentHistory = id && id !== 'pay' ? getPaymentsByEmployeeId(id) : [];

  const [alertConfig, setAlertConfig] = useState<ThemedAlertProps>({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = (title: string, message: string, type: 'error' | 'warning' | 'success' | 'info' = 'warning', buttons?: any[]) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      buttons: buttons || [{ text: 'OK', style: 'default' }],
      onClose: () => setAlertConfig((prev) => ({ ...prev, visible: false })),
    });
  };

  const [privileges, setPrivileges] = useState<EmployeePrivileges>(
    staff?.privileges || {
      canCreateJobSheets: true,
      canRecordExpenses: staff?.role?.toLowerCase().includes('manager') ?? false,
      canManageChalans: true,
      canViewBankBalances: staff?.role?.toLowerCase().includes('manager') ?? false,
      canViewReports: false,
    }
  );

  const togglePrivilege = (key: keyof EmployeePrivileges) => {
    if (!staff) return;
    const updated = { ...privileges, [key]: !privileges[key] };
    setPrivileges(updated);
    updateEmployee(staff.id, { privileges: updated });
    showAlert('Privileges Updated', `Staff permissions for ${staff.name} saved.`, 'success');
  };

  if (id === 'pay') {
    return <PayStaffScreen />;
  }

  if (!staff) {
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#153580', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>Staff Member Not Found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 14 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleMarkAsLeft = () => {
    showAlert(
      'Mark as Ex-Staff?',
      `Are you sure ${staff.name} has left Cool Car workshop?`,
      'warning',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Left',
          style: 'destructive',
          onPress: () => {
            const today = new Date().toISOString().slice(0, 10);
            markEmployeeAsLeft(staff.id, today);
            showAlert('Status Updated', `${staff.name} marked as Ex-Employee (Left: ${today}).`, 'success');
          },
        },
      ]
    );
  };

  const hasAdvance = (staff.currentAdvance || 0) > 0;
  const isLeft = staff.status === 'LEFT';
  const skyBg = isDark ? '#000000' : '#153580';

  const sheetBg = isDark ? '#0A0D14' : '#F4F6F9';
  const cardBg = isDark ? '#141824' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(43,53,68,0.08)';


  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          backgroundColor: skyBg,
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 24,
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
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
            <View
              style={{
                backgroundColor: '#0C1829',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
                {staff.role}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: isLeft ? 'rgba(239, 68, 68, 0.3)' : 'rgba(52, 211, 153, 0.3)',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: isLeft ? '#FCA5A5' : '#6EE7B7', fontSize: 12, fontWeight: '800' }}>
                {isLeft ? `Left (${staff.leavingDate || 'Ex'})` : 'Active'}
              </Text>
            </View>
          </View>
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
          {/* Featured Midnight Navy Advance Balance Card */}
          <View
            style={{
              backgroundColor: '#0C1829',
              borderRadius: 28,
              padding: 22,
              marginBottom: 16,
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
              To be deducted against next salary payment
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

          {/* Official Document & Employment Dates Card */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 22,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor,
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Official Documents & Employment
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <CreditCard size={16} color={isDark ? '#60A5FA' : '#153580'} />
                <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600' }}>
                  {staff.officialDocType || 'Document'}:
                </Text>
              </View>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>
                {staff.officialDocNumber || 'Not Uploaded'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} color={isDark ? '#60A5FA' : '#153580'} />
                <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600' }}>
                  Joining Date:
                </Text>
              </View>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>
                {staff.joiningDate || 'N/A'}
              </Text>
            </View>

            {isLeft ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <UserX size={16} color="#EF4444" />
                  <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '600' }}>
                    Leaving Date:
                  </Text>
                </View>
                <Text style={{ color: '#EF4444', fontSize: 14, fontWeight: '800' }}>
                  {staff.leavingDate || 'Left'}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleMarkAsLeft}
                style={{
                  marginTop: 4,
                  paddingVertical: 8,
                  alignItems: 'center',
                  borderRadius: 12,
                  backgroundColor: isDark ? '#261414' : '#FEE2E2',
                }}
              >
                <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '800' }}>
                  Mark Staff as Left (Ex-Employee)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Action Buttons: Pay Salary / Give Advance */}
          {!isLeft && (
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
          )}

          {/* Admin Staff Privileges Card */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 22,
              padding: 16,
              marginBottom: 20,
              borderWidth: 1,
              borderColor,
              gap: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <ShieldCheck size={18} color={isDark ? '#60A5FA' : '#153580'} />
              <View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Staff Privileges (Admin Control)
                </Text>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>
                  Toggle what this employee can perform in the app
                </Text>
              </View>
            </View>

            {/* Toggle 1: Create Job Sheets */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text }}>
                Create & Edit Daily Job Sheets
              </Text>
              <Switch
                value={privileges.canCreateJobSheets}
                onValueChange={() => togglePrivilege('canCreateJobSheets')}
                trackColor={{ false: '#64748B', true: isDark ? '#60A5FA' : '#153580' }}
              />
            </View>

            {/* Toggle 2: Record Expenses */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text }}>
                Record Daily Workshop Expenses
              </Text>
              <Switch
                value={privileges.canRecordExpenses}
                onValueChange={() => togglePrivilege('canRecordExpenses')}
                trackColor={{ false: '#64748B', true: isDark ? '#60A5FA' : '#153580' }}
              />
            </View>

            {/* Toggle 3: Manage Purchase Chalans */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text }}>
                Manage Purchase Chalans & Parts
              </Text>
              <Switch
                value={privileges.canManageChalans}
                onValueChange={() => togglePrivilege('canManageChalans')}
                trackColor={{ false: '#64748B', true: isDark ? '#60A5FA' : '#153580' }}
              />
            </View>

            {/* Toggle 4: View Bank Balances */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text }}>
                View Bank Balances & Cash Counter
              </Text>
              <Switch
                value={privileges.canViewBankBalances}
                onValueChange={() => togglePrivilege('canViewBankBalances')}
                trackColor={{ false: '#64748B', true: isDark ? '#60A5FA' : '#153580' }}
              />
            </View>

            {/* Toggle 5: View Financial Reports */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.text }}>
                View Profit & Loss Reports
              </Text>
              <Switch
                value={privileges.canViewReports}
                onValueChange={() => togglePrivilege('canViewReports')}
                trackColor={{ false: '#64748B', true: isDark ? '#60A5FA' : '#153580' }}
              />
            </View>
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
                {'Tap "Pay Salary" or "Give Advance" to create first entry'}
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
                          {item.date} • {item.paymentMode} {item.bankAccountName ? `(${item.bankAccountName})` : ''}
                        </Text>
                        {item.notes ? (
                          <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2, fontStyle: 'italic' }}>
                            {`"${item.notes}"`}
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

      <ThemedAlert {...alertConfig} />
    </View>
  );
}
