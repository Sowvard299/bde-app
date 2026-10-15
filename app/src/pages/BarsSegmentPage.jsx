import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TYPES, formatEuro, loadBars, prixRepere, tarifMaintenant } from '../lib/bars'
import { indexBars, trierParPrix } from '../lib/barsSeo'
import { metaArrondissementBars, metaBar } from '../lib/seo'
import { useSeoDonnees } from '../hooks/useSeo'
import { tailleMasthead } from '../lib/masthead'
import AddressLink from '../components/AddressLink'
import BarDetails from '../components/BarDetails'
import PartnerMiniMap from '../components/PartnerMiniMap'
import IntrouvablePage from './IntrouvablePage'

const SHELL = 'mx-auto w-full max-w-6xl px-5 lg:px-10'

const FOND_TARIF = {
  'happy-hour': '#8be3b0',
  constant: '#ffffff',
  'hors-creneau': '#ffffff',
  inconnu: '#ffffff',
}

// Une ligne de bar cliquable vers sa page : même grammaire que la liste
// de la carte (carré de couleur, nom, prix repère à droite).
function LigneBar({ lieu, chemin }) {
  const type = TYPES[lieu.type]
  const prix = prixRepere(lieu)
  const tarif = tarifMaintenant(lieu)
  return (
    <li className="border-b-2 border-ink">
      <Link
        to={chemin}
        className="flex w-full gap-3 px-2 py-3.5 transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
      >
        <span className="mt-1 h-3.5 w-3.5 shrink-0 border-2 border-ink" style={{ background: type.couleur }} aria-hidden="true" />
        <span className="flex min-w-0 flex-1 items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block font-display text-xl uppercase leading-[0.95] lg:text-2xl">{lieu.nom}</span>
            <span className="mt-1 block truncate text-xs text-fg-muted">
              {lieu.metro ? `M° ${lieu.metro} · ` : ''}
              {lieu.adresse}
            </span>
            <span className="tag mt-2" style={{ '--tag-bg': FOND_TARIF[tarif.etat] }}>
              {tarif.libelle}
            </span>
          </span>
          {prix && (
            <span className="shrink-0 text-right">
              <span className="masthead block text-2xl">{formatEuro(prix.valeur)}</span>
              <span className="block text-[10px] leading-tight text-fg-subtle">{prix.libelle}</span>
            </span>
          )}
        </span>
      </Link>
    </li>
  )
}

function Fil({ etapes }) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-x-2 border-b-2 border-ink py-3">
      {etapes.map((etape, i) => (
        <span key={etape.chemin} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true" className="text-fg-subtle">/</span>}
          <Link to={etape.chemin} className="label px-1 py-1 transition hover:bg-accent-gold">
            {etape.nom}
          </Link>
        </span>
      ))}
    </nav>
  )
}

function FicheBar({ lieu, donnees }) {
  const { slugDe, arrondissements } = indexBars(donnees.lieux)
  const groupe = arrondissements.find((a) => a.arr === lieu.arrondissement)
  const type = TYPES[lieu.type]
  const maj = donnees.maj.split('-').reverse().join('/')
  const voisins = trierParPrix(groupe?.lieux ?? [], prixRepere)
    .filter((l) => l.id !== lieu.id)
    .slice(0, 6)

  useSeoDonnees(useMemo(() => metaBar(lieu, donnees.lieux, donnees.maj), [lieu, donnees]))

  return (
    <main className={SHELL}>
      <Fil
        etapes={[
          { nom: '← Bars', chemin: '/bars' },
          ...(groupe?.aSaPage ? [{ nom: groupe.libelle, chemin: `/bars/${groupe.slug}` }] : []),
        ]}
      />

      <div className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:pt-12">
        <div className="@container flex flex-col gap-6">
          <div className="border-2 border-ink px-5 pb-5 pt-4" style={{ background: type.couleur, color: type.surCouleur }}>
            <span className="label">{lieu.type === 'insolite' ? 'Bar insolite' : 'Bar pas cher'}</span>
            <h1 className="masthead mt-3" style={{ fontSize: tailleMasthead(lieu.nom, { max: '6rem' }) }}>
              {lieu.nom}
            </h1>
            <p className="mt-3 text-sm">
              <AddressLink
                nom={lieu.nom}
                adresse={lieu.adresse}
                lat={lieu.lat}
                lon={lieu.lon}
                className="underline decoration-2 underline-offset-4"
              />
            </p>
          </div>

          <BarDetails lieu={lieu} libelles={donnees.libelles} maintenant={new Date()} maj={maj} avecNotes={false} />
        </div>

        <div className="flex flex-col gap-4">
          {lieu.lat != null && <PartnerMiniMap latitude={lieu.lat} longitude={lieu.lon} />}
          <Link to={`/bars?lieu=${lieu.id}`} className="btn-ghost self-start">
            Voir sur la carte des bars
          </Link>
        </div>
      </div>

      {voisins.length > 0 && (
        <section className="mt-14 border-t-2 border-ink pt-8 lg:mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="masthead text-4xl lg:text-5xl">Autres bars à {groupe.libelle}</h2>
            {groupe.aSaPage && (
              <Link to={`/bars/${groupe.slug}`} className="label px-1 py-1 transition hover:bg-accent-gold">
                Les {groupe.lieux.length} bars →
              </Link>
            )}
          </div>
          <ul className="mt-4 border-t-2 border-ink">
            {voisins.map((l) => (
              <LigneBar key={l.id} lieu={l} chemin={`/bars/${slugDe.get(l.id)}`} />
            ))}
          </ul>
        </section>
      )}
      <div className="h-16 lg:h-24" />
    </main>
  )
}

function BarsArrondissement({ groupe, donnees }) {
  const { slugDe, arrondissements } = indexBars(donnees.lieux)
  const tries = trierParPrix(groupe.lieux, prixRepere)
  const autres = arrondissements.filter((a) => a.aSaPage && a.slug !== groupe.slug)
  const maj = donnees.maj.split('-').reverse().join('/')
  const titre = `Bars pas chers à ${groupe.libelle}`

  useSeoDonnees(useMemo(() => metaArrondissementBars(groupe, donnees.lieux, donnees.maj), [groupe, donnees]))

  return (
    <main className={SHELL}>
      <Fil etapes={[{ nom: '← Bars', chemin: '/bars' }]} />
      <header className="@container border-b-2 border-ink pb-6 pt-8 lg:pb-10 lg:pt-14">
        <h1 className="masthead" style={{ fontSize: tailleMasthead(titre, { max: '10rem' }) }}>
          {titre}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted lg:mt-7 lg:text-lg">
          Les {groupe.lieux.length} bars repérés par le BDE à {groupe.libelle}, du moins cher au plus cher. Prix
          relevés le {maj}, pouvant avoir changé.
        </p>
      </header>

      <ul className="mt-6">
        {tries.map((l) => (
          <LigneBar key={l.id} lieu={l} chemin={`/bars/${slugDe.get(l.id)}`} />
        ))}
      </ul>

      <div className="mt-8">
        <Link to="/bars" className="btn-ghost">
          La carte des {donnees.lieux.length} bars
        </Link>
      </div>

      <section className="mt-14 border-t-2 border-ink pt-8">
        <h2 className="label text-[12px]">Autres arrondissements</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {autres.map((a) => (
            <li key={a.slug}>
              <Link to={`/bars/${a.slug}`} className="tag transition hover:bg-accent-gold" style={{ '--tag-bg': '#fff' }}>
                {a.libelle} · {a.lieux.length}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 border-t-2 border-ink pt-3 text-[11px] text-fg-subtle">{donnees.avertissement}</p>
      <div className="h-16 lg:h-24" />
    </main>
  )
}

// /bars/<segment> : page d'un arrondissement (« paris-11e ») ou d'un bar.
export default function BarsSegmentPage() {
  const { segment } = useParams()
  const [donnees, setDonnees] = useState(null)
  const [erreur, setErreur] = useState(false)

  useEffect(() => {
    loadBars()
      .then(setDonnees)
      .catch(() => setErreur(true))
  }, [])

  if (erreur) return <IntrouvablePage />
  if (!donnees) {
    return (
      <main className={`${SHELL} pt-10`}>
        <p className="label text-fg-subtle">Chargement</p>
      </main>
    )
  }

  const { arrParSlug, parSlug } = indexBars(donnees.lieux)
  const groupe = arrParSlug.get(segment)
  if (groupe) return <BarsArrondissement groupe={groupe} donnees={donnees} />
  const lieu = parSlug.get(segment)
  if (lieu) return <FicheBar key={lieu.id} lieu={lieu} donnees={donnees} />
  return <IntrouvablePage />
}
