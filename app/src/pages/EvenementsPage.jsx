import { useEffect, useMemo, useState } from 'react'
import { fetchUpcomingEvents } from '../lib/events'
import { getParisDateParts } from '../lib/formatDate'
import EventCard from '../components/EventCard'
import EventTimeline from '../components/EventTimeline'
import MonthCalendar from '../components/MonthCalendar'
import ViewToggle from '../components/ViewToggle'
import AppFooter from '../components/AppFooter'

const todayParts = getParisDateParts(new Date().toISOString())
const todayKey = `${todayParts.year}-${String(todayParts.month).padStart(2, '0')}-${String(todayParts.day).padStart(2, '0')}`

export default function EvenementsPage() {
  const [events, setEvents] = useState(null)
  const [error, setError] = useState(null)
  const [view, setView] = useState('liste')
  const [cursor, setCursor] = useState({ year: todayParts.year, month: todayParts.month - 1 })
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    fetchUpcomingEvents()
      .then(setEvents)
      .catch((err) => {
        console.error(err)
        setError(err)
      })
  }, [])

  const eventsByDay = useMemo(() => {
    const map = new Map()
    if (!events) return map
    for (const event of events) {
      const parts = getParisDateParts(event.starts_at)
      const key = `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(event)
    }
    return map
  }, [events])

  const eventDaysInMonth = useMemo(() => {
    const set = new Set()
    for (const key of eventsByDay.keys()) {
      const [y, m] = key.split('-').map(Number)
      if (y === cursor.year && m === cursor.month + 1) set.add(key)
    }
    return set
  }, [eventsByDay, cursor])

  const dayEvents = selectedDay ? eventsByDay.get(selectedDay) ?? [] : []

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-3xl lg:px-10 lg:pb-16 lg:pt-12">
      <h1 className="font-display text-2xl font-semibold text-fg lg:text-3xl">Événements</h1>

      <ViewToggle
        options={[
          { value: 'liste', label: 'Frise' },
          { value: 'calendrier', label: 'Calendrier' },
        ]}
        value={view}
        onChange={setView}
      />

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

      {!error && events !== null && events.length > 0 && view === 'liste' && (
        <EventTimeline events={events} />
      )}

      {!error && events !== null && events.length > 0 && view === 'calendrier' && (
        <div className="flex flex-col gap-4">
          <MonthCalendar
            year={cursor.year}
            month={cursor.month}
            eventDays={eventDaysInMonth}
            selectedDay={selectedDay}
            todayKey={todayKey}
            onSelectDay={setSelectedDay}
            onChangeMonth={(delta) => {
              setSelectedDay(null)
              setCursor((prev) => {
                const date = new Date(prev.year, prev.month + delta, 1)
                return { year: date.getFullYear(), month: date.getMonth() }
              })
            }}
          />

          {selectedDay ? (
            <ul className="flex flex-col gap-4">
              {dayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm text-fg-subtle">
              Touche une date avec un point pour voir les événements du jour
            </p>
          )}
        </div>
      )}

      <AppFooter />
    </main>
  )
}
