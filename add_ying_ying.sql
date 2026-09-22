-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
--
-- Ajoute Ying Ying (traiteur asiatique), partenariat confirme par mail le
-- 18 septembre 2026 : -10% sur l'ensemble de la carte, menus exclus. La
-- restriction "hors menus" est ecrite dans l'avantage lui-meme, pas
-- seulement dans la description : c'est ce qui evite la discussion a la
-- caisse si l'etudiant n'a lu que le titre de la fiche.
--
-- Logo : photo de la devanture recadree en carre 512x512 (le badge rond
-- du logo est coupe par le bord de la photo source, inutilisable seul).
-- Deposee sur R2 a partners/ying-ying.jpg.

insert into partners (
  name, category_id, kind, benefit, description,
  address, latitude, longitude, logo_url, is_published
) values (
  'Ying Ying',
  '5dbfb7d6-dfbf-4753-a0cc-cc7f2e58fd86',  -- Restauration
  'partenaire',
  '-10% sur toute la carte (hors menus)',
  chr(129378) || ' -10% sur toute la carte, hors menus' || chr(10) || 'Sur pr' || chr(233) ||
    'sentation de la carte ' || chr(233) || 'tudiante, chez ce traiteur asiatique de Tolbiac.',
  '49 Rue de Tolbiac, 75013 Paris',
  48.827542,
  2.371135,
  'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/ying-ying.jpg',
  true
);

-- Verification : la fiche doit ressortir avec son accent et son emoji intacts.
-- select name, benefit, description from partners where name = 'Ying Ying';
