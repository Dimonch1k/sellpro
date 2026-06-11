import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import type { Buyer, DealStatus, Product } from '../../lib/types';
import { normalizeErrorMessage, toNumber, today } from '../../lib/utils';

interface DealCreatePageProps {
  onNavigate: (path: string) => void;
}

interface DealItemForm {
  product_id: string;
  quantity: string;
  unit_price: string;
  discount_percent: string;
}

interface MatchedRule {
  id: string;
  name: string;
  discount_percent: number;
  description?: string | null;
}

const emptyItem = (): DealItemForm => ({
  product_id: '',
  quantity: '1',
  unit_price: '0',
  discount_percent: '0',
});

export function DealCreatePage({ onNavigate }: DealCreatePageProps) {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [buyerId, setBuyerId] = useState('');
  const [dealDate, setDealDate] = useState(today());
  const [isWholesale, setIsWholesale] = useState(true);
  const [status, setStatus] = useState<DealStatus>('draft');
  const [note, setNote] = useState('');
  const [manualDiscount, setManualDiscount] = useState('0');
  const [items, setItems] = useState<DealItemForm[]>([emptyItem()]);
  const [matchedRule, setMatchedRule] = useState<MatchedRule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [buyersResult, productsResult] = await Promise.all([
        supabase.from('buyers').select('*').eq('is_active', true).order('company_name', { ascending: true }),
        supabase.from('products').select('*, category:product_categories(*)').eq('is_active', true).order('name', { ascending: true }),
      ]);

      if (buyersResult.error || productsResult.error) {
        setErrorMessage(normalizeErrorMessage(buyersResult.error || productsResult.error));
        setIsLoading(false);
        return;
      }

      setBuyers((buyersResult.data ?? []) as Buyer[]);
      setProducts(
        (productsResult.data ?? []).map((row: any) => ({
          ...row,
          wholesale_price: toNumber(row.wholesale_price),
          retail_price: toNumber(row.retail_price),
          stock_qty: toNumber(row.stock_qty),
          min_stock_qty: toNumber(row.min_stock_qty),
        })),
      );
      setErrorMessage('');
      setIsLoading(false);
    };

    void loadData();
  }, []);

  const enrichedItems = useMemo(() => {
    return items.map((item) => {
      const product = products.find((entry) => entry.id === item.product_id);
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unit_price) || 0;
      const discountPercent = Number(item.discount_percent) || 0;
      const subtotal = quantity * unitPrice;
      const lineTotal = subtotal * (1 - discountPercent / 100);

      return {
        ...item,
        product,
        quantity,
        unitPrice,
        discountPercent,
        lineTotal,
      };
    });
  }, [items, products]);

  const subtotal = enrichedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalQuantity = enrichedItems.reduce((sum, item) => sum + item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - (Number(manualDiscount) || 0));

  useEffect(() => {
    if (!subtotal || !totalQuantity) {
      setMatchedRule(null);
      return;
    }

    const timeout = window.setTimeout(async () => {
      const { data, error } = await supabase.rpc('match_discount_rule', {
        p_total_quantity: totalQuantity,
        p_subtotal: subtotal,
      });

      if (error) {
        return;
      }

      const rule = Array.isArray(data) ? data[0] : null;
      setMatchedRule(
        rule
          ? {
              id: rule.id,
              name: rule.name,
              discount_percent: toNumber(rule.discount_percent),
              description: rule.description,
            }
          : null,
      );
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [subtotal, totalQuantity]);

  const addItem = () => {
    setItems((current) => [...current, emptyItem()]);
  };

  const removeItem = (index: number) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateItem = (index: number, field: keyof DealItemForm, value: string) => {
    setItems((current) => {
      const next = [...current];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const applySuggestedRule = () => {
    if (!matchedRule) {
      return;
    }

    setItems((current) =>
      current.map((item) => ({
        ...item,
        discount_percent: String(matchedRule.discount_percent),
      })),
    );
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((entry) => entry.id === productId);
    updateItem(index, 'product_id', productId);
    updateItem(index, 'unit_price', String(product ? (isWholesale ? product.wholesale_price : product.retail_price) : 0));
  };

  const handleWholesaleChange = (checked: boolean) => {
    setIsWholesale(checked);
    setItems((current) =>
      current.map((item) => {
        const product = products.find((entry) => entry.id === item.product_id);
        return {
          ...item,
          unit_price: String(product ? (checked ? product.wholesale_price : product.retail_price) : item.unit_price),
        };
      }),
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    if (!buyerId) {
      setErrorMessage('Оберіть покупця.');
      return;
    }

    if (enrichedItems.length === 0 || enrichedItems.some((item) => !item.product_id)) {
      setErrorMessage('Додайте хоча б один товар і заповніть його.');
      return;
    }

    const uniqueIds = new Set(enrichedItems.map((item) => item.product_id));
    if (uniqueIds.size !== enrichedItems.length) {
      setErrorMessage('Один і той самий товар не можна додати двічі в одну угоду.');
      return;
    }

    const invalidItem = enrichedItems.find(
      (item) =>
        item.quantity <= 0 ||
        item.unitPrice < 0 ||
        item.discountPercent < 0 ||
        item.discountPercent > 100,
    );
    if (invalidItem) {
      setErrorMessage('Перевірте кількість, ціну та знижку в усіх позиціях.');
      return;
    }

    const discountAmount = Number(manualDiscount) || 0;
    if (discountAmount < 0 || discountAmount > subtotal) {
      setErrorMessage('Ручна знижка має бути від 0 до суми товарів.');
      return;
    }

    const lowStockItem =
      status === 'completed'
        ? enrichedItems.find((item) => item.product && item.product.stock_qty < item.quantity)
        : null;
    if (lowStockItem?.product) {
      setErrorMessage(`Недостатній залишок для товару "${lowStockItem.product.name}".`);
      return;
    }

    setIsSaving(true);

    const { data: dealData, error: dealError } = await supabase
      .from('deals')
      .insert({
        buyer_id: buyerId,
        deal_date: dealDate,
        is_wholesale: isWholesale,
        status: 'draft',
        discount_rule_id: matchedRule?.id ?? null,
        discount_amount: discountAmount,
        note: note.trim() || null,
      })
      .select('id')
      .single();

    if (dealError || !dealData) {
      setIsSaving(false);
      setErrorMessage(normalizeErrorMessage(dealError));
      return;
    }

    const dealId = dealData.id;
    const { error: itemsError } = await supabase.from('deal_items').insert(
      enrichedItems.map((item) => ({
        deal_id: dealId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        discount_percent: item.discountPercent,
      })),
    );

    if (itemsError) {
      await supabase.from('deals').delete().eq('id', dealId);
      setIsSaving(false);
      setErrorMessage(normalizeErrorMessage(itemsError));
      return;
    }

    if (status !== 'draft') {
      const { error: statusError } = await supabase.from('deals').update({ status }).eq('id', dealId);
      if (statusError) {
        setIsSaving(false);
        setErrorMessage(normalizeErrorMessage(statusError));
        return;
      }
    }

    setIsSaving(false);
    onNavigate('/dashboard/deals');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="app-page-title">Створити угоду</h1>
        <p className="app-page-subtitle">Оформлення нової угоди з покупцем</p>
      </div>

      {errorMessage ? (
        <div className="app-alert-error">{errorMessage}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="app-panel p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Основна інформація</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={buyerId} onChange={(event) => setBuyerId(event.target.value)} className="app-input">
              <option value="">Оберіть покупця</option>
              {buyers.map((buyer) => (
                <option key={buyer.id} value={buyer.id}>
                  {buyer.company_name}
                </option>
              ))}
            </select>

            <input type="date" value={dealDate} onChange={(event) => setDealDate(event.target.value)} className="app-input" />

            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input type="checkbox" checked={isWholesale} onChange={(event) => handleWholesaleChange(event.target.checked)} />
              Гуртовий продаж
            </label>

            <select value={status} onChange={(event) => setStatus(event.target.value as DealStatus)} className="app-input">
              <option value="draft">Чернетка</option>
              <option value="completed">Завершено</option>
              <option value="cancelled">Скасовано</option>
            </select>

            <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Примітки" className="app-input md:col-span-2" />
          </div>
        </div>

        <div className="app-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Товари</h2>
            <button type="button" onClick={addItem} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Додати товар
            </button>
          </div>

          {matchedRule ? (
            <div className="app-alert-info mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{matchedRule.name}</p>
                <p className="text-sm">
                  Рекомендована знижка: {matchedRule.discount_percent}% {matchedRule.description ? `- ${matchedRule.description}` : ''}
                </p>
              </div>
              <button type="button" onClick={applySuggestedRule} className="app-btn-secondary px-3 py-2 text-sm">
                Застосувати
              </button>
            </div>
          ) : null}

          <div className="space-y-4">
            {enrichedItems.map((item, index) => (
              <div key={index} className="app-panel-muted grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-6 md:items-end">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Товар</label>
                  <select value={item.product_id} onChange={(event) => handleProductChange(index, event.target.value)} className="app-input">
                    <option value="">Оберіть товар</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Кількість</label>
                  <input value={item.quantity} onChange={(event) => updateItem(index, 'quantity', event.target.value)} type="number" min="0.01" step="0.01" className="app-input" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Ціна</label>
                  <input value={item.unit_price} onChange={(event) => updateItem(index, 'unit_price', event.target.value)} type="number" min="0" step="0.01" className="app-input" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Знижка %</label>
                  <input value={item.discount_percent} onChange={(event) => updateItem(index, 'discount_percent', event.target.value)} type="number" min="0" max="100" step="0.01" className="app-input" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Сума</label>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">{formatCurrency(item.lineTotal)}</div>
                  </div>
                  <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 disabled:opacity-40">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="app-panel p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Підсумок</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Підсумок товарів</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Ручна знижка</span>
              <input value={manualDiscount} onChange={(event) => setManualDiscount(event.target.value)} type="number" min="0" step="0.01" className="app-input w-32 py-1 text-right" />
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">До оплати</span>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button type="button" onClick={() => onNavigate('/dashboard/deals')} className="app-btn-secondary px-6 py-2">Скасувати</button>
          <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
            {isSaving ? 'Збереження...' : 'Зберегти угоду'}
          </button>
        </div>
      </form>
    </div>
  );
}
