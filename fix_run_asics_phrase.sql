-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
-- Retire la derniere phrase de la description du run ASICS.
update events
set description = 'Un nouveau run en collaboration avec ASICS !' || chr(10) || chr(10) || 'D' || chr(233) ||
    'part de la boutique Asics Ch' || chr(226) || 'telet, avec l' || chr(39) || 'occasion de tester une nouvelle paire sur le run. Les places sont tr' ||
    chr(232) || 's limit' || chr(233) || 'es et gratuites, l' || chr(39) || 'inscription est obligatoire via le lien ci-dessous.'
where id = 'ba0b26fa-c749-4d5c-bac9-0e8e57d8ae4a';
