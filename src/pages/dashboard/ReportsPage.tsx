import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../lib/formatters';
import { FileText, TrendingUp, Users } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';

const monthlyData = [
  { month: 'Січень', revenue: 420000, profit: 145000 },
  { month: 'Лютий', revenue: 385000, profit: 132000 },
  { month: 'Березень', revenue: 450000, profit: 158000 },
  { month: 'Квітень', revenue: 510000, profit: 178000 },
  { month: 'Травень', revenue: 485000, profit: 169000 },
  { month: 'Червень', revenue: 520000, profit: 182000 },
];

const topBuyers = [
  { company: 'ТОВ "Будматеріали"', revenue: 450000, deals: 12 },
  { company: 'ПрАТ "Торгбуд"', revenue: 380000, deals: 8 },
  { company: 'ТОВ "Епіцентр"', revenue: 320000, deals: 15 },
  { company: 'ФОП Коваленко', revenue: 185000, deals: 22 },
];

const topProducts = [
  { name: 'Цемент М500', quantity: 2450, revenue: 453000 },
  { name: 'Цегла червона', quantity: 45000, revenue: 382500 },
  { name: 'Арматура 12мм', quantity: 1850, revenue: 40700 },
  { name: 'Пісок будівельний', quantity: 145, revenue: 79750 },
];

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Звіти та аналітика</h1>
        <p className="text-gray-600 mt-1">Фінансова звітність та статистика продажів</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Завершені угоди"
          value="142"
          icon={FileText}
        />
        <StatCard
          title="Чернетки"
          value="8"
          icon={FileText}
        />
        <StatCard
          title="Скасовані"
          value="6"
          icon={FileText}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Місячна динаміка</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="revenue" name="Дохід" fill="#3b82f6" />
            <Bar dataKey="profit" name="Прибуток" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Топ покупці</h2>
          </div>
          <div className="space-y-3">
            {topBuyers.map((buyer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{buyer.company}</p>
                  <p className="text-sm text-gray-500">{buyer.deals} угод</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{formatCurrency(buyer.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Топ товари</h2>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">Продано: {product.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Дебіторська заборгованість</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Покупець
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Угода
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Сума угоди
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Оплачено
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Борг
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900">ФОП Коваленко</td>
              <td className="px-4 py-3 text-sm text-blue-600">УГ-2024-002</td>
              <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(18500)}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(10000)}</td>
              <td className="px-4 py-3 text-sm text-red-600 font-semibold">{formatCurrency(8500)}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900">ТОВ "Епіцентр"</td>
              <td className="px-4 py-3 text-sm text-blue-600">УГ-2024-004</td>
              <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(125000)}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(0)}</td>
              <td className="px-4 py-3 text-sm text-red-600 font-semibold">{formatCurrency(125000)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
