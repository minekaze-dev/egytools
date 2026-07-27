/**
 * Formats a number to Indonesian Rupiah currency string.
 * Example: 185000 => "Rp185.000"
 */
export const formatRupiah = (amount: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rp0';
  }
  const formatted = Math.round(amount).toLocaleString('id-ID');
  return `Rp${formatted}`;
};

/**
 * Formats percentage.
 * Example: 25 => "25%"
 */
export const formatPercent = (percent: number): string => {
  return `${percent}%`;
};
