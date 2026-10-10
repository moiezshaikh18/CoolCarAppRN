// ============================================================
// Users & Roles Screen — Master Prompt Section 7
// Multi-Tenant RBAC: OWNER, ADMIN, MANAGER, ACCOUNTANT, EMPLOYEE
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Shield,
  UserPlus,
  User,
  Phone,
  CheckCircle2,
  Trash2,
  Plus,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { useAuthStore } from '../../src/store/authStore';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { UserRole } from '../../src/types/enterprise.types';
import { formatRoleLabel } from '../../src/utils/formatters';
import { Employee } from '../../src/types/employee.types';
import {
  getDynamicOwners,
  addDynamicOwner,
  removeDynamicOwner,
  RegisteredOwner,
  normalizePhone10,
  formatIndianPhone,
  BASELINE_OWNER_NUMBERS,
} from '../../src/services/authWhitelist.service';

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  isBaseline?: boolean;
}

const ROLES: { role: UserRole; label: string; desc: string }[] = [
  { role: 'OWNER', label: 'Owner', desc: 'Full unrestricted access & billing' },
  { role: 'ADMIN', label: 'Admin', desc: 'Business & operations management' },
  { role: 'MANAGER', label: 'Manager', desc: 'Job sheets, customers, expenses & inventory' },
  { role: 'ACCOUNTANT', label: 'Accountant', desc: 'Payments, bank accounts & reports' },
  { role: 'EMPLOYEE', label: 'Employee', desc: 'Work order job sheets & vehicle lookup' },
];

export default function UsersRolesScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { activeEnterprise } = useEnterpriseStore();
  const { user } = useAuthStore();
  const { employees, setEmployees, addEmployee, deleteEmployee } = useEmployeeStore();

  const [ownersList, setOwnersList] = useState<RegisteredOwner[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('EMPLOYEE');

  // Sync Dynamic Owners from Firestore
  useEffect(() => {
    const entId = activeEnterprise?.id || 'enterprise-cool-car';
    getDynamicOwners(entId).then((owners) => {
      setOwnersList(owners);
    });
  }, [activeEnterprise?.id]);

  // Live Firestore Sync for Employees
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const fetchTeam = async () => {
      try {
        const entId = activeEnterprise?.id || 'enterprise-cool-car';
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');

        const staffRef = collection(db, 'enterprises', entId, 'employees');
        unsubscribe = onSnapshot(staffRef, (snap) => {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Employee));
          setEmployees(list);
        });
      } catch (err) {
        console.log('[UsersRoles] Firestore sync notice:', err);
      }
    };
    fetchTeam();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeEnterprise?.id, setEmployees]);

  // Unified Team Members (Dynamic Owners + Registered Employees)
  const members: TeamMember[] = useMemo(() => {
    const list: TeamMember[] = [];
    const myPhone10 = normalizePhone10(user?.phone || '');

    // 1. Dynamic & Baseline Owners
    const ownersToShow = ownersList.length > 0 ? ownersList : BASELINE_OWNER_NUMBERS.map((b) => ({
      id: `owner-base-${b.phone}`,
      phone: b.phone,
      formattedPhone: formatIndianPhone(b.phone),
      name: b.name,
      role: 'OWNER' as const,
      isActive: true,
      createdAt: '2026-01-01',
    }));

    ownersToShow.forEach((owner) => {
      const isMe = normalizePhone10(owner.phone) === myPhone10;
      const isBase = BASELINE_OWNER_NUMBERS.some((b) => b.phone === normalizePhone10(owner.phone));
      list.push({
        id: owner.id,
        name: isMe ? `${owner.name} (You)` : owner.name,
        phone: owner.formattedPhone,
        role: 'OWNER',
        isActive: true,
        isBaseline: isBase,
      });
    });

    // 2. Registered Employees
    employees.forEach((emp) => {
      let role: UserRole = 'EMPLOYEE';
      if (emp.role?.toLowerCase().includes('manager')) role = 'MANAGER';
      else if (emp.role?.toLowerCase().includes('admin')) role = 'ADMIN';
      else if (emp.role?.toLowerCase().includes('account')) role = 'ACCOUNTANT';
      else if (emp.privileges?.canViewReports) role = 'MANAGER';

      list.push({
        id: emp.id,
        name: emp.name,
        phone: emp.phone,
        role,
        isActive: emp.isActive !== false,
      });
    });

    return list;
  }, [user, ownersList, employees]);

  const handleAddMember = async () => {
    if (!newName.trim()) {
      Alert.alert('Required', 'Please enter staff member or owner name');
      return;
    }
    if (!newPhone.trim() || newPhone.replace(/\D/g, '').length < 10) {
      Alert.alert('Required', 'Please enter valid 10-digit mobile number');
      return;
    }

    const clean10 = normalizePhone10(newPhone);
    const entId = activeEnterprise?.id || 'enterprise-cool-car';

    // Adding a new Owner dynamically
    if (newRole === 'OWNER') {
      try {
        const addedOwner = await addDynamicOwner(clean10, newName.trim(), entId);
        setOwnersList((prev) => [
          ...prev.filter((o) => normalizePhone10(o.phone) !== clean10),
          addedOwner,
        ]);
        setNewName('');
        setNewPhone('');
        setNewRole('EMPLOYEE');
        setModalVisible(false);
        Alert.alert(
          'Owner Added 👑',
          `${newName.trim()} (+91 ${clean10}) has been registered as Workshop Owner in Firestore. They can now log in with full owner privileges.`
        );
        return;
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to add owner.');
        return;
      }
    }

    // Adding a new Employee / Staff Member
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      enterpriseId: entId,
      name: newName.trim(),
      phone: `+91 ${clean10}`,
      role:
        newRole === 'MANAGER'
          ? 'Workshop Manager'
          : newRole === 'ACCOUNTANT'
          ? 'Accountant'
          : newRole === 'ADMIN'
          ? 'Workshop Admin'
          : 'Mechanic / Technician',
      salaryType: 'MONTHLY',
      salaryAmount: 20000,
      joiningDate: new Date().toISOString().slice(0, 10),
      status: 'ACTIVE',
      officialDocType: 'AADHAAR',
      officialDocNumber: '',
      currentAdvance: 0,
      totalPaidSalary: 0,
      isActive: true,
      privileges: {
        canCreateJobSheets: true,
        canRecordExpenses:
          newRole === 'ADMIN' || newRole === 'MANAGER' || newRole === 'ACCOUNTANT',
        canManageChalans: newRole === 'ADMIN' || newRole === 'MANAGER',
        canViewBankBalances: newRole === 'ADMIN' || newRole === 'ACCOUNTANT',
        canViewReports: newRole === 'ADMIN' || newRole === 'ACCOUNTANT',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addEmployee(newEmployee);

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      await setDoc(doc(db, 'enterprises', entId, 'employees', newEmployee.id), newEmployee);
    } catch (err) {
      console.log('[UsersRoles] Cloud sync notice:', err);
    }

    setNewName('');
    setNewPhone('');
    setNewRole('EMPLOYEE');
    setModalVisible(false);
    Alert.alert('Added', `${newEmployee.name} registered as ${formatRoleLabel(newRole)}.`);
  };

  const handleRemoveMember = (id: string, name: string, phone: string, role: UserRole) => {
    const cleanPhone = normalizePhone10(phone);
    const currentUserPhone = normalizePhone10(user?.phone || '');

    if (role === 'OWNER') {
      if (cleanPhone === currentUserPhone) {
        Alert.alert('Action Restricted', 'You cannot remove your own active owner account.');
        return;
      }
      if (BASELINE_OWNER_NUMBERS.some((b) => b.phone === cleanPhone)) {
        Alert.alert('Action Restricted', 'Baseline workshop owner account cannot be deleted.');
        return;
      }
      Alert.alert(
        'Revoke Owner Access',
        `Are you sure you want to remove ${name} as Workshop Owner? They will no longer be authorized to log in.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Revoke',
            style: 'destructive',
            onPress: async () => {
              try {
                const entId = activeEnterprise?.id || 'enterprise-cool-car';
                await removeDynamicOwner(cleanPhone, entId);
                setOwnersList((prev) =>
                  prev.filter((o) => normalizePhone10(o.phone) !== cleanPhone)
                );
                Alert.alert('Revoked', `${name} owner access has been revoked.`);
              } catch (err: any) {
                Alert.alert('Error', err.message || 'Failed to remove owner.');
              }
            },
          },
        ]
      );
      return;
    }

    Alert.alert('Remove Team Member', `Are you sure you want to revoke access and delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Revoke',
        style: 'destructive',
        onPress: async () => {
          deleteEmployee(id);
          try {
            const entId = activeEnterprise?.id || 'enterprise-cool-car';
            const { doc, deleteDoc } = await import('firebase/firestore');
            const { db } = await import('../../src/services/firebase/firebase.config');
            await deleteDoc(doc(db, 'enterprises', entId, 'employees', id));
          } catch (err) {
            console.log('[UsersRoles] Delete notice:', err);
          }
        },
      },
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

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          backgroundColor: skyBg,
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
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
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
              Staff & Roles
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
              Workshop permission levels
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#0C1829',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <UserPlus size={18} color="#FFFFFF" />
        </TouchableOpacity>
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
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 110 }}
        >
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
            Active Workshop Staff ({members.length})
          </Text>

          {/* Members List */}
          <View style={{ gap: 12 }}>
            {members.map((member) => {
              const isOwner = member.role === 'OWNER';
              return (
                <View
                  key={member.id}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 24,
                    padding: 18,
                    borderWidth: 1,
                    borderColor: borderColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    shadowColor: '#000',
                    shadowOpacity: isDark ? 0.3 : 0.04,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 2,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
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
                      <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                        {member.name}
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>
                        {member.phone}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 8,
                            backgroundColor: isOwner ? (isDark ? '#3B2F04' : '#FEF3C7') : (isDark ? '#1E293B' : '#F1F5F9'),
                          }}
                        >
                          <Text
                            style={{
                              color: isOwner ? (isDark ? '#FBBF24' : '#B45309') : (isDark ? '#60A5FA' : '#1D4ED8'),
                              fontSize: 11,
                              fontWeight: '700',
                            }}
                          >
                            {formatRoleLabel(member.role)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {(!member.isBaseline && !member.name.includes('(You)')) && (
                    <TouchableOpacity
                      onPress={() =>
                        handleRemoveMember(member.id, member.name, member.phone, member.role)
                      }
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 19,
                        backgroundColor: isDark ? '#450A0A' : '#FEE2E2',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Trash2 size={16} color="#DC2626" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Floating Midnight Navy CTA */}
        <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
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
            <UserPlus size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Add Team Member
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Member Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: isDark ? '#101927' : '#FFFFFF',
              borderTopLeftRadius: 36,
              borderTopRightRadius: 36,
              paddingTop: 24,
              paddingHorizontal: 20,
              paddingBottom: insets.bottom + 20,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800' }}>Add Workshop Staff</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: isDark ? '#60A5FA' : '#2563EB', fontSize: 15, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 14 }}>
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>NAME</Text>
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="e.g. Rahul Sharma"
                  placeholderTextColor={theme.textMuted}
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    height: 50,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                />
              </View>

              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>PHONE NUMBER</Text>
                <TextInput
                  value={newPhone}
                  onChangeText={setNewPhone}
                  placeholder="9876543210"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={{
                    backgroundColor: inputBg,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    height: 50,
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: '600',
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                />
              </View>

              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 8 }}>ASSIGN ROLE</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {ROLES.filter((r) => r.role !== 'OWNER').map((r) => {
                    const isSelected = newRole === r.role;
                    return (
                      <TouchableOpacity
                        key={r.role}
                        onPress={() => setNewRole(r.role)}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderRadius: 16,
                          backgroundColor: isSelected ? '#0C1829' : inputBg,
                        }}
                      >
                        <Text style={{ color: isSelected ? '#FFFFFF' : theme.text, fontSize: 13, fontWeight: '700' }}>
                          {r.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <TouchableOpacity
                onPress={handleAddMember}
                style={{
                  backgroundColor: '#0C1829',
                  paddingVertical: 16,
                  borderRadius: 32,
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>Confirm & Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
