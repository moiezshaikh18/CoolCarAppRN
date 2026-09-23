// ============================================================
// Auth Service — Firebase Phone OTP Authentication
// ============================================================

import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  User,
  ConfirmationResult,
  RecaptchaVerifier,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase.config';
import { UserProfile } from '../../types/auth.types';
import { COLLECTIONS } from '../../constants/firestore';

let confirmationResultRef: ConfirmationResult | null = null;

/**
 * Send OTP to phone number
 * reCAPTCHA handled by Firebase on Android via silent push
 */
export async function sendOTP(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<string> {
  try {
    const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    confirmationResultRef = result;
    return result.verificationId;
  } catch (error) {
    console.error('[AuthService] sendOTP error:', error);
    throw error;
  }
}

/**
 * Verify OTP code
 * Returns Firebase User on success
 */
export async function verifyOTP(
  verificationId: string,
  otp: string
): Promise<User> {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const result = await signInWithCredential(auth, credential);
    return result.user;
  } catch (error) {
    console.error('[AuthService] verifyOTP error:', error);
    throw error;
  }
}

/**
 * Confirm OTP using stored confirmationResult (web flow fallback)
 */
export async function confirmOTP(otp: string): Promise<User> {
  if (!confirmationResultRef) {
    throw new Error('No active OTP session. Please request a new OTP.');
  }
  try {
    const result = await confirmationResultRef.confirm(otp);
    confirmationResultRef = null;
    return result.user;
  } catch (error) {
    console.error('[AuthService] confirmOTP error:', error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('[AuthService] signOut error:', error);
    throw error;
  }
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuthState(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Fetch user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const ref = doc(db, COLLECTIONS.USERS, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch (error) {
    console.error('[AuthService] getUserProfile error:', error);
    throw error;
  }
}

/**
 * Create a new user profile in Firestore
 */
export async function createUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<UserProfile> {
  const profile: UserProfile = {
    uid,
    phone: data.phone ?? '',
    displayName: data.displayName ?? '',
    email: data.email,
    photoUrl: data.photoUrl,
    enterpriseIds: [],
    activeEnterpriseId: undefined,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };
  const ref = doc(db, COLLECTIONS.USERS, uid);
  await setDoc(ref, { ...profile, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return profile;
}

/**
 * Update user's active enterprise
 */
export async function updateActiveEnterprise(
  uid: string,
  enterpriseId: string
): Promise<void> {
  const ref = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(ref, {
    activeEnterpriseId: enterpriseId,
    updatedAt: serverTimestamp(),
  });
}

