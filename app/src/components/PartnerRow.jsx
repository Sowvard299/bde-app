import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isLogoFile } from '../lib/media'
import Reveal from './Reveal'

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

// Carte d'un partenaire dans la liste : le logo en tête, le nom, puis
// l'avantage sur toute la largeur, parce que c'est l'information que
// l'étudiant cherche. `delay` place la carte dans l'apparition en cascade
// de la grille.
export default function PartnerRow({ partner, delay = 0 }) {
  // Un logo peut pointer vers un hôte injoignable (quota, hors ligne, URL
  // périmée) : on retombe sur les initiales plutôt que sur l'icône d'image
  // cassée du navigateur.
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = partner.logo_url && !logoFailed
  const logo = showLogo && isLogoFile(partner.logo_url)

  return (
    <Reveal as="li" delay={delay} className="h-full">
      <Link
        to={`/partenaires/${partner.id}`}
        className="lift group flex h-full flex-col border-2 border-ink bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="flex items-center gap-4 border-b-2 border-ink p-4">
          <span
            className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border-2 border-ink ${
              logo ? 'bg-white p-2' : 'bg-surface'
            }`}
          >
            {showLogo ? (
              <img
                src={partner.logo_url}
                alt=""
                loading="lazy"
                className={`h-full w-full ${logo ? 'object-contain' : 'object-cover'}`}
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="masthead text-2xl">{initials(partner.name)}</span>
            )}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block font-display text-2xl uppercase leading-[0.92]">{partner.name}</span>
            {partner.partner_categories?.name && (
              <span className="label mt-1.5 block text-fg-subtle">{partner.partner_categories.name}</span>
            )}
          </span>

          <span aria-hidden="true" className="shrink-0 text-xl transition group-hover:translate-x-1">
            →
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4 transition group-hover:bg-accent-gold">
          <span className="label text-fg-subtle group-hover:text-ink">Avantage</span>
          {/* Pas de `block` ici : line-clamp impose son propre display et la
              classe d'affichage l'écraserait, ce qui annulerait la coupure. */}
          <span className="line-clamp-2 font-semibold leading-snug">{partner.benefit}</span>
        </div>
      </Link>
    </Reveal>
  )
}
