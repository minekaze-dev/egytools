export type CustomerStatus = 'Aktif' | 'Refund' | 'Dismantle';

export type BillingPeriod = 'Bulanan' | '3 Bulan' | '6 Bulan' | 'Tahunan';

export interface ISPPackage {
  id: string;
  name: string;
  speed: string;
  price: number;
  category: 'Standard' | 'Sports' | 'Plus TV' | 'SMT' | 'Oxylite';
}

export interface Customer {
  id: string;
  namaPelanggan: string;
  nomorInternet: string;
  nomorHP: string;
  area: string;
  sales: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  periode: BillingPeriod;
  tanggalPasang: string; // ISO date format YYYY-MM-DD
  status: CustomerStatus;
  catatan?: string;
  createdAt: string;
}

export interface CalculatedRevenue {
  grossContract: number;
  ppn: number;
  netContract: number;
  monthlyNetRevenue: number;
}

export interface CustomerWithCalculations extends Customer, CalculatedRevenue {
  tierName: string;
  inc1Percent: number;
  estimasiKomisi: number;
}

export interface TierDefinition {
  level: number;
  name: string;
  minClosing: number;
  minRevenue: number;
  inc1Percent: number; // percentage integer, e.g. 25 for 25%
}

export interface GlobalStats {
  totalClosing: number;
  totalGrossRevenue: number;
  totalMonthlyNetRevenue: number;
  totalKomisiSales: number;
  totalActiveCustomers: number;
  totalRefunds: number;
  totalDismantles: number;
}

export interface TierProgress {
  currentTier: TierDefinition;
  nextTier: TierDefinition | null;
  activeClosing: number;
  activeRevenue: number;
  closingNeeded: number;
  revenueNeeded: number;
  closingProgressPercent: number;
  revenueProgressPercent: number;
  isMaxTier: boolean;
}
