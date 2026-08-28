import { Link } from 'react-router-dom'

export default function AppFooter() {
  return (
    <footer className="mt-auto flex justify-center gap-4 pt-6 text-xs text-fg-subtle lg:hidden">
      <Link to="/mentions-legales" className="hover:text-fg-faint">
        Mentions légales
      </Link>
      <Link to="/confidentialite" className="hover:text-fg-faint">
        Confidentialité
      </Link>
    </footer>
  )
}
