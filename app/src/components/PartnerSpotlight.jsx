import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isLogoFile } from '../lib/media'
import Reveal from './Reveal'
import { tailleMasthead } from '../lib/masthead'

function initiales(nom) {
  return nom
    .split(' ')
    .slice(0, 2)
    .map((mot) => mot[0])
    .join('')
    .toUpperCase()
}

// Le partenaire mis en avant en tête de la page Partenaires : un grand
// bloc bleu nuit, le nom en très grand et chaque offre sur sa ligne. Tout
// vient de la base, donc si l'offre change dans Supabase, la vitrine
// change avec elle.
export default function PartnerSpotlight({ partner }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = partner.logo_url && !logoFailed
  const logo = showLogo && isLogoFile(partner.logo_url)

  // L'avantage réunit parfois plusieurs offres autour d'un « + ». En
  // vitrine, chacune gagne sa ligne.
  const offres = partner.benefit
    .split(' + ')
    .map((offre) => offre.trim())
    .filter(Boolean)

  return (
    <Reveal>
      <Link
        to={`/partenaires/${partner.id}`}
        className="group relative block border-2 border-ink bg-ink text-white shadow-[6px_6px_0_var(--color-accent-gold)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_var(--color-accent-gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span
          className="tag sticker absolute -top-3 right-4 z-10 lg:right-8"
          style={{ '--tag-bg': 'var(--color-accent-gold)' }}
        >
          À la une
        </span>

        <div className="grid gap-6 p-5 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-10 lg:p-10">
          <span
            className={`flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden border-2 border-white lg:h-44 lg:w-44 ${
              logo ? 'bg-white p-4' : 'bg-white/10'
            }`}
          >
            {showLogo ? (
              <img
                src={partner.logo_url}
                alt=""
                className={`h-full w-full ${logo ? 'object-contain' : 'object-cover'}`}
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="masthead text-4xl">{initiales(partner.name)}</span>
            )}
          </span>

          <div className="@container min-w-0">
            {partner.partner_categories && (
              <p className="label text-accent-gold">{partner.partner_categories.name}</p>
            )}
            <h2 className="masthead mt-2" style={{ fontSize: tailleMasthead(partner.name, { max: '6.5rem' }) }}>
              {partner.name}
            </h2>

            <ul className="mt-6 border-t border-white/30">
              {offres.map((offre) => (
                <li
                  key={offre}
                  className="flex items-start gap-3 border-b border-white/30 py-3 text-lg font-semibold leading-snug lg:text-2xl"
                >
                  <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 bg-accent-gold lg:mt-3" />
                  {offre}
                </li>
              ))}
            </ul>

            <span className="label mt-6 inline-flex items-center gap-2 border-2 border-white px-4 py-3 text-[12px] transition group-hover:bg-white group-hover:text-ink">
              Voir l'offre
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}
