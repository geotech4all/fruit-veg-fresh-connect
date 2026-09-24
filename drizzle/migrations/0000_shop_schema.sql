create type public.app_role as enum ('admin','staff','customer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_team(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','staff'))
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.team_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role app_role not null default 'staff',
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.team_invites to authenticated;
grant all on public.team_invites to service_role;
alter table public.team_invites enable row level security;
create policy "Admins manage invites" on public.team_invites for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.claim_team_invite()
returns app_role language plpgsql security definer set search_path = public as $$
declare _email text; _inv public.team_invites;
begin
  _email := lower(coalesce(auth.jwt() ->> 'email',''));
  if auth.uid() is null or _email = '' then return null; end if;
  select * into _inv from public.team_invites where lower(email) = _email limit 1;
  if _inv.id is null then return null; end if;
  insert into public.user_roles(user_id, role) values (auth.uid(), _inv.role) on conflict do nothing;
  update public.team_invites set accepted_at = coalesce(accepted_at, now()) where id = _inv.id;
  return _inv.role;
end $$;
grant execute on function public.claim_team_invite() to authenticated;

insert into public.team_invites(email, role) values ('fruitvegfarm@gmail.com','admin');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null default 'Healthy Foods',
  short_description text,
  description text,
  image_url text,
  status text not null default 'available',
  bulk_available boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "Public reads visible products" on public.products for select to anon, authenticated using (status <> 'hidden' or public.is_team(auth.uid()));
create policy "Team manages products" on public.products for all to authenticated using (public.is_team(auth.uid())) with check (public.is_team(auth.uid()));

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  price_ngn integer not null check (price_ngn >= 0),
  in_stock boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.product_variants to anon, authenticated;
grant insert, update, delete on public.product_variants to authenticated;
grant all on public.product_variants to service_role;
alter table public.product_variants enable row level security;
create policy "Public reads variants" on public.product_variants for select to anon, authenticated using (true);
create policy "Team manages variants" on public.product_variants for all to authenticated using (public.is_team(auth.uid())) with check (public.is_team(auth.uid()));

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('FV-' || upper(substr(md5(random()::text),1,6))),
  user_id uuid,
  customer_name text not null,
  phone text not null,
  email text,
  delivery_address text not null,
  state text,
  notes text,
  subtotal_ngn integer not null,
  discount_ngn integer not null default 0,
  total_ngn integer not null,
  payment_method text not null default 'pay_on_delivery',
  payment_status text not null default 'unpaid',
  status text not null default 'new',
  gift_meal_guide boolean not null default false,
  health_consultation boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "Customers read own orders" on public.orders for select to authenticated using (user_id = auth.uid() or public.is_team(auth.uid()));
create policy "Team updates orders" on public.orders for update to authenticated using (public.is_team(auth.uid())) with check (public.is_team(auth.uid()));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_label text not null,
  unit_price_ngn integer not null,
  quantity integer not null check (quantity > 0),
  line_total_ngn integer not null
);
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "Read items of visible orders" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_team(auth.uid()))));

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  amount_ngn integer not null,
  method text not null default 'cash',
  reference text,
  note text,
  recorded_by uuid,
  paid_at timestamptz not null default now()
);
grant select, insert, update, delete on public.payments to authenticated;
grant all on public.payments to service_role;
alter table public.payments enable row level security;
create policy "Team manages payments" on public.payments for all to authenticated using (public.is_team(auth.uid())) with check (public.is_team(auth.uid()));

create table public.members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text,
  location text,
  interests text[] not null default '{}',
  newsletter boolean not null default true,
  created_at timestamptz not null default now()
);
grant select, update, delete on public.members to authenticated;
grant all on public.members to service_role;
alter table public.members enable row level security;
create policy "Team reads members" on public.members for select to authenticated using (public.is_team(auth.uid()));
create policy "Admins manage members" on public.members for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

with p as (
  insert into public.products (slug,name,category,short_description,description,status,bulk_available,sort_order) values
  ('teleios-ofada-rice','Teleios Ofada Rice','Rice','Clean, stone-free, dirt-free — just wash and cook.','Our Teleios Ofada rice is clean, stone-free, dirt-free, and ready for your pot. Just wash and cook. 100% money-back guarantee if you find stones or dirt.','available',true,1),
  ('normal-rice','Normal Rice','Rice','Quality everyday rice at great prices.','Quality everyday rice for homes, restaurants and caterers. Bulk supply available.','available',true,2),
  ('potato-flour','Potato Flour','Healthy Foods','Wholesome potato flour, 5kg.','Healthy potato flour for swallow, baking and more.','available',false,3),
  ('unripe-plantain-flour','Unripe Plantain Flour','Healthy Foods','Fibre-rich unripe plantain flour, 5kg.','Unripe plantain flour — a healthy, fibre-rich staple.','available',false,4),
  ('oatmeal','Oatmeal','Healthy Foods','Nutritious oatmeal, 5kg.','Wholesome oatmeal for healthy breakfasts.','available',false,5),
  ('processed-dry-okro','Processed Dry Okro','Processed Produce','Farm-grown okro, cleaned and dried.','Okro from our Osun farm, cleaned, sliced and dried for long shelf life.','available',true,6)
  returning id, slug
)
insert into public.product_variants (product_id,label,price_ngn,sort_order)
select p.id, v.label, v.price, v.ord from p join (values
  ('teleios-ofada-rice','5kg',25000,1),('teleios-ofada-rice','10kg',45000,2),('teleios-ofada-rice','25kg',90000,3),('teleios-ofada-rice','50kg',170000,4),
  ('normal-rice','5kg',8750,1),('normal-rice','10kg',17500,2),('normal-rice','25kg',35000,3),('normal-rice','50kg',70000,4),
  ('potato-flour','5kg',30000,1),('unripe-plantain-flour','5kg',35000,1),('oatmeal','5kg',30000,1),
  ('processed-dry-okro','1kg',8000,1),('processed-dry-okro','5kg',38000,2)
) as v(slug,label,price,ord) on v.slug = p.slug;