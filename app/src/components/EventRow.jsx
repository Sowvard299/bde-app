import { Link } from 'react-router-dom'
import { formatEventTime, getParisDateParts } from '../lib/formatDate'
import { isWeicup, WEICUP_LOGO } from '../lib/media'
import { SERIES, serieEvenement } from '../lib/series'
import EventMedia from './EventMedia'

const TZ = 'Europe/Paris'
const JOUR = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', timeZone: TZ })
const MOIS = new Intl.DateTimeFormat('fr-FR', { month: 'short', timeZone: TZ })

// Une ligne d'agenda : le jour en très grand à gauche, la série, le titre,
// l'heure et le lieu, puis le visuel. Les lignes sont séparées par un
// trait plein, comme un sommaire, plutôt qu'empilées en cartes. Au survol,
// la ligne prend la couleur de sa série (le doré pour le BDE, dont la
// couleur est le blanc).
export default function EventRow({ event }) {
  const date = new Date(event.starts_at)
  const { day } = getParisDateParts(event.starts_at)
  const serie = serieEvenement(event)
  const details = [JOUR.format(date), formatEventTime(event.starts_at), event.location_name]
    .filter(Boolean)
    .join(' · ')

  return (
    <li className="border-b-2 border-ink">
      <Link
        to={`/evenements/${event.id}`}
        style={{ '--survol': serie === SERIES.bde ? 'var(--color-accent-gold)' : serie.couleur }}
        className="group grid grid-cols-[3.75rem_minmax(0,1fr)_auto] items-center gap-4 py-4 transition hover:bg-(--survol) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent lg:grid-cols-[6rem_minmax(0,1fr)_auto_auto] lg:gap-6 lg:px-3 lg:py-5"
      >
        <div className="text-center">
          <p className="masthead text-5xl lg:text-7xl">{day}</p>
          <p className="label mt-1 text-[10px]">{MOIS.format(date).replace('.', '')}</p>
        </div>

        <div className="min-w-0">
          <span className="tag" style={{ '--tag-bg': serie.couleur }}>
            {serie.label}
          </span>
          <p className="mt-2 font-display text-[1.6rem] uppercase leading-[0.92] lg:text-4xl">
            {event.title}
          </p>
          <p className="mt-1.5 text-sm first-letter:uppercase text-fg-muted">{details}</p>
        </div>

        {event.image_url ? (
          <EventMedia
            src={event.image_url}
            logoFallback={isWeicup(event) ? { src: WEICUP_LOGO, background: '#f7b422' } : undefined}
            className="h-[72px] w-[72px] shrink-0 border-2 border-ink object-cover lg:h-24 lg:w-24"
            fallbackLabel="BDE"
          />
        ) : (
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center border-2 border-ink bg-ink lg:h-24 lg:w-24">
            <span className="label text-white">BDE</span>
          </div>
        )}

        <span aria-hidden="true" className="hidden text-2xl transition group-hover:translate-x-1 lg:block">
          →
        </span>
      </Link>
    </li>
  )
}
