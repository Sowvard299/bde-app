import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { TYPES, formatDistance } from '../lib/bars'
import AddressLink from './AddressLink'
import BarDetails from './BarDetails'

export default function BarSheet({ lieu, km, onClose, libelles, maintenant, maj, lienFiche }) {
  const panneauRef = useRef(null)
  const fermerRef = useRef(null)

  // Échap ferme, et le défilement de la page derrière est bloqué : sans
  // ça, faire défiler la fiche sur téléphone fait glisser la carte
  // dessous et on perd sa place.
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

  // Repartir du haut quand on passe d'une fiche à l'autre sans fermer.
  useEffect(() => {
    panneauRef.current?.scrollTo({ top: 0 })
  }, [lieu.id])

  const type = TYPES[lieu.type]

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} role="presentation" />

      <div
        ref={panneauRef}
        role="dialog"
        aria-modal="true"
        aria-label={lieu.nom}
        className="bar-sheet relative max-h-[88svh] w-full overflow-y-auto border-2 border-ink bg-white pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-lg sm:pb-5 sm:shadow-[8px_8px_0_var(--color-ink)]"
      >
        {/* En-tête à la couleur de la famille : la fiche reprend le code
            couleur de la pastille qu'on vient de toucher. */}
        <div className="sticky top-0 z-10 border-b-2 border-ink px-5 pb-4 pt-4" style={{ background: type.couleur }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0" style={{ color: type.surCouleur }}>
              <span className="label">{type.court}</span>
              <h2 className="masthead mt-2 text-4xl">{lieu.nom}</h2>
              <p className="mt-2 text-sm">
                <AddressLink
                  nom={lieu.nom}
                  adresse={lieu.adresse}
                  lat={lieu.lat}
                  lon={lieu.lon}
                  className="underline decoration-2 underline-offset-4"
                />
                {km != null && ` · à ${formatDistance(km)}`}
              </p>
            </div>

            <button
              ref={fermerRef}
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="shrink-0 border-2 border-ink bg-white p-2 text-ink transition hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 px-5 pt-5">
          <BarDetails lieu={lieu} libelles={libelles} maintenant={maintenant} maj={maj} />
          {lienFiche && (
            <Link to={lienFiche} className="label self-start underline decoration-2 underline-offset-4 hover:bg-accent-gold">
              Page du bar →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
