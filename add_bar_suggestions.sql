-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
--
-- Cree la table qui recoit les bars proposes par les etudiants depuis
-- l'onglet Bars, plus le compartiment de stockage pour les photos de
-- carte qui vont avec.
--
-- Design volontairement different des autres tables du site : partners
-- et events sont lisibles par tout le monde (grant select) mais
-- modifiables seulement a la main, dans l'editeur SQL. bar_suggestions
-- fait l'inverse — n'importe quel visiteur peut y ecrire depuis le
-- formulaire, mais personne (l'application comprise) ne peut la relire
-- avec la cle anon. C'est une boite aux lettres a sens unique : seul le
-- tableau de bord Supabase, qui se connecte avec un acces complet, la
-- montre. Sans cette dissymetrie, n'importe qui pourrait aussi lire
-- l'adresse mail et les photos laissees par les autres.


-- ---------------------------------------------------------------------
-- 1. TABLE
-- ---------------------------------------------------------------------
create table bar_suggestions (
  id          uuid primary key default gen_random_uuid(),
  -- 'nouveau'  : un bar qui n'est pas encore sur la carte.
  -- 'existant' : une correction sur une fiche deja publiee (prix, horaires...).
  type        text        not null check (type in ('nouveau', 'existant')),
  nom         text        not null,
  adresse     text,
  notes       text,
  -- Chemins dans le compartiment bar-suggestions, pas des URL completes :
  -- le compartiment est prive, une URL seule ne suffirait pas a l'ouvrir.
  photos      text[]      not null default '{}',
  contact     text,
  -- Coche a la main une fois la proposition relue et, le cas echeant,
  -- ajoutee a data/bars-paris-v3.json. Sert juste a trier la table dans
  -- le tableau de bord ; rien dans l'application ne le lit.
  traite      boolean     not null default false,
  created_at  timestamptz not null default now()
);

comment on table bar_suggestions is
  'Bars proposes par les etudiants depuis /bars. Boite aux lettres : ecriture publique, lecture reservee au tableau de bord Supabase.';


-- ---------------------------------------------------------------------
-- 2. DROITS — la table est ecrite par n'importe qui, lue par personne
--    avec la cle anon (ni SELECT, ni UPDATE, ni DELETE ne sont accordes).
-- ---------------------------------------------------------------------
grant insert on public.bar_suggestions to anon;

alter table bar_suggestions enable row level security;

create policy "n'importe qui peut proposer un bar"
on bar_suggestions
for insert
to anon
with check (true);


-- ---------------------------------------------------------------------
-- 3. STOCKAGE DES PHOTOS
--    Prive (public = false), 8 Mo par fichier, images uniquement. Les
--    photos partent deja compressees par l'application (~1600px de
--    cote long) ; la limite ne sert qu'a couvrir le cas ou la
--    compression echoue et où le fichier d'origine part tel quel.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bar-suggestions',
  'bar-suggestions',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
set file_size_limit   = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "n'importe qui peut deposer une photo de bar"
on storage.objects
for insert
to anon
with check (bucket_id = 'bar-suggestions');


-- ---------------------------------------------------------------------
-- Pour consulter les propositions : onglet Table Editor du tableau de
-- bord Supabase, table bar_suggestions. Les photos se retrouvent avec
-- leur chemin dans l'onglet Storage > bar-suggestions.
-- select * from bar_suggestions where not traite order by created_at desc;
-- ---------------------------------------------------------------------
