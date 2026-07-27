import { BillingPeriod } from '../types/customer';

export const BILLING_PERIODS: {
  value: BillingPeriod;
  label: string;
  multiplier: number;
  discountPercent: number;
  monthsCount: number;
}[] = [
  {
    value: 'Bulanan',
    label: 'Bulanan (1 Bulan)',
    multiplier: 1,
    discountPercent: 0,
    monthsCount: 1,
  },
  {
    value: '3 Bulan',
    label: '3 Bulan (PPN 10%)',
    multiplier: 3,
    discountPercent: 10,
    monthsCount: 3,
  },
  {
    value: '6 Bulan',
    label: '6 Bulan (Bayar 5 Bulan)',
    multiplier: 5,
    discountPercent: 0,
    monthsCount: 6,
  },
  {
    value: 'Tahunan',
    label: 'Tahunan (Bayar 10 Bulan)',
    multiplier: 10,
    discountPercent: 0,
    monthsCount: 12,
  },
];
