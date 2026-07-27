import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomerWithCalculations } from '../types/customer';
import { StatusBadge } from './StatusBadge';
import { formatRupiah } from '../helpers/currency';
import { X, FileText, Calendar, MapPin, User, ShieldCheck, Phone, Tag } from 'lucide-react';

interface CustomerDetailModalProps {
  customer: CustomerWithCalculations | null;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
}) => {
  if (!customer) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[12px] max-w-lg w-full shadow-2xl overflow-hidden space-y-4 p-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 dark:text-slate-100">
                  Rincian Detail Pelanggan
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  ID: {customer.nomorInternet}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Customer Overview Card */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px] text-slate-900 dark:text-slate-100">
                {customer.namaPelanggan}
              </span>
              <StatusBadge status={customer.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{customer.nomorHP}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{customer.area}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Sales: {customer.sales}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Pasang: {customer.tanggalPasang}</span>
              </div>
            </div>
          </div>

          {/* Subscription & Calculations breakdown */}
          <div className="space-y-2">
            <h4 className="text-[12px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-500" />
              Rincian Paket & Perhitungan Financial Revenue
            </h4>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 text-[12px]">
              <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Paket ISP:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {customer.packageName} ({formatRupiah(customer.packagePrice)}/bln)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Periode Kontrak:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {customer.periode}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Gross Contract:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {formatRupiah(customer.grossContract)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">PPN (11%):</span>
                <span className="font-medium text-rose-600 dark:text-rose-400">
                  - {formatRupiah(customer.ppn)}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 font-bold text-blue-700 dark:text-blue-300">
                <span>Net Revenue:</span>
                <span className="text-[13px]">{formatRupiah(customer.monthlyNetRevenue)}</span>
              </div>
            </div>
          </div>

          {/* Tier & Commission Status */}
          <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 text-[12px] flex justify-between items-center">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                Tier & Persentase INC1
              </span>
              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                {customer.tierName === 'Tier 0' ? 'Belum Mencapai Tier' : customer.tierName} ({customer.inc1Percent}%)
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                Estimasi Komisi Row Ini
              </span>
              <span className="font-extrabold text-[14px] text-emerald-600 dark:text-emerald-400">
                {formatRupiah(customer.estimasiKomisi)}
              </span>
            </div>
          </div>

          {customer.catatan && (
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-400">
              <strong className="block text-slate-700 dark:text-slate-300 mb-0.5">Catatan:</strong>
              {customer.catatan}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-[12px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
