import type { UserRole } from './types';

export type DashboardRouteKey =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'buyers'
  | 'deals'
  | 'discounts'
  | 'payments'
  | 'stock-movements'
  | 'reports'
  | 'profile';

const ROUTE_ACCESS: Record<DashboardRouteKey, UserRole[]> = {
  dashboard: ['admin', 'manager', 'accountant', 'viewer'],
  products: ['admin', 'manager', 'accountant', 'viewer'],
  categories: ['admin', 'manager', 'accountant', 'viewer'],
  buyers: ['admin', 'manager', 'accountant', 'viewer'],
  deals: ['admin', 'manager', 'accountant', 'viewer'],
  discounts: ['admin', 'manager'],
  payments: ['admin', 'manager', 'accountant'],
  'stock-movements': ['admin', 'manager'],
  reports: ['admin', 'manager', 'accountant'],
  profile: ['admin', 'manager', 'accountant', 'viewer'],
};

export const MUTATION_PERMISSIONS = {
  manageProducts: ['admin', 'manager'],
  manageCategories: ['admin', 'manager'],
  manageBuyers: ['admin', 'manager'],
  manageDeals: ['admin', 'manager'],
  manageDiscountRules: ['admin'],
  managePayments: ['admin', 'manager', 'accountant'],
  manageStockMovements: ['admin', 'manager'],
} as const satisfies Record<string, UserRole[]>;

export function hasDashboardRouteAccess(role: UserRole | null | undefined, route: DashboardRouteKey) {
  return Boolean(role && ROUTE_ACCESS[route].includes(role));
}

export function hasMutationPermission(
  role: UserRole | null | undefined,
  permission: keyof typeof MUTATION_PERMISSIONS,
) {
  return Boolean(role && MUTATION_PERMISSIONS[permission].includes(role));
}

export function getDefaultDashboardPath(role: UserRole | null | undefined) {
  if (hasDashboardRouteAccess(role, 'dashboard')) {
    return '/dashboard';
  }

  return '/dashboard/profile';
}
