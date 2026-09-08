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

// Glyphes officiels des deux marques (tracé unique, plein). Une première
// version redessinée à la main donnait un Instagram en pâté et un WhatsApp
// sans combiné : sur des logos aussi connus, la moindre approximation se
// voit tout de suite.
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z" />
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
