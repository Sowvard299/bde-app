import {
  IMAGE_PARTAGE,
  ROUTES_STATIQUES,
  SITE,
  metaEvenement,
  metaParDefaut,
  metaPartenaire,
  metaStatique,
} from '../src/lib/seo'
import { lireEvenement, lirePartenaire, listerPourSitemap } from './supabase'

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

  if (url.pathname === '/sitemap.xml') {
    return sitemap(ctx)
  }

  const reponse = await env.ASSETS.fetch(request)

  // Seules les pages HTML nous intéressent. Les images, scripts et
  // feuilles de style traversent sans être touchés.
  const type = reponse.headers.get('content-type') ?? ''
  if (!type.includes('text/html')) return reponse

  const meta = await metaPourChemin(url.pathname)
  return injecter(reponse, meta)
}

async function metaPourChemin(chemin) {
  const statique = metaStatique(chemin)
  if (statique) return statique

  const evenement = chemin.match(/^\/evenements\/([^/]+)\/?$/)
  if (evenement) return metaEvenement(await lireEvenement(evenement[1])) ?? metaParDefaut()

  const partenaire = chemin.match(/^\/partenaires\/([^/]+)\/?$/)
  if (partenaire) return metaPartenaire(await lirePartenaire(partenaire[1])) ?? metaParDefaut()

  return metaParDefaut()
}

// Un contenu saisi en base peut contenir n'importe quoi ; échapper les
// chevrons empêche qu'un « </script> » dans une description d'événement
// referme la balise et laisse le reste s'exécuter comme du HTML.
function jsonLdSur(meta) {
  return JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
}

function injecter(reponse, meta) {
  const imageParDefaut = meta.image === IMAGE_PARTAGE

  return (
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
          if (!meta.indexable) {
            el.append('<meta name="robots" content="noindex, follow">', { html: true })
          }
        },
      })
      .transform(reponse)
  )
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
  const cle = new Request(`${SITE}/sitemap.xml`)

  const enCache = await cache.match(cle)
  if (enCache) return enCache

  const { evenements, partenaires } = await listerPourSitemap()

  const entrees = [
    ...ROUTES_STATIQUES.map((route) => ({
      url: `${SITE}${route.chemin}`,
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
