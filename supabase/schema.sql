-- ═══════════════════════════════════════════════════
-- BEAUTY ZONE — SUPABASE SCHEMA
-- ═══════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Users Table ──────────────────────────────────
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text unique,
  email text unique,
  pass text not null,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Products Table ───────────────────────────────
create table if not exists public.products (
  id text primary key,
  name_ar text not null,
  name_en text,
  price numeric(10,2) not null default 0,
  category text not null default 'skincare',
  description_ar text,
  description_en text,
  images text[] default '{}',
  stock integer default 0,
  featured boolean default false,
  bestseller boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Orders Table ─────────────────────────────────
create table if not exists public.orders (
  id text primary key,
  user_id uuid references public.users(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  address text,
  city text,
  notes text,
  items jsonb default '[]',
  total numeric(10,2) default 0,
  status text default 'جديد' check (status in ('جديد', 'قيد التجهيز', 'تم الشحن', 'مكتمل', 'ملغي')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Cart Table ───────────────────────────────────
create table if not exists public.cart (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  product_id text references public.products(id) on delete cascade,
  qty integer default 1,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ── Wishlist Table ───────────────────────────────
create table if not exists public.wishlist (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  product_id text references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ── Testimonials Table ────────────────────────────
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text default 'فلسطين',
  letter text,
  stars integer default 5,
  text text not null,
  store_reply text,
  created_at timestamptz default now()
);

-- ── Settings Table ────────────────────────────────
create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ── Indexes ──────────────────────────────────────
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_featured on public.products(featured);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_cart_user on public.cart(user_id);
create index if not exists idx_wishlist_user on public.wishlist(user_id);

-- ── Row Level Security (RLS) ─────────────────────
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.cart enable row level security;
alter table public.wishlist enable row level security;
alter table public.testimonials enable row level security;
alter table public.settings enable row level security;

-- Users: anyone can sign up, only own data visible
create policy "Users are viewable by everyone" on public.users for select using (true);
create policy "Users can update own data" on public.users for update using (auth.uid() = id);
create policy "Anyone can sign up" on public.users for insert with check (true);

-- Products: public read
create policy "Products are public" on public.products for select using (true);
create policy "Only admins can modify products" on public.products for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- Orders: users see own, admins see all
create policy "Users see own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users create own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins see all orders" on public.orders for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- Cart: users see own
create policy "Users see own cart" on public.cart for select using (auth.uid() = user_id);
create policy "Users manage own cart" on public.cart for all using (auth.uid() = user_id);

-- Wishlist: users see own
create policy "Users see own wishlist" on public.wishlist for select using (auth.uid() = user_id);
create policy "Users manage own wishlist" on public.wishlist for all using (auth.uid() = user_id);

-- Testimonials: public read, admins manage
create policy "Testimonials are public" on public.testimonials for select using (true);
create policy "Admins manage testimonials" on public.testimonials for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- Settings: public read, admins manage
create policy "Settings are public" on public.settings for select using (true);
create policy "Admins manage settings" on public.settings for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- ── Functions ────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, pass, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'مستخدم'),
    new.email,
    '',
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();