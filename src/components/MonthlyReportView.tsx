import React, { useState, useMemo } from 'react';
import { CustomerWithCalculations, Customer } from '../types/customer';
import { formatRupiah } from '../helpers/currency';
import { getCurrentTier } from '../helpers/tierCalculator';
import { calculateRevenue } from '../helpers/revenueCalculator';
import { parseTanggalPasang } from '../helpers/dateFormatter';
import { StatusBadge } from './StatusBadge';
import {
  FileText,
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Download,
  Filter,
  ChevronRight,
  BarChart2,
  Search,
  X,
  ExternalLink,
  Printer,
  Lock,
  UserPlus,
} from 'lucide-react';

interface MonthlyReportViewProps {
  customers: CustomerWithCalculations[] | Customer[];
  onSelectMonthYear?: (monthIndex: string, year: string) => void;
  onOpenAddModalWithDate?: (dateIso: string) => void;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
  selectedMonthExternal?: string;
  selectedYearExternal?: string;
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
  totalKomisiTahunan: number;
  items: CustomerWithCalculations[];
}

// Helper function to extract day number if date matches expected month/year
const getDayNumberFromTanggalPasang = (
  tanggalPasang: string,
  expectedYear: number,
  expectedMonthIndex: number
): number | null => {
  if (!tanggalPasang || tanggalPasang === '-') return null;

  // Pattern 1: YYYY-MM-DD or YYYY/MM/DD
  const matchIso = tanggalPasang.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (matchIso) {
    const y = parseInt(matchIso[1], 10);
    const m = parseInt(matchIso[2], 10) - 1;
    const d = parseInt(matchIso[3], 10);
    if (y === expectedYear && m === expectedMonthIndex) {
      return d;
    }
  }

  // Pattern 2: DD-MM-YYYY or DD/MM/YYYY
  const matchLocal = tanggalPasang.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (matchLocal) {
    const d = parseInt(matchLocal[1], 10);
    const m = parseInt(matchLocal[2], 10) - 1;
    const y = parseInt(matchLocal[3], 10);
    if (y === expectedYear && m === expectedMonthIndex) {
      return d;
    }
  }

  // Pattern 3: Fallback Date parse
  const dateObj = new Date(tanggalPasang);
  if (!isNaN(dateObj.getTime())) {
    if (
      dateObj.getFullYear() === expectedYear &&
      dateObj.getMonth() === expectedMonthIndex
    ) {
      return dateObj.getDate();
    }
  }

  return null;
};

// Mini Calendar Component for Monthly Table Column
const MiniMonthCalendar: React.FC<{ summary: MonthSummaryData }> = ({ summary }) => {
  const { year, monthIndex, monthName, items } = summary;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startOffset = new Date(year, monthIndex, 1).getDay(); // 0 = Sun, 6 = Sat

  // Group items by day number
  const daysMap = useMemo(() => {
    const map = new Map<number, CustomerWithCalculations[]>();
    for (let d = 1; d <= daysInMonth; d++) {
      map.set(d, []);
    }
    items.forEach((item) => {
      const day = getDayNumberFromTanggalPasang(item.tanggalPasang, year, monthIndex);
      if (day && day >= 1 && day <= daysInMonth) {
        map.get(day)!.push(item);
      }
    });
    return map;
  }, [items, year, monthIndex, daysInMonth]);

  const totalInstalledDays = useMemo(() => {
    let count = 0;
    daysMap.forEach((list) => {
      if (list.length > 0) count++;
    });
    return count;
  }, [daysMap]);

  return (
    <div className="mt-2 p-2 bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-none w-fit">
      <div className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between gap-3">
        <span>Kalender Pemasangan</span>
        <span className="text-[8px] text-lime-600 dark:text-lime-400 font-extrabold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] inline-block" />
          {totalInstalledDays} Hari Ada Pasang
        </span>
      </div>

      {/* Weekday Labels (Sun-Sat) */}
      <div className="grid grid-cols-7 gap-0.5 text-center font-black text-[8px] uppercase text-slate-400 mb-1">
        <div>M</div>
        <div>S</div>
        <div>S</div>
        <div>R</div>
        <div>K</div>
        <div>J</div>
        <div>S</div>
      </div>

      {/* Calendar Grid 1..31 */}
      <div className="grid grid-cols-7 gap-0.5">
        {/* Empty Offset Cells */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`off-${i}`} className="w-5 h-5 opacity-0" />
        ))}

        {/* Day Cells */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const d = idx + 1;
          const dayItems = daysMap.get(d) || [];
          const hasInstalls = dayItems.length > 0;

          // Positioning popover horizontally based on column index
          const gridIndex = startOffset + idx;
          const col = gridIndex % 7;
          let horizPosClass = 'left-1/2 -translate-x-1/2';
          if (col <= 1) horizPosClass = 'left-0 translate-x-0';
          if (col >= 5) horizPosClass = 'right-0 left-auto translate-x-0';

          return (
            <div key={d} className="relative group">
              <div
                className={`w-5 h-5 flex items-center justify-center text-[9px] font-mono transition-all ${
                  hasInstalls
                    ? 'bg-[#a3e635] text-slate-950 font-black border border-lime-600 shadow-xs cursor-pointer hover:scale-110 z-10'
                    : 'bg-white dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {d}
              </div>

              {/* Hover Popover Tooltip */}
              {hasInstalls && (
                <div
                  className={`absolute hidden group-hover:block z-50 w-60 p-2.5 bg-slate-900 dark:bg-slate-950 text-white border-2 border-[#a3e635] shadow-2xl pointer-events-none bottom-full mb-1 ${horizPosClass} animate-in fade-in zoom-in-95 duration-100`}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800 mb-1.5">
                    <span className="font-extrabold text-[11px] text-[#a3e635]">
                      {d} {monthName} {year}
                    </span>
                    <span className="px-1.5 py-0.2 bg-[#a3e635] text-slate-950 font-black text-[9px] uppercase">
                      {dayItems.length} Pemasangan
                    </span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-0.5">
                    {dayItems.map((item) => (
                      <div key={item.id} className="p-1.5 bg-slate-800 border border-slate-700 text-[10px]">
                        <div className="font-black text-white truncate">{item.namaPelanggan}</div>
                        <div className="font-mono text-blue-400 font-bold text-[9px]">
                          ID: {item.nomorInternet}
                        </div>
                        <div className="text-slate-300 text-[9px]">
                          {item.packageName} &bull; {item.periode}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  customers,
  onSelectMonthYear,
  isLoggedIn = false,
  onOpenAuth,
  selectedMonthExternal,
  selectedYearExternal,
}) => {
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');
  const [selectedDetail, setSelectedDetail] = useState<MonthSummaryData | null>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState<string>('');
  const [guestLockFeature, setGuestLockFeature] = useState<string | null>(null);

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

  // Group customer data by Month and Year with full revenue calculations
  const monthlySummaries = useMemo(() => {
    const map = new Map<string, Customer[]>();

    // Ensure current month is always present for real-time new month tracking
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    map.set(currentKey, []);

    customers.forEach((c) => {
      if (!c.tanggalPasang || c.tanggalPasang === '-') return;
      const parsed = parseTanggalPasang(c.tanggalPasang);
      if (!parsed) return;

      const y = parsed.year;
      const m = parsed.monthIndex;
      const key = `${y}-${String(m + 1).padStart(2, '0')}`;

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(c);
    });

    const result: MonthSummaryData[] = [];

    map.forEach((rawItems, key) => {
      const [yearStr, monthStr] = key.split('-');
      const year = parseInt(yearStr, 10);
      const monthIndex = parseInt(monthStr, 10) - 1;

      // Filter by selected internal year filter if applicable
      if (selectedYearFilter !== 'ALL' && year.toString() !== selectedYearFilter) {
        return;
      }

      // Enrich raw items with individual revenue calculations
      const enrichedItems: CustomerWithCalculations[] = rawItems.map((c) => {
        const rev = calculateRevenue(c.packagePrice, c.periode);
        return {
          ...c,
          ...rev,
          tierName: 'Tier 0',
          inc1Percent: 0,
          estimasiKomisi: 0,
        };
      });

      const activeItems = enrichedItems.filter((i) => i.status === 'Aktif');
      const totalSAAll = enrichedItems.length;
      const totalSAActive = activeItems.length;

      const totalGrossRevenue = activeItems.reduce((acc, i) => acc + i.grossContract, 0);
      const totalPpn = activeItems.reduce((acc, i) => acc + i.ppn, 0);
      const totalNetRevenue = activeItems.reduce((acc, i) => acc + i.monthlyNetRevenue, 0);

      // Compute tier & commission for this month's active sales
      const tier = getCurrentTier(totalSAActive, totalNetRevenue);

      // Re-map with tier and commission (+200k if active Tahunan)
      const finalItems: CustomerWithCalculations[] = enrichedItems.map((i) => {
        const baseKomisi =
          i.status === 'Aktif'
            ? Math.round((i.monthlyNetRevenue * tier.inc1Percent) / 100)
            : 0;
        const bonusTahunan =
          i.status === 'Aktif' && i.periode === 'Tahunan' ? 200000 : 0;
        const estimasiKomisi = baseKomisi + bonusTahunan;
        return {
          ...i,
          tierName: tier.name,
          inc1Percent: tier.inc1Percent,
          estimasiKomisi,
        };
      });

      const totalKomisi = finalItems
        .filter((i) => i.status === 'Aktif')
        .reduce((acc, i) => acc + i.estimasiKomisi, 0);

      const totalKomisiTahunan = finalItems
        .filter((i) => i.status === 'Aktif' && i.periode === 'Tahunan')
        .length * 200000;

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
        totalKomisiTahunan,
        items: finalItems,
      });
    });

    // Sort descending by Year and Month
    return result.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.monthIndex - a.monthIndex;
    });
  }, [customers, selectedYearFilter]);

  // Global Totals across all monthly summaries
  const grandTotals = useMemo(() => {
    return monthlySummaries.reduce(
      (acc, curr) => {
        acc.totalSA += curr.totalSAActive;
        acc.totalGross += curr.totalGrossRevenue;
        acc.totalNet += curr.totalNetRevenue;
        acc.totalKomisi += curr.totalKomisi;
        acc.totalKomisiTahunan += curr.totalKomisiTahunan;
        return acc;
      },
      { totalSA: 0, totalGross: 0, totalNet: 0, totalKomisi: 0, totalKomisiTahunan: 0 }
    );
  }, [monthlySummaries]);

  // Filter items in Detail Modal by search query
  const modalFilteredItems = useMemo(() => {
    if (!selectedDetail) return [];
    if (!modalSearchQuery.trim()) return selectedDetail.items;

    const q = modalSearchQuery.toLowerCase();
    return selectedDetail.items.filter(
      (item) =>
        item.namaPelanggan.toLowerCase().includes(q) ||
        item.nomorInternet.toLowerCase().includes(q) ||
        item.packageName.toLowerCase().includes(q)
    );
  }, [selectedDetail, modalSearchQuery]);

  // CSV Export for a specific month
  const handleExportMonthCSV = (detail: MonthSummaryData) => {
    const headers = [
      'No',
      'No Internet',
      'Nama Pelanggan',
      'Paket',
      'Periode',
      'Tanggal Pasang',
      'Status',
      'Gross Contract (Rp)',
      'PPN 11% (Rp)',
      'Monthly Net Revenue (Rp)',
      'Komisi Sales (Rp)',
    ];

    const csvRows = detail.items.map((c, idx) => [
      idx + 1,
      `"${(c.nomorInternet || '').replace(/"/g, '""')}"`,
      `"${(c.namaPelanggan || '').replace(/"/g, '""')}"`,
      `"${(c.packageName || '').replace(/"/g, '""')}"`,
      `"${c.periode}"`,
      `"${c.tanggalPasang || ''}"`,
      `"${c.status}"`,
      Math.round(c.grossContract),
      Math.round(c.ppn),
      Math.round(c.monthlyNetRevenue),
      c.estimasiKomisi,
    ]);

    const csvString = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Laporan_Revenue_${detail.monthName}_${detail.year}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Export for Rekap Multi-Bulan Summary
  const handleExportSummaryCSV = () => {
    const headers = [
      'No',
      'Periode Bulan',
      'Tahun',
      'Total SA Aktif',
      'Total All SA',
      'Gross Revenue (Rp)',
      'PPN 11% (Rp)',
      'Net Revenue (Rp)',
      'Tier Sales',
      'Persentase Komisi (%)',
      'Total Komisi Sales (Rp)',
    ];

    const csvRows = monthlySummaries.map((m, idx) => [
      idx + 1,
      `"${m.monthName}"`,
      m.year,
      m.totalSAActive,
      m.totalSAAll,
      Math.round(m.totalGrossRevenue),
      Math.round(m.totalPpn),
      Math.round(m.totalNetRevenue),
      `"${m.tierName}"`,
      `${m.inc1Percent}%`,
      Math.round(m.totalKomisi),
    ]);

    const csvString = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Rekap_Laporan_Revenue_Bulanan_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="bg-white dark:bg-[#0F172A] p-5 sm:p-6 rounded-none border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-none bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border-2 border-blue-500/30 shrink-0">
            <FileText className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
                Report Revenue & SA Bulanan
              </h2>
              <span className="px-2.5 py-0.5 rounded-none bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 font-extrabold text-[10px] border border-blue-300 dark:border-blue-800 uppercase">
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
            onClick={() => {
              if (!isLoggedIn) {
                setGuestLockFeature('Export CSV Summary');
                return;
              }
              handleExportSummaryCSV();
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-none border-2 border-emerald-700 transition-colors cursor-pointer uppercase shadow-xs"
            title={isLoggedIn ? "Export CSV Rekap Bulanan" : "Fitur Terkunci (Khusus Akun Login)"}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV Summary</span>
            {!isLoggedIn && <Lock className="w-3.5 h-3.5 text-amber-300 ml-0.5 shrink-0" />}
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-none border-2 border-slate-300 dark:border-slate-700 transition-colors cursor-pointer uppercase"
            title="Cetak Laporan"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Unified Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {/* Card 1: Total SA (Sales Active) */}
        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-none border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total SA</span>
            <div className="p-1.5 rounded-none bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {grandTotals.totalSA} <span className="text-xs font-medium text-slate-500">Pelanggan</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
              Total SA aktif
            </p>
          </div>
        </div>

        {/* Card 2: Total Gross Revenue */}
        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-none border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gross Revenue</span>
            <div className="p-1.5 rounded-none bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              {formatRupiah(grandTotals.totalGross)}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
              Sebelum PPN
            </p>
          </div>
        </div>

        {/* Card 3: Total Net Revenue */}
        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-none border-2 border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/10 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Net Revenue</span>
            <div className="p-1.5 rounded-none bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400 truncate">
              {formatRupiah(grandTotals.totalNet)}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
              Excl. PPN 11%
            </p>
          </div>
        </div>

        {/* Card 4: Komisi Tahunan */}
        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-none border-2 border-amber-300 dark:border-amber-800/80 bg-amber-50/25 dark:bg-amber-950/20 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Komisi Tahunan</span>
            <div className="p-1.5 rounded-none bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 truncate">
              {formatRupiah(grandTotals.totalKomisiTahunan)}
            </div>
            <p className="text-[10px] text-amber-700 dark:text-amber-300 font-extrabold mt-0.5 truncate">
              {grandTotals.totalKomisiTahunan > 0 ? `+200rb x ${grandTotals.totalKomisiTahunan / 200000} Paket` : '0 Paket Tahunan'}
            </p>
          </div>
        </div>

        {/* Card 4: Total Komisi */}
        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-none border-2 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Komisi</span>
            <div className="p-1.5 rounded-none bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 truncate">
              {formatRupiah(grandTotals.totalKomisi)}
            </div>
            {grandTotals.totalKomisiTahunan > 0 ? (
              <p className="text-[9px] text-emerald-700 dark:text-emerald-300 font-extrabold mt-0.5 whitespace-nowrap truncate" title={`+${formatRupiah(grandTotals.totalKomisiTahunan)} (Komisi Tahunan)`}>
                +{formatRupiah(grandTotals.totalKomisiTahunan)} (Komisi Tahunan)
              </p>
            ) : (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                Sesuai Tier Sales
              </p>
            )}
          </div>
        </div>

        {/* Card 5: Insentif 25% */}
        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-none border-2 border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Insentif 25%</span>
            <span className="px-1.5 py-0.5 rounded-none bg-amber-100 dark:bg-amber-900/40 font-bold border border-amber-300 dark:border-amber-800 text-[10px]">25%</span>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-amber-700 dark:text-amber-300 truncate">
              {formatRupiah(grandTotals.totalNet * 0.25)}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
              25% x Net Revenue
            </p>
          </div>
        </div>

        {/* Card 6: Insentif 30% */}
        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-none border-2 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/10 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Insentif 30%</span>
            <span className="px-1.5 py-0.5 rounded-none bg-indigo-100 dark:bg-indigo-900/40 font-bold border border-indigo-300 dark:border-indigo-800 text-[10px]">30%</span>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-indigo-700 dark:text-indigo-300 truncate">
              {formatRupiah(grandTotals.totalNet * 0.30)}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
              30% x Net Revenue
            </p>
          </div>
        </div>

        {/* Card 7: Insentif 35% */}
        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-none border-2 border-teal-200 dark:border-teal-900/60 bg-teal-50/20 dark:bg-teal-950/10 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-teal-600 dark:text-teal-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Insentif 35%</span>
            <span className="px-1.5 py-0.5 rounded-none bg-teal-100 dark:bg-teal-900/40 font-bold border border-teal-300 dark:border-teal-800 text-[10px]">35%</span>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-teal-700 dark:text-teal-300 truncate">
              {formatRupiah(grandTotals.totalNet * 0.35)}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
              35% x Net Revenue
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white dark:bg-[#0F172A] rounded-none border-2 border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Filter Controls Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Tabel Rekap Revenue & SA Per Bulan
            </h3>
            <span className="text-xs text-slate-400 font-mono">({monthlySummaries.length} Bulan Terdaftar)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase">
              <Filter className="w-3.5 h-3.5" />
              Filter Tahun:
            </span>
            <select
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value)}
              className="px-3 py-1.5 rounded-none border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-blue-600 uppercase"
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
                  <th className="px-4 py-3.5 text-center">Tier Sales</th>
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
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>
                          {m.monthName} {m.year}
                        </span>
                      </div>
                      <MiniMonthCalendar summary={m} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-black text-xs">
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
                      <span className="px-2.5 py-1 rounded-none bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
                        {m.tierName} ({m.inc1Percent}%)
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      <div>{formatRupiah(m.totalKomisi)}</div>
                      {m.totalKomisiTahunan > 0 && (
                        <div className="text-[9px] text-amber-600 dark:text-amber-400 font-extrabold whitespace-nowrap truncate">
                          +{formatRupiah(m.totalKomisiTahunan)} (Komisi Tahunan)
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => {
                          setSelectedDetail(m);
                          setModalSearchQuery('');
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] transition-all cursor-pointer uppercase shadow-xs"
                        title="Buka detail transaksi bulan ini"
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
                    <div>{formatRupiah(grandTotals.totalKomisi)}</div>
                    {grandTotals.totalKomisiTahunan > 0 && (
                      <div className="text-[9px] text-amber-600 dark:text-amber-400 font-extrabold whitespace-nowrap truncate">
                        +{formatRupiah(grandTotals.totalKomisiTahunan)} (Komisi Tahunan)
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* MONTH DETAIL MODAL */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl rounded-none animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 text-white rounded-none border border-blue-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
                      Detail Laporan - {selectedDetail.monthName} {selectedDetail.year}
                    </h3>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-black text-[10px] border border-blue-300 dark:border-blue-800 uppercase">
                      {selectedDetail.totalSAActive} SA Aktif
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Rincian daftar transaksi pelanggan, total SA, revenue bersih, dan komisi bulan ini.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {/* Top 4 Summary Cards inside Modal */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Card 1: Total SA */}
                <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-900 flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    Total SA (Sales Active)
                  </span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedDetail.totalSAActive} <span className="text-xs font-bold text-slate-500">SA Aktif</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-bold">
                    Dari total {selectedDetail.totalSAAll} transaksi pasang
                  </p>
                </div>

                {/* Card 2: Revenue Bersih (Net Revenue) */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Revenue Bersih (Net Rev)
                  </span>
                  <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">
                    {formatRupiah(selectedDetail.totalNetRevenue)}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold">
                    Excl. PPN ({formatRupiah(selectedDetail.totalGrossRevenue)} Gross)
                  </p>
                </div>

                {/* Card 3: Tier Sales */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Tier Sales
                  </span>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1 uppercase">
                    {selectedDetail.tierName} ({selectedDetail.inc1Percent}%)
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold">
                    Berdasarkan {selectedDetail.totalSAActive} SA & Net Revenue
                  </p>
                </div>

                {/* Card 4: Total Estimasi Komisi */}
                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-900 flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                    Total Komisi Sales
                  </span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                    {formatRupiah(selectedDetail.totalKomisi)}
                  </div>
                  <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-bold whitespace-nowrap truncate">
                    {selectedDetail.inc1Percent}% Net Rev
                    {selectedDetail.totalKomisiTahunan > 0
                      ? ` +${formatRupiah(selectedDetail.totalKomisiTahunan)} (Komisi Tahunan)`
                      : ''}
                  </p>
                </div>
              </div>

              {/* Action Toolbar inside Modal */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 border-2 border-slate-200 dark:border-slate-800">
                {/* Search Box */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama, ID, paket..."
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                {/* Buttons: Download CSV & Buka di Tabel Main */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        setGuestLockFeature(`Download Data List (${selectedDetail.monthName})`);
                        return;
                      }
                      handleExportMonthCSV(selectedDetail);
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-none border-2 border-emerald-700 transition-colors cursor-pointer uppercase shadow-xs"
                    title={isLoggedIn ? "Download CSV Bulan Ini" : "Fitur Terkunci (Khusus Akun Login)"}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Data List ({selectedDetail.monthName})</span>
                    {!isLoggedIn && <Lock className="w-3.5 h-3.5 text-amber-300 ml-0.5 shrink-0" />}
                  </button>

                  {onSelectMonthYear && (
                    <button
                      onClick={() => {
                        onSelectMonthYear(selectedDetail.monthIndex.toString(), selectedDetail.year.toString());
                        setSelectedDetail(null);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold text-xs rounded-none border-2 border-slate-700 transition-colors cursor-pointer uppercase"
                      title="Buka di tabel revenue utama"
                    >
                      <span>Buka Tabel Main</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Transactions Table */}
              <div className="border-2 border-slate-200 dark:border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-black uppercase text-[11px]">
                      <th className="p-2.5 text-center">No</th>
                      <th className="p-2.5">Tgl Pasang</th>
                      <th className="p-2.5">Pelanggan</th>
                      <th className="p-2.5">Paket & Periode</th>
                      <th className="p-2.5 text-center">Status</th>
                      <th className="p-2.5 text-right">Gross Rev</th>
                      <th className="p-2.5 text-right">Net Revenue</th>
                      <th className="p-2.5 text-right">Komisi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                    {modalFilteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                          Tidak ada data pelanggan yang cocok dengan pencarian
                        </td>
                      </tr>
                    ) : (
                      modalFilteredItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-2.5 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-2.5 font-mono text-[11px] whitespace-nowrap">{item.tanggalPasang}</td>
                          <td className="p-2.5">
                            <div className="font-extrabold text-slate-900 dark:text-white">{item.namaPelanggan}</div>
                            <div className="font-mono text-[10px] text-blue-600 dark:text-blue-400">{item.nomorInternet}</div>
                          </td>
                          <td className="p-2.5">
                            <div className="font-extrabold">{item.packageName}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{item.periode}</div>
                          </td>
                          <td className="p-2.5 text-center">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="p-2.5 text-right font-mono text-slate-500">{formatRupiah(item.grossContract)}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-blue-600 dark:text-blue-400">{formatRupiah(item.monthlyNetRevenue)}</td>
                          <td className="p-2.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                            <div>{formatRupiah(item.estimasiKomisi)}</div>
                            {item.status === 'Aktif' && item.periode === 'Tahunan' && (
                              <div className="text-[9px] text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">
                                +200.000 (Komisi Tahunan)
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {/* Modal Footer Totals */}
                  <tfoot>
                    <tr className="bg-slate-100 dark:bg-slate-900 font-black text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
                      <td colSpan={5} className="p-3 text-right uppercase">Total Filtered ({modalFilteredItems.length}):</td>
                      <td className="p-3 text-right font-mono">
                        {formatRupiah(modalFilteredItems.reduce((sum, i) => sum + i.grossContract, 0))}
                      </td>
                      <td className="p-3 text-right font-mono text-blue-600 dark:text-blue-400">
                        {formatRupiah(modalFilteredItems.filter(i => i.status === 'Aktif').reduce((sum, i) => sum + i.monthlyNetRevenue, 0))}
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(modalFilteredItems.reduce((sum, i) => sum + i.estimasiKomisi, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-900 shrink-0">
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-none border-2 border-slate-700 cursor-pointer uppercase"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Lock Feature Notice Modal */}
      {guestLockFeature && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-[#0F172A] border-4 border-amber-500 rounded-none max-w-md w-full shadow-2xl p-5 space-y-4 text-xs font-sans">
            <div className="flex items-start justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500 text-slate-950 font-black border-2 border-amber-600">
                  <Lock className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">
                    Fitur Terkunci (Mode Tamu)
                  </h3>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 font-extrabold uppercase border border-amber-300 dark:border-amber-800 inline-block mt-0.5">
                    Khusus Akun Terdaftar
                  </span>
                </div>
              </div>
              <button
                onClick={() => setGuestLockFeature(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer border border-slate-300 dark:border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-slate-700 dark:text-slate-200 font-bold leading-relaxed text-xs">
                Fitur <strong className="text-blue-600 dark:text-blue-400 underline">{guestLockFeature}</strong> saat ini dikunci untuk pengguna Mode Tamu (Guest).
              </p>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                <strong>Mengapa Perlu Login / Buat Akun?</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                  <li>Akses fitur lengkap (Buat bulan terlewat, Quick Add, Export CSV).</li>
                  <li>Data otomatis tersimpan aman & ter-sinkronisasi di Cloud.</li>
                  <li>Akses dari HP atau laptop mana saja tanpa risau data terhapus.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t-2 border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setGuestLockFeature(null)}
                className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-xs border-2 border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setGuestLockFeature(null);
                  if (onOpenAuth) onOpenAuth();
                }}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs border-2 border-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>Login / Daftar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

