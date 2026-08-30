-- 1) Distinction Partenaires / Bons plans
alter table partners add column if not exists kind text not null default 'bon_plan';
alter table partners drop constraint if exists partners_kind_check;
alter table partners add constraint partners_kind_check check (kind in ('partenaire', 'bon_plan'));

-- 2) Le Pizzeria Da Marco (test) reste en "bon plan" (deja le cas par defaut)
update partners set kind = 'bon_plan' where name ilike '%Da Marco%';

-- 3) Horaire WEICUP -> 19h
update events
set starts_at = '2026-09-25 19:00:00+02'
where id = '1747347c-576e-4e93-bb5e-55f63eab6787';

-- 4) Ajout NEONESS BNF
insert into partners (name, category_id, benefit, description, logo_url, address, phone, kind, is_published)
values (
  'NEONESS BNF',
  (select id from partner_categories where slug = 'sport'),
  'Frais d' || chr(39) || 'adh' || chr(233) || 'sion offerts (au lieu de 49' || chr(8364) || ') + 29,99' || chr(8364) || '/mois au lieu de 39,99' || chr(8364) || ' sur l' || chr(39) || 'abonnement PRIME 52 semaines',
  'Vous ' || chr(234) || 'tes autoris' || chr(233) || 's ' || chr(224) || ' afficher NEONESS BNF (Biblioth' || chr(232) || 'que Fran' || chr(231) || 'ois Mitterrand) sur le site du BDE.' || chr(10) || 'Adresse : 123 avenue de France, 75013 Paris ' || chr(8212) || ' T' || chr(233) || 'l' || chr(233) || 'phone : 01 80 89 95 51.' || chr(10) || chr(10) || 'Offre : frais d' || chr(39) || 'adh' || chr(233) || 'sion offerts (au lieu de 49' || chr(8364) || ') et mensualit' || chr(233) || ' ' || chr(224) || ' 29,99' || chr(8364) || ' au lieu de 39,99' || chr(8364) || ' sur l' || chr(39) || 'abonnement PRIME 52 semaines, qui comporte les avantages suivants :' || chr(10) || '- Carte duo vendredi/samedi' || chr(10) || '- Parrainage = 1 mois offert' || chr(10) || '- Pause vacances' || chr(10) || '- Cours collectifs' || chr(10) || '- Acc' || chr(232) || 's ' || chr(224) || ' tous les NEONESS et KEEPCOOL' || chr(10) || '- Coach disponible si questions sur machines, entra' || chr(238) || 'nement, etc.',
  'https://qsaqxynxiwcbvxfndweb.supabase.co/storage/v1/object/public/event-images/neoness.jpg',
  '123 avenue de France, 75013 Paris',
  '01 80 89 95 51',
  'partenaire',
  true
);

-- 5) Ajout Arkose x Mroc
insert into partners (name, category_id, benefit, description, logo_url, website_url, kind, is_published)
values (
  'Arkose ' || chr(215) || ' Mroc',
  (select id from partner_categories where slug = 'sport'),
  '10,50' || chr(8364) || ' la s' || chr(233) || 'ance au lieu de 18' || chr(8364) || ' dans tout le r' || chr(233) || 'seau Arkose & Mroc',
  'Partenariat exclusif Arkose ' || chr(215) || ' Mroc ' || chr(215) || ' BDE : acc' || chr(232) || 's privil' || chr(233) || 'gi' || chr(233) || ' ' || chr(224) || ' l' || chr(39) || 'ensemble des salles d' || chr(39) || 'escalade du r' || chr(233) || 'seau Arkose & Mroc (' || chr(206) || 'le-de-France, R' || chr(233) || 'gions, Bruxelles, Madrid) ' || chr(224) || ' tarif tr' || chr(232) || 's r' || chr(233) || 'duit !' || chr(10) || chr(10) || 'Vos avantages :' || chr(10) || '- 10,50' || chr(8364) || ' la s' || chr(233) || 'ance au lieu de 18' || chr(8364) || ' (prix public)' || chr(10) || '- Format 100% d' || chr(233) || 'mat' || chr(233) || 'rialis' || chr(233) || ' : billet re' || chr(231) || 'u directement par mail' || chr(10) || '- Sans limite de validit' || chr(233) || ' : utilisable quand tu veux, sans pression de date' || chr(10) || '- Non nominatif : tu peux en acheter pour tes amis ou tes proches' || chr(10) || '- Bonus carte BDE : pr' || chr(233) || 'sente ta carte de partenariat BDE ' || chr(224) || ' l' || chr(39) || 'accueil pour -10% sur toutes tes consommations (boissons, restauration) dans les salles !' || chr(10) || chr(10) || 'O' || chr(249) || ' l' || chr(39) || 'utiliser ? Dans toutes les salles du r' || chr(233) || 'seau :' || chr(10) || chr(206) || 'le-de-France : CAO Saint-Denis, Chevaleret (Paris 13), Didot (Paris 14), Nation (Paris 20), Montmartre (Paris 18), Strasbourg-Saint-Denis, Issy, Pantin, Pont-de-S' || chr(232) || 'vres, Montreuil, Nanterre, Massy.' || chr(10) || 'R' || chr(233) || 'gions & Europe : Lyon (Mroc 1, 2, 3), Lille, Bordeaux, Toulouse, Marseille, Nice, Angers, Rouen, Tours, Genevois, La Rochelle, Bruxelles et Madrid.' || chr(10) || chr(10) || 'Attention : les tickets sont envoy' || chr(233) || 's par mail par le BDE apr' || chr(232) || 's validation de la commande.',
  'https://qsaqxynxiwcbvxfndweb.supabase.co/storage/v1/object/public/event-images/arkose.jpeg',
  'https://www.helloasso.com/associations/nouveau-bureau-des-etudiants-de-l-institut-d-administration-des-entreprises-de-paris/evenements/pass-escalade-arkose-et-mroc-x-bde',
  'partenaire',
  true
);
