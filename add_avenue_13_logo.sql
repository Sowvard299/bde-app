-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
--
-- Le fichier contenue/LOGO PARTENAIRE/Avenue 13.png etait une banniere
-- photo de 942x675 pesant 590 Ko. Le site affiche les logos dans un
-- carre : recadre tel quel, le mot « L'AVENUE » aurait ete coupe des
-- deux cotes. Il a donc ete recadre au centre sur toute sa hauteur
-- (675x675, ce qui garde le texte en entier), reduit a 512x512 et
-- converti en JPEG : 34 Ko au lieu de 590.
--
-- L'extension compte : lib/media.js traite un .png comme un logo
-- vectoriel (fond blanc, marge interieure, image entiere visible) et
-- tout le reste comme une photo (recadrage en carre, sans fond). Pour
-- une photo, c'est bien .jpg qu'il faut.
update partners
set logo_url = 'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/partners/avenue-13.jpg'
where id = 'c740c2b8-caaa-42de-9411-abffca9e89b5';
