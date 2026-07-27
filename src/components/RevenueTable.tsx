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
} from 'lucide-react';

interface RevenueTableProps {
  data: CustomerWithCalculations[];
  onView: (customer: CustomerWithCalculations) => void;
  onEdit: (customer: CustomerWithCalculations) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
  onQuickAddClick: () => void;
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
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [monthFilter, setMonthFilter] = useState<string>('ALL');
  const [sorting, setSorting] = useState<SortingState>([]);

  // Filtered data by status & month if active
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
          const itemMonth = new Date(item.tanggalPasang).getMonth();
          if (itemMonth !== targetMonth) return false;
        }
      }

      return true;
    });
  }, [data, statusFilter, monthFilter]);

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
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
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
      {/* Estimasi Komisi Card Above Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm border border-emerald-500/30">
          <div className="text-[10px] font-medium text-emerald-100 flex items-center justify-between">
            <span>Estimasi Komisi Sales</span>
            <span className="px-1 py-0.5 rounded text-[9px] bg-white/20 font-semibold uppercase">Aktif</span>
          </div>
          <div className="text-[16px] font-extrabold mt-1 tracking-tight">
            {formatRupiah(totals.komisi)}
          </div>
          <div className="text-[9px] text-emerald-100/90 mt-0.5 truncate">
            Berdasarkan Tier & Closing Aktif
          </div>
        </div>

        <div className="p-3 rounded-xl bg-blue-600 text-white shadow-sm border border-blue-500/30">
          <div className="text-[10px] font-medium text-blue-100 flex items-center justify-between">
            <span>Est. Revenue</span>
            <span className="px-1 py-0.5 rounded text-[9px] bg-white/20 font-semibold uppercase">Aktif</span>
          </div>
          <div className="text-[16px] font-extrabold mt-1 tracking-tight">
            {formatRupiah(totals.monthlyNetRevenue)}
          </div>
          <div className="text-[9px] text-blue-100/90 mt-0.5 truncate">
            Total Net Revenue Terhitung
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <div className="text-[10px] font-semibold text-amber-800 dark:text-amber-300">
            Total Insentif 25%
          </div>
          <div className="text-[15px] font-bold text-amber-900 dark:text-amber-200 mt-0.5">
            {formatRupiah(totals.insentif25)}
          </div>
          <div className="text-[9px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
            25% x Total Net Revenue
          </div>
        </div>

        <div className="p-3 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50">
          <div className="text-[10px] font-semibold text-indigo-800 dark:text-indigo-300">
            Total Insentif 30%
          </div>
          <div className="text-[15px] font-bold text-indigo-900 dark:text-indigo-200 mt-0.5">
            {formatRupiah(totals.insentif30)}
          </div>
          <div className="text-[9px] text-indigo-700/80 dark:text-indigo-400/80 mt-0.5">
            30% x Total Net Revenue
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
          <div className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
            Total Insentif 35%
          </div>
          <div className="text-[15px] font-bold text-emerald-900 dark:text-emerald-200 mt-0.5">
            {formatRupiah(totals.insentif35)}
          </div>
          <div className="text-[9px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
            35% x Total Net Revenue
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 rounded-[12px] shadow-xs overflow-hidden p-4 space-y-3">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]">
          {/* Left: Total records badge */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
              {filteredData.length} Data Revenue
            </span>
          </div>

          {/* Right: Search, Month Filter, Status Filter, Export, Quick Add & Add Button */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* Search Box */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari pelanggan / ID..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full sm:w-44 pl-8 pr-3 py-1.5 text-[12px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:text-slate-200"
              />
            </div>

            {/* Filter Month Dropdown */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="bg-transparent text-[12px] text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer font-medium"
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
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-[12px] text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer font-medium"
              >
                <option value="ALL">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Refund">Refund</option>
                <option value="Dismantle">Dismantle</option>
              </select>
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>

            {/* Quick Add Button */}
            <button
              onClick={onQuickAddClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-xs transition-colors shrink-0"
              title="Pembuatan cepat multiple data"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Quick Add
            </button>

            {/* Add Customer Button */}
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Data
            </button>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#0F172A]">
          <table className="w-full text-left text-[11px] border-collapse">
            {/* Sticky Header */}
            <thead className="bg-slate-100/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="h-[36px]">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-1.5 py-1 whitespace-nowrap text-[11px] font-semibold border-r border-slate-200/60 dark:border-slate-800/60 last:border-r-0"
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

            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="h-[36px] hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-1.5 py-1 whitespace-nowrap border-r border-slate-200/50 dark:border-slate-800/40 last:border-r-0"
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
                    className="text-center py-8 text-slate-400 dark:text-slate-500 text-[11px]"
                  >
                    Tidak ada data pelanggan yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>

            {/* MANDATORY TOTAL ROW AT BOTTOM */}
            <tfoot className="bg-slate-200/70 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-[11px]">
              <tr className="h-[36px]">
                <td colSpan={7} className="px-1.5 py-1 text-right font-extrabold uppercase tracking-wide text-slate-900 dark:text-slate-100">
                  TOTAL KESELURUHAN:
                </td>
                <td className="px-1.5 py-1 text-right text-slate-900 dark:text-slate-100">
                  {formatRupiah(totals.gross)}
                </td>
                <td className="px-1.5 py-1 text-right text-slate-600 dark:text-slate-400">
                  {formatRupiah(totals.ppn)}
                </td>
                <td className="px-1.5 py-1 text-right text-blue-800 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-950/80 font-extrabold">
                  {formatRupiah(totals.monthlyNetRevenue)}
                </td>
                <td className="px-1.5 py-1 text-right text-amber-800 dark:text-amber-300 font-extrabold">
                  {formatRupiah(totals.insentif25)}
                </td>
                <td className="px-1.5 py-1 text-right text-indigo-800 dark:text-indigo-300 font-extrabold">
                  {formatRupiah(totals.insentif30)}
                </td>
                <td className="px-1.5 py-1 text-right text-emerald-800 dark:text-emerald-300 font-extrabold">
                  {formatRupiah(totals.insentif35)}
                </td>
                <td className="px-1.5 py-1"></td>
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
