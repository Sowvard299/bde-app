import { NavLink } from 'react-router-dom'
import { CalendarIcon, GlassIcon, HomeIcon, TagIcon } from './NavIcons'

const TABS = [
  { to: '/accueil', label: 'Accueil', Icon: HomeIcon },
  { to: '/evenements', label: 'Événements', Icon: CalendarIcon },
  { to: '/partenaires', label: 'Partenaires', Icon: TagIcon },
  { to: '/bars', label: 'Bars', Icon: GlassIcon },
]

// Barre d'onglets du téléphone. L'onglet actif est inversé (bleu nuit
// plein, texte blanc) : on voit où l'on est sans lire la couleur d'un
// petit trait.
export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Navigation principale"
    >
      <ul className="mx-auto grid max-w-[560px] grid-cols-4">
        {TABS.map((tab) => (
          <li key={tab.to} className="border-r-2 border-ink last:border-r-0">
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent ${
                  isActive ? 'bg-ink text-white' : 'text-ink'
                }`
              }
            >
              <tab.Icon size={20} />
              <span className="label text-[9.5px]">{tab.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
