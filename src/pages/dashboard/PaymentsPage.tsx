import { useEffect, useMemo, useState } from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { formatCurrency, formatShortDate } from '../../lib/formatters';
import { PAYMENT_METHOD_LABELS } from '../../lib/constants';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import type { PaymentMethod } from '../../lib/types';
import { normalizeErrorMessage, toNumber, today } from '../../lib/utils';

interface PaymentRow {
  id: string;
  deal_id: string;
  deal_no: string;
  buyer: string;
  payment_date: string;
  amount: number;
  method: PaymentMethod;
  note?: string | null;
}

interface DealOption {
  id: string;
  deal_no: string;
  buyer_name: string;
  status: string;
  debt_amount: number;
  payment_status: string;
}

const defaultForm = {
  deal_id: '',
  payment_date: today(),
  amount: '',
  method: 'cash' as PaymentMethod,
  note: '',
};

interface PaymentsPageProps {
  canManage: boolean;
}

export function PaymentsPage({ canManage }: PaymentsPageProps) {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [deals, setDeals] = useState<DealOption[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const [paymentsResult, dealsResult] = await Promise.all([
      supabase
        .from('payments')
        .select('id, deal_id, payment_date, amount, method, note, deals!inner(deal_no, buyers!inner(company_name))')
        .order('payment_date', { ascending: false }),
      supabase
        .from('deal_financials')
        .select('id, deal_no, buyer_name, status, debt_amount, payment_status')
        .neq('status', 'cancelled')
        .order('deal_date', { ascending: false }),
    ]);

    if (paymentsResult.error || dealsResult.error) {
      setErrorMessage(normalizeErrorMessage(paymentsResult.error || dealsResult.error));
      setIsLoading(false);
      return;
    }

    setPayments(
      (paymentsResult.data ?? []).map((row: any) => ({
        id: row.id,
        deal_id: row.deal_id,
        deal_no: row.deals.deal_no,
        buyer: row.deals.buyers.company_name,
        payment_date: row.payment_date,
        amount: toNumber(row.amount),
        method: row.method,
        note: row.note,
      })),
    );
    setDeals(
      (dealsResult.data ?? []).map((row: any) => ({
        id: row.id,
        deal_no: row.deal_no,
        buyer_name: row.buyer_name,
        status: row.status,
        debt_amount: toNumber(row.debt_amount),
        payment_status: row.payment_status ?? 'empty',
      })),
    );
    setErrorMessage('');
    setIsLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const totalsByMethod = useMemo(() => {
    return payments.reduce<Record<PaymentMethod, number>>(
      (acc, payment) => {
        acc[payment.method] += payment.amount;
        return acc;
      },
      { cash: 0, card: 0, bank_transfer: 0, other: 0 },
    );
  }, [payments]);

  const handleSave = async () => {
    if (!canManage) {
      setErrorMessage('У вас немає прав на додавання платежів.');
      return;
    }
    setErrorMessage('');

    const amount = Number(formData.amount);
    const selectedDeal = deals.find((deal) => deal.id === formData.deal_id);

    if (!formData.deal_id) {
      setErrorMessage('Оберіть угоду для платежу.');
      return;
    }

    if (!selectedDeal) {
      setErrorMessage('Обрана угода не знайдена.');
      return;
    }

    if (selectedDeal.status === 'cancelled') {
      setErrorMessage('Для скасованої угоди не можна додавати платежі.');
      return;
    }

    if (Number.isNaN(amount) || amount <= 0) {
      setErrorMessage('Сума платежу має бути більшою за нуль.');
      return;
    }

    if (selectedDeal.debt_amount <= 0) {
      setErrorMessage('Ця угода вже повністю оплачена.');
      return;
    }

    if (amount > selectedDeal.debt_amount) {
      setErrorMessage(`Сума платежу не може перевищувати залишок ${formatCurrency(selectedDeal.debt_amount)}.`);
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from('payments').insert({
      deal_id: formData.deal_id,
      payment_date: formData.payment_date,
      amount,
      method: formData.method,
      note: formData.note.trim() || null,
    });
    setIsSaving(false);

    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      return;
    }

    setShowDialog(false);
    setFormData(defaultForm);
    await loadData();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="app-page-title">Платежі</h1>
          <p className="app-page-subtitle">Облік надходжень та оплат</p>
        </div>
        {canManage ? (
          <button onClick={() => setShowDialog(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Додати платіж
          </button>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="app-alert-error">{errorMessage}</div>
      ) : null}

      {!canManage ? (
        <div className="app-alert-info">Режим перегляду: ця роль може лише переглядати платежі.</div>
      ) : null}

      <div className="app-alert-info">
        Платежі автоматично змінюють стан оплати угоди та суму боргу, але не змінюють її операційний статус. Статус угоди оновлюється окремо на сторінці угод.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['cash', 'card', 'bank_transfer', 'other'] as PaymentMethod[]).map((method) => (
          <div key={method} className="app-panel p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{PAYMENT_METHOD_LABELS[method]}</p>
                <p className="text-lg font-semibold">{formatCurrency(totalsByMethod[method])}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="app-table-shell">
        <table className="w-full">
          <thead className="app-table-head">
            <tr>
              <th className="app-table-head-cell">Дата</th>
              <th className="app-table-head-cell">Угода</th>
              <th className="app-table-head-cell">Покупець</th>
              <th className="app-table-head-cell">Сума</th>
              <th className="app-table-head-cell">Спосіб</th>
              <th className="app-table-head-cell">Примітка</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="app-table-row">
                <td className="app-table-cell whitespace-nowrap">{formatShortDate(payment.payment_date)}</td>
                <td className="app-table-cell whitespace-nowrap app-status-accent font-medium">{payment.deal_no}</td>
                <td className="app-table-cell-strong whitespace-nowrap">{payment.buyer}</td>
                <td className="app-table-cell whitespace-nowrap app-status-positive font-semibold">{formatCurrency(payment.amount)}</td>
                <td className="app-table-cell whitespace-nowrap">{PAYMENT_METHOD_LABELS[payment.method]}</td>
                <td className="app-table-cell">{payment.note || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="app-panel w-full max-w-lg p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Новий платіж</h2>
            <div className="space-y-4">
              <select value={formData.deal_id} onChange={(event) => setFormData((current) => ({ ...current, deal_id: event.target.value }))} className="app-input">
                <option value="">Оберіть угоду</option>
                {deals.map((deal) => (
                  <option key={deal.id} value={deal.id}>
                    {deal.deal_no} - {deal.buyer_name} ({formatCurrency(deal.debt_amount)} до оплати)
                  </option>
                ))}
              </select>
              <input value={formData.payment_date} onChange={(event) => setFormData((current) => ({ ...current, payment_date: event.target.value }))} type="date" className="app-input" />
              <input value={formData.amount} onChange={(event) => setFormData((current) => ({ ...current, amount: event.target.value }))} type="number" min="0.01" step="0.01" placeholder="Сума" className="app-input" />
              <select value={formData.method} onChange={(event) => setFormData((current) => ({ ...current, method: event.target.value as PaymentMethod }))} className="app-input">
                {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((method) => (
                  <option key={method} value={method}>
                    {PAYMENT_METHOD_LABELS[method]}
                  </option>
                ))}
              </select>
              <textarea value={formData.note} onChange={(event) => setFormData((current) => ({ ...current, note: event.target.value }))} rows={3} placeholder="Примітка" className="app-input" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDialog(false)} className="app-btn-secondary flex-1">Скасувати</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
                {isSaving ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
