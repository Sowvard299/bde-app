import { Link, NavLink } from 'react-router-dom'
import { CalendarIcon, HomeIcon, TagIcon } from './NavIcons'
import logoWhite from '../assets/logo-mark-white.png'

const TABS = [
  { to: '/accueil', label: 'Accueil', Icon: HomeIcon },
  { to: '/evenements', label: 'Événements', Icon: CalendarIcon },
  { to: '/partenaires', label: 'Partenaires', Icon: TagIcon },
]

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-8 overflow-hidden border-r border-line px-6 py-8 lg:flex">
      {/* Même halo que l'affiche d'accueil, en beaucoup plus discret : la
          colonne reste un décor, elle ne doit pas concurrencer la page. */}
      <div
        className="aurora aurora-slower -left-16 -top-20 h-56 w-56 opacity-30"
        style={{ background: 'radial-gradient(circle, #ff4214 0%, transparent 70%)' }}
      />

      <Link
        to="/accueil"
        className="relative flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <img src={logoWhite} alt="" className="h-9 w-9" />
        <span className="font-display text-sm font-semibold leading-tight text-fg">
          BDE IAE
          <br />
          Paris Sorbonne
        </span>
      </Link>

      <nav aria-label="Navigation principale" className="relative flex flex-col gap-1">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive
                  ? 'bg-accent/10 text-accent ring-1 ring-accent/25'
                  : 'text-fg-faint hover:bg-surface hover:text-fg'
              }`
            }
          >
            <tab.Icon size={20} />
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="relative mt-auto flex flex-col gap-2 text-xs text-fg-subtle">
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
