import { Link } from 'react-router-dom'

export default function ConfidentialitePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-6 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-2xl lg:px-10 lg:pb-16 lg:pt-12">
      <div>
        <Link to="/evenements" className="text-sm font-medium text-accent">
          ‹ Retour
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-fg lg:text-3xl">
          Politique de confidentialité
        </h1>
      </div>

      <p className="text-fg-muted">
        Cette page explique quelles données sont utilisées par l'application BDE IAE Paris
        Sorbonne, et comment.
      </p>

      <Section title="Responsable du traitement">
        <p>
          NBDE IAE Paris, 11-15 rue Ponscarme, 75013 Paris —{' '}
          <a href="mailto:bde.iaeparis@gmail.com" className="text-accent underline">
            bde.iaeparis@gmail.com
          </a>
        </p>
      </Section>

      <Section title="Aucun compte, aucune connexion">
        <p>
          L'application ne demande ni compte ni connexion et ne collecte aucune donnée
          d'identification (nom, email) pour fonctionner. Les événements et partenaires affichés
          sont des contenus publics gérés par le BDE, pas des données personnelles.
        </p>
      </Section>

      <Section title="Notifications (si tu les actives)">
        <p>
          Si tu actives les notifications, on utilise le service OneSignal (OneSignal, Inc.,
          États-Unis) pour t'envoyer des alertes sur les nouveaux événements. Cela crée un
          identifiant technique lié à ton navigateur, sans nom ni email associé. Tu peux
          désactiver les notifications à tout moment depuis les réglages de notifications de ton
          téléphone (dans les réglages de l'app installée), ce qui supprime cet identifiant chez
          OneSignal.
        </p>
      </Section>

      <Section title="Stockage local">
        <p>
          L'application enregistre quelques préférences directement sur ton appareil (comme les
          bannières déjà vues), via le stockage local de ton navigateur. Ces informations restent
          sur ton appareil et ne sont jamais envoyées à un serveur.
        </p>
      </Section>

      <Section title="Carte BDE (HelloAsso)">
        <p>
          L'achat de la carte BDE se fait sur HelloAsso, un site indépendant. Les informations que
          tu fournis à ce moment-là (paiement, coordonnées) sont gérées par HelloAsso selon sa
          propre politique de confidentialité, pas par nous.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          L'application n'utilise pas de cookies de suivi publicitaire ni d'outils d'analyse
          tiers.
        </p>
      </Section>

      <Section title="Tes droits">
        <p>
          Conformément au RGPD, tu peux demander l'accès, la rectification ou la suppression des
          données te concernant en écrivant à{' '}
          <a href="mailto:bde.iaeparis@gmail.com" className="text-accent underline">
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
    <div className="flex flex-col gap-1">
      <h2 className="font-display text-lg font-semibold text-fg">{title}</h2>
      <div className="flex flex-col gap-1 text-fg-muted">{children}</div>
    </div>
  )
}
