import { isIos } from './platform'

// Liens vers l'application de cartes du téléphone, dans un seul module :
// une adresse liée depuis cinq endroits du site ne doit pas se lier de
// cinq façons différentes.
//
// Plans sur iPhone et iPad, Google Maps partout ailleurs. Sur iOS, un lien
// Google Maps ouvre une page web dans Safari au lieu de l'application ; sur
// Android, c'est le lien Google qui ouvre l'application. Chaque plateforme
// reçoit donc le lien de son application native.

export function nomAppCartes() {
  return isIos() ? 'Plans' : 'Google Maps'
}

function coordonnees(lat, lon) {
  return lat != null && lon != null ? `${lat},${lon}` : null
}

// Ouvre le lieu lui-même, avec sa fiche (horaires, avis, photos) quand
// l'application le reconnaît. Le nom est envoyé avec l'adresse : une
// adresse seule situe une rue, le nom identifie le commerce.
export function lienCarte({ nom, adresse, lat, lon }) {
  const texte = [nom, adresse].filter(Boolean).join(', ')
  const coords = coordonnees(lat, lon)

  if (isIos()) {
    const q = encodeURIComponent(texte || coords || '')
    return `https://maps.apple.com/?q=${q}${coords && texte ? `&ll=${coords}` : ''}`
  }

  // Sans adresse, un nom seul est ambigu (« Théâtre Dunois » n'est pas
  // unique à Paris) alors que des coordonnées désignent un seul point : on
  // préfère donc épingler l'endroit exact plutôt que de laisser Google
  // deviner de quel établissement il s'agit.
  const requete = adresse ? texte : coords || texte
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(requete)}`
}

// Lance directement le guidage vers le lieu. Les coordonnées passent avant
// le texte : elles évitent qu'un nom ambigu envoie à la mauvaise adresse.
export function lienItineraire({ nom, adresse, lat, lon }) {
  const coords = coordonnees(lat, lon)
  const texte = [nom, adresse].filter(Boolean).join(', ')

  if (isIos()) {
    return `https://maps.apple.com/?daddr=${encodeURIComponent(coords || texte)}${
      texte ? `&q=${encodeURIComponent(texte)}` : ''
    }`
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coords || texte)}`
}
