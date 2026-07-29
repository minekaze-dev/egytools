import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Award,
  Zap,
  User,
  HelpCircle,
  ChevronLeft,
  Eye,
} from 'lucide-react';
import { BillingPeriod } from '../types/customer';
import { calculateRevenue } from '../helpers/revenueCalculator';
import { getCurrentTier, getTierProgress } from '../helpers/tierCalculator';
import { formatRupiah } from '../helpers/currency';

interface QuickItem {
  id: string;
  price: number;
  period: BillingPeriod;
  qty: number;
}

interface QuickCalculatorProps {
  onBackToLanding?: () => void;
  onEnterDashboard?: () => void;
}

const PACKAGE_PRICES = [
  { label: 'Stream 50 Mbps — Rp185.000 /bln', value: 185000 },
  { label: 'Stream 50 Mbps (Reguler) — Rp199.000 /bln', value: 199000 },
  { label: 'Stream 75 Mbps (SMT) — Rp297.000 /bln', value: 297000 },
  { label: 'Stream 100 Mbps (SMT) — Rp350.000 /bln', value: 350000 },
  { label: 'Stream 150 Mbps (SMT) — Rp450.000 /bln', value: 450000 },
  { label: 'Stream 200 Mbps (SMT) — Rp540.000 /bln', value: 540000 },
  { label: 'Stream 100 Mbps — Rp242.000 /bln', value: 242000 },
  { label: 'Stream Sports 200 Mbps Promo — Rp277.500 /bln', value: 277500 },
  { label: 'Stream 150 Mbps — Rp306.000 /bln', value: 306000 },
  { label: 'Stream 200 Mbps — Rp356.000 /bln', value: 356000 },
  { label: 'Stream Plus TV 100 Mbps — Rp299.000 /bln', value: 299000 },
  { label: 'Stream Plus TV 150 Mbps — Rp359.000 /bln', value: 359000 },
  { label: 'Stream Plus TV 200 Mbps — Rp409.000 /bln', value: 409000 },
  { label: 'Oxylite 50 — Rp110.000 /bln', value: 110000 },
  { label: 'Oxylite 75 — Rp138.750 /bln', value: 138750 },
  { label: 'Oxylite 100 — Rp166.500 /bln', value: 166500 },
];

const PERIOD_OPTIONS: BillingPeriod[] = ['Bulanan', '3 Bulan', '6 Bulan', 'Tahunan'];

export const QuickCalculator: React.FC<QuickCalculatorProps> = ({
  onBackToLanding,
  onEnterDashboard,
}) => {
  const [userName, setUserName] = useState('');
  const [items, setItems] = useState<QuickItem[]>([]);

  // Custom single item builder state
  const [customPrice, setCustomPrice] = useState<number>(185000);
  const [customPeriod, setCustomPeriod] = useState<BillingPeriod>('Bulanan');
  const [customQty, setCustomQty] = useState<number>(1);

  // Flow states: 'input' | 'calculating' | 'result' | 'details'
  const [calcState, setCalcState] = useState<'input' | 'calculating' | 'result' | 'details'>('input');
  const [calcProgress, setCalcProgress] = useState(0);

  // Add custom item
  const handleAddItem = () => {
    if (!customPrice || customPrice <= 0 || customQty <= 0) return;
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        price: customPrice,
        period: customPeriod,
        qty: customQty,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  // Calculate totals
  let totalClosing = 0;
  let totalMonthlyNetRevenue = 0;
  let totalGrossContract = 0;

  items.forEach((item) => {
    const rev = calculateRevenue(item.price, item.period);
    totalClosing += item.qty;
    totalMonthlyNetRevenue += rev.monthlyNetRevenue * item.qty;
    totalGrossContract += rev.grossContract * item.qty;
  });

  const currentTier = getCurrentTier(totalClosing, totalMonthlyNetRevenue);
  const tierProgress = getTierProgress(totalClosing, totalMonthlyNetRevenue);
  const inc1Percent = currentTier.inc1Percent;
  const totalKomisi = Math.round((totalMonthlyNetRevenue * inc1Percent) / 100);

  // Start calculation animation
  const handleStartCalculate = () => {
    if (!userName.trim()) {
      alert('Mohon masukkan Nama Anda terlebih dahulu.');
      return;
    }

    if (items.length === 0) {
      alert('Mohon tambahkan minimal 1 item penjualan.');
      return;
    }

    setCalcState('calculating');
    setCalcProgress(0);

    const interval = setInterval(() => {
      setCalcProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setCalcState('result');
          return 100;
        }
        return prev + 25;
      });
    }, 80);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-1 sm:px-2 pt-3 sm:pt-4 pb-2 font-sans">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 bg-blue-600 text-white border-2 border-blue-700">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              Hitung Cepat Revenue & Komisi
              <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 font-extrabold uppercase">
                Simulasi
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
              Hitung estimasi komisi & kenaikan tier secara instan
            </p>
          </div>
        </div>

        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs uppercase border-2 border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali</span>
          </button>
        )}
      </div>

      {/* FULL CENTERED ANIMATION STATE */}
      {calcState === 'calculating' && (
        <div className="my-8 max-w-2xl mx-auto p-8 bg-white dark:bg-[#0F172A] border-4 border-blue-600 dark:border-blue-500 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-none border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 animate-spin"></div>
            <Zap className="w-8 h-8 text-amber-500 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Menganalisis & Menghitung Komisi...
            </h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Memproses Net Revenue & Tier Kualifikasi untuk{' '}
              <span className="text-blue-600 dark:text-blue-400 font-black">{userName}</span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 p-0.5">
              <div
                className="h-full bg-blue-600 transition-all duration-75"
                style={{ width: `${calcProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
              <span>HITUNG REVENUE</span>
              <span>{calcProgress}%</span>
              <span>KUALIFIKASI TIER</span>
            </div>
          </div>
        </div>
      )}

      {/* FULL CENTERED RESULT ANNOUNCEMENT STATE */}
      {calcState === 'result' && (
        <div className="my-6 max-w-3xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white border-4 border-amber-400 shadow-2xl space-y-5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider mx-auto">
              <Award className="w-4 h-4 fill-current" />
              <span>Hasil Simulasi Komisi OxyMod</span>
            </div>

            {/* Result Message (Congrats or Tier 0 Warning) */}
            <div className="space-y-3">
              {totalKomisi > 0 && currentTier.level > 0 ? (
                <>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white uppercase">
                    Selamat <span className="text-amber-300 underline">{userName}</span>!
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-slate-200 leading-relaxed bg-white/10 p-4 border border-white/20 max-w-2xl mx-auto">
                    Anda sudah berhasil mendapatkan komisi dengan{' '}
                    <span className="text-emerald-300 font-black underline uppercase">
                      {currentTier.name}
                    </span>{' '}
                    dengan perkiraan komisi sebesar{' '}
                    <span className="text-amber-300 font-mono font-black text-xl sm:text-2xl block sm:inline mt-1 sm:mt-0">
                      {formatRupiah(totalKomisi)}
                    </span>
                    !
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-rose-300 uppercase">
                    Maaf <span className="underline">{userName}</span>,
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-slate-200 leading-relaxed bg-rose-950/40 border border-rose-500/40 p-4 max-w-2xl mx-auto">
                    Anda <span className="text-rose-300 font-extrabold uppercase">belum berhak dapat komisi bulan ini</span> karena belum mencapai kualifikasi batas minimum tier sales (Tier 1).
                  </p>
                </>
              )}
            </div>

            {/* Stats Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/10 max-w-2xl mx-auto">
              <div className="p-2.5 bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">
                  Total Closing
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-white">
                  {totalClosing} SA
                </span>
              </div>

              <div className="p-2.5 bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">
                  Net Revenue / Bln
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-blue-300">
                  {formatRupiah(totalMonthlyNetRevenue)}
                </span>
              </div>

              <div className="p-2.5 bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">
                  Level Tier
                </span>
                <span className="text-sm sm:text-base font-black text-amber-300 uppercase">
                  {currentTier.name}
                </span>
              </div>

              <div className="p-2.5 bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">
                  Rate INC1
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-emerald-300">
                  {inc1Percent}%
                </span>
              </div>
            </div>

            {/* Action Buttons in Full Result Screen */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
              <button
                onClick={() => setCalcState('details')}
                className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
              >
                <Eye className="w-4 h-4" />
                <span>Lihat Detail</span>
              </button>

              <button
                onClick={() => setCalcState('input')}
                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs sm:text-sm uppercase border-2 border-slate-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Hitung Ulang</span>
              </button>

              {onEnterDashboard && (
                <button
                  onClick={onEnterDashboard}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm uppercase border-2 border-blue-500 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INPUT OR DETAILS SPLIT VIEW */}
      {(calcState === 'input' || calcState === 'details') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
          {/* LEFT COLUMN: Input Form & Items List */}
          <div className="lg:col-span-7 space-y-3">
            {/* Input Nama User */}
            <div className="p-3 bg-white dark:bg-[#0F172A] border-2 border-blue-600 dark:border-blue-500 shadow-xs">
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-1 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Nama Lengkap / Sales <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-hidden focus:border-blue-600 dark:focus:border-blue-400"
              />
            </div>

            {/* Quick Add Form Section */}
            <div className="p-3 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between border-b pb-1.5 border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  Tambah Paket Penjualan
                </h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase">
                  Pilih Paket
                </span>
              </div>

              {/* Package Inputs */}
              <div className="grid grid-cols-12 gap-1.5">
                <div className="col-span-5 sm:col-span-5">
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-0.5">
                    Harga Paket (Rp)
                  </label>
                  <select
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    className="w-full px-1.5 py-1 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs font-bold focus:outline-hidden focus:border-blue-600"
                  >
                    {PACKAGE_PRICES.map((pkg) => (
                      <option key={pkg.value} value={pkg.value}>
                        {pkg.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-4 sm:col-span-4">
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-0.5">
                    Periode
                  </label>
                  <select
                    value={customPeriod}
                    onChange={(e) => setCustomPeriod(e.target.value as BillingPeriod)}
                    className="w-full px-1.5 py-1 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    {PERIOD_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-3 sm:col-span-3">
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-0.5">
                    Jumlah (SA)
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      min={1}
                      value={customQty}
                      onChange={(e) => setCustomQty(Math.max(1, Number(e.target.value)))}
                      className="w-full px-1.5 py-1 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs font-bold"
                    />
                    <button
                      onClick={handleAddItem}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs border-2 border-emerald-700 transition-colors uppercase shrink-0 cursor-pointer"
                      title="Tambah Paket"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Added Items List */}
            <div className="p-3 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wide">
                  Daftar Penjualan ({items.length} Paket &bull; Total {totalClosing} SA)
                </h3>
                {items.length > 0 && (
                  <button
                    onClick={() => setItems([])}
                    className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline uppercase cursor-pointer"
                  >
                    Reset Semua
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="py-10 sm:py-12 text-center bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <HelpCircle className="w-7 h-7 mx-auto mb-1.5 opacity-50" />
                  <p className="text-xs font-bold uppercase">Belum Ada Paket Ditambahkan</p>
                  <p className="text-[11px] mt-0.5">Pilih paket dari dropdown di atas lalu klik tombol +</p>
                </div>
              ) : (
                <div className="space-y-1.5 min-h-[160px] max-h-[360px] overflow-y-auto pr-1">
                  {items.map((item, index) => {
                    const rev = calculateRevenue(item.price, item.period);
                    return (
                      <div
                        key={item.id}
                        className="p-2 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <div>
                            <div className="font-mono font-extrabold text-xs text-slate-900 dark:text-white">
                              {formatRupiah(item.price)}{' '}
                              <span className="text-[10px] font-sans font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1 py-0.2 border border-blue-200 dark:border-blue-800 uppercase ml-1">
                                {item.period}
                              </span>
                            </div>
                            <div className="text-[10px] font-bold text-slate-500">
                              Net/bln: {formatRupiah(rev.monthlyNetRevenue)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <button
                              onClick={() => handleUpdateQty(item.id, -1)}
                              className="px-1.5 py-0.5 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 text-xs font-mono font-black text-slate-900 dark:text-white border-x border-slate-200 dark:border-slate-700">
                              {item.qty} SA
                            </span>
                            <button
                              onClick={() => handleUpdateQty(item.id, 1)}
                              className="px-1.5 py-0.5 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Live Summary or Detailed Calculated Breakdown */}
          <div className="lg:col-span-5 space-y-3">
            {/* INITIAL BEFORE CALCULATION VIEW */}
            {calcState === 'input' && (
              <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white border-2 border-slate-800 space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-current" />
                    Ringkasan Penjualan
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Sebelum Hitung
                  </span>
                </div>

                {/* ONLY SHOW TOTAL CLOSING & NET REVENUE BEFORE CALCULATION (TIER & KOMISI HIDDEN) */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center bg-white/5 p-2.5 border border-white/10">
                    <span className="text-xs text-slate-300 font-bold uppercase">Total Closing</span>
                    <span className="text-sm font-black font-mono text-amber-400">{totalClosing} SA</span>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 p-2.5 border border-white/10">
                    <span className="text-xs text-slate-300 font-bold uppercase">Total Net/Bln</span>
                    <span className="text-sm font-black font-mono text-blue-400">{formatRupiah(totalMonthlyNetRevenue)}</span>
                  </div>
                </div>

                <button
                  onClick={handleStartCalculate}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Hitung & Lihat Hasil Simulasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-slate-400 text-center font-medium">
                  Klik tombol di atas untuk memproses animasi & melihat hasil komisi & tier kualifikasi.
                </p>
              </div>
            )}

            {/* DETAILED RESULTS AFTER "LIHAT DETAIL" IS CLICKED */}
            {calcState === 'details' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* Main Hero Summary Card */}
                <div className="p-4 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white border-2 border-amber-400 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="inline-flex items-center gap-1 text-amber-400 font-black text-xs uppercase tracking-wider">
                      <Award className="w-4 h-4 fill-current" />
                      <span>Rincian Komisi Sales ({userName || 'Sales'})</span>
                    </div>
                    <button
                      onClick={() => setCalcState('result')}
                      className="text-[10px] font-bold text-slate-300 hover:text-white underline uppercase cursor-pointer"
                    >
                      Pesans Ucapan
                    </button>
                  </div>

                  {/* Calculated Stats Grid with Tier & Komisi NOW visible */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white/5 p-2 border border-white/10">
                      <span className="text-xs text-slate-300 font-bold uppercase">Total Closing</span>
                      <span className="text-xs font-black font-mono text-white">{totalClosing} SA</span>
                    </div>

                    <div className="flex justify-between items-center bg-white/5 p-2 border border-white/10">
                      <span className="text-xs text-slate-300 font-bold uppercase">Net Revenue / Bln</span>
                      <span className="text-xs font-black font-mono text-blue-300">{formatRupiah(totalMonthlyNetRevenue)}</span>
                    </div>

                    <div className="flex justify-between items-center bg-white/10 p-2 border border-white/20">
                      <span className="text-xs text-amber-300 font-black uppercase">Level Tier Kualifikasi</span>
                      <span className="text-xs font-black text-amber-300 uppercase">{currentTier.name} ({inc1Percent}%)</span>
                    </div>

                    <div className="flex justify-between items-center bg-emerald-950/60 p-2.5 border border-emerald-500/50">
                      <span className="text-xs text-emerald-300 font-black uppercase">Estimasi Komisi</span>
                      <span className="text-sm font-black font-mono text-amber-300">{formatRupiah(totalKomisi)}</span>
                    </div>
                  </div>
                </div>

                {/* Tier Next Level Progress Card */}
                <div className="p-3 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Status Kualifikasi Tier Sales</span>
                  </h4>

                  {tierProgress.isMaxTier ? (
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>TIER MAKSIMAL (Tier 3) - Rate 35%!</span>
                    </div>
                  ) : (
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600 dark:text-slate-400">
                          Menuju <strong className="text-blue-600 dark:text-blue-400 uppercase">{tierProgress.nextTier?.name}</strong>:
                        </span>
                        <span className="font-mono text-slate-900 dark:text-white text-[10px]">
                          Sisa {tierProgress.closingNeeded} SA &bull; {formatRupiah(tierProgress.revenueNeeded)} Net
                        </span>
                      </div>

                      <div className="space-y-1 text-[10px]">
                        <div>
                          <div className="flex justify-between text-slate-500 font-bold mb-0.5">
                            <span>Progres SA ({totalClosing}/{tierProgress.nextTier?.minClosing})</span>
                            <span>{Math.round(tierProgress.closingProgressPercent)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 transition-all"
                              style={{ width: `${tierProgress.closingProgressPercent}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-500 font-bold mb-0.5">
                            <span>Progres Revenue ({Math.round(tierProgress.revenueProgressPercent)}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5">
                            <div
                              className="bg-emerald-600 h-1.5 transition-all"
                              style={{ width: `${tierProgress.revenueProgressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setCalcState('input')}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-xs uppercase border-2 border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Hitung Ulang</span>
                  </button>

                  {onEnterDashboard && (
                    <button
                      onClick={onEnterDashboard}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase border-2 border-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Dashboard Utama</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
