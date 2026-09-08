import { Link } from 'react-router-dom'
import matchsPhoto from '../assets/activities/matchs.jpg'
import { R2_MEDIA_BASE } from '../lib/media'

const BASE = R2_MEDIA_BASE + 'activities/'

const ACTIVITIES = [
  {
    title: 'Sorbonne Night',
    description: 'La soirée mensuelle du BDE, tous les mois.',
    photo: BASE + 'sorbonne-night.jpeg',
  },
  {
    title: 'Sorbonne Game',
    description: 'Jeux de société, FIFA…',
    photo: BASE + 'sorbonne-game.png',
  },
  {
    title: 'Sorties culturelles',
    description: 'Théâtre, festivals, cinéma, musées…',
    photo: BASE + 'culture.jpeg',
  },
  {
    title: 'Team running',
    description: 'Run en groupe, challenges, courses organisées (Ekiden, Marathon de Paris)…',
    photo: BASE + 'running.jpeg',
  },
  {
    title: 'Sorbonne Climb',
    description: 'Sessions grimpe entre étudiants, tous niveaux.',
    photo: BASE + 'escalade.jpeg',
    to: '/partenaires/6b7d0bd5-779f-41df-9149-dc676674e486',
  },
  {
    title: 'Soirées matchs',
    description: 'Matchs de basket, foot, rugby…',
    photo: matchsPhoto,
  },
]

export default function MonthlyActivities() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {ACTIVITIES.map((activity) => {
        const Tag = activity.to ? Link : 'div'
        return (
          <Tag
            key={activity.title}
            {...(activity.to ? { to: activity.to } : {})}
            className="lift zoom-media group relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink ring-1 ring-white/10"
          >
            <img
              src={activity.photo}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              onError={(event) => {
                // Photo unreachable (offline, storage outage): drop it and let
                // the branded tile show through instead of a broken-image icon.
                event.currentTarget.style.display = 'none'
              }}
            />
            {/* Deux voiles superposés : un noir pour la lisibilité du texte,
                un orange très léger qui réchauffe la photo et raccroche la
                vignette à la charte. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
            <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="font-display text-sm font-bold uppercase leading-tight text-white">
                {activity.title}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-white/75">{activity.description}</p>
              {activity.to && (
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-accent-gold">
                  Découvrir →
                </span>
              )}
            </div>
          </Tag>
        )
      })}
    </div>
  )
}
