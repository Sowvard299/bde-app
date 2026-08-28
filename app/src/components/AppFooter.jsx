import { Link } from 'react-router-dom'

export default function AppFooter() {
  return (
    <footer className="mt-auto flex justify-center gap-4 pt-6 text-xs text-neutral-400">
      <Link to="/mentions-legales" className="hover:text-neutral-600">
        Mentions légales
      </Link>
      <Link to="/confidentialite" className="hover:text-neutral-600">
        Confidentialité
      </Link>
    </footer>
  )
}
