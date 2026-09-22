// Réduit une photo avant l'envoi.
//
// Une photo de carte prise au téléphone pèse couramment 3 à 8 Mo, pour
// un affichage qui ne dépassera jamais quelques centaines de pixels de
// large dans le tableau de bord. Sans compression, chaque envoi
// grignoterait le quota gratuit du compartiment de stockage en
// quelques dizaines de photos.

const COTE_MAX = 1600
const QUALITE = 0.82

export async function comprimerImage(fichier) {
  try {
    const bitmap = await createImageBitmap(fichier)
    const ratio = Math.min(1, COTE_MAX / Math.max(bitmap.width, bitmap.height))
    const largeur = Math.round(bitmap.width * ratio)
    const hauteur = Math.round(bitmap.height * ratio)

    const canvas = document.createElement('canvas')
    canvas.width = largeur
    canvas.height = hauteur
    canvas.getContext('2d').drawImage(bitmap, 0, 0, largeur, hauteur)
    bitmap.close?.()

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITE))
    // Un navigateur qui ne sait pas décoder le format d'origine (HEIC sur
    // certains Android, par exemple) renvoie un canvas vide et `toBlob`
    // un `null` silencieux. Mieux vaut envoyer le fichier tel quel que
    // bloquer l'envoi pour un format que la compression ne gère pas.
    return blob ?? fichier
  } catch {
    return fichier
  }
}
