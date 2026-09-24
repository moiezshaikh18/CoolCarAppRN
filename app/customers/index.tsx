// ============================================================
// Customer List Screen — Master Customer Directory
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Plus, User, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
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

  const skyBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';

  return (
    <View style={{ flex: 1, backgroundColor: skyBg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'light-content'} backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 16,
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
                Customers
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
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
            <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Pill Search Input */}
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
            placeholder="Search by name or mobile number..."
            placeholderTextColor={isDark ? '#64748B' : 'rgba(255,255,255,0.7)'}
            style={{
              flex: 1,
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '500',
            }}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Signature Mega-Curved Lower Content Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          paddingTop: 16,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110, paddingTop: 4 }}
        >
          <View style={{ gap: 12 }}>
            {filtered.map((item) => {
              const hasPending = (item.pendingAmount || 0) > 0;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.88}
                  onPress={() => router.push(`/customers/${item.id}` as any)}
                  style={{
                    backgroundColor: isDark ? '#101927' : '#FFFFFF',
                    borderRadius: 24,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
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
                        {item.name}
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2, fontWeight: '500' }}>
                        {item.phone}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                        {hasPending ? (
                          <View
                            style={{
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              borderRadius: 8,
                              backgroundColor: isDark ? '#450A0A' : '#FEE2E2',
                            }}
                          >
                            <Text style={{ color: isDark ? '#F87171' : '#DC2626', fontSize: 11, fontWeight: '700' }}>
                              ₹{item.pendingAmount} Pending
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={{
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              borderRadius: 8,
                              backgroundColor: isDark ? '#064E3B' : '#DCFCE7',
                            }}
                          >
                            <Text style={{ color: isDark ? '#34D399' : '#15803D', fontSize: 11, fontWeight: '700' }}>
                              All Cleared ✓
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <ChevronRight size={18} color={theme.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Floating Midnight Navy CTA Button */}
        <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <TouchableOpacity
            onPress={() => router.push('/customers/add' as any)}
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
              Add New Customer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
