import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AnnualMilestones from '../components/AnnualMilestones'
import MonthlyActivities from '../components/MonthlyActivities'
import AppFooter from '../components/AppFooter'
import HomeHero from '../components/HomeHero'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { fetchUpcomingEvents } from '../lib/events'
import logoWhite from '../assets/logo-mark-white.png'

const MARQUEE_ITEMS = [
  'Sorbonne Night',
  'WEICUP',
  'Sorbonne Running',
  'Escalade',
  'Gala',
  'Coupe de France des IAE',
  'Bons plans',
]

export default function AccueilPage() {
  const [nextEvent, setNextEvent] = useState(null)

  // Sert uniquement au compte à rebours de l'affiche. Un échec n'a aucune
  // conséquence visible : l'affiche s'affiche simplement sans le bloc.
  useEffect(() => {
    let cancelled = false
    fetchUpcomingEvents()
      .then((events) => {
        if (!cancelled) setNextEvent(events?.[0] ?? null)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col gap-10 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-6xl lg:px-10 lg:pb-16 lg:pt-12">
      <HomeHero nextEvent={nextEvent} marqueeItems={MARQUEE_ITEMS} />

      <Reveal as="section" className="flex flex-col gap-4">
        <SectionHeading eyebrow="Toute l'année" title="L'année en un coup d'œil" />
        <AnnualMilestones />
      </Reveal>

      <Reveal>
        <Link
          to="/partenaires"
          className="lift grain relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl bg-ink p-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <div
            className="aurora aurora-slow -right-10 -top-16 h-56 w-56"
            style={{ background: 'radial-gradient(circle, #ff4214 0%, transparent 70%)' }}
          />
          <img
            src={logoWhite}
            alt=""
            className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 opacity-[0.12]"
          />
          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-gold">
              Ta carte étudiante suffit
            </p>
            <p className="mt-1 font-display text-2xl font-semibold">Partenaires</p>
            <p className="mt-0.5 text-sm text-white/70">Toutes les réductions près de toi</p>
          </div>
          <span className="relative shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold">
            Voir
          </span>
        </Link>
      </Reveal>

      <Reveal as="section" className="flex flex-col gap-4">
        <SectionHeading eyebrow="Chaque mois" title="Ce qui revient tout le temps" />
        <MonthlyActivities />
      </Reveal>

      <AppFooter />
    </main>
  )
}
