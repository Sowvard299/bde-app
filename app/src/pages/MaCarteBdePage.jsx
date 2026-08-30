import { useState } from 'react'
import logoWhite from '../assets/logo-mark-white.png'
import PartenairesContent from '../components/PartenairesContent'
import ViewToggle from '../components/ViewToggle'
import AppFooter from '../components/AppFooter'

const HELLOASSO_URL =
  'https://www.helloasso.com/associations/nouveau-bureau-des-etudiants-de-l-institut-d-administration-des-entreprises-de-paris/evenements/carte-partenariats-2026-2027'
const CARD_PRICE = '5 €'

const AVANTAGES = [
  "Accès aux soirées Sorbonne Night, au WEI et au Gala",
  "Réductions chez tous les partenaires du BDE",
  "Tarifs réduits sur les événements payants de l'année",
]

export default function MaCarteBdePage() {
  const [tab, setTab] = useState('carte')

  return (
    <main className="mx-auto flex min-h-svh max-w-[480px] flex-col gap-6 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-6xl lg:px-10 lg:pb-16 lg:pt-12">
      <h1 className="font-display text-2xl font-semibold text-fg lg:text-3xl">
        {tab === 'carte' ? 'Ma carte BDE' : 'Partenaires'}
      </h1>

      <ViewToggle
        options={[
          { value: 'carte', label: 'Ma carte' },
          { value: 'partenaires', label: 'Partenaires' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'carte' ? (
        <>
          <div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl bg-ink p-6 text-white lg:max-w-xl">
            <img
              src={logoWhite}
              alt=""
              className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 opacity-20"
            />
            <span className="font-display text-lg font-semibold">Carte BDE 2026-2027</span>
            <span className="text-3xl font-bold text-accent">{CARD_PRICE}</span>
          </div>

          <div className="lg:max-w-xl">
            <h2 className="mb-2 font-display text-lg font-semibold text-fg">Ce que ça te donne</h2>
            <ul className="flex flex-col gap-2">
              {AVANTAGES.map((avantage) => (
                <li key={avantage} className="flex gap-2 text-fg-muted">
                  <span className="text-accent">•</span>
                  {avantage}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={HELLOASSO_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-4 py-4 text-center text-base font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:max-w-xl"
          >
            Prendre ma carte sur HelloAsso
          </a>

          <p className="text-sm text-fg-faint lg:max-w-xl">
            Sur HelloAsso, une contribution volontaire à l'association sera proposée au moment du
            paiement — elle n'est pas obligatoire, tu peux la mettre à 0 €.
          </p>
        </>
      ) : (
        <PartenairesContent />
      )}

      <AppFooter />
    </main>
  )
}
