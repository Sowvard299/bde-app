-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.

-- 1) Colonnes generiques, reutilisables pour n'importe quel evenement.
alter table events add column if not exists whatsapp_url text;
alter table events add column if not exists instagram_url text;

-- 2) Lien WhatsApp + Instagram pour le premier run.
update events
set whatsapp_url = 'https://chat.whatsapp.com/DxMrVAnDwuELqDDv3fswUi',
    instagram_url = 'https://www.instagram.com/bde.iaeparissorbonne'
where title ilike '%Sorbonne Running%';
