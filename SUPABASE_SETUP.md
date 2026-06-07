# Налаштування Supabase для ПродажPro

Цей документ містить покрокову інструкцію для налаштування бази даних Supabase для проєкту ПродажPro.

## Крок 1: Створення проєкту Supabase

1. Перейдіть на [supabase.com](https://supabase.com)
2. Увійдіть або зареєструйтесь
3. Натисніть "New project"
4. Виберіть організацію
5. Введіть назву проєкту (наприклад, "prodazhpro")
6. Створіть надійний пароль бази даних
7. Виберіть регіон (найближчий до України)
8. Натисніть "Create new project"
9. Зачекайте кілька хвилин, поки проєкт створюється

## Крок 2: Отримання облікових даних

1. Перейдіть у розділ "Settings" → "API"
2. Скопіюйте:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon/public key** (VITE_SUPABASE_ANON_KEY)

## Крок 3: Налаштування .env файлу

1. Створіть файл `.env` у корені проєкту
2. Вставте скопійовані дані:

```env
VITE_SUPABASE_URL=https://ваш-проект.supabase.co
VITE_SUPABASE_ANON_KEY=ваш-anon-key
```

## Крок 4: Виконання SQL міграції

1. У Supabase перейдіть до "SQL Editor"
2. Натисніть "New query"
3. Скопіюйте весь вміст файлу `supabase-schema.sql`
4. Вставте його у редактор
5. Натисніть "Run" або Ctrl+Enter

Це створить:
- Всі необхідні таблиці
- Індекси для оптимізації
- Представлення (views) для аналітики
- Тригери для автоматизації
- Row Level Security (RLS) політики
- Тестові дані категорій

## Крок 5: Налаштування аутентифікації

1. Перейдіть до "Authentication" → "Providers"
2. Увімкніть "Email" провайдер
3. Налаштуйте параметри:
   - Enable Email provider: ✓
   - Confirm email: ✓ (рекомендовано)
   - Enable email confirmations: ✓
   
4. Перейдіть до "Email Templates" для налаштування українських шаблонів листів (опціонально)

## Крок 6: Створення першого користувача

### Через інтерфейс Supabase:

1. Перейдіть до "Authentication" → "Users"
2. Натисніть "Add user"
3. Введіть email та пароль
4. Створіть користувача

### Через SQL:

```sql
-- Після створення користувача через Supabase Auth
-- Оновіть його профіль:
UPDATE profiles
SET
  full_name = 'Ваше Ім''я',
  phone = '+380 XX XXX XX XX',
  role = 'admin'
WHERE id = 'user-uuid';
```

## Крок 7: Налаштування Storage (опціонально)

Якщо потрібно зберігати зображення товарів:

1. Перейдіть до "Storage"
2. Створіть новий bucket: "products"
3. Налаштуйте політики доступу:

```sql
-- Політика для перегляду зображень
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Політика для завантаження зображень
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' AND
  auth.role() = 'authenticated'
);
```

## Крок 8: Заповнення тестових даних

Виконайте наступний SQL для створення тестових даних:

```sql
-- Додати тестові товари
INSERT INTO products (category_id, name, sku, wholesale_price, retail_price, unit, stock_qty, min_stock_qty)
SELECT
  c.id,
  'Цемент М500',
  'CEM-500',
  185.00,
  220.00,
  'мішок',
  450,
  100
FROM product_categories c
WHERE c.slug = 'cement'
LIMIT 1;

-- Додати тестового покупця
INSERT INTO buyers (company_name, phone, contact_person, address)
VALUES (
  'ТОВ "Будматеріали Плюс"',
  '+380 44 123 45 67',
  'Петренко Іван Васильович',
  'м. Київ, вул. Будівельників, 15'
);

-- Додати правило знижки
INSERT INTO discount_rules (name, min_quantity, discount_percent, description)
VALUES (
  'Знижка за обсяг 1000+',
  1000,
  5,
  'Знижка 5% при замовленні від 1000 одиниць'
);
```

## Крок 9: Перевірка налаштувань

1. Запустіть додаток: `pnpm dev`
2. Перейдіть на сторінку реєстрації
3. Створіть новий акаунт
4. Перевірте, чи створюється профіль у таблиці `profiles`

## Крок 10: Налаштування Row Level Security

Переконайтесь, що RLS увімкнено для всіх таблиць:

```sql
-- Перевірити статус RLS
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

Всі таблиці повинні мати `rowsecurity = true`.

## Troubleshooting

### Проблема: "relation does not exist"
**Рішення**: Переконайтесь, що ви виконали всю SQL міграцію з `supabase-schema.sql`

### Проблема: "permission denied"
**Рішення**: Перевірте RLS політики. Можливо, потрібно додати користувачу відповідну роль в таблиці `profiles`

### Проблема: Користувач не може створити угоду
**Рішення**: Переконайтесь, що роль користувача `admin` або `manager`:

```sql
UPDATE profiles
SET role = 'manager'
WHERE id = auth.uid();
```

### Проблема: Не оновлюються залишки товарів
**Рішення**: Перевірте, чи працює тригер `trg_update_stock_on_deal_complete`:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'trg_update_stock_on_deal_complete';
```

## Корисні SQL запити

### Переглянути всі угоди з фінансами
```sql
SELECT * FROM deal_financials ORDER BY deal_date DESC;
```

### Переглянути статистику панелі
```sql
SELECT * FROM dashboard_stats;
```

### Переглянути місячні продажі
```sql
SELECT * FROM monthly_sales;
```

### Знайти товари з низьким залишком
```sql
SELECT name, stock_qty, min_stock_qty, unit
FROM products
WHERE stock_qty <= min_stock_qty AND is_active = TRUE;
```

### Переглянути дебіторську заборгованість
```sql
SELECT
  buyer_name,
  deal_no,
  total_amount,
  paid_amount,
  debt_amount
FROM deal_financials
WHERE debt_amount > 0
ORDER BY debt_amount DESC;
```

## Резервне копіювання

Регулярно створюйте резервні копії:

1. Перейдіть до "Database" → "Backups"
2. Налаштуйте автоматичне резервне копіювання
3. Або вручну створіть backup через pg_dump:

```bash
pg_dump -h db.ваш-проект.supabase.co -U postgres -d postgres > backup.sql
```

## Моніторинг

1. Перейдіть до "Logs" для перегляду логів
2. "Reports" для аналізу використання
3. "Database" → "Roles" для управління доступом

## Безпека

1. **Ніколи не передавайте service_role key на фронтенд**
2. Використовуйте тільки anon key у `.env`
3. Переконайтесь, що RLS увімкнено
4. Регулярно оновлюйте паролі
5. Використовуйте HTTPS в production

## Production Deployment

Перед розгортанням у production:

1. Оновіть email шаблони українською мовою
2. Налаштуйте власний SMTP для email
3. Увімкніть двофакторну аутентифікацію
4. Налаштуйте rate limiting
5. Перевірте всі RLS політики
6. Створіть резервну копію бази даних

---

**Підтримка**: Якщо виникли питання, зверніться до документації Supabase: https://supabase.com/docs
