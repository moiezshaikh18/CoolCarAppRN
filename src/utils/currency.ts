// ============================================================
// Currency Utilities
// ============================================================

/**
 * Format amount with currency symbol
 * Uses enterprise currency settings
 */
export function formatCurrency(
  amount: number,
  symbol = '₹',
  locale = 'en-IN'
): string {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formatted}`;
}

/**
 * Format compact amounts (1000 → 1K, 100000 → 1L)
 */
export function formatCompactCurrency(
  amount: number,
  symbol = '₹'
): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10_00_000) {
    return `${sign}${symbol}${(abs / 10_00_000).toFixed(1)}Cr`;
  }
  if (abs >= 1_00_000) {
    return `${sign}${symbol}${(abs / 1_00_000).toFixed(1)}L`;
  }
  if (abs >= 1_000) {
    return `${sign}${symbol}${(abs / 1_000).toFixed(1)}K`;
  }
  return `${sign}${symbol}${abs.toFixed(0)}`;
}

/**
 * Parse a string into a clean number (removes symbols, commas)
 */
export function parseCurrencyInput(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Validate a monetary amount is positive and reasonable
 */
export function isValidAmount(amount: number): boolean {
  return !isNaN(amount) && amount > 0 && amount < 10_00_00_000; // max 1 billion
}

