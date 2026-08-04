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
  namaPelanggan: z.string().optional(),
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
  defaultTanggalPasang?: string;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultTanggalPasang,
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
      periode: 'Bulanan',
      tanggalPasang: defaultTanggalPasang || new Date().toISOString().split('T')[0],
      status: 'Aktif',
      catatan: '',
    },
  });

  // Populate initialData when editing or reset when adding
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
    } else if (isOpen) {
      reset({
        namaPelanggan: '',
        nomorInternet: '',
        nomorHP: '',
        packageId: MASTER_PACKAGES[0].id,
        periode: 'Bulanan',
        tanggalPasang: defaultTanggalPasang || new Date().toISOString().split('T')[0],
        status: 'Aktif',
        catatan: '',
      });
    }
  }, [initialData, reset, isOpen, defaultTanggalPasang]);

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
      namaPelanggan: data.namaPelanggan?.trim() || '-',
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
          className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-none max-w-2xl w-full shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-none bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                <UserPlus className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                {initialData ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-none hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border border-slate-200 dark:border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[12px]">
              {/* Nama Pelanggan */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                  Nama Pelanggan <span className="text-slate-400 font-normal text-[11px]">(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PT Solusi Tekno Nusantara"
                  {...register('namaPelanggan')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-none focus:outline-hidden focus:border-blue-600 dark:text-slate-100"
                />
              </div>

              {/* ID Pelanggan */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                  ID Pelanggan <span className="text-slate-400 font-normal text-[11px]">(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 1008273641"
                  {...register('nomorInternet')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-none focus:outline-hidden focus:border-blue-600 dark:text-slate-100"
                />
              </div>

              {/* Nomor HP */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                  Nomor Telepon / HP <span className="text-slate-400 font-normal text-[11px]">(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="081234567890"
                  {...register('nomorHP')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-none focus:outline-hidden focus:border-blue-600 dark:text-slate-100"
                />
              </div>

              {/* Tanggal Pasang */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                  Tanggal Pasang <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('tanggalPasang')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-none focus:outline-hidden focus:border-blue-600 dark:text-slate-100 font-bold"
                />
              </div>

              {/* Paket Dropdown */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                  Paket <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('packageId')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-none focus:outline-hidden focus:border-blue-600 dark:text-slate-100 font-bold"
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
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                  Periode Langganan <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('periode')}
                  disabled={isPromo277}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-none focus:outline-hidden focus:border-blue-600 dark:text-slate-100 font-bold disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:opacity-80 cursor-pointer disabled:cursor-not-allowed uppercase"
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
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-none focus:outline-hidden focus:border-blue-600 dark:text-slate-100 font-bold uppercase"
                >
                  <option value="Aktif">Aktif (Masuk Revenue & Komisi)</option>
                  <option value="Refund">Refund (Pengurangan Revenue)</option>
                  <option value="Dismantle">Dismantle (Pengurangan Revenue)</option>
                </select>
              </div>

              {/* Catatan */}
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  placeholder="Catatan pendaftaran / keterangan lokasi..."
                  {...register('catatan')}
                  className="w-full px-3 py-1.5 text-[12px] bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-none focus:outline-hidden focus:border-blue-600 dark:text-slate-100"
                />
              </div>
            </div>

            {/* AUTOMATIC CALCULATION LIVE PREVIEW */}
            <div className="p-3.5 rounded-none bg-blue-50/70 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-900 text-[11px] space-y-2">
              <div className="flex items-center justify-between text-blue-900 dark:text-blue-300 font-extrabold border-b pb-1.5 border-blue-200 dark:border-blue-900 uppercase">
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Kalkulasi Otomatis Sistem
                </span>
                <span className="text-[10px] bg-blue-200/80 dark:bg-blue-800 text-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded-none font-mono">
                  Dihitung Otomatis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700 dark:text-slate-300">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                    Gross Contract
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {formatRupiah(liveCalculated.grossContract)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                    PPN (11%)
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {formatRupiah(liveCalculated.ppn)}
                  </span>
                </div>
                <div className="p-1.5 rounded-none bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <span className="text-emerald-800 dark:text-emerald-400 block text-[10px] font-bold uppercase">
                    Net Revenue
                  </span>
                  <span className="font-black text-emerald-800 dark:text-emerald-300 text-[12px]">
                    {formatRupiah(liveCalculated.monthlyNetRevenue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-[12px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-none border-2 border-slate-300 dark:border-slate-700 transition-colors uppercase cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-none border-2 border-blue-700 transition-colors uppercase cursor-pointer"
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
