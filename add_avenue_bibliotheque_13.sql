-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
--
-- Ajoute L'Avenue Bibliotheque 13, partenariat confirme par David HOUDET
-- le 10 septembre 2026 : 20% sur l'ensemble de la carte boissons et
-- restauration, une carte etudiante valable pour une personne et non
-- pour une table.
--
-- Les caracteres accentues et les emoji passent par chr() pour survivre
-- au copier-coller ; l'ASCII reste en clair pour que le texte se relise.

insert into partners (
  name, category_id, kind, benefit, description,
  address, latitude, longitude, website_url, is_published
) values (
  'L' || chr(39) || 'Avenue Biblioth' || chr(232) || 'que 13',
  '5dbfb7d6-dfbf-4753-a0cc-cc7f2e58fd86',  -- Restauration
  'partenaire',
  '-20% sur toute la carte',
  chr(127869) || ' -20% sur toute la carte' || chr(10) || 'Boissons et restauration comprises, sur pr' ||
    chr(233) || 'sentation de la carte ' || chr(233) || 'tudiante.' || chr(10) || chr(10) || chr(128100) ||
    ' Une carte par personne' || chr(10) || 'La remise porte sur les consommations de chacun, pas sur l' ||
    chr(39) || 'addition de la table : chaque ' || chr(233) || 'tudiant pr' || chr(233) ||
    'sente sa propre carte pour en b' || chr(233) || 'n' || chr(233) || 'ficier.',
  '120 Avenue de France, 75013 Paris',
  48.831118,
  2.37653,
  'https://wiicmenu-qrcode.com/app/restaurantWebSite.php?resto=914',
  true
);

-- Verification : la fiche doit ressortir avec son accent et ses deux
-- paragraphes intacts.
-- select name, benefit, description from partners where address like '120 Avenue de France%';
