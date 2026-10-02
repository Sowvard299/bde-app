import { useEffect, useMemo, useState } from 'react'
import { fetchUpcomingEvents } from '../lib/events'
import { getParisDateParts } from '../lib/formatDate'
import { serieEvenement } from '../lib/series'
import EventRow from '../components/EventRow'
import EventTimeline from '../components/EventTimeline'
import MonthCalendar from '../components/MonthCalendar'
import ViewToggle from '../components/ViewToggle'
import PageHeader from '../components/PageHeader'

const aujourdhui = getParisDateParts(new Date().toISOString())
const cleAujourdhui = `${aujourdhui.year}-${String(aujourdhui.month).padStart(2, '0')}-${String(aujourdhui.day).padStart(2, '0')}`

function cleJour(iso) {
  const p = getParisDateParts(iso)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

export default function EvenementsPage() {
  const [events, setEvents] = useState(null)
  const [error, setError] = useState(null)
  const [view, setView] = useState('liste')
  const [cursor, setCursor] = useState({ year: aujourdhui.year, month: aujourdhui.month - 1 })
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    fetchUpcomingEvents()
      .then(setEvents)
      .catch((err) => {
        console.error(err)
        setError(err)
      })
  }, [])

  // Le calendrier s'ouvre sur le mois du prochain événement : le mois en
  // cours est souvent vide, ce qui donnait l'impression d'un agenda cassé.
  useEffect(() => {
    if (!events || events.length === 0) return
    const p = getParisDateParts(events[0].starts_at)
    setCursor({ year: p.year, month: p.month - 1 })
  }, [events])

  const parJour = useMemo(() => {
    const map = new Map()
    for (const event of events ?? []) {
      const cle = cleJour(event.starts_at)
      if (!map.has(cle)) map.set(cle, [])
      map.get(cle).push(event)
    }
    return map
  }, [events])

  // Pour chaque jour du mois affiché : les séries de ses événements, sans
  // doublon, pour colorer la case.
  const joursDuMois = useMemo(() => {
    const map = new Map()
    for (const [cle, liste] of parJour) {
      const [y, m] = cle.split('-').map(Number)
      if (y === cursor.year && m === cursor.month + 1) {
        map.set(cle, [...new Set(liste.map(serieEvenement))])
      }
    }
    return map
  }, [parJour, cursor])

  const evenementsDuJour = selectedDay ? parJour.get(selectedDay) ?? [] : []

  return (
    <main className="mx-auto w-full max-w-6xl px-5 lg:px-10">
      <PageHeader
        title="Agenda"
        intro="Soirées, sport et sorties organisés par le BDE."
        meta={events?.length ? `${events.length} ${events.length > 1 ? 'dates à venir' : 'date à venir'}` : null}
      />

      <div className="mt-6 lg:mt-8">
        <ViewToggle
          options={[
            { value: 'liste', label: 'Liste' },
            { value: 'calendrier', label: 'Calendrier' },
          ]}
          value={view}
          onChange={setView}
        />
      </div>

      <div className="mt-8 lg:mt-10">
        {error && <p className="alert">Impossible de charger l'agenda. Réessaie dans quelques instants.</p>}

        {!error && events === null && <p className="label text-fg-subtle">Chargement</p>}

        {!error && events?.length === 0 && (
          <p className="border-2 border-ink px-5 py-8 text-center text-fg-muted">
            Aucun événement annoncé pour le moment.
          </p>
        )}

        {!error && events?.length > 0 && view === 'liste' && <EventTimeline events={events} />}

        {!error && events?.length > 0 && view === 'calendrier' && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
            <MonthCalendar
              year={cursor.year}
              month={cursor.month}
              eventDays={joursDuMois}
              selectedDay={selectedDay}
              todayKey={cleAujourdhui}
              onSelectDay={setSelectedDay}
              onChangeMonth={(delta) => {
                setSelectedDay(null)
                setCursor((prev) => {
                  const date = new Date(prev.year, prev.month + delta, 1)
                  return { year: date.getFullYear(), month: date.getMonth() }
                })
              }}
            />

            <div>
              {selectedDay ? (
                <ol className="border-t-2 border-ink">
                  {evenementsDuJour.map((event) => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </ol>
              ) : (
                <p className="border-2 border-dashed border-ink px-5 py-8 text-center text-sm text-fg-muted">
                  Les jours en doré ont un événement. Choisis-en un pour l'afficher ici.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
