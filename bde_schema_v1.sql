-- =====================================================================
-- BDE platform - database schema v1
-- Events + partners only. Cards/accounts come later.
--
-- HOW TO RUN THIS:
--   1. Go to supabase.com, create a free project
--   2. Left sidebar -> SQL Editor -> New query
--   3. Paste this whole file, click Run
--   4. Left sidebar -> Table Editor -> your tables are there
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. PARTNER CATEGORIES
--    Used for the category filter on the partners page.
--    Edit or add rows freely from the Table Editor.
-- ---------------------------------------------------------------------
create table partner_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        not null unique,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now()
);

insert into partner_categories (name, slug, sort_order) values
  ('Restauration', 'restauration', 1),
  ('Sport',        'sport',        2),
  ('Loisirs',      'loisirs',      3),
  ('Commerces',    'commerces',    4),
  ('Beaute',       'beaute',       5),
  ('Culture',      'culture',      6);


-- ---------------------------------------------------------------------
-- 2. PARTNERS
--    latitude/longitude drive the interactive map.
--    Leave them empty for partners with no physical address.
-- ---------------------------------------------------------------------
create table partners (
  id           uuid primary key default gen_random_uuid(),
  name         text        not null,
  category_id  uuid        references partner_categories(id) on delete set null,
  benefit      text        not null,   -- e.g. "-10% sur toute la carte"
  description  text,
  logo_url     text,
  address      text,
  latitude     double precision,
  longitude    double precision,
  website_url  text,
  phone        text,
  is_published boolean     not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index partners_category_idx  on partners (category_id);
create index partners_published_idx on partners (is_published);


-- ---------------------------------------------------------------------
-- 3. EVENTS
--    is_published = false lets you prepare an event without
--    it appearing in the app. Flip it to true when ready.
-- ---------------------------------------------------------------------
create table events (
  id               uuid primary key default gen_random_uuid(),
  title            text        not null,
  description      text,
  starts_at        timestamptz not null,
  ends_at          timestamptz,
  location_name    text,
  location_address text,
  latitude         double precision,
  longitude        double precision,
  image_url        text,
  ticket_url       text,       -- HelloAsso link if the event is ticketed
  price_cents      integer,    -- 500 = 5,00 EUR. NULL = free
  is_published     boolean     not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index events_starts_at_idx  on events (starts_at);
create index events_published_idx  on events (is_published);


-- ---------------------------------------------------------------------
-- 4. AUTO-UPDATE updated_at
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger partners_updated_at
  before update on partners
  for each row execute function set_updated_at();

create trigger events_updated_at
  before update on events
  for each row execute function set_updated_at();


-- ---------------------------------------------------------------------
-- 5. SECURITY - Row Level Security
--
--    This is the important part. RLS means the database itself
--    decides who sees what, so nobody can bypass your app to read
--    or modify data.
--
--    Read: anyone can read PUBLISHED rows.
--    Write: nobody, via the public API. Writes only happen from the
--           Supabase dashboard, which is protected by your own login.
--           That is your v1 admin panel.
-- ---------------------------------------------------------------------
alter table partner_categories enable row level security;
alter table partners           enable row level security;
alter table events             enable row level security;

create policy "public can read categories"
  on partner_categories for select
  to anon, authenticated
  using (true);

create policy "public can read published partners"
  on partners for select
  to anon, authenticated
  using (is_published = true);

create policy "public can read published events"
  on events for select
  to anon, authenticated
  using (is_published = true);

-- Deliberately no insert / update / delete policies.
-- Do not add any until you have a real admin role in place.


-- ---------------------------------------------------------------------
-- 6. IMAGE STORAGE
--    Two public buckets: event visuals and partner logos.
--    Upload from Supabase -> Storage, then copy the public URL
--    into image_url / logo_url.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('event-images',  'event-images',  true),
  ('partner-logos', 'partner-logos', true)
on conflict (id) do nothing;

create policy "public can view event images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'event-images');

create policy "public can view partner logos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'partner-logos');


-- ---------------------------------------------------------------------
-- 7. QUICK TEST DATA - delete once you have real content
-- ---------------------------------------------------------------------
insert into events (title, description, starts_at, location_name, is_published)
values (
  'Soiree de rentree',
  'La premiere soiree de l annee. Ambiance garantie.',
  now() + interval '14 days',
  'Le Duplex',
  true
);

insert into partners (name, category_id, benefit, address, is_published)
values (
  'Pizzeria Da Marco',
  (select id from partner_categories where slug = 'restauration'),
  '-15% sur present ation de la carte BDE',
  '12 rue de la Republique',
  true
);
