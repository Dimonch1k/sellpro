import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Buyer } from '../../lib/types';

const mockBuyers: Buyer[] = [
  {
    id: '1',
    company_name: 'ТОВ "Будматеріали Плюс"',
    phone: '+380 44 123 45 67',
    email: 'info@budmat.ua',
    contact_person: 'Петренко Іван Васильович',
    address: 'м. Київ, вул. Будівельників, 15',
    tax_code: '12345678',
    is_active: true,
  },
  {
    id: '2',
    company_name: 'ФОП Коваленко О.М.',
    phone: '+380 67 234 56 78',
    email: 'kovalenko@gmail.com',
    contact_person: 'Коваленко Олексій Миколайович',
    address: 'м. Львів, вул. Шевченка, 42',
    is_active: true,
  },
  {
    id: '3',
    company_name: 'ПрАТ "Торгбуд"',
    phone: '+380 50 345 67 89',
    email: 'office@torgbud.com.ua',
    contact_person: 'Сидоренко Марія Петрівна',
    address: 'м. Харків, пр. Науки, 78',
    tax_code: '87654321',
    is_active: true,
  },
  {
    id: '4',
    company_name: 'ТОВ "Епіцентр"',
    phone: '+380 93 456 78 90',
    email: 'epicentr@example.com',
    contact_person: 'Мельник Андрій Степанович',
    address: 'м. Дніпро, вул. Робоча, 23',
    is_active: false,
  },
];

export function BuyersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBuyers = mockBuyers.filter(
    (buyer) =>
      buyer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Покупці</h1>
          <p className="text-gray-600 mt-1">База клієнтів та контактна інформація</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Додати покупця
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук за назвою, контактною особою або телефоном..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Назва компанії
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Контактна особа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Телефон
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Адреса
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBuyers.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {buyer.company_name}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {buyer.contact_person}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {buyer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {buyer.email || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {buyer.address || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        buyer.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {buyer.is_active ? 'Активний' : 'Неактивний'}
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
