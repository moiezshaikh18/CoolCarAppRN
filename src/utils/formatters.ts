// ============================================================
// Formatters — Display helpers
// ============================================================

import { UserRole } from '../types/enterprise.types';
import { JobStatus } from '../types/jobSheet.types';
import { PaymentMode, PaymentStatus } from '../types/payment.types';
import { FuelType } from '../types/vehicle.types';

export function formatPhoneDisplay(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return phone;
}

export function formatJobNumber(prefix: string, number: number, padding = 4): string {
  return `${prefix}-${String(number).padStart(padding, '0')}`;
}

export function formatRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    OWNER: 'Owner',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    ACCOUNTANT: 'Accountant',
    EMPLOYEE: 'Employee',
  };
  return labels[role] ?? role;
}

export function formatJobStatus(status: JobStatus): string {
  const labels: Record<JobStatus, string> = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };
  return labels[status] ?? status;
}

export function formatPaymentStatus(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    PENDING: 'Pending',
    PARTIALLY_PAID: 'Partially Paid',
    PAID: 'Paid',
  };
  return labels[status] ?? status;
}

export function formatPaymentMode(mode: PaymentMode): string {
  const labels: Record<PaymentMode, string> = {
    CASH: 'Cash',
    UPI: 'UPI',
    CARD_SWIPE: 'Card Swipe',
  };
  return labels[mode] ?? mode;
}

export function formatFuelType(fuel: FuelType): string {
  const labels: Record<FuelType, string> = {
    PETROL: 'Petrol',
    DIESEL: 'Diesel',
    CNG: 'CNG',
    ELECTRIC: 'Electric',
    HYBRID: 'Hybrid',
    LPG: 'LPG',
  };
  return labels[fuel] ?? fuel;
}

export function getJobStatusColor(status: JobStatus): string {
  const colors: Record<JobStatus, string> = {
    OPEN: '#4F8CFF',
    IN_PROGRESS: '#FFB347',
    COMPLETED: '#00C896',
    CANCELLED: '#FF4D6D',
  };
  return colors[status] ?? '#888';
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    PENDING: '#FF4D6D',
    PARTIALLY_PAID: '#FFB347',
    PAID: '#00C896',
  };
  return colors[status] ?? '#888';
}

export function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber || accountNumber.length < 4) return accountNumber;
  return `****${accountNumber.slice(-4)}`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

