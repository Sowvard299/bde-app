import { useEffect, useMemo, useState } from 'react'
import { fetchCategories, fetchPartners } from '../lib/partners'
import PartnerRow from '../components/PartnerRow'
import CategoryChips from '../components/CategoryChips'

export default function PartenairesPage() {
  const [partners, setPartners] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeSlug, setActiveSlug] = useState(null)

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

  return (
    <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Partenaires</h1>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un partenaire"
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />

      {categories.length > 0 && (
        <CategoryChips
          categories={categories}
          activeSlug={activeSlug}
          onSelect={setActiveSlug}
        />
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">
          Impossible de charger les partenaires. Réessaie plus tard.
        </p>
      )}

      {!error && partners === null && (
        <p className="text-neutral-500">Chargement…</p>
      )}

      {!error && partners !== null && filtered.length === 0 && (
        <p className="rounded-lg bg-neutral-50 px-4 py-6 text-center text-neutral-500">
          {partners.length === 0
            ? 'Pas encore de partenaire — reviens vite'
            : 'Aucun partenaire ne correspond à ta recherche'}
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {filtered.map((partner) => (
          <PartnerRow key={partner.id} partner={partner} />
        ))}
      </ul>
    </main>
  )
}
