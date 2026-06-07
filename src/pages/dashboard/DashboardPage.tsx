import { TrendingUp, DollarSign, AlertCircle, FileText, Users, Package } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';
import { formatCurrency, formatShortDate } from '../../lib/formatters';
import { StatusBadge } from '../../components/shared/StatusBadge';
import type { DealStatus } from '../../lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockStats = {
  total_revenue: 2450000,
  total_profit: 850000,
  total_debt: 125000,
  deals_count: 156,
  active_buyers: 42,
  products_in_stock: 324,
  low_stock_products: 12,
};

const mockMonthlyData = [
  { month: 'Січень', revenue: 420000, profit: 145000 },
  { month: 'Лютий', revenue: 385000, profit: 132000 },
  { month: 'Березень', revenue: 450000, profit: 158000 },
  { month: 'Квітень', revenue: 510000, profit: 178000 },
  { month: 'Травень', revenue: 485000, profit: 169000 },
  { month: 'Червень', revenue: 520000, profit: 182000 },
];

const mockRecentDeals = [
  { id: '1', deal_no: 'УГ-2024-001', deal_date: '2024-05-20', buyer: 'ТОВ "Будматеріали"', total: 45000, status: 'completed' as DealStatus },
  { id: '2', deal_no: 'УГ-2024-002', deal_date: '2024-05-21', buyer: 'ФОП Коваленко', total: 18500, status: 'completed' as DealStatus },
  { id: '3', deal_no: 'УГ-2024-003', deal_date: '2024-05-22', buyer: 'ПрАТ "Торгбуд"', total: 62000, status: 'draft' as DealStatus },
  { id: '4', deal_no: 'УГ-2024-004', deal_date: '2024-05-23', buyer: 'ТОВ "Епіцентр"', total: 125000, status: 'completed' as DealStatus },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Панель керування</h1>
        <p className="text-gray-600 mt-1">Загальна статистика та огляд продажів</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Загальний дохід"
          value={formatCurrency(mockStats.total_revenue)}
          icon={DollarSign}
        />
        <StatCard
          title="Прибуток"
          value={formatCurrency(mockStats.total_profit)}
          icon={TrendingUp}
        />
        <StatCard
          title="Борг покупців"
          value={formatCurrency(mockStats.total_debt)}
          icon={AlertCircle}
        />
        <StatCard
          title="Кількість угод"
          value={mockStats.deals_count}
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Активні покупці"
          value={mockStats.active_buyers}
          icon={Users}
        />
        <StatCard
          title="Товари на складі"
          value={mockStats.products_in_stock}
          icon={Package}
        />
        <StatCard
          title="Товари з низьким залишком"
          value={mockStats.low_stock_products}
          icon={AlertCircle}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Динаміка продажів</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockMonthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="Дохід" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="profit" name="Прибуток" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Останні угоди</h2>
        </div>
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
                  Сума
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockRecentDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {deal.deal_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatShortDate(deal.deal_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deal.buyer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(deal.total)}
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
