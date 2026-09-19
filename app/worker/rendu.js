import donneesBars from '../src/data/bars-paris.json'
import { ASSOCIATION, NOM_SITE, SITE } from '../src/lib/seo'
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
.ssr{--or:#ffc300;--ac:#ff4214;background:#0a0a12;color:#f5f5f7;font-family:system-ui,sans-serif;
margin:0 auto;max-width:900px;padding:24px 16px 80px;line-height:1.5}
.ssr a{color:var(--or);text-decoration:none}
.ssr a:hover{text-decoration:underline}
.ssr h1{font-size:1.9rem;line-height:1.15;margin:.2em 0 .3em}
.ssr h2{font-size:1.2rem;margin:1.6em 0 .5em;color:var(--or)}
.ssr p{color:#c7c7d1;margin:.5em 0}
.ssr nav{border-bottom:1px solid #2b2b38;padding-bottom:12px;margin-bottom:16px;
display:flex;flex-wrap:wrap;gap:14px;font-size:.9rem}
.ssr ul{list-style:none;padding:0;margin:.5em 0}
.ssr li{border-bottom:1px solid #1e1e2a;padding:9px 0}
.ssr .m{color:#94949f;font-size:.85rem}
.ssr footer{margin-top:32px;border-top:1px solid #2b2b38;padding-top:12px;font-size:.8rem;color:#6b6b78}
`

// Les mêmes liens sur chaque page : c'est ce qui permet à un robot de
// parcourir le site de proche en proche au lieu de dépendre du sitemap.
function navigation() {
  return `<nav>
<a href="/accueil">Accueil</a>
<a href="/evenements">Événements</a>
<a href="/partenaires">Partenaires</a>
<a href="/bars">Bars de Paris</a>
<a href="/a-propos">Qui sommes-nous</a>
</nav>`
}

function page(corps) {
  return `<div class="ssr"><style>${STYLE}</style>${navigation()}<main>${corps}</main>
<footer>${e(NOM_SITE)} — ${e(ASSOCIATION.nomLegal)}, association loi 1901.
Contact : <a href="mailto:${e(ASSOCIATION.email)}">${e(ASSOCIATION.email)}</a>.
<a href="/mentions-legales">Mentions légales</a></footer></div>`
}

function dateLongue(iso) {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

function accueil() {
  return page(`<h1>${e(NOM_SITE)}</h1>
<p>Le bureau des étudiants de l'${e(ASSOCIATION.ecole)}. Soirées, sport, sorties et réductions
étudiantes, à Paris.</p>
<h2>Ce qu'on fait</h2>
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
<p>Nous organisons la vie étudiante de l'école : soirées, week-end d'intégration, sorties
culturelles, club running, escalade, et les partenariats qui permettent aux étudiants de payer
moins cher là où ils sortent déjà.</p>
<h2>Nous joindre</h2>
<p>Courriel : <a href="mailto:${e(ASSOCIATION.email)}">${e(ASSOCIATION.email)}</a><br>
Instagram : <a href="${e(ASSOCIATION.instagram)}" rel="noopener">@bde.iaeparissorbonne</a></p>`)
}

function evenements(liste) {
  if (!liste?.length) return null

  const items = liste
    .map(
      (ev) => `<li><a href="/evenements/${e(ev.id)}">${e(ev.title)}</a>
<div class="m">${e(dateLongue(ev.starts_at))}${ev.location_name ? ` — ${e(ev.location_name)}` : ''}</div></li>`
    )
    .join('')

  return page(`<h1>Événements et soirées étudiants</h1>
<p>Toutes les dates organisées par le ${e(NOM_SITE)} : soirées, week-end d'intégration, running,
escalade et sorties.</p>
<ul>${items}</ul>`)
}

function evenement(ev) {
  if (!ev) return null

  return page(`<h1>${e(ev.title)}</h1>
<p class="m">${e(dateLongue(ev.starts_at))}${ev.location_name ? ` — ${e(ev.location_name)}` : ''}${
    ev.location_address ? `, ${e(ev.location_address)}` : ''
  }</p>
${ev.description ? `<p>${e(ev.description).replace(/\n+/g, '</p><p>')}</p>` : ''}
${ev.ticket_url ? `<p><a href="${e(ev.ticket_url)}" rel="noopener">Billetterie</a></p>` : ''}
<p><a href="/evenements">Tous les événements</a></p>`)
}

function partenaires(liste) {
  if (!liste?.length) return null

  const items = liste
    .map(
      (pa) => `<li><a href="/partenaires/${e(pa.id)}">${e(pa.name)}</a>
<div class="m">${e(pa.benefit)}${pa.address ? ` — ${e(pa.address)}` : ''}</div></li>`
    )
    .join('')

  return page(`<h1>Réductions étudiantes à Paris</h1>
<p>Les partenariats négociés par le ${e(NOM_SITE)} pour ses étudiants. La carte étudiante suffit,
aucune inscription n'est nécessaire.</p>
<ul>${items}</ul>`)
}

function partenaire(pa) {
  if (!pa) return null

  return page(`<h1>${e(pa.name)}</h1>
<p><strong>${e(pa.benefit)}</strong></p>
${pa.address ? `<p class="m">${e(pa.address)}${pa.phone ? ` — ${e(pa.phone)}` : ''}</p>` : ''}
${pa.description ? `<p>${e(pa.description).replace(/\n+/g, '</p><p>')}</p>` : ''}
${pa.website_url ? `<p><a href="${e(pa.website_url)}" rel="noopener">Site du partenaire</a></p>` : ''}
<p><a href="/partenaires">Tous les partenaires</a></p>`)
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

    return `<li><strong>${e(lieu.nom)}</strong> — ${e(lieu.adresse)}
<div class="m">${e(details)}${lieu.concept ? ` — ${e(lieu.concept)}` : ''}</div></li>`
  }

  const pasChers = donneesBars.lieux.filter((l) => l.type === 'bar')
  const insolites = donneesBars.lieux.filter((l) => l.type === 'insolite')

  return page(`<h1>Bars pas chers et bars insolites à Paris</h1>
<p>${donneesBars.lieux.length} adresses compilées par le ${e(NOM_SITE)} à partir de sources
publiques, mises à jour le ${e(donneesBars.maj)}. ${e(donneesBars.avertissement)}</p>
<p class="m">${e(donneesBars.avertissement_donnees)}</p>
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
      return accueil()
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
      if (donnees.evenement) return evenement(donnees.evenement)
      if (donnees.partenaire) return partenaire(donnees.partenaire)
      return null
  }
}

export { SITE }
