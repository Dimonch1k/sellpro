import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, AlertCircle, FileText, Users, Package } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';
import { formatCurrency, formatShortDate } from '../../lib/formatters';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import type { DashboardStats, DealFinancial, MonthlySales } from '../../lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';
import { normalizeErrorMessage, toNumber } from '../../lib/utils';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [recentDeals, setRecentDeals] = useState<DealFinancial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage('');

      const [statsResult, monthlyResult, dealsResult] = await Promise.all([
        supabase.from('dashboard_stats').select('*').single(),
        supabase.from('monthly_sales').select('*').order('month', { ascending: true }),
        supabase.from('deal_financials').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      if (statsResult.error || monthlyResult.error || dealsResult.error) {
        setErrorMessage(
          normalizeErrorMessage(statsResult.error || monthlyResult.error || dealsResult.error),
        );
        setIsLoading(false);
        return;
      }

      setStats({
        buyers_count: toNumber(statsResult.data.buyers_count),
        products_count: toNumber(statsResult.data.products_count),
        low_stock_count: toNumber(statsResult.data.low_stock_count),
        deals_count: toNumber(statsResult.data.deals_count),
        completed_deals_count: toNumber(statsResult.data.completed_deals_count),
        revenue_amount: toNumber(statsResult.data.revenue_amount),
        profit_amount: toNumber(statsResult.data.profit_amount),
        debt_amount: toNumber(statsResult.data.debt_amount),
      });

      setMonthlySales(
        (monthlyResult.data ?? []).map((row) => ({
          month: row.month,
          completed_deals_count: toNumber(row.completed_deals_count),
          revenue_amount: toNumber(row.revenue_amount),
          profit_amount: toNumber(row.profit_amount),
          debt_amount: toNumber(row.debt_amount),
        })),
      );

      setRecentDeals(
        (dealsResult.data ?? []).map((row) => ({
          id: row.id,
          deal_no: row.deal_no,
          deal_date: row.deal_date,
          buyer_id: row.buyer_id,
          buyer_name: row.buyer_name,
          is_wholesale: row.is_wholesale,
          total_amount: toNumber(row.total_amount),
          paid_amount: toNumber(row.paid_amount),
          debt_amount: toNumber(row.debt_amount),
          profit_amount: toNumber(row.profit_amount),
          total_quantity: toNumber(row.total_quantity),
          subtotal_amount: toNumber(row.subtotal_amount),
          items_discount_amount: toNumber(row.items_discount_amount),
          manual_discount_amount: toNumber(row.manual_discount_amount),
          status: row.status,
          payment_status: row.payment_status,
          created_at: row.created_at,
          updated_at: row.updated_at,
        })),
      );

      setIsLoading(false);
    };

    void loadData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (errorMessage) {
    return <div className="app-alert-error">{errorMessage}</div>;
  }

  if (!stats) {
    return <div className="app-panel px-4 py-6 text-sm text-slate-600 dark:text-slate-400">Дані ще не підготовлені.</div>;
  }

  const monthlyChartData = monthlySales.map((row) => ({
    month: formatShortDate(row.month).slice(3),
    revenue: row.revenue_amount,
    profit: row.profit_amount,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="app-page-title">Панель керування</h1>
        <p className="app-page-subtitle">Загальна статистика та огляд продажів</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Загальний дохід"
          value={formatCurrency(stats.revenue_amount)}
          icon={DollarSign}
        />
        <StatCard
          title="Прибуток"
          value={formatCurrency(stats.profit_amount)}
          icon={TrendingUp}
        />
        <StatCard
          title="Борг покупців"
          value={formatCurrency(stats.debt_amount)}
          icon={AlertCircle}
        />
        <StatCard
          title="Кількість угод"
          value={stats.deals_count}
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Активні покупці"
          value={stats.buyers_count}
          icon={Users}
        />
        <StatCard
          title="Товари на складі"
          value={stats.products_count}
          icon={Package}
        />
        <StatCard
          title="Товари з низьким залишком"
          value={stats.low_stock_count}
          icon={AlertCircle}
        />
      </div>

      <div className="app-panel p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Динаміка продажів</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyChartData}>
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

      <div className="app-table-shell">
        <div className="border-b border-slate-200 p-6 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Останні угоди</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="app-table-head">
              <tr>
                <th className="app-table-head-cell">
                  Номер
                </th>
                <th className="app-table-head-cell">
                  Дата
                </th>
                <th className="app-table-head-cell">
                  Покупець
                </th>
                <th className="app-table-head-cell">
                  Сума
                </th>
                <th className="app-table-head-cell">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody>
              {recentDeals.map((deal) => (
                <tr key={deal.id} className="app-table-row">
                  <td className="app-table-cell-strong whitespace-nowrap">
                    {deal.deal_no}
                  </td>
                  <td className="app-table-cell whitespace-nowrap">
                    {formatShortDate(deal.deal_date)}
                  </td>
                  <td className="app-table-cell-strong whitespace-nowrap">
                    {deal.buyer_name}
                  </td>
                  <td className="app-table-cell-strong whitespace-nowrap">
                    {formatCurrency(deal.total_amount)}
                  </td>
                  <td className="app-table-cell whitespace-nowrap">
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
