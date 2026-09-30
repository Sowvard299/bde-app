import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AnnualMilestones from '../components/AnnualMilestones'
import EventRow from '../components/EventRow'
import HomeHero from '../components/HomeHero'
import Marquee from '../components/Marquee'
import MonthlyActivities from '../components/MonthlyActivities'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { fetchUpcomingEvents } from '../lib/events'
import { fetchPartners } from '../lib/partners'
import { isLogoFile } from '../lib/media'

function LienSection({ to, children }) {
  return (
    <Link to={to} className="label inline-flex items-center gap-1.5 px-1 py-1 transition hover:bg-accent-gold">
      {children} <span aria-hidden="true">→</span>
    </Link>
  )
}

export default function AccueilPage() {
  const [evenements, setEvenements] = useState(null)
  const [partenaires, setPartenaires] = useState([])

  // Deux chargements indépendants : si l'un échoue, la page s'affiche
  // quand même, sans la section correspondante.
  useEffect(() => {
    let annule = false
    fetchUpcomingEvents()
      .then((data) => !annule && setEvenements(data ?? []))
      .catch(() => !annule && setEvenements([]))
    fetchPartners()
      .then((data) => !annule && setPartenaires((data ?? []).filter((p) => p.kind === 'partenaire')))
      .catch(() => {})
    return () => {
      annule = true
    }
  }, [])

  const prochain = evenements?.[0] ?? null
  const aVenir = evenements?.slice(0, 4) ?? []

  return (
    <main>
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-10">
        <HomeHero nextEvent={prochain} />
      </div>

      <Marquee
        texte="Sorbonne Night / Sorbonne Sport / Sorbonne Culture"
        className="mt-10 bg-ink text-white lg:mt-14"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-5 pt-16 lg:gap-28 lg:px-10 lg:pt-24">
        {aVenir.length > 0 && (
          <Reveal as="section">
            <SectionHeading title="À venir" action={<LienSection to="/evenements">Agenda complet</LienSection>} />
            <ol>
              {aVenir.map((evenement) => (
                <EventRow key={evenement.id} event={evenement} />
              ))}
            </ol>
          </Reveal>
        )}

        <Reveal as="section">
          <SectionHeading title="Chaque mois" />
          <div className="mt-8">
            <MonthlyActivities />
          </div>
        </Reveal>

        <Reveal as="section">
          <SectionHeading title="L'année" />
          <div className="mt-8">
            <AnnualMilestones />
          </div>
        </Reveal>

        {partenaires.length > 0 && (
          <Reveal as="section">
            <SectionHeading title="Partenaires" action={<LienSection to="/partenaires">Tous</LienSection>} />
            <p className="mt-5 max-w-xl text-fg-muted">
              Des réductions négociées par le BDE pour les étudiants de l'IAE, sur présentation de la
              carte étudiante.
            </p>
            <ul className="mt-8 grid grid-cols-3 border-l-2 border-t-2 border-ink sm:grid-cols-4 lg:grid-cols-6">
              {partenaires.slice(0, 12).map((p) => (
                <li key={p.id} className="border-b-2 border-r-2 border-ink">
                  <Link
                    to={`/partenaires/${p.id}`}
                    title={p.name}
                    className="group relative flex aspect-square items-center justify-center overflow-hidden bg-white transition hover:bg-accent-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"
                  >
                    {p.logo_url ? (
                      <img
                        src={p.logo_url}
                        alt={p.name}
                        loading="lazy"
                        className={
                          isLogoFile(p.logo_url)
                            ? 'h-3/5 w-3/5 object-contain'
                            : 'h-full w-full object-cover transition duration-300 group-hover:scale-105'
                        }
                      />
                    ) : (
                      <span className="label px-2 text-center">{p.name}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </main>
  )
}
