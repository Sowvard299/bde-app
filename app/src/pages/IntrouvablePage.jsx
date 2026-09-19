import { Link } from 'react-router-dom'
import AppFooter from '../components/AppFooter'
import PageHeader from '../components/PageHeader'

const PISTES = [
  { to: '/evenements', libelle: 'Les événements' },
  { to: '/partenaires', libelle: 'Les partenaires' },
  { to: '/bars', libelle: 'Les bars de Paris' },
  { to: '/accueil', libelle: "Retour à l'accueil" },
]

// Adresse inconnue.
//
// Sans cette route, l'application n'affichait rien du tout : ni message,
// ni menu, une page blanche sous une barre de navigation. Et comme le
// serveur répondait 200 à n'importe quelle adresse, Google enregistrait
// ces pages vides comme des pages valides — ce qu'il appelle une « soft
// 404 » et signale comme une erreur. Le Worker renvoie maintenant un vrai
// code 404 avec cette page.
export default function IntrouvablePage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col gap-6 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-2xl lg:px-10 lg:pb-16 lg:pt-12">
      <PageHeader
        eyebrow="Erreur 404"
        title="Cette page n'existe pas"
        subtitle="Le lien est peut-être périmé, ou l'événement a été retiré."
      />

      <ul className="flex flex-col gap-2">
        {PISTES.map((piste) => (
          <li key={piste.to}>
            <Link
              to={piste.to}
              className="lift flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3.5 font-semibold text-fg transition hover:border-fg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {piste.libelle}
              <span aria-hidden="true" className="text-fg-subtle">
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <AppFooter />
    </main>
  )
}
