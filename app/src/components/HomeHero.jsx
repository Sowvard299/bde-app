import { Link } from 'react-router-dom'
import Countdown from './Countdown'
import EventMedia from './EventMedia'
import OmbreTramee from './OmbreTramee'
import { formatEventDateTime } from '../lib/formatDate'
import { isWeicup, WEICUP_LOGO } from '../lib/media'
import { serieEvenement } from '../lib/series'
import { tailleMasthead } from '../lib/masthead'

// Une de la page d'accueil : le nom en très grand, une phrase qui dit ce
// qu'est le BDE, et à côté le prochain rendez-vous avec son compte à
// rebours. `nextEvent` est facultatif : sans lui (base injoignable, aucun
// événement annoncé), la une tient seule.
export default function HomeHero({ nextEvent }) {
  const serie = nextEvent ? serieEvenement(nextEvent) : null

  return (
    <section className="grid grid-cols-[minmax(0,1fr)] gap-10 border-b-2 border-ink pb-10 pt-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-14 lg:pb-14 lg:pt-14">
      <div className="@container relative">
        <h1
          className="masthead leading-[0.8]"
          style={{ fontSize: tailleMasthead('Sorbonne', { min: '3.5rem', max: '12rem', ratio: 0.62 }) }}
        >
          BDE IAE
          <br />
          Paris
          <br />
          Sorbonne
        </h1>
        <span
          className="tag sticker absolute right-0 top-0 text-[11px]"
          style={{ '--tag-bg': 'var(--color-accent-pink)' }}
        >
          Année 2026-2027
        </span>

        <p className="mt-7 max-w-md text-lg leading-snug text-fg-muted lg:text-xl">
          Le bureau des étudiants de l'IAE Paris-Sorbonne Business School : soirées, sport, sorties
          culturelles et réductions chez nos partenaires.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/evenements" className="btn">
            Voir l'agenda
          </Link>
          <Link to="/partenaires" className="btn-ghost">
            Partenaires
          </Link>
        </div>
      </div>

      {nextEvent && (
        <OmbreTramee serie={serie} survol className="self-start">
          <Link
            to={`/evenements/${nextEvent.id}`}
            className="group flex flex-col border-2 border-ink bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <div className="flex items-center justify-between border-b-2 border-ink px-3 py-2">
              <span className="label">Prochain rendez-vous</span>
              <span aria-hidden="true" className="transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <div className="zoom-media overflow-hidden border-b-2 border-ink">
              {nextEvent.image_url ? (
                <EventMedia
                  src={nextEvent.image_url}
                  logoFallback={isWeicup(nextEvent) ? { src: WEICUP_LOGO, background: '#f7b422' } : undefined}
                  className="aspect-[5/4] w-full object-cover"
                  fallbackLabel={nextEvent.title}
                />
              ) : (
                <div className="flex aspect-[5/4] w-full items-center justify-center bg-ink">
                  <span className="label text-white">BDE</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <span className="tag" style={{ '--tag-bg': serie.couleur }}>
                {serie.label}
              </span>
              <p className="mt-3 font-display text-3xl uppercase leading-[0.9]">{nextEvent.title}</p>
              <p className="mt-2 text-sm text-fg-muted first-letter:uppercase">
                {formatEventDateTime(nextEvent.starts_at)}
                {nextEvent.location_name ? ` · ${nextEvent.location_name}` : ''}
              </p>
              <div className="mt-4">
                <Countdown target={nextEvent.starts_at} />
              </div>
            </div>
          </Link>
        </OmbreTramee>
      )}
    </section>
  )
}
