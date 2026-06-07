import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { formatCurrency, formatShortDate } from '../../lib/formatters';
import { StatusBadge } from '../../components/shared/StatusBadge';
import type { DealStatus, PaymentStatus } from '../../lib/types';

interface DealRow {
  id: string;
  deal_no: string;
  deal_date: string;
  buyer: string;
  is_wholesale: boolean;
  status: DealStatus;
  total_amount: number;
  paid_amount: number;
  debt_amount: number;
  profit_amount: number;
  payment_status: PaymentStatus;
}

const mockDeals: DealRow[] = [
  {
    id: '1',
    deal_no: 'УГ-2024-001',
    deal_date: '2024-05-20',
    buyer: 'ТОВ "Будматеріали"',
    is_wholesale: true,
    status: 'completed',
    total_amount: 45000,
    paid_amount: 45000,
    debt_amount: 0,
    profit_amount: 12500,
    payment_status: 'paid',
  },
  {
    id: '2',
    deal_no: 'УГ-2024-002',
    deal_date: '2024-05-21',
    buyer: 'ФОП Коваленко',
    is_wholesale: false,
    status: 'completed',
    total_amount: 18500,
    paid_amount: 10000,
    debt_amount: 8500,
    profit_amount: 5200,
    payment_status: 'partial',
  },
  {
    id: '3',
    deal_no: 'УГ-2024-003',
    deal_date: '2024-05-22',
    buyer: 'ПрАТ "Торгбуд"',
    is_wholesale: true,
    status: 'draft',
    total_amount: 62000,
    paid_amount: 0,
    debt_amount: 0,
    profit_amount: 0,
    payment_status: 'unpaid',
  },
  {
    id: '4',
    deal_no: 'УГ-2024-004',
    deal_date: '2024-05-23',
    buyer: 'ТОВ "Епіцентр"',
    is_wholesale: true,
    status: 'completed',
    total_amount: 125000,
    paid_amount: 0,
    debt_amount: 125000,
    profit_amount: 35000,
    payment_status: 'unpaid',
  },
];

export function DealsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredDeals = mockDeals.filter(
    (deal) =>
      deal.deal_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.buyer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Угоди</h1>
          <p className="text-gray-600 mt-1">Управління продажами та контрактами</p>
        </div>
        <button
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Створити угоду
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Пошук за номером або покупцем..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            Фільтри
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Всі статуси</option>
                <option value="draft">Чернетка</option>
                <option value="completed">Завершено</option>
                <option value="cancelled">Скасовано</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Всі типи</option>
                <option value="wholesale">Гуртова</option>
                <option value="retail">Роздрібна</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Оплата
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Всі</option>
                <option value="paid">Оплачено</option>
                <option value="partial">Частково</option>
                <option value="unpaid">Не оплачено</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Період
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Номер
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Покупець
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сума
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Оплачено
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Борг
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Прибуток
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {deal.deal_no}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatShortDate(deal.deal_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deal.buyer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deal.is_wholesale
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {deal.is_wholesale ? 'Гуртова' : 'Роздрібна'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(deal.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(deal.paid_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={deal.debt_amount > 0 ? 'text-red-600' : 'text-gray-900'}>
                      {formatCurrency(deal.debt_amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {formatCurrency(deal.profit_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={deal.status} type="deal" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
