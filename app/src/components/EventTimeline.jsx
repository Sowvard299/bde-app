import { Link } from 'react-router-dom'
import { formatEventTime, getParisDateParts } from '../lib/formatDate'
import EventMedia from './EventMedia'
import Reveal from './Reveal'
import { isWeicup, WEICUP_LOGO } from '../lib/media'

const TIMEZONE = 'Europe/Paris'
const MONTH_LABEL = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
const WEEKDAY_SHORT = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: TIMEZONE })
const MONTH_SHORT = new Intl.DateTimeFormat('fr-FR', { month: 'short', timeZone: TIMEZONE })

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

// Pavé de date façon souche de billet, à gauche de chaque ligne. Le jour en
// gros chiffre donne un point d'accroche visuel fort quand on parcourt la
// liste en diagonale, ce qu'une date écrite en toutes lettres ne fait pas.
function DateStub({ isoString }) {
  const date = new Date(isoString)
  const { day } = getParisDateParts(isoString)

  return (
    <div className="flex w-14 shrink-0 flex-col items-center overflow-hidden rounded-xl border border-line bg-surface text-center">
      <span className="w-full bg-accent py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
        {WEEKDAY_SHORT.format(date).replace('.', '')}
      </span>
      <span className="mt-1 font-display text-2xl font-bold leading-none text-fg">{day}</span>
      <span className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-fg-faint">
        {MONTH_SHORT.format(date).replace('.', '')}
      </span>
    </div>
  )
}

export default function EventTimeline({ events }) {
  const groups = groupByMonth(events)

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <div key={group.key}>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-display text-lg font-semibold capitalize text-fg">
              {MONTH_LABEL.format(new Date(group.year, group.month - 1, 1))}
            </h2>
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs font-semibold uppercase tracking-widest text-fg-subtle">
              {group.events.length} {group.events.length > 1 ? 'dates' : 'date'}
            </span>
          </div>

          <ol className="flex flex-col gap-3">
            {group.events.map((event, index) => (
              <Reveal as="li" key={event.id} delay={index * 60}>
                <Link
                  to={`/evenements/${event.id}`}
                  className="lift zoom-media flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <DateStub isoString={event.starts_at} />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent">
                      {formatEventTime(event.starts_at)}
                    </p>
                    <p className="mt-0.5 font-display text-lg font-semibold leading-tight text-fg">
                      {event.title}
                    </p>
                    {event.location_name && (
                      <p className="mt-0.5 truncate text-sm text-fg-faint">
                        {event.location_name}
                      </p>
                    )}
                  </div>

                  {event.image_url ? (
                    <EventMedia
                      src={event.image_url}
                      logoFallback={
                        isWeicup(event) ? { src: WEICUP_LOGO, background: '#f7b422' } : undefined
                      }
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-xl object-cover"
                                fallbackLabel={event.title}
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-ink">
                      <span className="font-display text-xs font-bold text-white/70">BDE</span>
                    </div>
                  )}
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
