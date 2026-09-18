import { useEffect, useState } from 'react'

// Écoute une media query côté JS. Utile quand la mise en page ne suffit
// pas — ici, la carte et la liste coexistent sur grand écran alors qu'un
// téléphone bascule de l'une à l'autre : il faut le savoir pour décider
// quoi monter, pas seulement quoi masquer.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (event) => setMatches(event.matches)

    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
