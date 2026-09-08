import { NavLink } from 'react-router-dom'
import { CalendarIcon, HomeIcon, TagIcon } from './NavIcons'

const TABS = [
  { to: '/accueil', label: 'Accueil', Icon: HomeIcon },
  { to: '/evenements', label: 'Événements', Icon: CalendarIcon },
  { to: '/partenaires', label: 'Partenaires', Icon: TagIcon },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-canvas/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Navigation principale"
    >
      <ul className="mx-auto flex max-w-[480px]">
        {TABS.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                  isActive ? 'text-accent' : 'text-fg-faint'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Trait court au-dessus de l'onglet actif : repère plus
                      lisible d'un coup d'œil que la seule couleur du texte. */}
                  <span
                    className={`absolute top-0 h-0.5 w-8 rounded-full transition-opacity ${
                      isActive ? 'bg-accent opacity-100' : 'opacity-0'
                    }`}
                  />
                  <tab.Icon />
                  {tab.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
