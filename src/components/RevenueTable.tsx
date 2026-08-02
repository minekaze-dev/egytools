import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { motion } from 'motion/react';
import { CustomerWithCalculations, CustomerStatus } from '../types/customer';
import { StatusBadge } from './StatusBadge';
import { formatRupiah, formatPercent } from '../helpers/currency';
import { getTierProgress } from '../helpers/tierCalculator';
import { parseTanggalPasang } from '../helpers/dateFormatter';
import {
  Search,
  ArrowUpDown,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Plus,
  Calendar,
  Zap,
  PlusCircle,
  X,
  CalendarDays,
  Sparkles,
  Trophy,
  Coins,
  UserCheck,
  DollarSign,
  Lock,
  UserPlus,
} from 'lucide-react';

interface RevenueTableProps {
  data: CustomerWithCalculations[];
  onView: (customer: CustomerWithCalculations) => void;
  onEdit: (customer: CustomerWithCalculations) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
  onQuickAddClick: () => void;
  onAddClickWithDate?: (dateIso: string) => void;
  selectedMonthExternal?: string;
  selectedYearExternal?: string;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
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

export const RevenueTable: React.FC<RevenueTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
  onAddClick,
  onQuickAddClick,
  onAddClickWithDate,
  selectedMonthExternal,
  selectedYearExternal,
  isLoggedIn = false,
  onOpenAuth,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [monthFilter, setMonthFilter] = useState<string>('ALL');
  const [yearFilter, setYearFilter] = useState<string>('ALL');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [guestLockFeature, setGuestLockFeature] = useState<string | null>(null);

  // Persistent pagination state
  const [pagination, setPagination] = useState(() => {
    let initialPageSize = 10;
    try {
      const saved = localStorage.getItem('revenue_table_page_size');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if ([10, 50, 100].includes(parsed)) {
          initialPageSize = parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return {
      pageIndex: 0,
      pageSize: initialPageSize,
    };
  });

  // Modal for creating/selecting a skipped month
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [modalSelectedMonth, setModalSelectedMonth] = useState<string>(new Date().getMonth().toString());
  const [modalSelectedYear, setModalSelectedYear] = useState<string>(new Date().getFullYear().toString());

  // React to external month/year selection if passed from parent
  React.useEffect(() => {
    if (selectedMonthExternal !== undefined) {
      setMonthFilter(selectedMonthExternal);
    }
    if (selectedYearExternal !== undefined) {
      setYearFilter(selectedYearExternal);
    }
  }, [selectedMonthExternal, selectedYearExternal]);

  // Filtered data by status, month, year
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Status Filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      // 2. Month Filter
      if (monthFilter !== 'ALL') {
        const targetMonth =
          monthFilter === 'CURRENT'
            ? new Date().getMonth()
            : parseInt(monthFilter, 10);

        if (item.tanggalPasang && item.tanggalPasang !== '-') {
          const parsed = parseTanggalPasang(item.tanggalPasang);
          if (!parsed || parsed.monthIndex !== targetMonth) return false;
        } else {
          return false;
        }
      }

      // 3. Year Filter
      if (yearFilter !== 'ALL') {
        if (item.tanggalPasang && item.tanggalPasang !== '-') {
          const parsed = parseTanggalPasang(item.tanggalPasang);
          if (!parsed || parsed.year.toString() !== yearFilter) return false;
        } else {
          return false;
        }
      }

      return true;
    });
  }, [data, statusFilter, monthFilter, yearFilter]);

  // Dynamic Tier & Commission Calculations for Filtered Data
  const activeClosingCount = useMemo(() => {
    return filteredData.filter((item) => item.status === 'Aktif').length;
  }, [filteredData]);

  const activeNetRevenue = useMemo(() => {
    return filteredData
      .filter((item) => item.status === 'Aktif')
      .reduce((sum, item) => sum + item.monthlyNetRevenue, 0);
  }, [filteredData]);

  const tierProgress = useMemo(() => {
    return getTierProgress(activeClosingCount, activeNetRevenue);
  }, [activeClosingCount, activeNetRevenue]);

  const { currentTier, nextTier, closingNeeded, revenueNeeded, isMaxTier } = tierProgress;

  const totalKomisiEstimasi = useMemo(() => {
    return filteredData
      .filter((item) => item.status === 'Aktif')
      .reduce((sum, item) => sum + item.estimasiKomisi, 0);
  }, [filteredData]);

  // Calculate totals for bottom summary row
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc.gross += item.grossContract;
        acc.ppn += item.ppn;
        acc.netContract += item.netContract;
        acc.monthlyNetRevenue += item.monthlyNetRevenue;
        acc.insentif25 += item.monthlyNetRevenue * 0.25;
        acc.insentif30 += item.monthlyNetRevenue * 0.30;
        acc.insentif35 += item.monthlyNetRevenue * 0.35;
        acc.komisi += item.estimasiKomisi;
        return acc;
      },
      {
        gross: 0,
        ppn: 0,
        netContract: 0,
        monthlyNetRevenue: 0,
        insentif25: 0,
        insentif30: 0,
        insentif35: 0,
        komisi: 0,
      }
    );
  }, [filteredData]);

  // Define TanStack Table columns
  const columns = useMemo<ColumnDef<CustomerWithCalculations>[]>(
    () => [
      {
        id: 'no',
        header: 'No',
        cell: (info) => (
          <span className="text-slate-400 font-mono text-[11px]">
            {info.row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: 'namaPelanggan',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold hover:text-blue-600 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Pelanggan & ID
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
          </button>
        ),
        cell: (info) => (
          <div className="leading-tight">
            <div className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[130px]">
              {info.getValue() as string}
            </div>
            <div className="font-mono text-slate-400 text-[10px]">
              {info.row.original.nomorInternet}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'tanggalPasang',
        header: 'Tgl Aktif',
        cell: (info) => (
          <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap text-[11px]">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'packageName',
        header: 'Paket & Speed',
        cell: (info) => (
          <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[130px] block">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'periode',
        header: 'Periode',
        cell: (info) => (
          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium whitespace-nowrap">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue() as CustomerStatus} />,
      },
      {
        accessorKey: 'packagePrice',
        header: 'Perbulan',
        cell: (info) => (
          <div className="text-right font-medium text-slate-600 dark:text-slate-400">
            {formatRupiah(info.getValue() as number)}
          </div>
        ),
      },
      {
        accessorKey: 'grossContract',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold hover:text-blue-600 transition-colors ml-auto"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Harga 
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
          </button>
        ),
        cell: (info) => (
          <div className="text-right font-medium text-slate-700 dark:text-slate-300">
            {formatRupiah(info.getValue() as number)}
          </div>
        ),
      },
      {
        accessorKey: 'ppn',
        header: 'PPN (11%)',
        cell: (info) => (
          <div className="text-right font-medium text-slate-500 dark:text-slate-400">
            {formatRupiah(info.getValue() as number)}
          </div>
        ),
      },
      {
        accessorKey: 'monthlyNetRevenue',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-bold text-blue-700 dark:text-blue-300 hover:underline transition-colors ml-auto"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Net Revenue
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => (
          <div className="text-right font-bold text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200/60 dark:border-blue-900/40">
            {formatRupiah(info.getValue() as number)}
          </div>
        ),
      },
      {
        id: 'insentif25',
        header: () => <span className="uppercase text-amber-700 dark:text-amber-300 font-bold">INSENTIF 25%</span>,
        cell: (info) => (
          <div className="text-right font-medium text-slate-700 dark:text-slate-300">
            {formatRupiah(info.row.original.monthlyNetRevenue * 0.25)}
          </div>
        ),
      },
      {
        id: 'insentif30',
        header: () => <span className="uppercase text-indigo-700 dark:text-indigo-300 font-bold">INSENTIF 30%</span>,
        cell: (info) => (
          <div className="text-right font-medium text-slate-700 dark:text-slate-300">
            {formatRupiah(info.row.original.monthlyNetRevenue * 0.30)}
          </div>
        ),
      },
      {
        id: 'insentif35',
        header: () => <span className="uppercase text-emerald-700 dark:text-emerald-300 font-bold">INSENTIF 35%</span>,
        cell: (info) => (
          <div className="text-right font-semibold text-emerald-700 dark:text-emerald-400">
            {formatRupiah(info.row.original.monthlyNetRevenue * 0.35)}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Aksi',
        cell: (info) => (
          <div className="flex items-center gap-0.5 justify-end">
            <button
              onClick={() => onView(info.row.original)}
              title="Lihat Detail"
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEdit(info.row.original)}
              title="Edit Data"
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(info.row.original.id)}
              title="Hapus"
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      setPagination((old) => {
        const next = typeof updater === 'function' ? updater(old) : updater;
        if (next.pageSize !== old.pageSize) {
          try {
            localStorage.setItem('revenue_table_page_size', next.pageSize.toString());
          } catch (e) {
            // ignore
          }
        }
        return next;
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Export CSV helper
  const handleExportCSV = () => {
    const headers = [
      'No',
      'Nama Pelanggan',
      'No Internet',
      'Tanggal Aktif',
      'Paket',
      'Periode',
      'Status',
      'Harga Bulanan',
      'Gross Contract',
      'PPN',
      'Net Revenue',
      'Insentif 25%',
      'Insentif 30%',
      'Insentif 35%',
    ];

    const csvRows = filteredData.map((c, idx) => [
      idx + 1,
      `"${c.namaPelanggan.replace(/"/g, '""')}"`,
      c.nomorInternet,
      c.tanggalPasang,
      `"${c.packageName}"`,
      c.periode,
      c.status,
      c.packagePrice,
      c.grossContract,
      c.ppn,
      c.monthlyNetRevenue,
      c.monthlyNetRevenue * 0.25,
      c.monthlyNetRevenue * 0.30,
      c.monthlyNetRevenue * 0.35,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_ledger_revenue_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Cards Summary Above Table: Total SA & Tier + Total Estimasi Komisi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Total SA & Tier (Otomatis Berubah) */}
        <div className="p-4 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-none shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-none">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
                  Total SA & Sales Tier
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
                    {activeClosingCount} <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">SA Aktif</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Auto-updating Tier Badge */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase mb-0.5">
                TIER OTOMATIS
              </span>
              <span className="px-2.5 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs font-black rounded-none border-2 border-blue-700 dark:border-blue-400 uppercase flex items-center gap-1.5 shadow-xs">
                <Trophy className="w-3.5 h-3.5 fill-current text-amber-300" />
                {currentTier.name} ({currentTier.inc1Percent}%)
              </span>
            </div>
          </div>

          <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-1">
            <span>
              Net Rev: <strong className="text-slate-900 dark:text-slate-100">{formatRupiah(activeNetRevenue)}</strong>
            </span>
            {isMaxTier ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">
                ★ Tier Maksimal (Tier 3)
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-extrabold uppercase">
                {closingNeeded > 0 ? `Butuh +${closingNeeded} SA` : ''} {revenueNeeded > 0 ? `& +${formatRupiah(revenueNeeded)}` : ''} ke {nextTier?.name}
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Total Estimasi Komisi */}
        <div className="p-4 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-none shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-none">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
                  Total Estimasi Komisi
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                    {formatRupiah(totalKomisiEstimasi)}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-2.5 py-1 bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 text-[11px] font-extrabold uppercase">
              {currentTier.inc1Percent}% dari Net Revenue
            </div>
          </div>

          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Kalkulasi Komisi Sales berdasarkan Tier {currentTier.name} ({currentTier.inc1Percent}%)</span>
            <span className="text-slate-700 dark:text-slate-300 font-extrabold uppercase">
              {filteredData.length} Total Data
            </span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-none shadow-xs p-5 space-y-4">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Left: Total records badge & Rows per page selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-none border-2 border-slate-300 dark:border-slate-700 uppercase tracking-wide">
              {filteredData.length} Data Revenue
            </span>

            {/* Page size dropdown (10, 50, 100) */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-none px-2.5 py-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase hidden sm:inline">Baris:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="bg-transparent text-xs sm:text-sm text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer font-bold uppercase"
              >
                <option value={10}>10 Data</option>
                <option value={50}>50 Data</option>
                <option value={100}>100 Data (Maks)</option>
              </select>
            </div>
          </div>

          {/* Right: Search, Month Filter, Status Filter, Export, Quick Add & Add Button */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Search Box */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari pelanggan / ID..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full sm:w-52 pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-none focus:outline-hidden focus:border-blue-600 dark:text-slate-200 font-medium"
              />
            </div>

            {/* Filter Month Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-none px-3 py-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer font-bold uppercase"
              >
                <option value="ALL">Semua Bulan</option>
                <option value="CURRENT">
                  Bulan Ini ({MONTH_NAMES[new Date().getMonth()]})
                </option>
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx} value={idx.toString()}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-none px-3 py-1.5">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer font-bold uppercase"
              >
                <option value="ALL">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Refund">Refund</option>
                <option value="Dismantle">Dismantle</option>
              </select>
            </div>

            {/* Button: Buat Bulan Terlewat */}
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setGuestLockFeature('Buat / Pilih Bulan Terlewat');
                  return;
                }
                setIsMonthModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-300 border-2 border-indigo-300 dark:border-indigo-800 rounded-none transition-all cursor-pointer shrink-0 uppercase"
              title={isLoggedIn ? "Buat atau pilih tabel untuk bulan yang terlewat" : "Fitur Terkunci (Khusus Akun Login)"}
            >
              <PlusCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>+ Buat / Pilih Bulan Terlewat</span>
              {!isLoggedIn && <Lock className="w-3.5 h-3.5 text-amber-500 ml-0.5 shrink-0" />}
            </button>

            {/* Export CSV */}
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setGuestLockFeature('Export Data CSV');
                  return;
                }
                handleExportCSV();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-none border-2 border-slate-300 dark:border-slate-700 transition-colors cursor-pointer uppercase"
              title={isLoggedIn ? "Export data ke CSV" : "Fitur Terkunci (Khusus Akun Login)"}
            >
              <Download className="w-4 h-4" />
              Export
              {!isLoggedIn && <Lock className="w-3.5 h-3.5 text-amber-500 ml-0.5 shrink-0" />}
            </button>

            {/* Quick Add Button */}
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setGuestLockFeature('Tambah Data Cepat (Quick Add)');
                  return;
                }
                onQuickAddClick();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold bg-amber-500 hover:bg-amber-600 text-white rounded-none border-2 border-amber-600 transition-colors shrink-0 cursor-pointer uppercase"
              title={isLoggedIn ? "Pembuatan cepat multiple data" : "Fitur Terkunci (Khusus Akun Login)"}
            >
              <Zap className="w-4 h-4 fill-current" />
              Quick Add
              {!isLoggedIn && <Lock className="w-3.5 h-3.5 text-amber-200 ml-0.5 shrink-0" />}
            </button>

            {/* Add Customer Button */}
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-none border-2 border-blue-700 transition-colors shrink-0 cursor-pointer uppercase"
            >
              <Plus className="w-4 h-4" />
              Tambah Data
            </button>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto border-2 border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-[#0F172A]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            {/* Sticky Header */}
            <thead className="bg-slate-100/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="h-[40px]">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-2.5 py-2 whitespace-nowrap text-xs sm:text-sm font-bold border-r border-slate-200/60 dark:border-slate-800/60 last:border-r-0"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200 font-medium">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="h-[40px] hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-2.5 py-2 whitespace-nowrap border-r border-slate-200/50 dark:border-slate-800/40 last:border-r-0"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-12 px-4 text-slate-400 dark:text-slate-500 text-xs sm:text-sm"
                  >
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-none bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border-2 border-indigo-500/20">
                        <CalendarDays className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base uppercase">
                          Tabel Revenue {monthFilter !== 'ALL' ? MONTH_NAMES[parseInt(monthFilter, 10)] || '' : ''} {yearFilter !== 'ALL' ? yearFilter : ''} Masih Kosong
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Belum ada entri pelanggan untuk periode ini. Anda dapat mulai menambahkan transaksi baru.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            const mStr = monthFilter !== 'ALL' ? String(Number(monthFilter) + 1).padStart(2, '0') : '01';
                            const yStr = yearFilter !== 'ALL' ? yearFilter : new Date().getFullYear().toString();
                            const dateIso = `${yStr}-${mStr}-01`;
                            if (onAddClickWithDate) {
                              onAddClickWithDate(dateIso);
                            } else {
                              onAddClick();
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-none border-2 border-blue-700 transition-all flex items-center gap-1.5 cursor-pointer uppercase"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tambah Data di Bulan Ini</span>
                        </button>
                        <button
                          onClick={() => {
                            setMonthFilter('ALL');
                            setYearFilter('ALL');
                          }}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-extrabold text-xs sm:text-sm rounded-none border-2 border-slate-300 dark:border-slate-700 transition-all cursor-pointer uppercase"
                        >
                          Tampilkan Semua Bulan
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

            {/* MANDATORY TOTAL ROW AT BOTTOM */}
            <tfoot className="bg-slate-200/80 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-xs sm:text-sm">
              <tr className="h-[40px]">
                <td colSpan={7} className="px-2.5 py-2 text-right font-extrabold uppercase tracking-wide text-slate-900 dark:text-slate-100">
                  TOTAL KESELURUHAN:
                </td>
                <td className="px-2.5 py-2 text-right text-slate-900 dark:text-slate-100 font-bold">
                  {formatRupiah(totals.gross)}
                </td>
                <td className="px-2.5 py-2 text-right text-slate-600 dark:text-slate-400">
                  {formatRupiah(totals.ppn)}
                </td>
                <td className="px-2.5 py-2 text-right text-blue-800 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-950/80 font-extrabold">
                  {formatRupiah(totals.monthlyNetRevenue)}
                </td>
                <td className="px-2.5 py-2 text-right text-amber-800 dark:text-amber-300 font-extrabold">
                  {formatRupiah(totals.insentif25)}
                </td>
                <td className="px-2.5 py-2 text-right text-indigo-800 dark:text-indigo-300 font-extrabold">
                  {formatRupiah(totals.insentif30)}
                </td>
                <td className="px-2.5 py-2 text-right text-emerald-800 dark:text-emerald-300 font-extrabold">
                  {formatRupiah(totals.insentif35)}
                </td>
                <td className="px-2.5 py-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div>
          Menampilkan{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
          </span>{' '}
          sampai{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              filteredData.length
            )}
          </span>{' '}
          dari{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {filteredData.length}
          </span>{' '}
          entri
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Rows per page selector */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Tampilkan:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold focus:outline-hidden cursor-pointer uppercase text-[11px]"
            >
              <option value={10}>10 Data</option>
              <option value={50}>50 Data</option>
              <option value={100}>100 Data (Maks)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-none border-2 border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-medium">
              Halaman {table.getState().pagination.pageIndex + 1} dari{' '}
              {table.getPageCount() || 1}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-none border-2 border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Buat / Pilih Bulan Terlewat */}
      {isMonthModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-none max-w-md w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-none bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm uppercase">
                    Buat / Pilih Bulan Terlewat
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pilih periode bulan dan tahun untuk membuka atau mengisi tabel revenue.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMonthModalOpen(false)}
                className="p-1.5 rounded-none text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer border border-slate-200 dark:border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase">
                  Pilih Bulan Terlewat:
                </label>
                <select
                  value={modalSelectedMonth}
                  onChange={(e) => setModalSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 rounded-none border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:border-blue-600 uppercase"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={idx} value={idx.toString()}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block uppercase">
                  Pilih Tahun:
                </label>
                <select
                  value={modalSelectedYear}
                  onChange={(e) => setModalSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-none border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:border-blue-600 uppercase"
                >
                  {['2024', '2025', '2026', '2027', '2028'].map((y) => (
                    <option key={y} value={y}>
                      Tahun {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-none bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-[11px] leading-relaxed">
                Akan menampilkan tabel revenue khusus bulan <strong>{MONTH_NAMES[parseInt(modalSelectedMonth, 10)]} {modalSelectedYear}</strong>. Jika belum ada transaksi di bulan tersebut, Anda dapat langsung menambahkannya.
              </div>
            </div>

            <div className="px-5 py-3 border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsMonthModalOpen(false)}
                className="px-3.5 py-2 text-[12px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-none border border-slate-300 dark:border-slate-700 cursor-pointer uppercase"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setMonthFilter(modalSelectedMonth);
                  setYearFilter(modalSelectedYear);
                  setIsMonthModalOpen(false);
                }}
                className="px-4 py-2 text-[12px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-none border-2 border-blue-700 transition-all cursor-pointer uppercase"
              >
                Buka / Buat Tabel Bulan Ini
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
