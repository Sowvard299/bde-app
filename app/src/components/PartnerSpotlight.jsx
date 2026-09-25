import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isLogoFile } from '../lib/media'
import Reveal from './Reveal'

function CocheIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function initiales(nom) {
  return nom
    .split(' ')
    .slice(0, 2)
    .map((mot) => mot[0])
    .join('')
    .toUpperCase()
}

// Le partenaire mis en avant en tête de la page Partenaires.
//
// C'est la même identité visuelle que l'en-tête d'une fiche partenaire
// (bloc encre, halo orange, grain) en plus grand, pour que la carte se lise
// comme « la fiche, en vitrine » et non comme un corps étranger dans la
// page. Tout ce qui s'affiche vient de la base : rien n'est écrit en dur
// ici, donc si l'offre change dans Supabase, la vitrine change avec elle.
export default function PartnerSpotlight({ partner }) {
  // Un logo peut pointer vers un hôte injoignable : on retombe sur les
  // initiales plutôt que sur l'icône d'image cassée.
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = partner.logo_url && !logoFailed

  // L'avantage réunit parfois plusieurs offres autour d'un « + »
  // (« Frais d'adhésion offerts + 29,99€/mois au lieu de 39,99€ »). En vitrine,
  // chacune gagne sa ligne : deux offres lues d'un coup d'œil valent mieux
  // qu'une phrase de trois lignes à déchiffrer.
  const offres = partner.benefit
    .split(' + ')
    .map((offre) => offre.trim())
    .filter(Boolean)

  return (
    <Reveal>
      <Link
        to={`/partenaires/${partner.id}`}
        className="group grain relative block overflow-hidden rounded-3xl bg-ink p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:p-10"
      >
        <div
          className="aurora aurora-slow -right-16 -top-24 h-72 w-72"
          style={{ background: 'radial-gradient(circle, #ff4214 0%, transparent 70%)' }}
        />
        <div
          className="aurora aurora-slower -bottom-28 -left-16 h-64 w-64 opacity-40"
          style={{ background: 'radial-gradient(circle, #ffc300 0%, transparent 70%)' }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
          {showLogo ? (
            <span
              className={`flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl shadow-xl shadow-black/40 lg:h-40 lg:w-40 ${
                isLogoFile(partner.logo_url) ? 'bg-white p-4' : ''
              }`}
            >
              <img
                src={partner.logo_url}
                alt=""
                className={`h-full w-full ${
                  isLogoFile(partner.logo_url) ? 'object-contain' : 'rounded-3xl object-cover'
                }`}
                onError={() => setLogoFailed(true)}
              />
            </span>
          ) : (
            <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-white/10 font-display text-3xl font-bold text-white/80 lg:h-40 lg:w-40">
              {initiales(partner.name)}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-accent-gold">
              <span className="h-px w-6 bg-accent-gold" />
              À la une
              {partner.partner_categories && (
                <span className="text-white/50">· {partner.partner_categories.name}</span>
              )}
            </p>

            <h2 className="mt-2 font-display text-4xl font-semibold leading-none text-white lg:text-6xl">
              {partner.name}
            </h2>

            <ul className="mt-5 flex flex-col gap-2.5">
              {offres.map((offre) => (
                <li
                  key={offre}
                  className="flex items-start gap-2.5 font-display text-xl font-semibold leading-snug text-white lg:text-2xl"
                >
                  <span className="mt-1 shrink-0 text-accent-gold">
                    <CocheIcon />
                  </span>
                  {offre}
                </li>
              ))}
            </ul>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition group-hover:opacity-90">
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
