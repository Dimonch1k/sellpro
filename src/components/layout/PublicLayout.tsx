import { ReactNode } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
  onNavigate: (page: string) => void;
}

export function PublicLayout({ children, onNavigate }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => onNavigate('home')} className="text-2xl font-bold text-gray-900">
              ПродажPro
            </button>
            <nav className="flex items-center gap-4">
              <button onClick={() => onNavigate('about')} className="text-gray-600 hover:text-gray-900">
                Про нас
              </button>
              <button onClick={() => onNavigate('contact')} className="text-gray-600 hover:text-gray-900">
                Контакти
              </button>
              <button
                onClick={() => onNavigate('signin')}
                className="text-gray-600 hover:text-gray-900 px-4 py-2"
              >
                Увійти
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Почати роботу
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
