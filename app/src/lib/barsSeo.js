// Adresses publiques des bars : une page par bar (/bars/le-cafe-populaire)
// et une par arrondissement (/bars/paris-11e).
//
// Pourquoi : la carte ne vit qu'à une seule adresse, /bars. Pour Google,
// les 193 bars n'étaient donc qu'une longue liste sur une page, et rien
// ne pouvait sortir sur « bar pas cher Paris 11e » ou sur le nom d'un bar.
// Ces pages donnent à chaque recherche sa réponse, avec les données déjà
// relevées par le BDE.
//
// Partagé par l'application et par le Worker : les deux doivent produire
// exactement les mêmes adresses.

// Un arrondissement n'a sa page qu'à partir de ce nombre de bars : en
// dessous, la page serait trop mince pour mériter d'être proposée.
export const MIN_BARS_ARRONDISSEMENT = 3

export function slugifier(texte) {
  return String(texte)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' et ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// « 11e » -> « paris-11e », « 1er » -> « paris-1er ».
export function slugArrondissement(arr) {
  return /^\d/.test(arr) ? `paris-${slugifier(arr)}` : slugifier(arr)
}

export function libelleArrondissement(arr) {
  return /^\d/.test(arr) ? `Paris ${arr}` : arr
}

function numeroArrondissement(arr) {
  const n = parseInt(arr, 10)
  return Number.isNaN(n) ? 99 : n
}

const index = new WeakMap()

// Index calculé une fois par jeu de données : adresse de chaque bar,
// bar de chaque adresse, et arrondissements qui ont leur page.
export function indexBars(lieux) {
  const deja = index.get(lieux)
  if (deja) return deja

  const slugDe = new Map()
  const parSlug = new Map()
  for (const lieu of lieux) {
    let slug = slugifier(lieu.nom)
    // Deux bars du même nom : on les distingue par l'arrondissement, puis
    // par l'identifiant en dernier recours.
    if (parSlug.has(slug)) slug = `${slug}-${slugifier(lieu.arrondissement)}`
    if (parSlug.has(slug)) slug = `${slug}-${lieu.id}`
    slugDe.set(lieu.id, slug)
    parSlug.set(slug, lieu)
  }

  const groupes = new Map()
  for (const lieu of lieux) {
    if (!groupes.has(lieu.arrondissement)) groupes.set(lieu.arrondissement, [])
    groupes.get(lieu.arrondissement).push(lieu)
  }
  const arrondissements = [...groupes.entries()]
    .map(([arr, liste]) => ({
      arr,
      slug: slugArrondissement(arr),
      libelle: libelleArrondissement(arr),
      lieux: liste,
      aSaPage: liste.length >= MIN_BARS_ARRONDISSEMENT,
    }))
    .sort((a, b) => numeroArrondissement(a.arr) - numeroArrondissement(b.arr))
  const arrParSlug = new Map(arrondissements.filter((a) => a.aSaPage).map((a) => [a.slug, a]))

  const resultat = { slugDe, parSlug, arrondissements, arrParSlug }
  index.set(lieux, resultat)
  return resultat
}

export function cheminBar(lieux, lieu) {
  return `/bars/${indexBars(lieux).slugDe.get(lieu.id)}`
}

// Le chemin de la page d'un arrondissement, ou null s'il n'en a pas.
export function cheminArrondissement(lieux, arr) {
  const groupe = indexBars(lieux).arrondissements.find((a) => a.arr === arr)
  return groupe?.aSaPage ? `/bars/${groupe.slug}` : null
}

// « 102 rue Saint-Maur, 75011 Paris » -> rue, code postal, ville.
export function decouperAdresse(adresse) {
  const m = String(adresse).match(/^(.*?),\s*(\d{5})\s+(.+)$/)
  if (!m) return { rue: adresse, codePostal: null, ville: 'Paris' }
  return { rue: m[1], codePostal: m[2], ville: m[3] }
}

// Dans l'ordre de la page d'un arrondissement : le moins cher d'abord,
// les bars sans prix publié à la fin.
export function trierParPrix(lieux, prixRepere) {
  return [...lieux].sort((a, b) => {
    const pa = prixRepere(a)?.valeur ?? Infinity
    const pb = prixRepere(b)?.valeur ?? Infinity
    return pa - pb || a.nom.localeCompare(b.nom, 'fr')
  })
}

const JOURS_COURTS = ['', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim']
const heure = (hhmm) => {
  const [h, m] = hhmm.split(':')
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`
}

// Le happy hour décrit une fois pour toutes (pas « en cours » : une page
// indexée ne doit pas dépendre de l'heure à laquelle Google est passé).
export function resumeHappyHour(lieu) {
  const hh = lieu.hh
  if (!hh) return null
  if (hh.type_tarif === 'constant') return 'même prix toute la journée'
  if (hh.debut && hh.fin) {
    const jours = hh.jours?.length === 7 ? 'tous les jours' : (hh.jours ?? []).map((j) => JOURS_COURTS[j]).join(', ')
    return `happy hour de ${heure(hh.debut)} à ${heure(hh.fin)}${jours ? `, ${jours}` : ''}`
  }
  return 'happy hour (horaires non précisés)'
}
