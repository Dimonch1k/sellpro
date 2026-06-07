import { useState } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { formatCurrency, formatShortDate } from '../../lib/formatters';
import { PAYMENT_METHOD_LABELS } from '../../lib/constants';
import type { PaymentMethod } from '../../lib/types';

interface PaymentRow {
  id: string;
  deal_no: string;
  payment_date: string;
  amount: number;
  method: PaymentMethod;
  note?: string;
  buyer: string;
}

const mockPayments: PaymentRow[] = [
  {
    id: '1',
    deal_no: 'УГ-2024-001',
    payment_date: '2024-05-20',
    amount: 45000,
    method: 'bank_transfer',
    buyer: 'ТОВ "Будматеріали"',
    note: 'Оплата за товар згідно рахунку',
  },
  {
    id: '2',
    deal_no: 'УГ-2024-002',
    payment_date: '2024-05-21',
    amount: 10000,
    method: 'cash',
    buyer: 'ФОП Коваленко',
    note: 'Часткова оплата готівкою',
  },
  {
    id: '3',
    deal_no: 'УГ-2024-004',
    payment_date: '2024-05-23',
    amount: 25000,
    method: 'card',
    buyer: 'ТОВ "Епіцентр"',
  },
];

export function PaymentsPage() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Платежі</h1>
          <p className="text-gray-600 mt-1">Облік надходжень та оплат</p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Додати платіж
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Готівка</p>
              <p className="text-lg font-semibold">{formatCurrency(10000)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Картка</p>
              <p className="text-lg font-semibold">{formatCurrency(25000)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Банк</p>
              <p className="text-lg font-semibold">{formatCurrency(45000)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-50 p-2 rounded-lg">
              <CreditCard className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Інше</p>
              <p className="text-lg font-semibold">{formatCurrency(0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Угода
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Покупець
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сума
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Спосіб оплати
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Примітка
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatShortDate(payment.payment_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {payment.deal_no}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.buyer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {PAYMENT_METHOD_LABELS[payment.method]}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {payment.note || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
