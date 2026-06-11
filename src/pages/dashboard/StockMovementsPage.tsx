import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { formatDateTime } from '../../lib/formatters';
import { MOVEMENT_TYPE_LABELS } from '../../lib/constants';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import type { MovementType } from '../../lib/types';
import { normalizeErrorMessage, toNumber } from '../../lib/utils';

interface StockMovementRow {
  id: string;
  created_at: string;
  product_name: string;
  movement_type: MovementType;
  quantity_delta: number;
  unit: string;
  reason?: string | null;
}

interface ProductOption {
  id: string;
  name: string;
  unit: string;
}

const defaultForm = {
  product_id: '',
  movement_type: 'income' as MovementType,
  quantity_delta: '',
  reason: '',
};

interface StockMovementsPageProps {
  canManage: boolean;
}

export function StockMovementsPage({ canManage }: StockMovementsPageProps) {
  const [movements, setMovements] = useState<StockMovementRow[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const [movementsResult, productsResult] = await Promise.all([
      supabase
        .from('stock_movements')
        .select('id, created_at, movement_type, quantity_delta, reason, product:products(name, unit)')
        .order('created_at', { ascending: false }),
      supabase.from('products').select('id, name, unit').eq('is_active', true).order('name', { ascending: true }),
    ]);

    if (movementsResult.error || productsResult.error) {
      setErrorMessage(normalizeErrorMessage(movementsResult.error || productsResult.error));
      setIsLoading(false);
      return;
    }

    setMovements(
      (movementsResult.data ?? []).map((row: any) => ({
        id: row.id,
        created_at: row.created_at,
        product_name: row.product?.name ?? 'Невідомий товар',
        movement_type: row.movement_type,
        quantity_delta: toNumber(row.quantity_delta),
        unit: row.product?.unit ?? 'шт.',
        reason: row.reason,
      })),
    );
    setProducts((productsResult.data ?? []) as ProductOption[]);
    setErrorMessage('');
    setIsLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleSave = async () => {
    if (!canManage) {
      setErrorMessage('У вас немає прав на створення складських операцій.');
      return;
    }
    setErrorMessage('');

    const quantityDelta = Number(formData.quantity_delta);

    if (!formData.product_id) {
      setErrorMessage('Оберіть товар.');
      return;
    }

    if (Number.isNaN(quantityDelta) || quantityDelta === 0) {
      setErrorMessage('Кількість має бути числом і не дорівнювати нулю.');
      return;
    }

    if (formData.movement_type !== 'correction' && formData.movement_type !== 'write_off' && quantityDelta < 0) {
      setErrorMessage('Для цього типу операції вкажіть додатне значення кількості.');
      return;
    }

    const normalizedQuantity =
      formData.movement_type === 'write_off'
        ? -Math.abs(quantityDelta)
        : formData.movement_type === 'sale'
        ? -Math.abs(quantityDelta)
        : quantityDelta;

    setIsSaving(true);
    const { error } = await supabase.from('stock_movements').insert({
      product_id: formData.product_id,
      movement_type: formData.movement_type,
      quantity_delta: normalizedQuantity,
      reason: formData.reason.trim() || null,
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
          <h1 className="app-page-title">Складські операції</h1>
          <p className="app-page-subtitle">Історія руху товарів на складі</p>
        </div>
        {canManage ? (
          <button onClick={() => setShowDialog(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Додати операцію
          </button>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="app-alert-error">{errorMessage}</div>
      ) : null}

      {!canManage ? (
        <div className="app-alert-info">Режим перегляду: лише адміністратор і менеджер можуть створювати складські операції.</div>
      ) : null}

      <div className="app-alert-warning">
        <h3 className="mb-2 font-medium">Важливо</h3>
        <ul className="space-y-1 text-sm">
          <li>Продажі створюються автоматично при завершенні угод.</li>
          <li>Для `write_off` система сама запише від’ємну кількість.</li>
          <li>Для `correction` можна вказувати як додатне, так і від’ємне число.</li>
        </ul>
      </div>

      <div className="app-table-shell">
        <table className="w-full">
          <thead className="app-table-head">
            <tr>
              <th className="app-table-head-cell">Дата</th>
              <th className="app-table-head-cell">Товар</th>
              <th className="app-table-head-cell">Тип</th>
              <th className="app-table-head-cell">Кількість</th>
              <th className="app-table-head-cell">Причина</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id} className="app-table-row">
                <td className="app-table-cell whitespace-nowrap">{formatDateTime(movement.created_at)}</td>
                <td className="app-table-cell-strong whitespace-nowrap">{movement.product_name}</td>
                <td className="app-table-cell whitespace-nowrap">{MOVEMENT_TYPE_LABELS[movement.movement_type]}</td>
                <td className={`app-table-cell whitespace-nowrap font-medium ${movement.quantity_delta > 0 ? 'app-status-positive' : 'app-status-negative'}`}>
                  {movement.quantity_delta > 0 ? '+' : ''}
                  {movement.quantity_delta} {movement.unit}
                </td>
                <td className="app-table-cell">{movement.reason || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="app-panel w-full max-w-lg p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Нова складська операція</h2>
            <div className="space-y-4">
              <select value={formData.product_id} onChange={(event) => setFormData((current) => ({ ...current, product_id: event.target.value }))} className="app-input">
                <option value="">Оберіть товар</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <select value={formData.movement_type} onChange={(event) => setFormData((current) => ({ ...current, movement_type: event.target.value as MovementType }))} className="app-input">
                {(['income', 'return', 'write_off', 'correction'] as MovementType[]).map((type) => (
                  <option key={type} value={type}>
                    {MOVEMENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
              <input value={formData.quantity_delta} onChange={(event) => setFormData((current) => ({ ...current, quantity_delta: event.target.value }))} type="number" step="0.01" placeholder="Кількість" className="app-input" />
              <textarea value={formData.reason} onChange={(event) => setFormData((current) => ({ ...current, reason: event.target.value }))} rows={3} placeholder="Причина" className="app-input" />
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
