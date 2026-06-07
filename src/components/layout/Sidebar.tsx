import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Percent,
  CreditCard,
  TrendingUp,
  BarChart3,
  User,
  FolderTree,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Панель керування', page: 'dashboard' },
  { icon: Package, label: 'Товари', page: 'products' },
  { icon: FolderTree, label: 'Категорії', page: 'categories' },
  { icon: Users, label: 'Покупці', page: 'buyers' },
  { icon: FileText, label: 'Угоди', page: 'deals' },
  { icon: Percent, label: 'Знижки', page: 'discounts' },
  { icon: CreditCard, label: 'Платежі', page: 'payments' },
  { icon: TrendingUp, label: 'Складські операції', page: 'stock-movements' },
  { icon: BarChart3, label: 'Звіти', page: 'reports' },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">ПродажPro</h1>
        <p className="text-sm text-gray-400 mt-1">Система обліку продажів</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;

            return (
              <li key={item.page}>
                <button
                  onClick={() => onNavigate(item.page)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            currentPage === 'profile'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Профіль</span>
        </button>
      </div>
    </div>
  );
}
