import React from 'react';
import { motion } from 'motion/react';
import { Info, Calculator, Percent, ShieldCheck } from 'lucide-react';
import { TIERS } from '../constants/tier';
import { formatRupiah } from '../helpers/currency';

export const CalculationGuide: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Formulas Card */}
      <div className="lg:col-span-2 p-5 rounded-none bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-blue-500" />
          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 uppercase tracking-wide">
            Logika Kalkulasi
          </h4>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Net Revenue
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-none border border-blue-200 dark:border-blue-800 uppercase">
                Gross
              </span>
              <span className="text-slate-400">−</span>
              <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-none border border-rose-200 dark:border-rose-800 uppercase">
                PPN (11%)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Komisi Sales
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-none border border-emerald-200 dark:border-emerald-800 uppercase">
                Net Rev
              </span>
              <span className="text-slate-400">×</span>
              <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-none border border-amber-200 dark:border-amber-800 uppercase">
                % Tier
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Rules Card */}
      <div className="lg:col-span-3 p-5 rounded-none bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-amber-500" />
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Ketentuan Tier
            </h4>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-1 rounded-none border border-blue-200 dark:border-blue-800 uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Wajib SA & Revenue tercapai</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-none border-2 border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-extrabold border-b-2 border-slate-200 dark:border-slate-800 uppercase">
              <tr>
                <th className="px-3.5 py-2">Tier</th>
                <th className="px-3.5 py-2">SA</th>
                <th className="px-3.5 py-2">Revenue</th>
                <th className="px-3.5 py-2 text-blue-600 dark:text-blue-400">INC1</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-200 dark:divide-slate-800 font-bold">
              {TIERS.filter(t => t.level !== 0).map((tier) => (
                <tr key={tier.level} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-3.5 py-2 font-extrabold text-slate-900 dark:text-slate-100 uppercase">{tier.name}</td>
                  <td className="px-3.5 py-2 text-slate-600 dark:text-slate-400">{tier.minClosing}</td>
                  <td className="px-3.5 py-2 text-slate-600 dark:text-slate-400">{formatRupiah(tier.minRevenue)}</td>
                  <td className="px-3.5 py-2 font-black text-blue-600 dark:text-blue-400">{tier.inc1Percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
