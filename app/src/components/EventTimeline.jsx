import { getParisDateParts } from '../lib/formatDate'
import EventRow from './EventRow'

const MOIS_ANNEE = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

function parMois(evenements) {
  const groupes = []
  let courant = null

  for (const evenement of evenements) {
    const { year, month } = getParisDateParts(evenement.starts_at)
    const cle = `${year}-${month}`
    if (cle !== courant) {
      groupes.push({ cle, year, month, evenements: [] })
      courant = cle
    }
    groupes[groupes.length - 1].evenements.push(evenement)
  }

  return groupes
}

// L'agenda, mois par mois.
export default function EventTimeline({ events }) {
  return (
    <div className="flex flex-col gap-12">
      {parMois(events).map((groupe) => (
        <section key={groupe.cle}>
          <div className="flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
            <h2 className="masthead text-4xl lg:text-5xl">
              {MOIS_ANNEE.format(new Date(groupe.year, groupe.month - 1, 1))}
            </h2>
            <p className="label pb-1 text-fg-subtle">
              {groupe.evenements.length} {groupe.evenements.length > 1 ? 'dates' : 'date'}
            </p>
          </div>
          <ol>
            {groupe.evenements.map((evenement) => (
              <EventRow key={evenement.id} event={evenement} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
