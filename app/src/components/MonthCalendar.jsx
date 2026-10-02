import { SERIES } from '../lib/series'

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MOIS_ANNEE = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

function grille(annee, mois) {
  // mois de 0 à 11
  const premier = new Date(annee, mois, 1)
  const decalage = (premier.getDay() + 6) % 7 // 0 = lundi
  const nbJours = new Date(annee, mois + 1, 0).getDate()

  const cases = []
  for (let i = 0; i < decalage; i++) cases.push(null)
  for (let jour = 1; jour <= nbJours; jour++) cases.push(jour)
  while (cases.length % 7 !== 0) cases.push(null)
  return cases
}

// Fond d'une case : la couleur de la série, ou des bandes verticales
// égales quand plusieurs séries tombent le même jour.
function fondSeries(series) {
  if (series.length === 1) return series[0].couleur
  const pas = 100 / series.length
  const bandes = series.map((s, i) => `${s.couleur} ${i * pas}% ${(i + 1) * pas}%`)
  return `linear-gradient(90deg, ${bandes.join(', ')})`
}

// Calendrier du mois, en grille à traits pleins. Les jours qui ont un
// événement prennent la couleur de leur série (Sport, Culture, Night,
// BDE), le jour choisi passe en bleu nuit. Légende sous la grille.
export default function MonthCalendar({ year, month, eventDays, selectedDay, todayKey, onSelectDay, onChangeMonth }) {
  const cases = grille(year, month)

  return (
    <div>
      <div className="flex items-center justify-between gap-3 pb-3">
        <button
          type="button"
          onClick={() => onChangeMonth(-1)}
          aria-label="Mois précédent"
          className="flex h-10 w-10 items-center justify-center border-2 border-ink text-lg transition hover:bg-accent-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ←
        </button>
        <span className="masthead text-3xl">{MOIS_ANNEE.format(new Date(year, month, 1))}</span>
        <button
          type="button"
          onClick={() => onChangeMonth(1)}
          aria-label="Mois suivant"
          className="flex h-10 w-10 items-center justify-center border-2 border-ink text-lg transition hover:bg-accent-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 border-l-2 border-t-2 border-ink">
        {JOURS.map((jour) => (
          <span
            key={jour}
            className="label border-b-2 border-r-2 border-ink bg-surface py-2 text-center text-[10px]"
          >
            {jour}
          </span>
        ))}

        {cases.map((jour, i) => {
          if (jour === null) {
            return <span key={i} className="aspect-square border-b-2 border-r-2 border-ink bg-surface/60" />
          }
          const cle = `${year}-${String(month + 1).padStart(2, '0')}-${String(jour).padStart(2, '0')}`
          const series = eventDays.get(cle)
          const aEvenement = Boolean(series)
          const choisi = cle === selectedDay
          const aujourdhui = cle === todayKey

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDay(aEvenement ? cle : null)}
              disabled={!aEvenement}
              aria-pressed={choisi}
              aria-label={aEvenement ? `${jour}, ${series.map((s) => s.label).join(', ')}` : String(jour)}
              style={aEvenement && !choisi ? { background: fondSeries(series) } : undefined}
              className={`relative flex aspect-square items-start justify-start border-b-2 border-r-2 border-ink p-1.5 text-left font-display text-lg leading-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent lg:p-2 lg:text-2xl ${
                choisi
                  ? 'bg-ink text-white'
                  : aEvenement
                    ? 'text-ink hover:!bg-ink hover:text-white'
                    : 'bg-white text-fg-subtle'
              }`}
            >
              {jour}
              {aEvenement && !choisi && series.includes(SERIES.bde) && (
                <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2 w-2 bg-ink lg:right-2 lg:top-2" />
              )}
              {aujourdhui && (
                <span className="label absolute bottom-1 left-1.5 text-[8.5px] text-accent lg:left-2">
                  Auj.
                </span>
              )}
            </button>
          )
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-label="Légende">
        {Object.values(SERIES).map((serie) => (
          <li key={serie.label} className="label flex items-center gap-2 text-[11px]">
            <span
              aria-hidden="true"
              className="relative h-4 w-4 border-2 border-ink"
              style={{ background: serie.couleur }}
            >
              {serie === SERIES.bde && <span className="absolute right-0.5 top-0.5 h-1 w-1 bg-ink" />}
            </span>
            {serie.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
