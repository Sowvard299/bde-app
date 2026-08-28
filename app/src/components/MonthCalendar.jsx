const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTH_LABEL = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

function buildGrid(year, month) {
  // month is 0-indexed
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = (firstOfMonth.getDay() + 6) % 7 // 0 = Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)
  return cells
}

export default function MonthCalendar({ year, month, eventDays, selectedDay, todayKey, onSelectDay, onChangeMonth }) {
  const cells = buildGrid(year, month)

  return (
    <div>
      <div className="flex items-center justify-between px-1 pb-3">
        <button
          type="button"
          onClick={() => onChangeMonth(-1)}
          aria-label="Mois précédent"
          className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          ‹
        </button>
        <span className="font-display text-base font-semibold capitalize text-ink">
          {MONTH_LABEL.format(new Date(year, month, 1))}
        </span>
        <button
          type="button"
          onClick={() => onChangeMonth(1)}
          aria-label="Mois suivant"
          className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((day, i) => (
          <span key={i} className="text-xs font-medium text-neutral-400">
            {day}
          </span>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <span key={i} />
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasEvent = eventDays.has(key)
          const isSelected = key === selectedDay
          const isToday = key === todayKey

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDay(hasEvent ? key : null)}
              disabled={!hasEvent}
              className={`mx-auto flex h-9 w-9 flex-col items-center justify-center rounded-full text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                isSelected
                  ? 'bg-accent font-semibold text-white'
                  : isToday
                    ? 'font-semibold text-accent'
                    : hasEvent
                      ? 'font-medium text-ink hover:bg-neutral-100'
                      : 'text-neutral-300'
              }`}
            >
              {day}
              {hasEvent && !isSelected && (
                <span className="-mt-0.5 h-1 w-1 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
