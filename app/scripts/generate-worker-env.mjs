// Passe les coordonnées Supabase au Worker Cloudflare.
//
// Pourquoi ce détour plutôt qu'un simple bloc [vars] dans wrangler.toml :
// le dépôt est public, et même si la clé anon est faite pour être
// publique (c'est la RLS qui protège les données, pas le secret de la
// clé), la convention du projet est de ne jamais la committer. On la lit
// donc là où elle vit déjà — les variables de build, côté Cloudflare
// comme en local — et on écrit un module que wrangler compile avec le
// reste du Worker.
//
// Le fichier produit est ignoré par git. Il est régénéré à chaque
// `npm run build`, c'est-à-dire avant chaque déploiement.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ici = dirname(fileURLToPath(import.meta.url))
const racine = join(ici, '..')
const destination = join(racine, 'worker', 'env.generated.js')

// En local les variables vivent dans .env, que Vite lit tout seul mais
// pas Node. En CI elles sont déjà dans l'environnement.
function depuisFichierEnv() {
  try {
    const brut = readFileSync(join(racine, '.env'), 'utf8')
    return Object.fromEntries(
      brut
        .split('\n')
        .map((ligne) => ligne.trim())
        .filter((ligne) => ligne && !ligne.startsWith('#'))
        .map((ligne) => {
          const separation = ligne.indexOf('=')
          return [
            ligne.slice(0, separation).trim(),
            ligne.slice(separation + 1).trim().replace(/^["']|["']$/g, ''),
          ]
        })
    )
  } catch {
    return {}
  }
}

const fichier = depuisFichierEnv()
const url = process.env.VITE_SUPABASE_URL || fichier.VITE_SUPABASE_URL || ''
const cle = process.env.VITE_SUPABASE_ANON_KEY || fichier.VITE_SUPABASE_ANON_KEY || ''

// Pas de `throw` si c'est vide : le Worker sait s'en passer (les pages
// fixes gardent leurs métadonnées, les fiches retombent sur les valeurs
// par défaut). Faire échouer la construction du site parce que le
// référencement des fiches serait dégradé serait une punition disproportionnée.
if (!url || !cle) {
  console.warn(
    '[seo] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY absents : ' +
      'les fiches événement et partenaire garderont les métadonnées par défaut.'
  )
}

mkdirSync(dirname(destination), { recursive: true })
writeFileSync(
  destination,
  `// Généré par scripts/generate-worker-env.mjs — ne pas modifier à la main.\n` +
    `export const SUPABASE_URL = ${JSON.stringify(url)}\n` +
    `export const SUPABASE_ANON_KEY = ${JSON.stringify(cle)}\n`,
  'utf8'
)

console.log(`[seo] worker/env.generated.js écrit (${url ? 'Supabase configuré' : 'sans Supabase'})`)
