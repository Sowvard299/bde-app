import { Link } from 'react-router-dom'

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-6 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-3xl">
      <div>
        <Link to="/evenements" className="text-sm font-medium text-accent">
          ‹ Retour
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Mentions légales</h1>
      </div>

      <Section title="Éditeur du site">
        <p>
          Le site et l'application BDE IAE Paris Sorbonne sont édités par le Nouveau Bureau des
          Étudiants de l'Institut d'Administration des Entreprises de Paris (NBDE IAE Paris),
          association loi 1901 fondée en 2008.
        </p>
        <p>Siège social : 11-15 rue Ponscarme, 75013 Paris.</p>
        <p>Directrice de la publication : Emma Lagenèbre, Présidente.</p>
        <p>
          Contact :{' '}
          <a href="mailto:bde.iaeparis@gmail.com" className="text-accent underline">
            bde.iaeparis@gmail.com
          </a>
        </p>
      </Section>

      <Section title="Hébergement">
        <p>Le site est hébergé par :</p>
        <p>
          Netlify, Inc. — 44 Montgomery Street, Suite 300, San Francisco, CA 94104, États-Unis —{' '}
          <a
            href="https://www.netlify.com"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline"
          >
            netlify.com
          </a>
        </p>
      </Section>

      <Section title="Propriété intellectuelle">
        <p>
          L'ensemble des contenus présents sur cette application (textes, visuels, logo) est la
          propriété du BDE IAE Paris Sorbonne, sauf mention contraire. Toute reproduction sans
          autorisation est interdite.
        </p>
      </Section>

      <Section title="Données personnelles">
        <p>
          Le traitement des données personnelles est détaillé dans notre{' '}
          <Link to="/confidentialite" className="text-accent underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </Section>
    </main>
  )
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <div className="flex flex-col gap-1 text-neutral-700">{children}</div>
    </div>
  )
}
