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
          return 'bg-green-100 text-green-800 border-green-200';
        case 'draft':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'cancelled':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } else {
      const paymentStatus = status as PaymentStatus;
      switch (paymentStatus) {
        case 'paid':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'partial':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'unpaid':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
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
