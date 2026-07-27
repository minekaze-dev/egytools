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
      className="p-4 rounded-[12px] bg-slate-900 text-slate-100 border border-slate-800 shadow-md flex flex-col justify-between relative overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-white flex items-center gap-1.5">
              Commission Calculator
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-[11px] text-slate-400">
              Kalkulator komisi otomatis berbasis tier & revenue aktif
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
          INC1: {currentTier.inc1Percent}%
        </span>
      </div>

      {/* Grid Inputs & Variables */}
      <div className="grid grid-cols-2 gap-2 my-3 relative z-10">
        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <span className="text-[11px] text-slate-400 block">Tier Sales</span>
          <span className="text-[13px] font-bold text-blue-400">
            {currentTier.level === 0 ? 'Belum Mencapai Tier' : currentTier.name}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <span className="text-[11px] text-slate-400 block">Closing SA</span>
          <span className="text-[13px] font-bold text-white">
            {stats.totalClosing} Pelanggan
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 col-span-2">
          <span className="text-[11px] text-slate-400 block">
            Monthly Net Revenue (Basis)
          </span>
          <span className="text-[13px] font-bold text-emerald-400">
            {formatRupiah(stats.totalMonthlyNetRevenue)}
          </span>
        </div>
      </div>

      {/* Calculation Formula */}
      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 relative z-10 space-y-1">
        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Rumus:</span>
          <span>Monthly Net Revenue × INC1</span>
        </div>
        <div className="text-[11px] font-mono text-slate-300 text-center py-0.5 border-t border-b border-slate-800/80">
          {formatRupiah(stats.totalMonthlyNetRevenue)} × {currentTier.inc1Percent}%
        </div>

        {/* Final Nominal with Animated Count-up */}
        <div className="pt-1 text-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
            Estimasi Komisi Sales
          </span>
          <div className="text-[24px] font-black text-emerald-400 tracking-tight leading-tight drop-shadow-sm">
            {formatRupiah(displayAmount)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
