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
      className="p-4 rounded-[12px] bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                Tier Saat Ini:
              </span>
              <span className="px-2 py-0.5 text-[12px] font-bold rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                {currentTier.name} ({currentTier.inc1Percent}% INC1)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {isMaxTier
                ? 'Selamat! Anda telah mencapai Tier tertinggi (Tier 3).'
                : `Target berikutnya: ${nextTier?.name} (${nextTier?.inc1Percent}% INC1)`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowMatrixModal(true)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline px-2 py-1 rounded-md bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          Detail Matriks Tier
        </button>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
        {/* Closing SA Progress */}
        <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
          <div className="flex justify-between items-center text-[12px]">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Progress Closing (SA)
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {activeClosing}{' '}
              <span className="text-slate-400 font-normal">
                / {nextTier ? nextTier.minClosing : currentTier.minClosing} SA
              </span>
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
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
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            {closingNeeded > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Butuh {closingNeeded} Closing lagi
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Target SA Terpenuhi
              </span>
            )}
            <span>Min SA: {nextTier?.minClosing || currentTier.minClosing}</span>
          </div>
        </div>

        {/* Revenue Progress */}
        <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
          <div className="flex justify-between items-center text-[12px]">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Progress Net Revenue
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {formatRupiah(activeRevenue)}{' '}
              <span className="text-slate-400 font-normal">
                / {formatRupiah(nextTier ? nextTier.minRevenue : currentTier.minRevenue)}
              </span>
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
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
              className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            {revenueNeeded > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Tambah Revenue {formatRupiah(revenueNeeded)}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Target Revenue Terpenuhi
              </span>
            )}
            <span>
              Target: {formatRupiah(nextTier?.minRevenue || currentTier.minRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Condition Notice */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Aturan Tier:</strong> Tier harus memenuhi <strong>Jumlah SA DAN Net Revenue</strong>. Jika salah satu belum terpenuhi, Tier tidak naik.
        </span>
      </div>

      {/* Tier Matrix Modal */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[12px] p-5 max-w-lg w-full shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Matriks Syarat & Komisi Tier Sales
              </h3>
              <button
                onClick={() => setShowMatrixModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <p className="text-[12px] text-slate-500 dark:text-slate-400">
              Berikut adalah aturan resmi kenaikan Tier Komisi Sales. Kedua syarat (Minimal SA & Minimal Revenue) wajib dipenuhi bersamaan.
            </p>

            <div className="overflow-x-auto border rounded-lg border-slate-200 dark:border-slate-800">
              <table className="w-full text-[12px] text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-2.5">Tier</th>
                    <th className="p-2.5">Syarat SA</th>
                    <th className="p-2.5">Syarat Revenue</th>
                    <th className="p-2.5 text-right">Komisi INC1</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {TIERS.map((t) => {
                    const isCurrent = t.level === currentTier.level;
                    return (
                      <tr
                        key={t.level}
                        className={
                          isCurrent
                            ? 'bg-blue-50/80 dark:bg-blue-950/40 font-medium'
                            : ''
                        }
                      >
                        <td className="p-2.5 flex items-center gap-1.5">
                          {t.name}
                          {isCurrent && (
                            <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">
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
                        <td className="p-2.5 text-right font-bold text-blue-600 dark:text-blue-400">
                          {t.inc1Percent}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowMatrixModal(false)}
                className="px-3 py-1.5 text-[12px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors"
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
