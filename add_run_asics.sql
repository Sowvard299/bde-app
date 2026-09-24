-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
--
-- Run en collaboration avec ASICS, mardi 13 octobre a 18h15, boutique
-- Asics Chatelet. Places limitees et gratuites, inscription obligatoire
-- via le lien fourni.
--
-- Reprend le meme visuel que les deux runs precedents
-- (running-club-jaune.png) plutot que d'en ajouter un nouveau : aucune
-- image specifique n'a ete fournie pour celui-ci, et les trois
-- evenements du club running gagnent a se reconnaitre du meme coup
-- d'oeil dans la liste.
--
-- Le message d'origine etait ecrit pour un salon Discord/WhatsApp
-- (salutation, emoji en pagaille, "Hello la TEAMMM") : repris tel quel,
-- ca aurait jure avec le reste des fiches evenement, qui restent
-- factuelles. Le fond (date, lieu, gratuite, inscription obligatoire,
-- rappel qu'il y en aura d'autres) est garde, la forme est celle du
-- site.
--
-- price_cents = 0 et pas NULL : c'est un evenement gratuit, pas un
-- evenement dont le prix n'est pas renseigne -- la difference compte
-- pour le balisage Event lu par Google.
--
-- Adresse geocodee via l'API Adresse (score 0.96) :
-- 24 Rue Aubry Le Boucher 75004 Paris -> 48.860562, 2.349737

insert into events (
  title, description, starts_at, location_name, location_address,
  latitude, longitude, image_url, ticket_url, price_cents, is_published
) values (
  'Run ASICS ' || chr(8212) || ' Sorbonne Running',
  'Un nouveau run en collaboration avec ASICS, avec VOLTA aux commandes !' ||
    chr(10) || chr(10) || 'D' || chr(233) || 'part de la boutique Asics Ch' || chr(226) || 'telet, avec l' ||
    chr(39) || 'occasion de tester une nouvelle paire sur le run. Les places sont tr' ||
    chr(232) || 's limit' || chr(233) || 'es et gratuites, l' || chr(39) || 'inscription est obligatoire via le lien ci-dessous.' ||
    chr(10) || chr(10) || 'Tous niveaux bienvenus. D' || chr(39) || 'autres runs seront organis' ||
    chr(233) || 's avant celui-ci.',
  '2026-10-13T16:15:00+00:00',  -- 18h15 heure de Paris
  'Asics Store Ch' || chr(226) || 'telet',
  '24 Rue Aubry le Boucher, 75004 Paris',
  48.860562,
  2.349737,
  'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/events/running-club-jaune.png',
  'https://in.asicsmove.com/social-run-asicsfrontrunner-1785487760319?currentPage=select-competition',
  0,
  true
);

-- Verification : la fiche doit ressortir avec ses accents intacts, et
-- afficher "mardi 13 octobre" a 18h15 sur le site (pas 16h15 ni 20h15 --
-- piege classique du fuseau horaire).
-- select title, starts_at, location_name from events where title ilike '%asics%';
