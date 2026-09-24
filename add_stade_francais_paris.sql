-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
--
-- Ajoute le Stade Français Paris (rugby) comme partenaire : offre
-- etudiante sur la billetterie, avant-match anime et happy hour au
-- Cashless. Range en 'partenaire' (accord negocie), categorie Sport.
--
-- Pas d'adresse ni de coordonnees : la piece jointe n'en donnait pas et
-- je prefere laisser vide plutot que deviner un stade. Sans adresse, la
-- fiche n'apparait pas sur la carte des partenaires mais reste visible
-- dans la liste -- ajoute-la a la main si tu veux l'y voir.
--
-- Le lien pointe directement vers la billetterie du prochain match
-- etudiant (SF Paris - LOU) : le bouton "Voir le site" de la fiche y
-- renverra. Le lien video (teaser YouTube) n'est pas repris : son URL
-- arrivait coupee par un retour a la ligne dans le message d'origine,
-- et un lien casse sur la fiche serait pire que pas de lien du tout.
--
-- Logo : le fichier source (contenue/LOGO PARTENAIRE/stade fr.png) est
-- un visuel promotionnel 678x381 avec le blason au centre sur un fond
-- d'eclairs roses. Recadre en carre resserre sur le blason seul (42%
-- de la largeur d'origine, soit 284x284), pour que "SF PARIS" reste
-- lisible une fois reduit a la taille d'une vignette au lieu de se
-- perdre dans le bruit des eclairs. Deposee sur R2 a
-- partners/stade-francais-paris.png.

insert into partners (
  name, category_id, kind, benefit, description,
  website_url, logo_url, is_published
) values (
  'Stade Fran' || chr(231) || 'ais Paris',
  '77282ceb-e4d5-462e-83a2-5d25d3bdce53',  -- Sport
  'partenaire',
  'Tarif ' || chr(233) || 'tudiant sur la billetterie, frais de gestion offerts',
  chr(127945) || ' Offre ' || chr(233) || 'tudiante Stade Fran' || chr(231) || 'ais Paris' ||
    chr(10) || 'Sur pr' || chr(233) || 'sentation de la carte ' || chr(233) || 'tudiante :' ||
    chr(10) || chr(10) || chr(8226) || ' Tarif avantag' || chr(233) || ' sur la billetterie' ||
    chr(10) || chr(8226) || ' Frais de gestion offerts' || chr(10) || chr(8226) || ' Un Before avec DJ Set en avant-match' ||
    chr(10) || chr(8226) || ' Happy Hour -15% jusqu' || chr(39) || 'au coup de sifflet final (boissons ' ||
    chr(224) || ' l' || chr(39) || 'unit' || chr(233) || ', en Cashless)' || chr(10) || chr(8226) || ' Animations : Beer Pong, Corn-hole, Baby-foot' ||
    chr(10) || chr(8226) || ' Bodega des Lys en apr' || chr(232) || 's-match',
  'https://billetterie.stade.fr/fr/acheter/match-etudiant-grand-public-sf-paris-lou-rugby-2026-3vre05ytvc32/plan#bk657d105e-zone',
  'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/stade-francais-paris.png',
  true
);

-- Verification : la fiche doit ressortir avec ses accents et ses puces intacts.
-- select name, benefit, description from partners where name = 'Stade Français Paris';
