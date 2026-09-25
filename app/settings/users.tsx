// ============================================================
// Users & Roles Screen — Master Prompt Section 7
// Multi-Tenant RBAC: OWNER, ADMIN, MANAGER, ACCOUNTANT, EMPLOYEE
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  Shield,
  UserPlus,
  User,
  Phone,
  CheckCircle2,
  Trash2,
  Plus,
  Lock,
  Unlock,
  Check,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { UserRole } from '../../src/types/enterprise.types';
import { formatRoleLabel } from '../../src/utils/formatters';

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  canViewProfit?: boolean;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: 'm1',
    name: 'Manish Kumar (Co-Owner)',
    phone: '+91 98765 43210',
    role: 'OWNER',
    isActive: true,
    canViewProfit: true,
  },
  {
    id: 'm2',
    name: 'Rajesh Sharma (Partner / Co-Owner)',
    phone: '+91 98200 55443',
    role: 'OWNER',
    isActive: true,
    canViewProfit: true,
  },
  {
    id: 'm3',
    name: 'Vikas Deshmukh',
    phone: '+91 98200 11223',
    role: 'MANAGER',
    isActive: true,
    canViewProfit: false,
  },
  {
    id: 'm4',
    name: 'Rohan Patil (Head AC Mechanic)',
    phone: '+91 98333 77889',
    role: 'EMPLOYEE',
    isActive: true,
    canViewProfit: false,
  },
];

const ROLES: { role: UserRole; label: string; desc: string }[] = [
  { role: 'OWNER', label: 'Owner / Partner', desc: 'Full unrestricted access & Net Profit visibility' },
  { role: 'ADMIN', label: 'Admin', desc: 'Business operations & team management' },
  { role: 'MANAGER', label: 'Manager', desc: 'Job sheets, customers, expenses & inventory' },
  { role: 'ACCOUNTANT', label: 'Accountant', desc: 'Payments, bank accounts & expense reports' },
  { role: 'EMPLOYEE', label: 'Employee / Mechanic', desc: 'Job sheets & routine check-up work orders' },
];

export default function UsersRolesScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { activeEnterprise, activeMember } = useEnterpriseStore();

  const [members, setMembers] = useState<TeamMember[]>(DEFAULT_MEMBERS);
  const [activeMemberId, setActiveMemberId] = useState<string>('m1');
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('OWNER');

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const stored = await AsyncStorage.getItem('cool_car_team_members');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMembers(parsed);
          }
        }
        const storedActiveId = await AsyncStorage.getItem('cool_car_active_member_id');
        if (storedActiveId) {
          setActiveMemberId(storedActiveId);
        }
      } catch (err) {
        console.log('[Users] load error:', err);
      }
    };
    loadMembers();
  }, []);

  const saveMembers = async (updated: TeamMember[]) => {
    setMembers(updated);
    try {
      await AsyncStorage.setItem('cool_car_team_members', JSON.stringify(updated));
      const entId = activeEnterprise?.id || 'enterprise-dev-001';
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../src/services/firebase/firebase.config');
      await setDoc(doc(db, 'enterprises', entId, 'settings', 'team'), { members: updated }, { merge: true });
    } catch (err) {
      console.log('[Users] save error:', err);
    }
  };

  const handleSwitchActiveRole = async (member: TeamMember) => {
    setActiveMemberId(member.id);
    try {
      await AsyncStorage.setItem('cool_car_active_member_id', member.id);
      useEnterpriseStore.getState().setActiveMember({
        userId: member.id,
        enterpriseId: activeEnterprise?.id || 'enterprise-dev-001',
        role: member.role,
        displayName: member.name,
        phone: member.phone,
        isActive: true,
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      Alert.alert(
        'Active Persona Switched',
        `Current app role is now: ${member.name} (${formatRoleLabel(member.role)}).\n${
          member.role === 'OWNER'
            ? '✓ Month Net Profit and financial till are VISIBLE on Home Screen.'
            : '🔒 Month Net Profit is HIDDEN and restricted to owners only.'
        }`
      );
    } catch (err) {
      console.log('Error switching role:', err);
    }
  };

  const handleAddMember = async () => {
    if (!newName.trim()) {
      Alert.alert('Required', 'Please enter partner or staff name');
      return;
    }
    if (!newPhone.trim() || newPhone.replace(/\D/g, '').length < 10) {
      Alert.alert('Required', 'Please enter valid 10-digit phone number');
      return;
    }

    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: newName.trim(),
      phone: `+91 ${newPhone.replace(/\D/g, '').slice(-10)}`,
      role: newRole,
      isActive: true,
      canViewProfit: newRole === 'OWNER',
    };

    const updated = [...members, newMember];
    await saveMembers(updated);
    setNewName('');
    setNewPhone('');
    setNewRole('OWNER');
    setModalVisible(false);
    Alert.alert('Added ✓', `${newMember.name} added as ${formatRoleLabel(newMember.role)}.`);
  };

  const handleRemoveMember = (id: string, name: string) => {
    const ownerCount = members.filter((m) => m.role === 'OWNER').length;
    const target = members.find((m) => m.id === id);
    if (target?.role === 'OWNER' && ownerCount <= 1) {
      Alert.alert('Action Restricted', 'At least one Owner account must remain in the garage.');
      return;
    }
    Alert.alert('Remove Team Member', `Are you sure you want to revoke access for ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Revoke',
        style: 'destructive',
        onPress: () => {
          const updated = members.filter((m) => m.id !== id);
          saveMembers(updated);
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
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 }}
        >
          {/* Multi-Owner & RBAC Explanation Banner */}
          <View
            style={{
              backgroundColor: isDark ? '#141824' : '#FFFFFF',
              borderRadius: 20,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: borderColor,
              gap: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Shield size={18} color="#153580" />
              <Text style={{ fontSize: 14, fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                Multi-Owner & Role-Based Rules
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', lineHeight: 18 }}>
              • <Text style={{ fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>Partners & Co-Owners (3-4 Partners):</Text> Can view Month Net Profit, workshop till, and bank accounts.
            </Text>
            <Text style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', lineHeight: 18 }}>
              • <Text style={{ fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>Mechanics & Employees:</Text> Net profit is automatically locked 🔒 and only job cards & vehicle work are shown.
            </Text>
          </View>

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
            Garage Partners & Staff ({members.length})
          </Text>

          {/* Members List */}
          <View style={{ gap: 12 }}>
            {members.map((member) => {
              const isOwner = member.role === 'OWNER';
              const isActivePersona = member.id === activeMemberId || (activeMember && activeMember.displayName === member.name);

              return (
                <View
                  key={member.id}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 24,
                    padding: 18,
                    borderWidth: 1.5,
                    borderColor: isActivePersona ? '#153580' : borderColor,
                    shadowColor: '#000',
                    shadowOpacity: isDark ? 0.3 : 0.04,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 2,
                    gap: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: isOwner ? '#153580' : (isDark ? '#141926' : '#EFF6FF'),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <User size={20} color={isOwner ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#3B82F6')} />
                      </View>

                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                            {member.name}
                          </Text>
                          {isActivePersona && (
                            <View style={{ backgroundColor: '#10B981', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                              <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '900' }}>ACTIVE</Text>
                            </View>
                          )}
                        </View>
                        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                          {member.phone}
                        </Text>
                      </View>
                    </View>

                    {!isOwner && (
                      <TouchableOpacity
                        onPress={() => handleRemoveMember(member.id, member.name)}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 17,
                          backgroundColor: isDark ? '#450A0A' : '#FEE2E2',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={15} color="#DC2626" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Role Badge & Profit Access Tag */}
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
                        backgroundColor: isOwner ? (isDark ? '#3B2F04' : '#FEF3C7') : (isDark ? '#1E293B' : '#F1F5F9'),
                      }}
                    >
                      <Text
                        style={{
                          color: isOwner ? (isDark ? '#FBBF24' : '#B45309') : (isDark ? '#60A5FA' : '#1D4ED8'),
                          fontSize: 11,
                          fontWeight: '800',
                        }}
                      >
                        {formatRoleLabel(member.role)}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                        backgroundColor: isOwner ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      }}
                    >
                      {isOwner ? <Unlock size={11} color="#10B981" /> : <Lock size={11} color="#EF4444" />}
                      <Text style={{ fontSize: 11, fontWeight: '800', color: isOwner ? '#10B981' : '#EF4444' }}>
                        {isOwner ? 'Profit: Visible ✓' : 'Profit: Hidden 🔒'}
                      </Text>
                    </View>
                  </View>

                  {/* Switch Active Persona Button */}
                  <TouchableOpacity
                    onPress={() => handleSwitchActiveRole(member)}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      backgroundColor: isActivePersona ? (isDark ? '#1C2538' : '#F1F5F9') : '#153580',
                      paddingVertical: 9,
                      borderRadius: 12,
                      marginTop: 2,
                    }}
                  >
                    {isActivePersona ? (
                      <>
                        <Check size={14} color="#10B981" strokeWidth={3} />
                        <Text style={{ fontSize: 12, fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                          Currently Active in App
                        </Text>
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} color="#FFFFFF" />
                        <Text style={{ fontSize: 12, fontWeight: '800', color: '#FFFFFF' }}>
                          Switch & Test as {formatRoleLabel(member.role)}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
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
