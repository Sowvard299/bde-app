import { Link } from 'react-router-dom'
import { formatEventDateTime } from '../lib/formatDate'

export default function EventCard({ event }) {
  return (
    <li>
      <Link
        to={`/evenements/${event.id}`}
        className="block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {event.image_url ? (
          <img
            src={event.image_url}
            alt=""
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-ink">
            <span className="font-display text-lg font-semibold text-white">
              {event.title}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-1 p-4">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            {formatEventDateTime(event.starts_at)}
          </span>
          <span className="font-display text-xl font-semibold text-ink">{event.title}</span>
          {event.location_name && (
            <span className="text-sm text-neutral-500">{event.location_name}</span>
          )}
        </div>
      </Link>
    </li>
  )
}
