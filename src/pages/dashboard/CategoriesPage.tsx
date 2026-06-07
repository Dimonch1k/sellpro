import { useState } from 'react';
import { Plus, Pencil, FolderTree } from 'lucide-react';
import { EmptyState } from '../../components/shared/EmptyState';
import type { ProductCategory } from '../../lib/types';

const mockCategories: ProductCategory[] = [
  { id: '1', name: 'Цемент', slug: 'cement', description: 'Різні види цементу' },
  { id: '2', name: 'Цегла', slug: 'brick', description: 'Будівельна та облицювальна цегла' },
  { id: '3', name: 'Арматура', slug: 'rebar', description: 'Металева арматура різних діаметрів' },
  { id: '4', name: 'Сипучі матеріали', slug: 'bulk', description: 'Пісок, щебінь, відсів' },
];

export function CategoriesPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setShowDialog(true);
  };

  const handleNew = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
    setShowDialog(true);
  };

  const handleSave = () => {
    // TODO: Implement Supabase save
    setShowDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Категорії товарів</h1>
          <p className="text-gray-600 mt-1">Управління категоріями продукції</p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Додати категорію
        </button>
      </div>

      {mockCategories.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <EmptyState
            icon={FolderTree}
            title="Немає категорій"
            description="Почніть з створення першої категорії товарів"
            action={{ label: 'Додати категорію', onClick: handleNew }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FolderTree className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              {category.description && (
                <p className="text-sm text-gray-600">{category.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Редагувати категорію' : 'Нова категорія'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Назва <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Опис
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Скасувати
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Зберегти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
