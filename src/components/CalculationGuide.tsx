import React from 'react';
import { motion } from 'motion/react';
import { Info, Calculator, Percent, ShieldCheck } from 'lucide-react';
import { TIERS } from '../constants/tier';
import { formatRupiah } from '../helpers/currency';

export const CalculationGuide: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Formulas Card */}
      <div className="lg:col-span-2 p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-3.5 h-3.5 text-blue-500" />
          <h4 className="font-bold text-[12px] text-slate-800 dark:text-slate-100">Logika Kalkulasi</h4>
        </div>

        <div className="space-y-2.5">
          <div className="flex flex-col gap-1">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Net Revenue</div>
            <div className="text-[10px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="px-1 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">Gross</span>
              <span className="text-slate-300">−</span>
              <span className="px-1 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded">PPN (11%)</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Komisi Sales</div>
            <div className="text-[10px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="px-1 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded">Net Rev</span>
              <span className="text-slate-300">×</span>
              <span className="px-1 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded">% Tier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Rules Card */}
      <div className="lg:col-span-3 p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Percent className="w-3.5 h-3.5 text-amber-500" />
            <h4 className="font-bold text-[12px] text-slate-800 dark:text-slate-100">Ketentuan Tier</h4>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            <span>Wajib SA & Revenue tercapai</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-[10px]">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-bold">
              <tr>
                <th className="px-3 py-1.5">Tier</th>
                <th className="px-3 py-1.5">SA</th>
                <th className="px-3 py-1.5">Revenue</th>
                <th className="px-3 py-1.5 text-blue-600">INC1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {TIERS.filter(t => t.level !== 0).map((tier) => (
                <tr key={tier.level} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-3 py-1.5 font-bold text-slate-700 dark:text-slate-300">{tier.name}</td>
                  <td className="px-3 py-1.5 text-slate-500">{tier.minClosing}</td>
                  <td className="px-3 py-1.5 text-slate-500">{formatRupiah(tier.minRevenue)}</td>
                  <td className="px-3 py-1.5 font-black text-blue-600 dark:text-blue-400">{tier.inc1Percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
