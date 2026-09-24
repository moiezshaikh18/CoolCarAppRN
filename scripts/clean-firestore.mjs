// ============================================================
// Clean Firestore Script
// Clears all test collections under enterprises/cool-car-garage
// Usage: node scripts/clean-firestore.mjs
// ============================================================

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Parse .env directly
const envPath = resolve(process.cwd(), '.env');
const envVars = {};
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf-8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const k = trimmed.substring(0, idx).trim();
        const v = trimmed.substring(idx + 1).trim();
        envVars[k] = v;
      }
    }
  });
}

const firebaseConfig = {
  apiKey: envVars.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: envVars.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: envVars.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

console.log(`Connecting to Firebase project: ${firebaseConfig.projectId}...`);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const enterpriseId = 'enterprise-cool-car';
const fallbackId = 'enterprise-dev-001';

const SUB_COLLECTIONS = [
  'jobSheets',
  'expenses',
  'payments',
  'chalans',
  'customers',
  'vehicles',
  'accountTransactions',
  'employees',
  'salaryPayments',
];

async function deleteCollectionDocs(entId, subColl) {
  const collRef = collection(db, 'enterprises', entId, subColl);
  const snap = await getDocs(collRef);
  if (snap.empty) {
    console.log(`  [${entId}/${subColl}] 0 docs found.`);
    return;
  }
  console.log(`  [${entId}/${subColl}] Deleting ${snap.size} documents...`);
  for (const docSnap of snap.docs) {
    await deleteDoc(doc(db, 'enterprises', entId, subColl, docSnap.id));
  }
  console.log(`  [${entId}/${subColl}] Cleaned.`);
}

async function run() {
  console.log('\n--- Cleaning Test Data from Firestore ---');
  for (const ent of [enterpriseId, fallbackId]) {
    console.log(`\nScanning enterprise: ${ent}...`);
    for (const sub of SUB_COLLECTIONS) {
      try {
        await deleteCollectionDocs(ent, sub);
      } catch (err) {
        console.error(`  Error cleaning ${sub}:`, err.message);
      }
    }
  }
  console.log('\n✅ Firestore test data cleanup finished!\n');
  process.exit(0);
}

run();
