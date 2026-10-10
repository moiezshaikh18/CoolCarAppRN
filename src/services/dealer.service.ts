// ============================================================
// Dealer / Vendor Procurement Service — Cool Car Garage
// Manages Spare Parts Suppliers & Aggregates Purchases by Month, Year & Date Range
// ============================================================

import { db } from './firebase/firebase.config';
import { collection, doc, getDocs, setDoc, query, orderBy } from 'firebase/firestore';
import { PurchaseChalan, DealerSummary } from '../types/chalan.types';

/**
 * Fetch all registered dealers from Firestore
 */
export async function getDealersFromFirestore(
  enterpriseId: string = 'enterprise-cool-car'
): Promise<DealerSummary[]> {
  try {
    const dealersRef = collection(db, 'enterprises', enterpriseId, 'dealers');
    const snap = await getDocs(query(dealersRef, orderBy('name', 'asc')));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch (err) {
    console.log('[DealerService] getDealers error/offline:', err);
    return [];
  }
}

/**
 * Upsert Dealer record in Firestore when a chalan is saved
 */
export async function upsertDealerInFirestore(
  enterpriseId: string = 'enterprise-cool-car',
  name: string,
  phone: string = '',
  purchaseAmount: number = 0,
  paidAmount: number = 0,
  pendingAmount: number = 0,
  purchaseDate: string = new Date().toISOString().slice(0, 10),
  parts: string[] = []
): Promise<void> {
  const trimmedName = name.trim();
  if (!trimmedName) return;

  const docId = `dealer_${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  try {
    const dealerDocRef = doc(db, 'enterprises', enterpriseId, 'dealers', docId);
    const dealerData: Record<string, any> = {
      id: docId,
      name: trimmedName,
      lastPurchaseDate: purchaseDate,
      updatedAt: new Date().toISOString(),
    };
    if (phone && phone.trim()) {
      dealerData.phone = phone.trim();
    }
    await setDoc(dealerDocRef, dealerData, { merge: true });
  } catch (err) {
    console.log('[DealerService] upsertDealer error:', err);
  }
}

/**
 * Aggregate purchase metrics by dealer from chalans for a given date range
 * Supports: Month, Year, Custom Date Range, or All Time
 */
export function aggregateDealerPurchases(
  chalans: PurchaseChalan[],
  startDate?: string, // YYYY-MM-DD
  endDate?: string    // YYYY-MM-DD
): DealerSummary[] {
  // 1. Filter chalans by date range if provided
  const filtered = chalans.filter((c) => {
    if (!c.date) return true;
    if (startDate && c.date < startDate) return false;
    if (endDate && c.date > endDate) return false;
    return true;
  });

  // 2. Group by normalized vendor name
  const dealerMap = new Map<string, DealerSummary>();

  filtered.forEach((c) => {
    const rawName = (c.vendorName || 'General Supplier').trim();
    const key = rawName.toLowerCase();

    const existing = dealerMap.get(key) || {
      id: `dealer_${key.replace(/[^a-z0-9]/g, '_')}`,
      name: rawName,
      phone: c.vendorPhone || '',
      totalPurchases: 0,
      totalPaid: 0,
      totalPending: 0,
      chalanCount: 0,
      lastPurchaseDate: c.date,
      purchasedParts: [],
    };

    existing.totalPurchases += c.totalAmount || 0;
    existing.totalPaid += c.amountPaid || 0;
    existing.totalPending += c.pendingAmount || 0;
    existing.chalanCount += 1;

    if (!existing.phone && c.vendorPhone) {
      existing.phone = c.vendorPhone;
    }

    if (c.date && (!existing.lastPurchaseDate || c.date > existing.lastPurchaseDate)) {
      existing.lastPurchaseDate = c.date;
    }

    // Collect part names
    if (Array.isArray(c.items)) {
      c.items.forEach((it) => {
        if (it.partName && !existing.purchasedParts?.includes(it.partName)) {
          existing.purchasedParts?.push(it.partName);
        }
      });
    }

    dealerMap.set(key, existing);
  });

  // 3. Return sorted by highest total purchases
  return Array.from(dealerMap.values()).sort(
    (a, b) => b.totalPurchases - a.totalPurchases
  );
}

