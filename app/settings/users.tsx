// ============================================================
// Users & Roles Screen — Master Prompt Section 7
// Multi-Tenant RBAC: OWNER, ADMIN, MANAGER, ACCOUNTANT, EMPLOYEE
// Strictly follows media_1790116823022.png aesthetic
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
import { GlassCard } from '../../src/components/common/GlassCard';
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
      id: `m_${Date.now()}`,
      name: newName.trim(),
      phone: `+91 ${newPhone.trim()}`,
      role: newRole,
      isActive: true,
    };

    setMembers((prev) => [...prev, newMember]);
    setNewName('');
    setNewPhone('');
    setNewRole('EMPLOYEE');
    setModalVisible(false);
    Alert.alert('Staff Added', `${newMember.name} added as ${formatRoleLabel(newMember.role)}.`);
  };

  const handleRemoveMember = (member: TeamMember) => {
    if (member.role === 'OWNER') {
      Alert.alert('Not Permitted', 'The primary garage Owner cannot be deleted.');
      return;
    }
    Alert.alert(
      'Remove Staff',
      `Revoke access for ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setMembers((prev) => prev.filter((m) => m.id !== member.id));
          },
        },
      ]
    );
  };

  const canvasBg = isDark ? '#14171F' : '#F8F6F2';
  const circleBtnBg = isDark ? '#1C212B' : '#EFECE6';
  const primaryBtnBg = isDark ? '#FFFFFF' : '#121214';
  const primaryBtnText = isDark ? '#121214' : '#FFFFFF';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      {/* Symmetrical Top Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
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
            backgroundColor: circleBtnBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color={theme.text} />
        </TouchableOpacity>

        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 }}>
          Users & Permissions
        </Text>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: circleBtnBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
      >
        {/* Info Banner */}
        <GlassCard
          variant="sand"
          padding={20}
          style={{
            borderRadius: 28,
            marginBottom: 20,
            gap: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={18} color={theme.text} />
            </View>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
              Multi-Role Access Control
            </Text>
          </View>
          <Text style={{ color: theme.textMuted, fontSize: 13, lineHeight: 19 }}>
            Granular permissions strictly enforced via Firebase Security Rules. Protect sensitive financial books, ledger entries, and garage operational sheets.
          </Text>
        </GlassCard>

        {/* Team Members List */}
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          Active Staff ({members.length})
        </Text>

        <View style={{ gap: 12 }}>
          {members.map((member) => (
            <GlassCard
              key={member.id}
              variant="sand"
              padding={18}
              style={{
                borderRadius: 28,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
                  {/* Circular Avatar */}
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <User size={22} color={theme.text} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                      {member.name}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                      {member.phone}
                    </Text>
                  </View>
                </View>

                {/* Role Pill & Remove */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                    }}
                  >
                    <Text style={{ color: theme.text, fontSize: 11, fontWeight: '800' }}>
                      {formatRoleLabel(member.role)}
                    </Text>
                  </View>

                  {member.role !== 'OWNER' && (
                    <TouchableOpacity
                      onPress={() => handleRemoveMember(member)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Trash2 size={15} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Roles Reference Accordion Card */}
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginTop: 24,
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          Role Permissions Reference
        </Text>

        <GlassCard
          variant="sand"
          padding={20}
          style={{
            borderRadius: 28,
            gap: 14,
          }}
        >
          {ROLES.map((r, idx) => (
            <View key={r.role}>
              {idx > 0 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4',
                    marginBottom: 14,
                  }}
                />
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                  }}
                >
                  <Text style={{ color: theme.text, fontSize: 11, fontWeight: '800' }}>{r.label}</Text>
                </View>
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 13, lineHeight: 18 }}>{r.desc}</Text>
            </View>
          ))}
        </GlassCard>
      </ScrollView>

      {/* Floating Solid Obsidian CTA Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: primaryBtnBg,
            paddingVertical: 18,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
            + Add Staff Member
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Staff Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? '#1C212B' : '#F8F6F2',
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: 24,
              paddingBottom: 40,
              gap: 16,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800' }}>
              Add Team Member
            </Text>

            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                Full Name
              </Text>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="e.g. Ramesh Verma"
                placeholderTextColor={theme.textMuted}
                style={{
                  backgroundColor: isDark ? '#262D3B' : '#EFECE6',
                  borderRadius: 22,
                  paddingHorizontal: 18,
                  paddingVertical: 14,
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: '600',
                }}
              />
            </View>

            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
                Mobile Number (for OTP Login)
              </Text>
              <TextInput
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder="9876543210"
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
                style={{
                  backgroundColor: isDark ? '#262D3B' : '#EFECE6',
                  borderRadius: 22,
                  paddingHorizontal: 18,
                  paddingVertical: 14,
                  color: theme.text,
                  fontSize: 15,
                  fontWeight: '600',
                }}
              />
            </View>

            <View>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 8 }}>
                Select Role
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {ROLES.filter((r) => r.role !== 'OWNER').map((r) => {
                  const isSelected = newRole === r.role;
                  return (
                    <TouchableOpacity
                      key={r.role}
                      onPress={() => setNewRole(r.role)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: isSelected ? primaryBtnBg : (isDark ? '#262D3B' : '#EFECE6'),
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected ? primaryBtnText : theme.text,
                          fontSize: 13,
                          fontWeight: '700',
                        }}
                      >
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? '#262D3B' : '#EFECE6',
                  paddingVertical: 16,
                  borderRadius: 28,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddMember}
                style={{
                  flex: 1,
                  backgroundColor: primaryBtnBg,
                  paddingVertical: 16,
                  borderRadius: 28,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: primaryBtnText, fontSize: 15, fontWeight: '800' }}>Add Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
