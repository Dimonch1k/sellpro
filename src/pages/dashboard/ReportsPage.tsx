import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, TrendingUp, Users } from 'lucide-react';
import { formatCurrency, formatShortDate } from '../../lib/formatters';
import { StatCard } from '../../components/shared/StatCard';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { normalizeErrorMessage, toNumber } from '../../lib/utils';

interface MonthlyChartRow {
  month: string;
  revenue: number;
  profit: number;
}

interface TopBuyerRow {
  company: string;
  revenue: number;
  deals: number;
}

interface TopProductRow {
  name: string;
  quantity: number;
  revenue: number;
}

interface DebtorRow {
  buyer_name: string;
  deal_no: string;
  total_amount: number;
  paid_amount: number;
  debt_amount: number;
}

export function ReportsPage() {
  const [monthlyData, setMonthlyData] = useState<MonthlyChartRow[]>([]);
  const [topBuyers, setTopBuyers] = useState<TopBuyerRow[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductRow[]>([]);
  const [debtors, setDebtors] = useState<DebtorRow[]>([]);
  const [summary, setSummary] = useState({ completed: 0, draft: 0, cancelled: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [monthlyResult, financialsResult, itemsResult] = await Promise.all([
        supabase.from('monthly_sales').select('*').order('month', { ascending: true }),
        supabase.from('deal_financials').select('*'),
        supabase
          .from('deal_items')
          .select('quantity, line_total, product:products(name)')
          .order('created_at', { ascending: false }),
      ]);

      if (monthlyResult.error || financialsResult.error || itemsResult.error) {
        setErrorMessage(normalizeErrorMessage(monthlyResult.error || financialsResult.error || itemsResult.error));
        setIsLoading(false);
        return;
      }

      const financials = (financialsResult.data ?? []).map((row: any) => ({
        ...row,
        total_amount: toNumber(row.total_amount),
        paid_amount: toNumber(row.paid_amount),
        debt_amount: toNumber(row.debt_amount),
        profit_amount: toNumber(row.profit_amount),
      }));

      setMonthlyData(
        (monthlyResult.data ?? []).map((row: any) => ({
          month: formatShortDate(row.month).slice(3),
          revenue: toNumber(row.revenue_amount),
          profit: toNumber(row.profit_amount),
        })),
      );

      const buyersMap = new Map<string, TopBuyerRow>();
      const debtRows: DebtorRow[] = [];
      let completed = 0;
      let draft = 0;
      let cancelled = 0;

      for (const row of financials) {
        if (row.status === 'completed') {
          completed += 1;
        } else if (row.status === 'draft') {
          draft += 1;
        } else if (row.status === 'cancelled') {
          cancelled += 1;
        }

        const buyer = buyersMap.get(row.buyer_name) ?? { company: row.buyer_name, revenue: 0, deals: 0 };
        buyer.revenue += row.status === 'completed' ? row.total_amount : 0;
        buyer.deals += 1;
        buyersMap.set(row.buyer_name, buyer);

        if (row.debt_amount > 0) {
          debtRows.push({
            buyer_name: row.buyer_name,
            deal_no: row.deal_no,
            total_amount: row.total_amount,
            paid_amount: row.paid_amount,
            debt_amount: row.debt_amount,
          });
        }
      }

      setSummary({ completed, draft, cancelled });
      setTopBuyers(Array.from(buyersMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5));
      setDebtors(debtRows.sort((a, b) => b.debt_amount - a.debt_amount).slice(0, 10));

      const productMap = new Map<string, TopProductRow>();
      for (const row of itemsResult.data ?? []) {
        const name = row.product?.name ?? 'Невідомий товар';
        const existing = productMap.get(name) ?? { name, quantity: 0, revenue: 0 };
        existing.quantity += toNumber(row.quantity);
        existing.revenue += toNumber(row.line_total);
        productMap.set(name, existing);
      }

      setTopProducts(Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5));
      setErrorMessage('');
      setIsLoading(false);
    };

    void loadData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="app-page-title">Звіти та аналітика</h1>
        <p className="app-page-subtitle">Фінансова звітність та статистика продажів</p>
      </div>

      {errorMessage ? (
        <div className="app-alert-error">{errorMessage}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Завершені угоди" value={summary.completed} icon={FileText} />
        <StatCard title="Чернетки" value={summary.draft} icon={FileText} />
        <StatCard title="Скасовані" value={summary.cancelled} icon={FileText} />
      </div>

      <div className="app-panel p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Місячна динаміка</h2>
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
        <div className="app-panel p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Топ покупці</h2>
          </div>
          <div className="space-y-3">
            {topBuyers.map((buyer) => (
              <div key={buyer.company} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-950/60">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{buyer.company}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{buyer.deals} угод</p>
                </div>
                <p className="app-status-accent font-semibold">{formatCurrency(buyer.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="app-panel p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Топ товари</h2>
          </div>
          <div className="space-y-3">
            {topProducts.map((product) => (
              <div key={product.name} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-950/60">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{product.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Продано: {product.quantity}</p>
                </div>
                <p className="app-status-positive font-semibold">{formatCurrency(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="app-panel p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Дебіторська заборгованість</h2>
        <table className="w-full">
          <thead className="app-table-head">
            <tr>
              <th className="app-table-head-cell px-4">Покупець</th>
              <th className="app-table-head-cell px-4">Угода</th>
              <th className="app-table-head-cell px-4">Сума угоди</th>
              <th className="app-table-head-cell px-4">Оплачено</th>
              <th className="app-table-head-cell px-4">Борг</th>
            </tr>
          </thead>
          <tbody>
            {debtors.map((row) => (
              <tr key={row.deal_no} className="app-table-row">
                <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">{row.buyer_name}</td>
                <td className="px-4 py-3 text-sm app-status-accent">{row.deal_no}</td>
                <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">{formatCurrency(row.total_amount)}</td>
                <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">{formatCurrency(row.paid_amount)}</td>
                <td className="px-4 py-3 text-sm font-semibold app-status-negative">{formatCurrency(row.debt_amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
