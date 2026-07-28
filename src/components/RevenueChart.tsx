import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { CustomerWithCalculations } from '../types/customer';
import { formatRupiah } from '../helpers/currency';
import { TrendingUp, PieChartIcon, BarChart3 } from 'lucide-react';

interface RevenueChartProps {
  customers: CustomerWithCalculations[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ customers }) => {
  // 1. Group data by Month for Revenue & Commission Trend
  const monthlyData = useMemo(() => {
    const monthMap: Record<
      string,
      { monthName: string; gross: number; netRevenue: number; komisi: number; closing: number }
    > = {};

    // Standard months list to ensure chronological order
    const months = ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'Mei 2026', 'Jun 2026'];
    months.forEach((m) => {
      monthMap[m] = { monthName: m, gross: 0, netRevenue: 0, komisi: 0, closing: 0 };
    });

    customers.forEach((c) => {
      if (!c.tanggalPasang) return;
      const date = new Date(c.tanggalPasang);
      const monthIndex = date.getMonth();
      const monthNamesIndo = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ];
      const key = `${monthNamesIndo[monthIndex]} ${date.getFullYear()}`;

      if (!monthMap[key]) {
        monthMap[key] = { monthName: key, gross: 0, netRevenue: 0, komisi: 0, closing: 0 };
      }

      if (c.status === 'Aktif') {
        monthMap[key].gross += c.grossContract;
        monthMap[key].netRevenue += c.monthlyNetRevenue;
        monthMap[key].komisi += c.estimasiKomisi;
        monthMap[key].closing += 1;
      }
    });

    return Object.values(monthMap);
  }, [customers]);

  // 2. Customer Status Distribution for Donut Chart
  const statusData = useMemo(() => {
    const counts = { Aktif: 0, Refund: 0, Dismantle: 0 };
    customers.forEach((c) => {
      if (c.status in counts) {
        counts[c.status]++;
      }
    });

    return [
      { name: 'Aktif', value: counts.Aktif, color: '#10B981' }, // Emerald
      { name: 'Refund', value: counts.Refund, color: '#F43F5E' }, // Rose
      { name: 'Dismantle', value: counts.Dismantle, color: '#64748B' }, // Slate
    ];
  }, [customers]);

  // 3. Package Popularity for Bar Chart
  const packageData = useMemo(() => {
    const map: Record<string, { packageName: string; count: number; netRevenue: number }> = {};
    customers.forEach((c) => {
      if (c.status === 'Aktif') {
        if (!map[c.packageName]) {
          map[c.packageName] = { packageName: c.packageName, count: 0, netRevenue: 0 };
        }
        map[c.packageName].count += 1;
        map[c.packageName].netRevenue += c.monthlyNetRevenue;
      }
    });

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5 packages
  }, [customers]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart 1: Revenue & Commission Trend Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-none bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 shadow-xs lg:col-span-2 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                Tren Net Revenue & Komisi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Perkembangan Net Revenue & Komisi per Bulan
              </p>
            </div>
          </div>
        </div>

        <div className="h-[210px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorKomisi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="monthName"
                tick={{ fontSize: 12, fontWeight: 700 }}
                stroke="#94A3B8"
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fontWeight: 700 }}
                stroke="#94A3B8"
                tickLine={false}
                tickFormatter={(v) => `Rp${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-none shadow-2xl border-2 border-slate-700 space-y-1 font-mono">
                        <div className="font-extrabold border-b border-slate-700 pb-1 uppercase">{label}</div>
                        <div className="text-emerald-400 font-bold">
                          Net Revenue: {formatRupiah(payload[0].value as number)}
                        </div>
                        <div className="text-indigo-400 font-bold">
                          Komisi: {formatRupiah(payload[1].value as number)}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="netRevenue"
                name="Net Revenue"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorNet)"
                strokeWidth={2.5}
              />
              <Area
                type="monotone"
                dataKey="komisi"
                name="Komisi Sales"
                stroke="#6366F1"
                fillOpacity={1}
                fill="url(#colorKomisi)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Chart 2: Status Distribution Donut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-none bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                Status Pelanggan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Distribusi Aktif vs Refund/Dismantle</p>
            </div>
          </div>
        </div>

        <div className="h-[180px] w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    return (
                      <div className="bg-slate-900 text-white text-xs p-2.5 rounded-none shadow-2xl border-2 border-slate-700 font-mono">
                        <span className="font-extrabold uppercase">{data.name}:</span> {data.value} Pelanggan
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300 pt-2 border-t-2 border-slate-200 dark:border-slate-800 uppercase">
          {statusData.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-none border border-slate-400" style={{ backgroundColor: s.color }} />
              <span>
                {s.name} ({s.value})
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
