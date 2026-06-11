import { useEffect, useState } from 'react';
import { FolderTree, Pencil, Plus, Trash2 } from 'lucide-react';
import { EmptyState } from '../../components/shared/EmptyState';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import type { ProductCategory } from '../../lib/types';
import { normalizeErrorMessage, slugify } from '../../lib/utils';

const defaultForm = {
  name: '',
  slug: '',
  description: '',
};

interface CategoriesPageProps {
  canManage: boolean;
}

export function CategoriesPage({ canManage }: CategoriesPageProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      setIsLoading(false);
      return;
    }

    setCategories((data ?? []) as ProductCategory[]);
    setErrorMessage('');
    setIsLoading(false);
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const handleEdit = (category: ProductCategory) => {
    if (!canManage) {
      return;
    }
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
    });
    setShowDialog(true);
  };

  const handleNew = () => {
    if (!canManage) {
      return;
    }
    setEditingCategory(null);
    setFormData(defaultForm);
    setShowDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
    setEditingCategory(null);
    setFormData(defaultForm);
  };

  const handleSave = async () => {
    if (!canManage) {
      setErrorMessage('У вас немає прав на зміну категорій.');
      return;
    }
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Вкажіть назву категорії.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      slug: slugify(formData.slug || formData.name),
      description: formData.description.trim() || null,
    };

    if (!payload.slug) {
      setErrorMessage('Slug не може бути порожнім.');
      return;
    }

    setIsSaving(true);
    const query = editingCategory
      ? supabase.from('product_categories').update(payload).eq('id', editingCategory.id)
      : supabase.from('product_categories').insert(payload);

    const { error } = await query;
    setIsSaving(false);

    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      return;
    }

    handleClose();
    await loadCategories();
  };

  const handleDelete = async (category: ProductCategory) => {
    if (!canManage) {
      setErrorMessage('У вас немає прав на видалення категорій.');
      return;
    }
    const confirmed = window.confirm(`Видалити категорію "${category.name}"?`);
    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from('product_categories').delete().eq('id', category.id);
    if (error) {
      setErrorMessage(normalizeErrorMessage(error));
      return;
    }

    await loadCategories();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="app-page-title">Категорії товарів</h1>
          <p className="app-page-subtitle">Управління категоріями продукції</p>
        </div>
        {canManage ? (
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Додати категорію
          </button>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="app-alert-error">
          {errorMessage}
        </div>
      ) : null}

      {!canManage ? (
        <div className="app-alert-info">Режим перегляду: ця роль може лише переглядати категорії.</div>
      ) : null}

      {categories.length === 0 ? (
        <div className="app-panel p-6">
          <EmptyState
            icon={FolderTree}
            title="Немає категорій"
            description="Почніть зі створення першої категорії товарів."
            action={canManage ? { label: 'Додати категорію', onClick: handleNew } : undefined}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="app-panel p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950/50">
                    <FolderTree className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{category.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{category.slug}</p>
                  </div>
                </div>
                {canManage ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(category)} className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(category)} className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{category.description || 'Без опису'}</p>
            </div>
          ))}
        </div>
      )}

      {showDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="app-panel w-full max-w-md p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              {editingCategory ? 'Редагувати категорію' : 'Нова категорія'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Назва</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => {
                    const name = event.target.value;
                    setFormData((current) => ({
                      ...current,
                      name,
                      slug: current.slug ? current.slug : slugify(name),
                    }));
                  }}
                  className="app-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(event) => setFormData((current) => ({ ...current, slug: event.target.value }))}
                  className="app-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Опис</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                  className="app-input"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleClose} className="app-btn-secondary flex-1">
                Скасувати
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {isSaving ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
