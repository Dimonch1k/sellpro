import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import type { Product } from '../../lib/types';

const mockProducts: Product[] = [
  {
    id: '1',
    category_id: '1',
    name: 'Цемент М500',
    sku: 'CEM-500',
    wholesale_price: 185,
    retail_price: 220,
    unit: 'мішок',
    stock_qty: 450,
    min_stock_qty: 100,
    is_active: true,
    description: 'Портландцемент М500',
    category: { id: '1', name: 'Цемент', slug: 'cement' },
  },
  {
    id: '2',
    category_id: '2',
    name: 'Цегла червона',
    sku: 'BRI-RED',
    wholesale_price: 8.5,
    retail_price: 11,
    unit: 'шт',
    stock_qty: 12500,
    min_stock_qty: 5000,
    is_active: true,
    category: { id: '2', name: 'Цегла', slug: 'brick' },
  },
  {
    id: '3',
    category_id: '3',
    name: 'Арматура 12мм',
    sku: 'ARM-12',
    wholesale_price: 22,
    retail_price: 28,
    unit: 'м',
    stock_qty: 850,
    min_stock_qty: 500,
    is_active: true,
    category: { id: '3', name: 'Арматура', slug: 'rebar' },
  },
  {
    id: '4',
    category_id: '1',
    name: 'Пісок будівельний',
    sku: 'SND-BLD',
    wholesale_price: 450,
    retail_price: 550,
    unit: 'тонна',
    stock_qty: 45,
    min_stock_qty: 50,
    is_active: true,
    category: { id: '1', name: 'Сипучі матеріали', slug: 'bulk' },
  },
];

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Товари</h1>
          <p className="text-gray-600 mt-1">Управління асортиментом та залишками</p>
        </div>
        <button
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Додати товар
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Пошук за назвою або артикулом..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            Фільтри
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категорія
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Всі категорії</option>
                <option value="cement">Цемент</option>
                <option value="brick">Цегла</option>
                <option value="rebar">Арматура</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Всі статуси</option>
                <option value="active">Активний</option>
                <option value="inactive">Неактивний</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Залишок
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Всі товари</option>
                <option value="low">Низький залишок</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Назва
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Артикул
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категорія
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Гуртова ціна
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роздрібна ціна
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Залишок
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(product.wholesale_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(product.retail_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm ${
                        product.stock_qty <= product.min_stock_qty
                          ? 'text-red-600 font-medium'
                          : 'text-gray-900'
                      }`}
                    >
                      {product.stock_qty} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.is_active ? 'Активний' : 'Неактивний'}
                    </span>
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
