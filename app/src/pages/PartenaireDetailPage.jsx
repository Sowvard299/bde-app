import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPartnerById } from '../lib/partners'
import { isLogoFile } from '../lib/media'
import PartnerMiniMap from '../components/PartnerMiniMap'
import AppFooter from '../components/AppFooter'

export default function PartenaireDetailPage() {
  const { id } = useParams()
  const [partner, setPartner] = useState(null)
  const [status, setStatus] = useState('loading')
  // A logo can point at an unreachable host (storage quota, offline, a
  // stale cached URL) — fall back to initials instead of a broken-image icon.
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
      <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-2xl lg:px-10 lg:pb-16 lg:pt-12">
        <p className="text-fg-faint">Chargement…</p>
      </main>
    )
  }

  if (status === 'error' || !partner) {
    return (
      <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-2xl lg:px-10 lg:pb-16 lg:pt-12">
        <Link to="/partenaires" className="text-sm font-medium text-accent">
          ‹ Retour aux partenaires
        </Link>
        <p className="rounded-lg bg-red-950 px-4 py-3 text-red-300">Ce partenaire est introuvable.</p>
        <AppFooter />
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-2xl lg:px-10 lg:pb-16 lg:pt-12">
      <Link to="/partenaires" className="text-sm font-medium text-accent">
        ‹ Retour aux partenaires
      </Link>

      {/* Bandeau d'identité : logo, nom, catégorie sur fond de charte, avec
          le même halo que le reste du site pour ne pas casser le fil visuel. */}
      <div className="grain relative overflow-hidden rounded-2xl bg-ink p-5">
        <div
          className="aurora aurora-slow -right-12 -top-16 h-48 w-48"
          style={{ background: 'radial-gradient(circle, #ff4214 0%, transparent 70%)' }}
        />

        <div className="relative flex items-center gap-4">
          {partner.logo_url && !logoFailed ? (
            isLogoFile(partner.logo_url) ? (
              <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2.5">
                <img
                  src={partner.logo_url}
                  alt=""
                  className="h-full w-full object-contain"
                  onError={() => setLogoFailed(true)}
                />
              </span>
            ) : (
              <img
                src={partner.logo_url}
                alt=""
                className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                onError={() => setLogoFailed(true)}
              />
            )
          ) : (
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 font-display text-xl font-bold text-white/80">
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
            <h1 className="mt-1 font-display text-2xl font-semibold leading-tight text-white">
              {partner.name}
            </h1>
            {partner.kind === 'partenaire' && (
              <span className="mt-1.5 inline-block rounded-full bg-accent-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                Partenaire officiel
              </span>
            )}
          </div>
        </div>
      </div>

      {/* L'offre est la raison d'être de la page : elle est traitée comme un
          bloc à part entière, pas comme un simple paragraphe coloré. */}
      <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          Ton avantage
        </p>
        <p className="mt-1.5 font-display text-xl font-bold leading-snug text-fg">
          {partner.benefit}
        </p>
      </div>

      {partner.description && (
        <p className="whitespace-pre-line text-fg-muted">{partner.description}</p>
      )}

      {partner.fine_print && (
        <p className="whitespace-pre-line text-xs text-fg-subtle">{partner.fine_print}</p>
      )}

      {partner.latitude && partner.longitude && (
        <PartnerMiniMap latitude={partner.latitude} longitude={partner.longitude} />
      )}

      {partner.address && (
        <div>
          <p className="text-fg-muted">{partner.address}</p>
          {partner.address_note && (
            <p className="text-sm text-fg-faint">{partner.address_note}</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {partner.phone && (
          <a
            href={`tel:${partner.phone.replace(/\s+/g, '')}`}
            className="rounded-full border border-line px-4 py-3 text-center text-sm font-semibold text-fg transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {partner.phone}
          </a>
        )}

        {partner.website_url && (
          <a
            href={partner.website_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {partner.website_url.includes('helloasso.com') ? 'Acheter un billet' : 'Voir le site'}
          </a>
        )}
      </div>

      <AppFooter />
    </main>
  )
}
