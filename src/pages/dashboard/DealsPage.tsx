import { useEffect, useMemo, useState } from 'react';
import { Filter, Pencil, Plus, Search } from 'lucide-react';
import { formatCurrency, formatShortDate } from '../../lib/formatters';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import type { DealFinancial, DealStatus, PaymentStatus } from '../../lib/types';
import { normalizeErrorMessage, toNumber } from '../../lib/utils';
import { DEAL_STATUS_LABELS } from '../../lib/constants';

interface DealsPageProps {
  onNavigate: (path: string) => void;
  canManage: boolean;
}

export function DealsPage({ onNavigate, canManage }: DealsPageProps) {
  const [deals, setDeals] = useState<DealFinancial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [statusDialogDeal, setStatusDialogDeal] = useState<DealFinancial | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<DealStatus>('draft');

  const loadDeals = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('deal_financials').select('*').order('deal_date', { ascending: false });

    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      setIsLoading(false);
      return;
    }

    setDeals(
      (data ?? []).map((row: any) => ({
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
        payment_status: row.payment_status ?? 'empty',
        created_at: row.created_at,
        updated_at: row.updated_at,
      })),
    );
    setErrorMessage('');
    setIsLoading(false);
  };

  useEffect(() => {
    void loadDeals();
  }, []);

  const getAllowedStatuses = (deal: DealFinancial) => {
    if (deal.status === 'completed') {
      return ['completed'] as DealStatus[];
    }

    return ['draft', 'completed', 'cancelled'] as DealStatus[];
  };

  const openStatusDialog = (deal: DealFinancial) => {
    setStatusDialogDeal(deal);
    setSelectedStatus(deal.status);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const closeStatusDialog = () => {
    setStatusDialogDeal(null);
  };

  const handleStatusUpdate = async () => {
    if (!statusDialogDeal) {
      return;
    }

    if (statusDialogDeal.status === 'completed' && selectedStatus !== 'completed') {
      setErrorMessage('Завершену угоду не можна повернути назад без окремої корекції складу.');
      return;
    }

    if (selectedStatus === statusDialogDeal.status) {
      closeStatusDialog();
      return;
    }

    if (selectedStatus === 'completed') {
      const { data: items, error: itemsError } = await supabase
        .from('deal_items')
        .select('quantity, product:products(name, stock_qty)')
        .eq('deal_id', statusDialogDeal.id);

      if (itemsError) {
        setErrorMessage(normalizeErrorMessage(itemsError));
        return;
      }

      const lowStockItem = (items ?? []).find((item: any) => toNumber(item.product?.stock_qty) < toNumber(item.quantity));
      if (lowStockItem?.product?.name) {
        setErrorMessage(`Недостатній залишок для товару "${lowStockItem.product.name}" для завершення угоди.`);
        return;
      }
    }

    setIsUpdatingStatus(true);
    const { error } = await supabase
      .from('deals')
      .update({ status: selectedStatus })
      .eq('id', statusDialogDeal.id);
    setIsUpdatingStatus(false);

    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      return;
    }

    setSuccessMessage(`Статус угоди ${statusDialogDeal.deal_no} оновлено на "${DEAL_STATUS_LABELS[selectedStatus]}".`);
    closeStatusDialog();
    await loadDeals();
  };

  const filteredDeals = useMemo(
    () =>
      deals.filter((deal) => {
        const matchesSearch =
          deal.deal_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.buyer_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || deal.status === statusFilter;
        const matchesType =
          !typeFilter || (typeFilter === 'wholesale' ? deal.is_wholesale : !deal.is_wholesale);
        const matchesPayment = !paymentFilter || deal.payment_status === paymentFilter;

        return matchesSearch && matchesStatus && matchesType && matchesPayment;
      }),
    [deals, searchTerm, statusFilter, typeFilter, paymentFilter],
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="app-page-title">Угоди</h1>
          <p className="app-page-subtitle">Управління продажами та контрактами</p>
        </div>
        {canManage ? (
          <button onClick={() => onNavigate('/dashboard/deals/new')} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Створити угоду
          </button>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="app-alert-error">{errorMessage}</div>
      ) : null}

      {successMessage ? (
        <div className="app-alert-success">{successMessage}</div>
      ) : null}

      {!canManage ? (
        <div className="app-alert-info">Режим перегляду: ця роль може переглядати угоди без створення та редагування.</div>
      ) : null}

      {canManage ? (
        <div className="app-alert-info">
          Оплата змінює фінансовий стан угоди автоматично, але не завершує її. Статус угоди змінюйте окремо, коли продаж або відвантаження фактично завершені.
        </div>
      ) : null}

      <div className="app-panel p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Пошук за номером або покупцем..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="app-input pl-10 pr-4"
            />
          </div>
          <button onClick={() => setShowFilters((current) => !current)} className="app-btn-secondary inline-flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Фільтри
          </button>
        </div>

        {showFilters ? (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-200 pt-4 dark:border-slate-800 md:grid-cols-3">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="app-input">
              <option value="">Всі статуси</option>
              {(['draft', 'completed', 'cancelled'] as DealStatus[]).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="app-input">
              <option value="">Всі типи</option>
              <option value="wholesale">Гуртова</option>
              <option value="retail">Роздрібна</option>
            </select>
            <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)} className="app-input">
              <option value="">Вся оплата</option>
              {(['paid', 'partial', 'unpaid', 'empty'] as PaymentStatus[]).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <div className="app-table-shell">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="app-table-head">
              <tr>
                <th className="app-table-head-cell">Номер</th>
                <th className="app-table-head-cell">Дата</th>
                <th className="app-table-head-cell">Покупець</th>
                <th className="app-table-head-cell">Тип</th>
                <th className="app-table-head-cell">Сума</th>
                <th className="app-table-head-cell">Оплачено</th>
                <th className="app-table-head-cell">Борг</th>
                <th className="app-table-head-cell">Прибуток</th>
                <th className="app-table-head-cell">Статус</th>
                <th className="app-table-head-cell">Стан оплати</th>
                {canManage ? <th className="app-table-head-cell text-right">Дії</th> : null}
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="app-table-row">
                  <td className="app-table-cell-strong whitespace-nowrap">{deal.deal_no}</td>
                  <td className="app-table-cell whitespace-nowrap">{formatShortDate(deal.deal_date)}</td>
                  <td className="app-table-cell-strong whitespace-nowrap">{deal.buyer_name}</td>
                  <td className="app-table-cell whitespace-nowrap">{deal.is_wholesale ? 'Гуртова' : 'Роздрібна'}</td>
                  <td className="app-table-cell-strong whitespace-nowrap">{formatCurrency(deal.total_amount)}</td>
                  <td className="app-table-cell whitespace-nowrap">{formatCurrency(deal.paid_amount)}</td>
                  <td className={`app-table-cell whitespace-nowrap ${deal.debt_amount > 0 ? 'app-status-negative' : 'text-slate-700 dark:text-slate-300'}`}>{formatCurrency(deal.debt_amount)}</td>
                  <td className="app-table-cell whitespace-nowrap app-status-positive">{formatCurrency(deal.profit_amount)}</td>
                  <td className="app-table-cell whitespace-nowrap">
                    <StatusBadge status={deal.status} type="deal" />
                  </td>
                  <td className="app-table-cell whitespace-nowrap">
                    <StatusBadge status={deal.payment_status} type="payment" />
                  </td>
                  {canManage ? (
                    <td className="app-table-cell whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => openStatusDialog(deal)}
                        className="inline-flex items-center gap-2 app-status-accent hover:text-blue-800 dark:hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Pencil className="w-4 h-4" />
                        Статус
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {statusDialogDeal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="app-panel w-full max-w-lg p-6">
            <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Змінити статус угоди
            </h2>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
              {statusDialogDeal.deal_no} • {statusDialogDeal.buyer_name}
            </p>

            {statusDialogDeal.status === 'completed' ? (
              <div className="app-alert-warning mb-4">
                Завершену угоду не можна повернути назад у поточній реалізації, щоб не зламати складські залишки.
              </div>
            ) : null}

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Новий статус
                </label>
                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value as DealStatus)}
                  className="app-input"
                  disabled={statusDialogDeal.status === 'completed'}
                >
                  {getAllowedStatuses(statusDialogDeal).map((status) => (
                    <option key={status} value={status}>
                      {DEAL_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
                <p>Стан оплати: <span className="font-medium"><StatusBadge status={statusDialogDeal.payment_status} type="payment" /></span></p>
                <p className="mt-2">Оплачено: {formatCurrency(statusDialogDeal.paid_amount)}</p>
                <p>Залишок: {formatCurrency(statusDialogDeal.debt_amount)}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={closeStatusDialog} className="app-btn-secondary flex-1">
                Скасувати
              </button>
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={isUpdatingStatus || statusDialogDeal.status === 'completed'}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isUpdatingStatus ? 'Оновлення...' : 'Оновити статус'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
