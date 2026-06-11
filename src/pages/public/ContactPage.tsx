import { Mail, Phone, MapPin } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-6 text-4xl font-bold text-slate-900 dark:text-slate-100">Контакти</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="app-panel p-6">
          <Mail className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">Email</h3>
          <p className="text-slate-600 dark:text-slate-300">info@prodazhpro.ua</p>
        </div>

        <div className="app-panel p-6">
          <Phone className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">Телефон</h3>
          <p className="text-slate-600 dark:text-slate-300">+380 XX XXX XX XX</p>
        </div>

        <div className="app-panel p-6">
          <MapPin className="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">Адреса</h3>
          <p className="text-slate-600 dark:text-slate-300">Київ, Україна</p>
        </div>
      </div>

      <div className="app-panel p-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Напишіть нам</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Ім'я
            </label>
            <input id="name" type="text" className="app-input px-4" />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input id="email" type="email" className="app-input px-4" />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Повідомлення
            </label>
            <textarea id="message" rows={5} className="app-input px-4 py-2"></textarea>
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
