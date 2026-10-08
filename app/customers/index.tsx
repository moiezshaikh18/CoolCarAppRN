// ============================================================
// Screen 11: Customer List — Master Customer Directory
// Matches Reference Design:
// Back Arrow, "Customer List", Search Bar with Magnifying Glass,
// Initial-Based Avatars (RS, AS, MS, VP), Name & Phone,
// Midnight Navy Floating Button: "+ Add Customer"
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Plus, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useCustomerStore } from '../../src/store/customerStore';

const AVATAR_PALETTE = ['#0D9488', '#2563EB', '#EA580C', '#DC2626', '#7C3AED', '#0284C7'];

export default function CustomerListScreen() {
  const { isDark } = useTheme();
  const { enterpriseId } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { setCustomers } = useCustomerStore();
  const [search, setSearch] = useState('');
  const [localCustomers, setLocalCustomers] = useState<any[]>([]);

  // Live Firestore Listener
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const fetchCustomers = async () => {
      try {
        const entId = enterpriseId || 'enterprise-cool-car';
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');

        const custRef = collection(db, 'enterprises', entId, 'customers');
        unsubscribe = onSnapshot(custRef, (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
            setLocalCustomers(list);
            setCustomers(list);
          } else {
            setLocalCustomers([]);
            setCustomers([]);
          }
        });
      } catch (err) {
        console.log('[CustomerList] Firestore sync error:', err);
      }
    };

    fetchCustomers();
    return () => unsubscribe?.();
  }, [enterpriseId, setCustomers]);

  const displayList = localCustomers;
  const filtered = displayList.filter(
    (c: any) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  const pageBg = isDark ? '#070A0F' : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={pageBg} />

      {/* Top Header: Back Arrow, Title "Customer List" (Screen 11 in Ref Photo) */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBackButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Customer List
          </Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Search Bar matching Screen 11 */}
        <View style={[styles.searchBar, { backgroundColor: isDark ? '#141926' : '#F8FAFC' }]}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search customers..."
            placeholderTextColor="#94A3B8"
            style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.searchClearText}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Customer List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
      >
        <View style={{ gap: 10 }}>
          {filtered.map((item: any, idx: number) => {
            const initials = item.name
              ? item.name
                  .split(' ')
                  .map((w: string) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : 'CU';
            const avatarBg = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
            const hasPending = (item.pendingAmount || 0) > 0;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.88}
                onPress={() => router.push(`/customers/${item.id}` as any)}
                style={[
                  styles.cardContainer,
                  {
                    backgroundColor: isDark ? '#101927' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                  },
                ]}
              >
                {/* Left Side: Avatar with Initials + Customer Name & Phone */}
                <View style={styles.cardLeft}>
                  <View style={[styles.avatarCircle, { backgroundColor: avatarBg }]}>
                    <Text style={styles.avatarInitials}>{initials}</Text>
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={[styles.customerName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {item.name}
                    </Text>
                    <Text style={styles.customerPhone}>
                      {item.phone || 'No phone recorded'}
                    </Text>
                  </View>
                </View>

                {/* Right Side: Pending Pill if any + Chevron */}
                <View style={styles.cardRight}>
                  {hasPending && (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>₹{item.pendingAmount}</Text>
                    </View>
                  )}
                  <ChevronRight size={18} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            );
          })}

          {filtered.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                No Customers Found
              </Text>
              <Text style={styles.emptySubtitle}>
                {search
                  ? 'No matching customer names or numbers.'
                  : 'Add your first customer to start tracking visits & job cards.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Button: "+ Add Customer" (Screen 11 in Ref Photo) */}
      <View style={[styles.bottomButtonWrapper, { bottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          onPress={() => router.push('/customers/add' as any)}
          activeOpacity={0.88}
          style={styles.floatingAddButton}
        >
          <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.floatingAddButtonText}>+ Add Customer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  searchClearText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '800',
  },
  customerPhone: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pendingText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomButtonWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  floatingAddButton: {
    backgroundColor: '#0C1829', // Exact Midnight Navy from Screen 11
    paddingVertical: 15,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0C1829',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  floatingAddButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
