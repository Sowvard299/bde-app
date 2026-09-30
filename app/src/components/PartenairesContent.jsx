import { useEffect, useMemo, useState } from 'react'
import { PARTENAIRE_A_LA_UNE_ID, fetchCategories, fetchPartners } from '../lib/partners'
import PartnerRow from './PartnerRow'
import PartnerSpotlight from './PartnerSpotlight'
import CategoryChips from './CategoryChips'
import PartnersMap from './PartnersMap'
import ViewToggle from './ViewToggle'

// Plusieurs cartes partagent une ligne ici : un délai croissant sans
// limite ferait arriver la dixième carte visiblement après les trois
// premières alors qu'elles sont toutes déjà à l'écran. Le plafond fait
// lire l'apparition comme un balayage rapide de la grille.
function revealDelay(index) {
  return Math.min(index, 9) * 45
}

function Groupe({ titre, nombre, children }) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-2">
        <h2 className="masthead text-3xl lg:text-4xl">{titre}</h2>
        <span className="label text-fg-subtle">{nombre}</span>
      </div>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>
    </section>
  )
}

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

  // Le partenaire à la une vit dans le jeu complet, pas dans `filtered` :
  // une recherche ou une catégorie ne doit pas le faire disparaître ni
  // sauter la page de haut en bas pendant qu'on tape.
  const aLaUne = useMemo(
    () => partners?.find((p) => p.id === PARTENAIRE_A_LA_UNE_ID) ?? null,
    [partners]
  )

  // Vitrine en vue liste seulement : sur la carte, l'écran appartient à la
  // carte.
  const vitrineVisible = aLaUne !== null && view === 'liste'

  // Un partenaire affiché en vitrine n'est pas répété dans la grille juste
  // en dessous.
  const partenaires = useMemo(
    () =>
      filtered.filter(
        (p) => p.kind === 'partenaire' && !(vitrineVisible && p.id === PARTENAIRE_A_LA_UNE_ID)
      ),
    [filtered, vitrineVisible]
  )
  const bonsPlans = useMemo(
    () => filtered.filter((p) => p.kind !== 'partenaire'),
    [filtered]
  )

  return (
    <div className="flex flex-col gap-8 pt-6 lg:pt-8">
      <ViewToggle
        options={[
          { value: 'liste', label: 'Liste' },
          { value: 'carte', label: 'Carte' },
        ]}
        value={view}
        onChange={setView}
      />

      {!error && vitrineVisible && <PartnerSpotlight partner={aLaUne} />}

      <div className="flex flex-col gap-4">
        <label className="block lg:max-w-sm">
          <span className="sr-only">Rechercher un partenaire</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un partenaire"
            className="field"
          />
        </label>

        {categories.length > 0 && (
          <CategoryChips categories={categories} activeSlug={activeSlug} onSelect={setActiveSlug} />
        )}
      </div>

      {error && <p className="alert">Impossible de charger les partenaires. Réessayez plus tard.</p>}

      {!error && partners === null && <p className="label text-fg-subtle">Chargement</p>}

      {!error && partners !== null && filtered.length === 0 && view === 'liste' && (
        <p className="border-2 border-dashed border-ink px-4 py-8 text-center text-fg-muted">
          {partners.length === 0
            ? 'Aucun partenaire pour le moment.'
            : 'Aucun partenaire ne correspond à cette recherche.'}
        </p>
      )}

      {!error && filtered.length > 0 && view === 'liste' && (
        <div className="flex flex-col gap-14">
          {partenaires.length > 0 && (
            <Groupe titre={vitrineVisible ? 'Autres partenaires' : 'Partenaires'} nombre={partenaires.length}>
              {partenaires.map((partner, index) => (
                <PartnerRow key={partner.id} partner={partner} delay={revealDelay(index)} />
              ))}
            </Groupe>
          )}

          {bonsPlans.length > 0 && (
            <Groupe titre="Bons plans" nombre={bonsPlans.length}>
              {bonsPlans.map((partner, index) => (
                <PartnerRow key={partner.id} partner={partner} delay={revealDelay(index)} />
              ))}
            </Groupe>
          )}
        </div>
      )}

      {/* La carte reste affichée même sans résultat : elle dit elle-même
          qu'aucun partenaire de cette catégorie n'est à afficher. */}
      {!error && partners !== null && view === 'carte' && <PartnersMap partners={filtered} />}
    </div>
  )
}
