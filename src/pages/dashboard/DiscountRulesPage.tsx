import { useEffect, useState } from 'react';
import { Info, Pencil, Plus } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import type { DiscountRule } from '../../lib/types';
import { normalizeErrorMessage, toNumber } from '../../lib/utils';

type RuleForm = {
  name: string;
  min_quantity: string;
  min_total_amount: string;
  discount_percent: string;
  description: string;
  is_active: boolean;
};

const defaultForm: RuleForm = {
  name: '',
  min_quantity: '',
  min_total_amount: '',
  discount_percent: '',
  description: '',
  is_active: true,
};

interface DiscountRulesPageProps {
  canManage: boolean;
}

export function DiscountRulesPage({ canManage }: DiscountRulesPageProps) {
  const [rules, setRules] = useState<DiscountRule[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<DiscountRule | null>(null);
  const [formData, setFormData] = useState<RuleForm>(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadRules = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('discount_rules').select('*').order('discount_percent', { ascending: false });

    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      setIsLoading(false);
      return;
    }

    setRules(
      (data ?? []).map((row) => ({
        ...row,
        min_quantity: row.min_quantity === null ? null : toNumber(row.min_quantity),
        min_total_amount: row.min_total_amount === null ? null : toNumber(row.min_total_amount),
        discount_percent: toNumber(row.discount_percent),
      })) as DiscountRule[],
    );
    setErrorMessage('');
    setIsLoading(false);
  };

  useEffect(() => {
    void loadRules();
  }, []);

  const openDialog = (rule?: DiscountRule) => {
    if (!canManage) {
      return;
    }
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        min_quantity: rule.min_quantity === null || rule.min_quantity === undefined ? '' : String(rule.min_quantity),
        min_total_amount: rule.min_total_amount === null || rule.min_total_amount === undefined ? '' : String(rule.min_total_amount),
        discount_percent: String(rule.discount_percent),
        description: rule.description ?? '',
        is_active: rule.is_active,
      });
    } else {
      setEditingRule(null);
      setFormData(defaultForm);
    }

    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingRule(null);
    setFormData(defaultForm);
  };

  const handleSave = async () => {
    if (!canManage) {
      setErrorMessage('У вас немає прав на зміну правил знижок.');
      return;
    }
    setErrorMessage('');

    const minQuantity = formData.min_quantity ? Number(formData.min_quantity) : null;
    const minTotalAmount = formData.min_total_amount ? Number(formData.min_total_amount) : null;
    const discountPercent = Number(formData.discount_percent);

    if (!formData.name.trim()) {
      setErrorMessage('Вкажіть назву правила.');
      return;
    }

    if (minQuantity === null && minTotalAmount === null) {
      setErrorMessage('Вкажіть мінімальну кількість або мінімальну суму.');
      return;
    }

    if (Number.isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
      setErrorMessage('Знижка має бути у межах від 0 до 100%.');
      return;
    }

    setIsSaving(true);
    const payload = {
      name: formData.name.trim(),
      min_quantity: minQuantity,
      min_total_amount: minTotalAmount,
      discount_percent: discountPercent,
      description: formData.description.trim() || null,
      is_active: formData.is_active,
    };

    const query = editingRule
      ? supabase.from('discount_rules').update(payload).eq('id', editingRule.id)
      : supabase.from('discount_rules').insert(payload);

    const { error } = await query;
    setIsSaving(false);

    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      return;
    }

    closeDialog();
    await loadRules();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="app-page-title">Правила знижок</h1>
          <p className="app-page-subtitle">Налаштування автоматичних знижок</p>
        </div>
        {canManage ? (
          <button onClick={() => openDialog()} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Додати правило
          </button>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="app-alert-error">{errorMessage}</div>
      ) : null}

      {!canManage ? (
        <div className="app-alert-info">Режим перегляду: лише адміністратор може створювати та редагувати правила знижок.</div>
      ) : null}

      <div className="app-alert-info">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium">Як це працює</h3>
            <p className="mt-1 text-sm">
              При створенні угоди система може підібрати найкраще правило через функцію `match_discount_rule`.
            </p>
          </div>
        </div>
      </div>

      <div className="app-table-shell">
        <table className="w-full">
          <thead className="app-table-head">
            <tr>
              <th className="app-table-head-cell">Назва</th>
              <th className="app-table-head-cell">Мін. кількість</th>
              <th className="app-table-head-cell">Мін. сума</th>
              <th className="app-table-head-cell">Знижка</th>
              <th className="app-table-head-cell">Опис</th>
              <th className="app-table-head-cell">Статус</th>
              {canManage ? <th className="app-table-head-cell text-right">Дії</th> : null}
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} className="app-table-row">
                <td className="app-table-cell-strong whitespace-nowrap">{rule.name}</td>
                <td className="app-table-cell whitespace-nowrap">{rule.min_quantity ?? '-'}</td>
                <td className="app-table-cell whitespace-nowrap">{rule.min_total_amount ? `${rule.min_total_amount} грн` : '-'}</td>
                <td className="app-table-cell whitespace-nowrap app-status-positive font-semibold">{rule.discount_percent}%</td>
                <td className="app-table-cell">{rule.description || '-'}</td>
                <td className="app-table-cell whitespace-nowrap">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${rule.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {rule.is_active ? 'Активне' : 'Неактивне'}
                  </span>
                </td>
                {canManage ? (
                  <td className="app-table-cell whitespace-nowrap text-right">
                    <button onClick={() => openDialog(rule)} className="inline-flex items-center gap-2 app-status-accent hover:text-blue-800 dark:hover:text-blue-300">
                      <Pencil className="w-4 h-4" />
                      Редагувати
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="app-panel w-full max-w-xl p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">{editingRule ? 'Редагувати правило' : 'Нове правило'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} placeholder="Назва" className="app-input md:col-span-2" />
              <input value={formData.min_quantity} onChange={(event) => setFormData((current) => ({ ...current, min_quantity: event.target.value }))} type="number" min="0" step="0.01" placeholder="Мінімальна кількість" className="app-input" />
              <input value={formData.min_total_amount} onChange={(event) => setFormData((current) => ({ ...current, min_total_amount: event.target.value }))} type="number" min="0" step="0.01" placeholder="Мінімальна сума" className="app-input" />
              <input value={formData.discount_percent} onChange={(event) => setFormData((current) => ({ ...current, discount_percent: event.target.value }))} type="number" min="0" max="100" step="0.01" placeholder="Знижка %" className="app-input" />
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={formData.is_active} onChange={(event) => setFormData((current) => ({ ...current, is_active: event.target.checked }))} />
                Правило активне
              </label>
              <textarea value={formData.description} onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))} rows={3} placeholder="Опис" className="app-input md:col-span-2" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeDialog} className="app-btn-secondary flex-1">Скасувати</button>
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
