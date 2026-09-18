import { useMemo, useState } from 'react'
import { GROUPES_FILTRES, TYPES } from '../lib/bars'

const SEUILS_PINTE = [3, 4, 5]

const ORDRE_ARRONDISSEMENTS = (a, b) => {
  const n = (v) => (v === '1er' ? 1 : Number.parseInt(v, 10) || 99)
  return n(a) - n(b)
}

// Bouton de famille : c'est le filtre principal de la page, celui qui
// porte la couleur de la pastille correspondante sur la carte. Actif, il
// s'allume de cette couleur — la légende et le filtre ne font qu'un.
function BoutonType({ type, actif, compte, onToggle }) {
  const t = TYPES[type]

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={actif}
      className="flex flex-1 items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      style={
        actif
          ? { borderColor: t.couleur, background: `color-mix(in srgb, ${t.couleur} 14%, transparent)` }
          : { borderColor: 'var(--color-line)', background: 'var(--color-surface)' }
      }
    >
      <span
        className="h-3.5 w-3.5 shrink-0 rounded-full transition"
        style={{
          background: actif ? t.couleur : 'transparent',
          boxShadow: `inset 0 0 0 2px ${actif ? t.couleur : 'var(--color-fg-subtle)'}`,
        }}
        aria-hidden="true"
      />
      <span className="min-w-0">
        <span
          className="block truncate text-sm font-semibold"
          style={{ color: actif ? t.couleur : 'var(--color-fg-muted)' }}
        >
          {t.libelle}
        </span>
        <span className="block text-[11px] text-fg-subtle">{compte} adresses</span>
      </span>
    </button>
  )
}

function Puce({ label, actif, onClick, titre }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      title={titre}
      // Sans ca, le `title` prend la place du libelle dans le nom
      // annonce par un lecteur d'ecran : on entendrait la note de bas de
      // page au lieu du nom du filtre.
      aria-label={label}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        actif
          ? 'border-accent bg-accent text-white'
          : 'border-line bg-surface text-fg-muted hover:border-fg-subtle'
      }`}
    >
      {label}
    </button>
  )
}

export default function BarsFilters({
  filtres,
  setFiltres,
  lieux,
  libelles,
  nbResultats,
  position,
  etatPosition,
  onDemanderPosition,
  nbFiltresActifs,
  onReinitialiser,
}) {
  const [ouvert, setOuvert] = useState(false)

  const comptes = useMemo(() => {
    const parType = { bar: 0, insolite: 0 }
    const parFlag = new Map()
    const arrondissements = new Set()

    for (const lieu of lieux) {
      parType[lieu.type] += 1
      arrondissements.add(lieu.arrondissement)
      for (const flag of lieu.flags) parFlag.set(flag, (parFlag.get(flag) ?? 0) + 1)
    }

    return {
      parType,
      parFlag,
      arrondissements: [...arrondissements].sort(ORDRE_ARRONDISSEMENTS),
    }
  }, [lieux])

  const maj = (patch) => setFiltres((f) => ({ ...f, ...patch }))

  const basculerType = (type) => {
    setFiltres((f) => {
      const actif = f.types.includes(type)
      // Décocher les deux familles viderait la carte sans rien dire :
      // cliquer la seule famille active isole l'autre, ce qui est ce que
      // l'on cherchait à faire de toute façon.
      if (actif && f.types.length === 1) {
        return { ...f, types: [type === 'bar' ? 'insolite' : 'bar'] }
      }
      return { ...f, types: actif ? f.types.filter((t) => t !== type) : [...f.types, type] }
    })
  }

  const basculerFlag = (flag) => {
    setFiltres((f) => ({
      ...f,
      flags: f.flags.includes(flag) ? f.flags.filter((x) => x !== flag) : [...f.flags, flag],
    }))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {Object.keys(TYPES).map((type) => (
          <BoutonType
            key={type}
            type={type}
            actif={filtres.types.includes(type)}
            compte={comptes.parType[type]}
            onToggle={() => basculerType(type)}
          />
        ))}
      </div>

      <input
        type="search"
        value={filtres.q}
        onChange={(e) => maj({ q: e.target.value })}
        placeholder="Un nom, une rue, un métro…"
        className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-fg placeholder:text-fg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <Puce
          label="Meilleur prix maintenant"
          titre="Happy hour en cours, plus les bars dont le prix ne bouge jamais"
          actif={filtres.meilleurPrix}
          onClick={() => maj({ meilleurPrix: !filtres.meilleurPrix })}
        />
        {SEUILS_PINTE.map((seuil) => (
          <Puce
            key={seuil}
            label={`Pinte ≤ ${seuil} €`}
            actif={filtres.maxPinte === seuil}
            onClick={() => maj({ maxPinte: filtres.maxPinte === seuil ? null : seuil })}
          />
        ))}
        <Puce
          label={etatPosition === 'attente' ? 'Localisation…' : 'Autour de moi'}
          titre="Trier par distance depuis ta position"
          actif={filtres.tri === 'distance' && Boolean(position)}
          onClick={() => {
            if (position) {
              maj({ tri: filtres.tri === 'distance' ? 'prix' : 'distance' })
            } else {
              onDemanderPosition()
            }
          }}
        />
      </div>

      {etatPosition === 'refuse' && (
        <p className="text-xs text-fg-subtle">
          Position refusée. Autorise la localisation dans ton navigateur pour trier par distance.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-fg-faint">
          <span className="font-semibold text-fg">{nbResultats}</span>{' '}
          {nbResultats > 1 ? 'adresses' : 'adresse'}
        </p>

        <div className="flex items-center gap-2">
          {nbFiltresActifs > 0 && (
            <button
              type="button"
              onClick={onReinitialiser}
              className="rounded-full px-2.5 py-1 text-xs font-semibold text-fg-faint underline-offset-2 transition hover:text-fg hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Tout effacer
            </button>
          )}
          <button
            type="button"
            onClick={() => setOuvert((v) => !v)}
            aria-expanded={ouvert}
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-fg-muted transition hover:border-fg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {ouvert ? 'Moins de filtres' : 'Plus de filtres'}
            {nbFiltresActifs > 0 && (
              <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] text-white">
                {nbFiltresActifs}
              </span>
            )}
          </button>
        </div>
      </div>

      {ouvert && (
        <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface/60 p-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Arrondissement
              <select
                value={filtres.arrondissement ?? ''}
                onChange={(e) => maj({ arrondissement: e.target.value || null })}
                className="rounded-lg border border-line bg-surface px-3 py-2 text-sm font-normal normal-case tracking-normal text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <option value="">Tous</option>
                {comptes.arrondissements.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Trier par
              <select
                value={filtres.tri}
                onChange={(e) => maj({ tri: e.target.value })}
                className="rounded-lg border border-line bg-surface px-3 py-2 text-sm font-normal normal-case tracking-normal text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <option value="prix">Prix croissant</option>
                <option value="nom">Nom</option>
                <option value="distance" disabled={!position}>
                  Distance{position ? '' : ' (position requise)'}
                </option>
              </select>
            </label>
          </div>

          {GROUPES_FILTRES.map((groupe) => {
            // Une case à cocher pour une étiquette que personne ne porte
            // ne mène qu'à une liste vide : on n'affiche que ce qui existe
            // vraiment dans le jeu de données.
            const flags = groupe.flags.filter((f) => comptes.parFlag.has(f))
            if (flags.length === 0) return null

            return (
              <div key={groupe.cle} className="flex flex-col gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
                  {groupe.libelle}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {flags.map((flag) => (
                    <Puce
                      key={flag}
                      label={`${libelles[flag] ?? flag} · ${comptes.parFlag.get(flag)}`}
                      actif={filtres.flags.includes(flag)}
                      onClick={() => basculerFlag(flag)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
