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

// Petits mots qui ne peuvent pas finir un titre : « 10,50 € la séance
// au | BDE… » se lit comme une phrase coupée net.
const MOT_SUSPENDU = /\s+(?:à|au|aux|de|du|des|d'|la|le|les|l'|un|une|et|ou|sur|en|pour|par|avec|dès|chez|dans|\+|×|&)$/iu

// Coupe sur un mot entier, sans ajouter de points de suspension : dans un
// titre ils font croire à un bug d'affichage.
function tronquer(texte, max) {
  if (texte.length <= max) return texte
  const coupe = texte.slice(0, max)
  const espace = coupe.lastIndexOf(' ')
  // La ponctuation restée en bout de coupe (« Happy hour de 16h à 22h : »)
  // se lit comme une phrase interrompue, surtout juste avant la marque.
  let propre = (espace > max * 0.6 ? coupe.slice(0, espace) : coupe).replace(/[\s:;,.–—-]+$/u, '')
  while (MOT_SUSPENDU.test(propre)) propre = propre.replace(MOT_SUSPENDU, '').replace(/[\s:;,.–—-]+$/u, '')
  return propre
}

// Directive d'indexation des pages publiques : on autorise en plus la
// grande vignette (Discover, résultats enrichis) et des extraits sans
// limite de longueur, que Google réduit sinon à un format minimal.
export const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
export const ROBOTS_NOINDEX = 'noindex, follow'

const TZ = 'Europe/Paris'

// Heure d'un événement à Paris (« 19h00 »), ou null quand elle n'est pas
// encore annoncée : un événement saisi à minuit n'a pas d'horaire connu
// (même convention que l'application, voir lib/formatDate.js).
export function heureParis(iso) {
  try {
    const parts = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: TZ,
    }).formatToParts(new Date(iso))
    const h = parts.find((p) => p.type === 'hour').value
    const m = parts.find((p) => p.type === 'minute').value
    return h === '00' && m === '00' ? null : `${h}h${m}`
  } catch {
    return null
  }
}

// « mercredi 28 octobre 2026 », dans le fuseau de Paris.
export function jourParis(iso) {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: TZ,
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

// « 2026-10-28 » à Paris : la forme qu'attend schema.org pour une date
// sans heure.
function dateIsoParis(iso) {
  try {
    return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TZ }).format(
      new Date(iso)
    )
  } catch {
    return null
  }
}

// Prix stocké en centimes : « Gratuit », « 10 € », « 7,50 € ».
export function prixEvenement(cents) {
  if (cents == null) return null
  if (cents === 0) return 'Gratuit'
  const euros = cents / 100
  return `${Number.isInteger(euros) ? euros : euros.toFixed(2).replace('.', ',')} €`
}

// Une phrase qui donne les faits d'un événement (quand, où, combien).
// Elle complète les descriptions trop courtes : « Visite du musée du
// Louvre en nocturne. », seule, ne dit ni la date ni le lieu à qui la lit
// dans une page de résultats.
export function phraseEvenement(ev) {
  const heure = heureParis(ev.starts_at)
  const jour = jourParis(ev.starts_at)
  const lieu = [ev.location_name, ev.location_address].filter(Boolean).join(', ')
  const prix = prixEvenement(ev.price_cents)
  return [
    jour && `Le ${jour}${heure ? ` à ${heure}` : ''}${lieu ? `, ${lieu}` : ''}.`,
    prix && `Tarif : ${prix.toLowerCase() === 'gratuit' ? 'gratuit' : prix}.`,
    "Organisé par le BDE de l'IAE Paris-Sorbonne.",
  ]
    .filter(Boolean)
    .join(' ')
}

// Un événement dont la description contient la phrase « Complet. » n'a
// plus de places. La phrase seule, pas le mot : « un menu complet » ne
// doit pas fermer la billetterie.
export function estComplet(ev) {
  return /(?:^|[.!?]\s+)complet\s*[.!]?\s*(?:$|\n)/im.test(String(ev?.description ?? ''))
}

// Les pages fixes. Chaque description est écrite pour être lue dans une
// page de résultats Google : ce qu'on trouve, où, et pourquoi cliquer —
// pas une paraphrase du titre.
const PAGES = {
  '/accueil': {
    titre: 'BDE IAE Paris Sorbonne | Bureau des étudiants',
    description:
      "Site officiel du Bureau des étudiants de l'IAE Paris-Sorbonne (NBDE IAE Paris) : soirées, WEI, sport, sorties et réductions étudiantes. Association loi 1901 depuis 2008.",
  },
  '/evenements': {
    titre: 'Soirées et événements étudiants | BDE IAE Paris Sorbonne',
    description:
      "Toutes les soirées, sorties et activités du BDE de l'IAE Paris-Sorbonne : dates, lieux, tarifs et billetterie. WEI, soirées étudiantes, running, escalade.",
  },
  '/partenaires': {
    titre: 'Réductions étudiantes à Paris | BDE IAE Paris Sorbonne',
    description:
      "Les réductions négociées par le BDE de l'IAE Paris-Sorbonne : restauration, sport, culture, beauté. La carte étudiante suffit, sans inscription.",
  },
  '/bars': {
    // La page la plus susceptible d'attirer des visiteurs qui ne
    // cherchaient pas le BDE : « bar pas cher Paris » et « bar insolite
    // Paris » sont des recherches à gros volume, et on a 193 adresses à
    // leur opposer. Le titre les vise explicitement.
    titre: 'Bars pas chers et insolites à Paris | 193 adresses',
    description:
      "193 bars de Paris repérés par le BDE IAE Paris-Sorbonne : pinte dès 2,50 €, happy hours en cours en temps réel, 43 bars insolites. Carte et filtres par prix.",
  },
  '/a-propos': {
    titre: 'Qui sommes-nous | BDE IAE Paris Sorbonne',
    description:
      "Le Nouveau Bureau des Étudiants de l'IAE Paris, association loi 1901 fondée en 2008 : qui nous sommes, ce que nous organisons pour les étudiants de l'IAE Paris-Sorbonne, et comment nous joindre.",
  },
  '/mentions-legales': {
    titre: 'Mentions légales | BDE IAE Paris Sorbonne',
    description: "Mentions légales du site du Bureau des étudiants de l'IAE Paris-Sorbonne.",
    indexable: false,
  },
  '/confidentialite': {
    titre: 'Confidentialité | BDE IAE Paris Sorbonne',
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
//
// `modifie` : date de la dernière vraie modification du contenu, pour le
// <lastmod> du sitemap. Google ne se fie à ce champ que s'il est exact ;
// l'accueil, l'agenda et les partenaires prennent celle de leurs données.
export const ROUTES_STATIQUES = [
  { chemin: '/accueil', frequence: 'daily', priorite: '1.0' },
  { chemin: '/evenements', frequence: 'daily', priorite: '0.9' },
  { chemin: '/partenaires', frequence: 'weekly', priorite: '0.9' },
  { chemin: '/bars', frequence: 'monthly', priorite: '0.8' },
  { chemin: '/a-propos', frequence: 'yearly', priorite: '0.6', modifie: '2026-10-07' },
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
  linkedin: 'https://www.linkedin.com/company/bde-iae-paris-sorbonne-business-school/',
  // Présentation du bureau en cours. À remplacer à chaque élection —
  // c'est tout l'intérêt de pointer un post plutôt que de recopier les
  // noms dans la page.
  membres: 'https://www.instagram.com/p/DdbJeT7gNyO/?img_index=1',
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
    // Les profils officiels : c'est ce qui permet à Google de rattacher
    // le site, la page LinkedIn et le compte Instagram à une seule et
    // même organisation (panneau de connaissances, recherches de marque).
    sameAs: [ASSOCIATION.instagram, ASSOCIATION.linkedin],
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

// Les descriptions saisies en base ont une mise en forme légère (voir
// RichText) : intertitres en « # », puces, et d'anciens emoji en tête de
// ligne. Pour un extrait de moteur de recherche on n'en garde que le
// texte : les intertitres sautent, les puces deviennent des phrases.
const EMOJI_TETE = /^(?:\p{Extended_Pictographic}|\p{Emoji_Modifier}|\u200d|\ufe0f|\s)+/u

export function texteBrut(texte) {
  return String(texte ?? '')
    .split('\n')
    .map((ligne) => ligne.trim().replace(EMOJI_TETE, ''))
    .filter((ligne) => ligne && !/^#{1,3}\s/.test(ligne))
    .map((ligne) => ligne.replace(/^(?:[•\-–]|\d+[.)])\s+/, ''))
    .map((ligne) => (/[.:;!?)]$/.test(ligne) ? ligne : `${ligne}.`))
    .join(' ')
}

// Coupe proprement à la limite d'un mot : une description tronquée en
// plein milieu d'un mot fait négligé dans les résultats de recherche.
export function resumer(texte, max = 160) {
  const propre = texteBrut(texte)
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
  // donnait « WEICUP Latino Edition, 25 | BDE IAE Paris Sorbonne » :
  // un « 25 » orphelin dit moins que pas de date du tout.
  const avecDate = `${evenement.title}, ${quand}`
  const titreBase = quand && avecDate.length <= 40 ? avecDate : evenement.title

  // Les descriptions saisies en base sont parfois d'une ligne (« Visite du
  // musée du Louvre en nocturne. ») : trop maigre pour un extrait Google,
  // et c'est ce genre de page que Google laisse « détectée, non indexée ».
  // On complète alors avec la date, le lieu et le prix.
  const texte = texteBrut(evenement.description)
  const description = texte.length >= 110 ? texte : `${texte} ${phraseEvenement(evenement)}`.trim()

  // Sans heure annoncée, schema.org accepte une date seule : mieux qu'un
  // « 00:00 » que Google afficherait comme l'heure de début.
  const debut = heureParis(evenement.starts_at) ? evenement.starts_at : dateIsoParis(evenement.starts_at)
  const complet = estComplet(evenement)

  return {
    titre: avecMarque(titreBase),
    description: resumer(description),
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
          startDate: debut,
          ...(evenement.ends_at && { endDate: evenement.ends_at }),
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          description: resumer(description, 500),
          image: affiche ?? IMAGE_PARTAGE,
          ...(lieu && { location: lieu }),
          organizer: organisation(),
          url: `${SITE}${chemin}`,
          inLanguage: 'fr-FR',
          // Le prix est stocké en centimes ; 0 est un tarif valable
          // (événement gratuit) et doit être annoncé comme tel, pas omis.
          // Une billetterie sans prix connu est quand même déclarée : c'est
          // le lien que Google affiche sous « Billets ».
          ...((evenement.price_cents != null || evenement.ticket_url || complet) && {
            offers: {
              '@type': 'Offer',
              ...(evenement.price_cents != null && {
                price: (evenement.price_cents / 100).toFixed(2),
                priceCurrency: 'EUR',
              }),
              availability: complet ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
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
    titre: avecMarque(`${partenaire.name} : ${tronquer(partenaire.benefit, 30)}`),
    description: resumer(
      `${partenaire.benefit} pour les étudiants de l'IAE Paris-Sorbonne chez ${partenaire.name}${
        partenaire.address ? `, ${partenaire.address}` : ''
      }. ${texteBrut(partenaire.description)}`
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
