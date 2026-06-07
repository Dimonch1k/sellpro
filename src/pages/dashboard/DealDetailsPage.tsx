import { useState } from 'react';
import { Printer, Plus, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { StatusBadge } from '../../components/shared/StatusBadge';
import type { DealStatus } from '../../lib/types';

interface DealItemRow {
  id: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percent: number;
  line_total: number;
}

const mockDeal = {
  id: '1',
  deal_no: 'УГ-2024-001',
  deal_date: '2024-05-20',
  buyer: {
    company_name: 'ТОВ "Будматеріали Плюс"',
    contact_person: 'Петренко Іван Васильович',
    phone: '+380 44 123 45 67',
    address: 'м. Київ, вул. Будівельників, 15',
  },
  is_wholesale: true,
  status: 'completed' as DealStatus,
  note: 'Доставка на об\'єкт',
  discount_amount: 2000,
};

const mockItems: DealItemRow[] = [
  {
    id: '1',
    product_name: 'Цемент М500',
    quantity: 50,
    unit: 'мішок',
    unit_price: 185,
    discount_percent: 0,
    line_total: 9250,
  },
  {
    id: '2',
    product_name: 'Цегла червона',
    quantity: 5000,
    unit: 'шт',
    unit_price: 8.5,
    discount_percent: 5,
    line_total: 40375,
  },
];

export function DealDetailsPage() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const subtotal = mockItems.reduce((sum, item) => sum + item.line_total, 0);
  const itemDiscounts = mockItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unit_price;
    return sum + (itemSubtotal * item.discount_percent / 100);
  }, 0);
  const finalTotal = subtotal - mockDeal.discount_amount;

  const paidAmount = 45000;
  const debtAmount = finalTotal - paidAmount;
  const profitAmount = 12500;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Угода {mockDeal.deal_no}</h1>
          <p className="text-gray-600 mt-1">Деталі угоди та рахунок</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="w-5 h-5" />
            Друк
          </button>
          {mockDeal.status === 'completed' && debtAmount > 0 && (
            <button
              onClick={() => setShowPaymentDialog(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Додати платіж
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{mockDeal.deal_no}</h2>
                <p className="text-gray-600">{formatDate(mockDeal.deal_date)}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={mockDeal.status} type="deal" />
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    mockDeal.is_wholesale
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {mockDeal.is_wholesale ? 'Гуртова' : 'Роздрібна'}
                </span>
              </div>
            </div>

            <div className="border-t border-b py-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Покупець</h3>
              <p className="text-gray-900 font-medium">{mockDeal.buyer.company_name}</p>
              <p className="text-sm text-gray-600">{mockDeal.buyer.contact_person}</p>
              <p className="text-sm text-gray-600">{mockDeal.buyer.phone}</p>
              <p className="text-sm text-gray-600">{mockDeal.buyer.address}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Товари</h3>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Товар
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      К-сть
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Ціна
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Знижка
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Сума
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.product_name}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {item.discount_percent > 0 ? `${item.discount_percent}%` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(item.line_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Підсумок:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {itemDiscounts > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Знижки на товари:</span>
                    <span className="text-red-600">-{formatCurrency(itemDiscounts)}</span>
                  </div>
                )}
                {mockDeal.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Додаткова знижка:</span>
                    <span className="text-red-600">-{formatCurrency(mockDeal.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>До оплати:</span>
                  <span className="text-blue-600">{formatCurrency(finalTotal)}</span>
                </div>
              </div>
            </div>

            {mockDeal.note && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-2">Примітка</h3>
                <p className="text-gray-600">{mockDeal.note}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Фінанси</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Сума угоди</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(finalTotal)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Оплачено</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Борг</p>
                <p className={`text-xl font-bold ${debtAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(debtAmount)}
                </p>
              </div>

              {mockDeal.status === 'completed' && (
                <div>
                  <p className="text-sm text-gray-600">Прибуток</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(profitAmount)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Дії</h3>
            <div className="space-y-3">
              {mockDeal.status === 'draft' && (
                <>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Завершити угоду
                  </button>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Редагувати
                  </button>
                </>
              )}

              {mockDeal.status === 'completed' && debtAmount > 0 && (
                <button
                  onClick={() => setShowPaymentDialog(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Додати платіж
                </button>
              )}

              {mockDeal.status !== 'cancelled' && (
                <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                  Скасувати угоду
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPaymentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Додати платіж</h2>
              <button
                onClick={() => setShowPaymentDialog(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сума <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={debtAmount}
                  step="0.01"
                  defaultValue={debtAmount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Залишок боргу: {formatCurrency(debtAmount)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Спосіб оплати <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="cash">Готівка</option>
                  <option value="card">Картка</option>
                  <option value="bank_transfer">Банківський переказ</option>
                  <option value="other">Інше</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата платежу <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Примітка
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPaymentDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Скасувати
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Зберегти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
