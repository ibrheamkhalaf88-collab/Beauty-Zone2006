-- ═══════════════════════════════════════════════════
-- BEAUTY ZONE — SUPABASE STORAGE & HELPERS
-- ═══════════════════════════════════════════════════

-- ── Storage Buckets ───────────────────────────────
-- Create a public bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Create a private bucket for admin uploads
insert into storage.buckets (id, name, public)
values ('admin-uploads', 'admin-uploads', false)
on conflict (id) do nothing;

-- ── Storage Policies ─────────────────────────────

-- Public images bucket: anyone can read, only admins can upload
create policy "Public images are accessible to everyone"
on storage.objects for select
using (bucket_id = 'images');

create policy "Admins can upload to public images"
on storage.objects for insert
with check (bucket_id = 'images' and
  exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can delete from public images"
on storage.objects for delete
using (bucket_id = 'images' and
  exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Admin uploads bucket: only admins can access
create policy "Only admins can access admin uploads"
on storage.objects for all
using (bucket_id = 'admin-uploads' and
  exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- ── Helper Functions ──────────────────────────────

-- Upload image and return public URL
create or replace function public.upload_image(
  bucket_name text,
  file_name text,
  file_content text,  -- base64 content
  content_type text
)
returns text as $$
declare
  result_url text;
begin
  -- Upload to storage
  insert into storage.objects (bucket_id, name, owner, content_type, data)
  values (bucket_name, file_name, auth.uid(), content_type, decode(file_content, 'base64'))
  on conflict (bucket_id, name) do update
    set data = decode(file_content, 'base64'), updated_at = now();

  -- Return public URL
  result_url := (
    select concat(
      (select value::text from vaultSecrets where key = 'SUPABASE_URL' limit 1) or 'https://placeholder.supabase.co',
      '/storage/v1/object/public/',
      bucket_name,
      '/',
      file_name
    )
  );

  return result_url;
end;
$$ language plpgsql security definer;

-- Simple upload for products (admin only)
create or replace function public.upload_product_image(
  p_product_id text,
  p_file_name text,
  p_content text,
  p_content_type text
)
returns text as $$
declare
  v_path text;
  v_url text;
begin
  v_path := 'products/' || p_product_id || '/' || p_file_name;

  insert into storage.objects (bucket_id, name, owner, content_type, data)
  values ('images', v_path, auth.uid(), p_content_type, decode(p_content, 'base64'))
  on conflict (bucket_id, name) do update
    set data = decode(p_content, 'base64'), updated_at = now();

  v_url := concat(
    (select value::text from vaultSecrets where key = 'SUPABASE_URL' limit 1) or 'https://placeholder.supabase.co',
    '/storage/v1/object/public/images/',
    v_path
  );

  return v_url;
end;
$$ language plpgsql security definer;

-- Get all product images
create or replace function public.get_product_images(p_product_id text)
returns table (url text, name text) as $$
begin
  return query
  select
    concat(
      (select value::text from vaultSecrets where key = 'SUPABASE_URL' limit 1) or 'https://placeholder.supabase.co',
      '/storage/v1/object/public/images/',
      o.name
    ) as url,
    o.name
  from storage.objects o
  where o.bucket_id = 'images'
    and o.name like 'products/' || p_product_id || '/%';
end;
$$ language plpgsql security definer;

-- Delete product images
create or replace function public.delete_product_images(p_product_id text)
returns void as $$
begin
  delete from storage.objects
  where bucket_id = 'images'
    and name like 'products/' || p_product_id || '/%';
end;
$$ language plpgsql security definer;

-- Upload section/banner image
create or replace function public.upload_section_image(
  p_section text,
  p_file_name text,
  p_content text,
  p_content_type text
)
returns text as $$
declare
  v_path text;
  v_url text;
begin
  v_path := 'sections/' || p_section || '/' || p_file_name;

  insert into storage.objects (bucket_id, name, owner, content_type, data)
  values ('images', v_path, auth.uid(), p_content_type, decode(p_content, 'base64'))
  on conflict (bucket_id, name) do update
    set data = decode(p_content, 'base64'), updated_at = now();

  v_url := concat(
    (select value::text from vaultSecrets where key = 'SUPABASE_URL' limit 1) or 'https://placeholder.supabase.co',
    '/storage/v1/object/public/images/',
    v_path
  );

  return v_url;
end;
$$ language plpgsql security definer;

-- ── Auth User Creation Trigger ────────────────────
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Cart Functions ────────────────────────────────
create or replace function public.add_to_cart(p_product_id text, p_qty integer default 1)
returns public.cart as $$
declare
  v_cart public.cart;
begin
  insert into public.cart (user_id, product_id, qty)
  values (auth.uid(), p_product_id, p_qty)
  on conflict (user_id, product_id) do update
    set qty = cart.qty + p_qty
  returning * into v_cart;
  return v_cart;
end;
$$ language plpgsql security definer;

create or replace function public.remove_from_cart(p_product_id text)
returns void as $$
begin
  delete from public.cart where user_id = auth.uid() and product_id = p_product_id;
end;
$$ language plpgsql security definer;

create or replace function public.clear_cart()
returns void as $$
begin
  delete from public.cart where user_id = auth.uid();
end;
$$ language plpgsql security definer;

-- ── Order Functions ────────────────────────────────
create or replace function public.create_order(
  p_name text,
  p_phone text,
  p_email text,
  p_address text,
  p_city text,
  p_notes text
)
returns public.orders as $$
declare
  v_order public.orders;
  v_cart_item record;
  v_total numeric(10,2) := 0;
  v_order_id text := 'BZ-' || floor(random() * 9000 + 1000)::text;
  v_items jsonb := '[]'::jsonb;
begin
  for v_cart_item in
    select c.product_id, c.qty, p.price, p.name_ar from public.cart c
    join public.products p on p.id = c.product_id
    where c.user_id = auth.uid()
  loop
    v_total := v_total + (v_cart_item.price * v_cart_item.qty);
    v_items := v_items || jsonb_build_object(
      'id', v_cart_item.product_id,
      'name', v_cart_item.name_ar,
      'qty', v_cart_item.qty,
      'price', v_cart_item.price
    );
  end loop;

  insert into public.orders (id, user_id, name, phone, email, address, city, notes, items, total)
  values (v_order_id, auth.uid(), p_name, p_phone, p_email, p_address, p_city, p_notes, v_items, v_total)
  returning * into v_order;

  delete from public.cart where user_id = auth.uid();

  return v_order;
end;
$$ language plpgsql security definer;

create or replace function public.update_order_status(p_order_id text, p_status text)
returns public.orders as $$
declare
  v_order public.orders;
begin
  update public.orders set status = p_status, updated_at = now()
  where id = p_order_id
  returning * into v_order;
  return v_order;
end;
$$ language plpgsql security definer;