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
// publiée disparaît — mieux vaut une fiche courte qu'une colonne de tirets.
const LIGNES_PRIX = [
  ['pinte_hh', 'Pinte en happy hour'],
  ['pinte_hors_hh', 'Pinte hors happy hour'],
  ['cocktail', 'Cocktail'],
  ['verre_vin', 'Verre de vin'],
  ['ticket_entree', "Entrée"],
  ['litre_meilleur', 'Le litre, au meilleur tarif'],
  ['tournee_20_pers', 'Tournée pour 20 personnes'],
]

const COULEUR_TARIF = {
  'happy-hour': 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  constant: 'bg-white/5 text-fg-muted ring-white/10',
  'hors-creneau': 'bg-white/5 text-fg-subtle ring-white/10',
  inconnu: 'bg-white/5 text-fg-subtle ring-white/10',
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
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />

      <div
        ref={panneauRef}
        role="dialog"
        aria-modal="true"
        aria-label={lieu.nom}
        className="bar-sheet relative max-h-[88svh] w-full overflow-y-auto rounded-t-3xl border border-line bg-canvas pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-lg sm:rounded-3xl sm:pb-5"
      >
        {/* Bandeau à la couleur de la famille : la fiche reprend le code
            couleur de la pastille qu'on vient de toucher. */}
        <div className="sticky top-0 z-10 border-b border-line bg-canvas/95 px-5 pb-3 pt-4 backdrop-blur">
          <span
            className="absolute inset-x-0 top-0 h-1 rounded-t-3xl"
            style={{ background: type.couleur }}
            aria-hidden="true"
          />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span
                className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: type.couleur, color: type.surCouleur }}
              >
                {type.court}
              </span>
              <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight text-fg">
                {lieu.nom}
              </h2>
              <p className="mt-0.5 text-sm text-fg-faint">
                <AddressLink
                  nom={lieu.nom}
                  adresse={lieu.adresse}
                  lat={lieu.lat}
                  lon={lieu.lon}
                  className="underline decoration-line underline-offset-4 transition hover:text-fg hover:decoration-fg-subtle"
                />
                {km != null && ` · à ${formatDistance(km)}`}
              </p>
            </div>

            <button
              ref={fermerRef}
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="shrink-0 rounded-full border border-line bg-surface p-2 text-fg-muted transition hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-5 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${COULEUR_TARIF[tarif.etat]}`}
            >
              {tarif.libelle}
            </span>
            {lieu.metro && (
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-fg-faint">
                M° {lieu.metro}
              </span>
            )}
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-fg-faint">
              {lieu.arrondissement}
            </span>
          </div>

          {lieu.concept && <p className="text-sm leading-relaxed text-fg-muted">{lieu.concept}</p>}

          {lieu.bon_plan && (
            <p className="rounded-xl border border-accent-gold/25 bg-accent-gold/10 px-3.5 py-3 text-sm text-accent-gold">
              {lieu.bon_plan}
            </p>
          )}

          {prix.length > 0 && (
            <section>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
                Les prix
              </h3>
              <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line">
                {prix.map(([cle, label]) => (
                  <div key={cle} className="flex items-baseline justify-between gap-3 px-3.5 py-2.5">
                    <dt className="text-sm text-fg-muted">{label}</dt>
                    <dd className="font-display text-base font-semibold text-fg">
                      {formatEuro(lieu.prix[cle])}
                    </dd>
                  </div>
                ))}
              </dl>
              {lieu.prix.note_litre && (
                <p className="mt-1.5 text-xs text-fg-subtle">{lieu.prix.note_litre}</p>
              )}
            </section>
          )}

          {(lieu.horaires || lieu.happy_hour) && (
            <section className="flex flex-col gap-1">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
                Horaires
              </h3>
              {lieu.horaires && <p className="text-sm text-fg-muted">{lieu.horaires}</p>}
              {lieu.happy_hour && <p className="text-sm text-fg-muted">{lieu.happy_hour}</p>}
              {lieu.hh?.remarque && <p className="text-xs text-fg-subtle">{lieu.hh.remarque}</p>}
            </section>
          )}

          {flags.length > 0 && (
            <section>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
                Sur place
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {flags.map((flag) => (
                  <li
                    key={flag}
                    className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-fg-muted"
                  >
                    {libelles[flag] ?? flag}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {lieu.notes && <p className="text-sm leading-relaxed text-fg-faint">{lieu.notes}</p>}

          {lieu.sans_alcool && SANS_ALCOOL[lieu.sans_alcool] && (
            <p className="text-xs text-fg-subtle">
              Sans alcool : {lieu.note_sans_alcool || SANS_ALCOOL[lieu.sans_alcool]}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <a
              href={lienItineraire({ nom: lieu.nom, adresse: lieu.adresse, lat: lieu.lat, lon: lieu.lon })}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Itinéraire
            </a>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${lieu.nom} ${lieu.adresse}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-full border border-line px-4 py-3 text-center text-sm font-semibold text-fg-muted transition hover:border-fg-subtle hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Horaires & avis
            </a>
          </div>

          {/* La date de relevé reste affichée : sans elle, un prix périmé
              passerait pour une promesse. L'avertissement sur l'alcool
              est une obligation légale, pas une formule de politesse. */}
          <p className="border-t border-line pt-3 text-[11px] leading-relaxed text-fg-subtle">
            Données du {maj} : prix pouvant avoir changé. L'abus d'alcool est dangereux pour la
            santé, à consommer avec modération.
          </p>
        </div>
      </div>
    </div>
  )
}
