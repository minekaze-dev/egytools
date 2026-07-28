import React from 'react';
import { CustomerStatus } from '../types/customer';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: CustomerStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Aktif':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-none bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-800 uppercase whitespace-nowrap">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Aktif
        </span>
      );

    case 'Refund':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-none bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-400 dark:border-rose-800 uppercase whitespace-nowrap">
          <RotateCcw className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          Refund
        </span>
      );

    case 'Dismantle':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-none bg-slate-100 text-slate-800 dark:bg-slate-800/90 dark:text-slate-300 border border-slate-400 dark:border-slate-700 uppercase whitespace-nowrap">
          <XCircle className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          Dismantle
        </span>
      );

    default:
      return null;
  }
};
