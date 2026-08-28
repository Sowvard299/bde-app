import { useEffect, useMemo, useState } from 'react'
import { fetchUpcomingEvents } from '../lib/events'
import { getParisDateParts } from '../lib/formatDate'
import EventCard from '../components/EventCard'
import MonthCalendar from '../components/MonthCalendar'

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
    <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Événements</h1>

      <div className="flex gap-1 rounded-full bg-neutral-100 p-1" role="tablist">
        <ViewButton label="Liste" active={view === 'liste'} onClick={() => setView('liste')} />
        <ViewButton label="Calendrier" active={view === 'calendrier'} onClick={() => setView('calendrier')} />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">
          Impossible de charger les événements. Réessaie plus tard.
        </p>
      )}

      {!error && events === null && <p className="text-neutral-500">Chargement…</p>}

      {!error && events !== null && events.length === 0 && (
        <p className="rounded-lg bg-neutral-50 px-4 py-6 text-center text-neutral-500">
          Pas encore d'événement — reviens vite
        </p>
      )}

      {!error && events !== null && events.length > 0 && view === 'liste' && (
        <ul className="flex flex-col gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ul>
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
            <p className="text-center text-sm text-neutral-400">
              Touche une date avec un point pour voir les événements du jour
            </p>
          )}
        </div>
      )}
    </main>
  )
}

function ViewButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex-1 rounded-full py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        active ? 'bg-white text-ink shadow-sm' : 'text-neutral-500'
      }`}
    >
      {label}
    </button>
  )
}
