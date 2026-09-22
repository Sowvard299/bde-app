import { useEffect, useRef } from 'react'

// Comportement commun aux feuilles modales du site (fiche d'un bar,
// formulaire de proposition...) : Échap ferme, le défilement de la page
// derrière est bloqué — sinon glisser sur la feuille sur téléphone fait
// aussi défiler ce qu'il y a dessous — et le focus part sur le bouton de
// fermeture à l'ouverture.
export function useSheetComportement(onClose) {
  const fermerRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    fermerRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  return fermerRef
}
