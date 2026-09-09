-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
-- Le numero de Theatre Dunois n'etait que dans le texte libre de la
-- description, donc pas cliquable, contrairement aux autres partenaires
-- qui ont un champ phone structure.
update partners
set phone = '01 45 84 72 00'
where name ilike '%dunois%';
