-- A executer dans l'editeur SQL du NOUVEAU projet Supabase.
update partners
set description = replace(
  description,
  chr(80) || chr(97) || chr(114) || chr(116) || chr(101) || chr(110) || chr(97) || chr(114) || chr(105) || chr(97) || chr(116) || chr(32) || chr(101) || chr(120) || chr(99) || chr(108) || chr(117) || chr(115) || chr(105) || chr(102) || chr(32) || chr(66) || chr(68) || chr(69),
  chr(80) || chr(97) || chr(114) || chr(116) || chr(101) || chr(110) || chr(97) || chr(114) || chr(105) || chr(97) || chr(116) || chr(32) || chr(66) || chr(68) || chr(69)
)
where id = '662aef69-42e1-4fbd-b9e3-0aad17dc6b4b';
