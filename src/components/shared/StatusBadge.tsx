import type { DealStatus, PaymentStatus } from '../../lib/types';
import { DEAL_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../../lib/constants';

interface StatusBadgeProps {
  status: DealStatus | PaymentStatus;
  type?: 'deal' | 'payment';
}

export function StatusBadge({ status, type = 'deal' }: StatusBadgeProps) {
  const getStatusColor = () => {
    if (type === 'deal') {
      const dealStatus = status as DealStatus;
      switch (dealStatus) {
        case 'completed':
          return 'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300';
        case 'draft':
          return 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
        case 'cancelled':
          return 'border-red-200 bg-red-100 text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300';
        default:
          return 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
      }
    } else {
      const paymentStatus = status as PaymentStatus;
      switch (paymentStatus) {
        case 'paid':
          return 'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300';
        case 'partial':
          return 'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-300';
        case 'unpaid':
          return 'border-red-200 bg-red-100 text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300';
        default:
          return 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
      }
    }
  };

  const label = type === 'deal'
    ? DEAL_STATUS_LABELS[status as DealStatus]
    : PAYMENT_STATUS_LABELS[status as PaymentStatus];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor()}`}>
      {label}
    </span>
  );
}
