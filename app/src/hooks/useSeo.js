import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { metaStatique } from '../lib/seo'
import { appliquerMeta } from '../lib/seoDom'

// Métadonnées des pages fixes, suivies au fil de la navigation.
//
// Le Worker a déjà posé les bonnes valeurs dans le HTML de la page
// d'arrivée. Ce hook prend le relais pour tout ce qui suit : passer de
// l'accueil aux bars ne recharge rien, donc rien ne remettrait à jour le
// titre de l'onglet ou le canonique sans lui.
//
// Il ne touche pas aux fiches de détail — elles n'ont pas de
// métadonnées tant que leur contenu n'est pas chargé, et écrire des
// valeurs par défaut en attendant ne ferait que faire clignoter le titre.
// Elles appellent useSeoDonnees une fois servies.
export function useSeoRoute() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = metaStatique(pathname)
    if (meta) appliquerMeta(meta)
  }, [pathname])
}

// Métadonnées d'une page dont le contenu arrive du réseau. `meta` vaut
// null tant que le chargement n'a pas abouti : on laisse alors en place
// ce que le serveur avait écrit.
export function useSeoDonnees(meta) {
  useEffect(() => {
    if (meta) appliquerMeta(meta)
  }, [meta])
}
