import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, Trophy } from 'lucide-react';
import { GlobalStats } from '../types/customer';
import { getTierProgress } from '../helpers/tierCalculator';
import { formatRupiah } from '../helpers/currency';

interface StatsCardProps {
  stats: GlobalStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const progress = getTierProgress(stats.totalClosing, stats.totalMonthlyNetRevenue);
  const { currentTier, nextTier, isMaxTier, closingNeeded, revenueNeeded } = progress;

  const now = new Date();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const currentPeriod = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs"
    >
      <div className="flex flex-col xl:flex-row items-center gap-4 xl:gap-8">
        {/* Left Side: Performance Summary */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                Performa Closing & Tier
              </h3>
              <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-1.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/50">
                {currentPeriod}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {currentTier.level === 0 ? 'Belum Mencapai Tier' : currentTier.name}
                </span>
                <span className="px-1 rounded bg-blue-600 text-[9px] text-white font-black">{currentTier.inc1Percent}% INC1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {/* Closing Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-semibold text-slate-500">Closing (SA): <span className="text-slate-900 dark:text-slate-100">{stats.totalClosing}</span> / {nextTier?.minClosing || currentTier.minClosing}</span>
              {closingNeeded > 0 ? (
                <span className="text-amber-600 font-bold">-{closingNeeded} SA</span>
              ) : (
                <span className="text-emerald-600 font-bold">Target Capai</span>
              )}
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: isMaxTier ? '100%' : `${Math.min(100, (stats.totalClosing / (nextTier?.minClosing || 1)) * 100)}%` 
                }}
                className="h-full bg-blue-600 rounded-full"
              />
            </div>
          </div>

          {/* Revenue Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-semibold text-slate-500">Revenue: <span className="text-slate-900 dark:text-slate-100">{formatRupiah(stats.totalMonthlyNetRevenue)}</span> / {formatRupiah(nextTier?.minRevenue || currentTier.minRevenue)}</span>
              {revenueNeeded > 0 ? (
                <span className="text-amber-600 font-bold">-{formatRupiah(revenueNeeded)}</span>
              ) : (
                <span className="text-emerald-600 font-bold">Target Capai</span>
              )}
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: isMaxTier ? '100%' : `${Math.min(100, (stats.totalMonthlyNetRevenue / (nextTier?.minRevenue || 1)) * 100)}%` 
                }}
                className="h-full bg-emerald-600 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

