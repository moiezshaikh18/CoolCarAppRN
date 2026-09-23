// ============================================================
// Firestore Service — Generic CRUD helpers
// All queries are enterprise-scoped
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
  serverTimestamp,
  writeBatch,
  onSnapshot,
  Unsubscribe,
  Timestamp,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase.config';

// ─── Generic Helpers ──────────────────────────────────────────

/**
 * Fetch a document by path
 */
export async function fetchDoc<T>(path: string): Promise<T | null> {
  const snap = await getDoc(doc(db, path));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

/**
 * Fetch all docs from a collection with optional constraints
 */
export async function fetchCollection<T>(
  collPath: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const ref = collection(db, collPath);
  const q = query(ref, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

/**
 * Add a new document (auto-ID)
 */
export async function addDocument<T extends object>(
  collPath: string,
  data: T
): Promise<string> {
  const ref = await addDoc(collection(db, collPath), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Set a document with a specific ID (upsert)
 */
export async function setDocument<T extends object>(
  path: string,
  data: T
): Promise<void> {
  await setDoc(doc(db, path), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update specific fields on a document
 */
export async function updateDocument(
  path: string,
  data: Record<string, unknown>
): Promise<void> {
  await updateDoc(doc(db, path), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Soft delete — marks isActive = false
 */
export async function softDelete(path: string, deletedBy: string): Promise<void> {
  await updateDoc(doc(db, path), {
    isActive: false,
    deletedBy,
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Void a financial record instead of deleting
 */
export async function voidDocument(
  path: string,
  reason: string,
  voidedBy: string
): Promise<void> {
  await updateDoc(doc(db, path), {
    voided: true,
    voidReason: reason,
    voidedBy,
    voidedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Real-time snapshot listener for a collection
 */
export function subscribeCollection<T>(
  collPath: string,
  constraints: QueryConstraint[],
  callback: (items: T[]) => void
): Unsubscribe {
  const ref = collection(db, collPath);
  const q = query(ref, ...constraints);
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
    callback(items);
  });
}

/**
 * Paginated fetch with cursor
 */
export async function fetchPage<T>(
  collPath: string,
  constraints: QueryConstraint[],
  pageSize: number,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ items: T[]; lastDoc: QueryDocumentSnapshot | null }> {
  const ref = collection(db, collPath);
  const paginationConstraints: QueryConstraint[] = lastDoc
    ? [...constraints, limit(pageSize), startAfter(lastDoc)]
    : [...constraints, limit(pageSize)];

  const q = query(ref, ...paginationConstraints);
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  const last = snap.docs[snap.docs.length - 1] ?? null;
  return { items, lastDoc: last };
}

export { where, orderBy, limit, serverTimestamp, writeBatch, Timestamp };

