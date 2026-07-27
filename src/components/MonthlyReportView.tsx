import React, { useState, useMemo } from 'react';
import { CustomerWithCalculations } from '../types/customer';
import { formatRupiah } from '../helpers/currency';
import { getCurrentTier } from '../helpers/tierCalculator';
import {
  FileText,
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  Award,
  ArrowRight,
  Download,
  Filter,
  CheckCircle2,
  ChevronRight,
  Database,
  BarChart2,
  HelpCircle,
} from 'lucide-react';

interface MonthlyReportViewProps {
  customers: CustomerWithCalculations[];
  onSelectMonthYear?: (monthIndex: string, year: string) => void;
  onOpenAddModalWithDate?: (dateIso: string) => void;
}

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export interface MonthSummaryData {
  monthIndex: number;
  monthName: string;
  year: number;
  monthYearKey: string; // e.g. "2026-05"
  totalSAAll: number; // Total All Closing
  totalSAActive: number; // Total Active SA
  totalGrossRevenue: number;
  totalPpn: number;
  totalNetRevenue: number;
  tierName: string;
  inc1Percent: number;
  totalKomisi: number;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  customers,
  onSelectMonthYear,
  onOpenAddModalWithDate,
}) => {
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');

  // Extract all unique years from customers data
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    const currentYearStr = new Date().getFullYear().toString();
    yearsSet.add(currentYearStr);

    customers.forEach((c) => {
      if (c.tanggalPasang && c.tanggalPasang.length >= 4) {
        const y = c.tanggalPasang.substring(0, 4);
        if (!isNaN(Number(y))) {
          yearsSet.add(y);
        }
      }
    });

    return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
  }, [customers]);

  // Group customer data by Month and Year
  const monthlySummaries = useMemo(() => {
    const map = new Map<string, CustomerWithCalculations[]>();

    customers.forEach((c) => {
      if (!c.tanggalPasang || c.tanggalPasang === '-') return;
      const date = new Date(c.tanggalPasang);
      if (isNaN(date.getTime())) return;

      const y = date.getFullYear();
      const m = date.getMonth();
      const key = `${y}-${String(m + 1).padStart(2, '0')}`;

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(c);
    });

    const result: MonthSummaryData[] = [];

    map.forEach((items, key) => {
      const [yearStr, monthStr] = key.split('-');
      const year = parseInt(yearStr, 10);
      const monthIndex = parseInt(monthStr, 10) - 1;

      // Filter by selected year if applicable
      if (selectedYearFilter !== 'ALL' && year.toString() !== selectedYearFilter) {
        return;
      }

      const activeItems = items.filter((i) => i.status === 'Aktif');
      const totalSAAll = items.length;
      const totalSAActive = activeItems.length;

      const totalGrossRevenue = items.reduce((acc, i) => acc + i.grossContract, 0);
      const totalPpn = items.reduce((acc, i) => acc + i.ppn, 0);
      const totalNetRevenue = items.reduce((acc, i) => acc + i.monthlyNetRevenue, 0);

      // Compute tier & commission for this month's active sales
      const activeMonthlyNet = activeItems.reduce((acc, i) => acc + i.monthlyNetRevenue, 0);
      const tier = getCurrentTier(totalSAActive, activeMonthlyNet);

      const totalKomisi = activeItems.reduce((acc, i) => {
        return acc + i.monthlyNetRevenue * (tier.inc1Percent / 100);
      }, 0);

      result.push({
        monthIndex,
        monthName: MONTH_NAMES[monthIndex] || 'Unknown',
        year,
        monthYearKey: key,
        totalSAAll,
        totalSAActive,
        totalGrossRevenue,
        totalPpn,
        totalNetRevenue,
        tierName: tier.name,
        inc1Percent: tier.inc1Percent,
        totalKomisi,
      });
    });

    // Sort descending by Year and Month
    return result.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.monthIndex - a.monthIndex;
    });
  }, [customers, selectedYearFilter]);

  // Global Totals across the summary
  const grandTotals = useMemo(() => {
    return monthlySummaries.reduce(
      (acc, curr) => {
        acc.totalSA += curr.totalSAActive;
        acc.totalGross += curr.totalGrossRevenue;
        acc.totalNet += curr.totalNetRevenue;
        acc.totalKomisi += curr.totalKomisi;
        return acc;
      },
      { totalSA: 0, totalGross: 0, totalNet: 0, totalKomisi: 0 }
    );
  }, [monthlySummaries]);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="bg-white dark:bg-[#0F172A] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
            <FileText className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Laporan Revenue & SA Bulanan
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-extrabold text-[10px]">
                Rekap Total Multi-Bulan
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Lihat performa Total SA (Sales Active / Closing), Gross Revenue, Net Revenue, dan Estimasi Komisi per bulan tanpa perlu filter manual satu per satu.
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            title="Cetak Laporan"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak / Export</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total SA (Sales Active) */}
        <div className="bg-white dark:bg-[#0F172A] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total SA (Closing Aktif)</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {grandTotals.totalSA}{' '}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pelanggan</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Total unit SA aktif dari semua bulan terrekam
          </p>
        </div>

        {/* Card 2: Total Gross Revenue */}
        <div className="bg-white dark:bg-[#0F172A] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Gross Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatRupiah(grandTotals.totalGross)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Nilai kotor kontrak sebelum potongan PPN
          </p>
        </div>

        {/* Card 3: Total Net Revenue */}
        <div className="bg-white dark:bg-[#0F172A] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Net Revenue</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {formatRupiah(grandTotals.totalNet)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Net revenue bulanan bersih (Excl. PPN 11%)
          </p>
        </div>

        {/* Card 4: Total Komisi Sales */}
        <div className="bg-white dark:bg-[#0F172A] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Komisi INC1</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatRupiah(grandTotals.totalKomisi)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Estimasi insentif komisi tercapai
          </p>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Filter Controls Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Tabel Rekap Revenue & SA Per Bulan
            </h3>
            <span className="text-xs text-slate-400 font-mono">({monthlySummaries.length} Bulan Terdaftar)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter Tahun:
            </span>
            <select
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Semua Tahun</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  Tahun {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        {monthlySummaries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Belum ada data transaksi bulanan
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Data akan otomatis terisi dan terkelompokkan per bulan begitu Anda menambahkan pelanggan dengan tanggal pasang.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3.5">Periode Bulan</th>
                  <th className="px-4 py-3.5 text-center">Total SA (Closing)</th>
                  <th className="px-4 py-3.5 text-right">Gross Revenue</th>
                  <th className="px-4 py-3.5 text-right">PPN 11%</th>
                  <th className="px-4 py-3.5 text-right">Net Revenue</th>
                  <th className="px-4 py-3.5 text-center">Tier INC1</th>
                  <th className="px-4 py-3.5 text-right">Komisi Sales</th>
                  <th className="px-4 py-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {monthlySummaries.map((m) => (
                  <tr
                    key={m.monthYearKey}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>
                          {m.monthName} {m.year}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-black text-xs">
                        <Users className="w-3.5 h-3.5" />
                        <span>{m.totalSAActive} SA Aktif</span>
                        {m.totalSAAll > m.totalSAActive && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({m.totalSAAll} Total)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-600 dark:text-slate-300">
                      {formatRupiah(m.totalGrossRevenue)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-400 dark:text-slate-500">
                      {formatRupiah(m.totalPpn)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      {formatRupiah(m.totalNetRevenue)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
                        {m.tierName} ({m.inc1Percent}%)
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatRupiah(m.totalKomisi)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => onSelectMonthYear(m.monthIndex.toString(), m.year.toString())}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-[11px] transition-all shadow-2xs cursor-pointer"
                        title="Buka detail tabel bulan ini"
                      >
                        <span>Lihat Detail</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Table Footer Totals */}
              <tfoot>
                <tr className="bg-slate-100 dark:bg-slate-900 font-extrabold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
                  <td className="px-4 py-4">GRAND TOTAL REKAP</td>
                  <td className="px-4 py-4 text-center font-black text-blue-600 dark:text-blue-400 text-sm">
                    {grandTotals.totalSA} SA
                  </td>
                  <td className="px-4 py-4 text-right font-mono">{formatRupiah(grandTotals.totalGross)}</td>
                  <td className="px-4 py-4 text-right font-mono text-slate-400">
                    {formatRupiah(grandTotals.totalGross * 0.11)}
                  </td>
                  <td className="px-4 py-4 text-right font-mono font-black text-blue-600 dark:text-blue-400">
                    {formatRupiah(grandTotals.totalNet)}
                  </td>
                  <td className="px-4 py-4 text-center text-slate-400">-</td>
                  <td className="px-4 py-4 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                    {formatRupiah(grandTotals.totalKomisi)}
                  </td>
                  <td className="px-4 py-4 text-center"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
