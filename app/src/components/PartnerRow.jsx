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

  return (
    <li>
      <Link
        to={`/partenaires/${partner.id}`}
        className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface p-3 text-left transition hover:border-fg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {showLogo ? (
          isLogoFile(partner.logo_url) ? (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5">
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
              className="h-12 w-12 shrink-0 rounded-full object-cover"
              onError={() => setLogoFailed(true)}
            />
          )
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm font-semibold text-fg-faint">
            {initials(partner.name)}
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-fg-faint">{partner.name}</span>
          <span className="line-clamp-2 text-base font-bold text-accent">{partner.benefit}</span>
        </span>
      </Link>
    </li>
  )
}
