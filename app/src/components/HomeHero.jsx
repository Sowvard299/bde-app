import { Link } from 'react-router-dom'
import Countdown from './Countdown'
import { formatEventDateTime } from '../lib/formatDate'
import logoWhite from '../assets/logo-mark-white.png'
import weicupLogo from '../assets/weicup-logo.png'
import weicupPalm from '../assets/weicup-palm.png'

// Couleurs prises directement dans le logo WEICUP (rouge et jaune de
// l'édition Latino), pour que le bloc compte à rebours porte la charte de
// l'événement plutôt que la charte générique du site quand il s'agit du WEI.
const WEICUP_COUNTDOWN_CLASSES = {
  cell: 'flex min-w-[52px] flex-col items-center rounded-xl bg-black/20 px-2 py-2',
  value: 'font-display text-2xl font-bold leading-none tabular-nums text-[#F9B513]',
  label: 'mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/70',
}

// Affiche d'ouverture du site. Trois couches empilées : les halos de
// couleur tout au fond, le phénix en filigrane par-dessus, le texte
// au-dessus de tout. Le grain unifie l'ensemble et évite l'aspect
// « dégradé numérique » un peu plat.
//
// `nextEvent` est facultatif : sans lui (base injoignable, plus aucun
// événement à venir) le bloc compte à rebours disparaît simplement et
// l'affiche reste correcte.
export default function HomeHero({ nextEvent, isWeicup = false }) {
  return (
    <section className="grain relative -mx-4 overflow-hidden px-4 pb-8 pt-10 sm:rounded-3xl lg:-mx-0 lg:rounded-3xl lg:px-10 lg:pb-12 lg:pt-14">
      <div className="absolute inset-0 -z-10 bg-ink" />

      {/* Deux halos, pas trois : la version précédente ajoutait un rose qui
          n'appartient à aucune autre partie du site et qui, combiné à
          l'orange et au doré déjà là, faisait criard dès l'ouverture de
          l'app. Orange et doré suffisent à donner du relief. */}
      <div
        className="aurora aurora-slow -left-24 -top-32 h-96 w-96"
        style={{ background: 'radial-gradient(circle, #ff4214 0%, transparent 70%)' }}
      />
      <div
        className="aurora aurora-slower -right-24 -bottom-24 h-96 w-96"
        style={{ background: 'radial-gradient(circle, #ffc300 0%, transparent 70%)' }}
      />

      <img
        src={logoWhite}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-10 w-72 opacity-[0.07] lg:-right-10 lg:w-[26rem]"
      />

      <div className="relative">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent-gold">
          Bureau des étudiants
        </p>

        <h1 className="mt-3 font-display font-semibold leading-[0.95] text-white">
          <span className="block text-xl text-white/70 lg:text-2xl">Bienvenue sur le site du</span>
          <span className="text-gradient mt-1 block text-4xl uppercase sm:text-5xl lg:text-7xl">
            BDE IAE
            <br />
            Paris Sorbonne
          </span>
        </h1>

        <p className="mt-4 max-w-md text-sm text-white/70 lg:text-base">
          Soirées, sport, sorties et réductions étudiantes. Tout ce que fait le BDE, réuni ici.
        </p>

        {nextEvent && isWeicup && (
          // Bloc à la charte du WEI : rouge et jaune de l'affiche, palmier
          // en filigrane, plutôt que le bloc générique navy du reste du
          // site — c'est LE rendez-vous de l'année, il a sa propre identité.
          <Link
            to={`/evenements/${nextEvent.id}`}
            className="group mt-7 block overflow-hidden rounded-2xl border border-[#F9B513]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9B513] lg:max-w-lg"
            style={{ background: 'linear-gradient(150deg, #C21414 0%, #8E0F0F 100%)' }}
          >
            <div className="relative flex items-center gap-4 p-4">
              <img
                src={weicupPalm}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -top-8 w-32 rotate-6 opacity-30"
              />
              <img
                src={weicupLogo}
                alt="WEICUP"
                className="relative h-16 w-16 shrink-0 rounded-xl object-cover shadow-lg"
              />
              <div className="relative min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F9B513]">
                  Le rendez-vous de l'année
                </p>
                <p className="mt-0.5 truncate font-display text-xl font-semibold text-white transition group-hover:text-[#F9B513] lg:text-2xl">
                  {nextEvent.title}
                </p>
                <p className="mt-0.5 text-sm capitalize text-white/70">
                  {formatEventDateTime(nextEvent.starts_at)}
                </p>
              </div>
            </div>
            <div className="relative px-4 pb-4">
              <Countdown target={nextEvent.starts_at} classes={WEICUP_COUNTDOWN_CLASSES} />
            </div>
          </Link>
        )}

        {nextEvent && !isWeicup && (
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:max-w-lg">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-gold">
              Prochain événement
            </p>
            <Link
              to={`/evenements/${nextEvent.id}`}
              className="mt-1 block font-display text-xl font-semibold text-white transition hover:text-accent-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold lg:text-2xl"
            >
              {nextEvent.title}
            </Link>
            <p className="mt-0.5 text-sm capitalize text-white/60">
              {formatEventDateTime(nextEvent.starts_at)}
            </p>
            <div className="mt-3">
              <Countdown target={nextEvent.starts_at} />
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-2">
          <Link
            to="/evenements"
            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Voir les événements
          </Link>
          <Link
            to="/partenaires"
            className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Les bons plans
          </Link>
        </div>
      </div>

    </section>
  )
}
