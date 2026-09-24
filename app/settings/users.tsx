// ============================================================
// Users & Roles Screen — Master Prompt Section 7
// Multi-Tenant RBAC: OWNER, ADMIN, MANAGER, ACCOUNTANT, EMPLOYEE
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState } from 'react';
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
import { UserRole } from '../../src/types/enterprise.types';
import { formatRoleLabel } from '../../src/utils/formatters';

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: 'm1',
    name: 'Manish Kumar (You)',
    phone: '+91 98765 43210',
    role: 'OWNER',
    isActive: true,
  },
  {
    id: 'm2',
    name: 'Vikas Deshmukh',
    phone: '+91 98200 11223',
    role: 'MANAGER',
    isActive: true,
  },
  {
    id: 'm3',
    name: 'Kavita Singh',
    phone: '+91 98199 44556',
    role: 'ACCOUNTANT',
    isActive: true,
  },
  {
    id: 'm4',
    name: 'Rohan Patil',
    phone: '+91 98333 77889',
    role: 'EMPLOYEE',
    isActive: true,
  },
];

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

  const [members, setMembers] = useState<TeamMember[]>(DEFAULT_MEMBERS);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('EMPLOYEE');

  const handleAddMember = () => {
    if (!newName.trim()) {
      Alert.alert('Required', 'Please enter staff member name');
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
    };

    setMembers([...members, newMember]);
    setNewName('');
    setNewPhone('');
    setNewRole('EMPLOYEE');
    setModalVisible(false);
    Alert.alert('Added', `${newMember.name} added as ${formatRoleLabel(newMember.role)}.`);
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (members.find((m) => m.id === id)?.role === 'OWNER') {
      Alert.alert('Action Restricted', 'Owner account cannot be removed.');
      return;
    }
    Alert.alert('Remove Team Member', `Are you sure you want to revoke access for ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Revoke',
        style: 'destructive',
        onPress: () => {
          setMembers(members.filter((m) => m.id !== id));
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
    <View style={{ flex: 1, backgroundColor: skyBg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'light-content'} backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 20,
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

                  {!isOwner && (
                    <TouchableOpacity
                      onPress={() => handleRemoveMember(member.id, member.name)}
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
