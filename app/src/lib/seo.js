// Source unique des métadonnées de référencement.
//
// Ce fichier est partagé par deux mondes : l'application React, qui met à
// jour le <head> quand on navigue d'un onglet à l'autre, et le Worker
// Cloudflare, qui écrit ces mêmes valeurs dans le HTML avant même qu'il
// parte du serveur. Les deux doivent dire exactement la même chose — un
// titre côté serveur et un autre côté navigateur, c'est le genre
// d'incohérence que Google relève et que personne ne remarque en testant.
//
// D'où la contrainte : rien ici ne doit dépendre du DOM, de React ou de
// `import.meta.env`. Que des fonctions pures. L'écriture dans le document
// vit dans seoDom.js, l'injection serveur dans worker/index.js.

export const SITE = 'https://bdeiaeparis.com'
export const NOM_SITE = 'BDE IAE Paris Sorbonne'
export const IMAGE_PARTAGE = `${SITE}/og-image.png`

// Google coupe les titres autour de 60 caractères et les descriptions
// autour de 160. Au-delà, le texte n'est pas seulement tronqué : la fin
// de la phrase, souvent celle qui donne envie de cliquer, disparaît.
// D'où une marque abrégée, et des titres de pages fixes écrits en entier
// plutôt qu'assemblés.
const MARQUE = 'BDE IAE Paris Sorbonne'

function avecMarque(titre, budget = 65) {
  const suffixe = ` | ${MARQUE}`
  const place = budget - suffixe.length
  return `${titre.length > place ? tronquer(titre, place) : titre}${suffixe}`
}

// Coupe sur un mot entier, sans ajouter de points de suspension : dans un
// titre ils font croire à un bug d'affichage.
function tronquer(texte, max) {
  if (texte.length <= max) return texte
  const coupe = texte.slice(0, max)
  const espace = coupe.lastIndexOf(' ')
  // La ponctuation restée en bout de coupe (« Happy hour de 16h à 22h : »)
  // se lit comme une phrase interrompue, surtout juste avant la marque.
  return (espace > max * 0.6 ? coupe.slice(0, espace) : coupe).replace(/[\s:;,.–—-]+$/u, '')
}

// Les pages fixes. Chaque description est écrite pour être lue dans une
// page de résultats Google : ce qu'on trouve, où, et pourquoi cliquer —
// pas une paraphrase du titre.
const PAGES = {
  '/accueil': {
    titre: 'BDE IAE Paris Sorbonne — Bureau des étudiants',
    description:
      "Site officiel du Bureau des étudiants de l'IAE Paris-Sorbonne (NBDE IAE Paris) : soirées, WEI, sport, sorties et réductions étudiantes. Association loi 1901 depuis 2008.",
  },
  '/evenements': {
    titre: 'Soirées et événements étudiants — BDE IAE Paris Sorbonne',
    description:
      "Toutes les soirées, sorties et activités du BDE de l'IAE Paris-Sorbonne : dates, lieux, tarifs et billetterie. WEI, soirées étudiantes, running, escalade.",
  },
  '/partenaires': {
    titre: 'Réductions étudiantes à Paris — BDE IAE Paris Sorbonne',
    description:
      "Les réductions négociées par le BDE de l'IAE Paris-Sorbonne : restauration, sport, culture, beauté. Ta carte étudiante suffit, aucune inscription.",
  },
  '/bars': {
    // La page la plus susceptible d'attirer des visiteurs qui ne
    // cherchaient pas le BDE : « bar pas cher Paris » et « bar insolite
    // Paris » sont des recherches à gros volume, et on a 193 adresses à
    // leur opposer. Le titre les vise explicitement.
    titre: 'Bars pas chers et insolites à Paris — 193 adresses',
    description:
      "193 bars de Paris repérés par le BDE IAE Paris-Sorbonne : pinte dès 2,50 €, happy hours en cours en temps réel, 43 bars insolites. Carte et filtres par prix.",
  },
  '/a-propos': {
    titre: 'Qui sommes-nous — BDE IAE Paris Sorbonne',
    description:
      "Le Nouveau Bureau des Étudiants de l'IAE Paris, association loi 1901 fondée en 2008 : qui nous sommes, ce que nous organisons pour les étudiants de l'IAE Paris-Sorbonne, et comment nous joindre.",
  },
  '/mentions-legales': {
    titre: 'Mentions légales — BDE IAE Paris Sorbonne',
    description: "Mentions légales du site du Bureau des étudiants de l'IAE Paris-Sorbonne.",
    indexable: false,
  },
  '/confidentialite': {
    titre: 'Confidentialité — BDE IAE Paris Sorbonne',
    description:
      "Politique de confidentialité et traitement des données personnelles sur le site du BDE de l'IAE Paris-Sorbonne.",
    indexable: false,
  },
}

// Les pages proposées à l'indexation, avec leur fréquence de mise à jour
// réelle. Les mentions légales et la confidentialité n'y figurent pas :
// elles sont en noindex, et soumettre au robot une page qu'on lui
// demande ensuite d'ignorer ne fait que remplir la Search Console
// d'avertissements.
export const ROUTES_STATIQUES = [
  { chemin: '/accueil', frequence: 'daily', priorite: '1.0' },
  { chemin: '/evenements', frequence: 'daily', priorite: '0.9' },
  { chemin: '/partenaires', frequence: 'weekly', priorite: '0.9' },
  { chemin: '/bars', frequence: 'monthly', priorite: '0.8' },
  { chemin: '/a-propos', frequence: 'yearly', priorite: '0.6' },
]

// Les faits de l'association, tels qu'ils figurent dans les mentions
// légales. Un Organization réduit à un nom et un logo n'apprend rien à
// personne ; avec une forme juridique, une adresse, une date de création
// et un contact, le site cesse d'être un site anonyme — c'est ce que
// Google appelle la fiabilité, et ce qu'un moteur de réponse cite.
export const ASSOCIATION = {
  nomLegal: "Nouveau Bureau des Étudiants de l'IAE Paris",
  sigle: 'NBDE IAE Paris',
  fondation: '2008',
  adresse: '11-15 rue Ponscarme',
  codePostal: '75013',
  ville: 'Paris',
  email: 'bde.iaeparis@gmail.com',
  instagram: 'https://www.instagram.com/bde.iaeparissorbonne',
  ecole: "IAE Paris-Sorbonne Business School",
}

function siteWeb() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE}/#site`,
    url: `${SITE}/accueil`,
    name: NOM_SITE,
    alternateName: ['BDE IAE Paris', 'NBDE IAE Paris'],
    inLanguage: 'fr-FR',
    publisher: { '@id': `${SITE}/#organisation` },
  }
}

function organisation() {
  return {
    '@type': 'Organization',
    '@id': `${SITE}/#organisation`,
    name: NOM_SITE,
    alternateName: [
      ASSOCIATION.nomLegal,
      ASSOCIATION.sigle,
      'BDE IAE Paris',
      'BDE IAE Paris-Sorbonne',
      "BDE de l'IAE Paris",
    ],
    description:
      "Bureau des étudiants de l'IAE Paris-Sorbonne : organisation d'événements étudiants, de sorties et de partenariats à tarif réduit.",
    url: `${SITE}/accueil`,
    logo: `${SITE}/pwa-512.png`,
    foundingDate: ASSOCIATION.fondation,
    email: ASSOCIATION.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ASSOCIATION.adresse,
      postalCode: ASSOCIATION.codePostal,
      addressLocality: ASSOCIATION.ville,
      addressCountry: 'FR',
    },
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: ASSOCIATION.ecole,
    },
    sameAs: [ASSOCIATION.instagram],
  }
}

// Le fil d'Ariane est le seul balisage de cette page qui donne un résultat
// visible dans Google : il remplace l'URL brute sous le titre, ce qui
// compte d'autant plus ici que nos URL de fiches se terminent par un
// identifiant illisible.
function filAriane(etapes) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: etapes.map((etape, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: etape.nom,
      item: `${SITE}${etape.chemin}`,
    })),
  }
}

// Les affiches d'événement sont parfois des vidéos : la carte de partage
// du WEICUP pointait sur un .mov, que ni WhatsApp ni Instagram ni
// LinkedIn ne savent afficher — le lien le plus partagé de l'année
// sortait donc sans image du tout. Faute de vignette, on retombe sur
// l'image du site, qui est au moins aux bonnes dimensions.
const IMAGE_FIXE = /\.(png|jpe?g|webp|gif|avif)(\?|$)/i

export function imagePartageable(url) {
  return url && IMAGE_FIXE.test(url) ? url : null
}

function dateFr(iso) {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      timeZone: 'Europe/Paris',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

// Coupe proprement à la limite d'un mot : une description tronquée en
// plein milieu d'un mot fait négligé dans les résultats de recherche.
export function resumer(texte, max = 160) {
  const propre = String(texte ?? '')
    .replace(/\s+/g, ' ')
    .trim()
  if (propre.length <= max) return propre
  const coupe = propre.slice(0, max - 1)
  return `${coupe.slice(0, coupe.lastIndexOf(' '))}…`
}

// Métadonnées d'une page fixe. Renvoie null pour une route inconnue :
// c'est à l'appelant de décider quoi faire (une fiche de détail a ses
// propres métadonnées, une URL inexistante garde celles par défaut).
export function metaStatique(chemin) {
  const normalise = chemin === '/' ? '/accueil' : chemin.replace(/\/+$/, '') || '/accueil'
  const page = PAGES[normalise]
  if (!page) return null

  const estAccueil = normalise === '/accueil'
  return {
    titre: page.titre,
    description: page.description,
    // Le Worker redirige « / » vers « /accueil » : il n'existe donc
    // qu'une seule adresse pour l'accueil, et c'est celle-ci.
    canonical: `${SITE}${normalise}`,
    image: IMAGE_PARTAGE,
    indexable: page.indexable !== false,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': estAccueil
        ? [organisation(), siteWeb()]
        : [
            organisation(),
            filAriane([
              { nom: 'Accueil', chemin: '/accueil' },
              { nom: page.titre, chemin: normalise },
            ]),
          ],
    },
  }
}

// Fiche d'un événement. C'est la page qui a le plus à gagner d'un
// balisage : un Event correctement décrit peut apparaître dans le module
// « événements » de Google, avec sa date et son lieu, sans qu'on ait à
// se battre pour une position dans les résultats classiques.
export function metaEvenement(evenement) {
  if (!evenement) return null

  const chemin = `/evenements/${evenement.id}`
  const quand = dateFr(evenement.starts_at)
  const affiche = imagePartageable(evenement.image_url)

  const lieu = evenement.location_name
    ? {
        '@type': 'Place',
        name: evenement.location_name,
        ...(evenement.location_address && {
          address: { '@type': 'PostalAddress', streetAddress: evenement.location_address },
        }),
        ...(evenement.latitude != null &&
          evenement.longitude != null && {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: evenement.latitude,
              longitude: evenement.longitude,
            },
          }),
      }
    : undefined

  // La date n'est ajoutée que si elle tient en entier. Tronquée, elle
  // donnait « WEICUP — Latino Edition — 25 | BDE IAE Paris Sorbonne » :
  // un « 25 » orphelin dit moins que pas de date du tout.
  const avecDate = `${evenement.title} — ${quand}`
  const titreBase = quand && avecDate.length <= 40 ? avecDate : evenement.title

  return {
    titre: avecMarque(titreBase),
    description: resumer(
      evenement.description ||
        `${evenement.title}${quand ? `, le ${quand}` : ''}${
          evenement.location_name ? ` à ${evenement.location_name}` : ''
        }. Un événement du BDE de l'IAE Paris-Sorbonne.`
    ),
    canonical: `${SITE}${chemin}`,
    image: affiche ?? IMAGE_PARTAGE,
    typeOg: 'article',
    indexable: true,
    jsonLd: {
      '@context': 'https://schema.org',
      // Google refuse un Event sans lieu : le balisage entier est alors
      // rejeté, et la Search Console le signale en erreur. Mieux vaut ne
      // rien déclarer que déclarer faux — la fiche garde son fil
      // d'Ariane, et il suffit de renseigner le lieu en base pour que
      // l'événement devienne éligible.
      '@graph': [
        ...(lieu
          ? [
        {
          '@type': 'Event',
          name: evenement.title,
          startDate: evenement.starts_at,
          ...(evenement.ends_at && { endDate: evenement.ends_at }),
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          ...(evenement.description && { description: resumer(evenement.description, 500) }),
          ...(affiche && { image: affiche }),
          ...(lieu && { location: lieu }),
          organizer: organisation(),
          url: `${SITE}${chemin}`,
          // Le prix est stocké en centimes ; 0 est un tarif valable
          // (événement gratuit) et doit être annoncé comme tel, pas omis.
          ...(evenement.price_cents != null && {
            offers: {
              '@type': 'Offer',
              price: (evenement.price_cents / 100).toFixed(2),
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
              url: evenement.ticket_url || `${SITE}${chemin}`,
            },
          }),
        },
            ]
          : []),
        filAriane([
          { nom: 'Accueil', chemin: '/accueil' },
          { nom: 'Événements', chemin: '/evenements' },
          { nom: evenement.title, chemin },
        ]),
      ],
    },
  }
}

export function metaPartenaire(partenaire) {
  if (!partenaire) return null

  const chemin = `/partenaires/${partenaire.id}`

  return {
    titre: avecMarque(`${partenaire.name} — ${tronquer(partenaire.benefit, 30)}`),
    description: resumer(
      `${partenaire.benefit} pour les étudiants de l'IAE Paris-Sorbonne chez ${partenaire.name}${
        partenaire.address ? `, ${partenaire.address}` : ''
      }. ${partenaire.description || ''}`
    ),
    canonical: `${SITE}${chemin}`,
    image: imagePartageable(partenaire.logo_url) ?? IMAGE_PARTAGE,
    indexable: true,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'LocalBusiness',
          name: partenaire.name,
          ...(partenaire.description && { description: resumer(partenaire.description, 500) }),
          ...(imagePartageable(partenaire.logo_url) && { image: partenaire.logo_url }),
          ...(partenaire.address && {
            address: { '@type': 'PostalAddress', streetAddress: partenaire.address },
          }),
          ...(partenaire.latitude != null &&
            partenaire.longitude != null && {
              geo: {
                '@type': 'GeoCoordinates',
                latitude: partenaire.latitude,
                longitude: partenaire.longitude,
              },
            }),
          ...(partenaire.phone && { telephone: partenaire.phone }),
          ...(partenaire.website_url && { sameAs: [partenaire.website_url] }),
          makesOffer: {
            '@type': 'Offer',
            name: partenaire.benefit,
            eligibleCustomerType: 'https://schema.org/Student',
          },
        },
        filAriane([
          { nom: 'Accueil', chemin: '/accueil' },
          { nom: 'Partenaires', chemin: '/partenaires' },
          { nom: partenaire.name, chemin },
        ]),
      ],
    },
  }
}

// Filet de sécurité : ce que porte une URL dont on ne sait rien (une
// fiche supprimée, une adresse tapée de travers). Volontairement non
// indexable — une page d'erreur dans l'index ne sert personne.
export function metaParDefaut() {
  return {
    titre: NOM_SITE,
    description: PAGES['/accueil'].description,
    canonical: `${SITE}/`,
    image: IMAGE_PARTAGE,
    indexable: false,
    jsonLd: { '@context': 'https://schema.org', '@graph': [organisation()] },
  }
}
