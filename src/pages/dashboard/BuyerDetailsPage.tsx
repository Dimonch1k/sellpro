import { Mail, Phone, MapPin, FileText, User } from 'lucide-react';
import { formatCurrency, formatShortDate } from '../../lib/formatters';
import { StatusBadge } from '../../components/shared/StatusBadge';
import type { DealStatus } from '../../lib/types';

interface BuyerDeal {
  id: string;
  deal_no: string;
  deal_date: string;
  status: DealStatus;
  total_amount: number;
  paid_amount: number;
  debt_amount: number;
}

const mockBuyer = {
  id: '1',
  company_name: 'ТОВ "Будматеріали Плюс"',
  phone: '+380 44 123 45 67',
  email: 'info@budmat.ua',
  contact_person: 'Петренко Іван Васильович',
  address: 'м. Київ, вул. Будівельників, 15',
  tax_code: '12345678',
  notes: 'Постійний клієнт з 2020 року. Гуртові закупівлі.',
  is_active: true,
};

const mockDeals: BuyerDeal[] = [
  {
    id: '1',
    deal_no: 'УГ-2024-001',
    deal_date: '2024-05-20',
    status: 'completed',
    total_amount: 45000,
    paid_amount: 45000,
    debt_amount: 0,
  },
  {
    id: '2',
    deal_no: 'УГ-2024-015',
    deal_date: '2024-04-15',
    status: 'completed',
    total_amount: 38500,
    paid_amount: 38500,
    debt_amount: 0,
  },
  {
    id: '3',
    deal_no: 'УГ-2024-028',
    deal_date: '2024-03-10',
    status: 'completed',
    total_amount: 52000,
    paid_amount: 50000,
    debt_amount: 2000,
  },
];

export function BuyerDetailsPage() {

  const totalRevenue = mockDeals.reduce((sum, deal) => sum + deal.total_amount, 0);
  const totalDebt = mockDeals.reduce((sum, deal) => sum + deal.debt_amount, 0);
  const dealsCount = mockDeals.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{mockBuyer.company_name}</h1>
        <p className="text-gray-600 mt-1">Детальна інформація про покупця</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Контактна інформація</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Контактна особа</p>
                  <p className="text-gray-900 font-medium">{mockBuyer.contact_person}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Телефон</p>
                  <p className="text-gray-900 font-medium">{mockBuyer.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900 font-medium">{mockBuyer.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Адреса</p>
                  <p className="text-gray-900 font-medium">{mockBuyer.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">ЄДРПОУ</p>
                  <p className="text-gray-900 font-medium">{mockBuyer.tax_code}</p>
                </div>
              </div>
            </div>

            {mockBuyer.notes && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">Примітки</p>
                <p className="text-gray-900">{mockBuyer.notes}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Історія угод</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Номер
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Сума
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Оплачено
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Борг
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {deal.deal_no}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatShortDate(deal.deal_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(deal.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(deal.paid_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={deal.debt_amount > 0 ? 'text-red-600' : 'text-gray-900'}>
                          {formatCurrency(deal.debt_amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={deal.status} type="deal" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Загальний дохід</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalRevenue)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Кількість угод</p>
                <p className="text-2xl font-bold text-gray-900">{dealsCount}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Поточний борг</p>
                <p className={`text-2xl font-bold ${totalDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(totalDebt)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Статус</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    mockBuyer.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {mockBuyer.is_active ? 'Активний' : 'Неактивний'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-3">
              Редагувати
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              {mockBuyer.is_active ? 'Деактивувати' : 'Активувати'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
