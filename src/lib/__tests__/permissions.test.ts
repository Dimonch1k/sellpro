import { describe, expect, it } from 'vitest';
import {
  getDefaultDashboardPath,
  hasDashboardRouteAccess,
  hasMutationPermission,
} from '../permissions';

describe('dashboard permissions', () => {
  it('allows a viewer to access the products page', () => {
    expect(hasDashboardRouteAccess('viewer', 'products')).toBe(true);
  });

  it('blocks a viewer from the payments page', () => {
    expect(hasDashboardRouteAccess('viewer', 'payments')).toBe(false);
  });

  it('allows an accountant to access reports', () => {
    expect(hasDashboardRouteAccess('accountant', 'reports')).toBe(true);
  });

  it('blocks an accountant from stock movements', () => {
    expect(hasDashboardRouteAccess('accountant', 'stock-movements')).toBe(false);
  });

  it('allows an admin to manage discount rules', () => {
    expect(hasMutationPermission('admin', 'manageDiscountRules')).toBe(true);
  });

  it('blocks a viewer from managing deals', () => {
    expect(hasMutationPermission('viewer', 'manageDeals')).toBe(false);
  });

  it('returns the dashboard home path for a role with dashboard access', () => {
    expect(getDefaultDashboardPath('manager')).toBe('/dashboard');
  });
});
