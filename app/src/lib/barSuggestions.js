import { supabase } from './supabase'
import { comprimerImage } from './comprimerImage'

const COMPARTIMENT = 'bar-suggestions'
export const MAX_PHOTOS = 3
const TAILLE_MAX_OCTETS = 8 * 1024 * 1024

// Envoie une proposition de bar (nouveau lieu, ou correction sur une
// fiche déjà publiée).
//
// La table bar_suggestions est en écriture seule pour le visiteur : la
// policy Supabase autorise l'ajout mais pas la lecture, donc rien de ce
// qui est envoyé ici ne peut être relu par l'application elle-même —
// voir add_bar_suggestions.sql. Les propositions sont ensuite triées à
// la main dans le tableau de bord Supabase, comme le reste du contenu
// du site : rien n'apparaît automatiquement sur la carte des bars.
export async function envoyerSuggestion({ type, nom, adresse, notes, contact, fichiers, piege }) {
  // Piège à robots : ce champ est masqué à l'écran et absent du lecteur
  // d'écran (voir le composant), donc personne qui remplit le
  // formulaire des yeux ne le remplit. Un script qui coche tous les
  // champs du formulaire le coche aussi.
  if (piege) return

  const chemins = []
  for (const fichier of fichiers.slice(0, MAX_PHOTOS)) {
    const compressee = await comprimerImage(fichier)
    if (compressee.size > TAILLE_MAX_OCTETS) {
      throw new Error(
        `Une photo dépasse ${Math.round(TAILLE_MAX_OCTETS / 1024 / 1024)} Mo même compressée — réessaie avec une autre.`
      )
    }

    const typeMime = compressee.type || fichier.type || 'application/octet-stream'
    const extension = typeMime.split('/')[1]?.split('+')[0] || 'jpg'
    const chemin = `${crypto.randomUUID()}.${extension}`

    const { error } = await supabase.storage
      .from(COMPARTIMENT)
      .upload(chemin, compressee, { contentType: typeMime })
    if (error) throw error

    chemins.push(chemin)
  }

  const { error } = await supabase.from('bar_suggestions').insert({
    type,
    nom: nom.trim(),
    adresse: adresse.trim() || null,
    notes: notes.trim() || null,
    contact: contact.trim() || null,
    photos: chemins,
  })
  if (error) throw error
}
