import { User, Phone, Mail, Shield } from 'lucide-react';
import { USER_ROLE_LABELS } from '../../lib/constants';
import type { UserRole } from '../../lib/types';

const mockProfile = {
  full_name: 'Іван Петренко',
  phone: '+380 67 123 45 67',
  email: 'ivan.petrenko@example.com',
  role: 'manager' as UserRole,
  avatar_url: '',
};

export function ProfilePage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Профіль користувача</h1>
        <p className="text-gray-600 mt-1">Керування особистою інформацією</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {mockProfile.full_name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{mockProfile.full_name}</h2>
            <p className="text-gray-600">{mockProfile.email}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Shield className="w-4 h-4 mr-1" />
                {USER_ROLE_LABELS[mockProfile.role]}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Особиста інформація</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Повне ім'я
                </div>
              </label>
              <input
                type="text"
                defaultValue={mockProfile.full_name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Телефон
                </div>
              </label>
              <input
                type="tel"
                defaultValue={mockProfile.phone}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </label>
              <input
                type="email"
                defaultValue={mockProfile.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Email не можна змінити</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Роль
                </div>
              </label>
              <input
                type="text"
                value={USER_ROLE_LABELS[mockProfile.role]}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Роль може змінити лише адміністратор</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Зберегти зміни
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Скасувати
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Зміна паролю</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Поточний пароль
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Новий пароль
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Підтвердження нового паролю
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Змінити пароль
          </button>
        </div>
      </div>
    </div>
  );
}
