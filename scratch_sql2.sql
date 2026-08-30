-- 1) NEONESS BNF : retirer la phrase d'autorisation d'affichage
update partners
set description = 'Offre : frais d' || chr(39) || 'adh' || chr(233) || 'sion offerts (au lieu de 49' || chr(8364) || ') et mensualit' || chr(233) || ' ' || chr(224) || ' 29,99' || chr(8364) || ' au lieu de 39,99' || chr(8364) || ' sur l' || chr(39) || 'abonnement PRIME 52 semaines, qui comporte les avantages suivants :' || chr(10) || '- Carte duo vendredi/samedi' || chr(10) || '- Parrainage = 1 mois offert' || chr(10) || '- Pause vacances' || chr(10) || '- Cours collectifs' || chr(10) || '- Acc' || chr(232) || 's ' || chr(224) || ' tous les NEONESS et KEEPCOOL' || chr(10) || '- Coach disponible si questions sur machines, entra' || chr(238) || 'nement, etc.'
where name = 'NEONESS BNF';

-- 2) Supprimer Pizzeria Da Marco
delete from partners where name ilike '%Da Marco%';

-- 3) Ajouter La Marquise (bon plan, avec coordonnees pour la carte)
insert into partners (name, category_id, benefit, description, address, latitude, longitude, kind, is_published)
values (
  'La Marquise',
  (select id from partner_categories where slug = 'restauration'),
  'Happy hour jusqu' || chr(39) || chr(224) || ' 22h : 4,50' || chr(8364) || ' la blonde, cocktails d' || chr(232) || 's 6' || chr(8364) || ', mocktails ' || chr(224) || ' 5' || chr(8364),
  'Bar tr' || chr(232) || 's proche de l' || chr(39) || 'IAE.' || chr(10) || chr(10) || 'Happy hour jusqu' || chr(39) || chr(224) || ' 22h :' || chr(10) || '- 4,50' || chr(8364) || ' la blonde et la bonne bi' || chr(232) || 're' || chr(10) || '- Cocktails en HH d' || chr(232) || 's 6' || chr(8364) || ' / Mocktails ' || chr(224) || ' 5' || chr(8364),
  '86 Rue Nationale, 75013 Paris',
  48.8272184,
  2.3664667,
  'bon_plan',
  true
);
