import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPartnerById } from '../lib/partners'
import PartnerMiniMap from '../components/PartnerMiniMap'
import AppFooter from '../components/AppFooter'

export default function PartenaireDetailPage() {
  const { id } = useParams()
  const [partner, setPartner] = useState(null)
  const [status, setStatus] = useState('loading')

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
      <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-3xl">
        <p className="text-neutral-500">Chargement…</p>
      </main>
    )
  }

  if (status === 'error' || !partner) {
    return (
      <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-3xl">
        <Link to="/partenaires" className="text-sm font-medium text-accent">
          ‹ Retour aux partenaires
        </Link>
        <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">Ce partenaire est introuvable.</p>
        <AppFooter />
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-3xl">
      <Link to="/partenaires" className="text-sm font-medium text-accent">
        ‹ Retour aux partenaires
      </Link>

      <div className="flex items-center gap-4">
        {partner.logo_url ? (
          <img
            src={partner.logo_url}
            alt=""
            className="h-16 w-16 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg font-semibold text-neutral-500">
            {partner.name
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0])
              .join('')
              .toUpperCase()}
          </span>
        )}

        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold text-ink">{partner.name}</h1>
          {partner.partner_categories && (
            <p className="text-sm text-neutral-500">{partner.partner_categories.name}</p>
          )}
        </div>
      </div>

      <p className="rounded-lg bg-accent/10 px-4 py-3 text-lg font-bold text-accent">
        {partner.benefit}
      </p>

      {partner.description && (
        <p className="whitespace-pre-line text-neutral-700">{partner.description}</p>
      )}

      {partner.latitude && partner.longitude && (
        <PartnerMiniMap latitude={partner.latitude} longitude={partner.longitude} />
      )}

      {partner.address && <p className="text-neutral-700">{partner.address}</p>}

      <div className="flex flex-col gap-2">
        {partner.phone && (
          <a
            href={`tel:${partner.phone.replace(/\s+/g, '')}`}
            className="rounded-full border border-ink px-4 py-3 text-center text-sm font-semibold text-ink transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
            Voir le site
          </a>
        )}
      </div>

      <AppFooter />
    </main>
  )
}
