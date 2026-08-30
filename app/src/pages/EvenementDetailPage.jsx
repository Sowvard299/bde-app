import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchEventById } from '../lib/events'
import { formatEventDateTime } from '../lib/formatDate'
import { buildGoogleCalendarUrl, downloadEventIcs } from '../lib/ics'
import AppFooter from '../components/AppFooter'
import EventMedia from '../components/EventMedia'
import { isReusedMedia } from '../lib/media'

export default function EvenementDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    fetchEventById(id)
      .then((data) => {
        setEvent(data)
        setStatus('ok')
      })
      .catch((err) => {
        console.error(err)
        setStatus('error')
      })
  }, [id])

  if (status === 'loading') {
    return (
      <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6 lg:max-w-2xl lg:px-10 lg:pb-16 lg:pt-12">
        <p className="text-fg-faint">Chargement…</p>
      </main>
    )
  }

  if (status === 'error' || !event) {
    return (
      <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6 lg:max-w-2xl lg:px-10 lg:pb-16 lg:pt-12">
        <Link to="/evenements" className="text-sm font-medium text-accent">
          ‹ Retour aux événements
        </Link>
        <p className="rounded-lg bg-red-950 px-4 py-3 text-red-300">
          Cet événement est introuvable.
        </p>
        <AppFooter />
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 pb-24 lg:max-w-2xl lg:pb-16 lg:pt-12">
      {event.image_url ? (
        <EventMedia
          src={event.image_url}
          className="aspect-[4/3] w-full object-cover lg:rounded-2xl"
          badge={isReusedMedia(event) ? '*' : undefined}
        />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-ink px-6 lg:rounded-2xl">
          <span className="font-display text-2xl font-semibold text-white">{event.title}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 px-4 lg:px-0">
        <Link to="/evenements" className="text-sm font-medium text-accent">
          ‹ Retour aux événements
        </Link>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            {formatEventDateTime(event.starts_at)}
          </p>
          <h1 className="font-display text-2xl font-semibold text-fg">{event.title}</h1>
          {(event.location_name || event.location_address) && (
            <p className="mt-1 text-fg-faint">
              {[event.location_name, event.location_address].filter(Boolean).join(' — ')}
            </p>
          )}
        </div>

        {event.description && (
          <p className="whitespace-pre-line text-fg-muted">{event.description}</p>
        )}

        {isReusedMedia(event) && (
          <p className="-mt-2 text-xs text-fg-subtle">* Images de l'édition précédente</p>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={buildGoogleCalendarUrl(event)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-full border border-line px-4 py-3 text-center text-sm font-semibold text-fg transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Ajouter à Google Agenda
            </a>
            <button
              type="button"
              onClick={() => downloadEventIcs(event)}
              className="flex-1 rounded-full border border-line px-4 py-3 text-center text-sm font-semibold text-fg transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Ajouter à Apple / Outlook
            </button>
          </div>

          {event.ticket_url && (
            <a
              href={event.ticket_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Réserver ma place
            </a>
          )}
        </div>

        <AppFooter />
      </div>
    </main>
  )
}
