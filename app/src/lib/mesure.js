// Mesure d'audience (Google Analytics 4), soumise au consentement.
//
// Rien n'est chargé tant que la personne n'a pas cliqué « Accepter » sur
// le bandeau : c'est ce qu'exige la CNIL pour un outil qui dépose des
// cookies. Le choix est gardé dans le stockage local (13 mois au plus,
// durée recommandée par la CNIL), puis le bandeau se représente.
//
// GA4 compte lui-même les changements de page d'une application React
// (mesure améliorée, « historique du navigateur », active par défaut).

const ID = 'G-QCSSBRK0S9'
const CLE = 'bde-mesure-audience'
const DUREE_MS = 13 * 30 * 24 * 3600 * 1000

const abonnes = new Set()
let memoire = null // repli si le stockage local est bloqué

export function lireChoix() {
  try {
    const brut = JSON.parse(localStorage.getItem(CLE) || 'null')
    if (!brut || Date.now() - brut.date > DUREE_MS) return memoire
    return brut.choix // 'oui' | 'non'
  } catch {
    return memoire
  }
}

function prevenir() {
  for (const f of abonnes) f(lireChoix())
}

export function surChangement(f) {
  abonnes.add(f)
  return () => abonnes.delete(f)
}

let charge = false
function chargerGA() {
  if (charge || typeof document === 'undefined') return
  charge = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', ID)
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`
  document.head.appendChild(s)
}

// Supprime les cookies _ga déposés sur ce domaine et ses parents.
function effacerCookiesGA() {
  const morceaux = location.hostname.split('.')
  const domaines = morceaux.map((_, i) => morceaux.slice(i).join('.')).filter((d) => d.includes('.'))
  for (const c of document.cookie.split(';')) {
    const nom = c.split('=')[0].trim()
    if (!nom.startsWith('_ga')) continue
    for (const d of ['', ...domaines.map((x) => `; domain=.${x}`)]) {
      document.cookie = `${nom}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`
    }
  }
}

export function enregistrerChoix(choix) {
  memoire = choix
  try {
    localStorage.setItem(CLE, JSON.stringify({ choix, date: Date.now() }))
  } catch {
    // stockage indisponible : le choix vaut pour cette visite seulement
  }
  // Drapeau officiel de GA pour couper l'envoi si le choix change en cours de visite.
  window[`ga-disable-${ID}`] = choix !== 'oui'
  if (choix === 'oui') chargerGA()
  else effacerCookiesGA()
  prevenir()
}

// Réouvre le bandeau (lien « Modifier mon choix » de la page Confidentialité).
export function rouvrirChoix() {
  memoire = null
  try {
    localStorage.removeItem(CLE)
  } catch {
    // rien à faire
  }
  prevenir()
}

// Au démarrage : recharge GA si l'accord a déjà été donné.
export function initialiserMesure() {
  if (lireChoix() === 'oui') chargerGA()
}
