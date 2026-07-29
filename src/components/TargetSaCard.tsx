import React from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2, TrendingUp, Settings, AlertCircle } from 'lucide-react';

interface TargetSaCardProps {
  currentActiveSa: number;
  targetSa: number;
  onOpenSettings: () => void;
}

export const TargetSaCard: React.FC<TargetSaCardProps> = ({
  currentActiveSa,
  targetSa,
  onOpenSettings,
}) => {
  const percentage = targetSa > 0 ? Math.min(100, Math.round((currentActiveSa / targetSa) * 100)) : 0;
  const remaining = targetSa - currentActiveSa;
  const isAchieved = currentActiveSa >= targetSa;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-5 rounded-none bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                Target SA Bulanan
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Pemasangan Aktif (Sales Active)
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-none bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            title="Ubah Target SA di Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Big Counter & Status */}
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                {currentActiveSa}
              </span>
              <span className="text-sm font-extrabold text-slate-400 font-mono">
                / {targetSa} SA
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
              Target Per Bulan
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {percentage}%
            </div>
            {isAchieved ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 border border-emerald-300 dark:border-emerald-800 uppercase">
                <CheckCircle2 className="w-3 h-3" />
                Tercapai
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 border border-amber-300 dark:border-amber-800 uppercase">
                <AlertCircle className="w-3 h-3" />
                Sisa {remaining} SA
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-none overflow-hidden border border-slate-300 dark:border-slate-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full ${
                isAchieved ? 'bg-emerald-600' : 'bg-indigo-600'
              } rounded-none`}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t-2 border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          {isAchieved ? '🎉 Target bulan ini sudah terpenuhi!' : `Butuh ${remaining} SA lagi untuk capai target.`}
        </span>
        <button
          onClick={onOpenSettings}
          className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline uppercase cursor-pointer"
        >
          Edit Target →
        </button>
      </div>
    </motion.div>
  );
};
