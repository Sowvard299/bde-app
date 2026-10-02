import { useEffect, useState } from 'react'

// Passe à vrai (et y reste) quand l'élément arrive à moins de `marge` de
// l'écran. Sert à ne monter un effet coûteux que si on va le voir.
export function useProcheDeLEcran(ref, marge = '300px') {
  // Sans IntersectionObserver (très vieux navigateurs), on monte tout de
  // suite.
  const [proche, setProche] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const el = ref.current
    if (!el || proche) return
    const observer = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setProche(true)
          observer.disconnect()
        }
      },
      { rootMargin: marge }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, marge, proche])

  return proche
}
