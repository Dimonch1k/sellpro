import { useState } from 'react';
import { Plus } from 'lucide-react';
import { formatShortDate } from '../../lib/formatters';
import { MOVEMENT_TYPE_LABELS } from '../../lib/constants';
import type { MovementType } from '../../lib/types';

interface StockMovementRow {
  id: string;
  created_at: string;
  product_name: string;
  movement_type: MovementType;
  quantity_delta: number;
  unit: string;
  reason?: string;
}

const mockMovements: StockMovementRow[] = [
  {
    id: '1',
    created_at: '2024-05-20T10:30:00',
    product_name: 'Цемент М500',
    movement_type: 'sale',
    quantity_delta: -50,
    unit: 'мішок',
    reason: 'Угода УГ-2024-001',
  },
  {
    id: '2',
    created_at: '2024-05-19T14:15:00',
    product_name: 'Цегла червона',
    movement_type: 'income',
    quantity_delta: 5000,
    unit: 'шт',
    reason: 'Надходження від постачальника',
  },
  {
    id: '3',
    created_at: '2024-05-18T09:00:00',
    product_name: 'Арматура 12мм',
    movement_type: 'write_off',
    quantity_delta: -10,
    unit: 'м',
    reason: 'Пошкодження при транспортуванні',
  },
  {
    id: '4',
    created_at: '2024-05-17T16:45:00',
    product_name: 'Пісок будівельний',
    movement_type: 'correction',
    quantity_delta: 5,
    unit: 'тонна',
    reason: 'Коригування після інвентаризації',
  },
];

export function StockMovementsPage() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Складські операції</h1>
          <p className="text-gray-600 mt-1">Історія руху товарів на складі</p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Додати операцію
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-900 mb-2">Важливо:</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Для надходження вказуйте додатне значення кількості</li>
          <li>• Для списання вказуйте від'ємне значення кількості</li>
          <li>• Операції продажу створюються автоматично при завершенні угод</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Товар
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тип операції
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Кількість
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Причина
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockMovements.map((movement) => (
              <tr key={movement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatShortDate(movement.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {movement.product_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      movement.movement_type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : movement.movement_type === 'sale'
                        ? 'bg-blue-100 text-blue-800'
                        : movement.movement_type === 'return'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {MOVEMENT_TYPE_LABELS[movement.movement_type]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`font-medium ${
                      movement.quantity_delta > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {movement.quantity_delta > 0 ? '+' : ''}
                    {movement.quantity_delta} {movement.unit}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {movement.reason || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
