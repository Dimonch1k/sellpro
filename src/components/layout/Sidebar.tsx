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
import { NavLink } from 'react-router-dom';
import { hasDashboardRouteAccess } from '../../lib/permissions';
import type { UserRole } from '../../lib/types';

const menuItems = [
  { icon: LayoutDashboard, label: 'Панель керування', to: '/dashboard', routeKey: 'dashboard' },
  { icon: Package, label: 'Товари', to: '/dashboard/products', routeKey: 'products' },
  { icon: FolderTree, label: 'Категорії', to: '/dashboard/categories', routeKey: 'categories' },
  { icon: Users, label: 'Покупці', to: '/dashboard/buyers', routeKey: 'buyers' },
  { icon: FileText, label: 'Угоди', to: '/dashboard/deals', routeKey: 'deals' },
  { icon: Percent, label: 'Знижки', to: '/dashboard/discounts', routeKey: 'discounts' },
  { icon: CreditCard, label: 'Платежі', to: '/dashboard/payments', routeKey: 'payments' },
  { icon: TrendingUp, label: 'Складські операції', to: '/dashboard/stock-movements', routeKey: 'stock-movements' },
  { icon: BarChart3, label: 'Звіти', to: '/dashboard/reports', routeKey: 'reports' },
];

const itemClassName = ({ isActive }: { isActive: boolean }) =>
  `flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
    isActive
      ? 'bg-blue-600 text-white shadow-sm'
      : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
  }`;

interface SidebarProps {
  role: UserRole | null;
}

export function Sidebar({ role }: SidebarProps) {
  const visibleItems = menuItems.filter((item) => hasDashboardRouteAccess(role, item.routeKey));

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
      <div className="border-b border-slate-200 p-6 dark:border-slate-800">
        <h1 className="text-2xl font-bold">ПродажPro</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Система обліку продажів</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/dashboard'} className={itemClassName}>
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        {hasDashboardRouteAccess(role, 'profile') ? (
          <NavLink to="/dashboard/profile" className={itemClassName}>
            <User className="w-5 h-5" />
            <span>Профіль</span>
          </NavLink>
        ) : null}
      </div>
    </div>
  );
}
