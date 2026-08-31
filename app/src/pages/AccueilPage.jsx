import { Link } from 'react-router-dom'
import AnnualMilestones from '../components/AnnualMilestones'
import MonthlyActivities from '../components/MonthlyActivities'
import AppFooter from '../components/AppFooter'
import logoWhite from '../assets/logo-mark-white.png'

export default function AccueilPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col gap-8 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-6xl lg:px-10 lg:pb-16 lg:pt-12">
      <h1 className="font-display text-2xl font-semibold text-fg lg:text-3xl">
        Bienvenue sur le site du BDE IAE Paris Sorbonne
      </h1>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold text-fg">L'année en un coup d'œil</h2>
        <AnnualMilestones />
      </section>

      <Link
        to="/partenaires"
        className="relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl bg-ink p-5 text-white transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <img
          src={logoWhite}
          alt=""
          className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 opacity-20"
        />
        <div>
          <p className="font-display text-lg font-semibold">Partenaires</p>
          <p className="text-sm text-white/70">Toutes les réductions près de toi</p>
        </div>
        <span className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold">
          Voir
        </span>
      </Link>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold text-fg">Chaque mois</h2>
        <MonthlyActivities />
      </section>

      <AppFooter />
    </main>
  )
}
