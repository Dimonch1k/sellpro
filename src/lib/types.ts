export type UserRole = 'admin' | 'manager' | 'accountant' | 'viewer';

export type DealStatus = 'draft' | 'completed' | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'other';

export type MovementType = 'income' | 'sale' | 'return' | 'write_off' | 'correction';

export type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'empty';
export type ThemeMode = 'light' | 'dark';

export type Page =
  | 'home'
  | 'signin'
  | 'signup'
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'buyers'
  | 'deals'
  | 'deals-new'
  | 'discounts'
  | 'payments'
  | 'stock-movements'
  | 'reports'
  | 'profile';

export interface Profile {
  id: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  category_id?: string | null;
  name: string;
  sku?: string | null;
  wholesale_price: number;
  retail_price: number;
  description?: string | null;
  unit: string;
  stock_qty: number;
  min_stock_qty: number;
  image_url?: string | null;
  is_active: boolean;
  category?: ProductCategory;
  created_at?: string;
  updated_at?: string;
}

export interface Buyer {
  id: string;
  company_name: string;
  phone: string;
  email?: string | null;
  contact_person: string;
  address: string;
  tax_code?: string | null;
  notes?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DiscountRule {
  id: string;
  name: string;
  min_quantity?: number | null;
  min_total_amount?: number | null;
  discount_percent: number;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Deal {
  id: string;
  deal_no: string;
  deal_date: string;
  buyer_id: string;
  is_wholesale: boolean;
  status: DealStatus;
  discount_rule_id?: string | null;
  discount_amount: number;
  note?: string | null;
  created_by?: string | null;
  buyer?: Buyer;
  discount_rule?: DiscountRule;
  created_at?: string;
  updated_at?: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  deal_id: string;
  payment_date: string;
  amount: number;
  method: PaymentMethod;
  note?: string | null;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  deal_id?: string;
  deal_item_id?: string;
  movement_type: MovementType;
  quantity_delta: number;
  reason?: string | null;
  created_by?: string | null;
  created_at: string;
  product?: Product;
}

export interface DashboardStats {
  buyers_count: number;
  products_count: number;
  low_stock_count: number;
  deals_count: number;
  completed_deals_count: number;
  revenue_amount: number;
  profit_amount: number;
  debt_amount: number;
}

export interface DealFinancial {
  id: string;
  deal_no: string;
  deal_date: string;
  buyer_id: string;
  buyer_name: string;
  is_wholesale: boolean;
  total_amount: number;
  paid_amount: number;
  debt_amount: number;
  profit_amount: number;
  total_quantity: number;
  subtotal_amount: number;
  items_discount_amount: number;
  manual_discount_amount: number;
  status: DealStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface MonthlySales {
  month: string;
  completed_deals_count: number;
  revenue_amount: number;
  profit_amount: number;
  debt_amount: number;
}
