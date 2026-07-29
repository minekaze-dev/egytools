import React from 'react';
import { Percent, ShieldCheck } from 'lucide-react';
import { TIERS } from '../constants/tier';
import { formatRupiah } from '../helpers/currency';

export const TierRulesCard: React.FC = () => {
  return (
    <div className="p-3 sm:p-4 rounded-none bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-none bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            <Percent className="w-4 h-4" />
          </div>
          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wide">
            Ketentuan Tier Komisi
          </h4>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-none border border-blue-200 dark:border-blue-800 uppercase w-fit">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Syarat: Minimal SA & Net Revenue Tercapai</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {TIERS.filter((t) => t.level !== 0).map((tier) => (
          <div
            key={tier.level}
            className="p-2.5 bg-slate-50 dark:bg-slate-900/70 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-between"
          >
            <div>
              <div className="font-extrabold text-xs text-slate-900 dark:text-white uppercase">
                {tier.name}
              </div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {tier.minClosing} SA &bull; {formatRupiah(tier.minRevenue)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono">
                {tier.inc1Percent}%
              </span>
              <div className="text-[9px] font-extrabold text-slate-400 uppercase">
                Komisi
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
