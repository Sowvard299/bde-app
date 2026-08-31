import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/accueil', label: 'Accueil' },
  { to: '/evenements', label: 'Événements' },
  { to: '/partenaires', label: 'Partenaires' },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-canvas/95 backdrop-blur pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Navigation principale"
    >
      <ul className="mx-auto flex max-w-[480px]">
        {TABS.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                  isActive ? 'text-accent' : 'text-fg-faint'
                }`
              }
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
