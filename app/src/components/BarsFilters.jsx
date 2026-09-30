import { useMemo, useState } from 'react'
import { GROUPES_FILTRES, TYPES } from '../lib/bars'

const SEUILS_PINTE = [3, 4, 5]

const ORDRE_ARRONDISSEMENTS = (a, b) => {
  const n = (v) => (v === '1er' ? 1 : Number.parseInt(v, 10) || 99)
  return n(a) - n(b)
}

// Bouton de famille : c'est le filtre principal de la page, celui qui
// porte la couleur de la pastille correspondante sur la carte. Actif, il
// s'allume de cette couleur : la légende et le filtre ne font qu'un.
function BoutonType({ type, actif, compte, onToggle }) {
  const t = TYPES[type]

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={actif}
      className="flex min-w-0 flex-1 items-center gap-3 border-2 border-ink px-3 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      style={{ background: actif ? t.couleur : '#fff' }}
    >
      <span
        className="h-4 w-4 shrink-0 border-2 border-ink transition"
        style={{ background: actif ? 'var(--color-ink)' : t.couleur }}
        aria-hidden="true"
      />
      <span className="min-w-0">
        <span className="block font-display text-base uppercase leading-none sm:text-lg">{t.libelle}</span>
        <span className="mt-1 block text-[11px] text-fg-muted">{compte} adresses</span>
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
      // Sans ça, le `title` prend la place du libellé dans le nom
      // annoncé par un lecteur d'écran.
      aria-label={label}
      className={`shrink-0 border-2 border-ink px-3 py-1.5 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        actif ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-accent-gold'
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
        placeholder="Nom, rue ou station de métro"
        aria-label="Rechercher un bar"
        className="field"
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
          label={etatPosition === 'attente' ? 'Localisation' : 'Autour de moi'}
          titre="Trier par distance depuis votre position"
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
          Position refusée. Autorisez la localisation dans le navigateur pour trier par distance.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="label text-fg-muted">
          {nbResultats} {nbResultats > 1 ? 'adresses' : 'adresse'}
        </p>

        <div className="flex items-center gap-2">
          {nbFiltresActifs > 0 && (
            <button
              type="button"
              onClick={onReinitialiser}
              className="label px-2 py-1.5 underline underline-offset-2 transition hover:bg-accent-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Tout effacer
            </button>
          )}
          <button
            type="button"
            onClick={() => setOuvert((v) => !v)}
            aria-expanded={ouvert}
            className="label border-2 border-ink bg-white px-3 py-1.5 transition hover:bg-accent-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {ouvert ? 'Moins de filtres' : 'Plus de filtres'}
            {nbFiltresActifs > 0 && (
              <span className="ml-1.5 bg-ink px-1.5 py-0.5 text-[10px] text-white">
                {nbFiltresActifs}
              </span>
            )}
          </button>
        </div>
      </div>

      {ouvert && (
        <div className="flex flex-col gap-5 border-2 border-ink bg-surface p-4">
          <div className="flex flex-wrap gap-4">
            <label className="label flex flex-col gap-1.5 text-fg-muted">
              Arrondissement
              <select
                value={filtres.arrondissement ?? ''}
                onChange={(e) => maj({ arrondissement: e.target.value || null })}
                className="border-2 border-ink bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <option value="">Tous</option>
                {comptes.arrondissements.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>

            <label className="label flex flex-col gap-1.5 text-fg-muted">
              Trier par
              <select
                value={filtres.tri}
                onChange={(e) => maj({ tri: e.target.value })}
                className="border-2 border-ink bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
                <p className="label text-fg-muted">
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
