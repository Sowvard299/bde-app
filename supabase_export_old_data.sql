-- =====================================================================
-- Génère les instructions INSERT pour recopier toutes les données
-- actuelles (catégories, partenaires, événements) vers le nouveau
-- projet Supabase. Les identifiants (id) sont préservés à l'identique,
-- important car certains sont écrits en dur dans le code du site.
--
-- À exécuter dans l'éditeur SQL de L'ANCIEN projet (qsaqxynxiwcbvxfndweb).
-- Le résultat s'affiche dans une seule cellule texte : clique dessus,
-- copie tout le contenu, colle-le et exécute-le dans l'éditeur SQL du
-- NOUVEAU projet (après avoir lancé supabase_new_project_schema.sql).
-- =====================================================================

with cats as (
  select string_agg(
    format(
      'insert into partner_categories (id, name, slug, sort_order) values (%L, %L, %L, %L);',
      id, name, slug, sort_order
    ),
    E'\n' order by sort_order
  ) as sql
  from partner_categories
),
parts as (
  select string_agg(
    format(
      'insert into partners (id, name, category_id, benefit, description, logo_url, address, latitude, longitude, website_url, phone, kind, is_published) values (%L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L);',
      id, name, category_id, benefit, description, logo_url, address, latitude, longitude, website_url, phone, kind, is_published
    ),
    E'\n' order by name
  ) as sql
  from partners
),
evts as (
  select string_agg(
    format(
      'insert into events (id, title, description, starts_at, ends_at, location_name, location_address, latitude, longitude, image_url, ticket_url, price_cents, is_published) values (%L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L);',
      id, title, description, starts_at, ends_at, location_name, location_address, latitude, longitude, image_url, ticket_url, price_cents, is_published
    ),
    E'\n' order by starts_at
  ) as sql
  from events
)
select
  coalesce(cats.sql, '-- (aucune categorie)') || E'\n\n'
  || coalesce(parts.sql, '-- (aucun partenaire)') || E'\n\n'
  || coalesce(evts.sql, '-- (aucun evenement)') as export_a_copier
from cats, parts, evts;
