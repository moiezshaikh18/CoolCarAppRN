// ============================================================
// Firebase Configuration
// Never commit real credentials — use environment variables
// ============================================================

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

// Singleton pattern — prevent multiple initializations during HMR
const app: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// Use React Native AsyncStorage for persistent auth sessions across app restarts
let authInstance: Auth;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch {
  authInstance = getAuth(app);
}

export const auth: Auth = authInstance;
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export default app;

