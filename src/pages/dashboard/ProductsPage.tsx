import { useEffect, useMemo, useState } from 'react';
import { Filter, Pencil, Plus, Search } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import type { Product, ProductCategory } from '../../lib/types';
import { normalizeErrorMessage, toNumber } from '../../lib/utils';
import { UNITS } from '../../lib/constants';

type ProductForm = {
  category_id: string;
  name: string;
  sku: string;
  wholesale_price: string;
  retail_price: string;
  description: string;
  unit: string;
  stock_qty: string;
  min_stock_qty: string;
  image_url: string;
  is_active: boolean;
};

const defaultForm: ProductForm = {
  category_id: '',
  name: '',
  sku: '',
  wholesale_price: '',
  retail_price: '',
  description: '',
  unit: 'шт.',
  stock_qty: '0',
  min_stock_qty: '0',
  image_url: '',
  is_active: true,
};

interface ProductsPageProps {
  canManage: boolean;
}

export function ProductsPage({ canManage }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductForm>(defaultForm);

  const loadData = async () => {
    setIsLoading(true);
    const [productsResult, categoriesResult] = await Promise.all([
      supabase
        .from('products')
        .select('*, category:product_categories(*)')
        .order('created_at', { ascending: false }),
      supabase.from('product_categories').select('*').order('name', { ascending: true }),
    ]);

    if (productsResult.error || categoriesResult.error) {
      setErrorMessage(normalizeErrorMessage(productsResult.error || categoriesResult.error));
      setIsLoading(false);
      return;
    }

    setProducts(
      (productsResult.data ?? []).map((row) => ({
        ...row,
        wholesale_price: toNumber(row.wholesale_price),
        retail_price: toNumber(row.retail_price),
        stock_qty: toNumber(row.stock_qty),
        min_stock_qty: toNumber(row.min_stock_qty),
      })) as Product[],
    );
    setCategories((categoriesResult.data ?? []) as ProductCategory[]);
    setErrorMessage('');
    setIsLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.sku ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
        const matchesStatus =
          !selectedStatus ||
          (selectedStatus === 'active' ? product.is_active : !product.is_active);
        const matchesStock =
          !stockFilter ||
          (stockFilter === 'low' ? product.stock_qty <= product.min_stock_qty : product.stock_qty > product.min_stock_qty);

        return matchesSearch && matchesCategory && matchesStatus && matchesStock;
      }),
    [products, searchTerm, selectedCategory, selectedStatus, stockFilter],
  );

  const openNewDialog = () => {
    if (!canManage) {
      return;
    }
    setEditingProduct(null);
    setFormData(defaultForm);
    setShowDialog(true);
  };

  const openEditDialog = (product: Product) => {
    if (!canManage) {
      return;
    }
    setEditingProduct(product);
    setFormData({
      category_id: product.category_id ?? '',
      name: product.name,
      sku: product.sku ?? '',
      wholesale_price: String(product.wholesale_price),
      retail_price: String(product.retail_price),
      description: product.description ?? '',
      unit: product.unit,
      stock_qty: String(product.stock_qty),
      min_stock_qty: String(product.min_stock_qty),
      image_url: product.image_url ?? '',
      is_active: product.is_active,
    });
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingProduct(null);
    setFormData(defaultForm);
  };

  const handleSave = async () => {
    if (!canManage) {
      setErrorMessage('У вас немає прав на зміну товарів.');
      return;
    }
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Вкажіть назву товару.');
      return;
    }

    const wholesale = Number(formData.wholesale_price);
    const retail = Number(formData.retail_price);
    const stockQty = Number(formData.stock_qty);
    const minStockQty = Number(formData.min_stock_qty);

    if (Number.isNaN(wholesale) || wholesale < 0) {
      setErrorMessage('Гуртова ціна має бути невід’ємним числом.');
      return;
    }

    if (Number.isNaN(retail) || retail < wholesale) {
      setErrorMessage('Роздрібна ціна має бути не меншою за гуртову.');
      return;
    }

    if (Number.isNaN(stockQty) || stockQty < 0 || Number.isNaN(minStockQty) || minStockQty < 0) {
      setErrorMessage('Залишок і мінімальний залишок мають бути невід’ємними числами.');
      return;
    }

    setIsSaving(true);
    const payload = {
      category_id: formData.category_id || null,
      name: formData.name.trim(),
      sku: formData.sku.trim() || null,
      wholesale_price: wholesale,
      retail_price: retail,
      description: formData.description.trim() || null,
      unit: formData.unit.trim(),
      stock_qty: stockQty,
      min_stock_qty: minStockQty,
      image_url: formData.image_url.trim() || null,
      is_active: formData.is_active,
    };

    const query = editingProduct
      ? supabase.from('products').update(payload).eq('id', editingProduct.id)
      : supabase.from('products').insert(payload);

    const { error } = await query;
    setIsSaving(false);

    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      return;
    }

    closeDialog();
    await loadData();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="app-page-title">Товари</h1>
          <p className="app-page-subtitle">Управління асортиментом та залишками</p>
        </div>
        {canManage ? (
          <button onClick={openNewDialog} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Додати товар
          </button>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="app-alert-error">{errorMessage}</div>
      ) : null}

      {!canManage ? (
        <div className="app-alert-info">Режим перегляду: ця роль може лише переглядати товари без створення та редагування.</div>
      ) : null}

      <div className="app-panel p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Пошук за назвою або артикулом..."
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
            <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="app-input">
              <option value="">Всі категорії</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} className="app-input">
              <option value="">Всі статуси</option>
              <option value="active">Активний</option>
              <option value="inactive">Неактивний</option>
            </select>
            <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)} className="app-input">
              <option value="">Весь склад</option>
              <option value="low">Низький залишок</option>
              <option value="normal">Нормальний залишок</option>
            </select>
          </div>
        ) : null}
      </div>

      <div className="app-table-shell">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="app-table-head">
              <tr>
                <th className="app-table-head-cell">Назва</th>
                <th className="app-table-head-cell">Артикул</th>
                <th className="app-table-head-cell">Категорія</th>
                <th className="app-table-head-cell">Гурт</th>
                <th className="app-table-head-cell">Роздріб</th>
                <th className="app-table-head-cell">Залишок</th>
                <th className="app-table-head-cell">Статус</th>
                {canManage ? <th className="app-table-head-cell text-right">Дії</th> : null}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="app-table-row">
                  <td className="app-table-cell-strong whitespace-nowrap">{product.name}</td>
                  <td className="app-table-cell whitespace-nowrap">{product.sku || '-'}</td>
                  <td className="app-table-cell whitespace-nowrap">{product.category?.name || '-'}</td>
                  <td className="app-table-cell-strong whitespace-nowrap">{formatCurrency(product.wholesale_price)}</td>
                  <td className="app-table-cell-strong whitespace-nowrap">{formatCurrency(product.retail_price)}</td>
                  <td className="app-table-cell whitespace-nowrap">
                    <span className={product.stock_qty <= product.min_stock_qty ? 'app-status-negative font-medium' : 'text-slate-900 dark:text-slate-100'}>
                      {product.stock_qty} {product.unit}
                    </span>
                  </td>
                  <td className="app-table-cell whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {product.is_active ? 'Активний' : 'Неактивний'}
                    </span>
                  </td>
                  {canManage ? (
                    <td className="app-table-cell whitespace-nowrap text-right">
                      <button onClick={() => openEditDialog(product)} className="inline-flex items-center gap-2 app-status-accent hover:text-blue-800 dark:hover:text-blue-300">
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
      </div>

      {showDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="app-panel w-full max-w-2xl p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              {editingProduct ? 'Редагувати товар' : 'Новий товар'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} placeholder="Назва" className="app-input" />
              <input value={formData.sku} onChange={(event) => setFormData((current) => ({ ...current, sku: event.target.value }))} placeholder="Артикул" className="app-input" />
              <select value={formData.category_id} onChange={(event) => setFormData((current) => ({ ...current, category_id: event.target.value }))} className="app-input">
                <option value="">Без категорії</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select value={formData.unit} onChange={(event) => setFormData((current) => ({ ...current, unit: event.target.value }))} className="app-input">
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <input value={formData.wholesale_price} onChange={(event) => setFormData((current) => ({ ...current, wholesale_price: event.target.value }))} type="number" min="0" step="0.01" placeholder="Гуртова ціна" className="app-input" />
              <input value={formData.retail_price} onChange={(event) => setFormData((current) => ({ ...current, retail_price: event.target.value }))} type="number" min="0" step="0.01" placeholder="Роздрібна ціна" className="app-input" />
              <input value={formData.stock_qty} onChange={(event) => setFormData((current) => ({ ...current, stock_qty: event.target.value }))} type="number" min="0" step="0.01" placeholder="Залишок" className="app-input" />
              <input value={formData.min_stock_qty} onChange={(event) => setFormData((current) => ({ ...current, min_stock_qty: event.target.value }))} type="number" min="0" step="0.01" placeholder="Мінімальний залишок" className="app-input" />
              <input value={formData.image_url} onChange={(event) => setFormData((current) => ({ ...current, image_url: event.target.value }))} placeholder="URL зображення" className="app-input md:col-span-2" />
              <textarea value={formData.description} onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))} rows={3} placeholder="Опис" className="app-input md:col-span-2" />
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 md:col-span-2">
                <input type="checkbox" checked={formData.is_active} onChange={(event) => setFormData((current) => ({ ...current, is_active: event.target.checked }))} />
                Активний товар
              </label>
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
