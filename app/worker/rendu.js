import donneesBars from '../src/data/bars-paris.json'
import {
  ASSOCIATION,
  NOM_SITE,
  SITE,
  estComplet,
  heureParis,
  jourParis,
  prixEvenement,
} from '../src/lib/seo'
import { serieEvenement } from '../src/lib/series'
// Les memes fonctions que celles qui affichent les prix et les happy
// hours dans l'application : le rendu serveur doit dire exactement ce que
// la page dira une fois React demarre.
import { formatEuro, prixRepere, tarifMaintenant } from '../src/lib/bars'

// Contenu HTML des pages, écrit par le serveur.
//
// Pourquoi : jusqu'ici le corps de chaque page était un <div id="root">
// vide. Google finit par exécuter le JavaScript et voir le contenu, mais
// les robots des moteurs de réponse — GPTBot, PerplexityBot, ClaudeBot,
// CCBot — n'en exécutent aucun. Pour eux, le site était une page blanche,
// alors qu'il porte la seule donnée vraiment citable du lot : 193 bars
// parisiens avec leurs prix.
//
// Ce rendu est remplacé par React dès qu'il démarre. Ce n'est donc pas
// une version dégradée cachée aux visiteurs : c'est la même information,
// dans une mise en page simple, servie à qui n'attend pas le JavaScript —
// y compris quelqu'un dont la connexion l'empêche de se charger.

function e(valeur) {
  return String(valeur ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  )
}

// Reprend les couleurs et les proportions du site pour que ce rendu ne
// ressemble pas à une page d'erreur pendant le temps qu'il est visible.
const STYLE = `
.ssr{--ink:#0f1564;--or:#ffc300;background:#fff;color:var(--ink);font-family:system-ui,sans-serif;
margin:0 auto;max-width:900px;padding:24px 20px 80px;line-height:1.5}
.ssr a{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.ssr a:hover{background:var(--or)}
.ssr h1{font-size:2.4rem;line-height:1;margin:.3em 0 .4em;text-transform:uppercase;letter-spacing:-.01em}
.ssr h2{font-size:.8rem;margin:2em 0 .5em;text-transform:uppercase;letter-spacing:.08em;
border-bottom:2px solid var(--ink);padding-bottom:6px}
.ssr p{color:#3a3f73;margin:.5em 0}
.ssr nav{border-bottom:2px solid var(--ink);padding-bottom:12px;margin-bottom:16px;
display:flex;flex-wrap:wrap;gap:14px;font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em}
.ssr ul{list-style:none;padding:0;margin:.5em 0;border-top:2px solid var(--ink)}
.ssr li{border-bottom:2px solid var(--ink);padding:10px 0}
.ssr .m{color:#555a8a;font-size:.85rem}
.ssr footer{margin-top:32px;border-top:2px solid var(--ink);padding-top:12px;font-size:.8rem;color:#555a8a}
`

// Les mêmes liens sur chaque page : c'est ce qui permet à un robot de
// parcourir le site de proche en proche au lieu de dépendre du sitemap.
function navigation() {
  return `<nav>
<a href="/accueil">Accueil</a>
<a href="/evenements">Agenda</a>
<a href="/partenaires">Partenaires</a>
<a href="/bars">Bars</a>
<a href="/a-propos">Le BDE</a>
</nav>`
}

function page(corps) {
  return `<div class="ssr"><style>${STYLE}</style>${navigation()}<main>${corps}</main>
<footer>${e(NOM_SITE)}, ${e(ASSOCIATION.nomLegal)}, association loi 1901.
Contact : <a href="mailto:${e(ASSOCIATION.email)}">${e(ASSOCIATION.email)}</a>.
<a href="${e(ASSOCIATION.instagram)}" rel="noopener me">Instagram</a>
<a href="${e(ASSOCIATION.linkedin)}" rel="noopener me">LinkedIn</a>
<a href="/mentions-legales">Mentions légales</a></footer></div>`
}

const maintenant = () => Date.now()

// Les événements à venir, du plus proche au plus lointain.
function aVenir(liste) {
  return (liste ?? [])
    .filter((ev) => new Date(ev.starts_at).getTime() >= maintenant() - 6 * 3600 * 1000)
    .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
}

// Une ligne d'agenda : le titre en lien, puis la date et le lieu.
function ligneEvenement(ev) {
  return `<li><a href="/evenements/${e(ev.id)}">${e(ev.title)}</a>
<div class="m">${e(dateLongue(ev.starts_at))}${ev.location_name ? ` · ${e(ev.location_name)}` : ''}</div></li>`
}

function lignePartenaire(pa) {
  return `<li><a href="/partenaires/${e(pa.id)}">${e(pa.name)}</a>
<div class="m">${e(pa.benefit)}${pa.address ? ` · ${e(pa.address)}` : ''}</div></li>`
}

// « samedi 10 octobre 2026 à 19h00 », ou la date seule quand l'heure
// n'est pas encore annoncée (événement saisi à minuit).
function dateLongue(iso) {
  const jour = jourParis(iso)
  const heure = heureParis(iso)
  return heure ? `${jour} à ${heure}` : jour
}

function accueil({ evenements: tous, partenaires: liste } = {}) {
  const prochains = aVenir(tous).slice(0, 8)
  return page(`<h1>${e(NOM_SITE)}</h1>
<p>Le bureau des étudiants de l'${e(ASSOCIATION.ecole)}. Soirées, sport, sorties et réductions
étudiantes, à Paris.</p>
${prochains.length ? `<h2>Prochains événements</h2><ul>${prochains.map(ligneEvenement).join('')}</ul>
<p><a href="/evenements">Tout l'agenda</a></p>` : ''}
${liste?.length ? `<h2>Partenaires étudiants</h2><ul>${liste.map(lignePartenaire).join('')}</ul>` : ''}
<h2>Rubriques</h2>
<ul>
<li><a href="/evenements">Les événements</a><div class="m">Soirées, week-end d'intégration, running, escalade : toutes les dates à venir.</div></li>
<li><a href="/partenaires">Les partenaires</a><div class="m">Les réductions négociées pour les étudiants de l'IAE. La carte étudiante suffit.</div></li>
<li><a href="/bars">Les bars de Paris</a><div class="m">193 adresses repérées par le BDE : les moins chères de la ville et les plus insolites.</div></li>
<li><a href="/a-propos">Qui sommes-nous</a><div class="m">L'association, ce qu'elle organise, et comment la joindre.</div></li>
</ul>`)
}

function aPropos() {
  return page(`<h1>Qui sommes-nous</h1>
<p>Le ${e(ASSOCIATION.nomLegal)} (${e(ASSOCIATION.sigle)}) est l'association étudiante de
l'${e(ASSOCIATION.ecole)}. Association loi 1901 fondée en ${e(ASSOCIATION.fondation)},
siège au ${e(ASSOCIATION.adresse)}, ${e(ASSOCIATION.codePostal)} ${e(ASSOCIATION.ville)}.</p>
<p>L'association organise la vie étudiante de l'école (soirées, week-end d'intégration,
sorties culturelles, club running, escalade) et négocie des réductions auprès de commerçants
pour les étudiants.</p>
<h2>Le bureau</h2>
<p>L'équipe change à chaque élection. Elle est présentée sur le compte de l'IAE Paris Sorbonne.
<a href="${e(ASSOCIATION.membres)}" rel="noopener">Voir les membres du bureau</a></p>
<h2>Contact</h2>
<p>Courriel : <a href="mailto:${e(ASSOCIATION.email)}">${e(ASSOCIATION.email)}</a><br>
Instagram : <a href="${e(ASSOCIATION.instagram)}" rel="noopener me">@bde.iaeparissorbonne</a><br>
LinkedIn : <a href="${e(ASSOCIATION.linkedin)}" rel="noopener me">BDE IAE Paris Sorbonne Business School</a></p>`)
}

function evenements(liste) {
  if (!liste?.length) return null

  const prochains = aVenir(liste)
  const ids = new Set(prochains.map((ev) => ev.id))
  const passes = liste
    .filter((ev) => !ids.has(ev.id))
    .sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at))

  return page(`<h1>Événements et soirées étudiants</h1>
<p>Toutes les dates organisées par le ${e(NOM_SITE)} : soirées, week-end d'intégration, running,
escalade et sorties.</p>
${prochains.length ? `<h2>À venir (${prochains.length})</h2><ul>${prochains.map(ligneEvenement).join('')}</ul>` : ''}
${passes.length ? `<h2>Déjà passés</h2><ul>${passes.map(ligneEvenement).join('')}</ul>` : ''}`)
}

// Descriptions saisies en base : intertitres en « # », puces en « - ».
// Rendu en vrais titres et en vraies listes, plus lisibles pour un robot
// qu'une suite de paragraphes.
function texteRiche(texte) {
  const blocs = []
  let liste = null
  for (const brute of String(texte).split('\n')) {
    const ligne = brute.trim()
    if (!ligne) continue
    const puce = ligne.match(/^(?:[•\-–]|\d+[.)])\s+(.*)$/)
    if (puce) {
      if (!liste) blocs.push((liste = []))
      liste.push(`<li>${e(puce[1])}</li>`)
      continue
    }
    liste = null
    const titre = ligne.match(/^#{1,3}\s+(.*)$/)
    blocs.push(titre ? `<h2>${e(titre[1])}</h2>` : `<p>${e(ligne)}</p>`)
  }
  return blocs.map((b) => (Array.isArray(b) ? `<ul>${b.join('')}</ul>` : b)).join('')
}

function evenement(ev, liste) {
  if (!ev) return null

  const passe = new Date(ev.ends_at ?? ev.starts_at).getTime() < maintenant() - 6 * 3600 * 1000
  const heure = heureParis(ev.starts_at)
  const prix = prixEvenement(ev.price_cents)
  const lieu = [ev.location_name, ev.location_address].filter(Boolean).join(', ')
  const complet = estComplet(ev)
  const autres = aVenir(liste)
    .filter((x) => x.id !== ev.id)
    .slice(0, 5)

  return page(`<h1>${e(ev.title)}</h1>
<p class="m">${e(serieEvenement(ev).label)}, organisé par le ${e(NOM_SITE)}</p>
${passe ? `<p><strong>Événement passé</strong> : il a eu lieu le ${e(jourParis(ev.starts_at))}.</p>` : ''}
<h2>Infos pratiques</h2>
<ul>
<li>Date : ${e(jourParis(ev.starts_at))}</li>
<li>Heure : ${e(heure ?? 'communiquée prochainement')}</li>
${lieu ? `<li>Lieu : ${e(lieu)}</li>` : ''}
${prix ? `<li>Tarif : ${e(prix)}</li>` : ''}
${complet ? '<li>Complet</li>' : ''}
</ul>
${ev.description ? `<h2>Programme</h2>${texteRiche(ev.description)}` : ''}
${ev.ticket_url && !passe && !complet ? `<p><a href="${e(ev.ticket_url)}" rel="noopener">Réserver sa place</a></p>` : ''}
${autres.length ? `<h2>À venir aussi</h2><ul>${autres.map(ligneEvenement).join('')}</ul>` : ''}
<p><a href="/evenements">Tout l'agenda</a> · <a href="/partenaires">Les partenaires du BDE</a></p>`)
}

function partenaires(liste) {
  if (!liste?.length) return null

  const items = liste.map(lignePartenaire).join('')

  return page(`<h1>Réductions étudiantes à Paris</h1>
<p>Les partenariats négociés par le ${e(NOM_SITE)} pour ses étudiants. La carte étudiante suffit,
aucune inscription n'est nécessaire.</p>
<ul>${items}</ul>`)
}

function partenaire(pa, liste) {
  if (!pa) return null
  const autres = (liste ?? []).filter((x) => x.id !== pa.id)

  return page(`<h1>${e(pa.name)}</h1>
<p><strong>${e(pa.benefit)}</strong></p>
${pa.address ? `<p class="m">${e(pa.address)}${pa.phone ? ` · ${e(pa.phone)}` : ''}</p>` : ''}
${pa.description ? texteRiche(pa.description) : ''}
${pa.website_url ? `<p><a href="${e(pa.website_url)}" rel="noopener">${/billetterie|helloasso/i.test(pa.website_url) ? 'Billetterie' : 'Site du partenaire'}</a></p>` : ''}
${autres.length ? `<h2>Autres partenaires</h2><ul>${autres.map(lignePartenaire).join('')}</ul>` : ''}
<p><a href="/partenaires">Tous les partenaires</a> · <a href="/evenements">L'agenda du BDE</a></p>`)
}

// La page qui justifie à elle seule ce fichier : 193 adresses avec leurs
// prix, c'est exactement le genre de liste qu'un moteur de réponse
// reprend quand on lui demande où boire pas cher à Paris.
function bars() {
  const ligne = (lieu) => {
    const prix = prixRepere(lieu)
    const tarif = tarifMaintenant(lieu)
    const details = [
      `${lieu.arrondissement}`,
      lieu.metro ? `métro ${lieu.metro}` : null,
      prix ? `${formatEuro(prix.valeur)} ${prix.libelle}` : null,
      tarif.etat === 'hors-creneau' || tarif.etat === 'constant' ? tarif.libelle : null,
    ]
      .filter(Boolean)
      .join(' · ')

    return `<li><strong>${e(lieu.nom)}</strong>, ${e(lieu.adresse)}
<div class="m">${e(details)}${lieu.concept ? ` · ${e(lieu.concept)}` : ''}</div></li>`
  }

  const pasChers = donneesBars.lieux.filter((l) => l.type === 'bar')
  const insolites = donneesBars.lieux.filter((l) => l.type === 'insolite')

  return page(`<h1>Bars pas chers et bars insolites à Paris</h1>
<p>${donneesBars.lieux.length} adresses à Paris, relevées par le ${e(NOM_SITE)}.
Données du ${e(donneesBars.maj.split('-').reverse().join('/'))} : prix pouvant avoir changé.
${e(donneesBars.avertissement)}</p>
<h2>Bars pas chers (${pasChers.length})</h2>
<ul>${pasChers.map(ligne).join('')}</ul>
<h2>Bars insolites (${insolites.length})</h2>
<ul>${insolites.map(ligne).join('')}</ul>`)
}

function simple(titre, texte) {
  return page(`<h1>${e(titre)}</h1><p>${e(texte)}</p>`)
}

// Renvoie le HTML à placer dans #root, ou null si la route n'a rien de
// particulier à dire — l'appelant laisse alors le conteneur vide.
export function rendu(chemin, donnees = {}) {
  switch (chemin) {
    case '/accueil':
      return accueil(donnees)
    case '/a-propos':
      return aPropos()
    case '/bars':
      return bars()
    case '/evenements':
      return evenements(donnees.evenements)
    case '/partenaires':
      return partenaires(donnees.partenaires)
    case '/mentions-legales':
      return simple(
        'Mentions légales',
        `Site édité par le ${ASSOCIATION.nomLegal}, association loi 1901, ${ASSOCIATION.adresse}, ${ASSOCIATION.codePostal} ${ASSOCIATION.ville}. Contact : ${ASSOCIATION.email}.`
      )
    case '/confidentialite':
      return simple(
        'Confidentialité',
        "Politique de confidentialité et traitement des données personnelles du site du BDE de l'IAE Paris-Sorbonne."
      )
    case '/introuvable':
      return simple(
        "Cette page n'existe pas",
        'Le lien est peut-être périmé. Les événements, les partenaires et la carte des bars sont accessibles depuis le menu ci-dessus.'
      )
    default:
      if (donnees.evenement) return evenement(donnees.evenement, donnees.evenements)
      if (donnees.partenaire) return partenaire(donnees.partenaire, donnees.partenaires)
      return null
  }
}

export { SITE }
