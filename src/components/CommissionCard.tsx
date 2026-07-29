import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { formatRupiah } from '../helpers/currency';
import { GlobalStats, TierDefinition } from '../types/customer';
import { Calculator, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';

interface CommissionCardProps {
  stats: GlobalStats;
  currentTier: TierDefinition;
}

export const CommissionCard: React.FC<CommissionCardProps> = ({
  stats,
  currentTier,
}) => {
  // Count-up display animation for total commission
  const [displayAmount, setDisplayAmount] = useState(stats.totalKomisiSales);

  useEffect(() => {
    const start = displayAmount;
    const end = stats.totalKomisiSales;
    if (start === end) return;

    const duration = 600; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const easeProgress =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const nextValue = Math.round(start + (end - start) * easeProgress);
      setDisplayAmount(nextValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [stats.totalKomisiSales]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-none bg-slate-900 text-slate-100 border-2 border-slate-800 shadow-md flex flex-col justify-between relative overflow-hidden"
    >
      {/* Background subtle effect */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b-2 border-slate-800 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-none bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wide">
              Commission Calculator
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Kalkulator komisi otomatis berbasis tier & revenue aktif
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 text-xs font-bold rounded-none bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase">
          Komisi: {currentTier.inc1Percent}%
        </span>
      </div>

      {/* Grid Inputs & Variables */}
      <div className="grid grid-cols-2 gap-2.5 my-3.5 relative z-10">
        <div className="p-3 rounded-none bg-slate-800/80 border border-slate-700">
          <span className="text-xs text-slate-400 block font-semibold uppercase">Tier Sales</span>
          <span className="text-sm font-bold text-blue-400">
            {currentTier.level === 0 ? 'Belum Mencapai Tier' : currentTier.name}
          </span>
        </div>

        <div className="p-3 rounded-none bg-slate-800/80 border border-slate-700">
          <span className="text-xs text-slate-400 block font-semibold uppercase">Closing SA</span>
          <span className="text-sm font-bold text-white">
            {stats.totalClosing} Pelanggan
          </span>
        </div>

        <div className="p-3 rounded-none bg-slate-800/80 border border-slate-700 col-span-2">
          <span className="text-xs text-slate-400 block font-semibold uppercase">
            Monthly Net Revenue (Basis)
          </span>
          <span className="text-sm sm:text-base font-bold text-emerald-400">
            {formatRupiah(stats.totalMonthlyNetRevenue)}
          </span>
        </div>
      </div>

      {/* Calculation Formula */}
      <div className="p-3.5 rounded-none bg-slate-950/90 border border-slate-800 relative z-10 space-y-1.5">
        <div className="text-xs text-slate-400 flex items-center justify-between font-mono">
          <span>Rumus:</span>
          <span>Monthly Net Revenue × % Komisi</span>
        </div>
        <div className="text-xs font-mono text-slate-300 text-center py-1 border-t border-b border-slate-800">
          {formatRupiah(stats.totalMonthlyNetRevenue)} × {currentTier.inc1Percent}%
        </div>

        {/* Final Nominal with Animated Count-up */}
        <div className="pt-1.5 text-center">
          <span className="text-xs uppercase tracking-wider text-slate-400 block font-bold">
            Estimasi Komisi Sales
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight leading-tight mt-0.5">
            {formatRupiah(displayAmount)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
