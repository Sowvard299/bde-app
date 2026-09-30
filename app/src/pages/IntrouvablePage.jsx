import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const PISTES = [
  { to: '/evenements', libelle: 'Agenda' },
  { to: '/partenaires', libelle: 'Partenaires' },
  { to: '/bars', libelle: 'Bars' },
  { to: '/accueil', libelle: 'Accueil' },
]

// Adresse inconnue. Le Worker renvoie un vrai code 404 avec cette page :
// sans elle, Google enregistrait des pages vides comme valides (« soft
// 404 »).
export default function IntrouvablePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-16 lg:px-10 lg:pb-24">
      <PageHeader
        title="Erreur 404"
        intro="Cette page n'existe pas. Le lien est peut-être périmé, ou l'événement a été retiré."
      />

      <ul className="mt-8 border-t-2 border-ink">
        {PISTES.map((piste) => (
          <li key={piste.to} className="border-b-2 border-ink">
            <Link
              to={piste.to}
              className="group flex items-center justify-between px-1 py-4 transition hover:bg-accent-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent lg:px-3"
            >
              <span className="masthead text-3xl lg:text-5xl">{piste.libelle}</span>
              <span aria-hidden="true" className="text-2xl transition group-hover:translate-x-1">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
