import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchEventById } from '../lib/events'
import { formatEventDateTime } from '../lib/formatDate'
import { buildGoogleCalendarUrl, downloadEventIcs } from '../lib/ics'
import AppFooter from '../components/AppFooter'
import EventMedia from '../components/EventMedia'
import {
  isReusedMedia,
  isWeicup,
  WEICUP_LOGO,
  WEICUP_SALE_OPENS_AT,
  WEICUP_TICKET_URL,
  weicupSaleIsLive,
} from '../lib/media'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2C6.477 2 2 6.477 2 12.004c0 2.118.618 4.09 1.688 5.752L2.05 22.5l4.891-1.605a9.955 9.955 0 0 0 5.063 1.372c5.527 0 10.004-4.477 10.004-10.004C21.999 6.477 17.522 2 12.004 2zm0 18.184a8.15 8.15 0 0 1-4.16-1.138l-.298-.176-2.9.952.965-2.827-.194-.29a8.156 8.156 0 0 1-1.264-4.401c0-4.508 3.668-8.176 8.176-8.176 4.508 0 8.176 3.668 8.176 8.176s-3.668 8.176-8.176 8.176z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.415.56.217.96.477 1.38.896.42.42.679.82.896 1.38.166.422.36 1.057.415 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.055 1.17-.25 1.805-.415 2.227a3.717 3.717 0 0 1-.896 1.38 3.717 3.717 0 0 1-1.38.896c-.422.166-1.057.36-2.227.415-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.055-1.805-.25-2.227-.415a3.717 3.717 0 0 1-1.38-.896 3.717 3.717 0 0 1-.896-1.38c-.166-.422-.36-1.057-.415-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.055-1.17.249-1.805.415-2.227.217-.56.477-.96.896-1.38a3.717 3.717 0 0 1 1.38-.896c.422-.166 1.057-.36 2.227-.415 1.266-.058 1.646-.07 4.85-.07zm0 8.162a5.838 5.838 0 1 0 0 11.676 5.838 5.838 0 0 0 0-11.676zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

export default function EvenementDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [status, setStatus] = useState('loading')
  // Re-checked every 30s so a page left open switches over on its own right
  // at 12h, instead of only updating on the next full reload.
  const [saleIsLive, setSaleIsLive] = useState(weicupSaleIsLive)

  useEffect(() => {
    if (saleIsLive) return
    const interval = setInterval(() => {
      if (Date.now() >= WEICUP_SALE_OPENS_AT.getTime()) {
        setSaleIsLive(true)
        clearInterval(interval)
      }
    }, 30_000)
    return () => clearInterval(interval)
  }, [saleIsLive])

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

  const weicup = isWeicup(event)

  return (
    <main className="relative mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 overflow-hidden pb-24 lg:max-w-2xl lg:pb-16 lg:pt-12">
      {/* Héros plein cadre : le visuel occupe tout le haut de l'écran et le
          titre est posé dessus, sur un dégradé qui fond vers le fond de page.
          Le dégradé va jusqu'à l'opaque en bas, ce qui garantit la lisibilité
          du titre quelle que soit la photo (ou la vidéo) derrière. */}
      <div className="relative">
        {event.image_url ? (
          <EventMedia
            src={event.image_url}
            logoFallback={weicup ? { src: WEICUP_LOGO, background: '#f7b422' } : undefined}
            className="aspect-[4/5] w-full object-cover sm:aspect-[16/10] lg:rounded-2xl"
            badge={isReusedMedia(event) ? '*' : undefined}
          />
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center bg-ink px-6 sm:aspect-[16/10] lg:rounded-2xl">
            <span className="font-display text-2xl font-semibold text-white">{event.title}</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas via-canvas/50 to-transparent lg:rounded-2xl" />

        <Link
          to="/evenements"
          className="absolute left-4 top-4 rounded-full bg-black/50 px-3.5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          ‹ Retour
        </Link>

        <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
            {formatEventDateTime(event.starts_at)}
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold leading-tight text-white lg:text-4xl">
            {event.title}
          </h1>
          {(event.location_name || event.location_address) && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85 backdrop-blur-sm">
              <span aria-hidden="true">📍</span>
              {[event.location_name, event.location_address].filter(Boolean).join(' — ')}
            </p>
          )}
        </div>
      </div>

      <div className="relative flex flex-col gap-4 px-4 lg:px-0">

        {weicup && !saleIsLive && (
          <p className="rounded-lg bg-surface px-4 py-3 text-sm font-semibold text-accent">
            Préparez-vous : mise en vente dimanche 6 septembre à 12h pile !
          </p>
        )}

        {event.description && (
          <p className="whitespace-pre-line text-fg-muted">{event.description}</p>
        )}

        {(event.whatsapp_url || event.instagram_url) && (
          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="font-display text-sm font-bold uppercase tracking-wide text-fg">
              Toutes les infos ici
            </p>
            <p className="mt-1 text-xs text-fg-faint">
              Rejoins-nous pour ne rien rater des prochaines sorties.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              {event.whatsapp_url && (
                <a
                  href={event.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              )}
              {event.instagram_url && (
                <a
                  href={event.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  style={{
                    background:
                      'linear-gradient(45deg, #f9ce34, #ee2a7b 45%, #6228d7 90%)',
                  }}
                >
                  <InstagramIcon />
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}

        {weicup && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface p-4">
              <p className="font-display text-lg font-bold text-fg">Compétition</p>
              <p className="text-xs italic text-fg-subtle">Prepárense.</p>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <p className="font-display text-lg font-bold text-fg">15 équipes représentées</p>
              <p className="text-xs italic text-fg-subtle">¡Vámonos!</p>
            </div>
          </div>
        )}

        {weicup && (
          <p className="text-center font-display text-base font-semibold text-accent">
            ¿Estás listo para representar a tu equipo?
          </p>
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

          {weicup && !saleIsLive ? (
            <p className="rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-white">
              Prépare-toi... Les places c'est ce dimanche à 12h.
            </p>
          ) : (
            (weicup ? WEICUP_TICKET_URL : event.ticket_url) && (
              <a
                href={weicup ? WEICUP_TICKET_URL : event.ticket_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {weicup ? 'Acheter un billet' : 'Réserver ma place'}
              </a>
            )
          )}
        </div>

        <AppFooter />
      </div>
    </main>
  )
}
