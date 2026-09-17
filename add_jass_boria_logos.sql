-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
update partners
set logo_url = 'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/jass-club-paris.jpg'
where name ilike '%jass%';

-- Passe Brasserie Boria en partenaire officiel (au lieu de bon plan),
-- et lui donne son logo en meme temps.
update partners
set logo_url = 'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/brasserie-boria.png',
    kind = 'partenaire'
where name ilike '%boria%';
