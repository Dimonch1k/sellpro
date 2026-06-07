import { Mail, Phone, MapPin } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Контакти</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <Mail className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
          <p className="text-gray-600">info@prodazhpro.ua</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <Phone className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Телефон</h3>
          <p className="text-gray-600">+380 XX XXX XX XX</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <MapPin className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Адреса</h3>
          <p className="text-gray-600">Київ, Україна</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Напишіть нам</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ім'я
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Повідомлення
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Відправити
          </button>
        </form>
      </div>
    </div>
  );
}
