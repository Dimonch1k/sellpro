export type UserRole = 'admin' | 'manager' | 'accountant' | 'viewer';

export type DealStatus = 'draft' | 'completed' | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'other';

export type MovementType = 'income' | 'sale' | 'return' | 'write_off' | 'correction';

export type PaymentStatus = 'paid' | 'partial' | 'unpaid';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  role: UserRole;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  sku: string;
  wholesale_price: number;
  retail_price: number;
  description?: string;
  unit: string;
  stock_qty: number;
  min_stock_qty: number;
  image_url?: string;
  is_active: boolean;
  category?: ProductCategory;
}

export interface Buyer {
  id: string;
  company_name: string;
  phone: string;
  email?: string;
  contact_person: string;
  address?: string;
  tax_code?: string;
  notes?: string;
  is_active: boolean;
}

export interface DiscountRule {
  id: string;
  name: string;
  min_quantity?: number;
  min_total_amount?: number;
  discount_percent: number;
  description?: string;
  is_active: boolean;
}

export interface Deal {
  id: string;
  deal_no: string;
  deal_date: string;
  buyer_id: string;
  is_wholesale: boolean;
  status: DealStatus;
  discount_rule_id?: string;
  discount_amount: number;
  note?: string;
  created_by: string;
  buyer?: Buyer;
  discount_rule?: DiscountRule;
}

export interface DealItem {
  id: string;
  deal_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  line_total: number;
  product?: Product;
}

export interface Payment {
  id: string;
  deal_id: string;
  payment_date: string;
  amount: number;
  method: PaymentMethod;
  note?: string;
  created_by: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  deal_id?: string;
  deal_item_id?: string;
  movement_type: MovementType;
  quantity_delta: number;
  reason?: string;
  created_by: string;
  created_at: string;
  product?: Product;
}

export interface DashboardStats {
  total_revenue: number;
  total_profit: number;
  total_debt: number;
  deals_count: number;
  active_buyers: number;
  products_in_stock: number;
  low_stock_products: number;
}

export interface DealFinancial {
  deal_id: string;
  deal_no: string;
  deal_date: string;
  buyer_name: string;
  total_amount: number;
  paid_amount: number;
  debt_amount: number;
  profit_amount: number;
  status: DealStatus;
}

export interface MonthlySales {
  month: string;
  revenue: number;
  profit: number;
  deals_count: number;
}
