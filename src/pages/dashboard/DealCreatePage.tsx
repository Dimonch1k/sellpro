import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';

interface DealItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  line_total: number;
}

interface DealCreatePageProps {
  onNavigate: (page: string) => void;
}

export function DealCreatePage({ onNavigate }: DealCreatePageProps) {
  const [buyerId, setBuyerId] = useState('');
  const [dealDate, setDealDate] = useState(new Date().toISOString().split('T')[0]);
  const [isWholesale, setIsWholesale] = useState(true);
  const [status, setStatus] = useState<'draft' | 'completed'>('draft');
  const [note, setNote] = useState('');
  const [manualDiscount, setManualDiscount] = useState(0);
  const [items, setItems] = useState<DealItem[]>([]);

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: '',
        product_name: '',
        quantity: 1,
        unit_price: 0,
        discount_percent: 0,
        line_total: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof DealItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'unit_price' || field === 'discount_percent') {
      const item = newItems[index];
      const subtotal = item.quantity * item.unit_price;
      const discount = (subtotal * item.discount_percent) / 100;
      item.line_total = subtotal - discount;
    }

    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.line_total, 0);
  const finalTotal = subtotal - manualDiscount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase save
    onNavigate('deals');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Створити угоду</h1>
        <p className="text-gray-600 mt-1">Оформлення нової угоди з покупцем</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Основна інформація</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Покупець <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={buyerId}
                onChange={(e) => setBuyerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Оберіть покупця</option>
                <option value="1">ТОВ "Будматеріали"</option>
                <option value="2">ФОП Коваленко</option>
                <option value="3">ПрАТ "Торгбуд"</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата угоди <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={dealDate}
                onChange={(e) => setDealDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isWholesale}
                  onChange={(e) => setIsWholesale(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Гуртовий продаж</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'completed')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Чернетка</option>
                <option value="completed">Завершено</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Примітки
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Товари</h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Додати товар
            </button>
          </div>

          {status === 'completed' && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                При збереженні угоди зі статусом "Завершено" залишки товарів на складі будуть автоматично зменшені.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 items-end p-4 border border-gray-200 rounded-lg">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Товар
                  </label>
                  <select
                    value={item.product_id}
                    onChange={(e) => {
                      updateItem(index, 'product_id', e.target.value);
                      const selectedProduct = e.target.options[e.target.selectedIndex];
                      updateItem(index, 'product_name', selectedProduct.text);
                      const price = isWholesale ? 185 : 220;
                      updateItem(index, 'unit_price', price);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Оберіть товар</option>
                    <option value="1">Цемент М500</option>
                    <option value="2">Цегла червона</option>
                    <option value="3">Арматура 12мм</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Кількість
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ціна
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Знижка %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={item.discount_percent}
                    onChange={(e) => updateItem(index, 'discount_percent', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Сума
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium">
                      {formatCurrency(item.line_total)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Підсумок</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Підсумок:</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Знижка:</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={manualDiscount}
                onChange={(e) => setManualDiscount(parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              />
            </div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">До оплати:</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => onNavigate('deals')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Скасувати
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Зберегти угоду
          </button>
        </div>
      </form>
    </div>
  );
}
