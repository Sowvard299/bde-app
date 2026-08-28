import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchUpcomingEvents } from '../lib/events'
import EventsSideScroll from '../components/EventsSideScroll'
import MonthlyActivities from '../components/MonthlyActivities'
import AppFooter from '../components/AppFooter'
import logoWhite from '../assets/logo-mark-white.png'

export default function AccueilPage() {
  const [events, setEvents] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUpcomingEvents()
      .then(setEvents)
      .catch((err) => {
        console.error(err)
        setError(err)
      })
  }, [])

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col gap-8 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-6xl lg:px-10 lg:pb-16 lg:pt-12">
      <h1 className="font-display text-2xl font-semibold text-fg lg:text-3xl">
        Bienvenue au BDE IAE Paris Sorbonne
      </h1>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold text-fg">L'année en un coup d'œil</h2>
          <Link to="/evenements" className="text-sm font-medium text-accent">
            Tout voir
          </Link>
        </div>

        {error && (
          <p className="rounded-lg bg-red-950 px-4 py-3 text-red-300">
            Impossible de charger les événements. Réessaie plus tard.
          </p>
        )}

        {!error && events === null && <p className="text-fg-faint">Chargement…</p>}

        {!error && events !== null && events.length === 0 && (
          <p className="rounded-lg bg-surface px-4 py-6 text-center text-fg-faint">
            Pas encore d'événement — reviens vite
          </p>
        )}

        {!error && events !== null && events.length > 0 && <EventsSideScroll events={events} />}
      </section>

      <Link
        to="/carte-bde"
        className="relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl bg-ink p-5 text-white transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <img
          src={logoWhite}
          alt=""
          className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 opacity-20"
        />
        <div>
          <p className="font-display text-lg font-semibold">Ma carte BDE</p>
          <p className="text-sm text-white/70">Réductions, accès aux soirées, et plus</p>
        </div>
        <span className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold">
          Voir
        </span>
      </Link>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold text-fg">Chaque mois</h2>
        <MonthlyActivities />
      </section>

      <Link
        to="/partenaires"
        className="flex items-center justify-between gap-3 rounded-2xl border border-line p-4 transition hover:border-fg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div>
          <p className="font-display text-base font-semibold text-fg">Partenaires</p>
          <p className="text-sm text-fg-faint">Toutes les réductions près de toi</p>
        </div>
        <span className="text-accent">›</span>
      </Link>

      <AppFooter />
    </main>
  )
}
