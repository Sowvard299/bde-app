const ACTIVITIES = [
  {
    title: 'Team running',
    description: 'Run en groupe, challenges, courses organisées (Ekiden, Marathon de Paris)…',
  },
  {
    title: 'Soirées jeux',
    description: 'Jeux de société, FIFA…',
  },
  {
    title: 'Sorties culturelles',
    description: 'Théâtre, festivals, cinéma…',
  },
  {
    title: 'Soirées matchs',
    description: 'Matchs de basket, foot, rugby…',
  },
  {
    title: 'Escalade',
    description: 'Sessions grimpe entre étudiants, tous niveaux.',
  },
]

export default function MonthlyActivities() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {ACTIVITIES.map((activity) => (
        <div key={activity.title} className="rounded-xl bg-surface p-3">
          <p className="font-display text-sm font-semibold text-fg">{activity.title}</p>
          <p className="mt-0.5 text-xs text-fg-faint">{activity.description}</p>
        </div>
      ))}
    </div>
  )
}
