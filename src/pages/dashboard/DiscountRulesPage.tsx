import { useState } from 'react';
import { Plus, Info } from 'lucide-react';
import type { DiscountRule } from '../../lib/types';

const mockRules: DiscountRule[] = [
  {
    id: '1',
    name: 'Знижка за обсяг 1000+',
    min_quantity: 1000,
    discount_percent: 5,
    description: 'Знижка 5% при замовленні від 1000 одиниць',
    is_active: true,
  },
  {
    id: '2',
    name: 'Знижка за суму 50000+',
    min_total_amount: 50000,
    discount_percent: 7,
    description: 'Знижка 7% при сумі замовлення від 50000 грн',
    is_active: true,
  },
  {
    id: '3',
    name: 'VIP клієнти',
    min_total_amount: 100000,
    discount_percent: 10,
    description: 'Знижка 10% для VIP клієнтів на суму від 100000 грн',
    is_active: true,
  },
];

export function DiscountRulesPage() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Правила знижок</h1>
          <p className="text-gray-600 mt-1">Налаштування автоматичних знижок</p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Додати правило
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Як працюють знижки?</h3>
            <p className="text-sm text-blue-800 mt-1">
              Знижки застосовуються автоматично при створенні угоди, якщо виконуються умови
              мінімальної кількості товарів або мінімальної суми замовлення. Можна також
              встановити додаткову знижку вручну.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Назва
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Мін. кількість
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Мін. сума
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Знижка %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Опис
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rule.min_quantity || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rule.min_total_amount ? `${rule.min_total_amount.toLocaleString()} грн` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-green-600">
                    {rule.discount_percent}%
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {rule.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rule.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {rule.is_active ? 'Активне' : 'Неактивне'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
