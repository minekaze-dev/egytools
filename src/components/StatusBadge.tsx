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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 whitespace-nowrap">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Aktif
        </span>
      );

    case 'Refund':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60 whitespace-nowrap">
          <RotateCcw className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          Refund
        </span>
      );

    case 'Dismantle':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
          <XCircle className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          Dismantle
        </span>
      );

    default:
      return null;
  }
};
