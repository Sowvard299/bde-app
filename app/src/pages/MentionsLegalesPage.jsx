import { Link } from 'react-router-dom'
import AddressLink from '../components/AddressLink'
import PageHeader from '../components/PageHeader'

const LIEN = 'underline decoration-2 underline-offset-4 transition hover:bg-accent-gold'

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-16 lg:px-10 lg:pb-24">
      <PageHeader title="Mentions légales" />

      <Section title="Éditeur du site">
        <p>
          Le site et l'application BDE IAE Paris Sorbonne sont édités par le Nouveau Bureau des
          Étudiants de l'Institut d'Administration des Entreprises de Paris (NBDE IAE Paris),
          association loi 1901 fondée en 2008.
        </p>
        <p>
          Siège social :{' '}
          <AddressLink adresse="11-15 rue Ponscarme, 75013 Paris" className={LIEN} />.
        </p>
        <p>Directrice de la publication : Emma Lagenèbre, Présidente.</p>
        <p>
          Contact :{' '}
          <a href="mailto:bde.iaeparis@gmail.com" className={LIEN}>
            bde.iaeparis@gmail.com
          </a>
        </p>
      </Section>

      <Section title="Hébergement">
        <p>
          Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis.{' '}
          <a href="https://www.cloudflare.com" target="_blank" rel="noreferrer" className={LIEN}>
            cloudflare.com
          </a>
        </p>
      </Section>

      <Section title="Propriété intellectuelle">
        <p>
          Les contenus de ce site (textes, visuels, logo) sont la propriété du BDE IAE Paris
          Sorbonne, sauf mention contraire. Toute reproduction sans autorisation est interdite.
        </p>
      </Section>

      <Section title="Données personnelles">
        <p>
          Le traitement des données personnelles est détaillé dans la{' '}
          <Link to="/confidentialite" className={LIEN}>
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
    <section className="grid gap-3 border-b-2 border-ink py-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14 lg:py-8">
      <h2 className="label pt-1 text-[12px]">{title}</h2>
      <div className="flex max-w-2xl flex-col gap-2 leading-relaxed text-fg-muted">{children}</div>
    </section>
  )
}
