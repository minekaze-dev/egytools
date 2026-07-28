import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Customer, BillingPeriod, CustomerStatus } from '../types/customer';
import { MASTER_PACKAGES, getPackageById } from '../data/packages';
import { calculateRevenue } from '../helpers/revenueCalculator';
import { formatRupiah } from '../helpers/currency';
import { X, Zap, Layers, Calculator, Info } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBatch: (
    batch: Omit<Customer, 'id' | 'createdAt' | 'packageName' | 'packagePrice'>[]
  ) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onSubmitBatch,
}) => {
  const [packageId, setPackageId] = useState<string>(MASTER_PACKAGES[0]?.id || '');
  const [qty, setQty] = useState<number>(1);
  const [periode, setPeriode] = useState<BillingPeriod>('3 Bulan');
  const [status, setStatus] = useState<CustomerStatus>('Aktif');

  const selectedPackage = useMemo(
    () => getPackageById(packageId) || MASTER_PACKAGES[0],
    [packageId]
  );

  const revenuePreview = useMemo(() => {
    if (!selectedPackage) return { grossContract: 0, ppn: 0, netContract: 0, monthlyNetRevenue: 0 };
    return calculateRevenue(selectedPackage.price, periode);
  }, [selectedPackage, periode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qty < 1) return;

    const batch: Omit<Customer, 'id' | 'createdAt' | 'packageName' | 'packagePrice'>[] = [];
    const timestamp = Date.now().toString().slice(-4);

    for (let i = 0; i < qty; i++) {
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      batch.push({
        namaPelanggan: '-',
        nomorInternet: `100${randomSuffix}`,
        nomorHP: '-',
        area: 'General',
        sales: 'Sales',
        packageId: selectedPackage.id,
        periode,
        tanggalPasang: '-',
        status,
        catatan: `Quick Add Batch #${timestamp}`,
      });
    }

    onSubmitBatch(batch);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-md bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-none shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-50/80 dark:bg-slate-900/80 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-none bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-[15px] text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Pembuatan Cepat (Quick Add)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tambah multiple record revenue secara instan
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-none border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-[12px]">
            {/* 1. Pilih Paket */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                Pilih Paket ISP <span className="text-rose-500">*</span>
              </label>
              <select
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-none font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-amber-500 uppercase"
              >
                {MASTER_PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} — {formatRupiah(pkg.price)} /bln ({pkg.speed})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Jumlah / Qty & Periode */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                  Jumlah (Qty) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-none font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-amber-500"
                    placeholder="1"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-bold uppercase pointer-events-none">
                    Data
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                  Periode Langganan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value as BillingPeriod)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-none font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-amber-500 uppercase"
                >
                  <option value="Bulanan">Bulanan</option>
                  <option value="3 Bulan">3 Bulan (PPN 10%)</option>
                  <option value="6 Bulan">6 Bulan (PPN 15%)</option>
                  <option value="Tahunan">Tahunan (PPN 20%)</option>
                </select>
              </div>
            </div>

            {/* 3. Status */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                Status Data <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-none font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-amber-500 uppercase"
              >
                <option value="Aktif">Aktif (Masuk Revenue & Komisi)</option>
                <option value="Refund">Refund (Pengurangan Revenue)</option>
                <option value="Dismantle">Dismantle (Pengurangan Revenue)</option>
              </select>
            </div>

            {/* Live Calculation Preview Card */}
            <div className="p-3.5 rounded-none bg-slate-50 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5 uppercase">
                <span className="flex items-center gap-1">
                  <Calculator className="w-3.5 h-3.5 text-amber-500" /> Estimasi Per
                  Record:
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                  Net Rev: {formatRupiah(revenuePreview.monthlyNetRevenue)}/bln
                </span>
              </div>

              <div className="flex justify-between items-center text-[12px] pt-0.5">
                <span className="text-slate-600 dark:text-slate-400 font-bold uppercase">
                  Total {qty} Record Net Revenue:
                </span>
                <span className="text-[14px] font-black text-amber-600 dark:text-amber-400">
                  {formatRupiah(revenuePreview.monthlyNetRevenue * qty)}/bln
                </span>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-2 p-2.5 rounded-none bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>
                Nama Pelanggan, Nomor HP, dan Tanggal Aktif akan diset sebagai{' '}
                <strong>&quot;-&quot;</strong>. Anda dapat mengedit detailnya sewaktu-waktu di tabel.
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t-2 border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-none border-2 border-slate-300 dark:border-slate-700 transition-colors uppercase cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 font-extrabold bg-amber-500 hover:bg-amber-600 text-white rounded-none border-2 border-amber-600 transition-colors uppercase cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                Simpan {qty} Data
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
