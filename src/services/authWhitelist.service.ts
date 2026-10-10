// ============================================================
// Auth Whitelist & Role Verification Service
// Restricts login strictly to Registered Owners and Registered Staff.
// Completely blocks random/unregistered phone numbers from gaining access.
// Supports Dynamic Owners (Firestore + Baseline fallback).
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebase/firebase.config';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useEmployeeStore } from '../store/employeeStore';
import { UserRole } from '../types/enterprise.types';
import { Employee } from '../types/employee.types';

// Baseline registered garage owner numbers from Firebase Console setup
export const BASELINE_OWNER_NUMBERS = [
  { phone: '8793436778', name: 'Workshop Owner (Primary)' },
  { phone: '9881421209', name: 'Workshop Owner (Co-Owner)' },
];

const LOCAL_STORAGE_KEY_OWNERS = 'cool_car_dynamic_owners_cache';

export interface RegisteredOwner {
  id: string;
  phone: string; // 10 digits
  formattedPhone: string; // +91 XXXXX XXXXX
  name: string;
  role: 'OWNER';
  isActive: boolean;
  createdAt: string;
}

export interface AuthAccessResult {
  allowed: boolean;
  role: UserRole;
  displayName: string;
  phone: string;
  formattedPhone: string;
  employeeId?: string;
  employeeData?: Employee;
  denialReason?: string;
}

/**
 * Normalizes any phone number into canonical 10-digit Indian mobile number
 * e.g. "+91 87934 36778" -> "8793436778"
 * e.g. "09881421209" -> "9881421209"
 */
export function normalizePhone10(rawPhone: string): string {
  if (!rawPhone) return '';
  return rawPhone.replace(/\D/g, '').slice(-10);
}

/**
 * Formats a 10-digit string to standard "+91 XXXXX XXXXX"
 */
export function formatIndianPhone(phone10: string): string {
  const clean = normalizePhone10(phone10);
  if (clean.length !== 10) return phone10;
  return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
}

/**
 * Fetch all registered owners (Baseline + Firestore dynamic collection)
 */
export async function getDynamicOwners(
  enterpriseId: string = 'enterprise-cool-car'
): Promise<RegisteredOwner[]> {
  const ownerMap = new Map<string, RegisteredOwner>();

  // 1. Add baseline owners
  BASELINE_OWNER_NUMBERS.forEach((base) => {
    ownerMap.set(base.phone, {
      id: `owner-base-${base.phone}`,
      phone: base.phone,
      formattedPhone: formatIndianPhone(base.phone),
      name: base.name,
      role: 'OWNER',
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  });

  // 2. Load locally cached dynamic owners
  try {
    const cached = await AsyncStorage.getItem(LOCAL_STORAGE_KEY_OWNERS);
    if (cached) {
      const parsed: RegisteredOwner[] = JSON.parse(cached);
      parsed.forEach((o) => {
        const clean = normalizePhone10(o.phone);
        if (clean.length === 10) {
          ownerMap.set(clean, { ...o, phone: clean });
        }
      });
    }
  } catch (err) {
    console.log('[AuthWhitelist] Local owner cache read error:', err);
  }

  // 3. Query Firestore dynamic owners collection & settings document
  try {
    const ownersCollRef = collection(db, 'enterprises', enterpriseId, 'owners');
    const snap = await getDocs(ownersCollRef);

    snap.docs.forEach((d) => {
      const data = d.data() as any;
      const clean = normalizePhone10(data.phone || d.id);
      if (clean.length === 10 && data.isActive !== false) {
        ownerMap.set(clean, {
          id: d.id,
          phone: clean,
          formattedPhone: formatIndianPhone(clean),
          name: data.name || 'Garage Owner',
          role: 'OWNER',
          isActive: true,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      }
    });

    // Also check settings doc array: enterprises/{id}/settings/owners
    const settingsDocRef = doc(db, 'enterprises', enterpriseId, 'settings', 'owners');
    const settingsSnap = await getDoc(settingsDocRef);
    if (settingsSnap.exists()) {
      const data = settingsSnap.data() as any;
      const phonesList: string[] = data.ownerPhones || [];
      phonesList.forEach((p) => {
        const clean = normalizePhone10(p);
        if (clean.length === 10 && !ownerMap.has(clean)) {
          ownerMap.set(clean, {
            id: `owner-settings-${clean}`,
            phone: clean,
            formattedPhone: formatIndianPhone(clean),
            name: 'Workshop Owner',
            role: 'OWNER',
            isActive: true,
            createdAt: new Date().toISOString(),
          });
        }
      });
    }

    // Persist full list to local AsyncStorage cache
    const fullList = Array.from(ownerMap.values());
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY_OWNERS, JSON.stringify(fullList));
  } catch (cloudErr) {
    console.log('[AuthWhitelist] Firestore dynamic owners sync notice:', cloudErr);
  }

  return Array.from(ownerMap.values());
}

/**
 * Register a new dynamic owner in Firestore and local cache
 */
export async function addDynamicOwner(
  phone: string,
  name: string,
  enterpriseId: string = 'enterprise-cool-car'
): Promise<RegisteredOwner> {
  const clean10 = normalizePhone10(phone);
  if (clean10.length !== 10) {
    throw new Error('Please provide a valid 10-digit mobile number.');
  }

  const newOwner: RegisteredOwner = {
    id: `owner-${clean10}`,
    phone: clean10,
    formattedPhone: formatIndianPhone(clean10),
    name: name.trim() || 'Garage Owner',
    role: 'OWNER',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  // 1. Save to Firestore collection
  try {
    const ownerDocRef = doc(db, 'enterprises', enterpriseId, 'owners', newOwner.id);
    await setDoc(ownerDocRef, newOwner);

    // Also update settings doc array
    const settingsDocRef = doc(db, 'enterprises', enterpriseId, 'settings', 'owners');
    await setDoc(
      settingsDocRef,
      {
        ownerPhones: arrayUnion(clean10),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.log('[AuthWhitelist] Failed to write new owner to Firestore:', err);
  }

  // 2. Update local cache
  try {
    const existing = await getDynamicOwners(enterpriseId);
    const updated = [...existing.filter((o) => o.phone !== clean10), newOwner];
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY_OWNERS, JSON.stringify(updated));
  } catch {}

  return newOwner;
}

/**
 * Remove a dynamic owner from Firestore and local cache
 */
export async function removeDynamicOwner(
  phone: string,
  enterpriseId: string = 'enterprise-cool-car'
): Promise<boolean> {
  const clean10 = normalizePhone10(phone);

  // Baseline owners cannot be permanently removed
  if (BASELINE_OWNER_NUMBERS.some((b) => b.phone === clean10)) {
    throw new Error('Primary baseline owner account cannot be deleted.');
  }

  try {
    const ownerDocRef = doc(db, 'enterprises', enterpriseId, 'owners', `owner-${clean10}`);
    await deleteDoc(ownerDocRef);

    const settingsDocRef = doc(db, 'enterprises', enterpriseId, 'settings', 'owners');
    await updateDoc(settingsDocRef, {
      ownerPhones: arrayRemove(clean10),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.log('[AuthWhitelist] Failed to remove owner from Firestore:', err);
  }

  try {
    const existing = await getDynamicOwners(enterpriseId);
    const updated = existing.filter((o) => o.phone !== clean10);
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY_OWNERS, JSON.stringify(updated));
  } catch {}

  return true;
}

/**
 * STRICT AUTHENTICATION VERIFICATION
 * Checks if the mobile number is registered as either:
 * 1) Dynamic Owner -> Returns 'OWNER'
 * 2) Registered Staff / Employee in Firestore -> Returns 'STAFF' / assigned role
 * 3) UNREGISTERED -> Returns allowed: false with access denied reason!
 */
export async function verifyPhoneNumberAccess(
  rawPhone: string,
  enterpriseId: string = 'enterprise-cool-car'
): Promise<AuthAccessResult> {
  const clean10 = normalizePhone10(rawPhone);

  if (!clean10 || clean10.length !== 10) {
    return {
      allowed: false,
      role: 'EMPLOYEE',
      displayName: '',
      phone: rawPhone,
      formattedPhone: rawPhone,
      denialReason: 'Please enter a valid 10-digit mobile number.',
    };
  }

  const formatted = formatIndianPhone(clean10);

  // STEP 1: Check Owners (Baseline + Dynamic)
  try {
    const allOwners = await getDynamicOwners(enterpriseId);
    const matchedOwner = allOwners.find((o) => o.phone === clean10 && o.isActive);

    if (matchedOwner) {
      return {
        allowed: true,
        role: 'OWNER',
        displayName: matchedOwner.name || 'Workshop Owner',
        phone: clean10,
        formattedPhone: formatted,
      };
    }
  } catch (err) {
    console.log('[AuthWhitelist] Owner check error:', err);
    // Fallback: check hardcoded baseline directly
    const isBase = BASELINE_OWNER_NUMBERS.find((b) => b.phone === clean10);
    if (isBase) {
      return {
        allowed: true,
        role: 'OWNER',
        displayName: isBase.name,
        phone: clean10,
        formattedPhone: formatted,
      };
    }
  }

  // STEP 2: Check Registered Staff / Employees in Firestore
  let matchedEmployee: Employee | null = null;

  try {
    const staffCollRef = collection(db, 'enterprises', enterpriseId, 'employees');
    const snap = await getDocs(staffCollRef);

    const activeEmployees = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as any) }))
      .filter((emp: any) => emp.status !== 'LEFT' && emp.isActive !== false);

    matchedEmployee =
      activeEmployees.find((emp) => normalizePhone10(emp.phone) === clean10) || null;
  } catch (cloudErr) {
    console.log('[AuthWhitelist] Firestore employees query failed, checking local store:', cloudErr);
  }

  // Fallback to local employee store if Firestore call failed or was empty
  if (!matchedEmployee) {
    try {
      const localEmployees = useEmployeeStore.getState().employees;
      matchedEmployee =
        localEmployees.find(
          (emp) =>
            normalizePhone10(emp.phone) === clean10 &&
            emp.status !== 'LEFT' &&
            emp.isActive !== false
        ) || null;
    } catch {}
  }

  if (matchedEmployee) {
    // Map employee's role string to system UserRole
    let assignedRole: UserRole = 'EMPLOYEE';
    const roleLower = (matchedEmployee.role || '').toLowerCase();
    if (roleLower.includes('manager')) assignedRole = 'MANAGER';
    else if (roleLower.includes('admin')) assignedRole = 'ADMIN';
    else if (roleLower.includes('account')) assignedRole = 'ACCOUNTANT';

    return {
      allowed: true,
      role: assignedRole,
      displayName: matchedEmployee.name,
      phone: clean10,
      formattedPhone: matchedEmployee.phone || formatted,
      employeeId: matchedEmployee.id,
      employeeData: matchedEmployee,
    };
  }

  // STEP 3: UNREGISTERED PHONE NUMBER — DENY ACCESS IMMEDIATELY!
  return {
    allowed: false,
    role: 'EMPLOYEE',
    displayName: '',
    phone: clean10,
    formattedPhone: formatted,
    denialReason: `Mobile number ${formatted} is not registered in Cool Car Garage.\n\nOnly registered garage owners and authorized staff members are permitted to log in.\n\nPlease contact the Workshop Owner to get your mobile number registered.`,
  };
}
