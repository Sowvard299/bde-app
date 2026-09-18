import { TYPES, flagsAffichables, formatDistance, formatEuro, prixRepere, tarifMaintenant } from '../lib/bars'

// Couleur de l'état tarifaire. Le vert est le seul endroit du site où il
// apparaît, et c'est voulu : « c'est ouvert au bon prix, maintenant » est
// la seule information de la page qui périme dans l'heure.
const COULEUR_TARIF = {
  'happy-hour': 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  constant: 'bg-white/5 text-fg-muted ring-white/10',
  'hors-creneau': 'bg-white/5 text-fg-subtle ring-white/10',
  inconnu: 'bg-white/5 text-fg-subtle ring-white/10',
}

export default function BarCard({ lieu, km, actif, onSelect, maintenant, libelles }) {
  const type = TYPES[lieu.type]
  const prix = prixRepere(lieu)
  const tarif = tarifMaintenant(lieu, maintenant)
  const flags = flagsAffichables(lieu).slice(0, 3)

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(lieu.id)}
        className={`lift flex w-full gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          actif ? 'border-accent bg-surface-muted' : 'border-line bg-surface hover:border-fg-subtle'
        }`}
      >
        {/* Bandeau de couleur : la même que la pastille du lieu sur la
            carte, pour relier les deux vues sans avoir à réfléchir. */}
        <span
          className="w-1 shrink-0 self-stretch rounded-full"
          style={{ background: type.couleur }}
          aria-hidden="true"
        />

        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="flex items-start justify-between gap-2">
            <span className="min-w-0">
              <span className="block truncate font-semibold text-fg">{lieu.nom}</span>
              <span className="block truncate text-xs text-fg-subtle">
                {lieu.arrondissement} · {lieu.metro ? `M° ${lieu.metro}` : lieu.adresse}
                {km != null && ` · ${formatDistance(km)}`}
              </span>
            </span>

            {prix && (
              <span className="shrink-0 text-right">
                <span className="block font-display text-lg font-semibold leading-none text-accent-gold">
                  {formatEuro(prix.valeur)}
                </span>
                <span className="block text-[10px] leading-tight text-fg-subtle">
                  {prix.libelle}
                </span>
              </span>
            )}
          </span>

          {lieu.concept && (
            <span className="line-clamp-2 text-xs text-fg-muted">{lieu.concept}</span>
          )}

          <span className="flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${COULEUR_TARIF[tarif.etat]}`}
            >
              {tarif.libelle}
            </span>
            {flags.map((flag) => (
              <span
                key={flag}
                className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-fg-faint"
              >
                {libelles[flag] ?? flag}
              </span>
            ))}
          </span>
        </span>
      </button>
    </li>
  )
}
