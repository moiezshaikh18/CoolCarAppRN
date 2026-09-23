// ============================================================
// Firebase Storage Service
// ============================================================

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase.config';

/**
 * Upload a file to Firebase Storage
 * Returns the public download URL
 */
export async function uploadFile(
  path: string,
  blob: Blob | Uint8Array | ArrayBuffer
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}

/**
 * Upload base64 image
 */
export async function uploadBase64Image(
  path: string,
  base64: string,
  contentType = 'image/jpeg'
): Promise<string> {
  const response = await fetch(`data:${contentType};base64,${base64}`);
  const blob = await response.blob();
  return uploadFile(path, blob);
}

/**
 * Delete a file by path
 */
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

/**
 * Build enterprise-scoped storage path
 */
export function enterpriseStoragePath(
  enterpriseId: string,
  category: string,
  filename: string
): string {
  return `enterprises/${enterpriseId}/${category}/${filename}`;
}

