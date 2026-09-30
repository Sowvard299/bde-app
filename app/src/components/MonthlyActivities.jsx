import { Link } from 'react-router-dom'
import matchsPhoto from '../assets/activities/matchs.jpg'
import { R2_MEDIA_BASE } from '../lib/media'

const BASE = R2_MEDIA_BASE + 'activities/'

// Couleurs des séries de la charte (voir lib/series.js).
const NIGHT = 'var(--color-accent-pink)'
const SPORT = 'var(--color-accent-gold)'
const CULTURE = 'var(--color-accent)'

const ACTIVITES = [
  {
    titre: 'Sorbonne Night',
    serie: 'Night',
    couleur: NIGHT,
    texte: 'La soirée mensuelle du BDE.',
    photo: BASE + 'sorbonne-night.jpeg',
  },
  {
    titre: 'Sorbonne Game',
    serie: 'Night',
    couleur: NIGHT,
    texte: 'Jeux de société et tournois FIFA.',
    photo: BASE + 'sorbonne-game.png',
  },
  {
    titre: 'Sorties culturelles',
    serie: 'Culture',
    couleur: CULTURE,
    texte: 'Théâtre, festivals, cinéma et musées.',
    photo: BASE + 'culture.jpeg',
  },
  {
    titre: 'Sorbonne Running',
    serie: 'Sport',
    couleur: SPORT,
    texte: "Sorties en groupe et courses organisées, dont l'Ekiden et le Marathon de Paris.",
    photo: BASE + 'running.jpeg',
  },
  {
    titre: 'Sorbonne Climb',
    serie: 'Sport',
    couleur: SPORT,
    texte: "Sessions d'escalade entre étudiants, tous niveaux, à tarif partenaire.",
    photo: BASE + 'escalade.jpeg',
    to: '/partenaires/6b7d0bd5-779f-41df-9149-dc676674e486',
  },
  {
    titre: 'Soirées matchs',
    serie: 'Sport',
    couleur: SPORT,
    texte: 'Retransmissions de basket, de football et de rugby.',
    photo: matchsPhoto,
  },
]

export default function MonthlyActivities() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
      {ACTIVITES.map((activite) => {
        const Tag = activite.to ? Link : 'div'
        return (
          <li key={activite.titre}>
            <Tag
              {...(activite.to ? { to: activite.to } : {})}
              className={`group block ${activite.to ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent' : ''}`}
            >
              <div className="zoom-media relative aspect-[4/5] overflow-hidden border-2 border-ink bg-ink">
                <img
                  src={activite.photo}
                  alt=""
                  // Sous la ligne de flottaison : sans cet attribut, les six
                  // photos partaient dès l'ouverture de l'accueil.
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(event) => {
                    // Photo injoignable : on laisse voir le fond bleu nuit
                    // plutôt que l'icône d'image cassée.
                    event.currentTarget.style.display = 'none'
                  }}
                />
                <span className="tag absolute left-2 top-2" style={{ '--tag-bg': activite.couleur }}>
                  {activite.serie}
                </span>
              </div>
              <p className="mt-3 font-display text-2xl uppercase leading-[0.92] lg:text-3xl">
                {activite.titre}
                {activite.to && (
                  <span aria-hidden="true" className="ml-2 inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                )}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-fg-muted">{activite.texte}</p>
            </Tag>
          </li>
        )
      })}
    </ul>
  )
}
