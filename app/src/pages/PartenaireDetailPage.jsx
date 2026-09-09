import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPartnerById } from '../lib/partners'
import { isLogoFile } from '../lib/media'
import PartnerMiniMap from '../components/PartnerMiniMap'
import PartnerDescription from '../components/PartnerDescription'
import AppFooter from '../components/AppFooter'

const SHELL =
  'mx-auto flex min-h-svh max-w-[480px] flex-col gap-6 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-2xl lg:px-10 lg:pb-16 lg:pt-12'

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z" />
    </svg>
  )
}

export default function PartenaireDetailPage() {
  const { id } = useParams()
  const [partner, setPartner] = useState(null)
  const [status, setStatus] = useState('loading')
  // Un logo peut pointer vers un hôte injoignable (quota, hors ligne, URL
  // périmée) : on retombe sur les initiales plutôt que sur l'icône cassée.
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    setStatus('loading')
    fetchPartnerById(id)
      .then((data) => {
        setPartner(data)
        setStatus('ok')
      })
      .catch((err) => {
        console.error(err)
        setStatus('error')
      })
  }, [id])

  if (status === 'loading') {
    return (
      <main className={SHELL}>
        <p className="text-fg-faint">Chargement…</p>
      </main>
    )
  }

  if (status === 'error' || !partner) {
    return (
      <main className={SHELL}>
        <Link to="/partenaires" className="text-sm font-medium text-accent">
          ‹ Retour aux partenaires
        </Link>
        <p className="rounded-lg bg-red-950 px-4 py-3 text-red-300">Ce partenaire est introuvable.</p>
        <AppFooter />
      </main>
    )
  }

  const hasMap = partner.latitude && partner.longitude
  const hasPractical = hasMap || partner.address || partner.phone

  return (
    <main className={SHELL}>
      <Link
        to="/partenaires"
        className="text-sm font-medium text-accent transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        ‹ Retour aux partenaires
      </Link>

      {/* Identité et avantage forment un seul bloc : c'est le couple « qui
          c'est / ce que ça te rapporte », et les séparer obligeait l'œil à
          faire deux arrêts pour une seule information utile. */}
      <div className="grain relative overflow-hidden rounded-3xl bg-ink">
        <div
          className="aurora aurora-slow -right-16 -top-20 h-64 w-64"
          style={{ background: 'radial-gradient(circle, #ff4214 0%, transparent 70%)' }}
        />

        <div className="relative p-6 lg:p-8">
          <div className="flex items-center gap-5">
            {partner.logo_url && !logoFailed ? (
              <span
                className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${
                  isLogoFile(partner.logo_url) ? 'bg-white p-3' : ''
                }`}
              >
                <img
                  src={partner.logo_url}
                  alt=""
                  className={`h-full w-full ${
                    isLogoFile(partner.logo_url) ? 'object-contain' : 'rounded-2xl object-cover'
                  }`}
                  onError={() => setLogoFailed(true)}
                />
              </span>
            ) : (
              <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/10 font-display text-2xl font-bold text-white/80">
                {partner.name
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()}
              </span>
            )}

            <div className="min-w-0">
              {partner.partner_categories && (
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-gold">
                  {partner.partner_categories.name}
                </p>
              )}
              <h1 className="mt-1.5 font-display text-2xl font-semibold leading-tight text-white lg:text-3xl">
                {partner.name}
              </h1>
              {partner.kind === 'partenaire' && (
                <span className="mt-2 inline-block rounded-full bg-accent-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Partenaire officiel
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-accent-gold/30 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-gold">
              Ton avantage
            </p>
            {/* Pas de mention générique du type « sur présentation de ta
                carte étudiante » ici : les conditions varient d'un
                partenaire à l'autre (billet envoyé par mail chez Arkose,
                réservation en ligne pour le Pass Jeunes). Chaque fiche
                décrit les siennes dans sa description. */}
            <p className="mt-2 font-display text-xl font-semibold leading-snug text-white lg:text-2xl">
              {partner.benefit}
            </p>
          </div>
        </div>
      </div>

      {partner.description && <PartnerDescription text={partner.description} />}

      {hasPractical && (
        <section className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-fg-faint">
            Infos pratiques
          </h2>

          {hasMap && (
            <div className="overflow-hidden rounded-xl">
              <PartnerMiniMap latitude={partner.latitude} longitude={partner.longitude} />
            </div>
          )}

          {partner.address && (
            <p className="flex gap-3 text-fg-muted">
              <span className="mt-0.5 shrink-0 text-accent">
                <PinIcon />
              </span>
              {partner.address}
            </p>
          )}

          {partner.phone && (
            <a
              href={`tel:${partner.phone.replace(/\s+/g, '')}`}
              className="flex gap-3 text-fg-muted transition hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="mt-0.5 shrink-0 text-accent">
                <PhoneIcon />
              </span>
              {partner.phone}
            </a>
          )}
        </section>
      )}

      {partner.website_url && (
        <a
          href={partner.website_url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-accent px-4 py-4 text-center text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {partner.website_url.includes('helloasso.com') ? 'Acheter un billet' : 'Voir le site'}
        </a>
      )}

      <AppFooter />
    </main>
  )
}
