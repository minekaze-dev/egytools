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
  // 1. First find active closing count and active monthly net revenue
  let activeClosing = 0;
  let activeMonthlyNetRevenue = 0;
  let totalGrossRevenue = 0;
  let totalRefunds = 0;
  let totalDismantles = 0;

  const rawCalculated = customers.map((c) => {
    const rev = calculateRevenue(c.packagePrice, c.periode);
    if (c.status === 'Aktif') {
      activeClosing += 1;
      activeMonthlyNetRevenue += rev.monthlyNetRevenue;
      totalGrossRevenue += rev.grossContract;
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

  // 3. Enrich customer list
  const customersWithCalculations: CustomerWithCalculations[] = rawCalculated.map(
    ({ customer, rev }) => {
      // Individual estimated commission is based on active tier rate if active, else 0 if refund/dismantle
      const estimasiKomisi =
        customer.status === 'Aktif'
          ? Math.round((rev.monthlyNetRevenue * inc1Percent) / 100)
          : 0;

      return {
        ...customer,
        ...rev,
        tierName: currentGlobalTier.name,
        inc1Percent,
        estimasiKomisi,
      };
    }
  );

  // 4. Calculate total commission for sales agent
  const totalKomisiSales = Math.round(
    (activeMonthlyNetRevenue * inc1Percent) / 100
  );

  const stats: GlobalStats = {
    totalClosing: activeClosing,
    totalGrossRevenue,
    totalMonthlyNetRevenue: Math.round(activeMonthlyNetRevenue),
    totalKomisiSales,
    totalActiveCustomers: activeClosing,
    totalRefunds,
    totalDismantles,
  };

  return { customersWithCalculations, stats };
};
