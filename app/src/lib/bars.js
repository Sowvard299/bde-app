// Onglet « Bars de Paris » : chargement des données et logique métier.
//
// Les 193 lieux forment un jeu de données figé (aucune écriture depuis
// l'app, mise à jour à la main quand la sélection bouge) : ils vivent dans
// le dépôt, pas dans Supabase — le quota de la base gratuite est déjà
// serré, et ces lignes n'ont aucune raison d'y passer.
//
// L'import est dynamique : les ~120 Ko partent dans un chunk séparé,
// téléchargé la première fois qu'on ouvre l'onglet puis précaché par le
// service worker. Les autres pages du site ne le paient jamais, et la
// carte reste consultable hors ligne une fois vue.

let cache = null
let pending = null

export function loadBars() {
  if (cache) return Promise.resolve(cache)
  if (!pending) {
    pending = import('../data/bars-paris.json')
      .then((mod) => {
        cache = preparer(mod.default)
        return cache
      })
      .catch((err) => {
        // Sans ça, un échec réseau condamnerait l'onglet pour toute la
        // session : le rejet resterait mémorisé dans `pending` et chaque
        // nouvelle tentative renverrait la même erreur sans rappeler le
        // réseau.
        pending = null
        throw err
      })
  }
  return pending
}

// Les deux familles de lieux, et les deux couleurs de pastille qui vont
// avec. Elles sortent de la charte du site (doré et orange) plutôt que
// d'un nuancier de carte : la légende doit se lire comme le reste du site.
export const TYPES = {
  bar: {
    cle: 'bar',
    libelle: 'Bars pas chers',
    court: 'Pas cher',
    couleur: '#ffc300',
    surCouleur: '#1a1a1a',
  },
  insolite: {
    cle: 'insolite',
    libelle: 'Bars insolites',
    court: 'Insolite',
    couleur: '#ff4214',
    surCouleur: '#ffffff',
  },
}

// L'IAE Paris-Sorbonne : le point de départ naturel de la carte, c'est de
// la fac qu'on part boire un verre.
export const IAE = { nom: 'IAE Paris-Sorbonne', lat: 48.8266031, lon: 2.367821 }

// Groupes de filtres présentés dans le panneau « Plus de filtres ».
// La taxonomie du fichier source compte 77 étiquettes : les déverser
// telles quelles donnerait un mur de boutons. On garde celles qui aident
// vraiment à choisir un bar, dans l'ordre où on se pose la question.
export const GROUPES_FILTRES = [
  {
    cle: 'jeux',
    libelle: 'Jeux sur place',
    flags: [
      'baby-foot', 'billard', 'flechettes', 'beer-pong', 'flipper', 'arcade',
      'jeux-de-societe', 'karaoke', 'retrogaming', 'ping-pong', 'petanque',
      'shuffleboard', 'e-sport', 'mini-golf', 'jeux-de-bar',
    ],
  },
  {
    cle: 'ambiance',
    libelle: 'Ambiance',
    flags: [
      'etudiant', 'dansant', 'concert', 'diffusion-match', 'afterwork',
      'jazz', 'cosy', 'chaleureux', 'drag-show', 'scene-ouverte',
    ],
  },
  {
    cle: 'pratique',
    libelle: 'Pratique',
    flags: [
      'grande-terrasse', 'petite-terrasse', 'ferme-apres-2h', 'ouvert-24h',
      'grande-capacite', 'offre-groupes', 'espace-privatif', 'climatisation',
    ],
  },
  {
    cle: 'boisson',
    libelle: 'Boire et manger',
    flags: [
      'bieres-artisanales', 'bar-a-cocktails', 'bar-a-vins', 'mixologie',
      'tapas', 'cuisine', 'pizza', 'formule-food', 'shooters',
      'collection-spiritueux', 'bubble-tea',
    ],
  },
]

// Étiquettes déjà portées par un autre élément de l'interface (la couleur
// de la pastille, le prix affiché) : les répéter dans la fiche ne ferait
// que la rallonger. `insolite-mgb` est un marqueur interne de contrôle des
// sources, il n'a rien à faire sous les yeux d'un étudiant.
const FLAGS_REDONDANTS = new Set([
  'moins-de-3e', 'moins-de-4e', 'moins-de-5e', 'insolite-mgb',
])

export function flagsAffichables(lieu) {
  return lieu.flags.filter((f) => !FLAGS_REDONDANTS.has(f))
}

// « Café » doit sortir quand on tape « cafe » : personne ne met les
// accents dans une barre de recherche sur téléphone.
export function sansAccents(texte) {
  return texte
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
}

function preparer(payload) {
  const lieux = payload.lieux.map((lieu) => ({
    ...lieu,
    prix: lieu.prix ?? {},
    // Indexé une fois pour toutes : refaire la normalisation Unicode de
    // 193 fiches à chaque frappe se sent sur un téléphone d'entrée de gamme.
    recherche: sansAccents(
      [lieu.nom, lieu.adresse, lieu.metro, lieu.concept, lieu.bon_plan]
        .filter(Boolean)
        .join(' ')
    ),
  }))

  return { ...payload, lieux }
}

// Le prix qui sert de repère dans la liste et de clé de tri. Un bar se
// compare sur sa pinte ; un insolite n'a souvent qu'un ticket d'entrée.
export function prixRepere(lieu) {
  // Les fiches sans aucun prix publié n'ont pas de champ `prix` du tout.
  // L'application le comble au chargement, mais le rendu serveur lit le
  // fichier brut : sans ce garde-fou, une seule de ces fiches faisait
  // echouer toute la page.
  const p = lieu.prix ?? {}
  if (p.pinte_hh != null) return { valeur: p.pinte_hh, libelle: 'la pinte en happy hour' }
  if (p.pinte_hors_hh != null) return { valeur: p.pinte_hors_hh, libelle: 'la pinte' }
  if (p.ticket_entree != null) return { valeur: p.ticket_entree, libelle: "l'entrée" }
  if (p.cocktail != null) return { valeur: p.cocktail, libelle: 'le cocktail' }
  return null
}

export function formatEuro(valeur) {
  if (valeur == null) return null
  return Number.isInteger(valeur)
    ? `${valeur} €`
    : `${valeur.toFixed(2).replace('.', ',')} €`
}

const JOURS_COURTS = ['', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim']

// « 21:00 » se dit « 21h », pas « 21h00 » : on ne garde les minutes que
// lorsqu'il y en a.
function formatHeure(hhmm) {
  const [h, m] = hhmm.split(':')
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`
}

function enMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// État tarifaire d'un lieu à l'instant T.
//
// Repris du filtre de référence fourni avec le jeu de données, avec une
// nuance importante : ce filtre répondait « actif » aussi bien pour un
// happy hour en cours que pour un bar à prix constant. Les deux méritent
// d'apparaître quand on cherche où boire pas cher maintenant, mais les
// confondre sous l'étiquette « happy hour » ferait mentir la fiche de 101
// lieux sur 193. On distingue donc les états, et c'est l'appelant qui
// décide lesquels il retient.
//
// Le piège que gère `traverse_minuit` : un happy hour qui finit à 2h du
// matin se termine le LENDEMAIN. Comparer bêtement les heures sort tous
// ces bars du créneau passé minuit, c'est-à-dire exactement au moment où
// on les cherche.
export function tarifMaintenant(lieu, maintenant = new Date()) {
  const hh = lieu.hh

  if (!hh) return { etat: 'inconnu', libelle: 'Tarifs non précisés' }

  if (hh.type_tarif === 'constant') {
    return { etat: 'constant', libelle: 'Même prix toute la journée' }
  }

  if (!hh.debut || !hh.fin) {
    return { etat: 'inconnu', libelle: 'Happy hour, horaires non précisés' }
  }

  const creneau = `Happy hour ${formatHeure(hh.debut)}–${formatHeure(hh.fin)}`

  // getDay() : 0 = dimanche. Le jeu de données numérote 1 = lundi … 7 = dimanche.
  const jourJs = maintenant.getDay()
  const jour = jourJs === 0 ? 7 : jourJs
  const jourVeille = jour === 1 ? 7 : jour - 1

  const minutes = maintenant.getHours() * 60 + maintenant.getMinutes()
  const debut = enMinutes(hh.debut)
  const fin = enMinutes(hh.fin)

  const actif = hh.traverse_minuit
    ? (hh.jours.includes(jour) && minutes >= debut) ||
      (hh.jours.includes(jourVeille) && minutes < fin)
    : hh.jours.includes(jour) && minutes >= debut && minutes < fin

  if (actif) {
    return { etat: 'happy-hour', libelle: `Happy hour jusqu'à ${formatHeure(hh.fin)}` }
  }

  // Hors créneau, on dit quand il revient plutôt que de laisser un simple
  // « non » : c'est l'information qui sert à décider d'y aller ou pas.
  const joursLibelle =
    hh.jours.length === 7 ? 'tous les jours' : hh.jours.map((j) => JOURS_COURTS[j]).join(', ')

  return { etat: 'hors-creneau', libelle: `${creneau} · ${joursLibelle}` }
}

// « Au meilleur prix maintenant » : le happy hour en cours ET les bars à
// prix constant, qui sont toujours à leur meilleur tarif par définition.
export function auMeilleurPrix(lieu, maintenant) {
  const etat = tarifMaintenant(lieu, maintenant).etat
  return etat === 'happy-hour' || etat === 'constant'
}

// Distance à vol d'oiseau. Sur Paris intra-muros l'écart avec le trajet
// réel reste assez petit pour que « à 400 m » veuille dire quelque chose.
export function distanceKm(aLat, aLon, bLat, bLon) {
  const R = 6371
  const rad = Math.PI / 180
  const dLat = (bLat - aLat) * rad
  const dLon = (bLon - aLon) * rad
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function formatDistance(km) {
  if (km == null) return null
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace('.', ',')} km`
}

export const FILTRES_VIDES = {
  types: ['bar', 'insolite'],
  q: '',
  maxPinte: null,
  arrondissement: null,
  flags: [],
  meilleurPrix: false,
  tri: 'prix',
}

export function compterFiltresActifs(filtres) {
  let n = 0
  if (filtres.types.length !== 2) n += 1
  if (filtres.q.trim()) n += 1
  if (filtres.maxPinte != null) n += 1
  if (filtres.arrondissement) n += 1
  if (filtres.meilleurPrix) n += 1
  return n + filtres.flags.length
}

export function filtrerEtTrier(lieux, filtres, { maintenant, position } = {}) {
  const now = maintenant ?? new Date()
  const q = sansAccents(filtres.q.trim())

  const retenus = lieux.filter((lieu) => {
    if (!filtres.types.includes(lieu.type)) return false
    if (q && !lieu.recherche.includes(q)) return false
    if (filtres.arrondissement && lieu.arrondissement !== filtres.arrondissement) return false

    if (filtres.maxPinte != null) {
      // Un lieu sans prix de pinte publié ne peut pas prouver qu'il tient
      // le budget : on le sort plutôt que de le laisser passer par défaut.
      const pinte = lieu.prix.pinte_hh ?? lieu.prix.pinte_hors_hh
      if (pinte == null || pinte > filtres.maxPinte) return false
    }

    if (filtres.flags.length && !filtres.flags.every((f) => lieu.flags.includes(f))) return false
    if (filtres.meilleurPrix && !auMeilleurPrix(lieu, now)) return false

    return true
  })

  const avecDistance = retenus.map((lieu) => ({
    lieu,
    km: position ? distanceKm(position.lat, position.lon, lieu.lat, lieu.lon) : null,
  }))

  // Trier par distance sans position connue trierait sur des `null` : on
  // retombe sur le prix tant que la géolocalisation n'a pas répondu.
  const tri = filtres.tri === 'distance' && !position ? 'prix' : filtres.tri

  avecDistance.sort((a, b) => {
    if (tri === 'distance') return a.km - b.km
    if (tri === 'nom') return a.lieu.nom.localeCompare(b.lieu.nom, 'fr')
    // Tri par prix : les fiches sans prix publié finissent en bas plutôt
    // que de squatter la tête de liste avec un prix implicite de zéro.
    const pa = prixRepere(a.lieu)?.valeur ?? Infinity
    const pb = prixRepere(b.lieu)?.valeur ?? Infinity
    if (pa !== pb) return pa - pb
    return a.lieu.nom.localeCompare(b.lieu.nom, 'fr')
  })

  return avecDistance
}
