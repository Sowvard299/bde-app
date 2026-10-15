// Réponses toutes faites pour les moteurs de réponse (ChatGPT, Perplexity,
// Claude, aperçus IA de Google) — et pour les visiteurs, qui lisent les
// mêmes.
//
// Un assistant cite volontiers une phrase qui répond seule à une question
// (« le bar le moins cher de Paris », « combien coûte une pinte dans le
// 11e ») et un chiffre daté. Tout est calculé à partir du relevé des bars :
// rien n'est écrit à la main, donc rien ne peut se contredire avec la
// carte. Partagé par l'application et par le Worker, qui affichent les
// mêmes textes.
import { formatEuro, prixRepere } from './bars'
import { indexBars, resumeHappyHour, trierParPrix } from './barsSeo'

const dateCourte = (iso) => String(iso ?? '').split('-').reverse().join('/')

// Meilleur prix de la pinte d'un bar, et s'il s'agit du tarif happy hour.
function meilleurePinte(lieu) {
  const p = lieu.prix ?? {}
  if (p.pinte_hh != null) return { valeur: p.pinte_hh, hh: true }
  if (p.pinte_hors_hh != null) return { valeur: p.pinte_hors_hh, hh: false }
  return null
}

function mediane(valeurs) {
  const v = [...valeurs].sort((a, b) => a - b)
  if (!v.length) return null
  const m = Math.floor(v.length / 2)
  return v.length % 2 ? v[m] : Math.round(((v[m - 1] + v[m]) / 2) * 100) / 100
}

// « A, B et C ».
function enumerer(mots) {
  if (mots.length <= 1) return mots.join('')
  return `${mots.slice(0, -1).join(', ')} et ${mots.at(-1)}`
}

const nomArr = (lieu, lieux) =>
  indexBars(lieux).arrondissements.find((a) => a.arr === lieu.arrondissement)?.libelle ?? lieu.arrondissement

// Les bars classés par meilleur prix de pinte (ceux sans prix exclus).
function parPinte(lieux) {
  return lieux
    .map((l) => ({ lieu: l, pinte: meilleurePinte(l) }))
    .filter((x) => x.pinte)
    .sort((a, b) => a.pinte.valeur - b.pinte.valeur || a.lieu.nom.localeCompare(b.lieu.nom, 'fr'))
}

// Chiffres clés de l'ensemble du relevé.
export function chiffresBars(lieux, maj) {
  const pintes = parPinte(lieux)
  const hh = lieux.map((l) => l.prix?.pinte_hh).filter((v) => v != null)
  const plusFourni = [...indexBars(lieux).arrondissements].sort((a, b) => b.lieux.length - a.lieux.length)[0]
  const moinsDe = (seuil) => pintes.filter((x) => x.pinte.valeur <= seuil).length
  return [
    { valeur: String(lieux.length), libelle: `bars relevés à Paris (${lieux.filter((l) => l.type === 'insolite').length} insolites)` },
    { valeur: formatEuro(pintes[0]?.pinte.valeur), libelle: `la pinte la moins chère (${pintes[0]?.lieu.nom})` },
    { valeur: formatEuro(mediane(hh)), libelle: 'prix médian de la pinte en happy hour' },
    { valeur: String(moinsDe(4)), libelle: 'bars avec une pinte à 4 € ou moins' },
    { valeur: plusFourni.libelle.replace('Paris ', ''), libelle: `l'arrondissement le plus fourni (${plusFourni.lieux.length} bars)` },
    { valeur: dateCourte(maj), libelle: 'date du relevé des prix' },
  ]
}

// Questions fréquentes de la page /bars.
export function faqBars(lieux, maj) {
  const date = dateCourte(maj)
  const pintes = parPinte(lieux)
  const min = pintes[0]
  const exAequo = pintes.filter((x) => x.pinte.valeur === min.pinte.valeur)
  const aTrois = pintes.filter((x) => x.pinte.valeur <= 3)
  const hh = lieux.map((l) => l.prix?.pinte_hh).filter((v) => v != null).sort((a, b) => a - b)
  const insolites = lieux.filter((l) => l.type === 'insolite')
  const exemplesInsolites = insolites.filter((l) => l.concept).slice(0, 4)

  return [
    {
      q: 'Quel est le bar le moins cher de Paris ?',
      r: `D'après le relevé du BDE IAE Paris Sorbonne du ${date}, ${
        exAequo.length > 1
          ? `${exAequo.length} bars servent la pinte la moins chère de Paris, à ${formatEuro(min.pinte.valeur)} : ${enumerer(exAequo.map((x) => `${x.lieu.nom} (${nomArr(x.lieu, lieux)})`))}`
          : `la pinte la moins chère de Paris est servie par ${min.lieu.nom} (${min.lieu.adresse}), à ${formatEuro(min.pinte.valeur)}${min.pinte.hh ? ' en happy hour' : ''}`
      }.`,
    },
    {
      q: 'Où boire une pinte à 3 € ou moins à Paris ?',
      r: `${aTrois.length} des ${lieux.length} bars relevés servent la pinte à 3 € ou moins, le plus souvent en happy hour : ${enumerer(
        aTrois.slice(0, 6).map((x) => `${x.lieu.nom} (${nomArr(x.lieu, lieux)}, ${formatEuro(x.pinte.valeur)})`)
      )}${aTrois.length > 6 ? ', entre autres' : ''}.`,
    },
    {
      q: 'Combien coûte une pinte en happy hour à Paris ?',
      r: `Dans les ${hh.length} bars du relevé qui affichent un tarif happy hour, la pinte coûte ${formatEuro(mediane(hh))} en médiane, de ${formatEuro(hh[0])} à ${formatEuro(hh.at(-1))} (prix du ${date}).`,
    },
    {
      q: 'Quels sont les bars insolites à Paris ?',
      r: `Le BDE en a repéré ${insolites.length}, choisis pour ce qu'on y fait plus que pour le prix, par exemple ${enumerer(
        exemplesInsolites.map((l) => `${l.nom} (${nomArr(l, lieux)})`)
      )}. Ils sont signalés en orange sur la carte.`,
    },
    {
      q: 'Les prix des bars sont-ils à jour ?',
      r: `Ils ont été relevés le ${date} et peuvent avoir changé depuis : la date est indiquée sur chaque fiche. L'abus d'alcool est dangereux pour la santé, à consommer avec modération.`,
    },
  ]
}

// Questions fréquentes de la page d'un arrondissement.
export function faqArrondissement(groupe, lieux, maj) {
  const date = dateCourte(maj)
  const pintes = parPinte(groupe.lieux)
  const avecHh = trierParPrix(
    groupe.lieux.filter((l) => l.hh?.debut && l.hh?.fin && l.hh.type_tarif !== 'constant'),
    prixRepere
  )
  const insolites = groupe.lieux.filter((l) => l.type === 'insolite')
  const items = []

  if (pintes.length) {
    const min = pintes[0]
    items.push({
      q: `Quel est le bar le moins cher de ${groupe.libelle} ?`,
      r: `D'après le relevé du ${date}, c'est ${min.lieu.nom} (${min.lieu.adresse}) : la pinte à ${formatEuro(min.pinte.valeur)}${
        min.pinte.hh ? ' en happy hour' : ''
      }.${pintes[1] ? ` Suivent ${enumerer(pintes.slice(1, 3).map((x) => `${x.lieu.nom} (${formatEuro(x.pinte.valeur)})`))}.` : ''}`,
    })
  }
  if (pintes.length >= 3) {
    const v = pintes.map((x) => x.pinte.valeur)
    items.push({
      q: `Combien coûte une pinte à ${groupe.libelle} ?`,
      r: `Dans les ${pintes.length} bars de ${groupe.libelle} dont le prix de la pinte est connu, le meilleur prix de la pinte va de ${formatEuro(v[0])} à ${formatEuro(v.at(-1))}, pour une médiane de ${formatEuro(mediane(v))} (prix du ${date}).`,
    })
  }
  if (avecHh.length) {
    items.push({
      q: `Quels bars de ${groupe.libelle} ont un happy hour ?`,
      r: `${avecHh.length} bar${avecHh.length > 1 ? 's' : ''} sur ${groupe.lieux.length} affiche${avecHh.length > 1 ? 'nt' : ''} des horaires de happy hour${avecHh.length > 3 ? ', par exemple' : ' :'} ${enumerer(
        avecHh.slice(0, 3).map((l) => `${l.nom} (${resumeHappyHour(l).replace(/^happy hour /, '')})`)
      )}.`,
    })
  }
  if (insolites.length) {
    items.push({
      q: `Y a-t-il des bars insolites à ${groupe.libelle} ?`,
      r: `Oui, ${insolites.length} : ${enumerer(insolites.slice(0, 4).map((l) => (l.concept ? `${l.nom} (${l.concept.replace(/\.$/, '').toLowerCase()})` : l.nom)))}.`,
    })
  }
  return items
}

// Première phrase d'une fiche de bar : la réponse à « combien coûte une
// pinte à <bar> ? », lisible seule.
export function resumeBar(lieu, lieux, maj) {
  const p = lieu.prix ?? {}
  const arr = nomArr(lieu, lieux)
  const tarifs = [
    p.pinte_hh != null ? `pinte à ${formatEuro(p.pinte_hh)} en happy hour` : null,
    p.pinte_hors_hh != null ? `${p.pinte_hh != null ? '' : 'pinte à '}${formatEuro(p.pinte_hors_hh)}${p.pinte_hh != null ? ' le reste du temps' : ''}` : null,
    p.ticket_entree != null ? `entrée à ${formatEuro(p.ticket_entree)}` : null,
    p.cocktail != null && p.pinte_hh == null && p.pinte_hors_hh == null ? `cocktail à ${formatEuro(p.cocktail)}` : null,
  ].filter(Boolean)
  const hh = resumeHappyHour(lieu)
  const debut = lieu.type === 'insolite' ? `${lieu.nom}, bar insolite à ${arr}` : `${lieu.nom} (${arr})`
  const concept = lieu.type === 'insolite' && lieu.concept ? lieu.concept.replace(/\.$/, '') : null
  return [
    tarifs.length
      ? `${debut} : ${tarifs.join(', ')}.${concept ? ` ${concept}.` : ''}`
      : `${debut}${concept ? ` : ${concept.charAt(0).toLowerCase()}${concept.slice(1)}` : ''}.`,
    hh && lieu.hh?.type_tarif !== 'constant' && lieu.hh?.debut ? `${hh.charAt(0).toUpperCase()}${hh.slice(1)}.` : null,
    lieu.hh?.type_tarif === 'constant' ? 'Même prix toute la journée.' : null,
    `${tarifs.length ? 'Prix relevés' : 'Données relevées'} le ${dateCourte(maj)}.`,
  ]
    .filter(Boolean)
    .join(' ')
}

// Balisage FAQPage d'une liste de questions.
export function faqJsonLd(items) {
  if (!items?.length) return null
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, r }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: r },
    })),
  }
}
