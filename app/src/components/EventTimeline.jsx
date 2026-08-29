import { Link } from 'react-router-dom'
import { formatEventDateShort, formatEventTime, getParisDateParts } from '../lib/formatDate'
import EventMedia from './EventMedia'

const MONTH_LABEL = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

function groupByMonth(events) {
  const groups = []
  let currentKey = null

  for (const event of events) {
    const { year, month } = getParisDateParts(event.starts_at)
    const key = `${year}-${month}`
    if (key !== currentKey) {
      groups.push({ key, year, month, events: [] })
      currentKey = key
    }
    groups[groups.length - 1].events.push(event)
  }

  return groups
}

export default function EventTimeline({ events }) {
  const groups = groupByMonth(events)

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <div key={group.key}>
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-fg-faint">
            {MONTH_LABEL.format(new Date(group.year, group.month - 1, 1))}
          </h2>

          <ol className="relative flex flex-col gap-6 border-l-2 border-line pl-6">
            {group.events.map((event) => (
              <li key={event.id} className="relative">
                <span className="absolute top-1.5 -left-[29px] h-3 w-3 rounded-full border-2 border-canvas bg-accent" />

                <Link
                  to={`/evenements/${event.id}`}
                  className="flex items-center gap-3 rounded-xl transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <div className="min-w-0 flex-1 py-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {formatEventDateShort(event.starts_at)} · {formatEventTime(event.starts_at)}
                    </p>
                    <p className="font-display text-lg font-semibold text-fg">{event.title}</p>
                    {event.location_name && (
                      <p className="truncate text-sm text-fg-faint">{event.location_name}</p>
                    )}
                  </div>

                  {event.image_url ? (
                    <EventMedia
                      src={event.image_url}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-ink">
                      <span className="text-xs font-semibold text-white/70">BDE</span>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
