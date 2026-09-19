import { Link } from 'react-router-dom'
import AppFooter from '../components/AppFooter'
import PageHeader from '../components/PageHeader'
import { ASSOCIATION } from '../lib/seo'

// Page « Qui sommes-nous ».
//
// Elle existe pour une raison simple : jusqu'ici, rien sur le site ne
// disait qui le publie. Un moteur de recherche comme un moteur de réponse
// cherche ce rattachement avant de citer une source, et le seul endroit
// qui portait ces informations était les mentions légales — une page en
// noindex, écrite pour le juriste et pas pour l'étudiant.
//
// Tous les faits ci-dessous viennent des mentions légales. Rien n'est
// inventé : ce qui n'y figure pas (composition du bureau, pôles) n'est
// pas écrit ici.

const CHIFFRES = [
  { valeur: '2008', libelle: 'Année de création' },
  { valeur: '193', libelle: 'Bars référencés dans Paris' },
  { valeur: '10', libelle: 'Partenaires à tarif étudiant' },
]

export default function AProposPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col gap-6 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-3xl lg:px-10 lg:pb-16 lg:pt-12">
      <PageHeader
        eyebrow="L'association"
        title="Qui sommes-nous"
        subtitle="Le bureau des étudiants de l'IAE Paris-Sorbonne, et ce qu'on fait de nos journées."
      />

      <section className="flex flex-col gap-3 text-fg-muted">
        <p>
          Le <strong className="text-fg">{ASSOCIATION.nomLegal}</strong> ({ASSOCIATION.sigle}) est
          l'association étudiante de l'{ASSOCIATION.ecole}. C'est une association loi 1901, fondée
          en {ASSOCIATION.fondation}, dont le siège se trouve au {ASSOCIATION.adresse},{' '}
          {ASSOCIATION.codePostal} {ASSOCIATION.ville}.
        </p>
        <p>
          On organise la vie étudiante de l'école : les soirées, le week-end d'intégration, les
          sorties culturelles, le club running, l'escalade, et les partenariats qui permettent aux
          étudiants de payer moins cher là où ils sortent déjà.
        </p>
      </section>

      <dl className="grid grid-cols-3 gap-3">
        {CHIFFRES.map((chiffre) => (
          <div
            key={chiffre.libelle}
            className="rounded-2xl border border-line bg-surface px-3 py-4 text-center"
          >
            <dt className="font-display text-2xl font-semibold text-accent-gold">
              {chiffre.valeur}
            </dt>
            <dd className="mt-1 text-[11px] leading-tight text-fg-faint">{chiffre.libelle}</dd>
          </div>
        ))}
      </dl>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-fg">Ce qu'on organise</h2>
        <ul className="flex flex-col gap-2 text-fg-muted">
          <li>
            <strong className="text-fg">Les soirées et le WEI.</strong> Le week-end d'intégration en
            début d'année, puis les Sorbonne Nights et les soirées de promo tout au long de
            l'année. Les dates sont sur la page{' '}
            <Link to="/evenements" className="text-accent underline underline-offset-2">
              événements
            </Link>
            .
          </li>
          <li>
            <strong className="text-fg">Le sport.</strong> Le club running se retrouve
            régulièrement au départ de l'IAE, et on organise des sorties escalade.
          </li>
          <li>
            <strong className="text-fg">Les partenariats.</strong> On négocie des réductions chez
            des commerçants autour de l'école et dans Paris. La carte étudiante suffit —{' '}
            <Link to="/partenaires" className="text-accent underline underline-offset-2">
              la liste est ici
            </Link>
            .
          </li>
          <li>
            <strong className="text-fg">La carte des bars.</strong> On a compilé{' '}
            <Link to="/bars" className="text-accent underline underline-offset-2">
              193 adresses dans Paris
            </Link>{' '}
            : les moins chères de la ville et celles qui valent le détour pour ce qu'on y fait.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-fg">Nous joindre</h2>
        <div className="flex flex-col gap-2 text-fg-muted">
          <p>
            Pour une question, une proposition de partenariat ou un partenariat presse, écris-nous :
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${ASSOCIATION.email}`}
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {ASSOCIATION.email}
            </a>
            <a
              href={ASSOCIATION.instagram}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-fg-muted transition hover:border-fg-subtle hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-xl font-semibold text-fg">Aux commerçants</h2>
        <p className="text-fg-muted">
          Vous tenez un bar, un restaurant, une salle de sport ou un lieu culturel près de
          l'IAE&nbsp;? Un partenariat avec le BDE vous donne accès à toute la promo, et votre offre
          apparaît sur cette application ainsi que sur nos réseaux. Écrivez à{' '}
          <a
            href={`mailto:${ASSOCIATION.email}`}
            className="text-accent underline underline-offset-2"
          >
            {ASSOCIATION.email}
          </a>
          .
        </p>
      </section>

      <AppFooter />
    </main>
  )
}
