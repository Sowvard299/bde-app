const TIMEZONE = 'Europe/Paris'

function formatTime(date) {
  const parts = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: TIMEZONE,
  }).formatToParts(date)

  const hour = parts.find((p) => p.type === 'hour').value
  const minute = parts.find((p) => p.type === 'minute').value
  return `${hour}h${minute}`
}

// Un événement enregistré à minuit (heure de Paris) n'a pas encore
// d'horaire annoncé : on affiche la date seule plutôt qu'un « 00h00 »
// qui passerait pour une vraie heure.
export function horaireConnu(isoString) {
  return formatTime(new Date(isoString)) !== '00h00'
}

export function formatEventDateTime(isoString) {
  const date = new Date(isoString)
  const day = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: TIMEZONE,
  }).format(date)

  return horaireConnu(isoString) ? `${day}, ${formatTime(date)}` : day
}

export function formatEventDateShort(isoString) {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: TIMEZONE,
  }).format(date)
}

export function formatEventTime(isoString) {
  return horaireConnu(isoString) ? formatTime(new Date(isoString)) : ''
}

export function getParisDateParts(isoString) {
  const date = new Date(isoString)
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: TIMEZONE,
  }).formatToParts(date)

  const year = Number(parts.find((p) => p.type === 'year').value)
  const month = Number(parts.find((p) => p.type === 'month').value)
  const day = Number(parts.find((p) => p.type === 'day').value)
  return { year, month, day }
}
