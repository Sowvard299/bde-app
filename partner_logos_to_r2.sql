-- Migration des logos partenaires de Supabase Storage vers Cloudflare R2
-- (aucun frais de sortie sur R2, ne consomme plus le quota Supabase)
update partners set logo_url = 'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/arkose.jpeg'
where name ilike '%Arkose%';

update partners set logo_url = 'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/la-marquise.jpg'
where name ilike '%Marquise%';

update partners set logo_url = 'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/mk2.jpg'
where name ilike '%mk2%';

update partners set logo_url = 'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/neoness.jpg'
where name ilike '%NEONESS%';

update partners set logo_url = 'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/xinrui-boubou.webp'
where name ilike '%xinru%' or name ilike '%boubou%';
