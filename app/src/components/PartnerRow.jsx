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

// Carte d'un partenaire dans la liste.
//
// L'avantage occupe sa propre ligne pleine largeur plutôt que d'être tassé
// à côté du logo : c'est l'information que l'étudiant cherche, elle a
// besoin de place. Elle est posée sur un fond légèrement plus clair, ce
// qui la fait ressortir sans avoir à la crier en orange saturé sur trois
// lignes comme dans la version précédente.
export default function PartnerRow({ partner }) {
  // Un logo peut pointer vers un hôte injoignable (quota, hors ligne, URL
  // périmée) : on retombe sur les initiales plutôt que sur l'icône d'image
  // cassée du navigateur.
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = partner.logo_url && !logoFailed
  const isPartenaire = partner.kind === 'partenaire'

  return (
    <li>
      <Link
        to={`/partenaires/${partner.id}`}
        className={`lift flex h-full flex-col gap-4 rounded-2xl border bg-surface p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          isPartenaire ? 'border-accent-gold/30' : 'border-line'
        }`}
      >
        <div className="flex items-center gap-4">
          {showLogo ? (
            <span
              className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${
                isLogoFile(partner.logo_url) ? 'bg-white p-2.5' : ''
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
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-muted font-display text-lg font-bold text-fg-faint">
              {initials(partner.name)}
            </span>
          )}

          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-lg font-semibold leading-tight text-fg">
              {partner.name}
            </span>
            {partner.partner_categories?.name && (
              <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                {partner.partner_categories.name}
              </span>
            )}
          </span>

          <span aria-hidden="true" className="shrink-0 text-lg text-fg-subtle">
            ›
          </span>
        </div>

        <span className="rounded-xl bg-surface-muted/70 px-4 py-3">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-accent-gold">
            Ton avantage
          </span>
          {/* Pas de `block` ici : line-clamp impose son propre display et la
              classe d'affichage l'écraserait, ce qui annulerait la coupure. */}
          <span className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-fg">
            {partner.benefit}
          </span>
        </span>
      </Link>
    </li>
  )
}
