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
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Plus, ChevronRight, Trash2 } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterprise } from '../../src/hooks/useEnterprise';
import { useCustomerStore } from '../../src/store/customerStore';

const AVATAR_PALETTE = ['#0D9488', '#2563EB', '#EA580C', '#DC2626', '#7C3AED', '#0284C7'];

export default function CustomerListScreen() {
  const { isDark } = useTheme();
  const { enterpriseId } = useEnterprise();
  const insets = useSafeAreaInsets();
  const { setCustomers, removeCustomer } = useCustomerStore();
  const [search, setSearch] = useState('');
  const [localCustomers, setLocalCustomers] = useState<any[]>([]);

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

  const handleDeleteCustomer = (id: string, name: string) => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete ${name}? This will remove them from the directory.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              removeCustomer(id);
              setLocalCustomers((prev) => prev.filter((c) => c.id !== id));
              const entId = enterpriseId || 'enterprise-cool-car';
              const { doc, deleteDoc } = await import('firebase/firestore');
              const { db } = await import('../../src/services/firebase/firebase.config');
              await deleteDoc(doc(db, 'enterprises', entId, 'customers', id));
            } catch (err) {
              console.log('[CustomerList] Delete error:', err);
            }
          },
        },
      ]
    );
  };

  const pageBg = isDark ? '#070A0F' : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={pageBg} />

      <View style={[styles.topHeader, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBackButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Customer List
          </Text>

          <View style={{ width: 40 }} />
        </View>

        <View style={[styles.searchBar, { backgroundColor: isDark ? '#141926' : '#F8FAFC' }]}>
          <Search size={18} color="#94A3B8" />
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
      >
        <View style={{ gap: 12 }}>
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
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
                  },
                ]}
              >
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

                <View style={styles.cardRight}>
                  {hasPending && (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>₹{item.pendingAmount}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteCustomer(item.id, item.name || 'this customer');
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={{ padding: 4, marginRight: 2 }}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                  <ChevronRight size={20} color="#64748B" />
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

      <View style={[styles.bottomButtonWrapper, { bottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          onPress={() => router.push('/customers/add' as any)}
          activeOpacity={0.88}
          style={styles.floatingAddButton}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
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
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  searchClearText: {
    fontSize: 12,
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '800',
  },
  customerPhone: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pendingText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomButtonWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  floatingAddButton: {
    backgroundColor: '#0C1829',
    paddingVertical: 16,
    borderRadius: 32,
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
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
