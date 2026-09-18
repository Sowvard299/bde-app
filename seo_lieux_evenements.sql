-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
--
-- Pourquoi : Google exige un lieu pour afficher un evenement dans son
-- module « evenements ». Sans lieu, le balisage entier est rejete, et le
-- site ne declare donc rien du tout pour ces dates. Deux evenements sont
-- concernes.


-- 1. Run du 30 septembre
-- Meme club, meme point de depart que le run du 9 septembre, dont la
-- fiche dit deja « Depart de l'IAE Paris Sorbonne ». Les coordonnees
-- sont celles deja utilisees par les cartes du site.
update events
set location_name = 'IAE Paris Sorbonne',
    latitude = 48.8266031,
    longitude = 2.367821
where id = '9b75c341-49fd-43cb-a6f7-cff50ecc7961';


-- 2. WEICUP du 25 septembre
-- A COMPLETER : je ne connais pas le lieu. Remplace les deux valeurs
-- ci-dessous, puis retire les deux tirets en debut de ligne pour
-- l'executer. C'est l'evenement le plus partage de l'annee : c'est celui
-- qui a le plus a gagner a etre eligible.
--
-- update events
-- set location_name = 'Nom du lieu',
--     location_address = 'Adresse complete, 750XX Paris'
-- where id = '8e66e3b4-918d-4370-bc14-bcf52c86f0d6';


-- 3. Back to school Party (2 septembre, passe)
-- Son affiche pointe encore vers l'ancien projet Supabase, dont le
-- domaine ne repond plus : l'image est cassee sur la fiche comme dans
-- l'apercu de partage. La mettre a NULL fait retomber les deux sur le
-- visuel de secours du site, qui lui s'affiche.
update events
set image_url = null
where id = '96812dd8-c1bf-44ba-9da3-7ad1a6073301';


-- Verification apres execution : les deux lignes doivent ressortir avec
-- un lieu, et aucune ne doit contenir « qsaqxynxiwcbvxfndweb ».
-- select title, location_name, image_url from events where is_published = true order by starts_at;
