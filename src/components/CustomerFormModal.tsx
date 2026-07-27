import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { Customer, BillingPeriod, CustomerStatus } from '../types/customer';
import { MASTER_PACKAGES, getPackageById } from '../data/packages';
import { BILLING_PERIODS } from '../constants/period';
import { calculateRevenue } from '../helpers/revenueCalculator';
import { formatRupiah } from '../helpers/currency';
import { X, Calculator, UserPlus, Save, AlertCircle } from 'lucide-react';

const customerSchema = z.object({
  namaPelanggan: z.string().min(1, 'Nama pelanggan wajib diisi'),
  nomorInternet: z.string().optional(),
  nomorHP: z.string().optional(),
  packageId: z.string().min(1, 'Pilih paket internet'),
  periode: z.enum(['Bulanan', '3 Bulan', '6 Bulan', 'Tahunan']),
  tanggalPasang: z.string().min(1, 'Tanggal pasang wajib diisi'),
  status: z.enum(['Aktif', 'Refund', 'Dismantle']),
  catatan: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Customer, 'id' | 'createdAt' | 'packageName' | 'packagePrice'>) => void;
  initialData?: Customer | null;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      namaPelanggan: '',
      nomorInternet: '',
      nomorHP: '',
      packageId: MASTER_PACKAGES[0].id,
      periode: '3 Bulan',
      tanggalPasang: new Date().toISOString().split('T')[0],
      status: 'Aktif',
      catatan: '',
    },
  });

  // Populate initialData when editing
  useEffect(() => {
    if (initialData) {
      reset({
        namaPelanggan: initialData.namaPelanggan === '-' ? '' : initialData.namaPelanggan,
        nomorInternet: initialData.nomorInternet,
        nomorHP: initialData.nomorHP,
        packageId: initialData.packageId,
        periode: initialData.periode as BillingPeriod,
        tanggalPasang: initialData.tanggalPasang,
        status: initialData.status as CustomerStatus,
        catatan: initialData.catatan || '',
      });
    } else {
      reset({
        namaPelanggan: '',
        nomorInternet: '',
        nomorHP: '',
        packageId: MASTER_PACKAGES[0].id,
        periode: '3 Bulan',
        tanggalPasang: new Date().toISOString().split('T')[0],
        status: 'Aktif',
        catatan: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const selectedPackageId = watch('packageId');
  const selectedPeriode = watch('periode');

  const selectedPackage = useMemo(() => getPackageById(selectedPackageId), [selectedPackageId]);
  const isPromo277 = selectedPackage?.id === 'pkg-sports-200' || selectedPackage?.price === 277500;

  // Auto switch to Bulanan when promo 277500 is selected
  useEffect(() => {
    if (isPromo277 && selectedPeriode !== 'Bulanan') {
      setValue('periode', 'Bulanan');
    }
  }, [isPromo277, selectedPeriode, setValue]);

  // Realtime calculated preview for user feedback
  const liveCalculated = useMemo(() => {
    const pkg = getPackageById(selectedPackageId) || MASTER_PACKAGES[0];
    const rev = calculateRevenue(pkg.price, selectedPeriode as BillingPeriod);
    return { pkg, ...rev };
  }, [selectedPackageId, selectedPeriode]);

  const onFormSubmit = (data: CustomerFormValues) => {
    onSubmit({
      namaPelanggan: data.namaPelanggan.trim(),
      nomorInternet: data.nomorInternet || '-',
      nomorHP: data.nomorHP || '-',
      area: initialData?.area || 'General',
      sales: initialData?.sales || 'Sales',
      packageId: data.packageId,
      periode: data.periode as BillingPeriod,
      tanggalPasang: data.tanggalPasang,
      status: data.status as CustomerStatus,
      catatan: data.catatan,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[12px] max-w-2xl w-full shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <UserPlus className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-slate-100">
                {initialData ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[12px]">
              {/* Nama Pelanggan */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nama Pelanggan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PT Solusi Tekno Nusantara"
                  {...register('namaPelanggan')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:text-slate-100"
                />
                {errors.namaPelanggan && (
                  <p className="text-rose-500 text-[11px] mt-0.5">
                    {errors.namaPelanggan.message}
                  </p>
                )}
              </div>

              {/* ID Pelanggan */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ID Pelanggan <span className="text-slate-400 font-normal text-[11px]">(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 1008273641"
                  {...register('nomorInternet')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:text-slate-100"
                />
              </div>

              {/* Nomor HP */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Telepon / HP <span className="text-slate-400 font-normal text-[11px]">(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="081234567890"
                  {...register('nomorHP')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:text-slate-100"
                />
              </div>

              {/* Tanggal Pasang */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Pasang <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('tanggalPasang')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:text-slate-100"
                />
              </div>

              {/* Paket Dropdown */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Paket <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('packageId')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:text-slate-100"
                >
                  {MASTER_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — {formatRupiah(pkg.price)} /bln
                    </option>
                  ))}
                </select>
              </div>

              {/* Periode Dropdown */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Periode Langganan <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('periode')}
                  disabled={isPromo277}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:text-slate-100 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:opacity-80 cursor-pointer disabled:cursor-not-allowed"
                >
                  {BILLING_PERIODS.filter((p) => !isPromo277 || p.value === 'Bulanan').map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {isPromo277 && (
                  <p className="text-amber-600 dark:text-amber-400 text-[10px] mt-1 font-medium">
                    * Paket Promo Rp 277.500 hanya tersedia untuk periode Bulanan.
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:text-slate-100 font-semibold"
                >
                  <option value="Aktif">Aktif (Masuk Revenue & Komisi)</option>
                  <option value="Refund">Refund (Pengurangan Revenue)</option>
                  <option value="Dismantle">Dismantle (Pengurangan Revenue)</option>
                </select>
              </div>

              {/* Catatan */}
              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  placeholder="Catatan pendaftaran / keterangan lokasi..."
                  {...register('catatan')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:text-slate-100"
                />
              </div>
            </div>

            {/* AUTOMATIC CALCULATION LIVE PREVIEW */}
            <div className="p-3.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-[11px] space-y-2">
              <div className="flex items-center justify-between text-blue-900 dark:text-blue-300 font-semibold border-b pb-1.5 border-blue-200/60 dark:border-blue-900/50">
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Kalkulasi Otomatis Sistem
                </span>
                <span className="text-[10px] bg-blue-200/70 dark:bg-blue-800/60 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded font-mono">
                  Dihitung Otomatis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700 dark:text-slate-300">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">
                    Gross Contract
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {formatRupiah(liveCalculated.grossContract)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">
                    PPN (11%)
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {formatRupiah(liveCalculated.ppn)}
                  </span>
                </div>
                <div className="p-1 rounded bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60">
                  <span className="text-emerald-700 dark:text-emerald-400 block text-[10px] font-medium">
                    Net Revenue
                  </span>
                  <span className="font-extrabold text-emerald-800 dark:text-emerald-300 text-[12px]">
                    {formatRupiah(liveCalculated.monthlyNetRevenue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-[12px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {initialData ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
