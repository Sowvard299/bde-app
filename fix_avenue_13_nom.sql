-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
-- L'enseigne s'appelle Avenue 13, pas L'Avenue Bibliotheque 13 : ce
-- dernier nom venait de la page du menu en ligne, qui portait un intitule
-- plus long que celui du restaurant.
update partners
set name = 'Avenue 13'
where id = 'c740c2b8-caaa-42de-9411-abffca9e89b5';
