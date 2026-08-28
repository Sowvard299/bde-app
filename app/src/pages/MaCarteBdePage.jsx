import logoWhite from '../assets/logo-mark-white.png'

// TODO: renseigner ces deux valeurs dès qu'elles sont connues.
const HELLOASSO_URL = null // ex: 'https://www.helloasso.com/associations/.../adhesions/...'
const CARD_PRICE = null // ex: '15 €'

const AVANTAGES = [
  "Accès aux soirées Sorbonne Night, au WEI et au Gala",
  "Réductions chez tous les partenaires du BDE",
  "Tarifs réduits sur les événements payants de l'année",
  "Accès aux concours et activités inter-IAE",
]

export default function MaCarteBdePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-6 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Ma carte BDE</h1>

      <div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl bg-ink p-6 text-white">
        <img
          src={logoWhite}
          alt=""
          className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 opacity-20"
        />
        <span className="font-display text-lg font-semibold">Carte BDE 2026-2027</span>
        <span className="text-3xl font-bold text-accent">
          {CARD_PRICE ?? 'Prix à venir'}
        </span>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg font-semibold text-ink">Ce que ça te donne</h2>
        <ul className="flex flex-col gap-2">
          {AVANTAGES.map((avantage) => (
            <li key={avantage} className="flex gap-2 text-neutral-700">
              <span className="text-accent">•</span>
              {avantage}
            </li>
          ))}
        </ul>
      </div>

      {HELLOASSO_URL ? (
        <a
          href={HELLOASSO_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-accent px-4 py-4 text-center text-base font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Prendre ma carte sur HelloAsso
        </a>
      ) : (
        <p
          aria-disabled="true"
          className="rounded-full bg-neutral-200 px-4 py-4 text-center text-base font-semibold text-neutral-500"
        >
          Lien HelloAsso à venir
        </p>
      )}

      <p className="text-sm text-neutral-500">
        Sur HelloAsso, une contribution volontaire à l'association sera proposée au moment du
        paiement — elle n'est pas obligatoire, tu peux la mettre à 0 €.
      </p>
    </main>
  )
}
