import {
  IMAGE_PARTAGE,
  ROBOTS_INDEX,
  ROBOTS_NOINDEX,
  ROUTES_STATIQUES,
  SITE,
  metaArrondissementBars,
  metaBar,
  metaEvenement,
  metaParDefaut,
  metaPartenaire,
  metaStatique,
} from '../src/lib/seo'
import {
  lireEvenement,
  lirePartenaire,
  listerEvenementsComplets,
  listerPartenairesComplets,
  listerPourSitemap,
} from './supabase'
import { rendu } from './rendu'
import { BUILD_ID } from './env.generated'
import donneesBars from '../src/data/bars-paris.json'
import { indexBars } from '../src/lib/barsSeo'

// Worker placé devant les fichiers statiques du site.
//
// Le site est une application React d'une seule page : le serveur rend le
// même index.html pour /bars, /evenements et tout le reste. Sans ce
// Worker, chaque URL sortait donc avec le titre de l'accueil, sa
// description, et surtout son <link rel="canonical"> — autrement dit
// chaque page déclarait à Google être un doublon de l'accueil, ce qui
// suffit à la faire sortir de l'index quoi qu'on mette dans le sitemap.
//
// React corrige ces balises une fois démarré, mais trop tard pour les
// robots des réseaux sociaux (WhatsApp, Instagram, LinkedIn n'exécutent
// aucun JavaScript) et trop tard pour être fiable côté Google. On les
// écrit donc ici, avant que le HTML ne parte.
//
// Règle du fichier : le référencement ne casse jamais le site. Toute
// erreur retombe sur le fichier statique tel quel.

export default {
  async fetch(request, env, ctx) {
    try {
      return await router(request, env, ctx)
    } catch {
      return env.ASSETS.fetch(request)
    }
  },
}

async function router(request, env, ctx) {
  const url = new URL(request.url)

  // L'accueil vivait sous deux adresses : « / », qui renvoyait le HTML,
  // puis une redirection JavaScript vers « /accueil ». Deux URL pour une
  // page, c'est à Google de trancher laquelle compte. On tranche à sa
  // place, et une redirection permanente transmet à /accueil tout ce que
  // « / » a pu accumuler comme liens entrants.
  if (url.pathname === '/') {
    // Redirection vers la meme origine, pas vers le domaine ecrit en
    // dur : sinon un deploiement de preversion renverrait ses visiteurs
    // en production.
    return Response.redirect(new URL('/accueil', url).toString(), 301)
  }

  // Ancienne adresse de la carte, redirigee jusqu'ici en JavaScript :
  // pour un robot, c'etait donc une deuxieme page au contenu identique.
  if (url.pathname === '/carte-bde') {
    return Response.redirect(new URL('/partenaires', url).toString(), 301)
  }

  if (url.pathname === '/sitemap.xml') {
    return sitemap(ctx)
  }

  const reponse = await env.ASSETS.fetch(request)

  // Seules les pages HTML nous intéressent. Les images, scripts et
  // feuilles de style traversent sans être touchés.
  const type = reponse.headers.get('content-type') ?? ''
  if (!type.includes('text/html')) return reponse

  const { meta, corps, introuvable } = await pagePour(url.pathname)
  return injecter(reponse, meta, corps, introuvable)
}

// Rassemble tout ce qu'une adresse produit : ses métadonnées, son
// contenu HTML, et si elle existe.
async function pagePour(chemin) {
  const normalise = chemin.replace(/\/+$/, '') || '/accueil'
  const statique = metaStatique(normalise)

  if (statique) {
    // Les deux pages de liste ont besoin de leurs données. Si Supabase ne
    // répond pas, la page part sans sa liste plutôt que de faire attendre.
    let donnees = {}
    if (normalise === '/evenements') donnees = { evenements: await listerEvenementsComplets() }
    if (normalise === '/partenaires') donnees = { partenaires: await listerPartenairesComplets() }
    // L'accueil, la page la plus forte du site, relie directement chaque
    // événement à venir et chaque partenaire : c'est le chemin le plus
    // court pour que Google découvre et explore les fiches.
    if (normalise === '/accueil') {
      const [evenements, partenaires] = await Promise.all([listerEvenementsComplets(), listerPartenairesComplets()])
      donnees = { evenements, partenaires }
    }

    return { meta: statique, corps: rendu(normalise, donnees), introuvable: false }
  }

  const idEvenement = normalise.match(/^\/evenements\/([^/]+)$/)
  if (idEvenement) {
    // La fiche et la liste en parallèle : la liste sert au bloc « À venir
    // aussi », qui relie les fiches entre elles.
    const [evenement, evenements] = await Promise.all([lireEvenement(idEvenement[1]), listerEvenementsComplets()])
    if (evenement) {
      return { meta: metaEvenement(evenement), corps: rendu(normalise, { evenement, evenements }), introuvable: false }
    }
    return introuvablePage()
  }

  // Une page par bar et une par arrondissement, sous /bars/.
  const segmentBar = normalise.match(/^\/bars\/([^/]+)$/)
  if (segmentBar) {
    const { parSlug, arrParSlug } = indexBars(donneesBars.lieux)
    const groupe = arrParSlug.get(segmentBar[1])
    if (groupe) {
      return {
        meta: metaArrondissementBars(groupe, donneesBars.lieux, donneesBars.maj),
        corps: rendu(normalise, { groupe }),
        introuvable: false,
      }
    }
    const lieu = parSlug.get(segmentBar[1])
    if (lieu) {
      return { meta: metaBar(lieu, donneesBars.lieux, donneesBars.maj), corps: rendu(normalise, { bar: lieu }), introuvable: false }
    }
    return introuvablePage()
  }

  const idPartenaire = normalise.match(/^\/partenaires\/([^/]+)$/)
  if (idPartenaire) {
    const [partenaire, partenaires] = await Promise.all([lirePartenaire(idPartenaire[1]), listerPartenairesComplets()])
    if (partenaire) {
      return { meta: metaPartenaire(partenaire), corps: rendu(normalise, { partenaire, partenaires }), introuvable: false }
    }
    return introuvablePage()
  }

  return introuvablePage()
}

// Une adresse inconnue répondait 200 avec la coquille de l'application,
// donc une page blanche. Google compte ces réponses comme des « soft
// 404 » et les signale : il faut un vrai code d'erreur.
function introuvablePage() {
  return { meta: metaParDefaut(), corps: rendu('/introuvable'), introuvable: true }
}

// Un contenu saisi en base peut contenir n'importe quoi ; échapper les
// chevrons empêche qu'un « </script> » dans une description d'événement
// referme la balise et laisse le reste s'exécuter comme du HTML.
function jsonLdSur(meta) {
  return JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
}

function injecter(reponse, meta, corps, introuvable) {
  const imageParDefaut = meta.image === IMAGE_PARTAGE

  const transformee = (
    new HTMLRewriter()
      .on('title', {
        element: (el) => el.setInnerContent(meta.titre),
      })
      .on('meta[name="description"]', {
        element: (el) => el.setAttribute('content', meta.description),
      })
      .on('meta[property="og:url"]', {
        element: (el) => el.setAttribute('content', meta.canonical),
      })
      .on('meta[property="og:title"]', {
        element: (el) => el.setAttribute('content', meta.titre),
      })
      .on('meta[property="og:description"]', {
        element: (el) => el.setAttribute('content', meta.description),
      })
      .on('meta[property="og:image"]', {
        element: (el) => el.setAttribute('content', meta.image),
      })
      .on('meta[property="og:type"]', {
        element: (el) => el.setAttribute('content', meta.typeOg ?? 'website'),
      })
      // Les dimensions écrites en dur ne valent que pour l'image de
      // partage par défaut. Sur une affiche d'événement elles mentiraient,
      // et un aperçu aux mauvaises proportions est pire que pas de
      // dimensions du tout.
      .on('meta[property="og:image:width"]', {
        element: (el) => {
          if (!imageParDefaut) el.remove()
        },
      })
      .on('meta[property="og:image:height"]', {
        element: (el) => {
          if (!imageParDefaut) el.remove()
        },
      })
      .on('meta[name="twitter:title"]', {
        element: (el) => el.setAttribute('content', meta.titre),
      })
      .on('meta[name="twitter:description"]', {
        element: (el) => el.setAttribute('content', meta.description),
      })
      .on('meta[name="twitter:image"]', {
        element: (el) => el.setAttribute('content', meta.image),
      })
      .on('script[type="application/ld+json"]', {
        element: (el) => el.setInnerContent(jsonLdSur(meta), { html: true }),
      })
      // Le canonique et la directive d'indexation sont ajoutés ici plutôt
      // que réécrits : index.html n'en contient aucun, exprès. Si ce
      // Worker tombait, mieux vaut une page sans canonique — Google se
      // rabat alors sur l'URL demandée, ce qui est le bon comportement —
      // qu'une page qui se déclare à tort copie de l'accueil.
      .on('head', {
        element: (el) => {
          el.append(`<link rel="canonical" href="${echapper(meta.canonical)}">`, { html: true })
          // Toujours une directive explicite : sur les pages publiques elle
          // autorise la grande vignette et des extraits complets.
          el.append(`<meta name="robots" content="${meta.indexable ? ROBOTS_INDEX : ROBOTS_NOINDEX}">`, { html: true })
        },
      })
      // Le contenu de la page, ecrit dans le conteneur que React vide
      // au demarrage. Voir worker/rendu.js : sans lui, le corps du
      // document part vide, et les robots qui n'executent pas de
      // JavaScript ne voient rien du tout.
      .on('#root', {
        element: (el) => {
          if (corps) el.setInnerContent(corps, { html: true })
        },
      })
      .transform(reponse)
  )

  // Le statut doit changer avec le contenu : meme coquille, mais 404.
  return introuvable
    ? new Response(transformee.body, {
        status: 404,
        headers: transformee.headers,
      })
    : transformee
}

function echapper(valeur) {
  return String(valeur).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  )
}

// Le sitemap est produit à la demande plutôt que déposé dans les fichiers
// statiques : les événements et les partenaires sont ajoutés directement
// en base, sans redéploiement. Un fichier figé aurait été périmé dès la
// première soirée ajoutée.
async function sitemap(ctx) {
  const cache = caches.default
  // L'identifiant de construction dans la clé : un déploiement repart
  // donc d'un cache vide, au lieu de servir pendant une heure un sitemap
  // produit par la version précédente.
  const cle = new Request(`${SITE}/sitemap.xml?v=${encodeURIComponent(BUILD_ID)}`)

  const enCache = await cache.match(cle)
  if (enCache) return enCache

  const { evenements, partenaires } = await listerPourSitemap()

  // <lastmod> des pages fixes : la dernière modification de ce qu'elles
  // affichent. L'agenda change avec les événements, la page partenaires
  // avec les partenaires, l'accueil avec les deux, les bars avec le relevé
  // des prix. Google n'utilise ce champ que s'il est exact.
  const plusRecent = (lignes) => lignes.map((l) => l.updated_at).filter(Boolean).sort().at(-1) ?? null
  const majEvenements = plusRecent(evenements)
  const majPartenaires = plusRecent(partenaires)
  const majStatique = {
    '/accueil': [majEvenements, majPartenaires].filter(Boolean).sort().at(-1) ?? null,
    '/evenements': majEvenements,
    '/partenaires': majPartenaires,
    '/bars': donneesBars.maj,
  }

  const entrees = [
    ...ROUTES_STATIQUES.map((route) => ({
      url: `${SITE}${route.chemin}`,
      modifie: route.modifie ?? majStatique[route.chemin] ?? null,
      frequence: route.frequence,
      priorite: route.priorite,
    })),
    ...evenements.map((e) => ({
      url: `${SITE}/evenements/${e.id}`,
      modifie: e.updated_at,
      frequence: 'weekly',
      priorite: '0.7',
    })),
    ...partenaires.map((p) => ({
      url: `${SITE}/partenaires/${p.id}`,
      modifie: p.updated_at,
      frequence: 'monthly',
      priorite: '0.6',
    })),
    // Pages des arrondissements puis des bars : leur contenu change avec
    // le relevé des prix, d'où sa date.
    ...indexBars(donneesBars.lieux)
      .arrondissements.filter((a) => a.aSaPage)
      .map((a) => ({ url: `${SITE}/bars/${a.slug}`, modifie: donneesBars.maj, frequence: 'monthly', priorite: '0.7' })),
    ...[...indexBars(donneesBars.lieux).slugDe.values()].map((slug) => ({
      url: `${SITE}/bars/${slug}`,
      modifie: donneesBars.maj,
      frequence: 'monthly',
      priorite: '0.5',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entrees
  .map(
    (e) => `  <url>
    <loc>${echapper(e.url)}</loc>${e.modifie ? `\n    <lastmod>${e.modifie.slice(0, 10)}</lastmod>` : ''}
    <changefreq>${e.frequence}</changefreq>
    <priority>${e.priorite}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

  const reponse = new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      // Une heure au bord : assez pour ne pas réinterroger Supabase à
      // chaque passage d'un robot, assez court pour qu'une soirée ajoutée
      // le matin soit proposée à l'indexation le jour même.
      'cache-control': 'public, max-age=3600',
    },
  })

  ctx.waitUntil(cache.put(cle, reponse.clone()))
  return reponse
}
