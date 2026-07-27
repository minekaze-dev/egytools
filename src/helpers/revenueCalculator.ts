import { BillingPeriod, CalculatedRevenue } from '../types/customer';

/**
 * Calculates contract revenue metrics based on package price and billing period.
 * 
 * Rules:
 * - Bulanan (1 bulan): Gross = Price * 1
 * - 3 Bulan (3 bulan): Gross = Price * 3 * 0.9 (PPN 10%)
 * - 6 Bulan (6 bulan): Gross = Price * 5 (Bayar 5 bulan)
 * - Tahunan (12 bulan): Gross = Price * 10 (Bayar 10 bulan)
 * 
 * Net Contract = Gross / 1.11
 * PPN (11%) = Gross - Net Contract
 * Monthly Net Revenue = Net Contract / monthsCount (dibagi 12 untuk Tahunan, 6 untuk 6 Bulan, 3 untuk 3 Bulan)
 */
export const calculateRevenue = (
  packagePrice: number,
  period: BillingPeriod
): CalculatedRevenue => {
  let monthsCount = 1;
  let grossContract = packagePrice;

  switch (period) {
    case 'Bulanan':
      grossContract = packagePrice * 1;
      monthsCount = 1;
      break;
    case '3 Bulan':
      grossContract = packagePrice * 3 * 0.9;
      monthsCount = 3;
      break;
    case '6 Bulan':
      grossContract = packagePrice * 5;
      monthsCount = 6;
      break;
    case 'Tahunan':
      grossContract = packagePrice * 10;
      monthsCount = 12;
      break;
    default:
      grossContract = packagePrice;
      monthsCount = 1;
      break;
  }

  // Net Contract calculation (Dipotong PPN 11%)
  const netContract = grossContract / 1.11;
  const ppn = grossContract - netContract;

  // Monthly Net Revenue = Net Contract / monthsCount (Hasil bagi 12 untuk Tahunan)
  const monthlyNetRevenue = netContract / monthsCount;

  return {
    grossContract: Math.round(grossContract),
    ppn: Math.round(ppn),
    netContract: Math.round(netContract),
    monthlyNetRevenue: Math.round(monthlyNetRevenue * 100) / 100,
  };
};

