# ПродажPro

React + Vite + Supabase застосунок для обліку товарів, покупців, угод, платежів, складських рухів і звітності.

## Що вже підключено

- Авторизація через Supabase Auth
- Автоматичне створення `profiles` через SQL trigger
- CRUD для категорій, товарів, покупців і правил знижок
- Створення угод з позиціями, ручною знижкою і підбором `match_discount_rule`
- Платежі, складські операції, дашборд і звіти на базі ваших view
- Оновлення профілю і зміна пароля

## Env

Створіть файл `.env` на основі [.env.example](/Users/admin/Documents/Git/Dimonch1k/sellpro/.env.example):

```bash
cp .env.example .env
```

Потрібні змінні:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Supabase Setup

1. Створіть проєкт у Supabase.
2. Вставте SQL зі [supabase-schema.sql](/Users/admin/Documents/Git/Dimonch1k/sellpro/supabase-schema.sql) або ваш уже підготовлений SQL-скрипт у SQL Editor і виконайте його.
3. Увімкніть Email/Password у `Authentication > Providers`.
4. Додайте URL вашого локального фронтенду в `Authentication > URL Configuration`, якщо використовуєте email confirmation.

Якщо вам потрібен перший `admin`, після реєстрації виконайте в SQL Editor:

```sql
update public.profiles
set role = 'admin'
where id = 'USER_UUID_HERE';
```

Без цього перший користувач отримає роль `manager`, що достатньо для більшості щоденних операцій, але не для адмін-дій.

## Run

```bash
npm install
npm run dev
```

Продакшн-збірка:

```bash
npm run build
```

## Важливо

- Для сторінки угод потрібні ваші SQL-функції та view: `match_discount_rule`, `deal_financials`, `monthly_sales`, `dashboard_stats`.
- При завершенні угоди списання складу робиться через ваші database triggers, тому залишки завжди перевіряються на стороні БД.
- Якщо RLS повертає помилки прав, перевіряйте роль користувача в `public.profiles`.
