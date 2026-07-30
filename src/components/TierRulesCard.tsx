import React from 'react';
import { Percent, ShieldCheck } from 'lucide-react';
import { TIERS } from '../constants/tier';
import { formatRupiah } from '../helpers/currency';

interface TierRulesCardProps {
  activeTierLevel?: number;
}

export const TierRulesCard: React.FC<TierRulesCardProps> = ({ activeTierLevel = 0 }) => {
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
        {TIERS.filter((t) => t.level !== 0).map((tier) => {
          const isCurrentTier = activeTierLevel === tier.level;
          const isReached = activeTierLevel >= tier.level;

          return (
            <div
              key={tier.level}
              className={`p-2.5 border-2 flex items-center justify-between transition-colors ${
                isCurrentTier
                  ? 'bg-amber-100/90 dark:bg-amber-950/70 border-amber-400 dark:border-amber-500 shadow-xs ring-2 ring-amber-400/40'
                  : isReached
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60'
                  : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-extrabold text-xs uppercase ${
                      isCurrentTier
                        ? 'text-amber-950 dark:text-amber-200'
                        : isReached
                        ? 'text-amber-900 dark:text-amber-300'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {tier.name}
                  </span>
                  {isCurrentTier && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-none">
                      Aktif
                    </span>
                  )}
                </div>
                <div
                  className={`text-[11px] font-bold ${
                    isCurrentTier
                      ? 'text-amber-800 dark:text-amber-300'
                      : isReached
                      ? 'text-amber-700/80 dark:text-amber-400/80'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tier.minClosing} SA &bull; {formatRupiah(tier.minRevenue)}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-black font-mono ${
                    isCurrentTier
                      ? 'text-amber-900 dark:text-amber-200'
                      : isReached
                      ? 'text-amber-800 dark:text-amber-300'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {tier.inc1Percent}%
                </span>
                <div
                  className={`text-[9px] font-extrabold uppercase ${
                    isCurrentTier
                      ? 'text-amber-800 dark:text-amber-400'
                      : isReached
                      ? 'text-amber-700 dark:text-amber-500'
                      : 'text-slate-400'
                  }`}
                >
                  Komisi
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

