import { Link } from 'react-router-dom'
import { formatEventDateShort, formatEventTime } from '../lib/formatDate'

export default function EventsSideScroll({ events }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
      {events.map((event) => (
        <Link
          key={event.id}
          to={`/evenements/${event.id}`}
          className="flex w-40 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-neutral-200 transition hover:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {event.image_url ? (
            <img src={event.image_url} alt="" className="h-24 w-full object-cover" />
          ) : (
            <div className="flex h-24 w-full items-center justify-center bg-ink">
              <span className="text-xs font-semibold text-white/70">BDE</span>
            </div>
          )}
          <div className="flex flex-col gap-0.5 p-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {formatEventDateShort(event.starts_at)} · {formatEventTime(event.starts_at)}
            </p>
            <p className="line-clamp-2 font-display text-sm font-semibold text-ink">
              {event.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
