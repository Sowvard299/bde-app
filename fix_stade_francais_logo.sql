-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
--
-- Le logo etait en .png, donc traite par le site comme un logo
-- vectoriel : fond blanc, marge interieure, image entiere visible. Mais
-- ce fichier n'a aucune transparence, c'est une image pleine (le blason
-- sur fond d'eclairs roses) -- le traitement "logo" lui ajoutait un
-- cadre blanc qui n'a aucune raison d'etre. Repris en .jpg, le meme
-- fichier est traite comme une photo : il remplit toute la vignette,
-- sans marge.
update partners
set logo_url = 'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/stade-francais-paris.jpg'
where name = 'Stade Français Paris';
