// ============================================================
// Date Utilities
// ============================================================

import { format, isToday, isThisWeek, isThisMonth, startOfDay, endOfDay,
         startOfWeek, endOfWeek, startOfMonth, endOfMonth,
         subMonths, parseISO, isValid } from 'date-fns';

export type DatePreset = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'LAST_MONTH' | 'CUSTOM';

export interface DateRangeValue {
  start: Date;
  end: Date;
  preset: DatePreset;
}

/**
 * Get a date range from a preset
 */
export function getDateRange(preset: DatePreset, customStart?: Date, customEnd?: Date): DateRangeValue {
  const now = new Date();

  switch (preset) {
    case 'TODAY':
      return { start: startOfDay(now), end: endOfDay(now), preset };
    case 'THIS_WEEK':
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }), preset };
    case 'THIS_MONTH':
      return { start: startOfMonth(now), end: endOfMonth(now), preset };
    case 'LAST_MONTH': {
      const last = subMonths(now, 1);
      return { start: startOfMonth(last), end: endOfMonth(last), preset };
    }
    case 'CUSTOM':
      return {
        start: customStart ?? startOfDay(now),
        end: customEnd ?? endOfDay(now),
        preset,
      };
    default:
      return { start: startOfMonth(now), end: endOfMonth(now), preset: 'THIS_MONTH' };
  }
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, fmt = 'dd MMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  return format(d, fmt);
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'dd MMM yyyy, hh:mm a');
}

/**
 * Format for input value (yyyy-MM-dd)
 */
export function toInputDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Relative date label (Today, Yesterday, dd MMM)
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  if (isToday(d)) return 'Today';
  return formatDate(d, 'dd MMM');
}

/**
 * Short time from Firebase Timestamp or Date
 */
export function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const d = parseISO(value);
    return isValid(d) ? d : null;
  }
  // Firestore Timestamp
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    return (value as { toDate(): Date }).toDate();
  }
  return null;
}

