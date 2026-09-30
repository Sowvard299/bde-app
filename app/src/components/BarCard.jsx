import { TYPES, flagsAffichables, formatDistance, formatEuro, prixRepere, tarifMaintenant } from '../lib/bars'

// Couleur de l'état tarifaire. Le vert n'apparaît nulle part ailleurs sur
// le site, et c'est voulu : « c'est le bon prix, maintenant » est la seule
// information de la page qui périme dans l'heure.
const FOND_TARIF = {
  'happy-hour': '#8be3b0',
  constant: '#ffffff',
  'hors-creneau': '#ffffff',
  inconnu: '#ffffff',
}

export default function BarCard({ lieu, km, actif, onSelect, maintenant, libelles }) {
  const type = TYPES[lieu.type]
  const prix = prixRepere(lieu)
  const tarif = tarifMaintenant(lieu, maintenant)
  const flags = flagsAffichables(lieu).slice(0, 3)

  return (
    <li className="border-b-2 border-ink">
      <button
        type="button"
        onClick={() => onSelect(lieu.id)}
        aria-current={actif ? 'true' : undefined}
        className={`flex w-full gap-3 px-2 py-3.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
          actif ? 'bg-accent-gold' : 'bg-white hover:bg-surface'
        }`}
      >
        {/* Carré de couleur : le même que la pastille du lieu sur la
            carte, pour relier les deux vues sans avoir à réfléchir. */}
        <span
          className="mt-1 h-3.5 w-3.5 shrink-0 border-2 border-ink"
          style={{ background: type.couleur }}
          title={type.court}
          aria-hidden="true"
        />

        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="flex items-start justify-between gap-3">
            <span className="min-w-0">
              <span className="block font-display text-xl uppercase leading-[0.95]">{lieu.nom}</span>
              <span className="mt-1 block truncate text-xs text-fg-muted">
                {lieu.arrondissement} · {lieu.metro ? `M° ${lieu.metro}` : lieu.adresse}
                {km != null && ` · ${formatDistance(km)}`}
              </span>
            </span>

            {prix && (
              <span className="shrink-0 text-right">
                <span className="masthead block text-2xl">{formatEuro(prix.valeur)}</span>
                <span className="block text-[10px] leading-tight text-fg-subtle">{prix.libelle}</span>
              </span>
            )}
          </span>

          {lieu.concept && <span className="line-clamp-2 text-xs text-fg-muted">{lieu.concept}</span>}

          <span className="flex flex-wrap items-center gap-1.5">
            <span className="tag" style={{ '--tag-bg': FOND_TARIF[tarif.etat] }}>
              {tarif.libelle}
            </span>
            {flags.map((flag) => (
              <span key={flag} className="border border-hairline px-1.5 py-0.5 text-[10.5px] text-fg-muted">
                {libelles[flag] ?? flag}
              </span>
            ))}
          </span>
        </span>
      </button>
    </li>
  )
}
