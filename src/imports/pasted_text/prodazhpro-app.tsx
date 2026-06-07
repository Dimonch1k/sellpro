Create a complete Ukrainian web application UI and frontend-ready React structure for a medium-sized sales management system.

Project name: ПродажPro

Tech stack:
- Vite
- React
- TypeScript
- Supabase
- Tailwind CSS
- ShadCN UI
- Lucide React icons

Language:
- All visible UI text must be in Ukrainian.
- Currency format: UAH / грн.
- Date format: Ukrainian style.

Main project idea:
The application helps a wholesale-retail company manage product sales, buyers, deals, discounts, payments, stock movements, and financial analytics.

Database model to follow:
1. profiles
   - id
   - full_name
   - phone
   - avatar_url
   - role: admin, manager, accountant, viewer

2. product_categories
   - id
   - name
   - slug
   - description

3. products
   - id
   - category_id
   - name
   - sku
   - wholesale_price
   - retail_price
   - description
   - unit
   - stock_qty
   - min_stock_qty
   - image_url
   - is_active

4. buyers
   - id
   - company_name
   - phone
   - email
   - contact_person
   - address
   - tax_code
   - notes
   - is_active

5. discount_rules
   - id
   - name
   - min_quantity
   - min_total_amount
   - discount_percent
   - description
   - is_active

6. deals
   - id
   - deal_no
   - deal_date
   - buyer_id
   - is_wholesale
   - status: draft, completed, cancelled
   - discount_rule_id
   - discount_amount
   - note
   - created_by

7. deal_items
   - id
   - deal_id
   - product_id
   - quantity
   - unit_price
   - discount_percent
   - line_total

8. payments
   - id
   - deal_id
   - payment_date
   - amount
   - method: cash, card, bank_transfer, other
   - note
   - created_by

9. stock_movements
   - id
   - product_id
   - deal_id
   - deal_item_id
   - movement_type: income, sale, return, write_off, correction
   - quantity_delta
   - reason
   - created_by

10. Views:
   - dashboard_stats
   - deal_financials
   - monthly_sales

Application structure:
Generate a frontend prepared for Vite + React + TypeScript with these folders:

src/
  app/
    App.tsx
    router.tsx
  components/
    layout/
      DashboardLayout.tsx
      PublicLayout.tsx
      Sidebar.tsx
      Navbar.tsx
    ui/
      Use ShadCN-style components
    shared/
      StatCard.tsx
      DataTable.tsx
      EmptyState.tsx
      ConfirmDialog.tsx
      StatusBadge.tsx
      PriceText.tsx
  lib/
    supabase.ts
    types.ts
    formatters.ts
    constants.ts
  pages/
    public/
      HomePage.tsx
      AboutPage.tsx
      ContactPage.tsx
    auth/
      SignInPage.tsx
      SignUpPage.tsx
      ForgotPasswordPage.tsx
    dashboard/
      DashboardPage.tsx
      ProductsPage.tsx
      ProductFormPage.tsx
      CategoriesPage.tsx
      BuyersPage.tsx
      BuyerDetailsPage.tsx
      DealsPage.tsx
      DealCreatePage.tsx
      DealDetailsPage.tsx
      DiscountRulesPage.tsx
      PaymentsPage.tsx
      StockMovementsPage.tsx
      ReportsPage.tsx
      ProfilePage.tsx

Design style:
- Modern Ukrainian business SaaS dashboard.
- Clean, professional, not too colorful.
- Use cards, tables, filters, forms, badges, dialogs.
- Use Lucide React icons.
- Use ShadCN-like UI components.
- Responsive design for desktop and tablet.
- Sidebar dashboard layout.
- Public landing page should look like a modern B2B SaaS website.

Main pages:

1. HomePage
Create a public landing page:
- Hero section: "Облік реалізації готової продукції"
- Short description: system for wholesale-retail sales, buyers, deals, discounts, payments, and finance analytics.
- CTA buttons: "Увійти" and "Почати роботу"
- Feature cards:
  - Облік товарів
  - Покупці
  - Угоди
  - Знижки
  - Платежі
  - Фінансова аналітика

2. SignInPage
- Email/password login form.
- Link to registration.
- Link to forgot password.
- Ukrainian labels.

3. SignUpPage
- Full name
- Phone
- Email
- Password
- Confirm password
- Button: "Зареєструватися"

4. DashboardPage
Use dashboard_stats and monthly_sales.
Show stat cards:
- Загальний дохід
- Прибуток
- Борг покупців
- Кількість угод
- Активні покупці
- Товари на складі
- Товари з низьким залишком
Add chart section for monthly revenue and profit.
Add recent deals table.

5. ProductsPage
Use products and product_categories.
Features:
- Product table with search.
- Columns: Назва, Артикул, Категорія, Гуртова ціна, Роздрібна ціна, Залишок, Статус.
- Filters: category, active/inactive, low stock.
- Button: "Додати товар".
- Row actions: view/edit.

6. ProductFormPage
Form for create/edit:
- name
- sku
- category
- wholesale_price
- retail_price
- description
- unit
- stock_qty
- min_stock_qty
- image_url
- is_active

7. CategoriesPage
Manage product categories:
- list categories
- add/edit category dialog
- fields: name, slug, description

8. BuyersPage
Use buyers.
Features:
- table of buyer companies.
- search by company_name, phone, contact_person.
- columns: Назва, Телефон, Контактна особа, Адреса, Статус.
- button: "Додати покупця".

9. BuyerDetailsPage
Show buyer information:
- company name
- phone
- email
- contact person
- address
- tax code
- notes
Show buyer deals using deals/deal_financials:
- deal number
- date
- status
- total amount
- paid amount
- debt amount

10. DealsPage
Use deals and deal_financials.
Features:
- table of deals.
- filters by status, buyer, date range, wholesale/retail.
- columns: Номер угоди, Дата, Покупець, Тип, Статус, Сума, Оплачено, Борг, Прибуток.
- Button: "Створити угоду".

11. DealCreatePage
Important page.
Create a deal with multiple products.
Fields:
- buyer select
- deal_date
- is_wholesale switch
- status draft/completed
- note

Product items section:
- product select
- quantity
- unit price should automatically use wholesale_price if is_wholesale = true, otherwise retail_price
- discount_percent
- line_total
- ability to add/remove products

Discount section:
- show recommended discount rule based on total quantity and subtotal
- allow manual discount_amount
- show final total amount

When status is completed:
- explain in UI that stock will be reduced automatically.

12. DealDetailsPage
Invoice-style page:
- deal number
- buyer info
- deal date
- status
- wholesale/retail badge
- product items table
- subtotal
- item discounts
- manual discount
- final total
- paid amount
- debt amount
- profit amount
Actions:
- add payment
- change status
- print invoice button
- cancel deal button

13. DiscountRulesPage
Use discount_rules.
Features:
- table with discount rules
- create/edit dialog
- fields: name, min_quantity, min_total_amount, discount_percent, description, is_active
- explanation card: discounts are applied depending on quantity and total value.

14. PaymentsPage
Use payments and deal_financials.
Features:
- table of payments
- filters by payment method and date
- create payment dialog
- select deal
- amount
- method
- payment_date
- note
Show unpaid/partial deals at the top.

15. StockMovementsPage
Use stock_movements and products.
Features:
- table of stock movements
- columns: Дата, Товар, Тип операції, Кількість, Причина.
- create manual movement dialog:
  - product
  - movement_type: income, return, write_off, correction
  - quantity_delta
  - reason
Important:
- For income, quantity_delta should be positive.
- For write_off, quantity_delta should be negative.
- Sales movements are created automatically when a deal is completed.

16. ReportsPage
Use monthly_sales and deal_financials.
Sections:
- Monthly revenue chart
- Monthly profit chart
- Debt report table
- Top buyers by revenue
- Top products by sold quantity
- Completed/cancelled/draft deals summary

17. ProfilePage
Use profiles.
Fields:
- full_name
- phone
- avatar_url
- role badge
Allow editing full_name, phone, avatar_url.
Do not allow normal users to change role.

Supabase integration requirements:
- Create src/lib/supabase.ts with createClient.
- Use environment variables:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
- Prepare service functions or hooks for:
  - getDashboardStats
  - getProducts
  - createProduct
  - updateProduct
  - getBuyers
  - createBuyer
  - getDeals
  - createDeal
  - createDealItems
  - getDealFinancials
  - createPayment
  - getDiscountRules
  - getStockMovements

UX requirements:
- Show loading states.
- Show empty states.
- Show error messages.
- Use toast notifications for successful create/update actions.
- Use confirmation dialogs for dangerous actions.
- Use status badges:
  - draft = Чернетка
  - completed = Завершено
  - cancelled = Скасовано
  - paid = Оплачено
  - partial = Частково
  - unpaid = Не оплачено

Important business logic:
- One deal can contain many products.
- The price in deal item depends on deal type:
  - wholesale deal uses wholesale_price
  - retail deal uses retail_price
- Discounts depend on total quantity and total amount.
- Payments can be partial.
- Debt = total amount - paid amount.
- Profit = sale amount - product wholesale cost - discounts.
- Completed deal should reduce product stock.
- Do not delete completed deals in UI; use cancellation/status instead.

Generate complete page layouts, clean components, realistic mock states, and frontend-ready TypeScript structure. The result should be easy to connect to the Supabase schema above.