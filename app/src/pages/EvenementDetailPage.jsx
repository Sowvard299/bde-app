import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchEventById } from '../lib/events'
import { formatEventDateTime } from '../lib/formatDate'
import { downloadEventIcs } from '../lib/ics'

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
      <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6">
        <p className="text-neutral-500">Chargement…</p>
      </main>
    )
  }

  if (status === 'error' || !event) {
    return (
      <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6">
        <Link to="/evenements" className="text-sm font-medium text-accent">
          ‹ Retour aux événements
        </Link>
        <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">
          Cet événement est introuvable.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 pb-24">
      {event.image_url ? (
        <img src={event.image_url} alt="" className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-ink px-6">
          <span className="font-display text-2xl font-semibold text-white">{event.title}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 px-4">
        <Link to="/evenements" className="text-sm font-medium text-accent">
          ‹ Retour aux événements
        </Link>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            {formatEventDateTime(event.starts_at)}
          </p>
          <h1 className="font-display text-2xl font-semibold text-ink">{event.title}</h1>
          {(event.location_name || event.location_address) && (
            <p className="mt-1 text-neutral-500">
              {[event.location_name, event.location_address].filter(Boolean).join(' — ')}
            </p>
          )}
        </div>

        {event.description && (
          <p className="whitespace-pre-line text-neutral-700">{event.description}</p>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => downloadEventIcs(event)}
            className="rounded-full border border-ink px-4 py-3 text-center text-sm font-semibold text-ink transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Ajouter à mon agenda
          </button>

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
      </div>
    </main>
  )
}
