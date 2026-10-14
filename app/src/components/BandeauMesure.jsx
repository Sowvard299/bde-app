import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { enregistrerChoix, initialiserMesure, lireChoix, surChangement } from '../lib/mesure'

// Bandeau de consentement à la mesure d'audience. « Refuser » a le même
// poids que « Accepter » (exigence CNIL), et rien n'est chargé avant un
// choix. Sur téléphone, il se pose au-dessus de la barre de navigation.
export default function BandeauMesure() {
  const [choix, setChoix] = useState(() => lireChoix())

  useEffect(() => {
    initialiserMesure()
    return surChangement(setChoix)
  }, [])

  if (choix) return null

  return (
    <div
      role="region"
      aria-label="Mesure d'audience"
      className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[35] border-2 border-ink bg-white p-4 shadow-[5px_5px_0_var(--color-ink)] lg:inset-x-auto lg:bottom-6 lg:right-6 lg:max-w-md"
    >
      <p className="text-[15px] leading-snug text-fg">
        Avec votre accord, le site utilise Google Analytics pour compter les visites et voir les
        pages consultées. Aucun usage publicitaire.{' '}
        <Link to="/confidentialite" className="underline decoration-2 underline-offset-4 hover:bg-accent-gold">
          En savoir plus
        </Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => enregistrerChoix('non')} className="btn-ghost justify-center">
          Refuser
        </button>
        <button type="button" onClick={() => enregistrerChoix('oui')} className="btn-ghost justify-center">
          Accepter
        </button>
      </div>
    </div>
  )
}
