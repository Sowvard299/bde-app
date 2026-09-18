import L from 'leaflet'
import { TYPES } from './bars'

// Pastilles de la carte des bars. Deux couleurs, une par famille : doré
// pour les bars pas chers, orange pour les insolites. C'est toute la
// légende, et elle doit se lire sans la relire.
//
// Rondes et non en goutte comme sur la carte des partenaires : à 193
// points, la pointe des gouttes se chevauche et on ne distingue plus rien.
// Un disque garde sa couleur lisible même collé à ses voisins.
function pastille(type, { actif = false } = {}) {
  const { couleur } = TYPES[type]
  const taille = actif ? 30 : 18

  return L.divIcon({
    className: 'bar-pin',
    html: `<span class="bar-pin__dot${actif ? ' bar-pin__dot--actif' : ''}" style="
      width:${taille}px;height:${taille}px;background:${couleur};
    "></span>`,
    iconSize: [taille, taille],
    iconAnchor: [taille / 2, taille / 2],
  })
}

// Deux jeux figés plutôt qu'un appel par marqueur : Leaflet ne modifie pas
// l'objet icône, et 193 divIcon recréés à chaque re-rendu se sentent.
const CACHE = {
  bar: pastille('bar'),
  insolite: pastille('insolite'),
  'bar-actif': pastille('bar', { actif: true }),
  'insolite-actif': pastille('insolite', { actif: true }),
}

export function iconePourLieu(type, actif = false) {
  return CACHE[actif ? `${type}-actif` : type] ?? CACHE.bar
}

// Icône d'un amas. L'anneau est un dégradé conique coupé selon la
// proportion de pas chers / insolites qu'il contient : on voit d'un coup
// d'œil si ce quartier est plutôt bon marché ou plutôt curieux, sans
// avoir à dézoomer.
export function iconeAmas(cluster) {
  const marqueurs = cluster.getAllChildMarkers()
  const total = marqueurs.length
  const insolites = marqueurs.filter((m) => m.options.barType === 'insolite').length
  const part = total ? (insolites / total) * 360 : 0

  const taille = total < 10 ? 34 : total < 50 ? 42 : 50
  const anneau = `conic-gradient(${TYPES.insolite.couleur} 0deg ${part}deg, ${TYPES.bar.couleur} ${part}deg 360deg)`

  return L.divIcon({
    className: 'bar-cluster',
    html: `<span class="bar-cluster__ring" style="width:${taille}px;height:${taille}px;background:${anneau}">
      <span class="bar-cluster__count">${total}</span>
    </span>`,
    iconSize: [taille, taille],
    iconAnchor: [taille / 2, taille / 2],
  })
}

// Repère de l'IAE : le même blason que sur la carte des partenaires, pour
// que les deux cartes du site se lisent pareil.
export function iconeIae(logoUrl) {
  return L.divIcon({
    className: 'bar-pin',
    html: `<span class="bar-pin__iae"><img src="${logoUrl}" alt="" /></span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  })
}

// Position de l'utilisateur : un point bleu système, volontairement
// différent des pastilles de la charte pour qu'on ne le confonde pas avec
// un bar.
export const iconePosition = L.divIcon({
  className: 'bar-pin',
  html: '<span class="bar-pin__moi"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})
