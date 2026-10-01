import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import AddressLink from '../components/AddressLink'
import { ASSOCIATION } from '../lib/seo'

// Page « Le BDE ».
//
// Elle dit qui publie le site : un moteur de recherche comme un moteur de
// réponse cherche ce rattachement avant de citer une source, et les
// mentions légales, en noindex, ne suffisent pas.
//
// Tous les faits ci-dessous viennent des mentions légales. La composition
// du bureau, qui change chaque année, renvoie vers Instagram plutôt que
// d'être recopiée ici.

const LIEN = 'underline decoration-2 underline-offset-4 transition hover:bg-accent-gold'

function Bloc({ titre, children }) {
  return (
    <section className="grid gap-4 border-b-2 border-ink py-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14 lg:py-12">
      <h2 className="masthead text-3xl lg:text-4xl">{titre}</h2>
      <div className="flex max-w-2xl flex-col gap-4 text-[17px] leading-relaxed text-fg-muted">{children}</div>
    </section>
  )
}

const ACTIVITES = [
  {
    titre: 'Soirées',
    texte: "Le week-end d'intégration en septembre, puis les Sorbonne Nights et les soirées de promo pendant l'année.",
    to: '/evenements',
  },
  {
    titre: 'Sport',
    texte: "Le club running part régulièrement de l'IAE. Des séances d'escalade sont organisées à Arkose Chevaleret.",
  },
  {
    titre: 'Culture',
    texte: 'Théâtre, concerts, expositions : des sorties à tarif réduit, souvent en groupe.',
  },
  {
    titre: 'Partenariats',
    texte: "Des réductions négociées chez des commerçants autour de l'école et dans Paris.",
    to: '/partenaires',
  },
]

export default function AProposPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-16 lg:px-10 lg:pb-24">
      <PageHeader
        title="Le BDE"
        intro="Le bureau des étudiants de l'IAE Paris-Sorbonne Business School."
      />

      <Bloc titre="L'association">
        <p>
          Le {ASSOCIATION.nomLegal} ({ASSOCIATION.sigle}) est l'association étudiante de l'
          {ASSOCIATION.ecole}. Association loi 1901 fondée en {ASSOCIATION.fondation}, elle a son
          siège au{' '}
          <AddressLink
            adresse={`${ASSOCIATION.adresse}, ${ASSOCIATION.codePostal} ${ASSOCIATION.ville}`}
            className={LIEN}
          />
          .
        </p>
        <p>
          Elle organise la vie étudiante de l'école et négocie des avantages auprès de commerçants
          pour les étudiants.
        </p>
      </Bloc>

      <section className="border-b-2 border-ink py-8 lg:py-12">
        <h2 className="masthead text-3xl lg:text-4xl">Activités</h2>
        <ul className="mt-6 grid border-l-2 border-t-2 border-ink sm:grid-cols-2 lg:grid-cols-4">
          {ACTIVITES.map((activite, index) => (
            <li key={activite.titre} className="flex flex-col border-b-2 border-r-2 border-ink p-5">
              <span className="label text-fg-subtle">{String(index + 1).padStart(2, '0')}</span>
              <p className="mt-3 font-display text-2xl uppercase leading-none">{activite.titre}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{activite.texte}</p>
              {activite.to && (
                <Link to={activite.to} className="label mt-4 self-start px-1 py-1 transition hover:bg-accent-gold">
                  Voir <span aria-hidden="true">→</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      <Bloc titre="Le bureau">
        <p>
          L'équipe change à chaque élection. Elle est présentée sur le compte de l'IAE Paris Sorbonne.
        </p>
        <a href={ASSOCIATION.membres} target="_blank" rel="noreferrer" className="btn-ghost self-start">
          Voir les membres du bureau <span aria-hidden="true">↗</span>
        </a>
      </Bloc>

      <Bloc titre="Contact">
        <p>Questions, propositions de partenariat, presse :</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={`mailto:${ASSOCIATION.email}`} className="btn normal-case tracking-normal">
            {ASSOCIATION.email}
          </a>
          <a href={ASSOCIATION.instagram} target="_blank" rel="noreferrer" className="btn-ghost">
            Instagram
          </a>
        </div>
      </Bloc>

      <Bloc titre="Commerçants">
        <p>
          Bar, restaurant, salle de sport ou lieu culturel près de l'IAE : un partenariat avec le
          BDE rend votre offre visible auprès de l'ensemble des étudiants, sur ce site et sur les
          réseaux de l'association. Écrivez à{' '}
          <a href={`mailto:${ASSOCIATION.email}`} className={LIEN}>
            {ASSOCIATION.email}
          </a>
          .
        </p>
      </Bloc>
    </main>
  )
}
