-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
-- Le BDE ne vend plus de carte de partenariat : c'est la carte etudiante
-- qui donne droit aux avantages. Seul Arkose y faisait encore reference.
update partners
set description = replace(
  description,
  chr(66) || chr(111) || chr(110) || chr(117) || chr(115) || chr(32) || chr(99) || chr(97) || chr(114) || chr(116) || chr(101) || chr(32) || chr(66) || chr(68) || chr(69) || chr(32) || chr(58) || chr(32) || chr(112) || chr(114) || chr(233) || chr(115) || chr(101) || chr(110) || chr(116) || chr(101) || chr(32) || chr(116) || chr(97) || chr(32) || chr(99) || chr(97) || chr(114) || chr(116) || chr(101) || chr(32) || chr(100) || chr(101) || chr(32) || chr(112) || chr(97) || chr(114) || chr(116) || chr(101) || chr(110) || chr(97) || chr(114) || chr(105) || chr(97) || chr(116) || chr(32) || chr(66) || chr(68) || chr(69) || chr(32) || chr(224) || chr(32) || chr(108) || chr(39) || chr(97) || chr(99) || chr(99) || chr(117) || chr(101) || chr(105) || chr(108),
  chr(66) || chr(111) || chr(110) || chr(117) || chr(115) || chr(32) || chr(233) || chr(116) || chr(117) || chr(100) || chr(105) || chr(97) || chr(110) || chr(116) || chr(32) || chr(58) || chr(32) || chr(112) || chr(114) || chr(233) || chr(115) || chr(101) || chr(110) || chr(116) || chr(101) || chr(32) || chr(116) || chr(97) || chr(32) || chr(99) || chr(97) || chr(114) || chr(116) || chr(101) || chr(32) || chr(233) || chr(116) || chr(117) || chr(100) || chr(105) || chr(97) || chr(110) || chr(116) || chr(101) || chr(32) || chr(224) || chr(32) || chr(108) || chr(39) || chr(97) || chr(99) || chr(99) || chr(117) || chr(101) || chr(105) || chr(108)
)
where name ilike '%Arkose%';
