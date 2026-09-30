import PageHeader from '../components/PageHeader'

const LIEN = 'underline decoration-2 underline-offset-4 transition hover:bg-accent-gold'

export default function ConfidentialitePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-16 lg:px-10 lg:pb-24">
      <PageHeader
        title="Confidentialité"
        intro="Les données utilisées par le site et l'application BDE IAE Paris Sorbonne, et la façon dont elles sont traitées."
      />

      <Section title="Responsable du traitement">
        <p>
          NBDE IAE Paris, 11-15 rue Ponscarme, 75013 Paris.{' '}
          <a href="mailto:bde.iaeparis@gmail.com" className={LIEN}>
            bde.iaeparis@gmail.com
          </a>
        </p>
      </Section>

      <Section title="Aucun compte">
        <p>
          Le site ne demande ni compte ni connexion et ne collecte aucune donnée d'identification
          pour fonctionner. Les événements et partenaires affichés sont des contenus publics gérés
          par le BDE.
        </p>
      </Section>

      <Section title="Propositions de bars">
        <p>
          Le formulaire « Proposer un bar » transmet le nom et l'adresse du lieu, les notes et les
          photos jointes, ainsi que l'adresse email si elle est renseignée. L'email est facultatif
          et sert uniquement à prévenir de l'ajout. Ces informations sont stockées chez Supabase et
          consultées par le bureau du BDE.
        </p>
      </Section>

      <Section title="Notifications">
        <p>
          Lorsque les notifications sont activées, le service OneSignal (OneSignal, Inc.,
          États-Unis) est utilisé pour envoyer des alertes sur les nouveaux événements. Il crée un
          identifiant technique lié au navigateur, sans nom ni email associé. Désactiver les
          notifications dans les réglages du téléphone ou du navigateur supprime cet identifiant
          chez OneSignal.
        </p>
      </Section>

      <Section title="Stockage local">
        <p>
          Quelques préférences (bannières déjà vues, par exemple) sont enregistrées dans le
          stockage local du navigateur. Elles restent sur l'appareil et ne sont envoyées à aucun
          serveur.
        </p>
      </Section>

      <Section title="Cookies">
        <p>Le site n'utilise ni cookies publicitaires ni outils d'analyse tiers.</p>
      </Section>

      <Section title="Vos droits">
        <p>
          Conformément au RGPD, vous pouvez demander l'accès, la rectification ou la suppression
          des données vous concernant en écrivant à{' '}
          <a href="mailto:bde.iaeparis@gmail.com" className={LIEN}>
            bde.iaeparis@gmail.com
          </a>
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
