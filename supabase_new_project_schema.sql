-- =====================================================================
-- BDE platform - schema for the NEW Supabase project
-- Run this FIRST, in the SQL Editor of the NEW project
-- (tyyervwujtskjbcznzeq), before importing any data.
--
-- Same as bde_schema_v1.sql plus everything added since (the
-- partenaire/bon_plan split), minus the Storage buckets (all images
-- now live on Cloudflare R2, not Supabase Storage) and minus the
-- placeholder test rows.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. PARTNER CATEGORIES
-- ---------------------------------------------------------------------
create table partner_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        not null unique,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now()
);


-- ---------------------------------------------------------------------
-- 2. PARTNERS
--    kind distinguishes "Partenaires" (highlighted) from "Bons plans".
-- ---------------------------------------------------------------------
create table partners (
  id           uuid primary key default gen_random_uuid(),
  name         text        not null,
  category_id  uuid        references partner_categories(id) on delete set null,
  benefit      text        not null,
  description  text,
  logo_url     text,
  address      text,
  latitude     double precision,
  longitude    double precision,
  website_url  text,
  phone        text,
  kind         text        not null default 'bon_plan' check (kind in ('partenaire', 'bon_plan')),
  is_published boolean     not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index partners_category_idx  on partners (category_id);
create index partners_published_idx on partners (is_published);


-- ---------------------------------------------------------------------
-- 3. EVENTS
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
  ticket_url       text,
  price_cents      integer,
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
--    Read: anyone can read PUBLISHED rows (or all categories).
--    Write: nobody via the public API, only from the SQL editor.
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


-- ---------------------------------------------------------------------
-- No Storage buckets here on purpose: every image now lives on
-- Cloudflare R2 (no egress fees), which is what caused the previous
-- project to hit its quota. Keep it that way - don't upload new images
-- to Supabase Storage on this project either.
-- ---------------------------------------------------------------------
