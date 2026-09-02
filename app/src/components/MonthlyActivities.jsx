import { Link } from 'react-router-dom'
import matchsPhoto from '../assets/activities/matchs.jpg'

const BASE =
  'https://qsaqxynxiwcbvxfndweb.supabase.co/storage/v1/object/public/event-images/'

const ACTIVITIES = [
  {
    title: 'Sorbonne Night',
    description: 'La soirée mensuelle du BDE, tous les mois.',
    photo: BASE + 'sorbonne%20night%20(2).jpeg',
  },
  {
    title: 'Sorbonne Game',
    description: 'Jeux de société, FIFA…',
    photo: BASE + 'sorbonne%20game.png',
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
            className="relative aspect-[4/5] overflow-hidden rounded-xl"
          >
            <img
              src={activity.photo}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="font-display text-sm font-bold uppercase leading-tight text-white">
                {activity.title}
              </p>
              <p className="mt-0.5 text-xs text-white/75">{activity.description}</p>
            </div>
          </Tag>
        )
      })}
    </div>
  )
}
