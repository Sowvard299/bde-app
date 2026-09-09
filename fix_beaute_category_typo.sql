-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
-- Coquille depuis la creation du schema : accent manquant.
update partner_categories
set name = chr(66) || chr(101) || chr(97) || chr(117) || chr(116) || chr(233)
where slug = 'beaute';
