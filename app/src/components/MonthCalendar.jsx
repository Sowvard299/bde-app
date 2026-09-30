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

// Calendrier du mois, en grille à traits pleins. Les jours qui ont un
// événement sont en doré, le jour choisi en bleu nuit.
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
          const aEvenement = eventDays.has(cle)
          const choisi = cle === selectedDay
          const aujourdhui = cle === todayKey

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDay(aEvenement ? cle : null)}
              disabled={!aEvenement}
              aria-pressed={choisi}
              aria-label={aEvenement ? `${jour}, événement ce jour` : String(jour)}
              className={`relative flex aspect-square items-start justify-start border-b-2 border-r-2 border-ink p-1.5 text-left font-display text-lg leading-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent lg:p-2 lg:text-2xl ${
                choisi
                  ? 'bg-ink text-white'
                  : aEvenement
                    ? 'bg-accent-gold text-ink hover:bg-ink hover:text-white'
                    : 'bg-white text-fg-subtle'
              }`}
            >
              {jour}
              {aujourdhui && (
                <span className="label absolute bottom-1 left-1.5 text-[8.5px] text-accent lg:left-2">
                  Auj.
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
