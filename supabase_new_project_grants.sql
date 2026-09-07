-- A executer dans l'editeur SQL du NOUVEAU projet.
-- "Automatically expose new tables" etait desactive a la creation, donc
-- le role anon n'a jamais recu la permission de lire les tables (la RLS
-- ne suffit pas a elle seule, il faut aussi le GRANT de base).
grant usage on schema public to anon, authenticated;
grant select on public.partner_categories, public.partners, public.events to anon, authenticated;
