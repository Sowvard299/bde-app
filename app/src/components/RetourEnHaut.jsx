import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Position de défilement de chaque entrée d'historique, pour la rendre au
// retour arrière.
const positions = new Map()

// Le site défile sur la fenêtre entière : sans ce composant, changer de
// page gardait la position de la précédente, et l'on arrivait en bas de
// la nouvelle. Une nouvelle adresse s'ouvre donc en haut ; un retour
// arrière retrouve l'endroit où l'on était (la liste des partenaires
// après avoir consulté une fiche, par exemple).
//
// La restauration native du navigateur est coupée : sur une application
// à une seule page, il restaure avant que le contenu soit chargé et tombe
// à une position arbitraire.
export default function RetourEnHaut() {
  const { key, pathname } = useLocation()
  const type = useNavigationType()
  const cheminPrecedent = useRef(pathname)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  // Mémorise la position de l'entrée courante au fil du défilement.
  useEffect(() => {
    const noter = () => positions.set(key, window.scrollY)
    window.addEventListener('scroll', noter, { passive: true })
    return () => window.removeEventListener('scroll', noter)
  }, [key])

  useLayoutEffect(() => {
    // Un simple changement de paramètre (« ?lieu= » sur la carte des
    // bars ouvre une fiche) ne fait pas bouger la page.
    const memePage = cheminPrecedent.current === pathname
    cheminPrecedent.current = pathname
    if (memePage) return

    const cible = type === 'POP' ? (positions.get(key) ?? 0) : 0
    window.scrollTo({ top: cible, left: 0, behavior: 'instant' })
    if (cible === 0) return

    // Les pages chargent leur contenu après coup (morceau de code, puis
    // données) : tant que la page est trop courte pour atteindre la
    // position voulue, on réessaie, pendant une seconde et demie au plus.
    const fin = performance.now() + 1500
    let id
    const reessayer = () => {
      window.scrollTo({ top: cible, left: 0, behavior: 'instant' })
      if (Math.abs(window.scrollY - cible) > 2 && performance.now() < fin) {
        id = requestAnimationFrame(reessayer)
      }
    }
    id = requestAnimationFrame(reessayer)
    return () => cancelAnimationFrame(id)
  }, [pathname, key, type])

  return null
}
