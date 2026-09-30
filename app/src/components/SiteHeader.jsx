import { Link, NavLink } from 'react-router-dom'
import LogoMark from './LogoMark'

export const RUBRIQUES = [
  { to: '/evenements', label: 'Événements' },
  { to: '/partenaires', label: 'Partenaires' },
  { to: '/bars', label: 'Bars' },
  { to: '/a-propos', label: 'Le BDE' },
]

// En-tête du site, sur toutes les tailles d'écran : le logo à gauche, les
// rubriques à droite sur grand écran. Sur téléphone, la navigation est dans
// la barre du bas, plus facile à atteindre au pouce.
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5 lg:h-16 lg:px-10">
        <Link
          to="/accueil"
          className="flex items-center gap-2.5 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <LogoMark className="h-8 w-8" />
          <span className="label text-[11.5px] leading-[1.15]">
            BDE IAE Paris
            <br />
            Sorbonne
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {RUBRIQUES.map((rubrique) => (
              <li key={rubrique.to}>
                <NavLink
                  to={rubrique.to}
                  className={({ isActive }) =>
                    `label block px-3 py-2 text-[12px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                      isActive ? 'bg-ink text-white' : 'text-ink hover:bg-accent-gold'
                    }`
                  }
                >
                  {rubrique.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
