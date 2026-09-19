import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env.generated'

// Accès Supabase depuis le Worker, en REST brut.
//
// Pas de @supabase/supabase-js ici : le Worker ne fait que deux lectures
// publiques, et embarquer la bibliothèque cliente ferait grossir un
// script qui doit démarrer à chaque requête HTML du site.

export const supabaseConfigure = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

// Le référencement ne doit jamais retarder l'affichage. Si Supabase ne
// répond pas vite, on rend la page avec les métadonnées par défaut :
// une carte de partage générique vaut mieux qu'une page qui met trois
// secondes à arriver.
const DELAI_MAX_MS = 2000

// Les fiches changent rarement et sont demandées en rafale quand un lien
// circule sur Instagram ou WhatsApp : une minute de cache au bord suffit
// à absorber le pic sans jamais servir une information vraiment périmée.
const CACHE_S = 60

export async function lireTable(chemin) {
  if (!supabaseConfigure) return null

  const url = `${SUPABASE_URL}/rest/v1/${chemin}`

  try {
    const reponse = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        accept: 'application/json',
      },
      signal: AbortSignal.timeout(DELAI_MAX_MS),
      cf: { cacheTtl: CACHE_S, cacheEverything: true },
    })

    if (!reponse.ok) return null
    return await reponse.json()
  } catch {
    // Supabase injoignable, quota dépassé, délai dépassé : l'appelant
    // retombera sur les métadonnées par défaut.
    return null
  }
}

// Les identifiants viennent de l'URL : on refuse tout ce qui n'a pas la
// forme d'un UUID plutôt que de le recopier dans une requête.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function estUuid(valeur) {
  return UUID.test(valeur)
}

export async function lireEvenement(id) {
  if (!estUuid(id)) return null
  const lignes = await lireTable(`events?select=*&is_published=eq.true&id=eq.${id}&limit=1`)
  return lignes?.[0] ?? null
}

export async function lirePartenaire(id) {
  if (!estUuid(id)) return null
  const lignes = await lireTable(
    `partners?select=*,partner_categories(id,name,slug)&is_published=eq.true&id=eq.${id}&limit=1`
  )
  return lignes?.[0] ?? null
}

export async function listerPourSitemap() {
  const [evenements, partenaires] = await Promise.all([
    lireTable('events?select=id,updated_at&is_published=eq.true&order=starts_at.desc'),
    lireTable('partners?select=id,updated_at&is_published=eq.true&order=name'),
  ])

  return { evenements: evenements ?? [], partenaires: partenaires ?? [] }
}

// Listes completes, pour le rendu des pages de liste. Le meme cache d'une
// minute que les fiches : un robot qui parcourt le site enchaine les
// pages, il ne faut pas une requete Supabase par passage.
export async function listerEvenementsComplets() {
  return await lireTable(
    'events?select=id,title,starts_at,location_name&is_published=eq.true&order=starts_at.desc'
  )
}

export async function listerPartenairesComplets() {
  return await lireTable(
    'partners?select=id,name,benefit,address&is_published=eq.true&order=name'
  )
}
