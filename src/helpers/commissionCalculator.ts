import { calculateRevenue } from './revenueCalculator';
import { getCurrentTier } from './tierCalculator';
import { Customer, CustomerWithCalculations, GlobalStats } from '../types/customer';

/**
 * Enriches a customer list with calculated fields, tier, INC1, and commission.
 * Calculates global stats based on active customer rules.
 */
export const calculateAllCustomerMetrics = (
  customers: Customer[]
): {
  customersWithCalculations: CustomerWithCalculations[];
  stats: GlobalStats;
} => {
  // 1. First find active closing count, active monthly net revenue, and active yearly package count
  let activeClosing = 0;
  let activeMonthlyNetRevenue = 0;
  let totalGrossRevenue = 0;
  let totalRefunds = 0;
  let totalDismantles = 0;
  let activeYearlyCount = 0;

  const rawCalculated = customers.map((c) => {
    const rev = calculateRevenue(c.packagePrice, c.periode);
    if (c.status === 'Aktif') {
      activeClosing += 1;
      activeMonthlyNetRevenue += rev.monthlyNetRevenue;
      totalGrossRevenue += rev.grossContract;
      if (c.periode === 'Tahunan') {
        activeYearlyCount += 1;
      }
    } else if (c.status === 'Refund') {
      totalRefunds += 1;
    } else if (c.status === 'Dismantle') {
      totalDismantles += 1;
    }
    return { customer: c, rev };
  });

  // 2. Determine global sales tier based on active customers
  const currentGlobalTier = getCurrentTier(activeClosing, activeMonthlyNetRevenue);
  const inc1Percent = currentGlobalTier.inc1Percent;

  // 3. Enrich customer list with yearly bonus (+200.000 if active Tahunan)
  const customersWithCalculations: CustomerWithCalculations[] = rawCalculated.map(
    ({ customer, rev }) => {
      // Individual estimated commission: Tier % of Net Rev + 200k if active Tahunan
      const baseKomisi =
        customer.status === 'Aktif'
          ? Math.round((rev.monthlyNetRevenue * inc1Percent) / 100)
          : 0;
      const bonusTahunan =
        customer.status === 'Aktif' && customer.periode === 'Tahunan' ? 200000 : 0;
      const estimasiKomisi = baseKomisi + bonusTahunan;

      return {
        ...customer,
        ...rev,
        tierName: currentGlobalTier.name,
        inc1Percent,
        estimasiKomisi,
      };
    }
  );

  // 4. Calculate total commission for sales agent including total yearly bonus
  const totalKomisiTahunan = activeYearlyCount * 200000;
  const baseKomisiTotal = Math.round(
    (activeMonthlyNetRevenue * inc1Percent) / 100
  );
  const totalKomisiSales = baseKomisiTotal + totalKomisiTahunan;

  const stats: GlobalStats = {
    totalClosing: activeClosing,
    totalGrossRevenue,
    totalMonthlyNetRevenue: Math.round(activeMonthlyNetRevenue),
    totalKomisiSales,
    totalKomisiTahunan,
    totalActiveCustomers: activeClosing,
    totalRefunds,
    totalDismantles,
  };

  return { customersWithCalculations, stats };
};
