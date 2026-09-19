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
// inventé : la composition du bureau, qui change chaque année, renvoie
// vers Instagram plutôt que d'être recopiée ici.

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
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-fg">Le bureau</h2>
        <p className="text-fg-muted">
          L'équipe change à chaque élection : on la présente sur Instagram plutôt qu'ici, où elle
          serait périmée dès le bureau suivant.
        </p>
        <a
          href={ASSOCIATION.membres}
          target="_blank"
          rel="noreferrer"
          className="lift flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 font-semibold text-fg transition hover:border-fg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Découvrir les membres du bureau
          <span aria-hidden="true" className="text-fg-subtle">
            ›
          </span>
        </a>
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
