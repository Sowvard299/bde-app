import { useEffect, useRef } from 'react'
import {
  TYPES,
  flagsAffichables,
  formatDistance,
  formatEuro,
  tarifMaintenant,
} from '../lib/bars'
import { lienItineraire } from '../lib/maps'
import AddressLink from './AddressLink'

// Les lignes du tableau de prix, dans l'ordre où on se les demande : ce
// que coûte une bière d'abord, le reste ensuite. Une ligne sans valeur
// publiée disparaît : mieux vaut une fiche courte qu'une colonne de tirets.
const LIGNES_PRIX = [
  ['pinte_hh', 'Pinte en happy hour'],
  ['pinte_hors_hh', 'Pinte hors happy hour'],
  ['cocktail', 'Cocktail'],
  ['verre_vin', 'Verre de vin'],
  ['ticket_entree', "Entrée"],
  ['litre_meilleur', 'Le litre, au meilleur tarif'],
  ['tournee_20_pers', 'Tournée pour 20 personnes'],
]

const FOND_TARIF = {
  'happy-hour': '#8be3b0',
  constant: '#ffffff',
  'hors-creneau': '#ffffff',
  inconnu: '#ffffff',
}

const SANS_ALCOOL = {
  'oui-assume': 'Le lieu revendique une offre sans alcool.',
  'probable-activite': "L'activité se tient sans boire : le BDE le suppose, le lieu ne l'annonce pas.",
}

export default function BarSheet({ lieu, km, onClose, libelles, maintenant, maj }) {
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
  const tarif = tarifMaintenant(lieu, maintenant)
  const flags = flagsAffichables(lieu)
  const prix = LIGNES_PRIX.filter(([cle]) => lieu.prix[cle] != null)

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
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag" style={{ '--tag-bg': FOND_TARIF[tarif.etat] }}>
              {tarif.libelle}
            </span>
            {lieu.metro && <span className="tag" style={{ '--tag-bg': '#fff' }}>M° {lieu.metro}</span>}
            <span className="tag" style={{ '--tag-bg': '#fff' }}>{lieu.arrondissement}</span>
          </div>

          {lieu.concept && <p className="leading-relaxed text-fg-muted">{lieu.concept}</p>}

          {lieu.bon_plan && (
            <p className="border-2 border-ink bg-accent-gold px-3.5 py-3 text-sm font-semibold">{lieu.bon_plan}</p>
          )}

          {prix.length > 0 && (
            <section>
              <h3 className="label mb-2">Prix</h3>
              <dl className="border-t-2 border-ink">
                {prix.map(([cle, label]) => (
                  <div key={cle} className="flex items-baseline justify-between gap-3 border-b border-hairline py-2.5">
                    <dt className="text-sm text-fg-muted">{label}</dt>
                    <dd className="masthead text-xl">{formatEuro(lieu.prix[cle])}</dd>
                  </div>
                ))}
              </dl>
              {lieu.prix.note_litre && <p className="mt-1.5 text-xs text-fg-subtle">{lieu.prix.note_litre}</p>}
            </section>
          )}

          {(lieu.horaires || lieu.happy_hour) && (
            <section className="flex flex-col gap-1">
              <h3 className="label mb-1">Horaires</h3>
              {lieu.horaires && <p className="text-sm text-fg-muted">{lieu.horaires}</p>}
              {lieu.happy_hour && <p className="text-sm text-fg-muted">{lieu.happy_hour}</p>}
              {lieu.hh?.remarque && <p className="text-xs text-fg-subtle">{lieu.hh.remarque}</p>}
            </section>
          )}

          {flags.length > 0 && (
            <section>
              <h3 className="label mb-2">Sur place</h3>
              <ul className="flex flex-wrap gap-1.5">
                {flags.map((flag) => (
                  <li key={flag} className="border border-ink px-2 py-1 text-xs">
                    {libelles[flag] ?? flag}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {lieu.notes && <p className="text-sm leading-relaxed text-fg-muted">{lieu.notes}</p>}

          {lieu.sans_alcool && SANS_ALCOOL[lieu.sans_alcool] && (
            <p className="text-xs text-fg-subtle">
              Sans alcool : {lieu.note_sans_alcool || SANS_ALCOOL[lieu.sans_alcool]}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <a
              href={lienItineraire({ nom: lieu.nom, adresse: lieu.adresse, lat: lieu.lat, lon: lieu.lon })}
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              Itinéraire
            </a>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${lieu.nom} ${lieu.adresse}`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              Avis
            </a>
          </div>

          {/* La date de relevé reste affichée : sans elle, un prix périmé
              passerait pour une promesse. L'avertissement sur l'alcool
              est une obligation légale. */}
          <p className="border-t-2 border-ink pt-3 text-[11px] leading-relaxed text-fg-subtle">
            Données du {maj} : prix pouvant avoir changé. L'abus d'alcool est dangereux pour la
            santé, à consommer avec modération.
          </p>
        </div>
      </div>
    </div>
  )
}
