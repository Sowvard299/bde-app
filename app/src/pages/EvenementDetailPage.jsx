import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchEventById } from '../lib/events'
import { metaEvenement } from '../lib/seo'
import { useSeoDonnees } from '../hooks/useSeo'
import { formatEventTime } from '../lib/formatDate'
import { buildGoogleCalendarUrl, downloadEventIcs } from '../lib/ics'
import { isReusedMedia, isWeicup, WEICUP_LOGO } from '../lib/media'
import { serieEvenement } from '../lib/series'
import { tailleMasthead } from '../lib/masthead'
import AddressLink from '../components/AddressLink'
import EventMedia from '../components/EventMedia'
import RichText from '../components/RichText'
import { InstagramIcon, WhatsAppIcon } from '../components/BrandIcons'

const DATE_LONGUE = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Paris',
})

function tarif(prixCentimes) {
  if (prixCentimes == null) return null
  if (prixCentimes === 0) return 'Gratuit'
  const euros = prixCentimes / 100
  return `${Number.isInteger(euros) ? euros : euros.toFixed(2).replace('.', ',')} €`
}

function Info({ label, children }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b-2 border-ink py-3">
      <dt className="label pt-0.5 text-fg-subtle">{label}</dt>
      <dd className="text-fg">{children}</dd>
    </div>
  )
}

const SHELL = 'mx-auto w-full max-w-6xl px-5 lg:px-10'

export default function EvenementDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [status, setStatus] = useState('loading')
  // Titre, description, image de partage et balisage Event : le Worker
  // les écrit déjà pour une arrivée directe, pas pour quelqu'un qui ouvre
  // la fiche depuis l'agenda sans recharger la page.
  useSeoDonnees(useMemo(() => metaEvenement(event), [event]))

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
      <main className={`${SHELL} pt-10`}>
        <p className="label text-fg-subtle">Chargement</p>
      </main>
    )
  }

  if (status === 'error' || !event) {
    return (
      <main className={`${SHELL} pt-8`}>
        <Link to="/evenements" className="label inline-block py-2 hover:bg-accent-gold">
          ← Agenda
        </Link>
        <p className="alert mt-4">Cet événement est introuvable.</p>
      </main>
    )
  }

  const serie = serieEvenement(event)
  const passe = new Date(event.ends_at ?? event.starts_at).getTime() < Date.now() - 6 * 3600 * 1000
  const lieu = [event.location_name, event.location_address].filter(Boolean)
  const prix = tarif(event.price_cents)

  return (
    <main className={SHELL}>
      <div className="flex items-center justify-between border-b-2 border-ink py-3">
        <Link to="/evenements" className="label px-1 py-1 transition hover:bg-accent-gold">
          ← Agenda
        </Link>
        {passe && <span className="tag" style={{ '--tag-bg': '#fff' }}>Événement passé</span>}
      </div>

      <div className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:pt-12">
        <div className="@container flex flex-col">
          <span className="tag self-start" style={{ '--tag-bg': serie.couleur }}>
            {serie.label}
          </span>
          <h1 className="masthead mt-4" style={{ fontSize: tailleMasthead(event.title, { max: '7rem' }) }}>
            {event.title}
          </h1>

          <dl className="mt-8 border-t-2 border-ink">
            <Info label="Date">
              <span className="first-letter:uppercase">{DATE_LONGUE.format(new Date(event.starts_at))}</span>
            </Info>
            <Info label="Heure">{formatEventTime(event.starts_at)}</Info>
            {lieu.length > 0 && (
              <Info label="Lieu">
                <AddressLink
                  nom={event.location_name}
                  adresse={event.location_address}
                  lat={event.latitude}
                  lon={event.longitude}
                  className="underline decoration-2 underline-offset-4 transition hover:bg-accent-gold"
                >
                  {lieu.join(', ')}
                </AddressLink>
              </Info>
            )}
            {prix && <Info label="Tarif">{prix}</Info>}
          </dl>

          {!passe && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {event.ticket_url && (
                <a href={event.ticket_url} target="_blank" rel="noreferrer" className="btn">
                  Réserver ma place
                </a>
              )}
              <a href={buildGoogleCalendarUrl(event)} target="_blank" rel="noreferrer" className="btn-ghost">
                Google Agenda
              </a>
              <button type="button" onClick={() => downloadEventIcs(event)} className="btn-ghost">
                Apple / Outlook
              </button>
            </div>
          )}
        </div>

        <div>
          {event.image_url ? (
            <EventMedia
              src={event.image_url}
              logoFallback={isWeicup(event) ? { src: WEICUP_LOGO, background: '#f7b422' } : undefined}
              className="aspect-[4/5] w-full border-2 border-ink object-cover"
              fallbackLabel={event.title}
            />
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center border-2 border-ink bg-ink p-8">
              <span className="masthead text-center text-5xl text-white">{event.title}</span>
            </div>
          )}
          {isReusedMedia(event) && (
            <p className="label mt-2 text-fg-subtle">Images de l'édition précédente</p>
          )}
        </div>
      </div>

      {event.description && (
        <section className="mt-12 grid gap-6 border-t-2 border-ink pt-8 lg:mt-16 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
          <h2 className="label text-[12px]">Programme</h2>
          <RichText text={event.description} className="max-w-2xl text-[17px]" />
        </section>
      )}

      {(event.whatsapp_url || event.instagram_url) && (
        <section className="mt-12 grid gap-6 border-t-2 border-ink pt-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
          <h2 className="label text-[12px]">Infos en direct</h2>
          <div>
            <p className="max-w-xl text-fg-muted">
              Les changements de dernière minute (lieu, horaire, météo) passent par le groupe WhatsApp
              et le compte Instagram du BDE.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {event.whatsapp_url && (
                <a href={event.whatsapp_url} target="_blank" rel="noreferrer" className="btn-ghost">
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              )}
              {event.instagram_url && (
                <a href={event.instagram_url} target="_blank" rel="noreferrer" className="btn-ghost">
                  <InstagramIcon />
                  Instagram
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="h-16 lg:h-24" />
    </main>
  )
}
