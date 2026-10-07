import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPastEvents } from '../lib/events'
import SectionHeading from './SectionHeading'

const DATE_COURTE = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Europe/Paris',
})

// Les événements déjà passés, en liste compacte sous l'agenda. Ce que le
// BDE a organisé cette année se lit d'un coup d'œil, et chaque fiche
// garde un lien depuis le site au lieu de ne plus exister que dans le
// sitemap.
export default function EvenementsPasses() {
  const [passes, setPasses] = useState([])

  useEffect(() => {
    let annule = false
    fetchPastEvents().then((data) => !annule && setPasses(data))
    return () => {
      annule = true
    }
  }, [])

  if (passes.length === 0) return null

  return (
    <section className="mt-20 lg:mt-28">
      <SectionHeading title="Déjà passés" />
      <ul>
        {passes.map((ev) => (
          <li key={ev.id} className="border-b-2 border-ink">
            <Link
              to={`/evenements/${ev.id}`}
              className="group grid grid-cols-[6.5rem_minmax(0,1fr)_auto] items-baseline gap-4 py-3 transition hover:bg-surface lg:grid-cols-[9rem_minmax(0,1fr)_auto] lg:px-3"
            >
              <span className="label text-fg-subtle">{DATE_COURTE.format(new Date(ev.starts_at)).replace('.', '')}</span>
              <span className="min-w-0">
                <span className="font-display text-lg uppercase leading-tight lg:text-xl">{ev.title}</span>
                {ev.location_name && <span className="ml-2 text-sm text-fg-muted">{ev.location_name}</span>}
              </span>
              <span aria-hidden="true" className="text-fg-subtle transition group-hover:translate-x-1">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
