import { Link, NavLink } from 'react-router-dom'
import logoWhite from '../assets/logo-mark-white.png'

const TABS = [
  { to: '/accueil', label: 'Accueil' },
  { to: '/evenements', label: 'Événements' },
  { to: '/partenaires', label: 'Partenaires' },
]

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-8 border-r border-line px-6 py-8 lg:flex">
      <Link
        to="/accueil"
        className="flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <img src={logoWhite} alt="" className="h-8 w-8" />
        <span className="font-display text-sm font-semibold leading-tight text-fg">
          BDE IAE
          <br />
          Paris Sorbonne
        </span>
      </Link>

      <nav aria-label="Navigation principale" className="flex flex-col gap-1">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive ? 'bg-surface text-accent' : 'text-fg-faint hover:bg-surface hover:text-fg'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 text-xs text-fg-subtle">
        <NavLink to="/mentions-legales" className="hover:text-fg-faint">
          Mentions légales
        </NavLink>
        <NavLink to="/confidentialite" className="hover:text-fg-faint">
          Confidentialité
        </NavLink>
      </div>
    </aside>
  )
}
