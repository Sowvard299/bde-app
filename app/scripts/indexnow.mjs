// Signale les pages du site à IndexNow (Bing, Yandex, Seznam, Naver).
// Bing alimente la recherche de ChatGPT et de Copilot : une page connue de
// Bing plus tôt peut être citée plus tôt.
//
//   node scripts/indexnow.mjs                 toutes les URL du sitemap
//   node scripts/indexnow.mjs /bars /accueil  seulement celles-ci
//
// À lancer après une mise en production qui ajoute ou change des pages.
// La clé est publique par conception (fichier servi à la racine du site).
const SITE = 'https://bdeiaeparis.com'
const CLE = '102b8d6a4a0b0aa2ffd32ce4c5427247'

const demandees = process.argv.slice(2)
let urls
if (demandees.length) {
  urls = demandees.map((u) => new URL(u, SITE).toString())
} else {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text()
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

const reponse = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: 'bdeiaeparis.com', key: CLE, keyLocation: `${SITE}/${CLE}.txt`, urlList: urls }),
})
console.log(`${urls.length} URL envoyées, réponse IndexNow : ${reponse.status} ${reponse.statusText}`)
