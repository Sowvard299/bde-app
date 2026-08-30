import { useEffect, useMemo, useState } from 'react'
import { fetchCategories, fetchPartners } from '../lib/partners'
import PartnerRow from './PartnerRow'
import CategoryChips from './CategoryChips'
import PartnersMap from './PartnersMap'
import ViewToggle from './ViewToggle'

export default function PartenairesContent() {
  const [partners, setPartners] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeSlug, setActiveSlug] = useState(null)
  const [view, setView] = useState('liste')

  useEffect(() => {
    Promise.all([fetchPartners(), fetchCategories()])
      .then(([partnersData, categoriesData]) => {
        setPartners(partnersData)
        setCategories(categoriesData)
      })
      .catch((err) => {
        console.error(err)
        setError(err)
      })
  }, [])

  const filtered = useMemo(() => {
    if (!partners) return []
    const query = search.trim().toLowerCase()

    return partners.filter((partner) => {
      const matchesCategory =
        activeSlug === null || partner.partner_categories?.slug === activeSlug
      const matchesSearch =
        query === '' ||
        partner.name.toLowerCase().includes(query) ||
        partner.benefit.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [partners, search, activeSlug])

  const partenaires = useMemo(() => filtered.filter((p) => p.kind === 'partenaire'), [filtered])
  const bonsPlans = useMemo(
    () => filtered.filter((p) => p.kind !== 'partenaire'),
    [filtered]
  )

  return (
    <div className="flex flex-col gap-4">
      <ViewToggle
        options={[
          { value: 'liste', label: 'Liste' },
          { value: 'carte', label: 'Carte' },
        ]}
        value={view}
        onChange={setView}
      />

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un partenaire"
        className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-base text-fg placeholder:text-fg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:max-w-sm"
      />

      {categories.length > 0 && (
        <CategoryChips categories={categories} activeSlug={activeSlug} onSelect={setActiveSlug} />
      )}

      {error && (
        <p className="rounded-lg bg-red-950 px-4 py-3 text-red-300">
          Impossible de charger les partenaires. Réessaie plus tard.
        </p>
      )}

      {!error && partners === null && <p className="text-fg-faint">Chargement…</p>}

      {!error && partners !== null && filtered.length === 0 && (
        <p className="rounded-lg bg-surface px-4 py-6 text-center text-fg-faint">
          {partners.length === 0
            ? 'Pas encore de partenaire — reviens vite'
            : 'Aucun partenaire ne correspond à ta recherche'}
        </p>
      )}

      {!error && filtered.length > 0 && view === 'liste' && (
        <div className="flex flex-col gap-6">
          {partenaires.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-fg-faint">
                Partenaires
              </h3>
              <ul className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-3 xl:grid-cols-3">
                {partenaires.map((partner) => (
                  <PartnerRow key={partner.id} partner={partner} />
                ))}
              </ul>
            </div>
          )}

          {bonsPlans.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-fg-faint">
                Bons plans
              </h3>
              <ul className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-3 xl:grid-cols-3">
                {bonsPlans.map((partner) => (
                  <PartnerRow key={partner.id} partner={partner} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!error && filtered.length > 0 && view === 'carte' && <PartnersMap partners={filtered} />}
    </div>
  )
}
