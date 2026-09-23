// ============================================================
// Customer List Screen — Master Customer Directory
// Luxury Warm-Minimalist Aesthetic (Nestora style)
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Plus, User, ChevronRight, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { GlassCard } from '../../src/components/common/GlassCard';
import { useCustomerStore } from '../../src/store/customerStore';

const DEFAULT_CUSTOMERS = [
  { id: 'c1', name: 'Ramesh Kumar', phone: '+91 98765 43210', totalJobs: 3, pendingAmount: 0 },
  { id: 'c2', name: 'Ajay Singh', phone: '+91 98201 12345', totalJobs: 2, pendingAmount: 1500 },
  { id: 'c3', name: 'Neha Sharma', phone: '+91 98111 54321', totalJobs: 4, pendingAmount: 0 },
  { id: 'c4', name: 'Vikram Patel', phone: '+91 97654 32109', totalJobs: 1, pendingAmount: 2400 },
];

export default function CustomerListScreen() {
  const { theme, isDark } = useTheme();
  const { enterpriseId } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { customers, setCustomers } = useCustomerStore();
  const [search, setSearch] = useState('');
  const [localCustomers, setLocalCustomers] = useState(DEFAULT_CUSTOMERS);

  // Live Firestore Listener
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const fetchCustomers = async () => {
      try {
        const entId = enterpriseId || 'enterprise-dev-001';
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');

        const custRef = collection(db, 'enterprises', entId, 'customers');
        unsubscribe = onSnapshot(custRef, (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
            setLocalCustomers(list);
            setCustomers(list);
          }
        });
      } catch (err) {
        console.log('[CustomerList] Firestore sync error:', err);
      }
    };

    fetchCustomers();
    return () => unsubscribe?.();
  }, [enterpriseId]);

  const displayList = localCustomers.length > 0 ? localCustomers : DEFAULT_CUSTOMERS;
  const filtered = displayList.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone && c.phone.includes(search))
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Symmetrical Top Header */}
      <View
        style={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 22,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isDark ? '#1C212B' : '#EFECE6',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={20} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
              Customers
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 1 }}>
              {displayList.length} registered profiles
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/customers/add' as any)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? '#FFFFFF' : '#121214',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Pill Search Input */}
      <View style={{ paddingHorizontal: 22, marginBottom: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#1C212B' : '#EFECE6',
            borderRadius: 26,
            paddingHorizontal: 16,
            height: 52,
            gap: 12,
          }}
        >
          <Search size={18} color={theme.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or mobile number..."
            placeholderTextColor={theme.textMuted}
            style={{
              flex: 1,
              color: theme.text,
              fontSize: 15,
              fontWeight: '500',
            }}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600' }}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Customer List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 110 }}
      >
        <View style={{ gap: 12 }}>
          {filtered.map((item) => {
            const hasPending = (item.pendingAmount || 0) > 0;
            return (
              <GlassCard
                key={item.id}
                variant="sand"
                padding={18}
                onPress={() => router.push(`/customers/${item.id}` as any)}
                style={{
                  borderRadius: 28,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: isDark ? '#252B38' : '#FFFFFF',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    }}
                  >
                    <User size={22} color={theme.text} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                      {item.name}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>
                      {item.phone}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                      {hasPending ? (
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 10,
                            backgroundColor: isDark ? '#7F1D1D' : '#FEE2E2',
                          }}
                        >
                          <Text style={{ color: isDark ? '#FCA5A5' : '#DC2626', fontSize: 11, fontWeight: '700' }}>
                            ₹{item.pendingAmount} Pending
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 10,
                            backgroundColor: isDark ? '#064E3B' : '#DCFCE7',
                          }}
                        >
                          <Text style={{ color: isDark ? '#6EE7B7' : '#16A34A', fontSize: 11, fontWeight: '700' }}>
                            All Cleared ✓
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <ChevronRight size={18} color={theme.textMuted} />
              </GlassCard>
            );
          })}
        </View>
      </ScrollView>

      {/* Solid Black Pill CTA Button */}
      <View style={{ position: 'absolute', bottom: 24, left: 22, right: 22 }}>
        <TouchableOpacity
          onPress={() => router.push('/customers/add' as any)}
          activeOpacity={0.88}
          style={{
            backgroundColor: isDark ? '#FFFFFF' : '#121214',
            paddingVertical: 18,
            borderRadius: 34,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Plus size={20} color={isDark ? '#121214' : '#FFFFFF'} strokeWidth={2.5} />
          <Text style={{ color: isDark ? '#121214' : '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            Add New Customer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
