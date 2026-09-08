import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isLogoFile } from '../lib/media'

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export default function PartnerRow({ partner }) {
  // A logo can point at an unreachable host (storage quota, offline, a
  // stale cached URL) — fall back to initials instead of a broken-image
  // icon rather than trusting logo_url blindly.
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = partner.logo_url && !logoFailed

  // Les partenaires négociés portent un liseré doré et un fond légèrement
  // plus riche : c'est ce qui les distingue au premier coup d'œil des bons
  // plans, qui sont de simples bonnes adresses.
  const isPartenaire = partner.kind === 'partenaire'

  return (
    <li>
      <Link
        to={`/partenaires/${partner.id}`}
        className={`lift zoom-media relative flex h-full w-full items-start gap-3 overflow-hidden rounded-2xl border p-3.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          isPartenaire
            ? 'border-accent-gold/35 bg-surface'
            : 'border-line bg-surface'
        }`}
      >
        {isPartenaire && <span className="absolute inset-y-0 left-0 w-1 bg-accent-gold" />}

        {showLogo ? (
          isLogoFile(partner.logo_url) ? (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-2">
              <img
                src={partner.logo_url}
                alt=""
                className="h-full w-full object-contain"
                onError={() => setLogoFailed(true)}
              />
            </span>
          ) : (
            <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
              <img
                src={partner.logo_url}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setLogoFailed(true)}
              />
            </span>
          )
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-muted font-display text-base font-bold text-fg-faint">
            {initials(partner.name)}
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-display text-base font-semibold text-fg">
              {partner.name}
            </span>
          </span>

          {partner.partner_categories?.name && (
            <span className="mt-1 inline-block rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fg-faint">
              {partner.partner_categories.name}
            </span>
          )}

          {/* Pas de `block` ici : line-clamp impose son propre display et la
              classe d'affichage l'écraserait, ce qui annulerait la coupure. */}
          <span className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-accent">
            {partner.benefit}
          </span>
        </span>
      </Link>
    </li>
  )
}
