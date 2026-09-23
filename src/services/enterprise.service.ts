// ============================================================
// Enterprise Service — Load enterprise data and membership
// ============================================================

import { doc, getDoc, getDocs, collection, where, query } from 'firebase/firestore';
import { db } from './firebase/firebase.config';
import { Enterprise, EnterpriseMember } from '../types/enterprise.types';
import { COLLECTIONS, enterprisePath, enterpriseDocPath } from '../constants/firestore';
import { addDocument, setDocument, updateDocument } from './firebase/firestore.service';

/**
 * Load enterprise by ID
 * Security rules ensure user is a member before allowing read
 */
export async function getEnterprise(enterpriseId: string): Promise<Enterprise | null> {
  const ref = doc(db, COLLECTIONS.ENTERPRISES, enterpriseId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Enterprise;
}

/**
 * Get member record for current user in an enterprise
 */
export async function getMember(
  enterpriseId: string,
  userId: string
): Promise<EnterpriseMember | null> {
  const ref = doc(db, `${COLLECTIONS.ENTERPRISES}/${enterpriseId}/${COLLECTIONS.MEMBERS}/${userId}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as EnterpriseMember;
}

/**
 * Get all enterprises a user belongs to
 */
export async function getUserEnterprises(userId: string): Promise<string[]> {
  // We query through the user doc's enterpriseIds
  const ref = doc(db, COLLECTIONS.USERS, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  return snap.data()?.enterpriseIds ?? [];
}

/**
 * Create a new enterprise
 */
export async function createEnterprise(
  data: Omit<Enterprise, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  return addDocument(COLLECTIONS.ENTERPRISES, data);
}

/**
 * Update enterprise settings
 */
export async function updateEnterprise(
  enterpriseId: string,
  data: Partial<Enterprise>
): Promise<void> {
  const path = `${COLLECTIONS.ENTERPRISES}/${enterpriseId}`;
  await updateDocument(path, data as Record<string, unknown>);
}

/**
 * Add or update a member in an enterprise
 */
export async function upsertMember(
  enterpriseId: string,
  userId: string,
  data: Partial<EnterpriseMember>
): Promise<void> {
  const path = `${COLLECTIONS.ENTERPRISES}/${enterpriseId}/${COLLECTIONS.MEMBERS}/${userId}`;
  await setDocument(path, { ...data, userId, enterpriseId });
}

