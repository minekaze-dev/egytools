import React, { useState } from 'react';
import { motion } from 'motion/react';
import { formatRupiah } from '../helpers/currency';
import { getTierProgress } from '../helpers/tierCalculator';
import { TIERS } from '../constants/tier';
import { Trophy, TrendingUp, AlertCircle, Info, ChevronRight, CheckCircle2 } from 'lucide-react';

interface TierCardProps {
  activeClosing: number;
  activeRevenue: number;
}

export const TierCard: React.FC<TierCardProps> = ({
  activeClosing,
  activeRevenue,
}) => {
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const progress = getTierProgress(activeClosing, activeRevenue);
  const { currentTier, nextTier, closingNeeded, revenueNeeded, isMaxTier } =
    progress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-none bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-none bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100 uppercase">
                Tier Saat Ini:
              </span>
              <span className="px-2 py-0.5 text-[12px] font-extrabold rounded-none bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800 uppercase">
                {currentTier.name} ({currentTier.inc1Percent}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
              {isMaxTier
                ? 'Selamat! Anda telah mencapai Tier tertinggi (Tier 3).'
                : `Target berikutnya: ${nextTier?.name} (${nextTier?.inc1Percent}%)`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowMatrixModal(true)}
          className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-600 hover:text-blue-700 dark:text-blue-400 px-2 py-1 rounded-none bg-blue-50/50 dark:bg-blue-950/40 border-2 border-blue-200 dark:border-blue-800 transition-colors uppercase cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          Detail Matriks Tier
        </button>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
        {/* Closing SA Progress */}
        <div className="space-y-1.5 p-2.5 rounded-none bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-[12px]">
            <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase">
              Progress Closing (SA)
            </span>
            <span className="font-black text-slate-900 dark:text-slate-100">
              {activeClosing}{' '}
              <span className="text-slate-400 font-bold">
                / {nextTier ? nextTier.minClosing : currentTier.minClosing} SA
              </span>
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-none h-2.5 overflow-hidden border border-slate-300 dark:border-slate-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: isMaxTier
                  ? '100%'
                  : `${Math.min(
                      100,
                      (activeClosing / (nextTier?.minClosing || 1)) * 100
                    )}%`,
              }}
              transition={{ duration: 0.5 }}
              className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-none"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold">
            {closingNeeded > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-extrabold uppercase">
                Butuh {closingNeeded} Closing lagi
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1 uppercase">
                <CheckCircle2 className="w-3 h-3" /> Target SA Terpenuhi
              </span>
            )}
            <span className="uppercase">Min SA: {nextTier?.minClosing || currentTier.minClosing}</span>
          </div>
        </div>

        {/* Revenue Progress */}
        <div className="space-y-1.5 p-2.5 rounded-none bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-[12px]">
            <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase">
              Progress Net Revenue
            </span>
            <span className="font-black text-slate-900 dark:text-slate-100">
              {formatRupiah(activeRevenue)}{' '}
              <span className="text-slate-400 font-bold">
                / {formatRupiah(nextTier ? nextTier.minRevenue : currentTier.minRevenue)}
              </span>
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-none h-2.5 overflow-hidden border border-slate-300 dark:border-slate-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: isMaxTier
                  ? '100%'
                  : `${Math.min(
                      100,
                      (activeRevenue / (nextTier?.minRevenue || 1)) * 100
                    )}%`,
              }}
              transition={{ duration: 0.5 }}
              className="bg-emerald-600 dark:bg-emerald-500 h-2.5 rounded-none"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold">
            {revenueNeeded > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-extrabold uppercase">
                Tambah Revenue {formatRupiah(revenueNeeded)}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1 uppercase">
                <CheckCircle2 className="w-3 h-3" /> Target Revenue Terpenuhi
              </span>
            )}
            <span className="uppercase">
              Target: {formatRupiah(nextTier?.minRevenue || currentTier.minRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Condition Notice */}
      <div className="flex items-center gap-2 p-2 rounded-none bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Aturan Tier:</strong> Tier harus memenuhi <strong>Jumlah SA DAN Net Revenue</strong>. Jika salah satu belum terpenuhi, Tier tidak naik.
        </span>
      </div>

      {/* Tier Matrix Modal */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-none p-5 max-w-lg w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b-2 pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wide">
                <Trophy className="w-4 h-4 text-amber-500" />
                Matriks Syarat & Komisi Tier Sales
              </h3>
              <button
                onClick={() => setShowMatrixModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-extrabold px-2 py-1 rounded-none border border-slate-200 dark:border-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-[12px] text-slate-500 dark:text-slate-400">
              Berikut adalah aturan resmi kenaikan Tier Komisi Sales. Kedua syarat (Minimal SA & Minimal Revenue) wajib dipenuhi bersamaan.
            </p>

            <div className="overflow-x-auto border-2 rounded-none border-slate-200 dark:border-slate-800">
              <table className="w-full text-[12px] text-left">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-extrabold border-b-2 border-slate-200 dark:border-slate-800 uppercase">
                  <tr>
                    <th className="p-2.5">Tier</th>
                    <th className="p-2.5">Syarat SA</th>
                    <th className="p-2.5">Syarat Revenue</th>
                    <th className="p-2.5 text-right">Persentase Komisi</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                  {TIERS.map((t) => {
                    const isCurrent = t.level === currentTier.level;
                    return (
                      <tr
                        key={t.level}
                        className={
                          isCurrent
                            ? 'bg-amber-100/80 dark:bg-amber-950/60 font-extrabold text-amber-950 dark:text-amber-100'
                            : ''
                        }
                      >
                        <td className="p-2.5 flex items-center gap-1.5 uppercase">
                          {t.name}
                          {isCurrent && (
                            <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-none font-black uppercase tracking-wider">
                              Saat ini
                            </span>
                          )}
                        </td>
                        <td className="p-2.5">
                          {t.minClosing === 0 ? '< 15 SA' : `≥ ${t.minClosing} SA`}
                        </td>
                        <td className="p-2.5">
                          {t.minRevenue === 0
                            ? '< Rp3.750.000'
                            : `≥ ${formatRupiah(t.minRevenue)}`}
                        </td>
                        <td className={`p-2.5 text-right font-black ${isCurrent ? 'text-amber-700 dark:text-amber-300' : 'text-blue-600 dark:text-blue-400'}`}>
                          {t.inc1Percent}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t-2 border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowMatrixModal(false)}
                className="px-4 py-1.5 text-[12px] font-extrabold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-none border-2 border-slate-300 dark:border-slate-700 transition-colors uppercase cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
