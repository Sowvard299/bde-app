import { metaParDefaut, metaStatique } from './seo'

// Écriture des métadonnées dans le document courant.
//
// Le Worker pose déjà les bonnes valeurs dans le HTML servi : ce module
// ne sert donc pas à Google, qui voit la page avant que React démarre.
// Il sert à tout ce qui se passe ensuite — naviguer d'un onglet à
// l'autre sans recharger, où le titre de l'onglet, le favori qu'on
// enregistre et l'entrée d'historique doivent suivre la page affichée.

function poserBalise(selecteur, attribut, valeur, creer) {
  let balise = document.head.querySelector(selecteur)
  if (!balise) {
    if (valeur == null) return
    balise = creer()
    document.head.appendChild(balise)
  }
  if (valeur == null) balise.remove()
  else balise.setAttribute(attribut, valeur)
}

export function appliquerMeta(meta) {
  if (!meta) return

  document.title = meta.titre

  poserBalise('meta[name="description"]', 'content', meta.description, () => {
    const el = document.createElement('meta')
    el.setAttribute('name', 'description')
    return el
  })

  poserBalise('link[rel="canonical"]', 'href', meta.canonical, () => {
    const el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    return el
  })

  // Une page qu'on ne veut pas voir dans l'index doit le dire, et
  // surtout cesser de le dire quand on en repart : sans le retrait, une
  // visite aux mentions légales laisserait le `noindex` sur toutes les
  // pages visitées ensuite dans la même session.
  poserBalise('meta[name="robots"]', 'content', meta.indexable ? null : 'noindex, follow', () => {
    const el = document.createElement('meta')
    el.setAttribute('name', 'robots')
    return el
  })

  for (const [propriete, valeur] of [
    ['og:url', meta.canonical],
    ['og:title', meta.titre],
    ['og:description', meta.description],
    ['og:image', meta.image],
    ['og:type', meta.typeOg ?? 'website'],
  ]) {
    poserBalise(`meta[property="${propriete}"]`, 'content', valeur, () => {
      const el = document.createElement('meta')
      el.setAttribute('property', propriete)
      return el
    })
  }

  for (const [nom, valeur] of [
    ['twitter:title', meta.titre],
    ['twitter:description', meta.description],
    ['twitter:image', meta.image],
  ]) {
    poserBalise(`meta[name="${nom}"]`, 'content', valeur, () => {
      const el = document.createElement('meta')
      el.setAttribute('name', nom)
      return el
    })
  }

  // Le balisage JSON-LD est remplacé en bloc plutôt que modifié : il est
  // marqué pour être retrouvé, et deux graphes concurrents dans la même
  // page valent mieux zéro.
  const ancien = document.head.querySelector('script[data-seo="jsonld"]')
  if (ancien) ancien.remove()
  if (meta.jsonLd) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seo = 'jsonld'
    script.textContent = JSON.stringify(meta.jsonLd)
    document.head.appendChild(script)
  }
}

// Pour les pages fixes, dont le contenu ne dépend d'aucun chargement.
export function appliquerMetaChemin(chemin) {
  appliquerMeta(metaStatique(chemin) ?? metaParDefaut())
}
