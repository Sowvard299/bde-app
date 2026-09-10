-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
-- Supprime le doublon cree lors du premier essai (adresse "89B" perimee).
-- Garde uniquement la version avec la bonne adresse "89 Rue de Tolbiac".
delete from partners where id = '629e6432-879b-48fb-b9a8-3966e050d702';
