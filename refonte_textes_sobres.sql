-- Refonte des textes : partenaires et evenements, sur un ton sobre.
-- Intertitres en "# ", prix avec espace insecable avant les euros et les %.
-- Lien billetterie generique pour le Stade Francais.

begin;

update partners set
  benefit = '10,50' || chr(160) || chr(8364) || ' la s' || chr(233) || 'ance au lieu de 18' || chr(160) || chr(8364) || ', dans tout le r' || chr(233) || 'seau Arkose et Mroc',
  description = '# L''offre' || chr(10) || '- 10,50' || chr(160) || chr(8364) || ' la s' || chr(233) || 'ance au lieu de 18' || chr(160) || chr(8364) || ' (prix public)' || chr(10) || '- Billet d' || chr(233) || 'mat' || chr(233) || 'rialis' || chr(233) || ', envoy' || chr(233) || ' par email' || chr(10) || '- Sans date limite d''utilisation' || chr(10) || '- Non nominatif : il peut ' || chr(234) || 'tre offert ou partag' || chr(233) || chr(10) || '- -10' || chr(160) || '% sur les consommations en salle, sur pr' || chr(233) || 'sentation de la carte ' || chr(233) || 'tudiante' || chr(10) || chr(10) || '# Salles concern' || chr(233) || 'es' || chr(10) || chr(206) || 'le-de-France : CAO Saint-Denis, Chevaleret (Paris 13), Didot (Paris 14), Nation (Paris 20), Montmartre (Paris 18), Strasbourg-Saint-Denis, Issy, Pantin, Pont-de-S' || chr(232) || 'vres, Montreuil, Nanterre, Massy.' || chr(10) || 'R' || chr(233) || 'gions et Europe : Lyon (Mroc 1, 2 et 3), Lille, Bordeaux, Toulouse, Marseille, Nice, Angers, Rouen, Tours, Genevois, La Rochelle, Bruxelles, Madrid.' || chr(10) || chr(10) || '# Commande' || chr(10) || 'Achat sur HelloAsso. Les billets sont envoy' || chr(233) || 's par email par le BDE apr' || chr(232) || 's validation de la commande.'
where id = '6b7d0bd5-779f-41df-9149-dc676674e486';

update partners set
  benefit = '-20' || chr(160) || '% sur toute la carte',
  description = '# L''offre' || chr(10) || '-20' || chr(160) || '% sur toute la carte, boissons et restauration comprises, sur pr' || chr(233) || 'sentation de la carte ' || chr(233) || 'tudiante.' || chr(10) || chr(10) || '# Conditions' || chr(10) || 'La remise s''applique aux consommations de l''' || chr(233) || 'tudiant qui pr' || chr(233) || 'sente sa carte. Chaque personne pr' || chr(233) || 'sente la sienne.'
where id = 'c740c2b8-caaa-42de-9411-abffca9e89b5';

update partners set
  benefit = '-10' || chr(160) || '% sur les formules sandwich, boisson et dessert',
  description = '# Formules ' || chr(224) || ' -10' || chr(160) || '%' || chr(10) || '- Sandwich et boisson : 7,11' || chr(160) || chr(8364) || ' au lieu de 7,90' || chr(160) || chr(8364) || chr(10) || '- Sandwich et dessert : 8,19' || chr(160) || chr(8364) || ' au lieu de 9,10' || chr(160) || chr(8364) || chr(10) || '- Sandwich, dessert et boisson : 9,72' || chr(160) || chr(8364) || ' au lieu de 10,80' || chr(160) || chr(8364) || chr(10) || chr(10) || '# Carte de fid' || chr(233) || 'lit' || chr(233) || chr(10) || 'Elle se cr' || chr(233) || 'e en boutique, en indiquant ' || chr(171) || ' IAE PS ' || chr(187) || ' suivi du nom et du pr' || chr(233) || 'nom.' || chr(10) || '- 5' || chr(160) || chr(8364) || ' de remise ' || chr(224) || ' l''ouverture' || chr(10) || '- Une formule sandwich, dessert et boisson offerte ' || chr(224) || ' 200 points (1' || chr(160) || chr(8364) || ' d' || chr(233) || 'pens' || chr(233) || ' = 1 point)'
where id = '662aef69-42e1-4fbd-b9e3-0aad17dc6b4b';

update partners set
  benefit = 'Happy hour du lundi au vendredi, de 16 h ' || chr(224) || ' la fermeture',
  description = '# Happy hour' || chr(10) || 'Du lundi au vendredi, de 16 h ' || chr(224) || ' la fermeture.' || chr(10) || '- Blondinette 50 cl : 6' || chr(160) || chr(8364) || chr(10) || '- Vin 25 cl (cinsault ros' || chr(233) || ', merlot rouge, chardonnay blanc) : 6' || chr(160) || chr(8364) || chr(10) || '- Cocktail sans alcool 30 cl : 6' || chr(160) || chr(8364) || chr(10) || '- Cocktail du soir : 7' || chr(160) || chr(8364)
where id = '76c415c7-be40-496b-aac4-4a05ba421561';

update partners set
  benefit = 'Concerts ' || chr(224) || ' 10' || chr(160) || chr(8364) || ' au lieu de 15 ' || chr(224) || ' 19' || chr(160) || chr(8364) || ', tarif ' || chr(171) || ' Jammers ' || chr(187) || ' sur les boissons',
  description = '# Concerts' || chr(10) || 'Billets ' || chr(224) || ' 10' || chr(160) || chr(8364) || ' au lieu de 15 ' || chr(224) || ' 19' || chr(160) || chr(8364) || ', sur pr' || chr(233) || 'sentation de la carte ' || chr(233) || 'tudiante IAE.' || chr(10) || chr(10) || '# Tarif ' || chr(171) || ' Jammers ' || chr(187) || ' sur les boissons' || chr(10) || '- Soft : 3' || chr(160) || chr(8364) || chr(10) || '- Vin : 4' || chr(160) || chr(8364) || chr(10) || '- Pinte de blonde : 5' || chr(160) || chr(8364) || chr(10) || '- IPA ou blanche : 7' || chr(160) || chr(8364) || chr(10) || '- Cocktail : 10' || chr(160) || chr(8364) || chr(10) || chr(10) || '# R' || chr(233) || 'servation' || chr(10) || 'Pr' || chr(233) || 'venir JASS Club par email avant le concert pour r' || chr(233) || 'server une place au tarif r' || chr(233) || 'duit. Sans r' || chr(233) || 'servation, l''entr' || chr(233) || 'e d' || chr(233) || 'pend du remplissage de la salle : si le concert est complet, le tarif ' || chr(224) || ' 10' || chr(160) || chr(8364) || ' n''est plus garanti.'
where id = 'e516ca0d-a916-4291-9f5f-d8e34b789dc9';

update partners set
  benefit = 'Happy hour de 16 h ' || chr(224) || ' 22 h : blonde ' || chr(224) || ' 4,50' || chr(160) || chr(8364) || ', cocktails d' || chr(232) || 's 6' || chr(160) || chr(8364) || ', mocktails ' || chr(224) || ' 5' || chr(160) || chr(8364),
  description = 'Bar ' || chr(224) || ' quelques minutes de l''IAE.' || chr(10) || chr(10) || '# Happy hour, de 16 h ' || chr(224) || ' 22 h' || chr(10) || '- Blonde : 4,50' || chr(160) || chr(8364) || chr(10) || '- Cocktails : ' || chr(224) || ' partir de 6' || chr(160) || chr(8364) || chr(10) || '- Mocktails : 5' || chr(160) || chr(8364)
where id = '1d2cf917-56d8-4c61-bbd6-98f8b0fc6e88';

update partners set
  benefit = 'Frais d''adh' || chr(233) || 'sion offerts + 29,99' || chr(160) || chr(8364) || '/mois au lieu de 39,99' || chr(160) || chr(8364) || ' (abonnement Prime 52 semaines)',
  description = '# L''offre ' || chr(233) || 'tudiante' || chr(10) || '- Frais d''adh' || chr(233) || 'sion offerts, soit 49' || chr(160) || chr(8364) || ' d''' || chr(233) || 'conomie' || chr(10) || '- Abonnement Prime 52 semaines ' || chr(224) || ' 29,99' || chr(160) || chr(8364) || ' par mois au lieu de 39,99' || chr(160) || chr(8364) || chr(10) || chr(10) || '# Inclus dans l''abonnement Prime' || chr(10) || '- Acc' || chr(232) || 's ' || chr(224) || ' plus de 270 clubs Neoness et Keepcool en France' || chr(10) || '- Carte duo : un invit' || chr(233) || ' gratuit le vendredi, le samedi et pendant les vacances scolaires' || chr(10) || '- Cours collectifs illimit' || chr(233) || 's, de 15 ' || chr(224) || ' 20 personnes, encadr' || chr(233) || 's par des coachs dipl' || chr(244) || 'm' || chr(233) || 's d''' || chr(201) || 'tat' || chr(10) || '- Coachs pr' || chr(233) || 'sents en permanence sur le plateau' || chr(10) || '- Suspension de l''abonnement possible pendant les vacances' || chr(10) || '- Un mois offert pour chaque personne parrain' || chr(233) || 'e' || chr(10) || '- Plus de 500 cours vid' || chr(233) || 'o ' || chr(224) || ' la demande' || chr(10) || chr(10) || '# Comment en profiter' || chr(10) || 'Se pr' || chr(233) || 'senter au club Neoness BNF avec une carte ' || chr(233) || 'tudiante en cours de validit' || chr(233) || ' ou un certificat de scolarit' || chr(233) || '. L''offre est valable uniquement dans ce club.'
where id = '312bdcfb-a7c3-4b17-b63c-8a79cfd19bb1';

update partners set
  benefit = '30 ' || chr(224) || ' 40 coupons gratuits ou ' || chr(224) || ' prix r' || chr(233) || 'duit (culture, sport, loisirs), offerts par la Ville de Paris',
  description = 'Un ch' || chr(233) || 'quier num' || chr(233) || 'rique offert par la Ville de Paris aux 14-25 ans : 30 ' || chr(224) || ' 40 coupons gratuits ou ' || chr(224) || ' prix r' || chr(233) || 'duit (expositions, cin' || chr(233) || 'ma, sport, sorties), valables de juin ' || chr(224) || ' septembre.' || chr(10) || chr(10) || '# Contenu' || chr(10) || '- 30 ' || chr(224) || ' 40 coupons ' || chr(224) || ' utiliser entre juin et septembre' || chr(10) || '- L''inscription au Kiosque Jeunes, qui donne acc' || chr(232) || 's ' || chr(224) || ' des tarifs r' || chr(233) || 'duits ou gratuits toute l''ann' || chr(233) || 'e' || chr(10) || chr(10) || '# Conditions' || chr(10) || '- ' || chr(202) || 'tre n' || chr(233) || ' entre le 1er octobre 2000 et le 30 septembre 2012' || chr(10) || '- Habiter, ' || chr(233) || 'tudier, travailler ou ' || chr(234) || 'tre engag' || chr(233) || ' ' || chr(224) || ' Paris, ou dans une ville partenaire' || chr(10) || chr(10) || '# D' || chr(233) || 'marches' || chr(10) || '1. R' || chr(233) || 'server gratuitement le Pass Jeunes sur passjeunes.paris.fr' || chr(10) || '2. Le retirer dans les 8 jours dans l''un des points de retrait indiqu' || chr(233) || 's sur le site'
where id = '055475d3-b4a6-4163-bd9b-f6558511cb35';

update partners set
  benefit = 'Pizzas medium ' || chr(224) || ' emporter ' || chr(224) || ' 8,95' || chr(160) || chr(8364) || ' sur pr' || chr(233) || 'sentation de la carte ' || chr(233) || 'tudiante',
  description = '# Pizzas medium ' || chr(224) || ' emporter : 8,95' || chr(160) || chr(8364) || chr(10) || 'Toutes les pizzas medium ' || chr(224) || ' emporter, sur pr' || chr(233) || 'sentation de la carte ' || chr(233) || 'tudiante. Hors livraison. Suppl' || chr(233) || 'ment possible, par exemple 1' || chr(160) || chr(8364) || ' pour une pizza premium.' || chr(10) || chr(10) || '# Buffet du midi : 12' || chr(160) || chr(8364) || chr(10) || 'Assortiment de pizzas et fontaine ' || chr(224) || ' boissons ' || chr(224) || ' volont' || chr(233) || ', chaque midi.' || chr(10) || chr(10) || '# Menu de la semaine : 12' || chr(160) || chr(8364) || chr(10) || 'Une pizza au choix parmi cinq, une entr' || chr(233) || 'e (soupe ou salade) ou un dessert, et une boisson. Midi et soir, du lundi au vendredi, hors jours f' || chr(233) || 'ri' || chr(233) || 's.'
where id = '5f0cb98f-2718-4281-b314-184e8a2f3b4f';

update partners set
  benefit = 'Tarif ' || chr(233) || 'tudiant sur la billetterie, frais de gestion offerts',
  description = '# L''offre ' || chr(233) || 'tudiante' || chr(10) || 'Sur pr' || chr(233) || 'sentation de la carte ' || chr(233) || 'tudiante :' || chr(10) || '- Tarif r' || chr(233) || 'duit sur la billetterie' || chr(10) || '- Frais de gestion offerts' || chr(10) || chr(10) || '# Les soirs de match' || chr(10) || '- Before avec DJ set avant le coup d''envoi' || chr(10) || '- Happy hour ' || chr(224) || ' -15' || chr(160) || '% jusqu''au coup de sifflet final (boissons ' || chr(224) || ' l''unit' || chr(233) || ', paiement cashless)' || chr(10) || '- Beer pong, cornhole et baby-foot' || chr(10) || '- Bodega des Lys apr' || chr(232) || 's le match',
  website_url = 'https://billetterie.stade.fr/fr/'
where id = '5bdfcf9e-6795-42fb-b87f-613965ce83c4';

update partners set
  benefit = 'Pass 6 places pour choisir ses spectacles ' || chr(224) || ' la carte',
  description = '# Pass 6 places' || chr(10) || 'Les spectacles se choisissent depuis le compte personnel, apr' || chr(232) || 's l''achat. Le pass s''utilise seul ou ' || chr(224) || ' plusieurs, sur un ou plusieurs spectacles. Rechargeable par lot de 6 places, valable sur la saison 2026-2027. Modifications possibles jusqu''' || chr(224) || ' 72 h avant la repr' || chr(233) || 'sentation.' || chr(10) || chr(10) || '# Contact' || chr(10) || 'reservation@theatredunois.org, 01 45 84 72 00'
where id = '59897ddb-13ff-4a54-ac8d-5c1b759178df';

update partners set
  benefit = 'Menu ' || chr(233) || 'tudiant ' || chr(224) || ' 8,90' || chr(160) || chr(8364) || ' (' || chr(224) || ' emporter, le midi uniquement)',
  description = '# Menu ' || chr(233) || 'tudiant : 8,90' || chr(160) || chr(8364) || chr(10) || chr(192) || ' emporter, le midi uniquement.' || chr(10) || '- Entr' || chr(233) || 'e au choix : 2 nems (poulet, porc, l' || chr(233) || 'gumes ou crevette), 2 gyozas ou 2 bouch' || chr(233) || 'es vapeur, ou une boisson (Ice Tea, Coca-Cola, Coca z' || chr(233) || 'ro, Oasis)' || chr(10) || '- Plat au choix : poulet, l' || chr(233) || 'gumes saut' || chr(233) || 's, porc, b' || chr(339) || 'uf ou poisson (canard laqu' || chr(233) || ' ou crevette piquante : +1' || chr(160) || chr(8364) || ')' || chr(10) || '- Accompagnement au choix : riz blanc, riz cantonais, riz tha' || chr(239) || 'landais ou nouilles saut' || chr(233) || 'es aux l' || chr(233) || 'gumes'
where id = 'e9a6a818-93fe-4055-8a6b-f01c5244c01a';

update partners set
  benefit = '-10' || chr(160) || '% sur toute la carte (hors menus)',
  description = '# L''offre' || chr(10) || '-10' || chr(160) || '% sur toute la carte, hors menus, sur pr' || chr(233) || 'sentation de la carte ' || chr(233) || 'tudiante.' || chr(10) || chr(10) || 'Traiteur asiatique, rue de Tolbiac.'
where id = '13c2a7b5-b0a4-40f8-99dd-953ab3c60c58';

update events set
  description = 'Soir' || chr(233) || 'e de rentr' || chr(233) || 'e sur la p' || chr(233) || 'niche du CROUS. Venez avec les couleurs de votre promo. Bar ouvert ' || chr(224) || ' tous, entr' || chr(233) || 'e gratuite.' || chr(10) || chr(10) || '# Tarif ' || chr(233) || 'tudiant jusqu''' || chr(224) || ' 23 h' || chr(10) || 'Sur pr' || chr(233) || 'sentation d''un justificatif.' || chr(10) || '- Soft : 1,30' || chr(160) || chr(8364) || chr(10) || '- Pinte de blonde : 4,50' || chr(160) || chr(8364) || chr(10) || '- Cocktail : 6' || chr(160) || chr(8364)
where id = '96812dd8-c1bf-44ba-9da3-7ad1a6073301';

update events set
  title = 'Sorbonne Running #1',
  description = 'Premi' || chr(232) || 're sortie du club running du BDE.' || chr(10) || chr(10) || 'D' || chr(233) || 'part de l''IAE Paris Sorbonne pour une boucle de 5 km, arriv' || chr(233) || 'e sur les quais et fin de soir' || chr(233) || 'e dans un bar. Ouvert ' || chr(224) || ' tous les niveaux.'
where id = '58122c94-8c90-4487-8734-4b173746984b';

update events set
  title = 'Escalade ' || chr(224) || ' Arkose Chevaleret',
  description = 'S' || chr(233) || 'ance d''escalade entre ' || chr(233) || 'tudiants, ouverte ' || chr(224) || ' tous les niveaux.' || chr(10) || chr(10) || 'Tarif partenaire Arkose ' || chr(215) || ' Mroc : 10,50' || chr(160) || chr(8364) || ' la s' || chr(233) || 'ance au lieu de 18' || chr(160) || chr(8364) || '.'
where id = '27e95000-b2e1-4cf5-83ba-b905fe086fc2';

update events set
  description = 'Premi' || chr(232) || 're Sorbonne Night de l''ann' || chr(233) || 'e, au Violon Dingue.' || chr(10) || chr(10) || '# Happy hour jusqu''' || chr(224) || ' 22 h' || chr(10) || '- Pinte de blonde : 5' || chr(160) || chr(8364) || chr(10) || '- Long drinks (gin tonic, vodka jus) : 7' || chr(160) || chr(8364) || chr(10) || '- Cocktails (sex on the beach, gin fizz, mai tai, tequila sunrise) : 8' || chr(160) || chr(8364) || chr(10) || chr(10) || 'Bar ouvert ' || chr(224) || ' tous. Le tarif ' || chr(233) || 'tudiant s''applique ' || chr(224) || ' chaque consommateur sur pr' || chr(233) || 'sentation d''un justificatif en cours de validit' || chr(233) || '.'
where id = '1fe3e865-36dd-4c88-b9ab-99fd453e50c4';

update events set
  title = 'WEICUP Latino Edition',
  description = 'Le week-end d''int' || chr(233) || 'gration du BDE, ' || chr(233) || 'dition Latino.'
where id = '8e66e3b4-918d-4370-bc14-bcf52c86f0d6';

update events set
  title = 'Sorbonne Running #2',
  description = 'Deuxi' || chr(232) || 'me sortie du club running du BDE. D' || chr(233) || 'part et arriv' || chr(233) || 'e communiqu' || chr(233) || 's prochainement. Ouvert ' || chr(224) || ' tous les niveaux.'
where id = '9b75c341-49fd-43cb-a6f7-cff50ecc7961';

update events set
  title = 'Sorbonne Running ' || chr(215) || ' ASICS',
  description = 'Sortie running organis' || chr(233) || 'e avec ASICS, au d' || chr(233) || 'part de la boutique ASICS de Ch' || chr(226) || 'telet, avec la possibilit' || chr(233) || ' de tester une nouvelle paire pendant la course.' || chr(10) || chr(10) || 'Places gratuites et limit' || chr(233) || 'es. Inscription obligatoire avec le bouton ' || chr(171) || ' R' || chr(233) || 'server ma place ' || chr(187) || '.'
where id = 'ba0b26fa-c749-4d5c-bac9-0e8e57d8ae4a';

commit;

-- Controle : 13 partenaires et 7 evenements, sans emoji.
-- select name, benefit from partners where is_published order by name;
-- select title from events where is_published order by starts_at;
