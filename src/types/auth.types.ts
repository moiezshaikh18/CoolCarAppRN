// ============================================================
// Auth Types
// ============================================================

export interface UserProfile {
  uid: string;
  phone: string;
  displayName: string;
  email?: string;
  photoUrl?: string;
  enterpriseIds: string[];
  activeEnterpriseId?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type AuthState = 'loading' | 'unauthenticated' | 'authenticated' | 'onboarding';

export interface OTPVerificationState {
  phone: string;
  verificationId: string;
  timer: number;
  canResend: boolean;
  isLoading: boolean;
  error?: string;
}

export interface LoginFormData {
  phone: string;
  countryCode: string;
}

export interface ProfileFormData {
  displayName: string;
  email?: string;
}

