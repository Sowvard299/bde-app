-- Agenda d'octobre 2026 : 10 nouveaux evenements, escalade du 12 octobre
-- (copie du lieu de la seance du 15 septembre) et run ASICS passe en complet.
-- Heures d'hiver a partir du 25 octobre : +01:00 au lieu de +02:00.

begin;

insert into events (
  title, description, starts_at, ends_at, location_name, location_address,
  latitude, longitude, image_url, ticket_url, price_cents, is_published
) values
(
  'Sorbonne Games',
  'Soir' || chr(233) || 'e jeux de soci' || chr(233) || 't' || chr(233) || ' et jeux vid' || chr(233) || 'o sur le rooftop de la Barge du CROUS.',
  '2026-10-07T19:00:00+02:00',
  '2026-10-07T23:00:00+02:00',
  'Rooftop de la Barge du CROUS',
  'Quai Fran' || chr(231) || 'ois Mauriac, Port de la Gare, 75013 Paris',
  48.8355,
  2.3745,
  'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/activities/sorbonne-game.png',
  null,
  null,
  true
),
(
  'Soir' || chr(233) || 'e impro au Point Virgule',
  'Soir' || chr(233) || 'e d''humour et d''improvisation au Point Virgule.',
  '2026-10-09T20:00:00+02:00',
  null,
  'Le Point Virgule',
  '7 rue Sainte-Croix de la Bretonnerie, 75004 Paris',
  48.857828,
  2.356931,
  'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/activities/culture.jpeg',
  null,
  1000,
  true
),
(
  'Stade Fran' || chr(231) || 'ais Paris ' || chr(215) || ' Montpellier',
  'Match de rugby au stade Jean-Bouin, avec l''offre ' || chr(233) || 'tudiante du partenariat Stade Fran' || chr(231) || 'ais : tarif r' || chr(233) || 'duit, before avec DJ set et happy hour pendant le match.',
  '2026-10-10T14:00:00+02:00',
  null,
  'Stade Jean-Bouin',
  '20-40 avenue du G' || chr(233) || 'n' || chr(233) || 'ral Sarrail, 75016 Paris',
  48.8434,
  2.253,
  'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/stade-francais-paris.jpg',
  'https://billetterie.stade.fr/fr/acheter/match-etudiant-grand-public-sf-paris-montpellier-hr-2026-1vsl8zn3k4tl/plan#bk87dc5a14-zone',
  null,
  true
),
(
  'PSG Handball ' || chr(215) || ' Toulouse',
  'Match de handball au stade Pierre-de-Coubertin. Billets via la billetterie du BDE.',
  '2026-10-10T19:00:00+02:00',
  null,
  'Stade Pierre-de-Coubertin',
  '82 avenue Georges Lafont, 75016 Paris',
  48.8385,
  2.256,
  null,
  'https://www.helloasso.com/associations/nouveau-bureau-des-etudiants-de-l-institut-d-administration-des-entreprises-de-paris/evenements/match-handball-psg-vs-toulouse',
  null,
  true
),
(
  'Sorbonne Running ' || chr(215) || ' Solaria',
  'Sortie running suivie d''une d' || chr(233) || 'gustation chez Solaria, rue Saint-Honor' || chr(233) || '.',
  '2026-10-11T11:00:00+02:00',
  null,
  'Solaria',
  '154 rue Saint-Honor' || chr(233) || ', 75001 Paris',
  48.862033,
  2.3401,
  'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/events/running-club-jaune.png',
  'https://www.instagram.com/solaria_paris/',
  null,
  true
),
(
  'Sorbonne Night #2',
  'Deuxi' || chr(232) || 'me Sorbonne Night de l''ann' || chr(233) || 'e. Lieu et tarifs communiqu' || chr(233) || 's prochainement.',
  '2026-10-15T20:30:00+02:00',
  null,
  null,
  null,
  null,
  null,
  'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/activities/sorbonne-night.jpeg',
  null,
  null,
  true
),
(
  'PSG ' || chr(215) || ' Lyon, football f' || chr(233) || 'minin',
  'Match de football f' || chr(233) || 'minin au Parc des Princes. Complet.',
  '2026-10-17T21:00:00+02:00',
  null,
  'Parc des Princes',
  '24 rue du Commandant Guilbaud, 75016 Paris',
  48.84186,
  2.251558,
  'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/activities/matchs.jpg',
  null,
  null,
  true
),
(
  'Soir' || chr(233) || 'e Halloween',
  'Soir' || chr(233) || 'e Halloween ' || chr(224) || ' l''Atlantique. Billetterie ouverte prochainement : le lien sera communiqu' || chr(233) || ' sur les r' || chr(233) || 'seaux du BDE.',
  '2026-10-23T23:00:00+02:00',
  null,
  'L''Atlantique',
  null,
  null,
  null,
  'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/activities/sorbonne-night.jpeg',
  null,
  null,
  true
),
(
  'Nocturne au Louvre',
  'Visite du mus' || chr(233) || 'e du Louvre en nocturne.',
  '2026-10-28T18:00:00+01:00',
  null,
  'Mus' || chr(233) || 'e du Louvre',
  'Rue de Rivoli, 75001 Paris',
  48.8611,
  2.3358,
  'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/activities/culture.jpeg',
  'https://ticket.louvre.fr/billetterie/3313',
  null,
  true
),
(
  'Stade Fran' || chr(231) || 'ais Paris ' || chr(215) || ' La Rochelle',
  'Match de rugby au stade Jean-Bouin, avec l''offre ' || chr(233) || 'tudiante du partenariat Stade Fran' || chr(231) || 'ais : tarif r' || chr(233) || 'duit, before avec DJ set et happy hour pendant le match.',
  '2026-10-31T17:00:00+01:00',
  null,
  'Stade Jean-Bouin',
  '20-40 avenue du G' || chr(233) || 'n' || chr(233) || 'ral Sarrail, 75016 Paris',
  48.8434,
  2.253,
  'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/stade-francais-paris.jpg',
  'https://billetterie.stade.fr/fr/acheter/match-etudiant-grand-public-sf-paris-stade-rochelais-2026-sjh80msdbp7b/plan#bka5f22fbc-zone',
  null,
  true
);

-- Escalade du lundi 12 octobre, 18h : meme lieu que la seance de septembre.
insert into events (
  title, description, starts_at, location_name, location_address,
  latitude, longitude, image_url, ticket_url, price_cents, is_published
)
select
  'Escalade ' || chr(224) || ' Arkose Chevaleret',
  'S' || chr(233) || 'ance d''escalade entre ' || chr(233) || 'tudiants, ouverte ' || chr(224) || ' tous les niveaux.' || chr(10) || chr(10) || 'Tarif partenaire Arkose ' || chr(215) || ' Mroc : 10,50' || chr(160) || chr(8364) || ' la s' || chr(233) || 'ance au lieu de 18' || chr(160) || chr(8364) || '.',
  '2026-10-12T18:00:00+02:00',
  location_name, location_address, latitude, longitude, image_url, ticket_url, price_cents, true
from events where id = '27e95000-b2e1-4cf5-83ba-b905fe086fc2';

-- Run ASICS du 13 octobre : complet, le bouton de reservation disparait.
update events set
  ticket_url = null,
  description = 'Sortie running organis' || chr(233) || 'e avec ASICS, au d' || chr(233) || 'part de la boutique ASICS de Ch' || chr(226) || 'telet, avec la possibilit' || chr(233) || ' de tester une nouvelle paire pendant la course.' || chr(10) || chr(10) || 'Complet.'
where id = 'ba0b26fa-c749-4d5c-bac9-0e8e57d8ae4a';

commit;

-- select title, starts_at from events where starts_at >= '2026-10-01' order by starts_at;
