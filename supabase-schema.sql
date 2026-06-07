-- ПродажPro Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'accountant', 'viewer')) DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product categories
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  wholesale_price DECIMAL(10, 2) NOT NULL,
  retail_price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  unit TEXT NOT NULL DEFAULT 'шт',
  stock_qty DECIMAL(10, 2) NOT NULL DEFAULT 0,
  min_stock_qty DECIMAL(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buyers
CREATE TABLE buyers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  contact_person TEXT NOT NULL,
  address TEXT,
  tax_code TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discount rules
CREATE TABLE discount_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  min_quantity DECIMAL(10, 2),
  min_total_amount DECIMAL(10, 2),
  discount_percent DECIMAL(5, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_min_condition CHECK (min_quantity IS NOT NULL OR min_total_amount IS NOT NULL)
);

-- Deals
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_no TEXT UNIQUE NOT NULL,
  deal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE RESTRICT,
  is_wholesale BOOLEAN DEFAULT TRUE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'completed', 'cancelled')) DEFAULT 'draft',
  discount_rule_id UUID REFERENCES discount_rules(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  note TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deal items
CREATE TABLE deal_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  line_total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount DECIMAL(10, 2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('cash', 'card', 'bank_transfer', 'other')),
  note TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock movements
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  deal_item_id UUID REFERENCES deal_items(id) ON DELETE SET NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('income', 'sale', 'return', 'write_off', 'correction')),
  quantity_delta DECIMAL(10, 2) NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_deals_buyer ON deals(buyer_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_date ON deals(deal_date);
CREATE INDEX idx_deal_items_deal ON deal_items(deal_id);
CREATE INDEX idx_deal_items_product ON deal_items(product_id);
CREATE INDEX idx_payments_deal ON payments(deal_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_type ON stock_movements(movement_type);

-- Dashboard stats view
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  COALESCE(SUM(CASE WHEN d.status = 'completed' THEN di.line_total ELSE 0 END), 0) - COALESCE(SUM(d.discount_amount), 0) AS total_revenue,
  COALESCE(SUM(CASE WHEN d.status = 'completed' THEN (di.line_total - (di.quantity * p.wholesale_price)) ELSE 0 END), 0) AS total_profit,
  COALESCE(SUM(
    CASE WHEN d.status = 'completed'
    THEN (di.line_total - COALESCE(pay.total_paid, 0))
    ELSE 0 END
  ), 0) AS total_debt,
  COUNT(DISTINCT d.id) FILTER (WHERE d.status != 'cancelled') AS deals_count,
  COUNT(DISTINCT b.id) FILTER (WHERE b.is_active = TRUE) AS active_buyers,
  COUNT(DISTINCT pr.id) FILTER (WHERE pr.stock_qty > 0) AS products_in_stock,
  COUNT(DISTINCT pr.id) FILTER (WHERE pr.stock_qty <= pr.min_stock_qty AND pr.is_active = TRUE) AS low_stock_products
FROM deals d
LEFT JOIN deal_items di ON d.id = di.deal_id
LEFT JOIN products p ON di.product_id = p.id
LEFT JOIN buyers b ON d.buyer_id = b.id
LEFT JOIN products pr ON TRUE
LEFT JOIN (
  SELECT deal_id, SUM(amount) AS total_paid
  FROM payments
  GROUP BY deal_id
) pay ON d.id = pay.deal_id;

-- Deal financials view
CREATE OR REPLACE VIEW deal_financials AS
SELECT
  d.id AS deal_id,
  d.deal_no,
  d.deal_date,
  b.company_name AS buyer_name,
  d.status,
  COALESCE(SUM(di.line_total), 0) - COALESCE(d.discount_amount, 0) AS total_amount,
  COALESCE(p.total_paid, 0) AS paid_amount,
  GREATEST(COALESCE(SUM(di.line_total), 0) - COALESCE(d.discount_amount, 0) - COALESCE(p.total_paid, 0), 0) AS debt_amount,
  CASE
    WHEN d.status = 'completed' THEN
      COALESCE(SUM(di.line_total - (di.quantity * pr.wholesale_price)), 0) - COALESCE(d.discount_amount, 0)
    ELSE 0
  END AS profit_amount
FROM deals d
LEFT JOIN buyers b ON d.buyer_id = b.id
LEFT JOIN deal_items di ON d.id = di.deal_id
LEFT JOIN products pr ON di.product_id = pr.id
LEFT JOIN (
  SELECT deal_id, SUM(amount) AS total_paid
  FROM payments
  GROUP BY deal_id
) p ON d.id = p.deal_id
GROUP BY d.id, d.deal_no, d.deal_date, b.company_name, d.status, d.discount_amount, p.total_paid;

-- Monthly sales view
CREATE OR REPLACE VIEW monthly_sales AS
SELECT
  TO_CHAR(d.deal_date, 'YYYY-MM') AS month,
  COALESCE(SUM(di.line_total), 0) - COALESCE(SUM(d.discount_amount), 0) AS revenue,
  COALESCE(SUM(di.line_total - (di.quantity * p.wholesale_price)), 0) - COALESCE(SUM(d.discount_amount), 0) AS profit,
  COUNT(DISTINCT d.id) AS deals_count
FROM deals d
LEFT JOIN deal_items di ON d.id = di.deal_id
LEFT JOIN products p ON di.product_id = p.id
WHERE d.status = 'completed'
GROUP BY TO_CHAR(d.deal_date, 'YYYY-MM')
ORDER BY month DESC;

-- Function to auto-generate deal number
CREATE OR REPLACE FUNCTION generate_deal_no()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
  year TEXT;
BEGIN
  IF NEW.deal_no IS NULL OR NEW.deal_no = '' THEN
    year := TO_CHAR(NEW.deal_date, 'YYYY');

    SELECT COALESCE(MAX(CAST(SUBSTRING(deal_no FROM '\d+$') AS INTEGER)), 0) + 1
    INTO next_num
    FROM deals
    WHERE deal_no LIKE 'УГ-' || year || '-%';

    NEW.deal_no := 'УГ-' || year || '-' || LPAD(next_num::TEXT, 3, '0');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_deal_no
BEFORE INSERT ON deals
FOR EACH ROW
EXECUTE FUNCTION generate_deal_no();

-- Function to update stock on deal completion
CREATE OR REPLACE FUNCTION update_stock_on_deal_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Create stock movements for all deal items
    INSERT INTO stock_movements (product_id, deal_id, deal_item_id, movement_type, quantity_delta, reason, created_by)
    SELECT
      di.product_id,
      NEW.id,
      di.id,
      'sale',
      -di.quantity,
      'Продаж за угодою ' || NEW.deal_no,
      NEW.created_by
    FROM deal_items di
    WHERE di.deal_id = NEW.id;

    -- Update product stock quantities
    UPDATE products p
    SET stock_qty = stock_qty - di.quantity,
        updated_at = NOW()
    FROM deal_items di
    WHERE di.deal_id = NEW.id AND p.id = di.product_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_stock_on_deal_complete
AFTER INSERT OR UPDATE ON deals
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_deal_complete();

-- Function to update stock on manual stock movement
CREATE OR REPLACE FUNCTION update_stock_on_movement()
RETURNS TRIGGER AS $$
BEGIN
  -- Update product stock quantity
  UPDATE products
  SET stock_qty = stock_qty + NEW.quantity_delta,
      updated_at = NOW()
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_stock_on_movement
AFTER INSERT ON stock_movements
FOR EACH ROW
WHEN (NEW.movement_type != 'sale')
EXECUTE FUNCTION update_stock_on_movement();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_buyers_updated_at BEFORE UPDATE ON buyers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_discount_rules_updated_at BEFORE UPDATE ON discount_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for product_categories
CREATE POLICY "Anyone can view categories" ON product_categories FOR SELECT USING (TRUE);
CREATE POLICY "Admins and managers can insert categories" ON product_categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Admins and managers can update categories" ON product_categories FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Policies for products
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (TRUE);
CREATE POLICY "Admins and managers can insert products" ON products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Admins and managers can update products" ON products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Policies for buyers
CREATE POLICY "Anyone can view buyers" ON buyers FOR SELECT USING (TRUE);
CREATE POLICY "Admins and managers can manage buyers" ON buyers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Policies for discount_rules
CREATE POLICY "Anyone can view discount rules" ON discount_rules FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage discount rules" ON discount_rules FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policies for deals
CREATE POLICY "Anyone can view deals" ON deals FOR SELECT USING (TRUE);
CREATE POLICY "Admins and managers can manage deals" ON deals FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Policies for deal_items
CREATE POLICY "Anyone can view deal items" ON deal_items FOR SELECT USING (TRUE);
CREATE POLICY "Admins and managers can manage deal items" ON deal_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Policies for payments
CREATE POLICY "Anyone can view payments" ON payments FOR SELECT USING (TRUE);
CREATE POLICY "Admins, managers, and accountants can manage payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'accountant'))
);

-- Policies for stock_movements
CREATE POLICY "Anyone can view stock movements" ON stock_movements FOR SELECT USING (TRUE);
CREATE POLICY "Admins and managers can create stock movements" ON stock_movements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Insert sample data (optional)
-- Sample product categories
INSERT INTO product_categories (name, slug, description) VALUES
  ('Цемент', 'cement', 'Різні види цементу'),
  ('Цегла', 'brick', 'Будівельна та облицювальна цегла'),
  ('Арматура', 'rebar', 'Металева арматура різних діаметрів'),
  ('Сипучі матеріали', 'bulk', 'Пісок, щебінь, відсів');

COMMENT ON TABLE profiles IS 'Профілі користувачів системи';
COMMENT ON TABLE product_categories IS 'Категорії товарів';
COMMENT ON TABLE products IS 'Товари';
COMMENT ON TABLE buyers IS 'Покупці (клієнти)';
COMMENT ON TABLE discount_rules IS 'Правила автоматичних знижок';
COMMENT ON TABLE deals IS 'Угоди (продажі)';
COMMENT ON TABLE deal_items IS 'Позиції угод';
COMMENT ON TABLE payments IS 'Платежі';
COMMENT ON TABLE stock_movements IS 'Складські операції';
